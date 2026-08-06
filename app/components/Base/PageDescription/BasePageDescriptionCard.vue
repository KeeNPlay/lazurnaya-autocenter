<script setup lang="ts">
import type { PropType } from 'vue'
import type { DescriptionPart, IconPart } from '~/constants/pageDescriptionCard'

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  descriptionPart: {
    type: Array as PropType<DescriptionPart[]>,
    required: true,
  },
  icon: {
    type: Object as PropType<IconPart>,
    required: true,
  },
})

</script>

<template>
    <article class="py-10 px-4 lg:py-20 lg:px-10 2xl:py-25 2xl:px-12.5 flex flex-col justify-between gap-y-6 md:gap-y-10 2xl:gap-y-15 border-r border-b border-gray-150">
        <div class="flex flex-col gap-y-7.5 lg:gap-y-10 2xl:gap-y-12.5">
            <div class="flex flex-row gap-x-3.5 2xl:gap-x-5 items-end">
                <div>
                        <p 
                            v-if="icon.type === 'text'" 
                            class="text-7xl lg:text-9xl 2xl:text-[9.5rem] text-orange-700 font-semibold leading-[75%]"
                        >
                            {{ icon.value }}
                        </p>
                        <Icon
                            v-else-if="icon.type === 'icon'"
                            :name="icon.value"
                            class="text-7xl lg:text-9xl 2xl:text-[9.5rem] text-orange-700"
                            aria-hidden="true"
                        >

                        </Icon>
                </div>
                <h3 class="text-xl lg:text-2xl 2xl:text-3xl font-semibold  leading-[100%] md:leading-none pb-3 md:pb-4 lg:pb-5 2xl:pb-6.5 border-b border-gray-150 w-full">
                    {{ title }}
                </h3>
            </div>
            <p class="text-sm lg:text-base 2xl:text-lg text-gray-600 font-light">
                <template v-for="(part, i) in descriptionPart" :key="i">
                    <NuxtLink
                        v-if="part.type === 'link'"
                        :to="part.to"
                        :external="part.external"
                        class="text-orange-700 underline hover:text-orange-800 transition-colors"
                    >
                        {{ part.value }}
                    </NuxtLink>
                    <template v-else>
                        {{ part.value }}
                    </template>
                </template>
            </p>
        </div>
    </article>
</template>