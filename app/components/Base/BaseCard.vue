<script setup lang="ts">

type Orientation = 'vertical' | 'horizontal'

interface IProps {
    orientation?: Orientation,
    title: string,
    description?: string,
}

const props = withDefaults(defineProps<IProps>(), {
  orientation: 'vertical',
  title: 'Заголовок',
})

const orientations: Record<Orientation, string> = {
  vertical:
    'flex-row md:flex-col md:gap-y-7.5 2xl:gap-y-10 gap-x-3.5 md:gap-x-0 items-center md:items-start',
  horizontal:
    'flex-row gap-x-3.5 2xl:gap-x-5 items-center',
}

</script>

<template>
    <article class="p-7.5 lg:p-10 2xl:p-12.5 flex flex-col justify-between gap-y-6 md:gap-y-10 2xl:gap-y-15 w-full md:w-1/3 border border-gray-150">
        <div class="flex flex-col gap-y-6 lg:gap-y-3.5 2xl:gap-y-10">
            <div class="flex" :class="orientations[orientation]">
                <div v-if="$slots.icon" aria-hidden="true">
                    <slot 
                        name="icon"
                    />
                </div>
                <h3 class="text-xl lg:text-2xl 2xl:text-3xl font-semibold">
                    {{ title }}
                </h3>
            </div>
            <p class="text-sm lg:text-base 2xl:text-lg text-gray-900 font-light tracking-tight">
                {{ description }}
            </p>
        </div>
        <slot 
            v-if="$slots.button"
            name="button"
        />
    </article>
</template>