<script setup lang="ts">
interface Props {
  label: string
  accept?: string
  maxSizeMb?: number
  disabled?: boolean
  required?: boolean
}

withDefaults(defineProps<Props>(), {
  accept: '',
  maxSizeMb: undefined,
  disabled: false,
  required: false
})

const modelValue = defineModel<File | null>({ default: null })
</script>

<template>
  <article>
    <BaseFormField :label="label" :required="required">
      <BaseFormFileUpload v-model="modelValue" :accept="accept" :max-size-mb="maxSizeMb" :disabled="disabled" />
    </BaseFormField>
  </article>
</template>