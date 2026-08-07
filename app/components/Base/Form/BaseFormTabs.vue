<script setup lang="ts">
interface Tab {
  label: string
  value: string
}

interface Props {
  modelValue: string
  tabs: Tab[]
}

defineProps<Props>()
defineEmits<{ 'update:modelValue': [value: string] }>()
</script>

<template>
  <div class="flex" role="tablist">
    <BaseButton
      v-for="tab in tabs"
      :key="tab.value"
      type="button"
      role="tab"
      width="fixed"
      fixedWidthClass="140px"
      class="w-35 lg:w-40 2xl:w-50 first:rounded-r-none last:rounded-l-none"
      :aria-selected="modelValue === tab.value"
      :variant="modelValue === tab.value
        ? 'primary'
        : 'secondary'"
      @click="$emit('update:modelValue', tab.value)"
    >
      {{ tab.label }}
    </BaseButton>
  </div>
</template>