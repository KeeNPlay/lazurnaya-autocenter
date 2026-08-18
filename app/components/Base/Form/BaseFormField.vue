<script setup lang="ts">
interface Props {
  label: string
  for?: string
  required?: boolean
}

defineProps<Props>()
</script>

<template>
  <div class="flex flex-col px-6 py-4 lg:px-7.5 lg:py-5 2xl:px-10 2xl:py-6 gap-y-3 lg:gap-y-4 2xl:gap-y-5 bg-gray-150/50 border border-gray-150 rounded-md 2xl:rounded-lg">
    <label :for="for" class="text-white text-base lg:text-lg 2xl:text-2xl font-medium">
      {{ label }}<span v-if="required" class="text-orange-500"> *</span>
    </label>
    <slot />
  </div>
</template>