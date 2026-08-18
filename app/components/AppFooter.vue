<script setup lang="ts">

const links = useNavLinks()

</script>

<template>
    <footer class="flex flex-col px-4 py-7.5 lg:px-20 lg:py-10 2xl:px-40.5 2xl:py-12.5 gap-y-7.5 lg:gap-y-0 outline-1 outline-gray-150 bg-gray-100">
        <div class="flex flex-col lg:flex-row items-center justify-between gap-y-7.5 lg:gap-y-0">
            <AppLogo>АВТОЦЕНТР НА ЛАЗУРНОЙ</AppLogo>
            <nav class="flex flex-wrap justify-center items-center pt-7.5 lg:pt-0 gap-x-6 2xl:gap-x-8 border-t lg:border-none border-gray-150">
                <NuxtLink
                    v-for="link in links"
                    :key="link.path"
                    :to="link.path"
                    class="nav-link"
                >
                    {{ link.title }}
                </NuxtLink>
            </nav>
            <div class="p-3.5 gap-y-1.25 text-center border border-gray-150 rounded-xl w-full md:w-fit">
                <h4 class="text-sm lg:text-base 2xl:text-lg font-medium text-orange-500">График работы:</h4>
                <div class="text-sm lg:text-base 2xl:text-lg font-medium text-white">
                    <p>8:30 - 12:45</p>
                    <p>13:30 - 16:30</p>
                </div>
                <p class="text-[0.5rem] 2xl:text-[0.625rem] font-medium text-gray-400">Суббота, воскресенье - выходной</p>
            </div>
        </div>
        <div class="flex flex-col lg:flex-row justify-center lg:justify-between items-center pt-0 lg:pt-10 2xl:pt-12.5 gap-y-5 border-none lg:border-t border-gray-150">
            <address class="flex flex-col md:flex-row justify-center w-full md:w-fit gap-x-7.5 not-italic">
                <NuxtLink class="flex items-center justify-center flex-nowrap w-full md:w-fit gap-x-2.5 p-3 md:pt-0 2xl:pb-4
                                border-b border-gray-150 text-sm 2xl:text-base text-gray-900 hover:text-white
                                leading-relaxed transition-colors duration-200 group"
                    to="mailto:avtolaz19@yandex.ru"
                    external>
                <Icon class="text-[1.25rem] 2xl:text-[1.5rem] text-orange-500 group-hover:text-orange-700 transition-colors duration-200" name="heroicons:envelope-20-solid"/>
                avtolaz19@yandex.ru
                </NuxtLink>
                <NuxtLink class="flex items-center justify-center flex-nowrap w-full md:w-fit gap-x-2.5 p-3 md:pt-0 2xl:pb-4
                                border-b border-gray-150 text-sm 2xl:text-base text-gray-900 hover:text-white
                                leading-relaxed transition-colors duration-200 group"
                    to="tel:+375447154444"
                    external>
                <Icon class="text-[1.25rem] 2xl:text-[1.5rem] text-orange-500 group-hover:text-orange-700 transition-colors duration-200" name="heroicons:phone-20-solid"/>
                +375 44 715 44 44
                </NuxtLink>
                <NuxtLink class="flex items-center justify-center flex-nowrap w-full md:w-fit gap-x-2.5 p-3 md:pt-0 2xl:pb-4
                                border-b border-gray-150 text-sm 2xl:text-base text-gray-900 hover:text-white
                                leading-relaxed transition-colors duration-200 group"
                    to="https://yandex.by/maps/-/CTCjNULx"
                    target="_blank"
                    external>
                <Icon class="text-[1.25rem] 2xl:text-[1.5rem] text-orange-500 group-hover:text-orange-700 transition-colors duration-200" name="heroicons:map-pin-20-solid"/>
                    г. Гомель, ул. Лазурная, 19
                </NuxtLink>
            </address>
            <small class="text-sm 2xl:text-lg text-gray-600 text-center">
                © 2026 АВТОЦЕНТР НА ЛАЗУРНОЙ. Все права защищены.
            </small>
        </div>
    </footer>
</template>