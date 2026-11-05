import { count, desc, gt } from 'drizzle-orm'
import { db } from '../../../utils/db'
import { blacklist } from '../../../database/schema'
import { purgeExpiredBlacklist, throwBlacklistError, toBlacklistEntry } from '../../../utils/blacklist/blacklist'
import { BLACKLIST_PAGE_SIZE } from '../../../../shared/utils/blacklist'
import type { BlacklistResponse } from '../../../../shared/utils/blacklist'

export default defineEventHandler(async (event): Promise<BlacklistResponse> => {
    const query = getQuery(event)
    const requestedPage = Math.max(1, Number.parseInt(String(query.page ?? '1'), 10) || 1)

    try {
        await purgeExpiredBlacklist()

        const now = new Date()

        const countRows = await db
            .select({ value: count() })
            .from(blacklist)
            .where(gt(blacklist.expiresAt, now))

        const total = countRows[0]?.value ?? 0
        const totalPages = Math.max(1, Math.ceil(total / BLACKLIST_PAGE_SIZE))
        const page = Math.min(requestedPage, totalPages)

        const rows = await db
            .select()
            .from(blacklist)
            .where(gt(blacklist.expiresAt, now))
            .orderBy(desc(blacklist.createdAt), desc(blacklist.id))
            .limit(BLACKLIST_PAGE_SIZE)
            .offset((page - 1) * BLACKLIST_PAGE_SIZE)

        return { items: rows.map(toBlacklistEntry), total, page, totalPages }
    } catch (error) {
        throwBlacklistError(error, 'Не удалось загрузить чёрный список')
    }
})