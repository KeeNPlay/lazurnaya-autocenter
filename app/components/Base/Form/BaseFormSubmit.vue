<script setup lang="ts">
interface Props {
  loading?: boolean
  disabled?: boolean
}

defineProps<Props>()
</script>

<template>
  <BaseButton type="submit" variant="primary" :disabled="disabled || loading">
    <Icon v-if="loading" name="heroicons:arrow-path-20-solid" class="animate-spin" />
    <slot>Отправить заявку</slot>
  </BaseButton>
</template>