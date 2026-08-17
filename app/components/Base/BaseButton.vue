  <script setup lang="ts">
  import { NuxtLink } from '#components'
  import { computed } from 'vue'

  type Variant = 'primary' | 'secondary' | 'ghost'
  type Width = 'auto' | 'full' | 'fixed'
  type ComponentType = 'button' | 'submit' | 'reset'

  interface IProps {
    variant?: Variant
    width?: Width
    componentType?: ComponentType
    fixedWidthClass?: string
    ariaLabel?: string
    to?: string
    external?: boolean
    disabled?: boolean
  }

  const props = withDefaults(defineProps<IProps>(), {
    variant: 'primary',
    width: 'auto',
    componentType: 'button',
  })

  const isLink = computed(() => !!props.to)

  const componentTag = computed(() => {
    return isLink.value ? NuxtLink : 'button'
  })

  const base =
    'flex items-center justify-center gap-2 text-sm text-center font-medium rounded-md transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:pointer-events-none 2xl:text-lg 2xl:rounded-lg'

  const variants: Record<Variant, string> = {
    primary:
      'bg-orange-500 hover:bg-orange-600 text-gray-150 px-5 py-3 2xl:px-6 2xl:py-4',
    secondary:
      'bg-gray-150 hover:bg-gray-200 text-white px-5 py-3 2xl:px-6 2xl:py-4',
    ghost:
      'bg-gray-200/20 hover:bg-gray-200/40 backdrop-blur-md border border-gray-200 text-white px-5 py-3 2xl:px-6 2xl:py-4',
  }

  const widthClasses = computed(() => {
    switch (props.width) {
      case 'full': return 'w-full'
      case 'fixed': return props.fixedWidthClass ?? 'w-48'
      default: return 'w-auto'
    }
  })

  const classes = computed(() => {
    return [
      base,
      variants[props.variant],
      widthClasses.value,
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
      :target="props.external ? '_blank' : undefined"
      :componentType="!isLink ? props.componentType : undefined"
      :disabled="!isLink ? props.disabled : undefined"
      :class="classes"
      :aria-label="ariaLabel"
    >
      <slot name="icon-left" />
      <slot />
      <slot name="icon-right" />
    </component>
  </template>