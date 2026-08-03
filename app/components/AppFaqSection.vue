<script setup lang="ts">
import type { IFaqItem } from '~/constants/faq'

interface IProps {
  items: IFaqItem[]
}

const props = defineProps<IProps>()

</script>

<template>
    <section
        class="flex flex-col"
        aria-label="Секция вопрос-ответ"
    >
        <BaseSectionHeader
        id="faq-heading"
        title="Часто задаваемые вопросы"
        description="Мы собрали полезную информацию, чтобы сделать сотрудничество максимально понятным, удобным и прозрачным"
        />
        <div class="border border-gray-150">
            <div class="columns-1 lg:columns-2 gap-x-0 [column-rule:1px_solid_var(--color-gray-150)]">
                <FaqItem
                v-for="(item, index) in items"
                :key="item.question"
                :question="item.question"
                :answer="item.answer"
                :number="index + 1"
                />
            </div>
        </div>
    </section>
</template>