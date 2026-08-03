<script setup lang="ts">
import type { AnswerPart } from '~/constants/faq'

interface IProps {
  question: string
  answer: AnswerPart[]
  number: number
}

defineProps<IProps>()

</script>

<template>
    <details class="group px-6 py-7.5 lg:px-10 2xl:px-12.5 break-inside-avoid" name="faq">
        <summary class="flex gap-x-5 cursor-pointer list-none select-none marker:content-none [&::-webkit-details-marker]:hidden">
            <BaseIconBlock class="h-fit">
                <span class="text-lg lg:text-2xl 2xl:text-3xl font-semibold transition-colors duration-200 text-white group-open:text-orange-500">{{ String(number).padStart(2, '0') }}</span> <!-- Opened ?? text-orange-700 -->
            </BaseIconBlock>
            <div class="flex justify-between items-center lg:items-start lg:pt-6 w-full"> 
                <h3 class="text-white group-open:text-orange-700 font-medium text-sm lg:text-lg 2xl:text-2xl transition-colors duration-200">
                    {{ question }}
                </h3>
                <Icon
                    name="heroicons:plus-20-solid"
                    class="text-white text-2xl transition duration-200 group-open:text-orange-700 group-open:rotate-45" 
                />
            </div>
        </summary>
        <div class="pl-0 lg:pl-21.5 2xl:pl-28 pt-3 lg:pt-0 text-gray-900 text-sm lg:text-base font-light leading-relaxed">
            <template v-for="(part, i) in answer" :key="i">
                <NuxtLink
                    v-if="part.type === 'link'"
                    :to="part.to"
                    :external="part.external"
                    class="text-orange-700 underline hover:text-orange-800 transition-colors"
                    >
                    {{ part.value }}
                </NuxtLink>
                <button v-else-if="part.type === 'button'" class="text-orange-700 underline hover:text-orange-800 transition-colors cursor-pointer">
                    {{ part.value }}
                </button>
                <template v-else>{{ part.value }}</template>
            </template>
        </div>
    </details>
</template>