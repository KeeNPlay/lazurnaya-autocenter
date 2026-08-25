<script setup lang="ts">
import type { RequestStatus } from '~/types/request'

const activeTab = defineModel<RequestStatus>({ required: true })

defineProps<{
  counts: Record<RequestStatus, number>
}>()

interface TabConfig {
  label: string
  value: RequestStatus
  icon: string
  iconClass: string
}

const tabs: readonly TabConfig[] = [
  { label: 'Активные', value: 'active', icon: 'heroicons:bars-3-bottom-left-20-solid', iconClass: 'text-green-500' },
  { label: 'Завершенные', value: 'completed', icon: 'heroicons:check-circle-20-solid', iconClass: 'text-orange-500' },
  { label: 'Отмененные', value: 'cancelled', icon: 'heroicons:x-circle-20-solid', iconClass: 'text-red-500' }
]
</script>

<template>
  <div class="flex flex-wrap gap-x-3 gap-y-2">
    <button
      v-for="tab in tabs"
      :key="tab.value"
      type="button"
      class="flex items-center gap-x-2 rounded-md px-4 py-2.5 text-sm font-medium transition-colors duration-200 cursor-pointer"
      :class="activeTab === tab.value ? 'bg-orange-500 text-white' : 'bg-gray-150 text-gray-900 hover:bg-gray-150/70'"
      @click="activeTab = tab.value"
    >
      <Icon :name="tab.icon" :class="activeTab === tab.value ? 'text-white' : tab.iconClass" />
      {{ tab.label }}
      <span class="rounded-full bg-black/20 px-1.5 py-0.5 text-xs">{{ counts[tab.value] }}</span>
    </button>
  </div>
</template>