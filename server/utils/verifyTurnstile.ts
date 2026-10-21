export async function verifyTurnstileToken(token: string, ip?: string): Promise<boolean> {
  const { turnstileSecretKey } = useRuntimeConfig()

  const response = await $fetch<{ success: boolean }>(
    'https://challenges.cloudflare.com/turnstile/v0/siteverify',
    {
      method: 'POST',
      body: { secret: turnstileSecretKey, response: token, remoteip: ip },
    }
  )

  return response.success
}