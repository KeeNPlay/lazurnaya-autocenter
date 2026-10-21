import { ADMIN_LOGIN_PATH } from '~/constants/adminNav'

export default defineNuxtRouteMiddleware((to) => {
  if (!to.path.startsWith('/admin')) return
  if (to.path === ADMIN_LOGIN_PATH) return

  const { isAuthenticated } = useAdminAuth()

  if (!isAuthenticated.value) {
    return navigateTo(ADMIN_LOGIN_PATH)
  }
})