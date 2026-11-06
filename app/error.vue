<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError }>()

const code = computed<number>(() => props.error.status ?? 500)
const isNotFound = computed<boolean>(() => code.value === 404)

const title = computed<string>(() =>
    isNotFound.value ? 'Ошиблись дверью, с кем не бывает' : 'Упс. Что-то пошло не так'
)

useSeoMeta({
  title: () => (isNotFound.value ? 'Страница не найдена' : 'Ошибка'),
  robots: 'noindex, nofollow'
})
async function goHome(): Promise<void> {
  await clearError({ redirect: '/' })
}
</script>

<template>
  <div class="relative isolate flex min-h-dvh flex-col overflow-hidden bg-gray-100 font-sans">
    <div
        class="pointer-events-none absolute inset-x-0 top-0 aspect-[100/70] mt-[max(0px,calc(40dvh_-_43vw))]
               landscape:max-lg:mt-0 landscape:max-lg:aspect-[100/43]
               lg:bottom-0 lg:mt-0 lg:aspect-auto"
    >
      <svg
          class="absolute inset-0 h-full w-full select-none"
          viewBox="0 0 100 43"
          preserveAspectRatio="none"
          aria-hidden="true"
      >
        <text
            x="-2"
            y="43"
            font-weight="900"
            font-size="60"
            textLength="104"
            lengthAdjust="spacingAndGlyphs"
            fill="#ffffff"
        >
          {{ code }}
        </text>
      </svg>
    </div>

    <div
        class="relative mt-auto flex min-h-[67dvh] flex-col items-center justify-between gap-y-6 px-4 pb-20 text-center
               landscape:max-lg:min-h-dvh landscape:max-lg:justify-center landscape:max-lg:gap-y-3 landscape:max-lg:pb-4
               lg:min-h-[50dvh] lg:gap-y-24 2xl:gap-y-48"
    >
      <AppLogo variant="white" size="xl" class="z-40" />

      <div class="flex flex-col items-center justify-center gap-y-6 text-center landscape:max-lg:gap-y-3 2xl:gap-y-8">
        <h1 class="text-xl font-bold text-white mix-blend-difference md:text-5xl landscape:max-lg:text-3xl 2xl:text-7xl">
          {{ title }}
        </h1>

        <BaseButton variant="white" class="z-40" @click="goHome">
          Вернуться на главную
        </BaseButton>
      </div>
    </div>
  </div>
</template>