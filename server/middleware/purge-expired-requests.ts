import { purgeExpiredRequests } from '../utils/purgeExpiredRequests'

// How often to perform background database cleanup during regular requests (per server instance)
const BACKGROUND_INTERVAL_MS = 60 * 60 * 1000

let lastBackgroundRun = 0
let running: Promise<void> | null = null

// Never throws an error: a cleanup failure should not break the API response.
// Concurrent calls share the same cleanup process.
function runPurge(): Promise<void> {
    if (running) return running

    running = purgeExpiredRequests()
        .then((count) => {
            if (count > 0) console.info(`[purgeExpiredRequests] удалено заявок: ${count}`)
        })
        .catch((error: unknown) => {
            console.error('[purgeExpiredRequests] не удалось удалить старые заявки:', error)
        })
        .finally(() => {
            running = null
        })

    return running
}

export default defineEventHandler(async (event) => {
    const { pathname } = getRequestURL(event)

    if (!pathname.startsWith('/api/')) return

    // List of requests in the admin panel: clear them before retrieval so that old requests are not displayed and do not affect the counters. A request without a session will be rejected by the admin-auth middleware, which runs earlier.
    if (event.method === 'GET' && pathname.replace(/\/$/, '') === '/api/admin/requests') {
        await runPurge()
        return
    }

    // Other requests: background cleanup, at most once per hour, without waiting
    const now = Date.now()
    if (now - lastBackgroundRun < BACKGROUND_INTERVAL_MS) return

    lastBackgroundRun = now
    void runPurge()
})