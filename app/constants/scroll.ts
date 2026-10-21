export const LENIS_DURATION = 1.2 as const
export const LENIS_WHEEL_MULTIPLIER = 1 as const
export const LENIS_TOUCH_MULTIPLIER = 2 as const
export const LENIS_MIN_POINTER_WIDTH = '(pointer: fine)' as const
export const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)' as const

export const lenisEasing = (t: number): number =>
  Math.min(1, 1.001 - Math.pow(2, -10 * t))