import type {
  AdminRequest,
  CarType,
  InspectionRequest,
  RequestStatus,
  RequestType,
  WashType,
  WashingRequest
} from '~/types/request'
import { createSeededRandom, seedFromString } from '~/utils/seededRandom'

const STATUSES: readonly RequestStatus[] = ['active', 'completed', 'cancelled']
const CAR_TYPES: readonly CarType[] = ['passenger', 'truck']
const WASH_TYPES: readonly WashType[] = ['complex', 'express']
const BRANDS: readonly string[] = ['MAN', 'SCANIA', 'МАЗ']

const NAMES: readonly string[] = [
  'Иван Петров',
  'ООО "Межтранс"',
  'Сергей Иванов',
  'ЧУП "Логистика+"',
  'Андрей Сидоров'
]

function pick<T>(items: readonly T[], random: () => number): T {
  const index = Math.floor(random() * items.length)
  return items[index] as T
}

function buildDate(random: () => number): string {
  const day = String(Math.floor(random() * 28) + 1).padStart(2, '0')
  const month = String(Math.floor(random() * 12) + 1).padStart(2, '0')
  return `${day}.${month}.2027`
}

function buildTime(random: () => number): string {
  const hour = String(Math.floor(random() * 9) + 8).padStart(2, '0')
  return `${hour}:00`
}

interface BaseFields {
  id: number
  status: RequestStatus
  nameOrCompany: string
  phone: string
  date: string
  time: string
  createdAt: string
  updatedAt: string
}

function buildBase(index: number, random: () => number): BaseFields {
  return {
    id: index + 1,
    status: pick(STATUSES, random),
    nameOrCompany: pick(NAMES, random),
    phone: '+375 (29) 123-45-67',
    date: buildDate(random),
    time: buildTime(random),
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z'
  }
}

/**
 * TODO(backend): заменить вызов в useAdminRequests
 * на useFetch('/api/admin/requests', { query: { type } })
 */
export function createMockRequests(type: RequestType, count = 47): AdminRequest[] {
  const random = createSeededRandom(seedFromString(type))

  return Array.from({ length: count }, (_, index): AdminRequest => {
    const base = buildBase(index, random)

    if (type === 'inspection') {
      const request: InspectionRequest = {
        ...base,
        type: 'inspection',
        brand: pick(BRANDS, random),
        plateNumber: '7777 АА-7'
      }
      return request
    }

    const request: WashingRequest = {
      ...base,
      type: 'washing',
      carType: pick(CAR_TYPES, random),
      washType: pick(WASH_TYPES, random)
    }
    return request
  })
}