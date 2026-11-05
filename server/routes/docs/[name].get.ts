import { adminFileKeyFromName } from '~~/shared/utils/adminFiles'
import { readCurrentFile } from '../../utils/files/adminFileStorage'

export default defineEventHandler(async (event) => {
    const name = getRouterParam(event, 'name') ?? ''
    const key = adminFileKeyFromName(name)

    if (!key) {
        throw createError({ statusCode: 404, statusMessage: 'Файл не найден' })
    }

    const file = await readCurrentFile(key)

    if (!file) {
        throw createError({ statusCode: 404, statusMessage: 'Файл не найден' })
    }

    const isNotModified = handleCacheHeaders(event, {
        etag: file.etag,
        modifiedTime: file.updatedAt ?? undefined,
        cacheControls: ['public', 'max-age=0', 'must-revalidate']
    })
    if (isNotModified) return

    setHeader(event, 'Content-Type', 'application/pdf')
    setHeader(event, 'Content-Disposition', `inline; filename="${key}.pdf"`)

    return file.data
})