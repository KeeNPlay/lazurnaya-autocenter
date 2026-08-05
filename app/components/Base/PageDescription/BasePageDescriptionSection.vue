<script setup lang="ts">
import type { ICardDescription } from '~/constants/pageDescriptionCard'

interface Props {
  items: ICardDescription[]
  image: string,
  headerTitle: string,
  headerDescription: string,
  title: string
  description: string
  descriptionBadge: string
}

defineProps<Props>()

</script>

<template>
    <section 
        class="flex flex-col" 
        aria-label="Секция гостехосмотра"
    >
        <BaseSectionHeader 
            :image='`images/${image}.jpg`'
            :title="headerTitle"
            :description="headerDescription"
        />
        <section 
            class="flex flex-col pb-6 px-4 pt-10 lg:p-10 lg:pt-20 2xl:p-12.5 2xl:pt-30 gap-y-12.5 border border-gray-150"
            aria-label="Секция описания гостехосмотра"
        >
            <div class="flex flex-col gap-y-3.5">
                <h3 class="text-2xl lg:text-4xl 2xl:text-5xl font-semibold">{{ title }}</h3>
                <p class="text-sm lg:text-base 2xl:text-lg text-gray-900">{{ description }}</p>
            </div>
            <BaseArticle as="mark" class="text-base lg:text-lg 2xl:text-xl w-fit">{{ descriptionBadge }}</BaseArticle>
        </section>
        <section aria-label="Секция порядка прохождения гостехосмотра">
            <div class="grid border-t border-l border-gray-150 grid-cols-1 md:grid-cols-2">
                <BasePageDescriptionCard
                    v-for="(item, index) in items"
                    :key="index"
                    v-bind="item"
                />
            </div>
        </section>
    </section>
</template>