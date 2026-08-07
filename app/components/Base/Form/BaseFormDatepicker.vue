<script setup lang="ts">
import { computed } from 'vue'
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

const disabledWeekDays = [0, 6]
</script>

<template>
  <VueDatePicker
    :model-value="modelValue"
    class="acl-datepicker"
    menu-class-name="acl-datepicker"
    format="dd.MM.yyyy"
    :locale="ru"
    :time-config="{ enableTimePicker: false }"
    :dark="true"
    :min-date="minDate"
    :disabled-week-days="disabledWeekDays"
    auto-apply
    teleport
    @update:model-value="$emit('update:modelValue', $event)"
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
  </VueDatePicker>
</template>