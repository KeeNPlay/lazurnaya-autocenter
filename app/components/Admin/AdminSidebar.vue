<script setup lang="ts">
import { useWindowSize } from '@vueuse/core'

const isOpen = ref<boolean>(false)
const lenis = useLenis()
const route = useRoute()

const { logout } = useAdminAuth()

const { width } = useWindowSize()

const isMounted = ref<boolean>(false)

const isLargeScreen = computed<boolean>(() => {
  if (!isMounted.value) return true
  return width.value >= 768
})

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

onMounted((): void => {
  isMounted.value = true
})

onUnmounted((): void => {
  if (import.meta.client) {
    document.body.style.overflow = ''
  }
  lenis?.start()
})
</script>

<template>
  <div>
    <div class="fixed inset-x-0 top-0 z-40 flex items-center justify-between px-2 py-4 md:hidden">
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
        <BaseButton variant="secondary" class="p-0.375" aria-label="Закрыть меню" @click="closeSidebar">
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

      <h3 class="text-orange-500 cursor-default">Заявки</h3>
      <NuxtLink
        to="/admin/inspection"
        class="aside-link"
        active-class="aside-link-active"
      >
        <Icon class="mt-0.5 text-orange-500" name="heroicons:identification-20-solid" />
        Гостехосмотр
      </NuxtLink>
      <NuxtLink
        to="/admin/washing"
        class="aside-link"
        active-class="aside-link-active"
      >
        <Icon class="mt-0.5 text-orange-500" name="heroicons:sparkles-20-solid" />
        Мойка
      </NuxtLink>
      <NuxtLink
        to="/admin/transportation"
        class="aside-link mb-4"
        active-class="aside-link-active"
      >
        <Icon class="mt-0.5 text-orange-500" name="heroicons:truck-20-solid" />
        Грузоперевозки
      </NuxtLink>
      <NuxtLink
        to="/admin/file-manager"
        class="aside-link"
        active-class="aside-link-active"
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