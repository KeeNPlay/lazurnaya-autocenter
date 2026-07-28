<template>
    <div class="flex flex-col py-6 lg:px-6 lg:py-3 2xl:px-10 2xl:py-5 text-center dark:text-white w-1/2 lg:w-1/4">
        <p class="text-xl md:text-3xl 2xl:text-4xl font-semibold">
            <slot />
        </p>
        <p class="text-[0.625rem] md:text-base 2xl:text-lg">
            <slot name="description" />
        </p>
    </div>
</template>