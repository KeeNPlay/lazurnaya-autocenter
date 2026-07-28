<script setup lang="ts">
type Variant = 'primary' | 'badge';
type Tag = 'span' | 'div' | 'p' | 'mark'
    
interface IProps {
    variant?: Variant
    as?: Tag
}

const props = withDefaults(defineProps<IProps>(), {
    variant: 'primary',
    as: 'p',
})

const variants: Record<Variant, string> = {
  primary:
    'px-3.5 py-3 bg-gray-150 rounded-md 2xl:rounded-lg text-white',
  badge:
    'px-6 py-3.5 2xl:px-8.5 2xl:py-5 font-medium text-xs sm:text-base 2xl:text-lg dark:text-white rounded-full bg-gray-100 border border-gray-150',
}
</script>

<template>
    <component
        :class="variants[props.variant]"
        :is="as"
    >
        <slot />
    </component>
</template>