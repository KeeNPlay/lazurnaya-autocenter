<script setup lang="ts">
import type {
  AdminRequestUpdatePayload,
  SchedulableRequest,
  VehicleType,
  WashType
} from '~/types/request'
import type { SchedulableCreatePayload } from '~/types/requestCreate'
import { VEHICLE_TYPE_OPTIONS, WASH_TYPE_OPTIONS } from '~/constants/washingForm'

const props = withDefaults(
    defineProps<{
      modelValue: boolean
      type: 'inspection' | 'washing'
      mode?: 'create' | 'edit'
      request?: SchedulableRequest | null
      saving?: boolean
    }>(),
    { mode: 'edit', request: null, saving: false }
)

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  save: [id: number, payload: AdminRequestUpdatePayload]
  create: [payload: SchedulableCreatePayload]
  cancel: [id: number]
}>()

const inspectionSchedule = useInspectionSchedule()
const washingSchedule = useWashingSchedule()

const form = reactive({
  date: '',
  time: '',
  nameOrCompany: '',
  phone: '',
  carBrand: '',
  plateNumber: '',
  vehicleType: '',
  washType: ''
})

// Changes every time it’s opened — forces the fields (including the phone mask) to be recreated
const formKey = ref<number>(0)

// Displays an inline confirmation for the cancellation of a request
const isConfirmingCancel = ref<boolean>(false)

const isCreate = computed<boolean>(() => props.mode === 'create')
const isInspection = computed<boolean>(() => props.type === 'inspection')
const isWashing = computed<boolean>(() => props.type === 'washing')

// The request being edited (it does not exist when in creation mode)
const editRequest = computed<SchedulableRequest | null>(() => (isCreate.value ? null : props.request))

function fillForm(request: SchedulableRequest | null): void {
  form.date = request?.date ?? ''
  form.time = request ? `${request.time}:00` : ''
  form.nameOrCompany = request?.nameOrCompany ?? ''
  form.phone = request ? phoneToLocalDigits(request.phone) : ''
  form.carBrand = request?.type === 'inspection' ? request.carBrand : ''
  form.plateNumber = request?.type === 'inspection' ? request.plateNumber : ''
  form.vehicleType = request?.type === 'washing' ? request.vehicleType : ''
  form.washType = request?.type === 'washing' ? request.washType : ''
  isConfirmingCancel.value = false
  formKey.value++
}

async function reloadSchedule(): Promise<void> {
  if (isInspection.value) await inspectionSchedule.load(true)
  else await washingSchedule.load(true)
}

watch(
    [() => props.modelValue, () => props.request, () => props.mode],
    (): void => {
      if (!props.modelValue) return
      fillForm(editRequest.value)
      void reloadSchedule()
    }
)

// After any save attempt (e.g., 409), update the occupancy status
watch(
    () => props.saving,
    (isSaving, wasSaving): void => {
      if (!wasSaving || isSaving) return
      isConfirmingCancel.value = false
      if (props.modelValue) void reloadSchedule()
    }
)

// The current application slot is not considered occupied (only when editing)
const ownInspectionSlot = computed(() =>
    editRequest.value ? { date: editRequest.value.date, time: `${editRequest.value.time}:00` } : undefined
)

const ownWashingSlot = computed(() =>
    editRequest.value?.type === 'washing'
        ? {
          date: editRequest.value.date,
          time: `${editRequest.value.time}:00`,
          durationMinutes: editRequest.value.durationMinutes
        }
        : undefined
)

const isCombinationAllowed = computed<boolean>(() =>
    !!form.vehicleType && !!form.washType && !!getWashingDurationMinutes(form.washType, form.vehicleType)
)

const washTypeOptions = computed(() =>
    WASH_TYPE_OPTIONS.map((option) => ({
      ...option,
      disabled: !form.vehicleType || !getWashingDurationMinutes(option.value, form.vehicleType)
    }))
)

const timeOptions = computed(() => {
  if (isInspection.value) {
    return inspectionSchedule.getAvailableTimeOptions(form.date, ownInspectionSlot.value)
  }
  if (isWashing.value && isCombinationAllowed.value) {
    return washingSchedule.getAvailableTimeOptions(form.date, form.washType, form.vehicleType, ownWashingSlot.value)
  }
  return []
})

function isDateBlocked(date: Date): boolean {
  if (isInspection.value) {
    return inspectionSchedule.isDateFullyBooked(date, ownInspectionSlot.value)
  }
  if (isWashing.value && isCombinationAllowed.value) {
    return washingSchedule.isDateFullyBooked(date, form.washType, form.vehicleType, ownWashingSlot.value)
  }
  return false
}

const scheduleLoading = computed<boolean>(() =>
    isInspection.value ? inspectionSchedule.loading.value : washingSchedule.loading.value
)

const scheduleError = computed<string | null>(() =>
    isInspection.value ? inspectionSchedule.error.value : washingSchedule.error.value
)

function resetTimeIfUnavailable(): void {
  const current = timeOptions.value.find((option) => option.value === form.time)
  if (!current || current.disabled) form.time = ''
}

function onDateChange(value: string | null): void {
  form.date = value ?? ''
  resetTimeIfUnavailable()
}

function onVehicleTypeChange(value: string): void {
  form.vehicleType = value
  if (form.washType && !getWashingDurationMinutes(form.washType, value)) form.washType = ''
  resetTimeIfUnavailable()
}

function onWashTypeChange(value: string): void {
  form.washType = value
  resetTimeIfUnavailable()
}

