<script setup lang="ts">

type Format = 'svg' | 'webp' | 'png' | 'avif'

interface IProps {
    image?: string,
    imageFormat?: Format,
    imageQuality?: string,
    title: string,
    description?: string
}

const props = withDefaults(defineProps<IProps>(), {
    image: 'images/hero.jpg',
    imageFormat: 'webp',
    imageQuality: '80',
})

</script>

<template>
    <div class="relative border-l border-r border-gray-150">
        <NuxtImg
            :src="props.image"
            :format="props.imageFormat"
            :quality="props.imageQuality"
            alt=""
            role="presentation"
            fit="cover"
            class="absolute inset-0 w-full h-full object-cover mix-blend-overlay"
            loading="lazy"
        />
        <div class="absolute inset-0 bg-orange-500/20 pointer-events-none mix-blend-color"></div>
        <div class="relative flex flex-col gap-y-4 px-4 py-12.5 lg:px-65.5 lg:py-20 2xl:px-75 2xl:py-25 text-center z-10">
            <h2 class="text-2xl md:text-4xl 2xl:text-5xl font-semibold dark:text-white">
                {{ title }}
            </h2>
            <p class="text-sm md:text-base 2xl:text-lg font-light dark:text-gray-900">
                {{ description }}
            </p>
         </div>
    </div>
</template>