<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const { openModal } = useBookingModal()
const { headerHeight } = useHeaderHeight()

const isMenuOpen = ref<boolean>(false)
const headerRef = ref<HTMLElement | null>(null)

let resizeObserver: ResizeObserver | null = null

const openMenu = (): void => {
  isMenuOpen.value = true
}

const closeMenu = (): void => {
  isMenuOpen.value = false
}

onMounted(() => {
  if (!headerRef.value) return

  const updateHeight = (): void => {
    headerHeight.value = headerRef.value?.offsetHeight ?? 0
  }

  updateHeight()

  resizeObserver = new ResizeObserver(updateHeight)
  resizeObserver.observe(headerRef.value)
})

onUnmounted(() => {
  resizeObserver?.disconnect()
})
</script>

<template>
    <header 
        ref="headerRef"
        class="sticky inset-x-0 top-0 z-50 px-4 py-5 border-b box-border border-gray-150 dark:bg-gray-100 lg:px-20 2xl:px-40.5"
    >
        <div class="flex items-center justify-between">
            <NuxtLink to="/">
                <AppLogo>АВТОЦЕНТР НА ЛАЗУРНОЙ</AppLogo>
            </NuxtLink>
            <AppHeaderLinks class="hidden lg:flex" />
            <BaseButton class="hidden lg:flex" @click="openModal">
                Онлайн-запись
            </BaseButton>
            <BaseButton
                class="inline-flex lg:hidden"
                variant="secondary"
                aria-label="Открыть меню"
                @click="openMenu"
            >
                <Icon name="heroicons:bars-3" class="text-[1.25rem] text-orange-800" />
            </BaseButton>

            <AppBurgerMenu
                :is-open="isMenuOpen"
                @close="closeMenu"
                @open-modal="openModal"
            />
        </div>
    </header>
</template>