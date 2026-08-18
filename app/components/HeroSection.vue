<script setup lang="ts">
const isDesktop = useMediaQuery('(min-width: 80rem)')
const { openModal } = useBookingModal()
</script>

<template>
    <section class="relative border-l border-r border-gray-150" aria-label="Приветственная секция">
        <NuxtImg
            src="/images/hero.jpg"
            alt=""
            role="presentation"
            fit="cover"
            class="absolute inset-0 w-full h-full object-cover"
            format="webp"
            quality="80"
            loading="eager"
            fetchpriority="high"
            preload
        />
        <div class="relative flex flex-col gap-y-10 2xl:gap-y-12.5 items-center z-10 px-4">
            <div class="flex flex-col gap-y-7.5 2xl:gap-y-10">
                <h1 class="pt-20 md:pt-28 text-white text-[1.8rem] sm:text-4xl 
                           lg:text-5xl 2xl:text-6xl font-semibold text-center">
                    Всё в одном месте: техосмотр, мойка<br>и международные перевозки
                </h1>
                <div class="px-5 py-4.5 lg:px-7.5 2xl:px-10 2xl:py-6 mx-auto border 
                          border-gray-150 rounded-xl inline-flex items-center gap-x-1.25
                          text-center text-sm sm:text-base lg:text-lg 2xl:text-xl 
                          text-gray-600 backdrop-blur-md bg-gray-150/20 w-fit">
                    <ClientOnly>
                        <template v-if="!isDesktop">
                            <p>Мы отличаемся профессиональным подходом, современным оборудованием и многолетним опытом</p>
                        </template>
                        <template v-else>
                            <p>Мы отличаемся</p>
                            <BaseArticle as="mark">профессиональным подходом</BaseArticle>
                            <p>,</p>
                            <BaseArticle as="mark">современным оборудованием</BaseArticle>
                            <p>и</p>
                            <BaseArticle as="mark">многолетним опытом</BaseArticle>
                        </template>
                        <template #fallback>
                            <p>Мы отличаемся профессиональным подходом, современным оборудованием и многолетним опытом</p>
                        </template>
                    </ClientOnly>
                </div>

            </div>
            <div class="mb-22 lg:mb-70 flex gap-x-3">
                <BaseButton
                    to="/gallery"
                    variant="ghost"
                >
                    Галерея
                </BaseButton>
                <BaseButton
                    @click="openModal"
                >
                    Записаться
                </BaseButton>
            </div>
        </div>
    </section>
</template>