import type { H3Event } from 'h3'
import { and, eq, gte, lte, ne, sql } from 'drizzle-orm'
import { db } from '../../../utils/db'
import { requests, inspectionDetails, washingDetails } from '../../../database/schema'
import { parseRequestId } from '../../../utils/admin/adminRequestHelpers'
import { parseScheduledAt, parseSimpleDate } from '../../../utils/parseScheduledAt'
import { isUniqueViolation } from '../../../utils/isUniqueViolation'
import { readValidatedBodyRu } from '../../../utils/validation/readValidatedBodyRu'
import {
    adminInspectionUpdateSchema,
    adminWashingUpdateSchema
} from '../../../utils/validation/adminRequestSchemas'

const CLOSED_MESSAGE = 'Заявка уже закрыта или отменена. Обновите список.'
const SLOT_BUSY_MESSAGE = 'Это время уже занято. Выберите другое.'

function assertNotPastOrWeekend(scheduledAt: Date): void {
    if (scheduledAt.getTime() < Date.now()) {
        throw createError({ statusCode: 400, statusMessage: 'Нельзя записать на прошедшее время' })
    }
    if (isMinskWeekend(scheduledAt)) {
        throw createError({ statusCode: 400, statusMessage: 'Запись на выходные невозможна' })
    }
}

async function updateInspection(event: H3Event, id: number): Promise<void> {
    const body = await readValidatedBodyRu(event, adminInspectionUpdateSchema)
    const scheduledAt = parseScheduledAt(body.date, body.time)

    const [current] = await db
        .select({ scheduledAt: inspectionDetails.scheduledAt })
        .from(inspectionDetails)
        .where(eq(inspectionDetails.requestId, id))
        .limit(1)

    if (!current) {
        throw createError({ statusCode: 404, statusMessage: 'Заявка не найдена' })
    }

    if (scheduledAt.getTime() !== current.scheduledAt.getTime()) {
        assertNotPastOrWeekend(scheduledAt)

        if (!isValidInspectionTime(body.time)) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Время вне рабочих часов гостехосмотра или приходится на обед'
            })
        }
    }

    try {
        await db.transaction(async (tx) => {
            const [updated] = await tx
                .update(requests)
                .set({ nameOrCompany: body.nameOrCompany, phone: body.phone, updatedAt: new Date() })
                .where(and(eq(requests.id, id), eq(requests.status, 'active')))
                .returning({ id: requests.id })

            if (!updated) {
                throw createError({ statusCode: 409, statusMessage: CLOSED_MESSAGE })
            }

            await tx
                .update(inspectionDetails)
                .set({ scheduledAt, carBrand: body.carBrand, plateNumber: body.plateNumber })
                .where(eq(inspectionDetails.requestId, id))
        })
    } catch (error) {
        if (isUniqueViolation(error)) {
            throw createError({ statusCode: 409, statusMessage: SLOT_BUSY_MESSAGE })
        }
        throw error
    }
}

async function updateWashing(event: H3Event, id: number): Promise<void> {
    const body = await readValidatedBodyRu(event, adminWashingUpdateSchema)

    const durationMinutes = getWashingDurationMinutes(body.washType, body.vehicleType)
    if (!durationMinutes) {
        throw createError({ statusCode: 400, statusMessage: 'Этот тип мойки недоступен для выбранного транспорта' })
    }

    const scheduledAt = parseScheduledAt(body.date, body.time)

    const [current] = await db
        .select({
            scheduledAt: washingDetails.scheduledAt,
            durationMinutes: washingDetails.durationMinutes
        })
        .from(washingDetails)
        .where(eq(washingDetails.requestId, id))
        .limit(1)

    if (!current) {
        throw createError({ statusCode: 404, statusMessage: 'Заявка не найдена' })
    }

    const scheduleChanged =
        scheduledAt.getTime() !== current.scheduledAt.getTime() ||
        durationMinutes !== current.durationMinutes

    if (scheduleChanged) {
        assertNotPastOrWeekend(scheduledAt)

        if (!isValidWashingStartTime(body.time)) {
            throw createError({ statusCode: 400, statusMessage: 'Время вне рабочих часов мойки' })
        }

        const endMinutes = timeStrToMinutes(body.time) + durationMinutes
        if (endMinutes > timeStrToMinutes(WASHING_CLOSING_TIME)) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Выбранное время выходит за пределы рабочего дня мойки'
            })
        }
    }

    const endAt = new Date(scheduledAt.getTime() + durationMinutes * 60 * 1000)
    const isoDate = parseSimpleDate(body.date)
    const dayStart = new Date(`${isoDate}T00:00:00+03:00`)
    const dayEnd = new Date(`${isoDate}T23:59:59.999+03:00`)

    await db.transaction(async (tx) => {
        if (scheduleChanged) {
            await tx.execute(sql`SELECT pg_advisory_xact_lock(872346, hashtext(${isoDate}))`)

            const existingBookings = await tx
                .select({
                    scheduledAt: washingDetails.scheduledAt,
                    durationMinutes: washingDetails.durationMinutes
                })
                .from(washingDetails)
                .where(and(
                    eq(washingDetails.status, 'active'),
                    ne(washingDetails.requestId, id),
                    gte(washingDetails.scheduledAt, dayStart),
                    lte(washingDetails.scheduledAt, dayEnd)
                ))

            const hasOverlap = existingBookings.some((booking) => {
                const bookingEnd = new Date(booking.scheduledAt.getTime() + booking.durationMinutes * 60 * 1000)
                return scheduledAt < bookingEnd && endAt > booking.scheduledAt
            })

            if (hasOverlap) {
                throw createError({ statusCode: 409, statusMessage: SLOT_BUSY_MESSAGE })
            }
        }

        const [updated] = await tx
            .update(requests)
            .set({ nameOrCompany: body.nameOrCompany, phone: body.phone, updatedAt: new Date() })
            .where(and(eq(requests.id, id), eq(requests.status, 'active')))
            .returning({ id: requests.id })

        if (!updated) {
            throw createError({ statusCode: 409, statusMessage: CLOSED_MESSAGE })
        }

        await tx
            .update(washingDetails)
            .set({
                scheduledAt,
                durationMinutes,
                vehicleType: body.vehicleType,
                washType: body.washType
            })
            .where(eq(washingDetails.requestId, id))
    })
}

export default defineEventHandler(async (event) => {
    const id = parseRequestId(event)

    const [existing] = await db
        .select({ type: requests.type, status: requests.status })
        .from(requests)
        .where(eq(requests.id, id))
        .limit(1)

    if (!existing) {
        throw createError({ statusCode: 404, statusMessage: 'Заявка не найдена' })
    }
    if (existing.type === 'transportation') {
        throw createError({ statusCode: 400, statusMessage: 'Заявки на грузоперевозку не редактируются' })
    }
    if (existing.status !== 'active') {
        throw createError({ statusCode: 409, statusMessage: CLOSED_MESSAGE })
    }

    if (existing.type === 'inspection') {
        await updateInspection(event, id)
    } else {
        await updateWashing(event, id)
    }

    return { success: true }
})