<script setup lang="ts">
import type {
  AdminRequest,
  AdminRequestUpdatePayload,
  RequestStatus,
  RequestType,
  SchedulableRequest,
  TransportationRequest
} from '~/types/request'
import type { SchedulableCreatePayload, TransportationCreatePayload } from '~/types/requestCreate'
import { REQUEST_TYPE_LABELS, TRANSPORTATION_REQUEST_STATUSES, ALL_REQUEST_STATUSES, isRequestType } from '~/types/request'

definePageMeta({
  layout: 'admin-panel',
  validate: (route) => isRequestType(route.params.type)
})

const route = useRoute()

const type = route.params.type as RequestType

// 'inspection' | 'washing' for the schedule modal, null for transport operations
const schedulableType = type === 'transportation' ? null : type

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
  updateRequest,
  createRequest
} = useAdminRequests(type)

const isModalOpen = ref<boolean>(false)
const modalMode = ref<'create' | 'edit'>('edit')
const selectedRequest = shallowRef<AdminRequest | null>(null)

const isTransportationCreateOpen = ref<boolean>(false)

const isCancelDialogOpen = ref<boolean>(false)
const cancelTarget = shallowRef<SchedulableRequest | null>(null)

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
  modalMode.value = 'edit'
  isModalOpen.value = true
}

function openCreate(): void {
  if (type === 'transportation') {
    isTransportationCreateOpen.value = true
    return
  }

  selectedRequest.value = null
  modalMode.value = 'create'
  isModalOpen.value = true
}

// Modals close only after a successful server response — in the event of an error (e.g., 409), the data is not lost
async function onSave(id: number, payload: AdminRequestUpdatePayload): Promise<void> {
  if (await updateRequest(id, payload)) isModalOpen.value = false
}

async function onCreate(payload: SchedulableCreatePayload): Promise<void> {
  if (await createRequest(payload)) isModalOpen.value = false
}

async function onCreateTransportation(payload: TransportationCreatePayload): Promise<void> {
  if (await createRequest(payload)) isTransportationCreateOpen.value = false
}

// Confirmation has already been received from within the modal itself (via an inline block inside it)
async function onCancel(id: number): Promise<void> {
  if (await updateStatus(id, 'cancelled')) isModalOpen.value = false
}

async function onComplete(id: number): Promise<void> {
  if (await updateStatus(id, 'completed')) isModalOpen.value = false
}

// Cancellation from the table is handled via a confirmation dialog; other status changes take effect immediately.
function onTableStatusChange(id: number, status: RequestStatus): void {
  if (status === 'cancelled') {
    const target = requests.value.find((request) => request.id === id)

    if (target && target.type !== 'transportation') {
      cancelTarget.value = target
      isCancelDialogOpen.value = true
      return
    }
  }

  void updateStatus(id, status)
}

async function onConfirmCancel(): Promise<void> {
  if (!cancelTarget.value) return

  await updateStatus(cancelTarget.value.id, 'cancelled')
  // In the event of an error (including 409), the list has already been updated; there is no point in retrying the cancellation.
  isCancelDialogOpen.value = false
}
</script>

<template>
  <div class="flex flex-col gap-y-6 px-2 md:px-6">
    <div class="flex items-center justify-between gap-x-3">
      <h1 class="ml-20 md:ml-0 text-2xl font-medium text-white">
        {{ REQUEST_TYPE_LABELS[type] }}
      </h1>

      <div class="flex items-center gap-x-3">
        <BaseButton aria-label="Добавить заявку" title="Добавить заявку" @click="openCreate">
          <span class="flex items-center gap-x-2">
            <Icon name="heroicons:plus-20-solid" class="text-[1.25rem]" />
            <span class="max-[1280px]:hidden">Добавить заявку</span>
          </span>
        </BaseButton>

        <BaseButton variant="secondary" aria-label="Обновить список" :disabled="pending" @click="reload">
          <Icon
              name="heroicons:arrow-path-20-solid"
              class="text-[1.25rem] text-orange-800"
              :class="{ 'animate-spin': pending }"
          />
        </BaseButton>
      </div>
    </div>

    <AdminRequestStatusTabs v-model="activeTab" :counts="counts" :statuses="visibleStatuses" />

    <AdminRequestTable
        :requests="requests"
        :type="type"
        :loading="pending"
        @view="openDetails"
        @update-status="onTableStatusChange"
    />

    <AdminRequestTablePagination v-model="currentPage" :total-pages="totalPages" />

    <template v-if="schedulableType">
      <AdminRequestDetailsModal
          v-model="isModalOpen"
          :type="schedulableType"
          :mode="modalMode"
          :request="schedulableRequest"
          :saving="isMutating"
          @save="onSave"
          @create="onCreate"
          @cancel="onCancel"
      />
      <AdminRequestCancelDialog
          v-model="isCancelDialogOpen"
          :request="cancelTarget"
          :loading="isMutating"
          @confirm="onConfirmCancel"
      />
    </template>

    <template v-else>
      <AdminRequestTransportationModal
          v-model="isModalOpen"
          :request="transportationRequest"
          :saving="isMutating"
          @complete="onComplete"
      />
      <AdminRequestTransportationCreateModal
          v-model="isTransportationCreateOpen"
          :saving="isMutating"
          @create="onCreateTransportation"
      />
    </template>
  </div>
</template>