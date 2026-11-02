import { transportationBookingSchema } from '../../../utils/validation/transportationSchema'
import { readValidatedBodyRu } from '../../../utils/validation/readValidatedBodyRu'
import { createTransportationBooking } from '../../../utils/bookings/createTransportationBooking'

export default defineEventHandler(async (event) => {
    const body = await readValidatedBodyRu(event, transportationBookingSchema)
    const id = await createTransportationBooking(body)

    return { success: true, id }
})