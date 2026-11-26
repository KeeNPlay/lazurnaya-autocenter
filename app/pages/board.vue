<script setup lang="ts">
import { useEventListener, useTimeoutFn } from '@vueuse/core'

definePageMeta({ layout: false })

useSeoMeta({
  title: 'Очередь на техосмотр',
  robots: 'noindex, nofollow'
})

const { loggedIn } = useUserSession()

const {
  loaded,
  connected,
  mode,
  timeText,
  dateText,
  current,
  nextTime,
  breakTo,
  visibleList,
  hiddenCount,
  isPinned,
  canPrev,
  canNext,
  goPrev,
  goNext,
  resetPin
} = useInspectionBoard()

const notice = computed<{ title: string; subtitle: string }>(() => {
  switch (mode.value) {
    case 'break':
      return { title: 'Технический перерыв', subtitle: `Приём возобновится в ${breakTo.value}` }
    case 'waiting':
      return { title: `Ближайшая запись в ${nextTime.value}`, subtitle: '' }
    case 'finished':
      return { title: 'На сегодня записей больше нет', subtitle: '' }
    case 'empty':
      return { title: 'На сегодня записей нет', subtitle: '' }
    default:
      return { title: 'Загрузка…', subtitle: '' }
  }
})

// Control panel (for logged-in admin only): appears when the mouse moves and hides automatically
const controlsVisible = ref<boolean>(false)

const { start: startHideTimer } = useTimeoutFn(
    (): void => {
      controlsVisible.value = false
    },
    3000,
    { immediate: false }
)

function showControls(): void {
  controlsVisible.value = true
  startHideTimer()
}

useEventListener('mousemove', showControls)

useEventListener('keydown', (event: KeyboardEvent): void => {
  if (!loggedIn.value) return
  if (event.key === 'ArrowRight') goNext()
  if (event.key === 'ArrowLeft') goPrev()
})

const controlButtonClass =
    'flex items-center gap-x-2 rounded-xl bg-white/10 px-5 py-3 text-lg font-medium text-white transition-colors hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-40'
</script>

<template>
  <div
      class="flex h-screen w-screen select-none flex-col overflow-hidden bg-white text-slate-900"
      :class="controlsVisible ? '' : 'cursor-none'"
  >
    <!-- Шапка -->
    <header class="flex h-[12vh] shrink-0 items-center justify-between bg-blue-600 px-[3vw] text-white">
      <div class="flex items-center gap-x-[2vw]">
        <AppLogo variant="white" size="lg" />
        <h1 class=" text-[3vw] font-bold tracking-wide whitespace-nowrap">ОЧЕРЕДЬ НА ГОСТЕХОСМОТР</h1>
      </div>

      <div class="flex items-center gap-x-[2.5vw]">
        <div v-if="!connected" class="flex items-center gap-x-[0.6vw] text-amber-300">
          <Icon name="heroicons:signal-slash-20-solid" class="text-[2.2vw]" />
          <span class="text-[1.4vw] font-medium">Нет связи</span>
        </div>

        <div v-if="loaded" class="text-right leading-none">
          <div class="text-[3.6vw] font-bold tabular-nums">{{ timeText }}</div>
          <div class="mt-[0.6vh] text-[1.2vw] text-blue-100 tabular-nums">{{ dateText }}</div>
        </div>
      </div>
    </header>

    <main class="flex min-h-0 flex-1 flex-col gap-[2.5vh] px-[3vw] py-[3vh]">
      <!-- Current request -->
      <section
          v-if="mode === 'current' && current"
          class="board-glow flex h-[15vh] lg:h-[30vh] shrink-0 items-center justify-between rounded-[1.5vw] border-[0.4vw] border-blue-600 bg-blue-50 px-[3vw]"
      >
        <div class="flex flex-col">
          <span class="text-[1.8vw] font-semibold uppercase tracking-widest text-blue-600">Сейчас</span>
          <span class="whitespace-nowrap text-[9vw] font-black leading-none tabular-nums text-blue-700">
            {{ current.plate }}
          </span>
        </div>
        <span class="whitespace-nowrap text-[6.5vw] font-black leading-none tabular-nums text-blue-700">
          {{ current.time }}
        </span>
      </section>

      <!-- Messages: break, next request, no requests -->
      <section
          v-else
          class="flex h-[30vh] shrink-0 flex-col items-center justify-center gap-y-[1.5vh] rounded-[1.5vw] border-[0.3vw] border-slate-200 bg-slate-50 px-[3vw] text-center"
      >
        <span class="text-[5vw] font-bold leading-tight text-blue-700">{{ notice.title }}</span>
        <span v-if="notice.subtitle" class="text-[2.4vw] text-slate-500">{{ notice.subtitle }}</span>
      </section>

      <!-- Next requests -->
      <section v-if="visibleList.length" class="flex min-h-0 flex-1 flex-col overflow-hidden">
        <h2 class="mb-[1vh] text-[1.6vw] font-semibold uppercase tracking-widest text-slate-500">
          Следующие по очереди
        </h2>

        <ul class="flex flex-col">
          <li
              v-for="item in visibleList"
              :key="item.id"
              class="flex items-center justify-between border-b border-slate-200 py-[0.7vh]"
          >
            <span class="whitespace-nowrap text-[2.8vw] font-bold leading-none tabular-nums">{{ item.plate }}</span>
            <span class="text-[2.8vw] font-semibold leading-none tabular-nums text-slate-500">{{ item.time }}</span>
          </li>
        </ul>

        <p v-if="hiddenCount > 0" class="pt-[1vh] text-[1.8vw] text-slate-500">и ещё {{ hiddenCount }}</p>
      </section>

      <p v-else-if="mode === 'current'" class="text-[2vw] text-slate-500">Больше записей на сегодня нет</p>
    </main>

    <!-- Scoreboard controls: visible only to a logged-in admin, appearing after mouse movement -->
    <div
        v-if="loggedIn"
        class="fixed bottom-8 left-1/2 z-50 -translate-x-1/2 transition-opacity duration-300"
        :class="controlsVisible ? 'opacity-100' : 'pointer-events-none opacity-0'"
        :inert="!controlsVisible"
    >
      <div class="flex items-center gap-x-3 rounded-2xl bg-slate-900/85 p-3 shadow-lg">
        <button type="button" :class="controlButtonClass" :disabled="!canPrev" @click="goPrev">
          <Icon name="heroicons:chevron-left-20-solid" />
          Предыдущий
        </button>

        <button v-if="isPinned" type="button" :class="controlButtonClass" @click="resetPin">
          <Icon name="heroicons:arrow-path-20-solid" />
          Авто
        </button>

        <button type="button" :class="controlButtonClass" :disabled="!canNext" @click="goNext">
          Следующий
          <Icon name="heroicons:chevron-right-20-solid" />
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.board-glow {
  animation: board-glow 2.4s ease-in-out infinite;
}

@keyframes board-glow {
  0%,
  100% {
    box-shadow: 0 0 1.2vw 0 rgb(37 99 235 / 0.25);
  }
  50% {
    box-shadow: 0 0 3vw 0.6vw rgb(37 99 235 / 0.45);
  }
}

@media (prefers-reduced-motion: reduce) {
  .board-glow {
    animation: none;
  }
}
</style>