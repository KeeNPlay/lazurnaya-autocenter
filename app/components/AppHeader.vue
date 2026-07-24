<script setup lang="ts">
import { ref } from 'vue';
const isModalOpen = ref<boolean>(false);
</script>

<template>
    <header class="fixed inset-x-0 top-0 z-10 px-20 py-5 border-b box-border border-gray-150 2xl:px-40.5">
        <div class="flex items-center justify-between">
            <AppLogo>АВТОЦЕНТР НА ЛАЗУРНОЙ</AppLogo>
            <AppHeaderLinks />
            <BaseButton

                @click="isModalOpen == true"
            >
                Онлайн-запись
            </BaseButton>
        </div>
    </header>
</template>