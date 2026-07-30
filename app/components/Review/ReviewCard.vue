<script setup lang="ts">
import type { IReview } from '~/constants/reviews'

defineProps<{ review: IReview }>()
</script>

<template>
  <div class="flex flex-col h-full justify-between px-6 py-10 lg:p-10 2xl:px-20 2xl:py-25 gap-y-6 2xl:gap-y-10">
    <div class="flex flex-col gap-y-3 2xl:gap-y-6">
      <ReviewStars :rating="review.rating" />
      <p class="text-gray-900 text-sm 2xl:text-lg">
        {{ review.text }}
      </p>
    </div>

    <div class="flex items-center justify-between gap-x-2.5 px-3.5 py-2.5 2xl:px-5 2xl:py-5 bg-gray-150/20 border border-gray-150 rounded-lg">
      <span class="text-white font-medium text-sm 2xl:text-lg">
        {{ review.author }}
      </span>
      <BaseButton
        :to="review.mapsLink"
        :external="true"
        variant="secondary"
        :aria-label="`Открыть отзыв ${review.author} на картах`"
      >
        <template #icon-left>
          <Icon name="heroicons:map-pin-20-solid" class="text-[1.4rem] text-red-500" aria-hidden="true" />
        </template>
        Карты
      </BaseButton>
    </div>
  </div>
</template>