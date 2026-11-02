import { and, eq } from 'drizzle-orm'
import { z } from 'zod'
import { db } from '../../../../utils/db'
import { requests, inspectionDetails, washingDetails } from '../../../../database/schema'
import { parseRequestId } from '../../../../utils/admin/adminRequestHelpers'
import { readValidatedBodyRu } from '../../../../utils/validation/readValidatedBodyRu'

const bodySchema = z.object({
    status: z.enum(['completed', 'cancelled'])
})

export default defineEventHandler(async (event) => {
    const id = parseRequestId(event)
    const { status } = await readValidatedBodyRu(event, bodySchema)

    const [existing] = await db
        .select({ type: requests.type })
        .from(requests)
        .where(eq(requests.id, id))
        .limit(1)

    if (!existing) {
        throw createError({ statusCode: 404, statusMessage: 'Заявка не найдена' })
    }

    const isTransportation = existing.type === 'transportation'

    if (isTransportation && status !== 'completed') {
        throw createError({ statusCode: 400, statusMessage: 'Заявку на грузоперевозку можно только завершить' })
    }
    if (!isTransportation && status !== 'cancelled') {
        throw createError({
            statusCode: 400,
            statusMessage: 'Заявки на гостехосмотр и мойку можно только отменить, завершаются они автоматически'
        })
    }

    await db.transaction(async (tx) => {
        const [updated] = await tx
            .update(requests)
            .set({ status, updatedAt: new Date() })
            .where(and(eq(requests.id, id), eq(requests.status, 'active')))
            .returning({ id: requests.id })

        if (!updated) {
            throw createError({ statusCode: 409, statusMessage: 'Статус заявки уже изменён. Обновите список.' })
        }

        if (existing.type === 'inspection') {
            await tx.update(inspectionDetails).set({ status }).where(eq(inspectionDetails.requestId, id))
        }
        if (existing.type === 'washing') {
            await tx.update(washingDetails).set({ status }).where(eq(washingDetails.requestId, id))
        }
    })

    return { success: true }
})