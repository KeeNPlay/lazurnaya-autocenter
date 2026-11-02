import { computed, ref, shallowRef, watch } from 'vue'
import { navigateTo, useFetch } from '#imports'
import type {
  AdminRequest,
  AdminRequestsResponse,
  AdminRequestUpdatePayload,
  RequestStatus,
  RequestType
} from '~/types/request'
import type { AdminRequestCreatePayload } from '~/types/requestCreate'

const EMPTY_COUNTS: Readonly<Record<RequestStatus, number>> = { active: 0, completed: 0, cancelled: 0 }

export function useAdminRequests(type: RequestType) {
  const { notify } = useAdminNotifications()

  const status = ref<RequestStatus>('active')
  const page = ref<number>(1)

  // Switching tabs and resetting the page counts as a single change, so only one request is sent
  const activeTab = computed<RequestStatus>({
    get: (): RequestStatus => status.value,
    set: (value: RequestStatus): void => {
      if (value === status.value) return
      status.value = value
      page.value = 1
    }
  })

  const currentPage = computed<number>({
    get: (): number => page.value,
    set: (value: number): void => {
      page.value = value
    }
  })

  const query = computed(() => ({ type, status: status.value, page: page.value }))

  const { data, pending: fetchPending, error, refresh } = useFetch<AdminRequestsResponse>('/api/admin/requests', {
    key: `admin-requests:${type}`,
    query
  })

  const pending = computed<boolean>(() => Boolean(fetchPending.value))

  // Stores the last successful response so that counters and the table don't flicker during switching
  const lastResponse = shallowRef<AdminRequestsResponse | null>(null)
  watch(
      data,
      (value: AdminRequestsResponse | null | undefined): void => {
        if (value) lastResponse.value = value
      },
      { immediate: true }
  )

  const response = computed<AdminRequestsResponse | null>(() => data.value ?? lastResponse.value)

  // The server might have compressed the page number (for example, after the cancellation of the last request on the page)
  watch(response, (value: AdminRequestsResponse | null): void => {
    if (value && value.page !== page.value) page.value = value.page
  })

  watch(error, async (err: unknown): Promise<void> => {
    if (!err) return

    if (isFetchErrorWithStatus(err, 401)) {
      await navigateTo('/admin/login')
      return
    }

    notify('error', getServerErrorMessage(err, 'Не удалось загрузить заявки. Попробуйте обновить список.'))
  })

  const requests = computed<AdminRequest[]>(() => response.value?.items ?? [])
  const counts = computed<Record<RequestStatus, number>>(() => response.value?.counts ?? { ...EMPTY_COUNTS })
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

  function updateStatus(id: number, nextStatus: RequestStatus): Promise<boolean> {
    return mutate(
        () => $fetch(`/api/admin/requests/${id}/status`, { method: 'PATCH', body: { status: nextStatus } }),
        nextStatus === 'cancelled' ? `Заявка №${id} отменена` : `Заявка №${id} завершена`,
        'Не удалось изменить статус заявки'
    )
  }

  function updateRequest(id: number, payload: AdminRequestUpdatePayload): Promise<boolean> {
    return mutate(
        () => $fetch(`/api/admin/requests/${id}`, { method: 'PATCH', body: payload }),
        `Изменения по заявке №${id} сохранены`,
        'Не удалось сохранить изменения'
    )
  }

  function createRequest(payload: AdminRequestCreatePayload): Promise<boolean> {
    return mutate(
        () => $fetch(`/api/admin/requests/${type}`, { method: 'POST', body: payload }),
        'Заявка создана',
        'Не удалось создать заявку',
        async (): Promise<void> => {
          // A new request is always "active": navigate to the first page of the "Active" tab
          const queryWillChange = status.value !== 'active' || page.value !== 1
          status.value = 'active'
          page.value = 1

          // If the query changes, useFetch will automatically re-fetch the data
          if (!queryWillChange) await refreshList()
        }
    )
  }

  return {
    activeTab,
    currentPage,
    totalPages,
    counts,
    requests,
    pending,
    isMutating,
    reload,
    updateStatus,
    updateRequest,
    createRequest
  }
}