import type Lenis from 'lenis'

export function useLenis(): Lenis | null {
  const { $lenis } = useNuxtApp()
  return $lenis ?? null
}