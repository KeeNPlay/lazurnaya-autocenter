<script setup lang="ts">
import { formatFileSize } from '~/utils/formatFileSize'
import type { AdminFileInfo } from '~~/shared/utils/adminFiles'

interface Props {
  label: string
  info?: AdminFileInfo | null
  loading?: boolean
  uploading?: boolean
  accept?: string
  maxSizeMb?: number
  disabled?: boolean
}

withDefaults(defineProps<Props>(), {
  info: null,
  loading: false,
  uploading: false,
  accept: '',
  maxSizeMb: undefined,
  disabled: false
})

const emit = defineEmits<{
  upload: []
  restore: []
}>()

const modelValue = defineModel<File | null>({ default: null })
</script>

<template>
  <article class="flex flex-col gap-y-3">
    <BaseFormField :label="label">
      <BaseFormFileUpload
          v-model="modelValue"
          :accept="accept"
          :max-size-mb="maxSizeMb"
          :disabled="disabled || uploading"
          :loading="uploading"
          @save="emit('upload')"
      />
    </BaseFormField>

    <div class="flex flex-col gap-y-1 text-xs text-gray-400">
      <p v-if="loading && !info">Загрузка сведений о файле...</p>

      <template v-else-if="info">
        <p v-if="!info.exists">Файл ещё не загружен</p>

        <p v-else>
          Текущий файл:
          <a :href="info.url" target="_blank" rel="noopener" class="text-orange-500 hover:underline">Открыть</a>
          <template v-if="info.size !== null"> · {{ formatFileSize(info.size) }}</template>
          <template v-if="info.updatedAt"> · обновлён {{ info.updatedAt }}</template>
          <template v-else-if="info.isDefault"> · исходная версия</template>
        </p>

        <p v-if="info.previous">
          Предыдущая версия: {{ formatFileSize(info.previous.size) }}
          <template v-if="info.previous.updatedAt"> · {{ info.previous.updatedAt }}</template>
          ·
          <button
              type="button"
              class="text-orange-500 cursor-pointer hover:underline disabled:cursor-not-allowed disabled:opacity-50"
              :disabled="disabled || uploading"
              @click="emit('restore')"
          >
            Вернуть
          </button>
        </p>
      </template>
    </div>
  </article>
</template>