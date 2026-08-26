<script setup lang="ts">
definePageMeta({
  layout: 'admin-panel'
})

const inspectionPricelist = ref<File | null>(null)
const washingPricelist = ref<File | null>(null)
const washingPricelistWinter = ref<File | null>(null)
const transportationCmr = ref<File | null>(null)
const transportationLicence = ref<File | null>(null)
</script>

<template>
  <div class="flex flex-col gap-y-6 px-2 md:px-6">
    <section aria-label="Секция заголовка">
      <h1 class="ml-20 text-2xl font-medium text-white md:ml-0">
        Файловый менеджер
      </h1>
    </section>

    <section
      class="flex flex-col gap-y-4 border-b border-gray-150 pb-4"
      aria-label="Секция загрузки файлов гостехосмотра"
    >
      <h2 class="whitespace-pre-line text-base font-medium text-orange-500 lg:text-lg 2xl:text-2xl">
        Гостехосмотр
      </h2>
      <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
        <AdminFileUploadCard v-model="inspectionPricelist" label="Прайслист" accept=".pdf" :max-size-mb="10" />
      </div>
    </section>

    <section
      class="flex flex-col gap-y-4 border-b border-gray-150 pb-4"
      aria-label="Секция загрузки файлов мойки"
    >
      <h2 class="whitespace-pre-line text-base font-medium text-orange-500 lg:text-lg 2xl:text-2xl">
        Мойка
      </h2>
      <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
        <AdminFileUploadCard v-model="washingPricelist" label="Прайслист" accept=".pdf" :max-size-mb="10" />
        <AdminFileUploadCard
          v-model="washingPricelistWinter"
          label="Прайслист (зимний период)"
          accept=".pdf"
          :max-size-mb="10"
        />
      </div>
    </section>

    <section
      class="flex flex-col gap-y-4 border-b border-gray-150 pb-4"
      aria-label="Секция загрузки файлов грузоперевозок"
    >
      <h2 class="whitespace-pre-line text-base font-medium text-orange-500 lg:text-lg 2xl:text-2xl">
        Грузоперевозки
      </h2>
      <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
        <AdminFileUploadCard v-model="transportationCmr" label="CMR" accept=".pdf" :max-size-mb="10" />
        <AdminFileUploadCard v-model="transportationLicence" label="Лицензия" accept=".pdf" :max-size-mb="10" />
      </div>
    </section>
  </div>
</template>