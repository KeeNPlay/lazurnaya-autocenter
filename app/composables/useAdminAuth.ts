import type { AdminCredentials } from '~/types/admin'

/**
 * ВРЕМЕННАЯ реализация до подключения бэкенда.
 *
 * Сейчас cookie полностью управляется и читается на клиенте — это
 * НЕ является защитой, а лишь имитирует состояние "авторизован" для
 * вёрстки UI-потока (показ ссылки в хедере, редиректы между страницами).
 *
 * TODO(backend): когда появится сервер —
 * 1. Заменить функцию login() на реальный $fetch('/api/admin/login', ...)
 * 2. Сервер должен устанавливать httpOnly cookie самостоятельно
 *    (через setResponseHeader/setCookie на сервере, а не через useCookie на клиенте)
 * 3. Добавить server/middleware, проверяющий эту сессию на КАЖДОМ
 *    запросе к /api/admin/** — именно это и есть реальный барьер безопасности,
 *    а не то, что реализовано здесь.
 */
export function useAdminAuth() {
  const token = useCookie<string | null>('admin_session', {
    default: () => null,
    maxAge: 60 * 60 * 8, // 8 часов
    sameSite: 'strict'
  })

  const isAuthenticated = computed<boolean>(() => Boolean(token.value))

  async function login(credentials: AdminCredentials): Promise<boolean> {
    // ЗАГЛУШКА: временная проверка на клиенте.
    // Как только появится бэкенд — эта функция превратится в:
    //
    // const response = await $fetch('/api/admin/login', {
    //   method: 'POST',
    //   body: credentials
    // })
    //
    // и сервер сам выставит httpOnly cookie в ответе.

    const config = useRuntimeConfig()
    const isValid =
      credentials.login === String(config.public.tempAdminLogin) &&
      credentials.password === String(config.public.tempAdminPassword)

    if (!isValid) return false

    token.value = crypto.randomUUID()
    return true
  }

  function logout(): void {
    token.value = null
  }

  return { isAuthenticated, login, logout }
}