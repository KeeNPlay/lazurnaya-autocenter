<script setup lang="ts">
import { watch } from 'vue'

interface Props {
  modelValue: boolean
  title?: string
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false
})

const emit = defineEmits<{ 'update:modelValue': [value: boolean] }>()

const { lock, unlock } = useScrollLock()

const close = (): void => {
  emit('update:modelValue', false)
}

const handleKeydown = (event: KeyboardEvent): void => {
  if (event.key === 'Escape') {
    close()
  }
}

watch(
    () => props.modelValue,
    (isOpen) => {
      if (isOpen) {
        lock({ fixBody: true })
        document.addEventListener('keydown', handleKeydown)
      } else {
        unlock()
        document.removeEventListener('keydown', handleKeydown)
      }
    }
)

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <!-- The dimming is the background of the scroll container itself: no nested fixed element -->
      <div
          v-if="modelValue"
          data-lenis-prevent
          class="fixed inset-0 z-100 overflow-y-auto overscroll-contain bg-black/50"
          role="dialog"
          aria-modal="true"
          :aria-label="title"
          @click.self="close"
      >
        <div
            class="flex min-h-full items-start justify-center lg:px-20 2xl:px-40.5 py-0 md:py-10"
            @click.self="close"
        >
          <div class="relative my-auto">
            <BaseLoader v-if="loading" />

            <slot />
            <BaseButton
                variant="transparent"
                type="button"
                class="absolute top-4 right-4 transition-colors cursor-pointer"
                aria-label="Закрыть окно"
                @click="close"
            >
              <Icon name="heroicons:x-mark" class="text-2xl" />
            </BaseButton>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity .5s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>