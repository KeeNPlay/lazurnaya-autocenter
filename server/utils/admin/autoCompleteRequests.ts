import { sql } from 'drizzle-orm'
import { db } from '../db'

/**
 * Inspection: scheduled_at + INSPECTION_AUTO_COMPLETE_MINUTES.
 * Washing: scheduled_at + duration_minutes
 * Вызывается перед каждым чтением списка — cron не нужен.
 */
export async function autoCompleteExpiredRequests(): Promise<void> {
    const inspectionMinutes = sql.raw(String(INSPECTION_AUTO_COMPLETE_MINUTES))

    await db.execute(sql`
    WITH completed AS (
      UPDATE inspection_details
      SET status = 'completed'
      WHERE status = 'active'
        AND scheduled_at + (${inspectionMinutes} * interval '1 minute') <= now()
      RETURNING request_id
    )
    UPDATE requests
    SET status = 'completed', updated_at = now()
    WHERE status = 'active' AND id IN (SELECT request_id FROM completed)
  `)

    await db.execute(sql`
    WITH completed AS (
      UPDATE washing_details
      SET status = 'completed'
      WHERE status = 'active'
        AND scheduled_at + (duration_minutes * interval '1 minute') <= now()
      RETURNING request_id
    )
    UPDATE requests
    SET status = 'completed', updated_at = now()
    WHERE status = 'active' AND id IN (SELECT request_id FROM completed)
  `)
}