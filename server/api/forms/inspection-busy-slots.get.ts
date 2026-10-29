import { eq, and, gte, lte } from 'drizzle-orm'
import { inspectionDetails } from '../../database/schema'

export default defineEventHandler(async (event) => {
    const ip = getRequestIP(event, { xForwardedFor: true }) ?? 'unknown'
    if (!checkRateLimit(`busy-slots:inspection:${ip}`, 30, 60 * 1000)) {
        throw createError({ statusCode: 429, statusMessage: 'Слишком много запросов' })
    }

    const now = new Date()
    const to = new Date()
    to.setMonth(to.getMonth() + 6)

    const rows = await db
        .select({ scheduledAt: inspectionDetails.scheduledAt })
        .from(inspectionDetails)
        .where(
            and(
                eq(inspectionDetails.status, 'active'),
                gte(inspectionDetails.scheduledAt, now),
                lte(inspectionDetails.scheduledAt, to)
            )
        )

    return rows.map((r) => r.scheduledAt.toISOString())
})