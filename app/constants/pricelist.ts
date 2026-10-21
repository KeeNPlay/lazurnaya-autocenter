export type Season = 'winter' | 'summer'

export interface SeasonalPricelist {
  readonly winter: string
  readonly summer: string
}

export const WASHING_PRICELIST: SeasonalPricelist = {
  winter: '/docs/winter_washing_pricelist.pdf',
  summer: '/docs/washing_pricelist.pdf'
} as const

export const WINTER_MONTHS: ReadonlySet<number> = new Set([11, 0, 1])