<script setup lang="ts">

import { services } from '~/constants/services'
import { advantages } from '~/constants/advantages'
import { reviews } from '~/constants/reviews'
import { faqItems } from '~/constants/faq'

</script>

<template>
    <HeroSection />
    <StatsSection />
    <CardSection
        aria-label="Секция услуг"
        image="services"
        title="Наши услуги"
        description="Профессиональные услуги для стабильной и безопасной работы вашего транспорта"
        :cards="services"
        :card-per-row="3"
    />
    <CardSection
        aria-label="Секция преимуществ"
        image="advantages"
        title="Почему выбирают нас?"
        description="Доверьте свой транспорт профессионалам, которые гарантируют качество, точность и соблюдение всех стандартов на каждом этапе работы."
        :cards="advantages"
        cardOrientation="horizontal"
    />
    <ReviewSection :review="reviews" />
    <FaqSection :items="faqItems" />
</template>