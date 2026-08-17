<script setup lang="ts">
import type { LoaderVariant } from '~/composables/usePageLoader'

interface Props {
  variant?: LoaderVariant
}

withDefaults(defineProps<Props>(), {
  variant: 'fullscreen'
})

const { headerHeight } = useHeaderHeight()
</script>

<template>
  <div
    v-if="variant === 'fullscreen'"
    class="fixed inset-0 z-200 flex items-center justify-center bg-gray-100"
    role="status"
    aria-live="polite"
    aria-label="Загрузка"
  >
    <Icon name="custom-icons:app-logo" class="logo-shimmer text-6xl text-white" aria-hidden="true" />
    <span class="sr-only">Загрузка...</span>
  </div>

  <div
    v-else
    class="fixed inset-x-0 bottom-0 z-40 flex items-center justify-center bg-gray-100"
    :style="{ top: `${headerHeight}px` }"
    role="status"
    aria-live="polite"
    aria-label="Загрузка"
  >
    <Icon name="custom-icons:app-logo" class="logo-shimmer text-6xl text-white" aria-hidden="true"/>
    <span class="sr-only">Загрузка...</span>
  </div>
</template>

<style scoped>
.logo-shimmer {
  animation: logo-shimmer 1.4s ease-in-out infinite;
}

@keyframes logo-shimmer {
  0%, 100% {
    opacity: 0.4;
    transform: scale(0.92);
    filter: drop-shadow(0 0 0px var(--color-orange-500));
  }
  50% {
    opacity: 1;
    transform: scale(1.05);
    filter: drop-shadow(0 0 18px var(--color-orange-500));
  }
}
</style>