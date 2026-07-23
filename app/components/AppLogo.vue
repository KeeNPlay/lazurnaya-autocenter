<template>
    <div class="flex items-center">
        <div class="p-2.5 bg-orange-500 rounded-[10px]">
            <Icon name="custom-icons:app-logo" class="text-[2.5rem] text-black"/>
        </div>
        <span v-if="$slots.default" class="text-lg font-bold ml-3"><slot /></span>
    </div>
</template>