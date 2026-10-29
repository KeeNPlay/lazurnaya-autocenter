import { eq, and, gte, lte } from 'drizzle-orm'
import { washingDetails } from '../../database/schema'

export default defineEventHandler(async (event) => {
    const ip = getRequestIP(event, { xForwardedFor: true }) ?? 'unknown'
    if (!checkRateLimit(`busy-slots:washing:${ip}`, 30, 60 * 1000)) {
        throw createError({ statusCode: 429, statusMessage: 'Слишком много запросов. Попробуйте через минуту.' })
    }

    const now = new Date()
    const to = new Date()
    to.setMonth(to.getMonth() + 6)

    const rows = await db
        .select({
            scheduledAt: washingDetails.scheduledAt,
            durationMinutes: washingDetails.durationMinutes
        })
        .from(washingDetails)
        .where(
            and(
                eq(washingDetails.status, 'active'),
                gte(washingDetails.scheduledAt, now),
                lte(washingDetails.scheduledAt, to)
            )
        )

    return rows.map((r) => ({
        scheduledAt: r.scheduledAt.toISOString(),
        durationMinutes: r.durationMinutes
    }))
})