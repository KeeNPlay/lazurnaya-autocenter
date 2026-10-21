<template>
    <section class="flex flex-col lg:flex-row justify-center px-6 py-7.5 lg:py-10 2xl:py-12.5 gap-y-5 gap-x-0 lg:gap-x-5 2xl:gap-x-7.5 border border-gray-150">
        <BaseButton
            to="mailto:avtolaz19@yandex.ru"
            :external="true"
            variant="secondary"
            aria-label="Отправить электронное письмо"
        >
            <template #icon-left>
            <Icon name="heroicons:envelope-20-solid" class="text-[1.4rem] text-orange-500" aria-hidden="true" />
            </template>
            avtolaz19@yandex.ru
        </BaseButton>
        <BaseButton
            to="tel:+375447154444"
            :external="true"
            variant="secondary"
            aria-label="Осуществить звонок"
        >
            <template #icon-left>
            <Icon name="heroicons:phone-20-solid" class="text-[1.4rem] text-orange-500" aria-hidden="true" />
            </template>
            +375 44 715 44 44
        </BaseButton>
        <BaseButton
            to="https://yandex.by/maps/-/CTCjNULx"
            :external="true"
            target="_blank"
            variant="secondary"
            aria-label="Найти на карте"
        >
            <template #icon-left>
            <Icon name="heroicons:map-pin-20-solid" class="text-[1.4rem] text-orange-500" aria-hidden="true" />
            </template>
            Республика Беларусь, г. Гомель, ул. Лазурная, 19
        </BaseButton>
    </section>
</template>