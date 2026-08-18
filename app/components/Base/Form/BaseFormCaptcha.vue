<script setup lang="ts">
import { useWindowSize } from '@vueuse/core'

interface Props {
  modelValue: string | undefined
}

defineProps<Props>()
defineEmits<{ 'update:modelValue': [value: string | undefined] }>()

type WidgetSize = 'normal' | 'compact' | 'flexible'

const isReady = ref<boolean>(false)
const widgetSize = ref<WidgetSize>('flexible')

const { width } = useWindowSize()

const widgetKey = computed((): string => `turnstile-${widgetSize.value}`)

watch(
  width,
  (newWidth): void => {
    widgetSize.value = newWidth < 440 ? 'compact' : 'flexible'
  },
  { immediate: true }
)

onMounted((): void => {
  isReady.value = true
})
</script>

<template>
  <NuxtTurnstile
    v-if="isReady"
    :key="widgetKey"
    class="w-full"
    theme="dark"
    :data-size="widgetSize"
    language="ru"
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
  />
</template>