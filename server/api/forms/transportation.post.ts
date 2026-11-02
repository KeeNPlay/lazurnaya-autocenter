import { transportationFormSchema } from '../../utils/validation/transportationSchema'
import { readValidatedBodyRu } from '../../utils/validation/readValidatedBodyRu'
import { createTransportationBooking } from '../../utils/bookings/createTransportationBooking'

export default defineEventHandler(async (event) => {

  // 1. Rate limit
  const ip = getRequestIP(event, { xForwardedFor: true }) ?? 'unknown'
  if (!checkRateLimit(`form-transportation:${ip}`, 5, 10 * 60 * 1000)) {
    throw createError({ statusCode: 429, statusMessage: 'Слишком много заявок. Попробуйте позже.' })
  }

  // 2. Validation
  const body = await readValidatedBodyRu(event, transportationFormSchema)

  // 3. Verify Captcha
  await verifyTurnstile(body.captchaToken, event)

  // 4. Insert (shared with admin panel)
  const id = await createTransportationBooking(body)

  return { success: true, id }
})