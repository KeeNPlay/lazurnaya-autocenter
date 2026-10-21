export default defineNuxtPlugin(() => {
  const { startLoading, stopLoading, markMounted } = usePageLoader()
  const router = useRouter()

  const MIN_DISPLAY_MS = 400
  let hideTimeout: ReturnType<typeof setTimeout> | null = null

  router.beforeEach((to, from) => {
    if (to.path === from.path) return

    if (hideTimeout) {
      clearTimeout(hideTimeout)
      hideTimeout = null
    }

    startLoading()
  })

  router.afterEach((to, from) => {
    if (to.path === from.path) return

    hideTimeout = setTimeout(() => {
      stopLoading()
    }, MIN_DISPLAY_MS)
  })
  
  onNuxtReady(() => {
    stopLoading()
    markMounted()
  })
})