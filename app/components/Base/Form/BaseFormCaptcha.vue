<script setup lang="ts">
import { useWindowSize } from '@vueuse/core'

interface Props {
  modelValue: string | undefined
}

defineProps<Props>()
const emit = defineEmits<{ 'update:modelValue': [value: string | undefined] }>()

type WidgetSize = 'normal' | 'compact' | 'flexible'

const isReady = ref<boolean>(false)
const widgetSize = ref<WidgetSize>('flexible')
const resetNonce = ref<number>(0)

const { width } = useWindowSize()

const widgetKey = computed((): string => `turnstile-${widgetSize.value}-${resetNonce.value}`)

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

function reset(): void {
  emit('update:modelValue', undefined)
  resetNonce.value++
}

defineExpose({ reset })
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