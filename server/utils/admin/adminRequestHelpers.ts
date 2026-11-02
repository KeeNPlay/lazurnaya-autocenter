import type { H3Event } from 'h3'

const MINSK_OFFSET_MS = 3 * 60 * 60 * 1000

export function parseRequestId(event: H3Event): number {
    const id = Number(getRouterParam(event, 'id'))

    if (!Number.isInteger(id) || id <= 0) {
        throw createError({ statusCode: 400, statusMessage: 'Некорректный номер заявки' })
    }

    return id
}

export function formatMinskDateTime(date: Date): { date: string; time: string } {
    const shifted = new Date(date.getTime() + MINSK_OFFSET_MS)
    const day = String(shifted.getUTCDate()).padStart(2, '0')
    const month = String(shifted.getUTCMonth() + 1).padStart(2, '0')
    const year = shifted.getUTCFullYear()
    const hours = String(shifted.getUTCHours()).padStart(2, '0')
    const minutes = String(shifted.getUTCMinutes()).padStart(2, '0')

    return { date: `${day}.${month}.${year}`, time: `${hours}:${minutes}` }
}

export function isoDateToDdMmYyyy(isoDate: string): string {
    const [year, month, day] = isoDate.split('-')
    return `${day}.${month}.${year}`
}