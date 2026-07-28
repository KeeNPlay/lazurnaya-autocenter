<script setup lang="ts">

type Variant = 'primary' | 'secondary'

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
}

</script>

<template>
    <div :class="variants[iconVariant]">
        <slot />
    </div>
</template>