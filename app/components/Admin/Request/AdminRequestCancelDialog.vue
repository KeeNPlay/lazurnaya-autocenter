<script setup lang="ts">
import type { SchedulableRequest } from '~/types/request'

withDefaults(
    defineProps<{
      modelValue: boolean
      request: SchedulableRequest | null
      loading?: boolean
    }>(),
    { loading: false }
)

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  confirm: []
}>()
</script>

<template>
  <BaseModal :model-value="modelValue" title="Отмена заявки" @update:model-value="emit('update:modelValue', $event)">
    <div v-if="request" class="flex w-full max-w-md flex-col gap-y-5 rounded-md bg-gray-100 p-4">
      <h2 class="text-xl font-medium text-white">Отменить заявку?</h2>

      <dl class="flex flex-col gap-y-2 text-sm">
        <div class="flex justify-between gap-x-4">
          <dt class="text-gray-400">Заявка</dt>
          <dd class="text-right text-white">№{{ request.id }}</dd>
        </div>
        <div class="flex justify-between gap-x-4">
          <dt class="text-gray-400">Дата</dt>
          <dd class="text-right text-white">{{ request.date }}</dd>
        </div>
        <div class="flex justify-between gap-x-4">
          <dt class="text-gray-400">Время</dt>
          <dd class="text-right text-white">{{ request.time }}</dd>
        </div>
        <div class="flex justify-between gap-x-4">
          <dt class="text-gray-400">Клиент</dt>
          <dd class="text-right text-white">{{ request.nameOrCompany }}</dd>
        </div>
      </dl>

      <p class="text-sm text-gray-400">Время освободится для новой записи. Действие нельзя отменить.</p>

      <div class="flex justify-end gap-x-3 border-t border-gray-150 pt-4">
        <BaseButton
            class="bg-red-500 hover:bg-red-600 text-white disabled:cursor-not-allowed disabled:opacity-50"
            :disabled="loading"
            @click="emit('confirm')"
        >
          Да, отменить
        </BaseButton>
        <BaseButton variant="secondary" :disabled="loading" @click="emit('update:modelValue', false)">
          Нет
        </BaseButton>
      </div>
    </div>
  </BaseModal>
</template>