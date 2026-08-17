export type LoaderVariant = 'fullscreen' | 'page'

export function usePageLoader() {
  const isLoading = useState<boolean>('page-loading', () => true)
  const hasMountedOnce = useState<boolean>('page-loader-mounted-once', () => false)

  const startLoading = (): void => {
    isLoading.value = true
  }

  const stopLoading = (): void => {
    isLoading.value = false
  }

  const markMounted = (): void => {
    hasMountedOnce.value = true
  }

  const loaderVariant = computed<LoaderVariant>(() =>
    hasMountedOnce.value ? 'page' : 'fullscreen'
  )

  return { isLoading, hasMountedOnce, loaderVariant, startLoading, stopLoading, markMounted }
}