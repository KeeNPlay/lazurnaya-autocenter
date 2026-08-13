<script setup lang="ts">
interface Option {
  label: string
  value: string
}

interface Props {
  modelValue: string[]
  options: Option[]
  title?: string
}

const props = defineProps<Props>()
const emit = defineEmits<{ 'update:modelValue': [value: string[]] }>()

function toggle(value: string): void {
  const set = new Set(props.modelValue)
  set.has(value) ? set.delete(value) : set.add(value)
  emit('update:modelValue', Array.from(set))
}

function isChecked(value: string): boolean {
  return props.modelValue.includes(value)
}
</script>

<template>
  <fieldset class="flex flex-col gap-y-7.5 2xl:gap-y-10 p-6 lg:p-7.5 2xl:p-10 border border-gray-150 rounded-md 2xl:rounded-lg bg-gray-150/50">
    <p v-if="title" class="text-white text-base lg:text-lg 2xl:text-2xl font-medium">
      {{ title }}
    </p>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-x-0 gap-y-5 lg:gap-x-5 lg:gap-y-6">
      <label 
        v-for="opt in options"
        :key="opt.value"
        class="flex items-center gap-x-3 cursor-pointer select-none"
      >
        <span
          class="relative mt-0.5 w-7 h-7 shrink-0 rounded border bg-gray-150 border-gray-200 flex items-center justify-center
                 transition-colors duration-200"
        >
          <input
            type="checkbox"
            required
            class="peer sr-only"
            :checked="isChecked(opt.value)"
            @change="toggle(opt.value)"
          >
          <Icon
            name="heroicons:check-16-solid"
            class="w-5 h-5 text-orange-500 opacity-0 peer-checked:opacity-100 transition-opacity duration-200"
          />
        </span>
        <span class="text-gray-900 lg:text-base 2xl:text-lg leading-relaxed">
          {{ opt.label }}
        </span>
      </label>
    </div>
  </fieldset>
</template>