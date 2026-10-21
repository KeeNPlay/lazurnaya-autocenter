<script setup lang="ts">

import { inspectionItems } from '~/constants/inspectionProcedure'

useSeoMeta({
  title: 'Гостехосмотр — Автоцентр на Лазурной',
  description: 'Официальный государственный технический осмотр для всех видов транспорта в Республике Беларусь.',
})

</script>

<template>
    <BasePageDescriptionSection
        header-title="Гостехосмотр"
        header-description="Осуществляем государственный технический осмотр в Гомеле для всех видов транспорта"
        title="Контроль безопасности вашего транспорта"
        description="Современная диагностика, опытные специалисты и официальное оформление результатов. Работаем с легковым, грузовым транспортом, автобусами и спецтехникой."
        description-badge="Порядок прохождения гостехосмотра:"
        image="services"
        :items="inspectionItems"
    />
    <FormsBookingSection default-tab="inspection" />
    <PricelistSection 
        link="docs/inspection_pricelist.pdf"
        description="Ознакомьтесь с действующими тарифами на услуги государственного технического осмотра, установленными в соответствии с законодательством Республики Беларусь"
    />
</template>