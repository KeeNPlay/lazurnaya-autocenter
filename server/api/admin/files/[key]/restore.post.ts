import { isAdminFileKey } from '~~/shared/utils/adminFiles'
import { getAdminFileInfo, restorePreviousAdminFile } from '../../../../utils/files/adminFileStorage'

export default defineEventHandler(async (event) => {
    const key = getRouterParam(event, 'key')

    if (!isAdminFileKey(key)) {
        throw createError({ statusCode: 404, statusMessage: 'Неизвестный файл' })
    }

    await restorePreviousAdminFile(key)

    return { success: true, file: await getAdminFileInfo(key) }
})