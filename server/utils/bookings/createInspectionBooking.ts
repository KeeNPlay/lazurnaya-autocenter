import { parseScheduledAt } from '../parseScheduledAt'
import { isUniqueViolation } from '../isUniqueViolation'
import { requests, inspectionDetails } from '../../database/schema'
import type { InspectionBookingInput } from '../validation/inspectionSchema'

// A single point for creating request for inspection
export async function createInspectionBooking(input: InspectionBookingInput): Promise<number> {
    const scheduledAt = parseScheduledAt(input.date, input.time)

    if (scheduledAt.getTime() < Date.now()) {
        throw createError({ statusCode: 400, statusMessage: 'Нельзя записаться на прошедшую дату' })
    }
    if (isMinskWeekend(scheduledAt)) {
        throw createError({ statusCode: 400, statusMessage: 'Запись на выходные невозможна' })
    }
    if (!isValidInspectionTime(input.time)) {
        throw createError({ statusCode: 400, statusMessage: 'Выбранное время недоступно для записи' })
    }

    try {
        return await db.transaction(async (tx) => {
            const [request] = await tx
                .insert(requests)
                .values({
                    type: 'inspection',
                    nameOrCompany: input.nameOrCompany,
                    phone: input.phone
                })
                .returning({ id: requests.id })

            await tx.insert(inspectionDetails).values({
                requestId: request!.id,
                scheduledAt,
                carBrand: input.carBrand,
                plateNumber: input.plateNumber
            })

            return request!.id
        })
    } catch (error) {
        if (isUniqueViolation(error)) {
            throw createError({ statusCode: 409, statusMessage: 'Это время уже занято. Выберите другое.' })
        }
        throw error
    }
}