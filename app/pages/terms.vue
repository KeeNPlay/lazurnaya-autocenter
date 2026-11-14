<script setup lang="ts">
import { termsDocument } from '~/constants/legalDocuments'

useSeoMeta({
  title: 'Пользовательское соглашение — ООО «Автоцентр на Лазурной»',
  description: 'Условия использования сайта acl.com.by, онлайн-записи на мойку и гостехосмотр, заявок на международные перевозки.',
})
</script>

<template>
  <LegalDocument :doc="termsDocument" />
</template>