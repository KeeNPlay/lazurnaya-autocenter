<script setup lang="ts">
import { toRaw } from 'vue'
import type { AdminRequest, CarType, RequestStatus, WashType } from '~/types/request'
import { CAR_TYPE_LABELS, REQUEST_STATUS_LABELS, WASH_TYPE_LABELS } from '~/types/request'

const props = defineProps<{
  modelValue: boolean
  request: AdminRequest | null
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  save: [id: number, payload: Partial<AdminRequest>]
  cancel: [id: number]
}>()

const editedRequest = ref<AdminRequest | null>(null)

watch(
  () => props.request,
  (value): void => {
    editedRequest.value = value ? structuredClone(toRaw(value)) : null
  },
  { immediate: true }
)

interface SelectOption<T extends string> {
  label: string
  value: T
}

const statusOptions: SelectOption<RequestStatus>[] = (
  Object.entries(REQUEST_STATUS_LABELS) as [RequestStatus, string][]
).map(([value, label]) => ({ value, label }))

const washTypeOptions: SelectOption<WashType>[] = (
  Object.entries(WASH_TYPE_LABELS) as [WashType, string][]
).map(([value, label]) => ({ value, label }))

const carTypeOptions: SelectOption<CarType>[] = (
  Object.entries(CAR_TYPE_LABELS) as [CarType, string][]
).map(([value, label]) => ({ value, label }))

function onSave(): void {
  if (!editedRequest.value) return
  emit('save', editedRequest.value.id, editedRequest.value)
  emit('update:modelValue', false)
}

function onCancelRequest(): void {
  if (!editedRequest.value) return
  emit('cancel', editedRequest.value.id)
  emit('update:modelValue', false)
}

interface TimeOption {
  label: string
  value: string
}

const timeOptions: TimeOption[] = [
  { label: '8:30', value: '08:30:00' },
  { label: '8:45', value: '08:45:00' },
  { label: '9:00', value: '09:00:00' },
  { label: '9:15', value: '09:15:00' },
  { label: '9:30', value: '09:30:00' },
  { label: '9:45', value: '09:45:00' },
  { label: '10:00', value: '10:00:00' },
  { label: '10:15', value: '10:15:00' },
  { label: '10:30', value: '10:30:00' },
  { label: '10:45', value: '10:45:00' },
  { label: '11:00', value: '11:00:00' },
  { label: '11:15', value: '11:15:00' },
  { label: '11:30', value: '11:30:00' },
  { label: '11:45', value: '11:45:00' },
  { label: '12:00', value: '12:00:00' },
  { label: '12:15', value: '12:15:00' },
  { label: '12:30', value: '12:30:00' },
  { label: '13:30', value: '13:30:00' },
  { label: '13:45', value: '13:45:00' },
  { label: '14:00', value: '14:00:00' },
  { label: '14:15', value: '14:15:00' },
  { label: '14:30', value: '14:30:00' },
  { label: '14:45', value: '14:45:00' },
  { label: '15:00', value: '15:00:00' },
  { label: '15:15', value: '15:15:00' },
  { label: '15:30', value: '15:30:00' },
  { label: '15:45', value: '15:45:00' },
  { label: '16:00', value: '16:00:00' },
  { label: '16:15', value: '16:15:00' },
  { label: '16:30', value: '16:30:00' }
]
</script>

<template>
  <BaseModal :model-value="modelValue" title="Детали заявки" @update:model-value="emit('update:modelValue', $event)">
    <div
      v-if="editedRequest"
      class="flex w-full max-w-lg flex-col gap-y-5 rounded-md bg-gray-100 p-6 lg:p-8"
    >
      <h2 class="text-xl font-medium text-white">Заявка №{{ editedRequest.id }}</h2>

      <BaseFormField label="Имя / Компания">
        <BaseFormInput v-model="editedRequest.nameOrCompany" />
      </BaseFormField>

      <BaseFormField label="Телефон">
        <BaseFormPhoneInput v-model="editedRequest.phone" />
      </BaseFormField>

      <div class="grid grid-cols-2 gap-x-4">
        <BaseFormField label="Дата">
          <BaseFormDatepicker v-model="editedRequest.date" />
        </BaseFormField>
        <BaseFormField label="Время">
          <BaseFormSelect v-model="editedRequest.time" :placeholder="editedRequest.time" :options="timeOptions" />
        </BaseFormField>
      </div>

      <template v-if="editedRequest.type === 'inspection'">
        <BaseFormField label="Марка">
          <BaseFormInput v-model="editedRequest.brand" />
        </BaseFormField>
        <BaseFormField label="Гос. номер">
          <BaseFormInput v-model="editedRequest.plateNumber" />
        </BaseFormField>
      </template>

      <div v-else class="grid grid-cols-2 gap-x-4">
        <BaseFormField label="Тип авто">
          <BaseFormSelect v-model="editedRequest.carType" :options="carTypeOptions" />
        </BaseFormField>
        <BaseFormField label="Тип мойки">
          <BaseFormSelect v-model="editedRequest.washType" :options="washTypeOptions" />
        </BaseFormField>
      </div>

      <BaseFormField label="Статус">
        <BaseFormSelect v-model="editedRequest.status" :options="statusOptions" />
      </BaseFormField>

      <div class="flex justify-between gap-x-3 border-t border-gray-150 pt-4">
        <button
          v-if="editedRequest.status === 'active'"
          type="button"
          class="text-sm text-red-500 hover:underline"
          @click="onCancelRequest"
        >
          Отменить заявку
        </button>

        <div class="ml-auto flex gap-x-3">
          <BaseButton variant="secondary" @click="emit('update:modelValue', false)">Закрыть</BaseButton>
          <BaseButton @click="onSave">Сохранить</BaseButton>
        </div>
      </div>
    </div>
  </BaseModal>
</template>