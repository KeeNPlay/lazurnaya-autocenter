<script setup lang="ts">
const { consent, captchaToken, canSubmit } = useFormConsent()

const form = reactive({
  date: '',
  time: '',
  nameOrCompany: '',
  phone: '',
  vehicleType: '',
  washType: '',
})

interface TimeOptions {
  label: string,
  value: string,
}

const timeOptions: TimeOptions[] = [
  {label: '8:00', value: '08:00:00'},
  {label: '8:30', value: '08:30:00'},
  {label: '9:00', value: '09:00:00'},
  {label: '9:30', value: '09:30:00'},
  {label: '10:00', value: '10:00:00'},
  {label: '10:30', value: '10:30:00'},
  {label: '11:00', value: '11:00:00'},
  {label: '11:30', value: '11:30:00'},
  {label: '12:00', value: '12:00:00'},
  {label: '12:30', value: '12:30:00'},
  {label: '13:00', value: '13:00:00'},
  {label: '13:30', value: '13:30:00'},
  {label: '14:00', value: '14:00:00'},
  {label: '14:30', value: '14:30:00'},
  {label: '15:00', value: '15:00:00'},
  {label: '15:30', value: '15:30:00'},
]

const vehicleTypeOptions = [
  { label: 'Легковой автомобиль', value: 'car' },
  { label: 'Грузовой автомобиль', value: 'truck' },
  { label: 'Автопоезд', value: 'truck-trailer' },
  { label: 'Спецтехника', value: 'truck-trailer' },
]

const washTypeOptions = [
  { label: 'Комплексная мойка', value: 'complex' },
  { label: 'Экспресс-мойка', value: 'express' },
]

const isSubmitting = ref(false)

async function onSubmit(): Promise<void> {
  if (!canSubmit.value) return
  isSubmitting.value = true
  try {
    await $fetch('/api/forms/washing', {
      method: 'POST',
      body: { ...form, captchaToken: captchaToken.value },
    })
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <form class="p-6 lg:p-15 2xl:p-20 flex flex-col gap-y-7.5 2xl:gap-y-10 outline-1 outline-gray-150" @submit.prevent="onSubmit">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-y-7.5 2xl:gap-y-10 gap-x-0 lg:gap-x-7.5">
      <BaseFormField label="Дата" required>
        <BaseFormDatepicker v-model="form.date" placeholder="дд.мм.гггг" required />
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
      <BaseFormField label="Тип автомобиля" required>
        <BaseFormSelect v-model="form.vehicleType" :options="vehicleTypeOptions" placeholder="Автопоезд" required />
      </BaseFormField>
      <BaseFormField label="Тип мойки" required>
        <BaseFormSelect v-model="form.washType" :options="washTypeOptions" placeholder="Комплексная мойка" required />
      </BaseFormField>
    </div>

    <div class="flex flex-col p-6 lg:p-7.5 2xl:p-10 gap-y-7.5 2xl:gap-y-10 dark:bg-gray-150/50 border border-gray-150 rounded-md 2xl:rounded-lg">
      <BaseFormConsent v-model="consent" />
      <BaseFormCaptcha v-model="captchaToken" />
    </div>

    <BaseFormSubmit :loading="isSubmitting" :disabled="!canSubmit" />
  </form>
</template>