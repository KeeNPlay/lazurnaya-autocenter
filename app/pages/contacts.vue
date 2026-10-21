<script setup lang="ts">

import { clientInfo } from '~/constants/detailsAndPricelist'

useSeoMeta({
  title: 'Контакты — Автоцентр на Лазурной',
  description: 'Свяжитесь с нами — команда Автоцентра на Лазурной оперативно ответит и обеспечит профессиональное обслуживание без лишних ожиданий.',
})

</script>

<template>
    <section
        class="flex flex-col mx-4 lg:mx-0"
        aria-label="Секция контактов"
    >
        <BaseSectionHeader
            image="images/contacts.jpg"
            title="Контакты"
            description="Свяжитесь с нами — команда Автоцентра на Лазурной оперативно ответит и обеспечит профессиональное обслуживание без лишних ожиданий."
        />
        <BaseContactsBtnSection />
        <BaseContactsAboutSection />
    </section>
    <section class="grid grid-cols-1 lg:grid-cols-2 mx-4 lg:mx-0 border-t border-l border-gray-150 whitespace-pre-line">
        <BasePageDescriptionCard 
            v-for="(info, index) in clientInfo"
            :key="index"
            v-bind="info"
        />
    </section>
</template>