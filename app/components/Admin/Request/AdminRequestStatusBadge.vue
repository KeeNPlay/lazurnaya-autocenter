<script setup lang="ts">
import type { RequestStatus } from '~/types/request'
import { REQUEST_STATUS_LABELS } from '~/types/request'

const props = defineProps<{ status: RequestStatus }>()

const statusClasses: Readonly<Record<RequestStatus, string>> = {
  active: 'bg-orange-500/10 text-orange-500',
  completed: 'bg-green-500/10 text-green-500',
  cancelled: 'bg-red-500/10 text-red-500'
}

const badgeClass = computed<string>(() => statusClasses[props.status])
const label = computed<string>(() => REQUEST_STATUS_LABELS[props.status])
</script>

<template>
  <span class="rounded-full px-2.5 py-1 text-xs font-medium" :class="badgeClass">
    {{ label }}
  </span>
</template>