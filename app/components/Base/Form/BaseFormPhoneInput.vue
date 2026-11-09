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
// Digits of the static prefix, e.g. "375"
const prefixDigits = staticPrefix.replace(/\D/g, '')

// Builds a masked string from "bare" digits (without the 375 prefix).
// Maska must receive a string that already contains the prefix; otherwise, digits 3/7/5
// at the beginning are mistaken for the prefix and swallowed.
function formatDigits(rawDigits: string): string {
  const digits = rawDigits.replace(/\D/g, '')
  let result = ''
  let index = 0

  for (const char of PHONE_MASK) {
    if (char === '#') {
      if (index >= digits.length) break
      result += digits[index++]
    } else {
      result += char
    }
  }

  return result
}

// Extracts "bare" digits from the displayed string
function extractDigits(display: string): string {
  const digits = display.replace(/\D/g, '')
  return digits.startsWith(prefixDigits) ? digits.slice(prefixDigits.length) : digits
}

const displayValue = ref<string>(props.modelValue ? formatDigits(props.modelValue) : staticPrefix)

const handleMaska = (event: CustomEvent<MaskaDetail>): void => {
  displayValue.value = event.detail.masked
  emit('update:modelValue', event.detail.unmasked)
}

watch(
    () => props.modelValue,
    (newValue) => {
      if (newValue === '') {
        displayValue.value = staticPrefix
        return
      }

      // External change (not typing): sync the display
      if (newValue !== extractDigits(displayValue.value)) {
        displayValue.value = formatDigits(newValue)
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