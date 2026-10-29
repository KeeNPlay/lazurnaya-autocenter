<script setup lang="ts">
const { consent, captchaToken, canSubmit } = useFormConsent()
const {
  loading: scheduleLoading,
  error: scheduleError,
  load: loadSchedule,
  getAvailableTimeOptions,
  isDateFullyBooked,
  markSlotAsBusy
} = useInspectionSchedule()

const captchaRef = ref<{ reset: () => void } | null>(null)

const form = reactive({
  date: '',
  time: '',
  nameOrCompany: '',
  phone: '',
  carBrand: '',
  plateNumber: ''
})

onMounted(() => {
  loadSchedule()
})

async function onDatepickerOpen(): Promise<void> {
  await loadSchedule()
}

const timeOptions = computed(() => getAvailableTimeOptions(form.date))

watch(
    () => form.date,
    () => {
      const currentOption = timeOptions.value.find((option) => option.value === form.time)
      if (!currentOption || currentOption.disabled) {
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
  form.carBrand = ''
  form.plateNumber = ''
}

async function onSubmit(): Promise<void> {
  if (!canSubmit.value) return

  isSubmitting.value = true
  submitError.value = false
  submitSuccess.value = false
  submitErrorMessage.value = ''

  const bookedDate = form.date
  const bookedTime = form.time

  try {
    await $fetch('/api/forms/inspection', {
      method: 'POST',
      body: { ...form, captchaToken: captchaToken.value }
    })

    markSlotAsBusy(bookedDate, bookedTime)

    successMessage.value = buildBookingSuccessMessage(bookedDate, bookedTime)
    submitSuccess.value = true
    resetForm()
  } catch (error) {
    submitError.value = true

    if (isFetchErrorWithStatus(error, 409)) {
      markSlotAsBusy(bookedDate, bookedTime)
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
      <BaseFormField label="Дата" required>
        <BaseFormDatepicker
            v-model="form.date"
            placeholder="дд.мм.гггг"
            required
            :is-date-disabled-extra="isDateFullyBooked"
            :loading="scheduleLoading"
            @open="onDatepickerOpen"
        />
        <p v-if="scheduleError" class="mt-1.5 text-xs text-gray-400">
          {{ scheduleError }}
        </p>
      </BaseFormField>
      <BaseFormField label="Время" required>
        <BaseFormSelect v-model="form.time" :options="timeOptions" placeholder="12:00" required />
      </BaseFormField>
      <BaseFormField label="Имя / Компания" required>
        <BaseFormInput v-model="form.nameOrCompany" placeholder='Иван или ООО "Межтранс"' required />
      </BaseFormField>
      <BaseFormField label="Номер телефона" required>
        <BaseFormPhoneInput v-model="form.phone" required />
      </BaseFormField>
      <BaseFormField label="Марка" required>
        <BaseFormInput v-model="form.carBrand" placeholder="МАЗ, MAN, SCANIA" required />
      </BaseFormField>
      <BaseFormField label="Регистрационный знак" required>
        <BaseFormInput v-model="form.plateNumber" placeholder="7777 АА-7" required />
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