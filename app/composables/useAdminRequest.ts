import type {
  AdminRequest,
  AdminRequestsResponse,
  AdminRequestUpdatePayload,
  RequestStatus,
  RequestType
} from '~/types/request'

const EMPTY_COUNTS: Readonly<Record<RequestStatus, number>> = { active: 0, completed: 0, cancelled: 0 }

export function useAdminRequests(type: RequestType) {
  const { notify } = useAdminNotifications()

  const status = ref<RequestStatus>('active')
  const page = ref<number>(1)

  // Смена вкладки и сброс страницы — одно изменение, поэтому уходит один запрос
  const activeTab = computed<RequestStatus>({
    get: () => status.value,
    set: (value) => {
      if (value === status.value) return
      status.value = value
      page.value = 1
    }
  })

  const currentPage = computed<number>({
    get: () => page.value,
    set: (value) => {
      page.value = value
    }
  })

  const query = computed(() => ({ type, status: status.value, page: page.value }))

  const { data, pending, error, refresh } = useFetch<AdminRequestsResponse>('/api/admin/requests', {
    key: `admin-requests:${type}`,
    query
  })

  // Хранит последний успешный ответ, чтобы счётчики и таблица не мигали при переключении
  const lastResponse = shallowRef<AdminRequestsResponse | null>(null)
  watch(
      data,
      (value): void => {
        if (value) lastResponse.value = value
      },
      { immediate: true }
  )

  const response = computed<AdminRequestsResponse | null>(() => data.value ?? lastResponse.value)

  // Сервер мог сжать номер страницы (например, после отмены последней заявки на странице)
  watch(response, (value): void => {
    if (value && value.page !== page.value) page.value = value.page
  })

  watch(error, async (err): Promise<void> => {
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

  async function reload(): Promise<void> {
    await refresh()
  }

  async function mutate(
      action: () => Promise<unknown>,
      successMessage: string,
      fallbackError: string
  ): Promise<boolean> {
    if (isMutating.value) return false
    isMutating.value = true

    try {
      await action()
      notify('success', successMessage)
      await refresh()
      return true
    } catch (err) {
      if (isFetchErrorWithStatus(err, 401)) {
        await navigateTo('/admin/login')
        return false
      }

      notify('error', getServerErrorMessage(err, fallbackError))

      if (isFetchErrorWithStatus(err, 409) || isFetchErrorWithStatus(err, 404)) {
        await refresh()
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
    updateRequest
  }
}