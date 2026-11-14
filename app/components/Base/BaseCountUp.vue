<script setup lang="ts">
interface Props {
  value: string | number
  duration?: number
  delay?: number
}

const props = withDefaults(defineProps<Props>(), {
  duration: 2000,
  delay: 0,
})

const parsed = computed(() => {
  const match = String(props.value)
      .trim()
      .match(/^(\D*?)(\d+(?:[ \u00A0]\d{3})*(?:[.,]\d+)?)(.*)$/s)

  if (!match) return null

  const [, prefix = '', raw = '', suffix = ''] = match
  const normalized = raw.replace(/[ \u00A0]/g, '').replace(',', '.')

  return {
    prefix,
    suffix,
    target: Number(normalized),
    decimals: normalized.split('.')[1]?.length ?? 0,
  }
})

// on server result stat
const current = ref(parsed.value?.target ?? 0)

function format(n: number): string {
  const p = parsed.value
  if (!p) return String(props.value)

  const number = new Intl.NumberFormat('ru-RU', {
    minimumFractionDigits: p.decimals,
    maximumFractionDigits: p.decimals,
  }).format(n)

  return `${p.prefix}${number}${p.suffix}`
}

const finalText = computed(() => format(parsed.value?.target ?? 0))
const shownText = computed(() => format(current.value))

const root = ref<HTMLElement>()
const armed = ref(false)
let frame = 0
let timer: ReturnType<typeof setTimeout> | undefined

function animate(target: number): void {
  const startedAt = performance.now()

  const tick = (now: number): void => {
    const t = Math.min((now - startedAt) / props.duration, 1)
    current.value = target * (1 - (1 - t) ** 3) // easeOutCubic
    if (t < 1) frame = requestAnimationFrame(tick)
  }

  frame = requestAnimationFrame(tick)
}

const { stop } = useIntersectionObserver(
    root,
    ([entry]) => {
      const p = parsed.value
      if (!armed.value || !p || !entry?.isIntersecting) return

      stop()
      timer = setTimeout(() => animate(p.target), props.delay)
    },
    { rootMargin: '0px 0px -10% 0px' },
)

onMounted(() => {
  if (!parsed.value) return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  current.value = 0
  armed.value = true
})

onBeforeUnmount(() => {
  cancelAnimationFrame(frame)
  clearTimeout(timer)
})
</script>

<template>
  <span ref="root" class="inline-grid tabular-nums">
    <!-- invisible result stat -->
    <span class="col-start-1 row-start-1 opacity-0">{{ finalText }}</span>
    <span class="col-start-1 row-start-1" aria-hidden="true">{{ shownText }}</span>
  </span>
</template>