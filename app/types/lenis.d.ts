import type Lenis from 'lenis'

declare module '#app' {
  interface NuxtApp {
    $lenis: Lenis | null
  }
}

export {}