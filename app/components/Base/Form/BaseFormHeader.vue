<script setup lang="ts">
interface Props {
  title: string
  description?: string
}

defineProps<Props>()
</script>

<template>
  <div class="relative ">
    <NuxtImg
            src="images/hero.jpg"
            format="svg"
            quality="80"
            alt=""
            role="presentation"
            fit="cover"
            class="absolute inset-0 w-full h-full object-cover mix-blend-overlay"
            loading="lazy"
    />
    <div class="absolute inset-0 bg-orange-500/20 pointer-events-none mix-blend-color"></div>
    <div class="relative z-10 flex flex-col items-center text-center gap-y-7 lg:gap-y-10 2xl:gap-y-12.5 px-6 py-12 overflow-hidden">
        <AppLogo variant="glow" size="lg" />
        <div class="flex flex-col gap-y-1.5 lg:gap-2.5 2xl:gap-y-3.5">
          <h1 class="text-white font-semibold text-2xl lg:text-3xl 2xl:text-4xl">{{ title }}</h1>
          <p v-if="description" class="text-gray-600 text-sm lg:text-base 2xl:text-lg whitespace-pre-line">{{ description }}</p>
        </div>
        <slot name="tabs" />
    </div>
  </div>
</template>