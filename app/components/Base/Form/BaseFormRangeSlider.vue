<script setup lang="ts">
interface Props {
  modelValue: [number, number]
  min: number
  max: number
  step?: number
  title?: string
  description?: string
  unit?: string
}

const props = withDefaults(defineProps<Props>(), { step: 1, unit: '$' })
const emit = defineEmits<{ 'update:modelValue': [value: [number, number]] }>()

const minValue = computed({
  get: () => props.modelValue[0],
  set: (val: number) => emit('update:modelValue', [Math.min(val, props.modelValue[1] - props.step), props.modelValue[1]]),
})

const maxValue = computed({
  get: () => props.modelValue[1],
  set: (val: number) => emit('update:modelValue', [props.modelValue[0], Math.max(val, props.modelValue[0] + props.step)]),
})

const minPercent = computed(() => ((minValue.value - props.min) / (props.max - props.min)) * 100)
const maxPercent = computed(() => ((maxValue.value - props.min) / (props.max - props.min)) * 100)
</script>

<template>
  <div class="flex flex-col gap-y-7.5 2xl:gap-y-10 p-6 lg:p-7.5 2xl:p-10 border border-gray-150 rounded-md 2xl:rounded-lg bg-gray-150/50">
    <div v-if="title" class="flex flex-col gap-y-2 lg:gap-y-3.5">
      <h3 class="text-white text-base lg:text-lg 2xl:text-2xl font-medium">{{ title }}</h3>
      <p v-if="description" class="text-gray-900 text-xs lg:text-base 2xl:text-lg font-light">{{ description }}</p>
    </div>

    <div class="relative h-1 w-full">
      <div class="absolute inset-0 rounded-full bg-gray-200" />
      <div
        class="absolute h-full rounded-full bg-orange-500"
        :style="{ left: `${minPercent}%`, right: `${100 - maxPercent}%` }"
      />
      <input
        v-model.number="minValue"
        type="range"
        :min="min" :max="max" :step="step"
        class="range-thumb absolute inset-0 w-full appearance-none bg-transparent pointer-events-none"
      >
      <input
        v-model.number="maxValue"
        type="range"
        :min="min" :max="max" :step="step"
        class="range-thumb absolute inset-0 w-full appearance-none bg-transparent pointer-events-none"
      >
    </div>

    <div class="flex justify-between text-sm 2xl:text-base text-white">
      <p>{{ unit }}{{ minValue }}<sup class="text-orange-700">*</sup></p>
      <p>{{ unit }}{{ maxValue }}<sup class="text-orange-700">*</sup></p>
    </div>
  </div>
</template>

<style scoped>
.range-thumb::-webkit-slider-thumb {
  pointer-events: auto;
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--color-orange-500);
  border: 4px solid var(--color-gray-300);
  cursor: pointer;
}
.range-thumb::-moz-range-thumb {
  pointer-events: auto;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--color-orange-500);
  border: 4px solid var(--color-gray-300);
  cursor: pointer;
}
</style>