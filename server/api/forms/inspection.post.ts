import { inspectionFormSchema } from '../../utils/validation/inspectionSchema'
import { readValidatedBodyRu } from '../../utils/validation/readValidatedBodyRu'
import { createInspectionBooking } from '../../utils/bookings/createInspectionBooking'

export default defineEventHandler(async (event) => {

  // 1. Rate limit
  const ip = getRequestIP(event, { xForwardedFor: true }) ?? 'unknown'
  if (!checkRateLimit(`form-inspection:${ip}`, 5, 10 * 60 * 1000)) {
    throw createError({ statusCode: 429, statusMessage: 'Слишком много заявок. Попробуйте позже.' })
  }

  // 2. Validation
  const body = await readValidatedBodyRu(event, inspectionFormSchema)

  // 3. Verify Captcha
  await verifyTurnstile(body.captchaToken, event)

  // 4. Business rules + insert (shared with admin panel)
  const id = await createInspectionBooking(body)

  return { success: true, id }
})