<script setup lang="ts">
import type { AdminNotificationVariant } from '~/composables/useAdminNotifications'

interface NotificationConfig {
  icon: string
  bgClass: string
  role: 'alert' | 'status'
  ariaLive: 'assertive' | 'polite'
}

const CONFIG: Record<AdminNotificationVariant, NotificationConfig> = {
  error: {
    icon: 'heroicons:x-circle-20-solid',
    bgClass: 'bg-red-800',
    role: 'alert',
    ariaLive: 'assertive'
  },
  success: {
    icon: 'heroicons:check-circle-20-solid',
    bgClass: 'bg-green-800',
    role: 'status',
    ariaLive: 'polite'
  }
}

const { notifications, dismiss } = useAdminNotifications()
</script>

<template>
  <div class="pointer-events-none fixed inset-x-0 top-4 z-[200] flex flex-col items-center gap-y-2 px-2">
    <TransitionGroup
        enter-active-class="transition-all duration-500 ease-out"
        enter-from-class="opacity-0 -translate-y-32"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition-all duration-500 ease-in"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-32"
        move-class="transition-transform duration-300"
    >
      <div
          v-for="item in notifications"
          :key="item.id"
          :role="CONFIG[item.variant].role"
          :aria-live="CONFIG[item.variant].ariaLive"
          class="pointer-events-auto flex w-full max-w-xl items-center gap-x-2 rounded-lg px-5 py-3 text-sm text-white shadow-lg 2xl:px-6 2xl:py-4 2xl:text-lg"
          :class="CONFIG[item.variant].bgClass"
      >
        <Icon :name="CONFIG[item.variant].icon" class="shrink-0 text-base 2xl:text-xl" />
        <span class="whitespace-pre-line">{{ item.message }}</span>
        <button
            type="button"
            class="ml-auto shrink-0 cursor-pointer opacity-80 transition-opacity duration-200 hover:opacity-100"
            aria-label="Закрыть уведомление"
            @click="dismiss(item.id)"
        >
          <Icon name="heroicons:x-mark-20-solid" class="text-base 2xl:text-xl" />
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>