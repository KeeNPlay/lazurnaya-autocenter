<script setup lang="ts">
const { isLoading } = usePageLoader()

</script>

<template>
  <div class="flex min-h-screen font-sans bg-gray-100 text-white">
    <AdminSidebar />

    <main class="flex-1 py-6">
      <slot />
    </main>

    <BaseLoader v-if="isLoading" />
  </div>
</template>