import { computed, ref, shallowRef, watch } from 'vue'
import { navigateTo, useFetch } from '#imports'
import type { BlacklistCreatePayload, BlacklistEntry, BlacklistResponse } from '~~/shared/utils/blacklist'

export function useAdminBlacklist() {
    const { notify } = useAdminNotifications()

    const currentPage = ref<number>(1)
    const query = computed(() => ({ page: currentPage.value }))

    const { data, pending: fetchPending, error, refresh } = useFetch<BlacklistResponse>('/api/admin/blacklist', {
        key: 'admin-blacklist',
        query
    })

    const pending = computed<boolean>(() => Boolean(fetchPending.value))

    // The last successful response keeps the table from flickering while switching pages
    const lastResponse = shallowRef<BlacklistResponse | null>(null)
    watch(
        data,
        (value: BlacklistResponse | null | undefined): void => {
            if (value) lastResponse.value = value
        },
        { immediate: true }
    )

    const response = computed<BlacklistResponse | null>(() => data.value ?? lastResponse.value)

    // The server clamps the page number (e.g. after unblocking the last entry on the page)
    watch(response, (value: BlacklistResponse | null): void => {
        if (value && value.page !== currentPage.value) currentPage.value = value.page
    })

    watch(error, async (err: unknown): Promise<void> => {
        if (!err) return

        if (isFetchErrorWithStatus(err, 401)) {
            await navigateTo('/admin/login')
            return
        }

        notify('error', getServerErrorMessage(err, 'Не удалось загрузить чёрный список. Попробуйте обновить страницу.'))
    })

    const entries = computed<BlacklistEntry[]>(() => response.value?.items ?? [])
    const totalPages = computed<number>(() => response.value?.totalPages ?? 1)

    const isMutating = ref<boolean>(false)

    async function refreshList(): Promise<void> {
        await refresh()
    }

    async function reload(): Promise<void> {
        await refreshList()
    }

    async function mutate(
        action: () => Promise<unknown>,
        successMessage: string,
        fallbackError: string,
        afterSuccess: () => Promise<void> = refreshList
    ): Promise<boolean> {
        if (isMutating.value) return false
        isMutating.value = true

        try {
            await action()
            notify('success', successMessage)
            await afterSuccess()
            return true
        } catch (err: unknown) {
            if (isFetchErrorWithStatus(err, 401)) {
                await navigateTo('/admin/login')
                return false
            }

            notify('error', getServerErrorMessage(err, fallbackError))

            if (isFetchErrorWithStatus(err, 409) || isFetchErrorWithStatus(err, 404)) {
                await refreshList()
            }
            return false
        } finally {
            isMutating.value = false
        }
    }

    function addEntry(payload: BlacklistCreatePayload): Promise<boolean> {
        return mutate(
            () => $fetch('/api/admin/blacklist', { method: 'POST', body: payload }),
            'Номер добавлен в чёрный список',
            'Не удалось добавить номер в чёрный список',
            async (): Promise<void> => {
                // New entries appear at the top: go to the first page.
                // If the page changes, useFetch re-fetches the data by itself
                if (currentPage.value !== 1) {
                    currentPage.value = 1
                    return
                }
                await refreshList()
            }
        )
    }

    function removeEntry(entry: BlacklistEntry): Promise<boolean> {
        return mutate(
            () => $fetch(`/api/admin/blacklist/${entry.id}`, { method: 'DELETE' }),
            `Номер ${formatPhone(entry.phone)} разблокирован`,
            'Не удалось разблокировать номер'
        )
    }

    return {
        currentPage,
        totalPages,
        entries,
        pending,
        isMutating,
        reload,
        addEntry,
        removeEntry
    }
}