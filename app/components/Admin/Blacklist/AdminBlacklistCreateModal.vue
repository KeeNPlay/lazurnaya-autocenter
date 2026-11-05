<script setup lang="ts">
import { BLACKLIST_REASON_MAX_LENGTH, type BlacklistCreatePayload } from '~~/shared/utils/blacklist'

const props = withDefaults(
    defineProps<{
      modelValue: boolean
      saving?: boolean
    }>(),
    { saving: false }
)

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  create: [payload: BlacklistCreatePayload]
}>()

const form = reactive({
  phone: '',
  reason: ''
})

// Changes each time it's opened — recreates the fields (including the phone mask)
const formKey = ref<number>(0)

function resetForm(): void {
  form.phone = ''
  form.reason = ''
  formKey.value++
}

// Data is cleared only upon opening: in the event of a server error, the entered information is preserved
watch(
    () => props.modelValue,
    (isOpen): void => {
      if (isOpen) resetForm()
    }
)

const isReasonTooLong = computed<boolean>(() => form.reason.length > BLACKLIST_REASON_MAX_LENGTH)

const canCreate = computed<boolean>(() =>
    !props.saving &&
    form.phone.length === 9 &&
    !isReasonTooLong.value
)

function onCreate(): void {
  if (!canCreate.value) return

  emit('create', {
    phone: form.phone,
    reason: form.reason.trim()
  })
}
</script>

<template>
  <BaseModal
      :model-value="modelValue"
      title="Добавить номер в чёрный список"
      @update:model-value="emit('update:modelValue', $event)"
  >
    <div :key="formKey" class="flex w-full max-w-md flex-col gap-y-5 rounded-md bg-gray-100 p-4">
      <h2 class="text-xl font-medium text-white">Добавить номер</h2>

      <BaseFormField label="Номер телефона" required>
        <BaseFormPhoneInput v-model="form.phone" />
      </BaseFormField>

      <BaseFormField label="Причина">
        <BaseFormTextarea
            v-model="form.reason"
            placeholder="Например: неоднократные неявки по записи"
            :maxlength="BLACKLIST_REASON_MAX_LENGTH"
        />
        <p
            class="mt-1.5 text-right text-xs"
            :class="isReasonTooLong ? 'text-red-500' : 'text-gray-400'"
        >
          {{ form.reason.length }}/{{ BLACKLIST_REASON_MAX_LENGTH }}
        </p>
      </BaseFormField>

      <p class="text-sm text-gray-400">
        Номер будет заблокирован на 1 год. Существующие заявки клиента не изменятся.
      </p>

      <div class="flex justify-end gap-x-3 border-t border-gray-150 pt-4">
        <BaseButton variant="secondary" :disabled="saving" @click="emit('update:modelValue', false)">
          Закрыть
        </BaseButton>
        <BaseButton :disabled="!canCreate" class="disabled:cursor-not-allowed disabled:opacity-50" @click="onCreate">
          Добавить
        </BaseButton>
      </div>
    </div>
  </BaseModal>
</template>