<script setup lang="ts">
import { formatFileSize } from '~/utils/formatFileSize'

interface Props {
  accept?: string
  maxSizeMb?: number
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  accept: '',
  maxSizeMb: undefined,
  disabled: false
})

const modelValue = defineModel<File | null>({ default: null })

const inputRef = ref<HTMLInputElement | null>(null)
const isDragOver = ref<boolean>(false)
const error = ref<string | null>(null)

const acceptedExtensions = computed<string[]>(() =>
  props.accept
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
)

const acceptLabel = computed<string>(() =>
  acceptedExtensions.value.length > 0 ? acceptedExtensions.value.join(', ').toUpperCase() : 'Любой формат'
)

function validateFile(file: File): string | null {
  if (acceptedExtensions.value.length > 0) {
    const isValidType = acceptedExtensions.value.some((pattern) =>
      pattern.startsWith('.')
        ? file.name.toLowerCase().endsWith(pattern.toLowerCase())
        : file.type === pattern
    )

    if (!isValidType) {
      return `Неверный формат файла. Необходимый формат: ${acceptLabel.value}`
    }
  }

  if (props.maxSizeMb !== undefined && file.size > props.maxSizeMb * 1024 * 1024) {
    return `Файл слишком большой. Максимальный размер: ${props.maxSizeMb} МБ`
  }

  return null
}

function handleFile(file: File): void {
  const validationError = validateFile(file)

  if (validationError) {
    error.value = validationError
    modelValue.value = null
    return
  }

  error.value = null
  modelValue.value = file
}

function onInputChange(event: Event): void {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]

  if (file) handleFile(file)
  target.value = ''
}

function onDrop(event: DragEvent): void {
  isDragOver.value = false
  if (props.disabled) return

  const file = event.dataTransfer?.files?.[0]
  if (file) handleFile(file)
}

function onDragOver(): void {
  if (!props.disabled) isDragOver.value = true
}

function openDialog(): void {
  if (!props.disabled) inputRef.value?.click()
}

function onKeydown(event: KeyboardEvent): void {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    openDialog()
  }
}

function removeFile(): void {
  modelValue.value = null
  error.value = null
}

function onSave(): void {
  alert('Файл загружен')
}
</script>

<template>
  <div class="flex flex-col gap-y-2">
    <div
      role="button"
      tabindex="0"
      :aria-label="modelValue ? `Выбран файл ${modelValue.name}` : 'Выбрать файл'"
      class="relative flex flex-col items-center justify-center gap-y-1.5 rounded-md border-2 border-dashed px-4 py-6 text-center transition-colors duration-200"
      :class="[
        isDragOver ? 'border-orange-500 bg-orange-500/5' : 'border-gray-300 bg-gray-100/50 hover:border-gray-400',
        disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
      ]"
      @click="openDialog"
      @keydown="onKeydown"
      @dragover.prevent="onDragOver"
      @dragleave.prevent="isDragOver = false"
      @drop.prevent="onDrop"
    >
      <input
        ref="inputRef"
        type="file"
        class="sr-only"
        :accept="accept"
        :disabled="disabled"
        @change="onInputChange"
        @click.stop
      >

      <template v-if="modelValue">
        <Icon name="heroicons:document-check-20-solid" class="text-3xl text-orange-500" />
        <p class="max-w-full truncate text-sm font-medium text-white">{{ modelValue.name }}</p>
        <p class="text-xs text-gray-400">{{ formatFileSize(modelValue.size) }}</p>
        <BaseButton 
          class="text-xs lg:text-xs 2xl:text-xs"
          @click.stop="onSave"
        >
          Сохранить файл
        </BaseButton>
        <BaseButton
          variant="transparent"
          class="text-red-500 hover:text-red-400 text-xs lg:text-xs 2xl:text-xs gap-x-1 font-normal"
          @click.stop="removeFile"
        >
          <template #icon-left>
            <Icon name="heroicons:x-mark-20-solid" />
          </template>
          Удалить файл
        </BaseButton>
      </template>

      <template v-else>
        <Icon name="heroicons:cloud-arrow-up-20-solid" class="text-3xl text-gray-500" />
        <p class="text-sm font-medium text-gray-900">
          <span class="text-orange-500">Нажмите для выбора</span> или перетащите файл
        </p>
        <p class="text-xs text-gray-500">
          {{ acceptLabel }}<template v-if="maxSizeMb"> · до {{ maxSizeMb }} МБ</template>
        </p>
      </template>
    </div>

    <p v-if="error" class="flex items-center gap-x-1 text-xs text-red-500">
      <Icon name="heroicons:exclamation-triangle-20-solid" />
      {{ error }}
    </p>
  </div>
</template>