<script setup lang="ts">
import { reactive, ref } from 'vue'
import {
  CARGO_TYPE_OPTIONS,
  LOADING_METHOD_OPTIONS,
  BUDGET_RANGE,
  createEmptyTransportationForm,
  type TransportationForm
} from '~/constants/transportationForm'


const { consent, captchaToken, canSubmit } = useFormConsent()

const form = reactive<TransportationForm>(createEmptyTransportationForm())

const budget = ref<[number, number]>([...BUDGET_RANGE.default])

const isSubmitting = ref<boolean>(false)
const submitError = ref<boolean>(false)
const submitSuccess = ref<boolean>(false)

const resetForm = (): void => {
  Object.assign(form, createEmptyTransportationForm())
  budget.value = [...BUDGET_RANGE.default]
}

async function onSubmit(): Promise<void> {
  if (!canSubmit.value) return

  isSubmitting.value = true
  submitError.value = false
  submitSuccess.value = false

  try {
    await $fetch('/api/forms/transportation', {
      method: 'POST',
      body: {
        ...form,
        budget: budget.value,
        captchaToken: captchaToken.value
      }
    })

    submitSuccess.value = true
    resetForm()
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
        <BaseFormField label="Длина, см">
          <BaseFormInput v-model="form.dimensions.length" type="number" placeholder="13000" step="100" min="0" />
        </BaseFormField>
        <BaseFormField label="Ширина, см">
          <BaseFormInput v-model="form.dimensions.width" type="number" placeholder="3000" step="100" min="0" />
        </BaseFormField>
        <BaseFormField label="Высота, см">
          <BaseFormInput v-model="form.dimensions.height" type="number" placeholder="3000" step="100" min="0" />
        </BaseFormField>
        <BaseFormField label="Общий вес, кг">
          <BaseFormInput v-model="form.dimensions.weight" type="number" placeholder="18000" step="100" min="0" />
        </BaseFormField>
      </div>
    </div>

    <BaseFormCheckboxGroup v-model="form.cargoTypes" title="Тип грузоперевозки" :options="CARGO_TYPE_OPTIONS" />
    <BaseFormRangeSlider
      v-model="budget"
      title="Ваш бюджет"
      description="Передвигайте слайдер для регулировки бюджета"
      :min="BUDGET_RANGE.min"
      :max="BUDGET_RANGE.max"
      :step="BUDGET_RANGE.step"
    />
    <BaseFormCheckboxGroup v-model="form.loadingMethods" title="Способ загрузки" :options="LOADING_METHOD_OPTIONS" />
    <BaseFormCheckboxGroup v-model="form.unloadingMethods" title="Способ разгрузки" :options="LOADING_METHOD_OPTIONS" />

    <BaseFormField label="Комментарий">
      <BaseFormTextarea v-model="form.comment" placeholder="Забрать груз на сортировочном центре и доставить на адрес разгрузки." />
    </BaseFormField>

    <div class="flex flex-col p-6 lg:p-7.5 2xl:p-10 gap-y-7.5 2xl:gap-y-10 dark:bg-gray-150/50 border border-gray-150 rounded-md 2xl:rounded-lg">
      <BaseFormConsent v-model="consent" note="Не является средством расчёта на территории Республики Беларусь" />
      <BaseFormCaptcha v-model="captchaToken" />
    </div>

    <BaseFormAlert v-if="submitError || submitSuccess" :variant="submitError ? 'error' : 'success'"/>

    <BaseFormSubmit :loading="isSubmitting" :disabled="!canSubmit" />
  </form>
</template>