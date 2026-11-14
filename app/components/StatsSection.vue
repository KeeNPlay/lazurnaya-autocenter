<script setup lang="ts">

const stats = useStats()

</script>

<template>
  <section
      v-reveal
      class="relative mx-4 lg:mx-0  grid grid-cols-2 lg:grid-cols-4 pt-5 lg:py-7.5 2xl:py-10 border border-gray-150 bg-gray-150/20"
      aria-label="Секция статистики"
  >
    <BaseArticle
        class="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-max"
        variant="badge"
        as="div"
    >
      Нам доверяют множество организаций
    </BaseArticle>
    <AppStatsCard
        v-for="(stat, index) in stats"
        :key="stat.value"
    >
      <BaseCountUp :value="stat.value" :delay="index * 150" />
      <template #description>{{ stat.description }}</template>
    </AppStatsCard>
  </section>
</template>