<script setup lang="ts">

const { isLoading } = usePageLoader()

</script>

<template>
  <div class="min-h-screen bg-gray-100">
    <slot />
  </div>
  
  <BaseLoader v-if="isLoading" />
</template>