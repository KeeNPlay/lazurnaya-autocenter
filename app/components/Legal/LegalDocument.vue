<script setup lang="ts">
import type { LegalDocumentData } from '~/constants/legalDocuments'

defineProps<{ doc: LegalDocumentData }>()
function splitBold(text: string): string[] {
  return text.split('**')
}
</script>

<template>
  <div class="bg-gray-100 pt-6 pb-16 lg:py-24">
    <article class="mx-auto w-full max-w-4xl px-4 lg:px-8">
      <h1 class="text-white font-medium text-2xl lg:text-4xl 2xl:text-5xl leading-tight">
        {{ doc.title }}
      </h1>
      <p class="mt-3 text-gray-900 text-sm lg:text-base">
        Редакция от {{ doc.edition }}
      </p>

      <div class="mt-8 lg:mt-10 flex flex-col gap-y-4 text-gray-900 text-sm lg:text-base 2xl:text-lg leading-relaxed">
        <p v-for="(text, i) in doc.intro" :key="i">
          {{ text }}
        </p>
      </div>

      <section
          v-for="section in doc.sections"
          :key="section.title"
          class="mt-10 lg:mt-12 flex flex-col gap-y-4 text-gray-900 text-sm lg:text-base 2xl:text-lg leading-relaxed"
      >
        <h2 class="text-white font-medium text-lg lg:text-2xl 2xl:text-3xl">
          {{ section.title }}
        </h2>

        <template v-for="(block, i) in section.blocks" :key="i">
          <ul
              v-if="Array.isArray(block)"
              class="flex flex-col gap-y-2 pl-6 list-disc marker:text-orange-500"
          >
            <li v-for="(item, j) in block" :key="j">
              <template v-for="(part, k) in splitBold(item)" :key="k">
                <strong v-if="k % 2" class="text-white font-medium">{{ part }}</strong>
                <template v-else>{{ part }}</template>
              </template>
            </li>
          </ul>

          <p v-else>
            <template v-for="(part, k) in splitBold(block)" :key="k">
              <strong v-if="k % 2" class="text-white font-medium">{{ part }}</strong>
              <template v-else>{{ part }}</template>
            </template>
          </p>
        </template>
      </section>

      <nav class="mt-12 lg:mt-16 flex flex-wrap gap-x-6 gap-y-3 border-t border-gray-200 pt-6 text-sm lg:text-base">
        <NuxtLink to="/" class="text-orange-700 hover:text-orange-800 underline transition-colors duration-200">
          На главную
        </NuxtLink>
        <NuxtLink to="/privacy" class="text-orange-700 hover:text-orange-800 underline transition-colors duration-200">
          Политика конфиденциальности
        </NuxtLink>
        <NuxtLink to="/terms" class="text-orange-700 hover:text-orange-800 underline transition-colors duration-200">
          Пользовательское соглашение
        </NuxtLink>
      </nav>
    </article>
  </div>
</template>