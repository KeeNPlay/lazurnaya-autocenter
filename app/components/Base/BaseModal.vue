<script setup lang="ts">
import { watch, onUnmounted } from 'vue'

interface Props {
    modelValue: boolean
    title?: string
    loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false
})

const emit = defineEmits<{ 'update:modelValue': [value: boolean] }>()

const close = (): void => {
    emit('update:modelValue', false)
}

const handleKeydown = (event: KeyboardEvent): void => {
    if (event.key === 'Escape') {
        close()
    }
}

watch(
    () => props.modelValue,
    (isOpen) => {
        if (import.meta.client) {
        document.body.style.overflow = isOpen ? 'hidden' : ''
        }

        if (isOpen) {
        document.addEventListener('keydown', handleKeydown)
        } else {
        document.removeEventListener('keydown', handleKeydown)
        }
    }
)

onUnmounted(() => {
    if (import.meta.client) {
        document.body.style.overflow = ''
    }
    document.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
    <Teleport to="body">
        <Transition name="modal-fade">
        <div
            v-if="modelValue"
            class="fixed inset-0 z-100 flex items-start justify-center overflow-y-auto lg:px-20 2xl:px-40.5 py-0 md:py-10"
            role="dialog"
            aria-modal="true"
            :aria-label="title"
        >
            <div class="fixed inset-0 bg-black/50" @click="close" />

            <div class="relative my-auto">
                <BaseLoader v-if="loading" />
            
                <slot />
                <BaseButton
                    type="button"
                    class="absolute top-4 right-4 transition-colors cursor-pointer"
                    aria-label="Закрыть окно"
                    @click="close"
                >
                    <Icon name="heroicons:x-mark" class="text-2xl" />
                </BaseButton>
            </div>
        </div>
        </Transition>
    </Teleport>
</template>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
    transition: opacity 0.2s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
    opacity: 0;
}
</style>