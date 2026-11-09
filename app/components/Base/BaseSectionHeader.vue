<script setup lang="ts">

type Format = 'svg' | 'webp' | 'png' | 'avif'

interface IProps {
  image?: string,
  imageFormat?: Format,
  imageQuality?: string,
  title: string,
  description?: string,
  // The first header on the page: load immediately with high priority
  eager?: boolean
}

const props = withDefaults(defineProps<IProps>(), {
  image: 'images/hero.jpg',
  imageFormat: 'webp',
  imageQuality: '80',
  eager: false
})

</script>

<template>
  <div class="relative isolate overflow-hidden bg-gray-100 border-l border-r border-gray-150">
    <NuxtImg
        :src="props.image"
        :format="props.imageFormat"
        :quality="props.imageQuality"
        alt=""
        role="presentation"
        fit="cover"
        class="absolute inset-0 w-full h-full object-cover mix-blend-overlay transform-gpu"
        :loading="props.eager ? 'eager' : 'lazy'"
        :fetchpriority="props.eager ? 'high' : 'auto'"
    />
    <div class="absolute inset-0 bg-orange-500/20 pointer-events-none mix-blend-color"></div>
    <div class="relative flex flex-col gap-y-4 px-4 py-12.5 lg:px-65.5 lg:py-20 2xl:px-75 2xl:py-25 text-center z-10">
      <h2 class="text-2xl md:text-4xl 2xl:text-5xl font-semibold text-white">
        {{ title }}
      </h2>
      <p class="text-sm md:text-base 2xl:text-lg font-light text-gray-900">
        {{ description }}
      </p>
    </div>
  </div>
</template>