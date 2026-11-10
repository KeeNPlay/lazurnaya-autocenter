<script setup lang="ts" generic="T">
import { useResizeObserver } from '@vueuse/core'

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

const scrollerRef = ref<HTMLElement | null>(null)
const canPrev = ref<boolean>(false)
const canNext = ref<boolean>(false)

const cardWidthClasses: Record<VisibleCount, string> = {
  1: 'w-full',
  2: 'w-full md:w-1/2',
  3: 'w-full md:w-1/2 xl:w-1/3',
  4: 'w-full md:w-1/2 xl:w-1/4'
}

const computedCardWidthClass = computed((): string => cardWidthClasses[props.visibleCount])

// Tolerance for fractional scroll values on high-DPI screens
const EDGE_TOLERANCE = 2
// Distance after which a mouse press turns into a drag (so that a regular click still works)
const DRAG_START_DISTANCE = 5
// Drag distance that flips the slider to the next/previous card
const SWIPE_THRESHOLD = 80

// Snap is toggled imperatively: a reactive class is applied one tick too late
function setSnap(enabled: boolean): void {
  const el = scrollerRef.value
  if (!el) return
  // '' removes the inline override, so the snap-x snap-mandatory classes apply again
  el.style.scrollSnapType = enabled ? '' : 'none'
}

let rafId: number | null = null

function cancelAnimation(): void {
  if (rafId === null) return
  cancelAnimationFrame(rafId)
  rafId = null
  setSnap(true)
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3)
}

function animateTo(left: number): void {
  const el = scrollerRef.value
  if (!el) return

  cancelAnimation()

  const from = el.scrollLeft
  const distance = left - from

  if (Math.abs(distance) < 1) {
    // Nothing to animate, but snap may still be off after a drag
    setSnap(true)
    return
  }

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const duration = reduceMotion ? 0 : Math.min(500, Math.max(250, Math.abs(distance) * 0.6))

  setSnap(false)
  const startTime = performance.now()

  const tick = (now: number): void => {
    const t = duration === 0 ? 1 : Math.min(1, (now - startTime) / duration)
    el.scrollLeft = from + distance * easeOutCubic(t)

    if (t < 1) {
      rafId = requestAnimationFrame(tick)
    } else {
      rafId = null
      setSnap(true)
    }
  }

  rafId = requestAnimationFrame(tick)
}

function getStep(): number {
  const el = scrollerRef.value
  if (!el) return 0
  const card = el.firstElementChild as HTMLElement | null
  // getBoundingClientRect gives a fractional width (offsetWidth rounds it)
  return card ? card.getBoundingClientRect().width : el.clientWidth
}

function clampScroll(left: number): number {
  const el = scrollerRef.value
  if (!el) return 0
  return Math.max(0, Math.min(left, el.scrollWidth - el.clientWidth))
}

function updateEdges(): void {
  const el = scrollerRef.value
  if (!el) return

  canPrev.value = el.scrollLeft > EDGE_TOLERANCE
  canNext.value = el.scrollLeft + el.clientWidth < el.scrollWidth - EDGE_TOLERANCE
}

function scrollByCard(direction: 1 | -1): void {
  const el = scrollerRef.value
  const step = getStep()
  if (!el || !step) return

  const currentIndex = Math.round(el.scrollLeft / step)
  animateTo(clampScroll((currentIndex + direction) * step))
}

function prev(): void {
  scrollByCard(-1)
}

function next(): void {
  scrollByCard(1)
}

// Mouse drag (touch is handled natively by the browser)

const isDragging = ref<boolean>(false)

let isPointerDown = false
let hasMoved = false
let startX = 0
let startScrollLeft = 0
let activePointerId: number | null = null

function onPointerDown(e: PointerEvent): void {
  if (e.pointerType !== 'mouse' || e.button !== 0) return

  const el = scrollerRef.value
  if (!el) return

  cancelAnimation()

  isPointerDown = true
  hasMoved = false
  startX = e.clientX
  startScrollLeft = el.scrollLeft
  activePointerId = e.pointerId
}

