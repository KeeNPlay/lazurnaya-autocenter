import {
    BLACKLIST_BLOCKED_MESSAGE,
    isPhoneBlacklisted,
    normalizeBlacklistPhone,
    throwBlacklistError
} from '../utils/blacklist/blacklist'

// Blocks sending of any public form containing a number from the blacklist
export default defineEventHandler(async (event) => {
    if (event.method !== 'POST') return
    if (!getRequestURL(event).pathname.startsWith('/api/forms/')) return

    let body: unknown
    try {
        body = await readBody(event)
    } catch {
        return
    }

    const phone = normalizeBlacklistPhone((body as { phone?: unknown } | null)?.phone)
    if (!phone) return

    let blocked = false
    try {
        blocked = await isPhoneBlacklisted(phone)
    } catch (error) {
        throwBlacklistError(error, 'Не удалось отправить заявку. Попробуйте позже.')
    }

    if (blocked) {
        throw createError({ statusCode: 403, statusMessage: BLACKLIST_BLOCKED_MESSAGE })
    }
})