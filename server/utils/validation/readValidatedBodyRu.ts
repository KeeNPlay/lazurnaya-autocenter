import { ZodError, type ZodType } from 'zod'
import type { H3Event } from 'h3'

const GENERIC_VALIDATION_MESSAGE = 'Проверьте правильность заполнения формы'

function isCustomRuMessage(message: string | undefined): message is string {
    return !!message && /[а-яё]/i.test(message)
}

export async function readValidatedBodyRu<T extends ZodType>(
    event: H3Event,
    schema: T
): Promise<ReturnType<T['parse']>> {
    try {
        return await readValidatedBody(event, schema.parse)
    } catch (error) {
        if (error instanceof ZodError) {
            const message = error.issues[0]?.message
            throw createError({
                statusCode: 400,
                statusMessage: isCustomRuMessage(message) ? message : GENERIC_VALIDATION_MESSAGE
            })
        }
        throw error
    }
}