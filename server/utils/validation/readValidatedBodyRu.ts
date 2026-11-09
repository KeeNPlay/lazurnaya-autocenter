import type { ZodType } from 'zod'
import type { H3Event } from 'h3'

const GENERIC_VALIDATION_MESSAGE = 'Проверьте правильность заполнения формы'
const INVALID_BODY_MESSAGE = 'Некорректный формат отправленных данных'

function isCustomRuMessage(message: string | undefined): message is string {
    return !!message && /[а-яё]/i.test(message)
}

export async function readValidatedBodyRu<T extends ZodType>(
    event: H3Event,
    schema: T
): Promise<ReturnType<T['parse']>> {
    let body: unknown

    try {
        body = await readBody(event)
    } catch {
        throw createError({ statusCode: 400, statusMessage: INVALID_BODY_MESSAGE })
    }

    const result = schema.safeParse(body)

    if (!result.success) {
        const message = result.error.issues[0]?.message
        throw createError({
            statusCode: 400,
            statusMessage: isCustomRuMessage(message) ? message : GENERIC_VALIDATION_MESSAGE
        })
    }

    return result.data as ReturnType<T['parse']>
}