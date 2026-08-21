<script setup lang="ts">

const { isOpen, closeModal } = useBookingModal()
const { isLoading, loaderVariant } = usePageLoader()
const route = useRoute()

watch(
  () => route.fullPath,
  () => closeModal()
)
</script>

<template>
  <div class="flex flex-col min-h-screen font-sans bg-gray-100 text-white">
    <AppHeader />
    <main class="lg:px-20 2xl:px-40.5">
      <NuxtPage />
    </main>
    <AppFooter />

    <BaseLoader v-if="isLoading" :variant="loaderVariant" />

    <BaseModal :model-value="isOpen" title="Онлайн-запись" @update:model-value="closeModal">
      <FormsBookingSection class="bg-gray-100"/>
    </BaseModal>
  </div>
</template>