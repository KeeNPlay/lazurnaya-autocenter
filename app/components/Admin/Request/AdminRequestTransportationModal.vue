<script setup lang="ts">
import type { TransportationRequest } from '~/types/request'
import { CARGO_TYPE_OPTIONS, LOADING_METHOD_OPTIONS, getOptionLabels } from '~/constants/transportationForm'

const props = defineProps<{
  modelValue: boolean
  request: TransportationRequest | null
}>()

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

function onComplete(): void {
  if (!props.request) return
  emit('complete', props.request.id)
  emit('update:modelValue', false)
}
</script>

<template>
  <BaseModal :model-value="modelValue" title="Детали заявки" @update:model-value="emit('update:modelValue', $event)">
    <div v-if="request" class="flex w-full max-w-lg flex-col gap-y-5 rounded-md bg-gray-100 p-4 pt-12">
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
          <dd class="text-right text-white">{{ request.phone }}</dd>
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
            <dd class="text-white">{{ request.dimensions.length || '—' }}</dd>
          </div>
          <div class="flex justify-between gap-x-3">
            <dt class="text-gray-400">Ширина, см</dt>
            <dd class="text-white">{{ request.dimensions.width || '—' }}</dd>
          </div>
          <div class="flex justify-between gap-x-3">
            <dt class="text-gray-400">Высота, см</dt>
            <dd class="text-white">{{ request.dimensions.height || '—' }}</dd>
          </div>
          <div class="flex justify-between gap-x-3">
            <dt class="text-gray-400">Вес, кг</dt>
            <dd class="text-white">{{ request.dimensions.weight || '—' }}</dd>
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
      </dl>

      <div v-if="request.comment" class="flex flex-col gap-y-2 border-t border-gray-150 pt-4">
        <h3 class="text-base font-medium text-white">Комментарий</h3>
        <p class="text-sm text-gray-300">{{ request.comment }}</p>
      </div>

      <div class="flex justify-between gap-x-3 border-t border-gray-150 pt-4">
        <button
          v-if="request.status === 'active'"
          type="button"
          class="text-sm text-red-500 cursor-pointer hover:underline"
          @click="onComplete"
        >
          Завершить заявку
        </button>
        <BaseButton variant="secondary" @click="emit('update:modelValue', false)">Закрыть</BaseButton>
      </div>
    </div>
  </BaseModal>
</template>