import { transportationFormSchema } from '../../utils/validation/transportationSchema'
import { parseSimpleDate } from '../../utils/parseScheduledAt'
import { requests, transportationDetails } from '../../database/schema'
import { readValidatedBodyRu } from '../../utils/validation/readValidatedBodyRu'

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

  const departureDate = parseSimpleDate(body.departureDate)
  const [budgetMin, budgetMax] = body.budget

  const result = await db.transaction(async (tx) => {
    const [request] = await tx
        .insert(requests)
        .values({
          type: 'transportation',
          nameOrCompany: body.nameOrCompany,
          phone: body.phone
        })
        .returning({ id: requests.id })

    await tx.insert(transportationDetails).values({
      requestId: request!.id,
      fromCity: body.fromCity,
      toCity: body.toCity,
      departureDate,
      deliveryTerm: body.deliveryTerm || null,
      lengthCm: body.dimensions.length,
      widthCm: body.dimensions.width,
      heightCm: body.dimensions.height,
      weightKg: body.dimensions.weight,
      cargoTypes: body.cargoTypes,
      loadingMethods: body.loadingMethods,
      unloadingMethods: body.unloadingMethods,
      budgetMin,
      budgetMax,
      comment: body.comment || null
    })

    return request!.id
  })

  return { success: true, id: result }
})