import type {
  AdminRequest,
  CarType,
  InspectionRequest,
  RequestStatus,
  RequestType,
  TransportationRequest,
  WashType,
  WashingRequest
} from '~/types/request'
import { ALL_REQUEST_STATUSES, TRANSPORTATION_REQUEST_STATUSES } from '~/types/request'
import { CARGO_TYPE_OPTIONS, LOADING_METHOD_OPTIONS } from '~/constants/transportationForm'
import { createSeededRandom, seedFromString } from '~/utils/seededRandom'

const CAR_TYPES: readonly CarType[] = ['passenger', 'truck']
const WASH_TYPES: readonly WashType[] = ['complex', 'express']
const BRANDS: readonly string[] = ['MAN', 'SCANIA', 'МАЗ']
const CITIES: readonly string[] = [
  'Гомель, Республика Беларусь',
  'Минск, Республика Беларусь',
  'Пекин, Китай',
  'Москва, Россия',
  'Варшава, Польша'
]

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

function pickMultiple<T>(items: readonly T[], random: () => number, count: number): T[] {
  const pool = [...items]
  const result: T[] = []
  const take = Math.min(count, pool.length)

  for (let i = 0; i < take; i++) {
    const index = Math.floor(random() * pool.length)
    result.push(pool[index] as T)
    pool.splice(index, 1)
  }

  return result
}

function buildDate(random: () => number): string {
  const day = String(Math.floor(random() * 28) + 1).padStart(2, '0')
  const month = String(Math.floor(random() * 12) + 1).padStart(2, '0')
  return `${day}.${month}.2026`
}

function buildTime(random: () => number): string {
  const hour = String(Math.floor(random() * 9) + 8).padStart(2, '0')
  return `${hour}:00`
}

interface CoreFields {
  id: number
  status: RequestStatus
  nameOrCompany: string
  phone: string
  createdAt: string
  updatedAt: string
}

function buildCore(index: number, random: () => number, statuses: readonly RequestStatus[]): CoreFields {
  return {
    id: index + 1,
    status: pick(statuses, random),
    nameOrCompany: pick(NAMES, random),
    phone: '+375 (29) 123-45-67',
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
    if (type === 'inspection') {
      const request: InspectionRequest = {
        ...buildCore(index, random, ALL_REQUEST_STATUSES),
        type: 'inspection',
        date: buildDate(random),
        time: buildTime(random),
        brand: pick(BRANDS, random),
        plateNumber: '7777 АА-7'
      }
      return request
    }

    if (type === 'washing') {
      const request: WashingRequest = {
        ...buildCore(index, random, ALL_REQUEST_STATUSES),
        type: 'washing',
        date: buildDate(random),
        time: buildTime(random),
        carType: pick(CAR_TYPES, random),
        washType: pick(WASH_TYPES, random)
      }
      return request
    }

    const request: TransportationRequest = {
      ...buildCore(index, random, TRANSPORTATION_REQUEST_STATUSES),
      type: 'transportation',
      fromCity: pick(CITIES, random),
      toCity: pick(CITIES, random),
      departureDate: buildDate(random),
      deliveryTerm: `${Math.floor(random() * 20) + 1} дней`,
      dimensions: {
        length: String(Math.floor(random() * 1000) + 100),
        width: String(Math.floor(random() * 300) + 100),
        height: String(Math.floor(random() * 300) + 100),
        weight: String(Math.floor(random() * 20000) + 500)
      },
      cargoTypes: pickMultiple(CARGO_TYPE_OPTIONS, random, 2).map((option) => option.value),
      loadingMethods: pickMultiple(LOADING_METHOD_OPTIONS, random, 1).map((option) => option.value),
      unloadingMethods: pickMultiple(LOADING_METHOD_OPTIONS, random, 1).map((option) => option.value),
      comment: 'Забрать груз на сортировочном центре и доставить на адрес разгрузки.'
    }
    return request
  })
}