<script setup lang="ts">
import { ADMIN_FILE_MAX_SIZE_MB, type AdminFileKey } from '~~/shared/utils/adminFiles'

definePageMeta({ layout: 'admin-panel' })

const { files, pending, uploadingKey, upload, restore } = useAdminFiles()

const selected = reactive<Record<AdminFileKey, File | null>>({
  inspection_pricelist: null,
  washing_pricelist: null,
  winter_washing_pricelist: null,
  cmr: null,
  licence: null
})

async function onUpload(key: AdminFileKey): Promise<void> {
  const file = selected[key]
  if (!file) return

  // Поле очищается только после успешной загрузки — при ошибке выбранный файл остаётся
  if (await upload(key, file)) selected[key] = null
}
</script>

<template>
  <div class="flex flex-col gap-y-6 px-2 md:px-6">
    <section class="flex flex-col gap-y-4 md:gap-y-1" aria-label="Секция заголовка">
      <h1 class="ml-20 text-2xl font-medium text-white md:ml-0">
        Файловый менеджер
      </h1>
      <p class="text-xs text-red-500 font-light">
        После загрузки файла необходимо проверить его отображение на сайте. Перейти на сайт можно по кнопке на меню "вернуться на сайт"
      </p>
    </section>

    <section
        class="flex flex-col gap-y-4 border-b border-gray-150 pb-4"
        aria-label="Секция загрузки файлов гостехосмотра"
    >
      <h2 class="whitespace-pre-line text-base font-medium text-orange-500 lg:text-lg 2xl:text-2xl">
        Гостехосмотр
      </h2>
      <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
        <AdminFileUploadCard
            v-model="selected.inspection_pricelist"
            label="Прайслист"
            accept=".pdf"
            :max-size-mb="ADMIN_FILE_MAX_SIZE_MB"
            :info="files.inspection_pricelist"
            :loading="pending"
            :uploading="uploadingKey === 'inspection_pricelist'"
            :disabled="uploadingKey !== null"
            @upload="onUpload('inspection_pricelist')"
            @restore="restore('inspection_pricelist')"
        />
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
        <AdminFileUploadCard
            v-model="selected.washing_pricelist"
            label="Прайслист"
            accept=".pdf"
            :max-size-mb="ADMIN_FILE_MAX_SIZE_MB"
            :info="files.washing_pricelist"
            :loading="pending"
            :uploading="uploadingKey === 'washing_pricelist'"
            :disabled="uploadingKey !== null"
            @upload="onUpload('washing_pricelist')"
            @restore="restore('washing_pricelist')"
        />
        <AdminFileUploadCard
            v-model="selected.winter_washing_pricelist"
            label="Прайслист (зимний период)"
            accept=".pdf"
            :max-size-mb="ADMIN_FILE_MAX_SIZE_MB"
            :info="files.winter_washing_pricelist"
            :loading="pending"
            :uploading="uploadingKey === 'winter_washing_pricelist'"
            :disabled="uploadingKey !== null"
            @upload="onUpload('winter_washing_pricelist')"
            @restore="restore('winter_washing_pricelist')"
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
        <AdminFileUploadCard
            v-model="selected.cmr"
            label="CMR"
            accept=".pdf"
            :max-size-mb="ADMIN_FILE_MAX_SIZE_MB"
            :info="files.cmr"
            :loading="pending"
            :uploading="uploadingKey === 'cmr'"
            :disabled="uploadingKey !== null"
            @upload="onUpload('cmr')"
            @restore="restore('cmr')"
        />
        <AdminFileUploadCard
            v-model="selected.licence"
            label="Лицензия"
            accept=".pdf"
            :max-size-mb="ADMIN_FILE_MAX_SIZE_MB"
            :info="files.licence"
            :loading="pending"
            :uploading="uploadingKey === 'licence'"
            :disabled="uploadingKey !== null"
            @upload="onUpload('licence')"
            @restore="restore('licence')"
        />
      </div>
    </section>
  </div>
</template>