<template>
    <div class="flex items-center">
        <div class="p-1.75 bg-orange-500 rounded-[5px] 2xl:rounded-[10px]">
            <Icon name="custom-icons:app-logo" class="text-[1.25rem] text-black 2xl:text-[2.5rem]"/>
        </div>
        <span v-if="$slots.default" class="text-sm ml-1.75 font-bold 2xl:text-lg 2xl:ml-3"><slot /></span>
    </div>
</template>