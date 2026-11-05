import {
    ADMIN_FILE_MAX_SIZE_BYTES,
    ADMIN_FILE_MAX_SIZE_MB,
    isAdminFileKey
} from '~~/shared/utils/adminFiles'
import { getAdminFileInfo, saveAdminFile } from '../../../utils/files/adminFileStorage'

// PDF signatures allow for a small amount of "garbage" at the beginning of the file, so we examine the first kilobyte
function looksLikePdf(data: Buffer): boolean {
    return data.subarray(0, 1024).toString('latin1').includes('%PDF-')
}

export default defineEventHandler(async (event) => {
    const key = getRouterParam(event, 'key')

    if (!isAdminFileKey(key)) {
        throw createError({ statusCode: 404, statusMessage: 'Неизвестный файл' })
    }

    let parts
    try {
        parts = await readMultipartFormData(event)
    } catch {
        throw createError({ statusCode: 400, statusMessage: 'Не удалось прочитать загруженный файл' })
    }

    const files = (parts ?? []).filter((part) => part.filename !== undefined)

    if (files.length !== 1) {
        throw createError({ statusCode: 400, statusMessage: 'Загрузите ровно один файл' })
    }

    const { data } = files[0]!

    if (data.length === 0) {
        throw createError({ statusCode: 400, statusMessage: 'Файл пустой' })
    }

    if (data.length > ADMIN_FILE_MAX_SIZE_BYTES) {
        throw createError({
            statusCode: 413,
            statusMessage: `Файл слишком большой. Максимальный размер: ${ADMIN_FILE_MAX_SIZE_MB} МБ`
        })
    }

    if (!looksLikePdf(data)) {
        throw createError({ statusCode: 400, statusMessage: 'Неверный формат файла. Необходимый формат: PDF' })
    }

    await saveAdminFile(key, data)

    return { success: true, file: await getAdminFileInfo(key) }
})