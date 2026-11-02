import { and, eq, gte, lte, sql } from 'drizzle-orm'
import { parseScheduledAt, parseSimpleDate } from '../parseScheduledAt'
import { requests, washingDetails } from '../../database/schema'
import type { WashingBookingInput } from '../validation/washingSchema'

// A single point for creating request for washing
export async function createWashingBooking(input: WashingBookingInput): Promise<number> {
    const scheduledAt = parseScheduledAt(input.date, input.time)

    if (scheduledAt.getTime() < Date.now()) {
        throw createError({ statusCode: 400, statusMessage: 'Нельзя записаться на прошедшую дату' })
    }
    if (isMinskWeekend(scheduledAt)) {
        throw createError({ statusCode: 400, statusMessage: 'Запись на выходные невозможна' })
    }
    if (!isValidWashingStartTime(input.time)) {
        throw createError({ statusCode: 400, statusMessage: 'Выбранное время недоступно для записи' })
    }

    const durationMinutes = getWashingDurationMinutes(input.washType, input.vehicleType)
    if (!durationMinutes) {
        throw createError({ statusCode: 400, statusMessage: 'Этот тип мойки недоступен для выбранного транспорта' })
    }

    const startMinutes = timeStrToMinutes(input.time)
    const closingMinutes = timeStrToMinutes(WASHING_CLOSING_TIME)

    if (startMinutes + durationMinutes > closingMinutes) {
        throw createError({ statusCode: 400, statusMessage: 'Выбранное время выходит за пределы рабочего дня мойки' })
    }

    const endAt = new Date(scheduledAt.getTime() + durationMinutes * 60 * 1000)

    const isoDate = parseSimpleDate(input.date)
    const dayStart = new Date(`${isoDate}T00:00:00+03:00`)
    const dayEnd = new Date(`${isoDate}T23:59:59.999+03:00`)

    return db.transaction(async (tx) => {
        await tx.execute(sql`SELECT pg_advisory_xact_lock(872346, hashtext(${isoDate}))`)

        const existingBookings = await tx
            .select({
                scheduledAt: washingDetails.scheduledAt,
                durationMinutes: washingDetails.durationMinutes
            })
            .from(washingDetails)
            .where(
                and(
                    eq(washingDetails.status, 'active'),
                    gte(washingDetails.scheduledAt, dayStart),
                    lte(washingDetails.scheduledAt, dayEnd)
                )
            )

        const hasOverlap = existingBookings.some((booking) => {
            const bookingEnd = new Date(booking.scheduledAt.getTime() + booking.durationMinutes * 60 * 1000)
            return scheduledAt < bookingEnd && endAt > booking.scheduledAt
        })

        if (hasOverlap) {
            throw createError({ statusCode: 409, statusMessage: 'Это время уже занято. Выберите другое.' })
        }

        const [request] = await tx
            .insert(requests)
            .values({
                type: 'washing',
                nameOrCompany: input.nameOrCompany,
                phone: input.phone
            })
            .returning({ id: requests.id })

        await tx.insert(washingDetails).values({
            requestId: request!.id,
            scheduledAt,
            durationMinutes,
            vehicleType: input.vehicleType,
            washType: input.washType
        })

        return request!.id
    })
}