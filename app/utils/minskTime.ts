const MINSK_OFFSET_MS = 3 * 60 * 60 * 1000

export function toMinskParts(isoUtc: string): { date: string; time: string } {
    const shifted = new Date(new Date(isoUtc).getTime() + MINSK_OFFSET_MS)

    const year = shifted.getUTCFullYear()
    const month = String(shifted.getUTCMonth() + 1).padStart(2, '0')
    const day = String(shifted.getUTCDate()).padStart(2, '0')
    const hours = String(shifted.getUTCHours()).padStart(2, '0')
    const minutes = String(shifted.getUTCMinutes()).padStart(2, '0')
    const seconds = String(shifted.getUTCSeconds()).padStart(2, '0')

    return {
        date: `${year}-${month}-${day}`,
        time: `${hours}:${minutes}:${seconds}`
    }
}

export function ddmmyyyyToIsoKey(dateStr: string): string {
    const [day, month, year] = dateStr.split('.')
    return `${year}-${month}-${day}`
}

export function isoKeyToDdMmYyyy(isoKey: string): string {
    const [year, month, day] = isoKey.split('-')
    return `${day}.${month}.${year}`
}

export function dateToIsoKey(date: Date): string {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
}

export function getMinskNowParts(): { date: string; time: string } {
    return toMinskParts(new Date().toISOString())
}

export function isPastMinskTime(isoDateKey: string, timeHHmm: string): boolean {
    const now = getMinskNowParts()
    if (isoDateKey !== now.date) {
        return isoDateKey < now.date
    }
    const slotMinutes = timeStrToMinutes(timeHHmm)
    const nowMinutes = timeStrToMinutes(now.time)
    return slotMinutes < nowMinutes
}