import argon2 from 'argon2'
import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { db } from '../../utils/db'
import { admins } from '../../database/schema'

const bodySchema = z.object({
    login: z.string().min(1).max(255),
    password: z.string().min(1).max(255)
})

export default defineEventHandler(async (event) => {
    const ip = getRequestIP(event, { xForwardedFor: true }) ?? 'unknown'

    if (!checkRateLimit(`login:${ip}`)) {
        throw createError({
            statusCode: 429,
            statusMessage: 'Слишком много попыток входа. Попробуйте позже.'
        })
    }

    const body = await readValidatedBody(event, bodySchema.parse)

    const [admin] = await db
        .select()
        .from(admins)
        .where(eq(admins.login, body.login))
        .limit(1)
    const invalidCredentialsError = createError({
        statusCode: 401,
        statusMessage: 'Неверный логин или пароль'
    })

    if (!admin) throw invalidCredentialsError

    const isValid = await argon2.verify(admin.passwordHash, body.password)
    if (!isValid) throw invalidCredentialsError

    await setUserSession(event, {
        user: { id: admin.id, login: admin.login }
    })

    return { success: true }
})