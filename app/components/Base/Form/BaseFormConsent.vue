<script setup lang="ts">
interface ConsentModel {
  dataProcessing: boolean
  privacyPolicy: boolean
}

interface Props {
  modelValue: ConsentModel
  note?: string
}

defineProps<Props>()
const emit = defineEmits<{ 'update:modelValue': [value: ConsentModel] }>()

function toggle(key: keyof ConsentModel, checked: boolean, current: ConsentModel): void {
  emit('update:modelValue', { ...current, [key]: checked })
}
</script>

<template>
  <fieldset class="flex flex-col gap-y-7.5 2xl:gap-y-10">
    <h4 class="text-white font-medium text-base lg:text-lg 2xl:text-2xl">
      Обработка персональных данных
    </h4>

    <div class="flex flex-col gap-y-5 lg:gap-y-6">
      <label class="flex items-center gap-x-3 cursor-pointer select-none">
        <span
          class="relative mt-0.5 w-7 h-7 shrink-0 rounded border bg-gray-150 border-gray-200 flex items-center justify-center
                 transition-colors duration-200"
        >
          <input
            type="checkbox"
            required
            class="peer sr-only"
            :checked="modelValue.dataProcessing"
            @change="toggle('dataProcessing', ($event.target as HTMLInputElement).checked, modelValue)"
          >
          <Icon
            name="heroicons:check-16-solid"
            class="w-5 h-5 text-orange-500 opacity-0 peer-checked:opacity-100 transition-opacity duration-200"
          />
        </span>
        <span class="text-gray-900 text-[0.625rem] lg:text-sm 2xl:text-lg leading-relaxed">
          Я даю своё согласие на
          <NuxtLink to="#" class="text-orange-700 hover:text-orange-800 underline transition-colors duration-200">
            обработку моих персональных данных</NuxtLink>
          (имя, номер телефона, адрес электронной почты, а также иные предоставленные мной данные)<span class="text-orange-500">*</span>
        </span>
      </label>

      <label class="flex items-start gap-x-3 cursor-pointer select-none">
        <span
          class="relative mt-0.5 w-7 h-7 shrink-0 rounded border bg-gray-150 border-gray-200 flex items-center justify-center
                 transition-colors duration-200"
        >
          <input
            type="checkbox"
            required
            class="peer sr-only"
            :checked="modelValue.privacyPolicy"
            @change="toggle('privacyPolicy', ($event.target as HTMLInputElement).checked, modelValue)"
          >
          <Icon
            name="heroicons:check-16-solid"
            class="w-5 h-5 text-orange-500 opacity-0 peer-checked:opacity-100 transition-opacity duration-200"
          />
        </span>
        <span class="text-gray-900 text-[0.625rem] lg:text-sm 2xl:text-lg leading-relaxed">
          Я подтверждаю, что ознакомлен(а) с
          <NuxtLink to="#" class="text-orange-700 hover:text-orange-800 underline transition-colors duration-200">
            Политикой конфиденциальности</NuxtLink>, правами по защите персональных данных и механизмом их реализации<span class="text-orange-500">*</span>
        </span>
      </label>

      <p v-if="note" class="text-gray-900 text-[0.625rem] lg:text-sm 2xl:text-lg leading-relaxed"><span class="text-orange-700 mr-1">*</span>{{ note }}</p>
    </div>
  </fieldset>
</template>