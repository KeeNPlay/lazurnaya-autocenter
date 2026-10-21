<script setup lang="ts">

type Variant = 'primary' | 'secondary' | 'glow'

interface IProps {
    iconVariant?: Variant
}

const props = withDefaults(defineProps<IProps>(), {
  iconVariant: 'primary',
})

const variants: Record<Variant, string> = {
  primary:
    'p-4 lg:p-5 2xl:p-6 border border-gray-150 bg-linear-to-bl from-orange-500/5 to-orange-500/0 w-fit rounded-[10px] text-orange-500',
  secondary:
    'text-orange-700 font-semibold',
  glow:
    'p-5 lg:p-6 2xl:p-8 text-gray-100 rounded-xl lg:rounded-2xl 2xl:rounded-3xl text-5xl lg:text-6xl 2xl:text-8xl bg-orange-500 inset-shadow-white/50 inset-shadow-2xl lg:inset-shadow-3xl 2xl:inset-shadow-4xl'
}

</script>

<template>
    <div :class="variants[iconVariant]">
        <slot />
    </div>
</template>