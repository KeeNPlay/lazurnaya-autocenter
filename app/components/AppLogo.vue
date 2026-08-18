<script setup lang="ts">

type Variant = 'primary' | 'glow'
type Size = 'xl' | 'lg' | 'base'

interface IProps {
  variant?: Variant, 
  size?: Size,
}

const variants: Record<Variant, string> = {
    primary:
        'bg-orange-500',
    glow:
        'bg-orange-500 inset-shadow-white/50',
}

const sizes: Record<Size, string> = {
    xl:
        'p-4 lg:p-5 2xl:p-7.5 rounded-xl lg:rounded-2xl 2xl:rounded-3xl text-5xl lg:text-6xl 2xl:text-8xl inset-shadow-2xl lg:inset-shadow-3xl 2xl:inset-shadow-4xl',
    lg:
        'p-2.5 lg:p-3 2xl:p-4 text-3xl rounded-md lg:rounded-lg 2xl:rounded-2xl lg:text-4xl 2xl:text-5xl inset-shadow-base lg:inset-shadow-lg 2xl:inset-shadow-2xl',
    base:
        'p-1.75 2xl:p-2.5 rounded-[5px] 2xl:rounded-[10px] text-[1.25rem] 2xl:text-[2.5rem] inset-shadow-xs lg:inset-shadow-sm 2xl:inset-shadow-base',
}

const props = withDefaults(defineProps<IProps>(), {
    variant: 'primary',
    size: 'base',
})

const classes = computed(() => {
    return [
      props.variant === 'glow' ? sizes[props.size] : `${sizes[props.size]} !inset-shadow-none`,
      variants[props.variant],
      
    ]
      .filter(Boolean)
      .join(' ')
  })

</script>

<template>
    <div class="flex items-center">
        <div :class="classes">
            <Icon name="custom-icons:app-logo" class="text-gray-100"/>
        </div>
        <span v-if="$slots.default" class="text-sm ml-1.75 font-bold 2xl:text-lg 2xl:ml-3"><slot /></span>
    </div>
</template>