<script setup lang="ts">
interface Props {
  modelValue: string | undefined
}

defineProps<Props>()
defineEmits<{ 'update:modelValue': [value: string | undefined] }>()
</script>

<template>
  <NuxtTurnstile
    class="w-full"
    theme="dark"
    size="compact"
    language="ru"
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
  />
</template>