<script setup lang="ts">
interface Props {
  modelValue: string
  placeholder?: string
  id?: string
  rows?: number
}

withDefaults(defineProps<Props>(), { rows: 1 })
defineEmits<{ 'update:modelValue': [value: string] }>()
</script>

<template>
  <textarea
    :id="id"
    :value="modelValue"
    :placeholder="placeholder"
    :rows="rows"
    class="w-full bg-transparent border-b border-gray-200 pb-1.5 text-gray-900 text-base 2xl:text-lg
           placeholder:text-gray-400 focus:outline-none hover:border-orange-500 focus:border-orange-500
           transition-colors duration-200 field-sizing-content resize-none"
    @input="$emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
  />
</template>