import { inspectionBookingSchema } from '../../../utils/validation/inspectionSchema'
import { readValidatedBodyRu } from '../../../utils/validation/readValidatedBodyRu'
import { createInspectionBooking } from '../../../utils/bookings/createInspectionBooking'

export default defineEventHandler(async (event) => {
    const body = await readValidatedBodyRu(event, inspectionBookingSchema)
    const id = await createInspectionBooking(body)

    return { success: true, id }
})