<script setup lang="ts">
const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  close: []
  openModal: []
}>()

const route = useRoute()
const lenis = useLenis()

watchEffect((): void => {
  if (import.meta.client) {
    document.body.style.overflow = props.isOpen ? 'hidden' : ''
  }

  if (props.isOpen) {
    lenis?.stop()
  } else {
    lenis?.start()
  }
})

onMounted((): void => {
  const onEsc = (e: KeyboardEvent): void => {
    if (e.key === 'Escape' && props.isOpen) {
      emit('close')
    }
  }

  window.addEventListener('keydown', onEsc)
  onUnmounted((): void => {
    window.removeEventListener('keydown', onEsc)
    lenis?.start()
  })
})

watch(route, (): void => emit('close'))
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isOpen"
        class="fixed inset-0 z-60 bg-black/50"
        aria-hidden="true"
        @click="emit('close')"
      />
    </Transition>

    <Transition
      enter-active-class="transition-transform duration-300 ease-out"
      enter-from-class="-translate-x-full"
      enter-to-class="translate-x-0"
      leave-active-class="transition-transform duration-200 ease-in"
      leave-from-class="translate-x-0"
      leave-to-class="-translate-x-full"
    >
        <div
        v-if="isOpen"
        role="dialog"
        aria-modal="true"
        aria-label="Меню навигации"
        class="fixed inset-y-0 left-0 z-60 flex flex-col w-full bg-gray-100 sm:w-4/5 sm:max-w-sm"
        >
        <div class="flex items-center justify-between text-white border-b box-border px-4 border-gray-150 py-5">
          <AppLogo>АВТОЦЕНТР НА ЛАЗУРНОЙ</AppLogo>

          <BaseButton
            class="p-0.375"
            variant="secondary"
            aria-label="Закрыть меню"
            @click="emit('close')"
          >
            <Icon name="heroicons:x-mark" class="text-[1.25rem] text-orange-800" />
          </BaseButton>
        </div>
        <div class="px-4">
          <AppHeaderLinks class="flex flex-col gap-y-4 py-4 text-white" />

          <BaseButton
            width="full"
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