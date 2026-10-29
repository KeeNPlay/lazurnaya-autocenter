const DATE_RE = /^(\d{2})\.(\d{2})\.(\d{4})$/
const TIME_RE = /^(\d{2}):(\d{2}):(\d{2})$/

// UTC+3 (Europe/Minsk)
const MINSK_OFFSET = '+03:00'

export function parseScheduledAt(dateStr: string, timeStr: string): Date {
    const dateMatch = DATE_RE.exec(dateStr)
    const timeMatch = TIME_RE.exec(timeStr)

    if (!dateMatch || !timeMatch) {
        throw createError({ statusCode: 400, statusMessage: 'Некорректный формат даты или времени' })
    }

    const [, day, month, year] = dateMatch
    const [, hours, minutes, seconds] = timeMatch

    const iso = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}${MINSK_OFFSET}`
    const date = new Date(iso)

    if (Number.isNaN(date.getTime())) {
        throw createError({ statusCode: 400, statusMessage: 'Некорректная дата или время' })
    }

    return date
}

export function parseSimpleDate(dateStr: string): string {
    const dateMatch = DATE_RE.exec(dateStr)
    if (!dateMatch) {
        throw createError({ statusCode: 400, statusMessage: 'Некорректный формат даты' })
    }
    const [, day, month, year] = dateMatch
    return `${year}-${month}-${day}` // Postgres 'date' format
}