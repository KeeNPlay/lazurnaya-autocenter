<script setup lang="ts">
const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  close: []
  openModal: []
}>()

const route = useRoute()
const { headerHeight } = useHeaderHeight()
const { lock, unlock } = useScrollLock()

// The bottom edge is bound via `bottom-0` (not 100vh): on iOS 100vh is taller than the visible area
const menuStyle = computed(() => ({
  top: `${headerHeight.value}px`
}))

watch(
    () => props.isOpen,
    (isOpen): void => {
      if (isOpen) lock()
      else unlock()
    }
)

onMounted((): void => {
  const onEsc = (e: KeyboardEvent): void => {
    if (e.key === 'Escape' && props.isOpen) {
      emit('close')
    }
  }

  window.addEventListener('keydown', onEsc)
  onUnmounted((): void => {
    window.removeEventListener('keydown', onEsc)
  })
})

watch(route, (): void => emit('close'))
</script>

<template>
  <Teleport to="body">
    <Transition
        enter-active-class="transition-transform duration-400 ease-out"
        enter-from-class="-translate-y-full"
        enter-to-class="translate-y-0"
        leave-active-class="transition-transform duration-300 ease-in"
        leave-from-class="translate-y-0"
        leave-to-class="-translate-y-full"
    >
      <div
          v-if="isOpen"
          role="dialog"
          aria-modal="true"
          aria-label="Меню навигации"
          class="fixed inset-x-0 bottom-0 z-40 flex flex-col overflow-y-auto overscroll-contain bg-gray-100 will-change-transform"
          :style="menuStyle"
      >
        <div class="flex flex-1 flex-col px-4 pt-6 pb-20">
          <AppHeaderLinks class="flex flex-col gap-y-4 text-white" />

          <BaseButton
              class="mt-auto"
              @click="() => {
              emit('close')
              emit('openModal')
            }"
          >
            Онлайн-запись
          </BaseButton>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>