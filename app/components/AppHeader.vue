<script setup lang="ts">
import { ref } from 'vue';
const isMenuOpen = ref<boolean>(false);
const isModalOpen = ref<boolean>(false);

    const openMenu = () => (isMenuOpen.value = true)
    const closeMenu = () => (isMenuOpen.value = false)
</script>

<template>
    <header class="fixed inset-x-0 top-0 z-10 px-4 py-5 border-b box-border border-gray-150 lg:px-20 2xl:px-40.5">
        <div class="flex items-center justify-between">
            <AppLogo>АВТОЦЕНТР НА ЛАЗУРНОЙ</AppLogo>
            <AppHeaderLinks class="hidden lg:flex"/>
            <BaseButton
                class="hidden lg:flex"
                @click="isModalOpen = true"
            >
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
            />
        </div>
    </header>
</template>