<script setup lang="ts">

type Rating = 1 | 2 | 3 | 4 | 5

interface IProps {
    rating: Rating
}

const props = defineProps<IProps>()

</script>

<template>
    <div
        class="flex gap-x-1.25"
        role="img"
        :aria-label="`Оценка: ${props.rating} из 5`"
    >
        <Icon
            v-for="star in 5"
            :key="star"
            name="heroicons:star-20-solid"
            :class="star <= props.rating ? 'text-orange-800' : 'text-gray-300'"
            class="text-[1.25rem]"
            aria-hidden="true"
        />
    </div>
</template>