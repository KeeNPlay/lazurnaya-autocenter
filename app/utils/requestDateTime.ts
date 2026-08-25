import type { AdminRequest } from '~/types/request'

export function parseRequestDateTime(date: string, time: string): number {
  const dateParts = date.split('.').map(Number)
  const timeParts = time.split(':').map(Number)

  if (dateParts.length !== 3 || timeParts.length !== 2) {
    throw new Error(`Некорректный формат даты/времени: "${date}" "${time}"`)
  }

  const [day, month, year] = dateParts
  const [hours, minutes] = timeParts

  if (
    day === undefined ||
    month === undefined ||
    year === undefined ||
    hours === undefined ||
    minutes === undefined
  ) {
    throw new Error(`Некорректный формат даты/времени: "${date}" "${time}"`)
  }

  return new Date(year, month - 1, day, hours, minutes).getTime()
}

export function getRequestTimestamp(request: AdminRequest): number {
  if (request.type === 'transportation') {
    return parseRequestDateTime(request.departureDate, '00:00')
  }
  return parseRequestDateTime(request.date, request.time)
}