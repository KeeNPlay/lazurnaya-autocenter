<script setup lang="ts">
const { consent, captchaToken, canSubmit } = useFormConsent()

const form = reactive({
  fromCity: '',
  toCity: '',
  departureDate: '',
  deliveryTerm: '',
  nameOrCompany: '',
  phone: '',
  dimensions: { length: '', width: '', height: '', weight: '' },
  cargoTypes: [] as string[],
  loadingMethods: [] as string[],
  unloadingMethods: [] as string[],
  comment: '',
})

const budget = ref<[number, number]>([1000, 5000])

const cargoTypeOptions = [
  { label: 'Тепловой режим', value: 'thermal' },
  { label: 'Без теплового режима', value: 'no-thermal' },
  { label: 'Хрупкий груз', value: 'fragile' },
  { label: 'Жидкий груз', value: 'liquid' },
  { label: 'Рефрижератор', value: 'refrigerator' },
  { label: 'Неизвестно', value: 'unknown' },
]

const methodOptions = [
  { label: 'Задняя', value: 'rear' },
  { label: 'Боковая', value: 'side' },
  { label: 'Верхняя', value: 'top' },
  { label: 'Иной способ', value: 'other' },
]

const isSubmitting = ref(false)

async function onSubmit(): Promise<void> {
  if (!canSubmit.value) return
  isSubmitting.value = true
  try {
    await $fetch('/api/forms/transportation', {
      method: 'POST',
      body: { ...form, budget: budget.value, captchaToken: captchaToken.value },
    })
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <form class="p-6 lg:p-15 2xl:p-20 flex flex-col gap-y-7.5 2xl:gap-y-10 outline-1 outline-gray-150" @submit.prevent="onSubmit">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-y-7.5 2xl:gap-y-10 gap-x-0 lg:gap-x-7.5">
      <BaseFormField label="Город отправления" required>
        <BaseFormInput v-model="form.fromCity" placeholder="Гомель, Республика Беларусь" required />
      </BaseFormField>
      <BaseFormField label="Город доставки" required>
        <BaseFormInput v-model="form.toCity" placeholder="Пекин, Китай" required />
      </BaseFormField>
      <BaseFormField label="Дата отправления" required>
        <BaseFormDatepicker v-model="form.departureDate" placeholder="дд.мм.гггг" required />
      </BaseFormField>
      <BaseFormField label="Срок доставки">
        <BaseFormInput v-model="form.deliveryTerm" placeholder="15 дней" />
      </BaseFormField>
      <BaseFormField label="Имя / Компания" required>
        <BaseFormInput v-model="form.nameOrCompany" placeholder='Иван или ООО "Межтранс"' required />
      </BaseFormField>
      <BaseFormField label="Номер телефона" required>
        <BaseFormPhoneInput v-model="form.phone" required />
      </BaseFormField>
    </div>

    <div class="flex flex-col gap-y-7.5 2xl:gap-y-10 px-6 py-4.5 lg:py-5 lg:px-7.5 2xl:p-10 border border-gray-150 rounded-md 2xl:rounded-lg bg-gray-150/50">
      <div class="flex flex-col gap-y-2 lg:gap-y-3.5">
        <h3 class="text-white text-base lg:text-lg 2xl:text-2xl font-medium">Габариты груза</h3>
        <p class="text-gray-900 text-xs lg:text-base 2xl:text-lg font-light">Укажите ориентировочные размеры и параметры груза</p>
      </div>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-7.5 2xl:gap-10">
        <BaseFormField label="Длина">
          <BaseFormInput v-model="form.dimensions.length" type="number" placeholder="13000 см" step="100" />
        </BaseFormField>
        <BaseFormField label="Ширина">
          <BaseFormInput v-model="form.dimensions.width" type="number" placeholder="3000 см" step="100" />
        </BaseFormField>
        <BaseFormField label="Высота">
          <BaseFormInput v-model="form.dimensions.height" type="number" placeholder="3000 см" step="100" />
        </BaseFormField>
        <BaseFormField label="Общий вес">
          <BaseFormInput v-model="form.dimensions.weight" type="number" placeholder="18000 кг" step="100" />
        </BaseFormField>
      </div>
    </div>

    <BaseFormCheckboxGroup v-model="form.cargoTypes" title="Тип грузоперевозки" :options="cargoTypeOptions" />
    <BaseFormRangeSlider v-model="budget" title="Ваш бюджет" description="Передвигайте слайдер для регулировки бюджета" :min="0" :max="10000" :step="100" />
    <BaseFormCheckboxGroup v-model="form.loadingMethods" title="Способ загрузки" :options="methodOptions" />
    <BaseFormCheckboxGroup v-model="form.unloadingMethods" title="Способ разгрузки" :options="methodOptions" />

    <BaseFormField label="Комментарий">
      <BaseFormTextarea v-model="form.comment" placeholder="Забрать груз на сортировочном центре и доставить на адрес разгрузки." />
    </BaseFormField>

    <div class="flex flex-col p-6 lg:p-7.5 2xl:p-10 gap-y-7.5 2xl:gap-y-10 dark:bg-gray-150/50 border border-gray-150 rounded-md 2xl:rounded-lg">
      <BaseFormConsent v-model="consent" note="Не является средством расчёта на территории Республики Беларусь" />
      <BaseFormCaptcha v-model="captchaToken" />
    </div>
    <BaseFormSubmit :loading="isSubmitting" :disabled="!canSubmit" />
  </form>
</template>