import { eq } from 'drizzle-orm'
import { db } from '../../../utils/db'
import { blacklist } from '../../../database/schema'
import { throwBlacklistError } from '../../../utils/blacklist/blacklist'

export default defineEventHandler(async (event): Promise<{ ok: true }> => {
    const id = Number(getRouterParam(event, 'id'))

    if (!Number.isInteger(id) || id <= 0) {
        throw createError({ statusCode: 400, statusMessage: 'Некорректный id' })
    }

    try {
        const deleted = await db
            .delete(blacklist)
            .where(eq(blacklist.id, id))
            .returning({ id: blacklist.id })

        if (deleted.length === 0) {
            throw createError({ statusCode: 404, statusMessage: 'Номер не найден в чёрном списке' })
        }

        return { ok: true }
    } catch (error) {
        throwBlacklistError(error, 'Не удалось разблокировать номер')
    }
})