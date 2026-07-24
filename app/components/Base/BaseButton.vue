<script setup lang="ts">
import { NuxtLink } from '#components'
import { computed } from 'vue'

type Variant = 'primary' 
                | 'secondary' 
                | 'ghost'
type Width = 'auto' 
                | 'full' 
                | 'fixed'

type BaseProps = {
  variant?: Variant
  width?: Width
  fixedWidthClass?: string
  ariaLabel?: string
  class?: string
}

type ButtonOnlyProps = BaseProps & {
  to?: never
  external?: never
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
}

type LinkOnlyProps = BaseProps & {
  to: string
  external?: boolean
  type?: never
  disabled?: never
}

type Props = ButtonOnlyProps | LinkOnlyProps

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  width: 'auto',
}) as Required<
  Pick<BaseProps, 'variant' | 'width'>
> &
  Omit<Props, 'variant' | 'width'>

const isLink = computed(() => {
  return typeof (props as LinkOnlyProps).to === 'string'
})

const componentTag = computed(() => {
  return isLink.value ? NuxtLink : 'button'
})

const relValue = computed(() => {
  return isLink.value && props.external
    ? 'noopener noreferrer'
    : undefined
})

const base =
  'inline-flex items-center justify-center gap-2 text-sm font-medium rounded-md transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:pointer-events-none 2xl:text-lg 2xl:rounded-lg'

const variants: Record<Variant, string> = {
  primary: 'bg-orange-500 hover:bg-orange-600 text-gray-150 px-5.5 py-3 2xl:px-6 2xl:py-4',
  secondary: 'bg-gray-150 hover:bg-gray-200 text-white px-5.5 py-3 2xl:px-6 2xl:py-4',
  ghost: 'bg-gray-200/20 hover:bg-gray-200/40 backdrop-blur-md hover:backdrop-blur-lg border border-gray-200 text-white px-5.5 py-3 2xl:px-6 2xl:py-4',
}

const widthClasses = computed(() => {
  switch (props.width) {
    case 'full':
      return 'w-full'
    case 'fixed':
      return props.fixedWidthClass ?? 'w-48'
    default:
      return 'w-auto'
  }
})

const classes = computed(() => {
  return [
    base,
    variants[props.variant],
    widthClasses.value,
    props.class,
  ]
    .filter(Boolean)
    .join(' ')
})
</script>

<template>
  <component
    :is="componentTag"
    :to="isLink ? props.to : undefined"
    :external="isLink ? props.external : undefined"
    :rel="relValue"
    :type="!isLink ? props.type ?? 'button' : undefined"
    :disabled="!isLink ? props.disabled : undefined"
    :class="classes"
    :aria-label="ariaLabel"
  >
    <slot name="icon-left" />
    <slot />
    <slot name="icon-right" />
  </component>
</template>