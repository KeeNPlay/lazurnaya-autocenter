<script setup lang="ts">
const currentPage = defineModel<number>({ required: true })

const props = defineProps<{
  totalPages: number
}>()

type PageItem = number | 'ellipsis'

const pages = computed<PageItem[]>(() => {
  const total = props.totalPages
  const current = currentPage.value
  const delta = 1
  const range: PageItem[] = []

  for (let page = 1; page <= total; page++) {
    const isEdge = page === 1 || page === total
    const isNearCurrent = page >= current - delta && page <= current + delta

    if (isEdge || isNearCurrent) {
      range.push(page)
    } else if (range[range.length - 1] !== 'ellipsis') {
      range.push('ellipsis')
    }
  }

  return range
})

function goTo(page: number): void {
  currentPage.value = Math.max(1, Math.min(page, props.totalPages))
}
</script>

<template>
  <div v-if="totalPages > 1" class="flex items-center justify-center gap-x-1">
    <button
      type="button"
      class="rounded-md px-3 py-2 text-sm text-gray-300 hover:bg-gray-150 transition-colors duration-200 disabled:opacity-30 cursor-pointer"
      :disabled="currentPage === 1"
      @click="goTo(currentPage - 1)"
    >
      <Icon name="heroicons:chevron-left-20-solid" />
    </button>

    <template v-for="(page, index) in pages" :key="index">
      <span v-if="page === 'ellipsis'" class="px-2 text-gray-900">...</span>
      <button
        v-else
        type="button"
        class="rounded-md px-3 py-2 text-sm transition-colors duration-200 cursor-pointer"
        :class="page === currentPage ? 'bg-orange-500 text-white' : 'text-gray-900 hover:bg-gray-150'"
        @click="goTo(page)"
      >
        {{ page }}
      </button>
    </template>

    <button
      type="button"
      class="rounded-md px-3 py-2 text-sm text-gray-500 hover:bg-gray-150 transition-colors duration-200 disabled:opacity-30 cursor-pointer"
      :disabled="currentPage === totalPages"
      @click="goTo(currentPage + 1)"
    >
      <Icon name="heroicons:chevron-right-20-solid" />
    </button>
  </div>
</template>