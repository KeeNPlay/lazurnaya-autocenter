<script setup lang="ts">
import { WASH_TYPE_OPTIONS, VEHICLE_TYPE_OPTIONS } from '~/constants/washingForm'

const { consent, captchaToken, canSubmit } = useFormConsent()
const {
  loading: scheduleLoading,
  error: scheduleError,
  load: loadSchedule,
  getAvailableTimeOptions,
  isDateFullyBooked,
  markSlotAsBusy
} = useWashingSchedule()

const captchaRef = ref<{ reset: () => void } | null>(null)

const form = reactive({
  date: '',
  time: '',
  nameOrCompany: '',
  phone: '',
  vehicleType: '',
  washType: ''
})

onMounted(() => {
  loadSchedule()
})

async function onDatepickerOpen(): Promise<void> {
  await loadSchedule()
}

const isCombinationAllowed = computed<boolean>(() =>
    !!form.vehicleType && !!form.washType && !!getWashingDurationMinutes(form.washType, form.vehicleType)
)

const vehicleTypeOptions = computed(() => VEHICLE_TYPE_OPTIONS)

const washTypeOptions = computed(() =>
    WASH_TYPE_OPTIONS.map((opt) => ({
      ...opt,
      disabled: !form.vehicleType || !getWashingDurationMinutes(opt.value, form.vehicleType)
    }))
)

// Washing type reset after choosing vehicle type
watch(
    () => form.vehicleType,
    () => {
      if (form.washType && !getWashingDurationMinutes(form.washType, form.vehicleType)) {
        form.washType = ''
      }
    }
)

// Any change to parameters that affect the duration will reset the selected date/time —
// otherwise, they might become invalid for the new duration
watch(
    [() => form.vehicleType, () => form.washType],
    () => {
      form.date = ''
      form.time = ''
    }
)

const timeOptions = computed(() =>
    isCombinationAllowed.value
        ? getAvailableTimeOptions(form.date, form.washType, form.vehicleType)
        : []
)

watch(
    () => form.date,
    () => {
      const current = timeOptions.value.find((opt) => opt.value === form.time)
      if (!current || current.disabled) {
        form.time = ''
      }
    }
)

const isSubmitting = ref<boolean>(false)
const submitError = ref<boolean>(false)
const submitSuccess = ref<boolean>(false)
const submitErrorMessage = ref<string>('')
const successMessage = ref<string>('')

function resetForm(): void {
  form.date = ''
  form.time = ''
  form.nameOrCompany = ''
  form.phone = ''
  form.vehicleType = ''
  form.washType = ''
}

async function onSubmit(): Promise<void> {
  if (!canSubmit.value) return

  isSubmitting.value = true
  submitError.value = false
  submitSuccess.value = false
  submitErrorMessage.value = ''

  const bookedDate = form.date
  const bookedTime = form.time
  const bookedDuration = getWashingDurationMinutes(form.washType, form.vehicleType) ?? 0

  try {
    await $fetch('/api/forms/washing', {
      method: 'POST',
      body: { ...form, captchaToken: captchaToken.value }
    })

    markSlotAsBusy(bookedDate, bookedTime, bookedDuration)

    successMessage.value = buildBookingSuccessMessage(bookedDate, bookedTime)
    submitSuccess.value = true
    resetForm()
  } catch (error) {
    submitError.value = true

    if (isFetchErrorWithStatus(error, 409)) {
      markSlotAsBusy(bookedDate, bookedTime, bookedDuration)
      form.time = ''
    }

    submitErrorMessage.value = getServerErrorMessage(
        error,
        'Не удалось отправить данные, попробуйте позже.'
    )

    console.error('Ошибка отправки формы:', error)
  } finally {
    captchaRef.value?.reset()
    isSubmitting.value = false
  }
}
</script>

<template>
  <form class="p-6 lg:p-15 2xl:p-20 flex flex-col gap-y-7.5 2xl:gap-y-10 outline-1 outline-gray-150" @submit.prevent="onSubmit">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-y-7.5 2xl:gap-y-10 gap-x-0 lg:gap-x-7.5">
      <BaseFormField label="Тип транспорта" required>
        <BaseFormSelect v-model="form.vehicleType" :options="vehicleTypeOptions" placeholder="Грузовой автомобиль" required />
      </BaseFormField>
      <BaseFormField label="Тип мойки" required>
        <BaseFormSelect
            v-model="form.washType"
            :options="washTypeOptions"
            :disabled="!form.vehicleType"
            placeholder="Обмыв без моющих средств"
            required
        />
      </BaseFormField>
      <BaseFormField label="Дата" required>
        <BaseFormDatepicker
            v-model="form.date"
            placeholder="дд.мм.гггг"
            required
            :disabled="!isCombinationAllowed"
            :is-date-disabled-extra="(date) => isDateFullyBooked(date, form.washType, form.vehicleType)"
            :loading="scheduleLoading"
            @open="onDatepickerOpen"
        />
        <p v-if="scheduleError" class="mt-1.5 text-xs text-gray-400">
          {{ scheduleError }}
        </p>
      </BaseFormField>
      <BaseFormField label="Время" required>
        <BaseFormSelect
            v-model="form.time"
            :options="timeOptions"
            :disabled="!isCombinationAllowed || !form.date"
            placeholder="12:00"
            required
        />
      </BaseFormField>
      <BaseFormField label="Имя / Компания" required>
        <BaseFormInput v-model="form.nameOrCompany" placeholder='Иван или ООО "Межтранс"' required />
      </BaseFormField>
      <BaseFormField label="Номер телефона" required>
        <BaseFormPhoneInput v-model="form.phone" required />
      </BaseFormField>
    </div>

    <div class="flex flex-col p-6 lg:p-7.5 2xl:p-10 gap-y-7.5 2xl:gap-y-10 bg-gray-150/50 border border-gray-150 rounded-md 2xl:rounded-lg">
      <BaseFormConsent v-model="consent" />
      <BaseFormCaptcha ref="captchaRef" v-model="captchaToken" />
    </div>

    <BaseFormAlert
        v-if="submitError || submitSuccess"
        :variant="submitError ? 'error' : 'success'"
        :message="submitError ? submitErrorMessage : successMessage"
    />

    <BaseFormSubmit :loading="isSubmitting" :disabled="!canSubmit" />
  </form>
</template>