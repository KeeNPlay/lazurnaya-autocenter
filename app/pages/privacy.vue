<script setup lang="ts">
import { privacyDocument } from '~/constants/legalDocuments'

useSeoMeta({
  title: 'Политика конфиденциальности — ООО «Автоцентр на Лазурной»',
  description: 'Как ООО «Автоцентр на Лазурной» обрабатывает и защищает персональные данные пользователей сайта acl.com.by.',
})
</script>

<template>
  <LegalDocument :doc="privacyDocument" />
</template>