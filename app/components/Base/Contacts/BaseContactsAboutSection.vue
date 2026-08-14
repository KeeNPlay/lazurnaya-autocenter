<template>
    <section class="flex flex-col lg:flex-row items-center justify-center px-6 py-7.5 lg:px-20 lg:py-25 2xl:px-37.5 2xl:py-25 gap-x-25 gap-y-7.5 border-l border-r border-gray-150" aria-label="О нас">
        <div class="flex flex-col gap-y-4">
            <h3 class="font-semibold text-xl md:text-2xl lg:text-4xl 2xl:text-5xl">Автоцентр на Лазурной</h3>
            <p class="text-xs md:text-sm lg:text-base 2xl:text-xl text-gray-600 lg:max-w-lg">
                Мы работаем в соответствии с современными стандартами и предлагаем комплексные услуги по гостехосмотру, мойке транспорта и организации международных перевозок. 
                На территории автоцентра оборудован современный моечный цех, оснащённый профессиональной техникой от одного из ведущих мировых производителей — Kärcher. 
                Для комфорта посетителей предусмотрена уютная зона ожидания, где можно отдохнуть, ознакомиться со свежей прессой или посмотреть телевизор. 
                Мы уверены, что однажды обратившись к нам, вы оцените уровень сервиса и станете нашим постоянным клиентом.
            </p>
        </div>
        <div class="relative w-full max-w-xl aspect-square flex items-center justify-center rounded-xl lg:rounded-2xl border border-gray-150 overflow-hidden">
            <NuxtImg
                src="images/contacts_logo_bg.jpg"
                format="webp"
                quality="80"
                aria-hidden="true"
                alt=""
                fit="cover"
                class="absolute inset-0 w-full h-full object-cover mix-blend-overlay"
                loading="eager"
            />

            <div class="absolute inset-x-0 top-1/2 h-0.5 -translate-y-1/2 bg-linear-to-r from-transparent via-orange-500 to-transparent" />
            <div class="absolute inset-y-0 left-1/2 w-0.5 -translate-x-1/2 bg-linear-to-b from-transparent via-orange-500 to-transparent" />

            <div class="absolute top-1/2 left-1/2 h-1/2 w-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange-950/30 blur-3xl" />

            <div class="absolute inset-0 bg-orange-500/20 pointer-events-none mix-blend-color"></div>
            <div class="absolute inset-0 flex items-center justify-center">
                <AppLogo 
                    variant="glow"
                    size="xl"
                />
            </div>
        </div>
    </section>
</template>