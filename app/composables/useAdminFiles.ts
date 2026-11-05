import { computed, ref } from 'vue'
import { navigateTo, useFetch } from '#imports'
import { ADMIN_FILE_LABELS, type AdminFileInfo, type AdminFileKey } from '~~/shared/utils/adminFiles'

interface AdminFilesResponse {
    files: AdminFileInfo[]
}

export function useAdminFiles() {
    const { notify } = useAdminNotifications()

    const { data, pending: fetchPending, error, refresh } = useFetch<AdminFilesResponse>('/api/admin/files', {
        key: 'admin-files'
    })

    const pending = computed<boolean>(() => Boolean(fetchPending.value))

    const files = computed<Partial<Record<AdminFileKey, AdminFileInfo>>>(() => {
        const result: Partial<Record<AdminFileKey, AdminFileInfo>> = {}
        for (const file of data.value?.files ?? []) result[file.key] = file
        return result
    })

    watch(error, async (err: unknown): Promise<void> => {
        if (!err) return

        if (isFetchErrorWithStatus(err, 401)) {
            await navigateTo('/admin/login')
            return
        }

        notify('error', getServerErrorMessage(err, 'Не удалось загрузить сведения о файлах. Попробуйте обновить страницу.'))
    })

    // Key of the file currently being processed (only one operation is performed at a time)
    const busyKey = ref<AdminFileKey | null>(null)

    async function run(
        key: AdminFileKey,
        action: () => Promise<unknown>,
        successMessage: string,
        fallbackError: string
    ): Promise<boolean> {
        if (busyKey.value) return false
        busyKey.value = key

        try {
            await action()
            notify('success', successMessage)
            await refresh()
            return true
        } catch (err: unknown) {
            if (isFetchErrorWithStatus(err, 401)) {
                await navigateTo('/admin/login')
                return false
            }

            notify('error', getServerErrorMessage(err, fallbackError))
            return false
        } finally {
            busyKey.value = null
        }
    }

    function upload(key: AdminFileKey, file: File): Promise<boolean> {
        const body = new FormData()
        body.append('file', file)

        return run(
            key,
            () => $fetch(`/api/admin/files/${key}`, { method: 'POST', body }),
            `Файл «${ADMIN_FILE_LABELS[key]}» обновлён`,
            'Не удалось загрузить файл'
        )
    }

    function restore(key: AdminFileKey): Promise<boolean> {
        return run(
            key,
            () => $fetch(`/api/admin/files/${key}/restore`, { method: 'POST' }),
            `Предыдущая версия файла «${ADMIN_FILE_LABELS[key]}» восстановлена`,
            'Не удалось восстановить предыдущую версию'
        )
    }

    return {
        files,
        pending,
        uploadingKey: busyKey,
        upload,
        restore
    }
}