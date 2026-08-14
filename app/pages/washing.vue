<script setup lang="ts">

import { washingItems } from '~/constants/washingAdvantages'
import { WASHING_PRICELIST } from '~/constants/pricelist'

useSeoMeta({
  title: 'Мойка — Автоцентр на Лазурной',
  description: 'Оказываем услуги комплексной мойки грузовых автомобилей, автобусов, прицепов и спецтехники с учетом особенностей каждого типа транспорта.',
})

const currentSeason = useSeason()
const washingPricelistLink = computed<string>(() => WASHING_PRICELIST[currentSeason])

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
    <PricelistSection 
        link="docs/washing_pricelist.pdf"
        description="Ознакомьтесь с актуальными тарифами на услуги мойки грузового транспорта, автобусов и спецтехники. Мы предлагаем прозрачные цены для двух сезонов: зимний (с 01.12 по 01.03) и летний."
    />
</template>