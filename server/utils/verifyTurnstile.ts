interface TurnstileVerifyResponse {
    success: boolean
    'error-codes'?: string[]
}

export async function verifyTurnstile(token: string | undefined, event: any): Promise<void> {
    if (!token) {
        throw createError({ statusCode: 400, statusMessage: 'Отсутствует токен капчи' })
    }

    const config = useRuntimeConfig()
    const ip = getRequestIP(event, { xForwardedFor: true })

    const result = await $fetch<TurnstileVerifyResponse>(
        'https://challenges.cloudflare.com/turnstile/v0/siteverify',
        {
            method: 'POST',
            body: new URLSearchParams({
                secret: config.turnstile.secretKey,
                response: token,
                ...(ip ? { remoteip: ip } : {})
            })
        }
    )

    if (!result.success) {
        throw createError({ statusCode: 400, statusMessage: 'Проверка капчи не пройдена, попробуйте ещё раз' })
    }
}