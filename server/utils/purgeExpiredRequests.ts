import { and, inArray, lte, or } from 'drizzle-orm'
import {
    inspectionDetails,
    requests,
    transportationDetails,
    washingDetails
} from '../database/schema'

const MINSK_OFFSET_MS = 3 * 60 * 60 * 1000

// year ago for scheduled_at
function getTimestampCutoff(now: Date): Date {
    const cutoff = new Date(now)
    cutoff.setUTCFullYear(cutoff.getUTCFullYear() - 1)
    return cutoff
}

// YYYY-MM-DD for departure_date
function getDateCutoff(now: Date): string {
    const cutoff = new Date(now.getTime() + MINSK_OFFSET_MS)
    cutoff.setUTCFullYear(cutoff.getUTCFullYear() - 1)
    return cutoff.toISOString().slice(0, 10)
}

/**
 * Physically deletes completed and cancelled requests that are one year old.
 * The age is calculated based on the record date: `scheduled_at` for inspections and washes,
 * and `departure_date` for freight shipments. Active requests are not affected.
 * Related records are deleted via a cascade; sequence IDs are not reset.
 */
export async function purgeExpiredRequests(): Promise<number> {
    const now = new Date()
    const timestampCutoff = getTimestampCutoff(now)
    const dateCutoff = getDateCutoff(now)

    const deleted = await db
        .delete(requests)
        .where(
            and(
                inArray(requests.status, ['completed', 'cancelled']),
                or(
                    inArray(
                        requests.id,
                        db
                            .select({ id: inspectionDetails.requestId })
                            .from(inspectionDetails)
                            .where(lte(inspectionDetails.scheduledAt, timestampCutoff))
                    ),
                    inArray(
                        requests.id,
                        db
                            .select({ id: washingDetails.requestId })
                            .from(washingDetails)
                            .where(lte(washingDetails.scheduledAt, timestampCutoff))
                    ),
                    inArray(
                        requests.id,
                        db
                            .select({ id: transportationDetails.requestId })
                            .from(transportationDetails)
                            .where(lte(transportationDetails.departureDate, dateCutoff))
                    )
                )
            )
        )
        .returning({ id: requests.id })

    return deleted.length
}