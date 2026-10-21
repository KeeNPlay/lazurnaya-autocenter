<script setup lang="ts" generic="T">
import { useWindowSize } from '@vueuse/core'

type VisibleCount = 1 | 2 | 3 | 4

interface Props {
  items: T[]
  visibleCount?: VisibleCount
  ariaLabel?: string
}

const props = withDefaults(defineProps<Props>(), {
  visibleCount: 3,
  ariaLabel: 'Карусель'
})

defineSlots<{
  item(props: { item: T; index?: number }): unknown
}>()

const currentIndex = ref<number>(0)
const isDragging = ref<boolean>(false)
const dragStartX = ref<number>(0)
const dragOffset = ref<number>(0)

const isMounted = ref<boolean>(false)

const { width: windowWidth } = useWindowSize()

const cardWidthClasses: Record<VisibleCount, string> = {
  1: 'w-full',
  2: 'w-full md:w-1/2',
  3: 'w-full md:w-1/2 xl:w-1/3',
  4: 'w-full md:w-1/2 xl:w-1/4'
}

const computedCardWidthClass = computed((): string => {
  return cardWidthClasses[props.visibleCount]
})

const computedVisibleCount = computed((): number => {
  if (!isMounted.value) return 1

  let count = 1
  if (windowWidth.value >= 1280) count = props.visibleCount
  else if (windowWidth.value >= 768) count = 2

  return Math.max(1, count)
})

const isSlideVisible = (index: number): boolean => {
  return index >= currentIndex.value && index < currentIndex.value + computedVisibleCount.value
}

const computedMaxIndex = computed((): number => {
  return Math.max(0, props.items.length - computedVisibleCount.value)
})

const computedCardWidth = computed((): number => 100 / computedVisibleCount.value)

const computedTranslateX = computed((): string => {
  const base = currentIndex.value * computedCardWidth.value
  return `translateX(calc(-${base}% + ${dragOffset.value}px))`
})

function goTo(index: number): void {
  if (isDragging.value) return
  if (!Number.isFinite(index)) return
  currentIndex.value = Math.max(0, Math.min(index, computedMaxIndex.value))
}

function prev(): void {
  goTo(currentIndex.value - 1)
}

function next(): void {
  goTo(currentIndex.value + 1)
}

const canPrev = computed((): boolean => currentIndex.value > 0)
const canNext = computed((): boolean => currentIndex.value < computedMaxIndex.value)

function onMouseDown(e: MouseEvent): void {
  isDragging.value = true
  dragStartX.value = e.clientX
  dragOffset.value = 0
}

function onMouseMove(e: MouseEvent): void {
  if (!isDragging.value) return
  dragOffset.value = e.clientX - dragStartX.value
}

function onMouseUp(): void {
  if (!isDragging.value) return
  handleDragEnd()
}

function onTouchStart(e: TouchEvent): void {
  const touch = e.touches[0]
  if (!touch) return
  isDragging.value = true
  dragStartX.value = touch.clientX
  dragOffset.value = 0
}

function onTouchMove(e: TouchEvent): void {
  if (!isDragging.value) return
  const touch = e.touches[0]
  if (!touch) return
  if (e.cancelable) e.preventDefault()
  dragOffset.value = touch.clientX - dragStartX.value
}

function onTouchEnd(): void {
  if (!isDragging.value) return
  handleDragEnd()
}

function handleDragEnd(): void {
  const threshold = 80
  const offset = dragOffset.value
  isDragging.value = false
  dragOffset.value = 0
  if (offset < -threshold) next()
  else if (offset > threshold) prev()
}

onMounted((): void => {
  isMounted.value = true
  window.addEventListener('mouseup', onMouseUp)
  window.addEventListener('mousemove', onMouseMove, { passive: true })
})

onUnmounted((): void => {
  window.removeEventListener('mouseup', onMouseUp)
  window.removeEventListener('mousemove', onMouseMove)
})

watch(computedMaxIndex, (max: number): void => {
  if (currentIndex.value > max) currentIndex.value = max
})
</script>

<template v-if="items.length > 0">
  <section
    class="relative w-full overflow-hidden select-none border border-gray-150"
    :aria-label="ariaLabel"
    aria-roledescription="карусель"
  >
    <button
      class="absolute z-10 h-full px-2 2xl:px-5.5 bg-linear-to-r from-gray-500/0 to-gray-500/0 text-gray-300 transition-all duration-200"
      :class="canPrev ? 'opacity-100 hover:from-gray-500/10 hover:text-gray-500 cursor-pointer' : 'opacity-20'"
      :disabled="!canPrev"
      aria-label="Предыдущий"
      @click="prev"
    >
      <Icon name="heroicons:chevron-left-solid" class="text-[1.25rem]" aria-hidden="true" />
    </button>

    <button
      class="absolute right-0 z-10 h-full px-2 2xl:px-5.5 bg-linear-to-l from-gray-500/0 to-gray-500/0 text-gray-300 transition-all duration-200"
      :class="canNext ? 'opacity-100 hover:from-gray-500/10 hover:text-gray-600 cursor-pointer' : 'opacity-20'"
      :disabled="!canNext"
      aria-label="Следующий"
      @click="next"
    >
      <Icon name="heroicons:chevron-right-solid" class="text-[1.25rem]" aria-hidden="true" />
    </button>

    <div
      class="flex divide-x divide-gray-150 touch-action-none"
      aria-live="polite"
      :style="{
        transform: computedTranslateX,
        transition: isDragging ? 'none' : 'transform 0.4s ease',
        cursor: isDragging ? 'grabbing' : 'grab'
      }"
      @mousedown="onMouseDown"
      @touchstart="onTouchStart"
      @touchmove="onTouchMove"
      @touchend="onTouchEnd"
      @dragstart.prevent
    >
      <article
        v-for="(item, index) in items"
        :key="index"
        class="shrink-0 px-4"
        :class="computedCardWidthClass"
        role="group"
        aria-roledescription="слайд"
        :aria-label="`Слайд ${index + 1} из ${items.length}`"
        :aria-hidden="!isSlideVisible(index)"
        :inert="!isSlideVisible(index)"
      >
        <slot name="item" :item="item" />
      </article>
    </div>
  </section>
</template>