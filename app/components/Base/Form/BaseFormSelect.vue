<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

interface Option {
  label: string
  value: string
}

interface Props {
  modelValue: string
  options: Option[]
  placeholder?: string
  id?: string
  required?: boolean
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Выберите значение',
  disabled: false
})

const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

const isOpen = ref<boolean>(false)
const highlightedIndex = ref<number>(-1)
const rootRef = ref<HTMLDivElement | null>(null)

const selectedOption = computed<Option | undefined>(() =>
  props.options.find(opt => opt.value === props.modelValue)
)

const openDropdown = (): void => {
  if (props.disabled) return
  isOpen.value = true
  highlightedIndex.value = props.options.findIndex(opt => opt.value === props.modelValue)
}

const closeDropdown = (): void => {
  isOpen.value = false
  highlightedIndex.value = -1
}

const toggleDropdown = (): void => {
  if (isOpen.value) {
    closeDropdown()
  } else {
    openDropdown()
  }
}

const selectOption = (option: Option): void => {
  emit('update:modelValue', option.value)
  closeDropdown()
}

const handleClickOutside = (event: MouseEvent): void => {
  if (rootRef.value && !rootRef.value.contains(event.target as Node)) {
    closeDropdown()
  }
}

const handleKeydown = (event: KeyboardEvent): void => {
  if (props.disabled) return

  switch (event.key) {
    case 'Enter':
    case ' ':
      event.preventDefault()
      if (!isOpen.value) {
        openDropdown()
      } else {
        const option = props.options[highlightedIndex.value]
        if (option) {
          selectOption(option)
        }
      }
      break
    case 'ArrowDown':
      event.preventDefault()
      if (!isOpen.value) {
        openDropdown()
      } else {
        highlightedIndex.value = Math.min(highlightedIndex.value + 1, props.options.length - 1)
      }
      break
    case 'ArrowUp':
      event.preventDefault()
      if (isOpen.value) {
        highlightedIndex.value = Math.max(highlightedIndex.value - 1, 0)
      }
      break
    case 'Escape':
      closeDropdown()
      break
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <div ref="rootRef" class="relative">
    <button
      type="button"
      :disabled="disabled"
      :aria-expanded="isOpen"
      aria-haspopup="listbox"
      class="w-full flex items-center justify-between gap-x-2 border-b border-gray-200 pb-1.5 text-base 2xl:text-lg text-left cursor-pointer
             focus:outline-none hover:border-orange-500 focus:border-orange-500 transition-colors duration-200
             disabled:opacity-50 disabled:cursor-not-allowed"
      :class="selectedOption ? 'text-gray-900' : 'text-gray-400'"
      @click="toggleDropdown"
      @keydown="handleKeydown"
    >
      <span class="truncate">{{ selectedOption?.label ?? placeholder }}</span>
      <Icon 
        name="heroicons:chevron-down-20-solid" 
        class="w-4 h-4 shrink-0 text-gray-400 transition-transform duration-200"
        :class="{ 'rotate-180': isOpen }"
      />
    </button>

    <select
      :id="id"
      :value="modelValue"
      :required="required"
      tabindex="-1"
      aria-hidden="true"
      class="absolute left-0 top-0 h-px w-px overflow-hidden opacity-0"
      @focus="($event.target as HTMLSelectElement).blur()"
    >
      <option value="" disabled hidden />
      <option v-for="opt in options" :key="opt.value" :value="opt.value">
        {{ opt.label }}
      </option>
    </select>

    <Transition name="select-fade">
      <ul
        v-if="isOpen"
        role="listbox"
        class="absolute left-0 top-[calc(100%+4px)] z-40 w-full max-h-60 overflow-y-auto rounded-md border border-gray-150 bg-gray-150 shadow-lg
               scrollbar-thin scrollbar-track-gray-150 scrollbar-thumb-gray-400 hover:scrollbar-thumb-gray-500"
      >
        <li
          v-for="(opt, index) in options"
          :key="opt.value"
          role="option"
          :aria-selected="opt.value === modelValue"
          class="px-3 py-2 text-base 2xl:text-lg cursor-pointer transition-colors duration-200"
          :class="[
            index === highlightedIndex ? 'bg-orange-500' : 'hover:bg-orange-500'
          ]"
          @click="selectOption(opt)"
          @mouseenter="highlightedIndex = index"
        >
          {{ opt.label }}
        </li>
      </ul>
    </Transition>
  </div>
</template>

<style scoped>
.select-fade-enter-active,
.select-fade-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}

.select-fade-enter-from,
.select-fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>