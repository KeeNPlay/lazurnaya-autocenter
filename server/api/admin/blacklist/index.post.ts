import { db } from '../../../utils/db'
import { blacklist } from '../../../database/schema'
import {
    getBlacklistExpiresAt,
    normalizeBlacklistPhone,
    purgeExpiredBlacklist,
    throwBlacklistError,
    toBlacklistEntry
} from '../../../utils/blacklist/blacklist'
import { BLACKLIST_REASON_MAX_LENGTH } from '../../../../shared/utils/blacklist'
import type { BlacklistEntry } from '../../../../shared/utils/blacklist'

export default defineEventHandler(async (event): Promise<BlacklistEntry> => {
    const body = await readBody<{ phone?: unknown; reason?: unknown } | null>(event).catch(() => null)

    const phone = normalizeBlacklistPhone(body?.phone)
    if (!phone) {
        throw createError({ statusCode: 400, statusMessage: 'Введите корректный номер телефона' })
    }

    let reason: string | null = null
    if (body?.reason !== undefined && body.reason !== null) {
        if (typeof body.reason !== 'string') {
            throw createError({ statusCode: 400, statusMessage: 'Некорректная причина' })
        }

        const trimmed = body.reason.trim()
        if (trimmed.length > BLACKLIST_REASON_MAX_LENGTH) {
            throw createError({
                statusCode: 400,
                statusMessage: `Причина не должна быть длиннее ${BLACKLIST_REASON_MAX_LENGTH} символов`
            })
        }

        reason = trimmed || null
    }

    try {
        // An expired record with the same number should not prevent it from being added again
        await purgeExpiredBlacklist()

        const now = new Date()
        const inserted = await db
            .insert(blacklist)
            .values({ phone, reason, createdAt: now, expiresAt: getBlacklistExpiresAt(now) })
            .onConflictDoNothing({ target: blacklist.phone })
            .returning()

        const row = inserted[0]
        if (!row) {
            throw createError({ statusCode: 409, statusMessage: 'Этот номер уже в чёрном списке' })
        }

        setResponseStatus(event, 201)
        return toBlacklistEntry(row)
    } catch (error) {
        throwBlacklistError(error, 'Не удалось добавить номер в чёрный список')
    }
})