const canSave = computed<boolean>(() => {
  if (props.saving) return false
  if (!form.date || !form.time) return false
  if (form.nameOrCompany.trim().length < 2 || form.phone.length !== 9) return false

  if (isInspection.value) {
    return form.carBrand.trim().length > 0 && form.plateNumber.trim().length > 0
  }
  return isCombinationAllowed.value
})

function buildPayload(): SchedulableCreatePayload {
  const base = {
    date: form.date,
    time: form.time,
    nameOrCompany: form.nameOrCompany.trim(),
    phone: form.phone
  }

  if (isInspection.value) {
    return {
      ...base,
      carBrand: form.carBrand.trim(),
      plateNumber: form.plateNumber.trim()
    }
  }

  return {
    ...base,
    vehicleType: form.vehicleType as VehicleType,
    washType: form.washType as WashType
  }
}

function onSubmit(): void {
  if (!canSave.value) return

  if (isCreate.value) {
    emit('create', buildPayload())
    return
  }

  if (props.request) emit('save', props.request.id, buildPayload())
}

function onConfirmCancel(): void {
  if (!props.request || props.saving) return
  emit('cancel', props.request.id)
}
</script>

<template>
  <BaseModal
      :model-value="modelValue"
      :title="isCreate ? 'Новая заявка' : 'Детали заявки'"
      @update:model-value="emit('update:modelValue', $event)"
  >
    <div
        v-if="isCreate || request"
        :key="formKey"
        class="flex w-full max-w-lg flex-col gap-y-5 rounded-md bg-gray-100 p-4"
    >
      <h2 v-if="isCreate" class="text-xl font-medium text-white">Новая заявка</h2>
      <h2 v-else-if="request" class="text-xl font-medium text-white">Заявка №{{ request.id }}</h2>

      <BaseFormField label="Имя / Компания">
        <BaseFormInput v-model="form.nameOrCompany"/>
      </BaseFormField>

      <BaseFormField label="Телефон">
        <BaseFormPhoneInput v-model="form.phone" />
      </BaseFormField>

      <!-- Washing: first select the vehicle and the type of wash; the date and time depend on these choices -->
      <div v-if="isWashing" class="grid grid-cols-2 gap-x-4">
        <BaseFormField label="Тип авто">
          <BaseFormSelect
              :model-value="form.vehicleType"
              :options="VEHICLE_TYPE_OPTIONS"
              placeholder="Выберите"
              @update:model-value="onVehicleTypeChange"
          />
        </BaseFormField>
        <BaseFormField label="Тип мойки">
          <BaseFormSelect
              :model-value="form.washType"
              :options="washTypeOptions"
              :disabled="!form.vehicleType"
              placeholder="Выберите"
              @update:model-value="onWashTypeChange"
          />
        </BaseFormField>
      </div>

      <div class="grid grid-cols-2 gap-x-4">
        <BaseFormField label="Дата">
          <BaseFormDatepicker
              :model-value="form.date"
              :disabled="isWashing && !isCombinationAllowed"
              :is-date-disabled-extra="isDateBlocked"
              :loading="scheduleLoading"
              placeholder="дд.мм.гггг"
              @update:model-value="onDateChange"
          />
        </BaseFormField>
        <BaseFormField label="Время">
          <BaseFormSelect
              v-model="form.time"
              :options="timeOptions"
              :disabled="!form.date || (isWashing && !isCombinationAllowed)"
              placeholder="12:00"
          />
        </BaseFormField>
      </div>

      <p v-if="scheduleError" class="-mt-3 text-xs text-gray-400">
        {{ scheduleError }}
      </p>

      <template v-if="isInspection">
        <BaseFormField label="Марка">
          <BaseFormInput v-model="form.carBrand" placeholder="МАЗ, MAN, Scania"/>
        </BaseFormField>
        <BaseFormField label="Гос. номер">
          <BaseFormInput v-model="form.plateNumber" placeholder="7777 AA-7"/>
        </BaseFormField>
      </template>

      <div class="border-t border-gray-150 pt-4">
        <!-- Cancellation confirmation (edit mode only) -->
        <div v-if="isConfirmingCancel && request" class="flex flex-col gap-y-3">
          <p class="text-sm text-white">
            Отменить заявку №{{ request.id }} на {{ request.date }} в {{ request.time }}?
          </p>
          <div class="flex justify-end gap-x-3">
            <BaseButton
                class="bg-red-500 hover:bg-red-600 text-white disabled:cursor-not-allowed disabled:opacity-50"
                :disabled="saving"
                @click="onConfirmCancel"
            >
              Да, отменить
            </BaseButton>
            <BaseButton variant="secondary" :disabled="saving" @click="isConfirmingCancel = false">
              Нет
            </BaseButton>
          </div>
        </div>

        <div v-else class="flex justify-between gap-x-3">
          <button
              v-if="!isCreate"
              type="button"
              class="text-sm text-red-500 cursor-pointer hover:underline disabled:cursor-not-allowed disabled:opacity-50"
              :disabled="saving"
              @click="isConfirmingCancel = true"
          >
            Отменить заявку
          </button>

          <div class="ml-auto flex gap-x-3">
            <BaseButton variant="secondary" @click="emit('update:modelValue', false)">Закрыть</BaseButton>
            <BaseButton :disabled="!canSave" class="disabled:cursor-not-allowed disabled:opacity-50" @click="onSubmit">
              {{ isCreate ? 'Создать' : 'Сохранить' }}
            </BaseButton>
          </div>
        </div>
      </div>
    </div>
  </BaseModal>
</template>