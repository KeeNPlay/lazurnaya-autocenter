<script setup lang="ts">

import { washingItems } from '~/constants/washingAdvantages'

useSeoMeta({
  title: 'Мойка — Автоцентр на Лазурной',
  description: 'Оказываем услуги комплексной мойки грузовых автомобилей, автобусов, прицепов и спецтехники с учетом особенностей каждого типа транспорта.',
})

</script>

<template>
    <BasePageDescriptionSection
        header-title="Мойка"
        header-description="Оказываем услуги комплексной мойки грузовых автомобилей, автобусов, прицепов и спецтехники с учетом особенностей каждого типа транспорта"
        title="Забота о вашем транспорте в каждой детали"
        description="Используем профессиональное оборудование и специализированные моющие средства, обеспечивающие эффективное удаление загрязнений, дорожных реагентов и технических отложений."
        description-badge="Причины работать именно с нами:"
        image="advantages"
        :items="washingItems"
    />
    <FormsBookingSection default-tab="washing" />
</template>