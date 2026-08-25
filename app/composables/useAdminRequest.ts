import type { AdminRequest, RequestStatus, RequestType } from '~/types/request'
import { createMockRequests } from '~/constants/mockRequests'
import { getRequestTimestamp } from '~/utils/requestDateTime'

export function useAdminRequests(type: RequestType) {
  const activeTab = ref<RequestStatus>('active')
  const currentPage = ref<number>(1)
  const pageSize = 10 as const

  /**
   * TODO(backend): заменить на useFetch('/api/admin/requests', { query: { type } })
   */
  const allRequests = shallowRef<AdminRequest[]>(createMockRequests(type))

  const filteredRequests = computed<AdminRequest[]>(() => {
    const filtered = allRequests.value.filter((request) => request.status === activeTab.value)

    if (activeTab.value === 'active') {
      return [...filtered].sort((a, b) => getRequestTimestamp(a) - getRequestTimestamp(b))
    }

    if (activeTab.value === 'completed') {
      return [...filtered].sort((a, b) => getRequestTimestamp(b) - getRequestTimestamp(a))
    }

    
    return [...filtered].sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    )
  })

  const counts = computed<Record<RequestStatus, number>>(() => ({
    active: allRequests.value.filter((r) => r.status === 'active').length,
    completed: allRequests.value.filter((r) => r.status === 'completed').length,
    cancelled: allRequests.value.filter((r) => r.status === 'cancelled').length
  }))

  const totalPages = computed<number>(() =>
    Math.max(1, Math.ceil(filteredRequests.value.length / pageSize))
  )

  const paginatedRequests = computed<AdminRequest[]>(() => {
    const start = (currentPage.value - 1) * pageSize
    return filteredRequests.value.slice(start, start + pageSize)
  })

  watch(activeTab, (): void => {
    currentPage.value = 1
  })

  function updateStatus(id: number, status: RequestStatus): void {
    const updatedAt = new Date().toISOString()
    allRequests.value = allRequests.value.map((r) => (r.id === id ? { ...r, status, updatedAt } : r))
  }

  function updateRequest(id: number, payload: Partial<AdminRequest>): void {
    const updatedAt = new Date().toISOString()
    allRequests.value = allRequests.value.map((r) =>
      r.id === id ? ({ ...r, ...payload, updatedAt } as AdminRequest) : r
    )
  }

  return {
    activeTab,
    currentPage,
    totalPages,
    counts,
    requests: paginatedRequests,
    updateStatus,
    updateRequest
  }
}