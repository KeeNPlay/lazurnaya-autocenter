import { washingBookingSchema } from '../../../utils/validation/washingSchema'
import { readValidatedBodyRu } from '../../../utils/validation/readValidatedBodyRu'
import { createWashingBooking } from '../../../utils/bookings/createWashingBooking'

export default defineEventHandler(async (event) => {
    const body = await readValidatedBodyRu(event, washingBookingSchema)
    const id = await createWashingBooking(body)

    return { success: true, id }
})