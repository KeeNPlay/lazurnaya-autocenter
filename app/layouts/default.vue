<script setup lang="ts">
import { watch } from 'vue'

const { isOpen, closeModal } = useBookingModal()
const route = useRoute()

// Закрываем модалку автоматически при переходе на другую страницу
watch(
  () => route.fullPath,
  () => closeModal()
)
</script>

<template>
  <div class="flex flex-col min-h-screen font-sans dark dark:bg-gray-100 dark:text-white">
    <AppHeader />
    <main class="lg:px-20 2xl:px-40.5">
      <NuxtPage />
    </main>
    <AppFooter />

    <BaseModal :model-value="isOpen" title="Онлайн-запись" @update:model-value="closeModal">
      <FormsBookingSection class="bg-gray-100" />
    </BaseModal>
  </div>
</template>