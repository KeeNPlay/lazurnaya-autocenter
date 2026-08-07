<script setup lang="ts">
interface Props {
  modelValue: string
  type?: string
  placeholder?: string
  id?: string
  required?: boolean
}

withDefaults(defineProps<Props>(), { type: 'text' })

defineEmits<{ 'update:modelValue': [value: string] }>()
</script>

<template>
  <input
    :id="id"
    :type="type"
    :value="modelValue"
    :placeholder="placeholder"
    :required="required"
    class="w-full bg-transparent border-b border-gray-200 pb-1.5 text-gray-900 text-base 2xl:text-lg
           placeholder:text-gray-400 focus:outline-none hover:border-orange-500 focus:border-orange-500 transition-colors duration-200"
    @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
  >
</template>