function onPointerMove(e: PointerEvent): void {
  if (!isPointerDown || e.pointerType !== 'mouse') return

  const el = scrollerRef.value
  if (!el) return

  // The button was released outside the window, so we didn't get pointerup
  if (e.buttons === 0) {
    finishDrag(e.clientX)
    return
  }

  const dx = e.clientX - startX

  if (!isDragging.value) {
    if (Math.abs(dx) < DRAG_START_DISTANCE) return
    isDragging.value = true
    hasMoved = true
    setSnap(false) // before the first scrollLeft write, otherwise it snaps back
    // Capture the pointer so that the drag continues outside the slider
    if (activePointerId !== null) el.setPointerCapture(activePointerId)
  }

  el.scrollLeft = startScrollLeft - dx
}

function finishDrag(endX: number): void {
  const el = scrollerRef.value

  if (activePointerId !== null && el?.hasPointerCapture(activePointerId)) {
    el.releasePointerCapture(activePointerId)
  }

  const wasDragging = isDragging.value
  isPointerDown = false
  activePointerId = null
  isDragging.value = false

  if (!wasDragging || !el) return

  const step = getStep()
  if (!step) {
    setSnap(true)
    return
  }

  const dx = endX - startX
  const startIndex = Math.round(startScrollLeft / step)
  let targetIndex = startIndex
  if (dx < -SWIPE_THRESHOLD) targetIndex += 1
  else if (dx > SWIPE_THRESHOLD) targetIndex -= 1

  // Snap is still off here, so there is no jump: we glide straight to the target card
  animateTo(clampScroll(targetIndex * step))
}

function onPointerUp(e: PointerEvent): void {
  if (!isPointerDown || e.pointerType !== 'mouse') return
  finishDrag(e.clientX)
}

function onPointerCancel(e: PointerEvent): void {
  if (!isPointerDown || e.pointerType !== 'mouse') return
  finishDrag(startX)
}

// After a drag, the click on a link inside a card must not fire
function onClickCapture(e: MouseEvent): void {
  if (!hasMoved) return
  e.preventDefault()
  e.stopPropagation()
  hasMoved = false
}

onMounted((): void => {
  updateEdges()
})

onBeforeUnmount(cancelAnimation)

// Recalculates arrow state when the container or window size changes
useResizeObserver(scrollerRef, updateEdges)

watch(() => props.items.length, () => nextTick(updateEdges))
</script>

<template>
  <section
      v-if="items.length > 0"
      class="relative w-full overflow-hidden select-none border border-gray-150"
      :aria-label="ariaLabel"
      aria-roledescription="карусель"
  >
    <button
        type="button"
        class="absolute z-10 h-full px-2 2xl:px-5.5 bg-linear-to-r from-gray-500/0 to-gray-500/0 text-gray-300 transition-all duration-200"
        :class="canPrev ? 'opacity-100 hover:from-gray-500/10 hover:text-gray-500 cursor-pointer' : 'opacity-20'"
        :disabled="!canPrev"
        aria-label="Предыдущий"
        @click="prev"
    >
      <Icon name="heroicons:chevron-left-solid" class="text-[1.25rem]" aria-hidden="true" />
    </button>

    <button
        type="button"
        class="absolute right-0 z-10 h-full px-2 2xl:px-5.5 bg-linear-to-l from-gray-500/0 to-gray-500/0 text-gray-300 transition-all duration-200"
        :class="canNext ? 'opacity-100 hover:from-gray-500/10 hover:text-gray-600 cursor-pointer' : 'opacity-20'"
        :disabled="!canNext"
        aria-label="Следующий"
        @click="next"
    >
      <Icon name="heroicons:chevron-right-solid" class="text-[1.25rem]" aria-hidden="true" />
    </button>

    <div
        ref="scrollerRef"
        class="flex divide-x divide-gray-150 overflow-x-auto overflow-y-hidden overscroll-x-contain snap-x snap-mandatory
             [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        :class="isDragging ? 'cursor-grabbing' : 'cursor-grab'"
        @scroll.passive="updateEdges"
        @wheel.passive="cancelAnimation"
        @touchstart.passive="cancelAnimation"
        @pointerdown="onPointerDown"
        @pointermove="onPointerMove"
        @pointerup="onPointerUp"
        @pointercancel="onPointerCancel"
        @click.capture="onClickCapture"
        @dragstart.prevent
    >
      <article
          v-for="(item, index) in items"
          :key="index"
          class="shrink-0 snap-start px-4"
          :class="computedCardWidthClass"
          role="group"
          aria-roledescription="слайд"
          :aria-label="`Слайд ${index + 1} из ${items.length}`"
      >
        <slot name="item" :item="item" :index="index" />
      </article>
    </div>
  </section>
</template>