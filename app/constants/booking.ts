export type BookingTab = 'inspection' | 'washing'

export const BOOKING_TABS: readonly { label: string; value: BookingTab }[] = [
  { label: 'Гостехосмотр', value: 'inspection' },
  { label: 'Мойка', value: 'washing' }
] as const

export const DEFAULT_BOOKING_TAB: BookingTab = 'inspection'