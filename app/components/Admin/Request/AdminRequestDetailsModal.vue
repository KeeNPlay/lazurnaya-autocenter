<script setup lang="ts">
import type {
  AdminRequestUpdatePayload,
  SchedulableRequest,
  VehicleType,
  WashType
} from '~/types/request'
import { VEHICLE_TYPE_OPTIONS, WASH_TYPE_OPTIONS } from '~/constants/washingForm'

const props = withDefaults(
    defineProps<{
      modelValue: boolean
      request: SchedulableRequest | null
      saving?: boolean
    }>(),
    { saving: false }
)

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  save: [id: number, payload: AdminRequestUpdatePayload]
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

// Меняется при каждом открытии — принудительно пересоздаёт поля (в т.ч. маску телефона)
const formKey = ref<number>(0)

const isInspection = computed<boolean>(() => props.request?.type === 'inspection')
const isWashing = computed<boolean>(() => props.request?.type === 'washing')

function fillForm(request: SchedulableRequest | null): void {
  form.date = request?.date ?? ''
  form.time = request ? `${request.time}:00` : ''
  form.nameOrCompany = request?.nameOrCompany ?? ''
  form.phone = request ? phoneToLocalDigits(request.phone) : ''
  form.carBrand = request?.type === 'inspection' ? request.carBrand : ''
  form.plateNumber = request?.type === 'inspection' ? request.plateNumber : ''
  form.vehicleType = request?.type === 'washing' ? request.vehicleType : ''
  form.washType = request?.type === 'washing' ? request.washType : ''
  formKey.value++
}

async function reloadSchedule(): Promise<void> {
  if (props.request?.type === 'inspection') await inspectionSchedule.load(true)
  else if (props.request?.type === 'washing') await washingSchedule.load(true)
}

watch(
    [() => props.modelValue, () => props.request],
    (): void => {
      if (!props.modelValue) return
      fillForm(props.request)
      void reloadSchedule()
    }
)

// После любой попытки сохранения (например, 409) обновляем занятость
watch(
    () => props.saving,
    (isSaving, wasSaving): void => {
      if (wasSaving && !isSaving && props.modelValue) void reloadSchedule()
    }
)

// Собственный слот заявки не считается занятым
const ownInspectionSlot = computed(() =>
    props.request ? { date: props.request.date, time: `${props.request.time}:00` } : undefined
)

const ownWashingSlot = computed(() =>
    props.request?.type === 'washing'
        ? { date: props.request.date, time: `${props.request.time}:00`, durationMinutes: props.request.durationMinutes }
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

function onSave(): void {
  if (!props.request || !canSave.value) return

  const base = {
    date: form.date,
    time: form.time,
    nameOrCompany: form.nameOrCompany.trim(),
    phone: form.phone
  }

  if (props.request.type === 'inspection') {
    emit('save', props.request.id, {
      ...base,
      carBrand: form.carBrand.trim(),
      plateNumber: form.plateNumber.trim()
    })
    return
  }

  emit('save', props.request.id, {
    ...base,
    vehicleType: form.vehicleType as VehicleType,
    washType: form.washType as WashType
  })
}

function onCancelRequest(): void {
  if (!props.request || props.saving) return
  emit('cancel', props.request.id)
}
</script>

<template>
  <BaseModal :model-value="modelValue" title="Детали заявки" @update:model-value="emit('update:modelValue', $event)">
    <div
        v-if="request"
        :key="formKey"
        class="flex w-full max-w-lg flex-col gap-y-5 rounded-md bg-gray-100 p-4"
    >
      <h2 class="text-xl font-medium text-white">Заявка №{{ request.id }}</h2>

      <BaseFormField label="Имя / Компания">
        <BaseFormInput v-model="form.nameOrCompany" />
      </BaseFormField>

      <BaseFormField label="Телефон">
        <BaseFormPhoneInput v-model="form.phone" />
      </BaseFormField>

      <div class="grid grid-cols-2 gap-x-4">
        <BaseFormField label="Дата">
          <BaseFormDatepicker
              :model-value="form.date"
              :disabled="isWashing && !isCombinationAllowed"
              :is-date-disabled-extra="isDateBlocked"
              :loading="scheduleLoading"
              @update:model-value="onDateChange"
          />
        </BaseFormField>
        <BaseFormField label="Время">
          <BaseFormSelect
              v-model="form.time"
              :options="timeOptions"
              :disabled="isWashing && (!isCombinationAllowed || !form.date)"
              placeholder="12:00"
          />
        </BaseFormField>
      </div>

      <p v-if="scheduleError" class="-mt-3 text-xs text-gray-400">
        {{ scheduleError }}
      </p>

      <template v-if="isInspection">
        <BaseFormField label="Марка">
          <BaseFormInput v-model="form.carBrand" />
        </BaseFormField>
        <BaseFormField label="Гос. номер">
          <BaseFormInput v-model="form.plateNumber" />
        </BaseFormField>
      </template>

      <div v-else class="grid grid-cols-2 gap-x-4">
        <BaseFormField label="Тип авто">
          <BaseFormSelect
              :model-value="form.vehicleType"
              :options="VEHICLE_TYPE_OPTIONS"
              @update:model-value="onVehicleTypeChange"
          />
        </BaseFormField>
        <BaseFormField label="Тип мойки">
          <BaseFormSelect
              :model-value="form.washType"
              :options="washTypeOptions"
              :disabled="!form.vehicleType"
              @update:model-value="onWashTypeChange"
          />
        </BaseFormField>
      </div>

      <div class="flex justify-between gap-x-3 border-t border-gray-150 pt-4">
        <button
            type="button"
            class="text-sm text-red-500 cursor-pointer hover:underline disabled:cursor-not-allowed disabled:opacity-50"
            :disabled="saving"
            @click="onCancelRequest"
        >
          Отменить заявку
        </button>

        <div class="ml-auto flex gap-x-3">
          <BaseButton variant="secondary" @click="emit('update:modelValue', false)">Закрыть</BaseButton>
          <BaseButton :disabled="!canSave" class="disabled:cursor-not-allowed disabled:opacity-50" @click="onSave">
            Сохранить
          </BaseButton>
        </div>
      </div>
    </div>
  </BaseModal>
</template>