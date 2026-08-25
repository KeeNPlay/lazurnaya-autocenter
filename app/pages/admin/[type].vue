<script setup lang="ts">
import type { AdminRequest, RequestType, SchedulableRequest, TransportationRequest } from '~/types/request'
import { REQUEST_TYPE_LABELS, TRANSPORTATION_REQUEST_STATUSES, ALL_REQUEST_STATUSES, isRequestType } from '~/types/request'

definePageMeta({
  layout: 'admin-panel',
  validate: (route) => isRequestType(route.params.type)
})

const route = useRoute()

const type = route.params.type as RequestType

const { activeTab, currentPage, totalPages, counts, requests, updateStatus, updateRequest } =
  useAdminRequests(type)

const isModalOpen = ref<boolean>(false)
const selectedRequest = shallowRef<AdminRequest | null>(null)

const visibleStatuses = computed(() =>
  type === 'transportation' ? TRANSPORTATION_REQUEST_STATUSES : ALL_REQUEST_STATUSES
)

const schedulableRequest = computed<SchedulableRequest | null>(() =>
  selectedRequest.value && selectedRequest.value.type !== 'transportation' ? selectedRequest.value : null
)

const transportationRequest = computed<TransportationRequest | null>(() =>
  selectedRequest.value?.type === 'transportation' ? selectedRequest.value : null
)

function openDetails(request: AdminRequest): void {
  selectedRequest.value = request
  isModalOpen.value = true
}

function onSave(id: number, payload: Partial<SchedulableRequest>): void {
  updateRequest(id, payload)
}

function onCancel(id: number): void {
  updateStatus(id, 'cancelled')
}

function onComplete(id: number): void {
  updateStatus(id, 'completed')
}
</script>

<template>
  <div class="flex flex-col gap-y-6 px-2 lg:px-6">
    <h1 class="ml-20 md:ml-0 text-2xl font-medium text-white">
      {{ REQUEST_TYPE_LABELS[type] }}
    </h1>

    <AdminRequestStatusTabs v-model="activeTab" :counts="counts" :statuses="visibleStatuses" />

    <AdminRequestTable :requests="requests" :type="type" @view="openDetails" @update-status="updateStatus" />

    <AdminRequestTeablePagination v-model="currentPage" :total-pages="totalPages" />

    <AdminRequestDetailsModal
      v-if="type !== 'transportation'"
      v-model="isModalOpen"
      :request="schedulableRequest"
      @save="onSave"
      @cancel="onCancel"
    />
    <AdminRequestTransportationModal
      v-else
      v-model="isModalOpen"
      :request="transportationRequest"
      @complete="onComplete"
    />
  </div>
</template>