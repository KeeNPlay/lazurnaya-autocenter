import { washingFormSchema } from '../../utils/validation/washingSchema'
import { readValidatedBodyRu } from '../../utils/validation/readValidatedBodyRu'
import { createWashingBooking } from '../../utils/bookings/createWashingBooking'

export default defineEventHandler(async (event) => {

  // 1. Rate limit
  const ip = getRequestIP(event, { xForwardedFor: true }) ?? 'unknown'
  if (!checkRateLimit(`form-washing:${ip}`, 5, 10 * 60 * 1000)) {
    throw createError({ statusCode: 429, statusMessage: 'Слишком много заявок. Попробуйте позже.' })
  }

  // 2. Validation
  const body = await readValidatedBodyRu(event, washingFormSchema)

  // 3. Verify Captcha
  await verifyTurnstile(body.captchaToken, event)

  // 4. Business rules + insert (shared with admin panel)
  const id = await createWashingBooking(body)

  return { success: true, id }
})