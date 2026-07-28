<script setup lang="ts">

const stats = useStats()

</script>

<template>
    <section class="relative flex flex-wrap pt-5 lg:py-7.5 2xl:py-10 border border-gray-150 dark:bg-gray-150/20" aria-label="stats section">
        <BaseArticle 
            class="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-max"
            variant="badge"
            as="div"
        >
            Нам доверяют множество организаций
        </BaseArticle>
        <AppStatsCard 
            v-for="stat in stats"
            :key="stat.value"
        >
            {{ stat.value }}
            <template #description>{{ stat.description }}</template>
        </AppStatsCard>
    </section>
</template>