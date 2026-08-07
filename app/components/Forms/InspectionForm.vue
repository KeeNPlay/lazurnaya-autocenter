<script setup lang="ts">
const { consent, captchaToken, canSubmit } = useFormConsent()

const form = reactive({
  date: '',
  time: '',
  nameOrCompany: '',
  phone: '',
  carBrand: '',
  plateNumber: '',
})

const isSubmitting = ref(false)

async function onSubmit(): Promise<void> {
  if (!canSubmit.value) return
  isSubmitting.value = true
  try {
    await $fetch('/api/forms/inspection', {
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
        <BaseFormInput v-model="form.time" placeholder="12:00" required />
      </BaseFormField>
      <BaseFormField label="Имя / Компания" required>
        <BaseFormInput v-model="form.nameOrCompany" placeholder='Арсен или ООО "Стальное в кармане"' required />
      </BaseFormField>
      <BaseFormField label="Номер телефона" required>
        <BaseFormInput v-model="form.phone" type="tel" placeholder="+375 (__) ___ __ __" required />
      </BaseFormField>
      <BaseFormField label="Марка" required>
        <BaseFormInput v-model="form.carBrand" placeholder="МАЗ, MAN, SCANIA" required />
      </BaseFormField>
      <BaseFormField label="Регистрационный знак" required>
        <BaseFormInput v-model="form.plateNumber" placeholder="7777 АА-7" required />
      </BaseFormField>
    </div>

    <div class="flex flex-col p-6 lg:p-7.5 2xl:p-10 gap-y-7.5 2xl:gap-y-10 dark:bg-gray-150/50 border border-gray-150 rounded-md 2xl:rounded-lg">
      <BaseFormConsent v-model="consent" />
      <BaseFormCaptcha v-model="captchaToken" />
    </div>

    <BaseFormSubmit :loading="isSubmitting" :disabled="!canSubmit" />
  </form>
</template>