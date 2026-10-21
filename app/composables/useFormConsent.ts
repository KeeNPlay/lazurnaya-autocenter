export function useFormConsent() {
  const consent = ref({
    dataProcessing: false,
    privacyPolicy: false,
  })

  const captchaToken = ref<string | undefined>(undefined)

  const canSubmit = computed((): boolean =>
    consent.value.dataProcessing &&
    consent.value.privacyPolicy &&
    !!captchaToken.value
  )

  return { consent, captchaToken, canSubmit }
}