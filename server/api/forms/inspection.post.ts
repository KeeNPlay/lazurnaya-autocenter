import { inspectionFormSchema } from '../../utils/validation/inspectionSchema'
import { parseScheduledAt } from '../../utils/parseScheduledAt'
import { isUniqueViolation } from '../../utils/isUniqueViolation'
import { requests, inspectionDetails } from '../../database/schema'
import {readValidatedBodyRu} from "../../utils/validation/readValidatedBodyRu";

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

  // 4. Date/Time parsing
  const scheduledAt = parseScheduledAt(body.date, body.time)

  if (scheduledAt.getTime() < Date.now()) {
    throw createError({ statusCode: 400, statusMessage: 'Нельзя записаться на прошедшую дату' })
  }

  // 5. Transaction: create request + details atomically
  try {
    const result = await db.transaction(async (tx) => {
      const [request] = await tx
          .insert(requests)
          .values({
            type: 'inspection',
            nameOrCompany: body.nameOrCompany,
            phone: body.phone
          })
          .returning({ id: requests.id })

      await tx.insert(inspectionDetails).values({
        requestId: request!.id,
        scheduledAt,
        carBrand: body.carBrand,
        plateNumber: body.plateNumber
      })

      return request!.id
    })

    return { success: true, id: result }
  } catch (error) {
    if (isUniqueViolation(error)) {
      throw createError({ statusCode: 409, statusMessage: 'Это время уже занято. Выберите другое.' })
    }
    throw error
  }
})