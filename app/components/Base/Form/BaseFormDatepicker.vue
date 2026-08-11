<script setup lang="ts">
import { VueDatePicker } from '@vuepic/vue-datepicker'
import { ru } from 'date-fns/locale'

interface Props {
  modelValue: string
  id?: string
  placeholder?: string
  required?: boolean
}

withDefaults(defineProps<Props>(), {
  placeholder: 'дд.мм.гггг'
})

defineEmits<{ 'update:modelValue': [value: string | null] }>() 

const minDate = computed<Date>(() => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return today
})

const isDateDisabled = (date: Date): boolean => {
  const day = date.getDay()
  return day === 0 || day === 6
}

const formatDisplay = (date: Date): string => {
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  return `${day}.${month}.${year}`
}
</script>

<template>
  <VueDatePicker
    :model-value="modelValue"
    model-type="dd.MM.yyyy"
     :formats="{ input: 'dd.MM.yyyy' }"
    :locale="ru"
    :time-config="{ enableTimePicker: false }"
    :dark="true"
    :min-date="minDate"
    :disabled-dates="isDateDisabled"
    teleport
    @update:model-value="$emit('update:modelValue', $event)"
    auto-apply
  >
    <template #dp-input="{ value, onInput, onEnter, onBlur }">
      <input
        :id="id"
        type="text"
        :value="value"
        :placeholder="placeholder"
        :required="required"
        class="w-full bg-transparent border-b border-gray-200 pb-1.5 text-gray-900 text-base 2xl:text-lg
               placeholder:text-gray-400 focus:outline-none hover:border-orange-500 focus:border-orange-500 transition-colors duration-200"
        @input="onInput"
        @keydown.enter="onEnter"
        @blur="onBlur"
      >
    </template>
    <template #clear-icon="{ clear }">
            <Icon 
              name="heroicons:x-mark-20-solid"
              class="w-4 h-4 shrink-0 text-gray-400 transition-all duration-200"
              @click="clear"
            />
    </template> 
  </VueDatePicker>
</template>

<style>
.dp--theme-dark {
  --dp-background-color: var(--color-gray-150/50);
  --dp-text-color: var(--color-white);
  --dp-hover-color: var(--color-orange-500);
  --dp-hover-text-color: var(--color-white);
  --dp-hover-icon-color: var(--color-white);
  --dp-primary-color: var(--color-orange-500);
  --dp-primary-text-color: var(--color-white);
  --dp-secondary-color: var(--color-gray-400);
  --dp-border-color: var(--color-gray-150);
  --dp-menu-border-color: var(--color-gray-150);
  --dp-border-color-hover: var(--color-orange-500);
  --dp-disabled-color: var(--color-gray-150);
  --dp-scroll-bar-background: var(--color-gray-150);
  --dp-scroll-bar-color: var(--color-gray-400);
  --dp-danger-color: var(--color-red-500);
  --dp-highlight-color: color-mix(in srgb, var(--color-orange-500) 20%, transparent);

  --dp-font-family: 'Inter';
  --dp-border-radius: 8px;
  --dp-cell-border-radius: 6px;
  --dp-font-size: 14px;
  --dp-preview-font-size: 14px;
}

.dp--menu-wrapper {
   z-index: 40;
}

.dp--input-icons {
  padding: 0;
}
</style>