<script setup lang="ts">
import type { TransportationRequest } from '~/types/request'
import { CARGO_TYPE_OPTIONS, LOADING_METHOD_OPTIONS, getOptionLabels } from '~/constants/transportationForm'

const props = withDefaults(
    defineProps<{
      modelValue: boolean
      request: TransportationRequest | null
      saving?: boolean
    }>(),
    { saving: false }
)

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  complete: [id: number]
}>()

const cargoTypesLabel = computed<string>(() =>
    props.request ? getOptionLabels(props.request.cargoTypes, CARGO_TYPE_OPTIONS) : '—'
)

const loadingMethodsLabel = computed<string>(() =>
    props.request ? getOptionLabels(props.request.loadingMethods, LOADING_METHOD_OPTIONS) : '—'
)

const unloadingMethodsLabel = computed<string>(() =>
    props.request ? getOptionLabels(props.request.unloadingMethods, LOADING_METHOD_OPTIONS) : '—'
)

const budgetLabel = computed<string>(() => {
  const request = props.request
  if (!request || (request.budgetMin === null && request.budgetMax === null)) return '—'

  const format = (value: number | null): string => (value === null ? '—' : value.toLocaleString('ru-RU'))
  return `${format(request.budgetMin)} – ${format(request.budgetMax)}`
})

function onComplete(): void {
  if (!props.request || props.saving) return
  emit('complete', props.request.id)
}
</script>

<template>
  <BaseModal :model-value="modelValue" title="Детали заявки" @update:model-value="emit('update:modelValue', $event)">
    <div v-if="request" class="flex w-[100vw] md:w-lg flex-col gap-y-5 rounded-md bg-gray-100 p-4 pt-12">
      <div class="flex items-center justify-between">
        <h2 class="text-xl font-medium text-white">Заявка №{{ request.id }}</h2>
        <AdminRequestStatusBadge :status="request.status" />
      </div>

      <dl class="flex flex-col gap-y-3 text-sm">
        <div class="flex justify-between gap-x-3">
          <dt class="text-gray-400">Имя / Компания</dt>
          <dd class="text-right text-white">{{ request.nameOrCompany }}</dd>
        </div>
        <div class="flex justify-between gap-x-3">
          <dt class="text-gray-400">Телефон</dt>
          <dd class="text-right text-white">{{ formatPhone(request.phone) }}</dd>
        </div>
        <div class="flex justify-between gap-x-3">
          <dt class="text-gray-400">Город отправления</dt>
          <dd class="text-right text-white">{{ request.fromCity }}</dd>
        </div>
        <div class="flex justify-between gap-x-3">
          <dt class="text-gray-400">Город доставки</dt>
          <dd class="text-right text-white">{{ request.toCity }}</dd>
        </div>
        <div class="flex justify-between gap-x-3">
          <dt class="text-gray-400">Дата отправления</dt>
          <dd class="text-right text-white">{{ request.departureDate }}</dd>
        </div>
        <div class="flex justify-between gap-x-3">
          <dt class="text-gray-400">Срок доставки</dt>
          <dd class="text-right text-white">{{ request.deliveryTerm || '—' }}</dd>
        </div>
      </dl>

      <div class="flex flex-col gap-y-3 border-t border-gray-150 pt-4">
        <h3 class="text-base font-medium text-white">Габариты груза</h3>
        <dl class="grid grid-cols-2 gap-3 text-sm">
          <div class="flex justify-between gap-x-3">
            <dt class="text-gray-400">Длина, см</dt>
            <dd class="text-white">{{ request.dimensions.length ?? '—' }}</dd>
          </div>
          <div class="flex justify-between gap-x-3">
            <dt class="text-gray-400">Ширина, см</dt>
            <dd class="text-white">{{ request.dimensions.width ?? '—' }}</dd>
          </div>
          <div class="flex justify-between gap-x-3">
            <dt class="text-gray-400">Высота, см</dt>
            <dd class="text-white">{{ request.dimensions.height ?? '—' }}</dd>
          </div>
          <div class="flex justify-between gap-x-3">
            <dt class="text-gray-400">Вес, кг</dt>
            <dd class="text-white">{{ request.dimensions.weight ?? '—' }}</dd>
          </div>
        </dl>
      </div>

      <dl class="flex flex-col gap-y-3 border-t border-gray-150 pt-4 text-sm">
        <div class="flex justify-between gap-x-3">
          <dt class="text-gray-400">Тип грузоперевозки</dt>
          <dd class="text-right text-white">{{ cargoTypesLabel }}</dd>
        </div>
        <div class="flex justify-between gap-x-3">
          <dt class="text-gray-400">Способ загрузки</dt>
          <dd class="text-right text-white">{{ loadingMethodsLabel }}</dd>
        </div>
        <div class="flex justify-between gap-x-3">
          <dt class="text-gray-400">Способ разгрузки</dt>
          <dd class="text-right text-white">{{ unloadingMethodsLabel }}</dd>
        </div>
        <div class="flex justify-between gap-x-3">
          <dt class="text-gray-400">Бюджет</dt>
          <dd class="text-right text-white">{{ budgetLabel }} $</dd>
        </div>
      </dl>

      <div v-if="request.comment" class="flex flex-col gap-y-2 border-t border-gray-150 pt-4">
        <h3 class="text-base font-medium text-white">Комментарий</h3>
        <p class="text-sm text-gray-300">{{ request.comment }}</p>
      </div>

      <div class="flex justify-between gap-x-3 border-t border-gray-150 pt-4">
        <button
            v-if="request.status === 'active'"
            type="button"
            class="text-sm text-red-500 cursor-pointer hover:underline disabled:cursor-not-allowed disabled:opacity-50"
            :disabled="saving"
            @click="onComplete"
        >
          Завершить заявку
        </button>
        <BaseButton variant="secondary" class="ml-auto" @click="emit('update:modelValue', false)">Закрыть</BaseButton>
      </div>
    </div>
  </BaseModal>
</template>