import { sql } from 'drizzle-orm'
import { db } from '../../utils/db'

const MINSK_OFFSET_MS = 3 * 60 * 60 * 1000 // UTC+3 (Europe/Minsk)
const DAY_MS = 24 * 60 * 60 * 1000

// Break, that shows on the board
const BREAK_FROM = '13:00'
const BREAK_TO = '13:30'

interface IBoardRow {
    id: number | string
    scheduled_ms: number | string
    plate: string
}

// Public inspection board
export default defineEventHandler(async (event) => {
    setHeader(event, 'Cache-Control', 'no-store')

    const now = Date.now()
    const minskDayStart = Math.floor((now + MINSK_OFFSET_MS) / DAY_MS) * DAY_MS - MINSK_OFFSET_MS

    const from = new Date(minskDayStart).toISOString()
    const to = new Date(minskDayStart + DAY_MS).toISOString()

    let rows: IBoardRow[]

    try {
        rows = (await db.execute(sql`
      SELECT
        i.request_id AS id,
        (extract(epoch FROM i.scheduled_at) * 1000)::bigint AS scheduled_ms,
        i.plate_number AS plate
      FROM inspection_details i
      JOIN requests r ON r.id = i.request_id
      WHERE r.status <> 'cancelled'
        AND i.status <> 'cancelled'
        AND i.scheduled_at >= ${from}::timestamptz
        AND i.scheduled_at < ${to}::timestamptz
      ORDER BY i.scheduled_at ASC
    `)) as unknown as IBoardRow[]
    } catch (error) {
        console.error('[board] Не удалось получить очередь:', error)
        throw createError({ statusCode: 500, statusMessage: 'Не удалось получить очередь на техосмотр' })
    }

    return {
        now,
        activeMinutes: INSPECTION_AUTO_COMPLETE_MINUTES,
        breakFrom: BREAK_FROM,
        breakTo: BREAK_TO,
        records: rows.map((row) => ({
            id: Number(row.id),
            at: Number(row.scheduled_ms),
            plate: String(row.plate).trim().toUpperCase()
        }))
    }
})