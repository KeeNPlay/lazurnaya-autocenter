<script setup lang="ts">
import type { BlacklistEntry } from '~~/shared/utils/blacklist'

withDefaults(
    defineProps<{
      modelValue: boolean
      entry: BlacklistEntry | null
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
  <BaseModal :model-value="modelValue" title="Разблокировка номера" @update:model-value="emit('update:modelValue', $event)">
    <div v-if="entry" class="flex w-full max-w-md flex-col gap-y-5 rounded-md bg-gray-100 p-4">
      <h2 class="text-xl font-medium text-white">Разблокировать номер?</h2>

      <dl class="flex flex-col gap-y-2 text-sm">
        <div class="flex justify-between gap-x-4">
          <dt class="text-gray-400">Запись</dt>
          <dd class="text-right text-white">№{{ entry.id }}</dd>
        </div>
        <div class="flex justify-between gap-x-4">
          <dt class="text-gray-400">Телефон</dt>
          <dd class="text-right text-white">{{ formatPhone(entry.phone) }}</dd>
        </div>
        <div class="flex justify-between gap-x-4">
          <dt class="text-gray-400">Добавлен</dt>
          <dd class="text-right text-white">{{ entry.addedAt }}</dd>
        </div>
      </dl>

      <p class="text-sm text-gray-400">
        Номер будет удалён из списка, и клиент снова сможет отправлять заявки через формы сайта.
      </p>

      <div class="flex justify-end gap-x-3 border-t border-gray-150 pt-4">
        <BaseButton
            class="disabled:cursor-not-allowed disabled:opacity-50"
            :disabled="loading"
            @click="emit('confirm')"
        >
          Да, разблокировать
        </BaseButton>
        <BaseButton variant="secondary" :disabled="loading" @click="emit('update:modelValue', false)">
          Нет
        </BaseButton>
      </div>
    </div>
  </BaseModal>
</template>