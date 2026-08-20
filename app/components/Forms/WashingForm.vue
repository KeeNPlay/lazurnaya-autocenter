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
  { label: 'Грузовой автомобиль с полуприцепом', value: 'truck-trailer' },
  { label: 'Автобус', value: 'bus' },
  { label: 'Спецтехника', value: 'special-machinery' },
]

const washTypeOptions = [
  { label: 'Обмыв без моющих средств', value: 'water' },
  { label: 'Пенно-активная мойка', value: 'active-foam' },
  { label: 'Грязевая фреза', value: 'dirt-blaster' },
]

const isSubmitting = ref<boolean>(false)
const submitError = ref<boolean>(false)
const submitSuccess = ref<boolean>(false)

async function onSubmit(): Promise<void> {
  if (!canSubmit.value) return
  
  isSubmitting.value = true
  submitError.value = false
  submitSuccess.value = false
  
  try {
    await $fetch('/api/forms/washing', {
      method: 'POST',
      body: { ...form, captchaToken: captchaToken.value },
    })
    
    submitSuccess.value = true
  } catch (error) {
    submitError.value = true
    console.error('Ошибка отправки формы:', error)
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
      <BaseFormField label="Тип транспорта" required>
        <BaseFormSelect v-model="form.vehicleType" :options="vehicleTypeOptions" placeholder="Грузовой автомобиль" required />
      </BaseFormField>
      <BaseFormField label="Тип мойки" required>
        <BaseFormSelect v-model="form.washType" :options="washTypeOptions" placeholder="Обмыв без моющих средств" required />
      </BaseFormField>
    </div>

    <div class="flex flex-col p-6 lg:p-7.5 2xl:p-10 gap-y-7.5 2xl:gap-y-10 bg-gray-150/50 border border-gray-150 rounded-md 2xl:rounded-lg">
      <BaseFormConsent v-model="consent" />
      <BaseFormCaptcha v-model="captchaToken" />
    </div>

    <BaseFormAlert v-if="submitError || submitSuccess" :variant="submitError ? 'error' : 'success'"/>

    <BaseFormSubmit :loading="isSubmitting" :disabled="!canSubmit" />
  </form>
</template>