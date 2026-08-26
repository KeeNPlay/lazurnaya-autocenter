<script setup lang="ts">
import type { RequestStatus } from '~/types/request'
import { ALL_REQUEST_STATUSES } from '~/types/request'

const activeTab = defineModel<RequestStatus>({ required: true })

const props = withDefaults(
  defineProps<{
    counts: Record<RequestStatus, number>
    statuses?: readonly RequestStatus[]
  }>(),
  {
    statuses: () => ALL_REQUEST_STATUSES
  }
)

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

const visibleTabs = computed<readonly TabConfig[]>(() =>
  tabs.filter((tab) => props.statuses.includes(tab.value))
)
</script>

<template>
  <div class="flex flex-wrap gap-x-3 gap-y-2">
    <BaseButton
      v-for="tab in visibleTabs"
      :key="tab.value"
      variant="secondary"
      :class="activeTab === tab.value ? 'bg-orange-500 hover:bg-orange-500 text-white' : 'bg-gray-150 text-gray-900 hover:bg-gray-150/70'"
      @click="activeTab = tab.value"
    >
      <template #icon-left>
        <Icon :name="tab.icon" :class="activeTab === tab.value ? 'text-white' : tab.iconClass" />
      </template>
      {{ tab.label }}
      <span class="rounded-full bg-black/20 px-1.5 py-0.5 text-xs">{{ counts[tab.value] }}</span>
    </BaseButton>
  </div>
</template>