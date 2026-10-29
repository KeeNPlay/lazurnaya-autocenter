import { and, eq, gte, lte } from 'drizzle-orm'
import { sql } from 'drizzle-orm'
import { washingFormSchema } from '../../utils/validation/washingSchema'
import { parseScheduledAt, parseSimpleDate } from '../../utils/parseScheduledAt'
import { requests, washingDetails } from '../../database/schema'

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

  // 4. Date/Time parsing
  const scheduledAt = parseScheduledAt(body.date, body.time)

  if (scheduledAt.getTime() < Date.now()) {
    throw createError({ statusCode: 400, statusMessage: 'Нельзя записаться на прошедшую дату' })
  }

  // 5. Duration lookup
  const durationMinutes = getWashingDurationMinutes(body.washType, body.vehicleType)
  if (!durationMinutes) {
    throw createError({ statusCode: 400, statusMessage: 'Этот тип мойки недоступен для выбранного транспорта' })
  }

  // 6. Working hours check (closing at 16:00)
  const startMinutes = timeStrToMinutes(body.time)
  const endMinutes = startMinutes + durationMinutes
  const closingMinutes = timeStrToMinutes(WASHING_CLOSING_TIME)

  if (endMinutes > closingMinutes) {
    throw createError({ statusCode: 400, statusMessage: 'Выбранное время выходит за пределы рабочего дня мойки' })
  }

  const endAt = new Date(scheduledAt.getTime() + durationMinutes * 60 * 1000)

  const isoDate = parseSimpleDate(body.date)
  const dayStart = new Date(`${isoDate}T00:00:00+03:00`)
  const dayEnd = new Date(`${isoDate}T23:59:59.999+03:00`)

  // 7. Transaction with advisory lock: serialize all bookings for the same day
  //    to safely check overlapping intervals without a race condition
  const result = await db.transaction(async (tx) => {
    await tx.execute(sql`SELECT pg_advisory_xact_lock(872346, hashtext(${isoDate}))`)

    const existingBookings = await tx
        .select({
          scheduledAt: washingDetails.scheduledAt,
          durationMinutes: washingDetails.durationMinutes
        })
        .from(washingDetails)
        .where(
            and(
                eq(washingDetails.status, 'active'),
                gte(washingDetails.scheduledAt, dayStart),
                lte(washingDetails.scheduledAt, dayEnd)
            )
        )

    const hasOverlap = existingBookings.some((booking) => {
      const bookingEnd = new Date(booking.scheduledAt.getTime() + booking.durationMinutes * 60 * 1000)
      return scheduledAt < bookingEnd && endAt > booking.scheduledAt
    })

    if (hasOverlap) {
      throw createError({ statusCode: 409, statusMessage: 'Это время уже занято. Выберите другое.' })
    }

    const [request] = await tx
        .insert(requests)
        .values({
          type: 'washing',
          nameOrCompany: body.nameOrCompany,
          phone: body.phone
        })
        .returning({ id: requests.id })

    await tx.insert(washingDetails).values({
      requestId: request!.id,
      scheduledAt,
      durationMinutes,
      vehicleType: body.vehicleType,
      washType: body.washType
    })

    return request!.id
  })

  return { success: true, id: result }
})