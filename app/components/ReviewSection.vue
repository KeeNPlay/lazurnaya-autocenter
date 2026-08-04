<script setup lang="ts">
import type { IReview } from '~/constants/reviews'
defineProps<{ review: IReview[] }>()
</script>

<template>
  <section class="flex flex-col">
    <BaseSectionHeader 
      image="images/reviews.jpg"
      title="Что говорят наши клиенты"
      description="Мы ценим доверие каждого клиента и стремимся обеспечивать высокий уровень сервиса, надежность и профессиональный подход"
    />
    <BaseSlider :items="review" :visible-count="3" aria-label="Отзывы клиентов">
      <template #item="{ item }">
        <ReviewCard :review="item" />
      </template>
    </BaseSlider>
  </section>
</template>