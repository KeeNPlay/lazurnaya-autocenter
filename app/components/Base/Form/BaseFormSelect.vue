<script setup lang="ts">
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
}

defineProps<Props>()
defineEmits<{ 'update:modelValue': [value: string] }>()
</script>

<template>
  <select
    :id="id"
    :value="modelValue"
    :required="required"
    class="w-full border-b border-gray-200 pb-1.5 text-gray-400 valid:text-gray-900 text-base 2xl:text-lg
           focus:outline-none hover:border-orange-500 focus:border-orange-500 transition-colors duration-200"
    @change="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
  >
    <option class="text-gray-900" value="" disabled hidden>{{ placeholder }}</option>
    <option class="text-gray-900 bg-gray-150" v-for="opt in options" :key="opt.value" :value="opt.value">
      {{ opt.label }}
    </option>
  </select>
</template>