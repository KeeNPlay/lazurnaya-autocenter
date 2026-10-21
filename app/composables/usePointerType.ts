import { LENIS_MIN_POINTER_WIDTH, REDUCED_MOTION_QUERY } from '~/constants/scroll'

export function useIsFinePointer(): boolean {
  if (!import.meta.client) return false
  return window.matchMedia(LENIS_MIN_POINTER_WIDTH).matches
}

export function usePrefersReducedMotion(): boolean {
  if (!import.meta.client) return false
  return window.matchMedia(REDUCED_MOTION_QUERY).matches
}