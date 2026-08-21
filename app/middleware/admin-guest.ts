import { ADMIN_HOME_PATH } from '~/constants/adminNav'

export default defineNuxtRouteMiddleware(() => {
  const { isAuthenticated } = useAdminAuth()

  if (isAuthenticated.value) {
    return navigateTo(ADMIN_HOME_PATH)
  }
})