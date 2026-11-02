<script setup lang="ts">
import { reactive, ref } from 'vue'
import {
  CARGO_TYPE_OPTIONS,
  LOADING_METHOD_OPTIONS,
  BUDGET_RANGE,
  createEmptyTransportationForm,
  type TransportationForm
} from '~/constants/transportationForm'
import type { TransportationCreatePayload } from '~/types/requestCreate'

const props = withDefaults(
    defineProps<{
      modelValue: boolean
      saving?: boolean
    }>(),
    { saving: false }
)

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  create: [payload: TransportationCreatePayload]
}>()

const DATE_PATTERN = /^\d{2}\.\d{2}\.\d{4}$/

const form = reactive<TransportationForm>(createEmptyTransportationForm())
const budget = ref<[number, number]>([...BUDGET_RANGE.default])
const showAdvanced = ref<boolean>(false)

// Changes each time it’s opened — recreates the fields (including the phone mask)
const formKey = ref<number>(0)

function resetForm(): void {
  Object.assign(form, createEmptyTransportationForm())
  budget.value = [...BUDGET_RANGE.default]
  showAdvanced.value = false
  formKey.value++
}

// Data is cleared only upon opening: in the event of a server error, the entered information is preserved
watch(
    () => props.modelValue,
    (isOpen): void => {
      if (isOpen) resetForm()
    }
)

const canCreate = computed<boolean>(() =>
    !props.saving &&
    form.fromCity.trim().length >= 2 &&
    form.toCity.trim().length >= 2 &&
    DATE_PATTERN.test(form.departureDate) &&
    form.nameOrCompany.trim().length >= 2 &&
    form.phone.length === 9
)

function onCreate(): void {
  if (!canCreate.value) return

  emit('create', {
    ...form,
    fromCity: form.fromCity.trim(),
    toCity: form.toCity.trim(),
    deliveryTerm: form.deliveryTerm.trim(),
    nameOrCompany: form.nameOrCompany.trim(),
    comment: form.comment.trim(),
    dimensions: { ...form.dimensions },
    cargoTypes: [...form.cargoTypes],
    loadingMethods: [...form.loadingMethods],
    unloadingMethods: [...form.unloadingMethods],
    budget: [budget.value[0], budget.value[1]]
  })
}
</script>

<template>
  <BaseModal
      :model-value="modelValue"
      title="Новая заявка"
      @update:model-value="emit('update:modelValue', $event)"
  >
    <div
        :key="formKey"
        class="flex max-h-[90vh] w-full max-w-2xl flex-col gap-y-5 overflow-y-auto rounded-md bg-gray-100 p-4"
    >
      <h2 class="text-xl font-medium text-white">Новая заявка</h2>

      <div class="grid grid-cols-1 gap-x-4 gap-y-5 sm:grid-cols-2">
        <BaseFormField label="Город отправления" required>
          <BaseFormInput v-model="form.fromCity" placeholder="Гомель, Республика Беларусь" />
        </BaseFormField>
        <BaseFormField label="Город доставки" required>
          <BaseFormInput v-model="form.toCity" placeholder="Пекин, Китай" />
        </BaseFormField>
        <BaseFormField label="Дата отправления" required>
          <BaseFormDatepicker v-model="form.departureDate" placeholder="дд.мм.гггг" />
        </BaseFormField>
        <BaseFormField label="Срок доставки">
          <BaseFormInput v-model="form.deliveryTerm" placeholder="15 дней" />
        </BaseFormField>
        <BaseFormField label="Имя / Компания" required>
          <BaseFormInput v-model="form.nameOrCompany" placeholder='Иван или ООО "Межтранс"' />
        </BaseFormField>
        <BaseFormField label="Номер телефона" required>
          <BaseFormPhoneInput v-model="form.phone" />
        </BaseFormField>
      </div>

      <button
          type="button"
          class="flex items-center gap-x-2 self-center text-sm font-medium text-orange-500 transition-colors duration-200 cursor-pointer hover:text-orange-600"
          :aria-expanded="showAdvanced"
          aria-controls="admin-transportation-advanced-params"
          @click="showAdvanced = !showAdvanced"
      >
        <span>{{ showAdvanced ? 'Скрыть расширенные параметры' : 'Расширенные параметры' }}</span>
        <Icon
            name="heroicons:chevron-down-20-solid"
            class="h-4 w-4 shrink-0 transition-transform duration-300"
            :class="{ 'rotate-180': showAdvanced }"
        />
      </button>

      <Transition
          enter-active-class="transition-all duration-300 ease-out"
          enter-from-class="opacity-0 -translate-y-2"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition-all duration-200 ease-in"
          leave-from-class="opacity-100 translate-y-0"
          leave-to-class="opacity-0 -translate-y-2"
      >
        <div v-if="showAdvanced" id="admin-transportation-advanced-params" class="flex flex-col gap-y-5">
          <div class="flex flex-col gap-y-4 rounded-md border border-gray-150 bg-gray-150/50 p-4">
            <div class="flex flex-col gap-y-1">
              <h3 class="text-base font-medium text-white">Габариты груза</h3>
              <p class="text-xs font-light text-gray-900">Ориентировочные размеры и параметры груза</p>
            </div>
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
              title="Бюджет"
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
        </div>
      </Transition>

      <div class="flex justify-end gap-x-3 border-t border-gray-150 pt-4">
        <BaseButton variant="secondary" @click="emit('update:modelValue', false)">Закрыть</BaseButton>
        <BaseButton :disabled="!canCreate" class="disabled:cursor-not-allowed disabled:opacity-50" @click="onCreate">
          Создать
        </BaseButton>
      </div>
    </div>
  </BaseModal>
</template>