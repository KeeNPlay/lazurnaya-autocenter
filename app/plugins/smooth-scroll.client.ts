import Lenis from 'lenis'
import {
  LENIS_DURATION,
  LENIS_WHEEL_MULTIPLIER,
  LENIS_TOUCH_MULTIPLIER,
  lenisEasing
} from '~/constants/scroll'

export default defineNuxtPlugin((nuxtApp) => {
  const isDesktop = useIsFinePointer()
  const reducedMotion = usePrefersReducedMotion()

  if (!isDesktop || reducedMotion) {
    nuxtApp.provide('lenis', null)
    return
  }

  const lenis = new Lenis({
    duration: LENIS_DURATION,
    easing: lenisEasing,
    smoothWheel: true,
    wheelMultiplier: LENIS_WHEEL_MULTIPLIER,
    touchMultiplier: LENIS_TOUCH_MULTIPLIER,
    autoRaf: true
  })

  const handleAnchorClick = (event: MouseEvent): void => {
    const anchor = (event.target as HTMLElement).closest('a[href^="#"]')
    if (!anchor) return

    const href = anchor.getAttribute('href')
    if (!href || href === '#') return

    const targetEl = document.querySelector(href)
    if (!targetEl) return

    event.preventDefault()
    lenis.scrollTo(targetEl as HTMLElement, { offset: 0 })
  }

  document.addEventListener('click', handleAnchorClick)

  nuxtApp.hook('page:finish', () => {
    lenis.resize()
    lenis.scrollTo(0, { immediate: true })
  })

  window.addEventListener('beforeunload', () => {
    lenis.destroy()
    document.removeEventListener('click', handleAnchorClick)
  })

  nuxtApp.provide('lenis', lenis)
})