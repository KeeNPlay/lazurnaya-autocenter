<script setup lang="ts">

interface IProps {
    link: string,
    description: string,
}

defineProps<IProps>()

</script>


<template>
    <section class="flex flex-col items-center md:flex-row px-6 py-10 lg:p-15 2xl:p-20 gap-6 lg:gap-8 2xl:gap-10 mx-4 lg:mx-0 border-r border-l border-gray-150">
        <BaseIconBlock icon-variant="glow"><Icon name="heroicons:receipt-percent-20-solid" class="" /></BaseIconBlock>
        <div class="flex flex-col gap-2 2xl:gap-5 text-center md:text-left">
            <h4 class="text-xl lg:text-2xl 2xl:text-3xl">Прайслист</h4>
            <p class="text-gray-600 font-light text-sm lg:text-base 2xl:text-lg">{{ description }}</p>
        </div>
        <div>
            <BaseButton class="align-right" :to="link" :external="true">Ознакомиться</BaseButton>
        </div>
    </section>
</template>