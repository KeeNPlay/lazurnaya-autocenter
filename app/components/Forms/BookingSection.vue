<script setup lang="ts">
import { ref, computed } from 'vue'
import { BOOKING_TABS, DEFAULT_BOOKING_TAB, type BookingTab } from '~/constants/booking'

interface Props {
  defaultTab?: BookingTab
}

const props = withDefaults(defineProps<Props>(), {
  defaultTab: DEFAULT_BOOKING_TAB
})

const activeTab = ref<BookingTab>(props.defaultTab)

const scheduleText = computed<string>(() =>
  activeTab.value === 'inspection'
    ? 'График работы гостехосмотра:\n8:30–12:45, 13:30–16:45 · шаг 15 минут\nСуббота, Воскресенье – выходной'
    : 'График работы мойки:\n8:00 - 16:00\nСуббота, Воскресенье - выходной'
)
</script>

<template>
  <section class="flex flex-col mx-4 lg:mx-0" aria-label="Форма записи" id="form">
    <BaseFormHeader title="Автоцентр на Лазурной" :description="scheduleText" class="py-12.5 lg:py-25 2xl:py-30">
      <template #tabs>
        <BaseFormTabs v-model="activeTab" :tabs="BOOKING_TABS" />
      </template>
    </BaseFormHeader>

    <div class="px-0 lg:px-55 2xl:px-67 border-0 lg:border border-gray-150">
      <FormsInspectionForm v-if="activeTab === 'inspection'" />
      <FormsWashingForm v-else />
    </div>
  </section>
</template>