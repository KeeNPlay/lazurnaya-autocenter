import { parseSimpleDate } from '../parseScheduledAt'
import { requests, transportationDetails } from '../../database/schema'
import type { TransportationBookingInput } from '../validation/transportationSchema'

// Single entry point for creating an international transportation request (public form and admin panel).
export async function createTransportationBooking(input: TransportationBookingInput): Promise<number> {
    const departureDate = parseSimpleDate(input.departureDate)
    const [budgetMin, budgetMax] = input.budget

    try {
        return await db.transaction(async (tx) => {
            const [request] = await tx
                .insert(requests)
                .values({
                    type: 'transportation',
                    nameOrCompany: input.nameOrCompany,
                    phone: input.phone
                })
                .returning({ id: requests.id })

            await tx.insert(transportationDetails).values({
                requestId: request!.id,
                fromCity: input.fromCity,
                toCity: input.toCity,
                departureDate,
                deliveryTerm: input.deliveryTerm || null,
                lengthCm: input.dimensions.length,
                widthCm: input.dimensions.width,
                heightCm: input.dimensions.height,
                weightKg: input.dimensions.weight,
                cargoTypes: input.cargoTypes,
                loadingMethods: input.loadingMethods,
                unloadingMethods: input.unloadingMethods,
                budgetMin,
                budgetMax,
                comment: input.comment || null
            })

            return request!.id
        })
    } catch (error) {
        // The real cause (including the PostgreSQL error in `cause`) goes to the server log
        console.error('[createTransportationBooking] insert failed:', error)
        throw createError({ statusCode: 500, statusMessage: 'Не удалось сохранить заявку. Попробуйте позже.' })
    }
}