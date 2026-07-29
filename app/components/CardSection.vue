<script setup lang="ts">

export interface ICard {
  cardTitle: string
  cardDescription?: string
  cardIcon?: string
  cardLink?: string
}

interface IProps {
  title: string
  description?: string
  image: string
  cards: ICard[]
  cardPerRow?: 1 | 2 | 3 | 4
  cardOrientation?: 'vertical' | 'horizontal'
}

const gridCols: Record<number, string> = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 md:grid-cols-2',
  3: 'grid-cols-1 md:grid-cols-3',
  4: 'grid-cols-1 md:grid-cols-4',
}

const props = withDefaults(defineProps<IProps>(), {
  cardPerRow: 2,
})

</script>

<template>
    <section class="flex flex-col">
        <BaseSectionHeader 
            :image="`images/${image}.jpg`"
            :title="title"
            :description="description"
        />
        <div class="grid border-t border-l border-gray-150" :class="gridCols[cardPerRow]">
            <BaseCard
                v-for="card in cards"
                :key="card.cardTitle"
                :title="card.cardTitle"
                :description="card.cardDescription"
                :orientation="cardOrientation"
            >
                <template v-if="card.cardIcon" #icon>
                    <BaseIconBlock>
                        <Icon
                            :name="card.cardIcon"
                            class="text-[1.625rem] lg:text-[1.875rem] 2xl:text-[2.5rem]"
                        />
                    </BaseIconBlock>
                </template>

                <template v-if="card.cardLink" #button>
                    <BaseButton
                        :to="card.cardLink"
                        variant="secondary"
                        width="full"
                    >
                        Подробнее
                    </BaseButton>
                </template>
        </BaseCard>
        </div>
    </section>
</template>