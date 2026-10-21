<script setup lang="ts">

const SUBMIT_ERROR_MESSAGE = 'Не удалось отправить заявку. Попробуйте ещё раз позже.' as const
const SUBMIT_SUCCESS_MESSAGE = 'Заявка отправлена успешно! В ближайшее время с вами свяжется сотрудник автоцентра' as const

type FormAlertVariant = 'error' | 'success'

interface FormAlertConfig {
  icon: string
  bgClass: string
  role: 'alert' | 'status'
  ariaLive: 'assertive' | 'polite'
}

const variant: Record<FormAlertVariant, FormAlertConfig> = {
  error: {
    icon: 'heroicons:x-circle-20-solid',
    bgClass: 'bg-red-800',
    role: 'alert',
    ariaLive: 'assertive'
  },
  success: {
    icon: 'heroicons:check-circle-20-solid',
    bgClass: 'bg-green-800',
    role: 'status',
    ariaLive: 'polite'
  }
}

interface Props {
  variant: FormAlertVariant
  message?: string
}

const props = defineProps<Props>()

const config = computed(() => variant[props.variant])
</script>

<template>
    <Transition>
        <div
            :role="config.role"
            :aria-live="config.ariaLive"
            class="px-5 py-3 2xl:px-6 2xl:py-4 flex items-center gap-x-2 text-sm 2xl:text-lg rounded-lg"
            :class="config.bgClass"
        >
            <Icon :name="config.icon" class="shrink-0 text-base 2xl:text-xl" />
            <span>{{ props.variant === 'error' ? SUBMIT_ERROR_MESSAGE : SUBMIT_SUCCESS_MESSAGE }}</span>
        </div>
    </Transition>
</template>