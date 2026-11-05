import { ADMIN_FILE_KEYS } from '~~/shared/utils/adminFiles'
import { getAdminFileInfo } from '../../../utils/files/adminFileStorage'

export default defineEventHandler(async () => {
    const files = await Promise.all(ADMIN_FILE_KEYS.map((key) => getAdminFileInfo(key)))
    return { files }
})