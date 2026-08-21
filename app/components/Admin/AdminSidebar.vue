<script setup lang="ts">
import { useWindowSize } from '@vueuse/core'

const isOpen = ref<boolean>(false)
const lenis = useLenis()
const route = useRoute()

const { logout } = useAdminAuth()

const { width } = useWindowSize()

/**
 * Определяем "десктопный" брейкпоинт вручную, чтобы корректно
 * управлять :inert — на больших экранах сайдбар всегда статично
 * видим и должен оставаться интерактивным независимо от isOpen
 * (который актуален только для мобильного slide-in поведения).
 */
const isLargeScreen = computed<boolean>(() => width.value >= 1024)

const toggleSidebar = (): void => {
  isOpen.value = !isOpen.value
}

const closeSidebar = (): void => {
  isOpen.value = false
}

async function onLogout(): Promise<void> {
  logout()
  closeSidebar()
  await navigateTo('/admin/login')
}

watchEffect((): void => {
  if (import.meta.client) {
    document.body.style.overflow = isOpen.value ? 'hidden' : ''
  }

  if (isOpen.value) {
    lenis?.stop()
  } else {
    lenis?.start()
  }
})

watch(route, (): void => closeSidebar())

onUnmounted((): void => {
  if (import.meta.client) {
    document.body.style.overflow = ''
  }
  lenis?.start()
})
</script>

<template>
  <div>
    <div class="flex items-center justify-between px-2 py-4 md:px-4 md:py-8 md:hidden">
      <BaseButton
        variant="secondary"
        aria-label="Открыть меню"
        aria-haspopup="dialog"
        :aria-expanded="isOpen"
        @click="toggleSidebar"
      >
        <Icon name="heroicons:bars-3" class="text-[1.25rem] text-orange-800" />
      </BaseButton>
    </div>

    <aside
      role="navigation"
      aria-label="Навигация админ-панели"
      class="fixed inset-y-0 left-0 z-50 flex w-full flex-col gap-y-2 bg-gray-100 px-2 py-4 md:px-4 md:py-8
             transition-transform duration-300 ease-in-out h-full
             md:static md:z-auto md:w-64 md:shrink-0 md:translate-x-0 md:border-r md:border-gray-150"
      :class="isOpen ? 'translate-x-0' : '-translate-x-full'"
      :inert="!isOpen && !isLargeScreen"
    >
      <div class="mb-4 flex items-center justify-between md:hidden">
        <span class="text-white font-medium">Меню</span>
        <BaseButton
          variant="secondary"
          class="p-0.375"
          aria-label="Закрыть меню"
          @click="closeSidebar"
        >
          <Icon name="heroicons:x-mark" class="text-[1.25rem] text-orange-800" />
        </BaseButton>
      </div>

      <NuxtLink
        to="/"
        class="mb-4 flex items-center gap-x-1 text-sm text-gray-400 transition-colors duration-200 hover:text-white 2xl:text-lg"
      >
        <Icon class="mt-0.5" name="heroicons:arrow-left-20-solid" />
        Вернуться на сайт
      </NuxtLink>

      <NuxtLink
        to="/admin/dashboard"
        class="flex items-center gap-x-2 text-white transition-colors duration-200 hover:text-orange-700"
      >
        <Icon class="mt-0.5 text-orange-500" name="heroicons:document-duplicate-20-solid" />
        Заявки
      </NuxtLink>
      <NuxtLink
        to="/admin/transportation-calculator"
        class="flex items-center gap-x-2 text-white transition-colors duration-200 hover:text-orange-700"
      >
        <Icon class="mt-0.5 text-orange-500" name="heroicons:calculator-20-solid" />
        Грузоперевозки
      </NuxtLink>
      <NuxtLink
        to="/admin/file-manager"
        class="flex items-center gap-x-2 text-white transition-colors duration-200 hover:text-orange-700"
      >
        <Icon class="mt-0.5 text-orange-500" name="heroicons:newspaper-20-solid" />
        Управление файлами
      </NuxtLink>

      <BaseButton class="mt-auto" @click="onLogout">
        Выйти
      </BaseButton>
    </aside>
  </div>
</template>