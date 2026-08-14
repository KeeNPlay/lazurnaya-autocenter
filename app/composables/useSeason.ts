import { WINTER_MONTHS, type Season } from '~/constants/pricelist'

export function getCurrentSeason(date: Date = new Date()): Season {
  const monthIndex: number = date.getMonth()
  return WINTER_MONTHS.has(monthIndex) ? 'winter' : 'summer'
}

export function useSeason(): Season {
  return getCurrentSeason()
}