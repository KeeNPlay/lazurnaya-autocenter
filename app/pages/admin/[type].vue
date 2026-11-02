<script setup lang="ts">
import type {
  AdminRequest,
  AdminRequestUpdatePayload,
  RequestType,
  SchedulableRequest,
  TransportationRequest
} from '~/types/request'
import { REQUEST_TYPE_LABELS, TRANSPORTATION_REQUEST_STATUSES, ALL_REQUEST_STATUSES, isRequestType } from '~/types/request'

definePageMeta({
  layout: 'admin-panel',
  validate: (route) => isRequestType(route.params.type)
})

const route = useRoute()

const type = route.params.type as RequestType

const {
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
} = useAdminRequests(type)

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

// Модалка закрывается только после успешного ответа сервера — при ошибке (например, 409) данные не теряются
async function onSave(id: number, payload: AdminRequestUpdatePayload): Promise<void> {
  if (await updateRequest(id, payload)) isModalOpen.value = false
}

async function onCancel(id: number): Promise<void> {
  if (await updateStatus(id, 'cancelled')) isModalOpen.value = false
}

async function onComplete(id: number): Promise<void> {
  if (await updateStatus(id, 'completed')) isModalOpen.value = false
}
</script>

<template>
  <div class="flex flex-col gap-y-6 px-2 md:px-6">
    <div class="flex items-center justify-between gap-x-3">
      <h1 class="ml-20 md:ml-0 text-2xl font-medium text-white">
        {{ REQUEST_TYPE_LABELS[type] }}
      </h1>

      <BaseButton variant="secondary" aria-label="Обновить список" :disabled="pending" @click="reload">
        <Icon
            name="heroicons:arrow-path-20-solid"
            class="text-[1.25rem] text-orange-800"
            :class="{ 'animate-spin': pending }"
        />
      </BaseButton>
    </div>

    <AdminRequestStatusTabs v-model="activeTab" :counts="counts" :statuses="visibleStatuses" />

    <AdminRequestTable
        :requests="requests"
        :type="type"
        :loading="pending"
        @view="openDetails"
        @update-status="updateStatus"
    />

    <AdminRequestTablePagination v-model="currentPage" :total-pages="totalPages" />

    <AdminRequestDetailsModal
        v-if="type !== 'transportation'"
        v-model="isModalOpen"
        :request="schedulableRequest"
        :saving="isMutating"
        @save="onSave"
        @cancel="onCancel"
    />
    <AdminRequestTransportationModal
        v-else
        v-model="isModalOpen"
        :request="transportationRequest"
        :saving="isMutating"
        @complete="onComplete"
    />
  </div>
</template>