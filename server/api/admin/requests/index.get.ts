import { and, asc, desc, eq, sql } from 'drizzle-orm'
import { z } from 'zod'
import { db } from '../../../utils/db'
import {
    requests,
    inspectionDetails,
    washingDetails,
    transportationDetails,
    requestStatusEnum,
    requestTypeEnum
} from '../../../database/schema'
import { autoCompleteExpiredRequests } from '../../../utils/admin/autoCompleteRequests'
import { formatMinskDateTime, isoDateToDdMmYyyy } from '../../../utils/admin/adminRequestHelpers'

const PAGE_SIZE = 10

type RequestStatusValue = (typeof requestStatusEnum.enumValues)[number]
type CoreRow = Pick<typeof requests.$inferSelect, 'id' | 'status' | 'nameOrCompany' | 'phone' | 'createdAt' | 'updatedAt'>

const querySchema = z.object({
    type: z.enum(requestTypeEnum.enumValues),
    status: z.enum(requestStatusEnum.enumValues),
    page: z.coerce.number().int().min(1).default(1)
})

const coreColumns = {
    id: requests.id,
    status: requests.status,
    nameOrCompany: requests.nameOrCompany,
    phone: requests.phone,
    createdAt: requests.createdAt,
    updatedAt: requests.updatedAt
}

function mapCore(row: CoreRow) {
    return {
        id: row.id,
        status: row.status,
        nameOrCompany: row.nameOrCompany,
        phone: row.phone,
        createdAt: row.createdAt.toISOString(),
        updatedAt: row.updatedAt.toISOString()
    }
}

async function loadInspection(status: RequestStatusValue, offset: number) {
    const orderBy = status === 'active'
        ? asc(inspectionDetails.scheduledAt)
        : status === 'completed'
            ? desc(inspectionDetails.scheduledAt)
            : desc(requests.updatedAt)

    const rows = await db
        .select({
            ...coreColumns,
            scheduledAt: inspectionDetails.scheduledAt,
            carBrand: inspectionDetails.carBrand,
            plateNumber: inspectionDetails.plateNumber
        })
        .from(requests)
        .innerJoin(inspectionDetails, eq(inspectionDetails.requestId, requests.id))
        .where(and(eq(requests.type, 'inspection'), eq(requests.status, status)))
        .orderBy(orderBy, desc(requests.id))
        .limit(PAGE_SIZE)
        .offset(offset)

    return rows.map((row) => ({
        ...mapCore(row),
        type: 'inspection' as const,
        ...formatMinskDateTime(row.scheduledAt),
        carBrand: row.carBrand,
        plateNumber: row.plateNumber
    }))
}

async function loadWashing(status: RequestStatusValue, offset: number) {
    const orderBy = status === 'active'
        ? asc(washingDetails.scheduledAt)
        : status === 'completed'
            ? desc(washingDetails.scheduledAt)
            : desc(requests.updatedAt)

    const rows = await db
        .select({
            ...coreColumns,
            scheduledAt: washingDetails.scheduledAt,
            durationMinutes: washingDetails.durationMinutes,
            vehicleType: washingDetails.vehicleType,
            washType: washingDetails.washType
        })
        .from(requests)
        .innerJoin(washingDetails, eq(washingDetails.requestId, requests.id))
        .where(and(eq(requests.type, 'washing'), eq(requests.status, status)))
        .orderBy(orderBy, desc(requests.id))
        .limit(PAGE_SIZE)
        .offset(offset)

    return rows.map((row) => ({
        ...mapCore(row),
        type: 'washing' as const,
        ...formatMinskDateTime(row.scheduledAt),
        durationMinutes: row.durationMinutes,
        vehicleType: row.vehicleType,
        washType: row.washType
    }))
}

async function loadTransportation(status: RequestStatusValue, offset: number) {
    const orderBy = status === 'active'
        ? asc(transportationDetails.departureDate)
        : status === 'completed'
            ? desc(transportationDetails.departureDate)
            : desc(requests.updatedAt)

    const rows = await db
        .select({
            ...coreColumns,
            fromCity: transportationDetails.fromCity,
            toCity: transportationDetails.toCity,
            departureDate: transportationDetails.departureDate,
            deliveryTerm: transportationDetails.deliveryTerm,
            lengthCm: transportationDetails.lengthCm,
            widthCm: transportationDetails.widthCm,
            heightCm: transportationDetails.heightCm,
            weightKg: transportationDetails.weightKg,
            cargoTypes: transportationDetails.cargoTypes,
            loadingMethods: transportationDetails.loadingMethods,
            unloadingMethods: transportationDetails.unloadingMethods,
            budgetMin: transportationDetails.budgetMin,
            budgetMax: transportationDetails.budgetMax,
            comment: transportationDetails.comment
        })
        .from(requests)
        .innerJoin(transportationDetails, eq(transportationDetails.requestId, requests.id))
        .where(and(eq(requests.type, 'transportation'), eq(requests.status, status)))
        .orderBy(orderBy, desc(requests.id))
        .limit(PAGE_SIZE)
        .offset(offset)

    return rows.map((row) => ({
        ...mapCore(row),
        type: 'transportation' as const,
        fromCity: row.fromCity,
        toCity: row.toCity,
        departureDate: isoDateToDdMmYyyy(row.departureDate),
        deliveryTerm: row.deliveryTerm ?? '',
        dimensions: {
            length: row.lengthCm,
            width: row.widthCm,
            height: row.heightCm,
            weight: row.weightKg
        },
        cargoTypes: row.cargoTypes,
        loadingMethods: row.loadingMethods,
        unloadingMethods: row.unloadingMethods,
        budgetMin: row.budgetMin,
        budgetMax: row.budgetMax,
        comment: row.comment ?? ''
    }))
}

export default defineEventHandler(async (event) => {
    const parsed = querySchema.safeParse(getQuery(event))
    if (!parsed.success) {
        throw createError({ statusCode: 400, statusMessage: 'Некорректные параметры запроса' })
    }

    const { type, status } = parsed.data

    await autoCompleteExpiredRequests()

    const countRows = await db
        .select({ status: requests.status, total: sql<number>`count(*)::int` })
        .from(requests)
        .where(eq(requests.type, type))
        .groupBy(requests.status)

    const counts: Record<RequestStatusValue, number> = { active: 0, completed: 0, cancelled: 0 }
    for (const row of countRows) counts[row.status] = row.total

    const totalPages = Math.max(1, Math.ceil(counts[status] / PAGE_SIZE))
    const page = Math.min(parsed.data.page, totalPages)
    const offset = (page - 1) * PAGE_SIZE

    const items = type === 'inspection'
        ? await loadInspection(status, offset)
        : type === 'washing'
            ? await loadWashing(status, offset)
            : await loadTransportation(status, offset)

    return { items, counts, totalPages, page }
})