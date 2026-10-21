export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  if (!body.captchaToken) {
    throw createError({ statusCode: 400, message: 'Captcha token missing' })
  }

  const isValid = await verifyTurnstileToken(body.captchaToken, getRequestIP(event))
  if (!isValid) {
    throw createError({ statusCode: 403, message: 'Captcha verification failed' })
  }
  
  return { success: true }
})