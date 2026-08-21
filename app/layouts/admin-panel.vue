<script setup lang="ts">
const { isLoading } = usePageLoader()
</script>

<template>
  <div class="flex min-h-screen font-sans bg-gray-100 text-white">
    <AdminSidebar />

    <main class="flex-1 px-2 py-6 md:px-4">
      <slot />
    </main>

    <BaseLoader v-if="isLoading" />
  </div>
</template>