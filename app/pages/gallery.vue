<script setup lang="ts">
useSeoMeta({
  title: 'Галерея — Автоцентр на Лазурной',
  description: 'Фото Автоцентра на Лазурной'
})

const { data: photos } = await useFetch<string[]>('/api/gallery')
</script>

<template>
  <section class="columns-1 md:columns-2 lg:columns-3 2xl:columns-4 gap-4 mx-4 lg:mx-0">
    <div
      v-for="(photo, index) in photos"
      :key="photo"
      class="break-inside-avoid overflow-hidden transition-transform duration-200 hover:scale-[1.02]"
    >
      <NuxtImg
        class="w-full h-auto object-cover mb-4"
        :src="photo"
        :alt="`Фотография ${index + 1}`"
        loading="lazy"
        format="webp"
        quality="80"
      />
    </div>
  </section>
</template>