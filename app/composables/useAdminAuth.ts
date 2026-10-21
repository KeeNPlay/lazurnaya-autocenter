import type { AdminCredentials } from '~/types/admin'

export function useAdminAuth() {
  const { loggedIn, user, fetch: refreshSession, clear } = useUserSession()

  const isAuthenticated = computed<boolean>(() => loggedIn.value)

  async function login(credentials: AdminCredentials): Promise<boolean> {
    try {
      await $fetch('/api/admin/login', {
        method: 'POST',
        body: credentials
      })
      await refreshSession()
      return true
    } catch {
      return false
    }
  }

  async function logout(): Promise<void> {
    await $fetch('/api/admin/logout', { method: 'POST' })
    await clear()
  }

  return { isAuthenticated, user, login, logout }
}