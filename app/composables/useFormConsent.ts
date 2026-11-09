import type { MaybeRefOrGetter } from 'vue'

export function useFormConsent(isFormFilled: MaybeRefOrGetter<boolean> = true) {
  const consent = ref({
    dataProcessing: false,
    privacyPolicy: false,
  })

  const captchaToken = ref<string | undefined>(undefined)

  const canSubmit = computed((): boolean =>
      toValue(isFormFilled) &&
      consent.value.privacyPolicy &&
      !!captchaToken.value
  )

  function resetConsent(): void {
    consent.value = {
      dataProcessing: false,
      privacyPolicy: false,
    }
  }

  return { consent, captchaToken, canSubmit, resetConsent }
}