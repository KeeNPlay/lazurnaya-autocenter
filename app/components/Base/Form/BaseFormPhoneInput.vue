<script setup lang="ts">
import { ref, watch } from 'vue'
import { vMaska } from 'maska/vue'
import { PHONE_MASK, DEFAULT_PHONE_PLACEHOLDER } from '~/constants/phone'

interface Props {
  modelValue: string
  id?: string
  required?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: ''
})

const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

interface MaskaDetail {
  masked: string
  unmasked: string
}

const staticPrefix = PHONE_MASK.split('#')[0] ?? ''

const displayValue = ref<string>(props.modelValue || staticPrefix)

const handleMaska = (event: CustomEvent<MaskaDetail>): void => {
  displayValue.value = event.detail.masked
  emit('update:modelValue', event.detail.unmasked)
}

watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue === '') {
      displayValue.value = staticPrefix
    }
  }
)
</script>

<template>
  <input
    autocomplete="tel"
    inputmode="tel"
    :id="id"
    v-maska
    :data-maska="PHONE_MASK"
    data-maska-eager
    type="tel"
    :value="displayValue"
    :required="required"
    :placeholder="DEFAULT_PHONE_PLACEHOLDER"
    class="w-full bg-transparent border-b border-gray-200 pb-1.5 text-gray-900 text-base 2xl:text-lg
           placeholder:text-gray-400 focus:outline-none hover:border-orange-500 focus:border-orange-500 transition-colors duration-200"
    @maska="handleMaska"
  >
</template>