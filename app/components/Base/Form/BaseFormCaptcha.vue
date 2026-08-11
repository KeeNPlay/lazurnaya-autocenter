<script setup lang="ts">
const widgetSize = ref('normal')

onMounted(() => {
  if (window.innerWidth < 360) {
    widgetSize.value = 'compact'
  } else {
    widgetSize.value = 'flexible'
  }
})

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
    :data-size="widgetSize"
    language="ru"
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
  />
</template>