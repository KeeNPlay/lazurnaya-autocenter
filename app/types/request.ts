import { VEHICLE_TYPE_OPTIONS, WASH_TYPE_OPTIONS } from '~/constants/washingForm'

export type RequestStatus = 'active' | 'completed' | 'cancelled'
export type RequestType = 'inspection' | 'washing' | 'transportation'

export type VehicleType = 'car' | 'truck' | 'truck-trailer' | 'bus' | 'special-machinery'
export type WashType = 'water' | 'active-foam' | 'dirt-blaster'

interface RequestCore {
  readonly id: number
  status: RequestStatus
  nameOrCompany: string
  phone: string
  readonly createdAt: string
  readonly updatedAt: string
}

export interface InspectionRequest extends RequestCore {
  readonly type: 'inspection'
  // dd.mm.yyyy UTC+3
  date: string
  // hh:mm UTC+3
  time: string
  carBrand: string
  plateNumber: string
}

export interface WashingRequest extends RequestCore {
  readonly type: 'washing'
  date: string
  time: string
  durationMinutes: number
  vehicleType: VehicleType
  washType: WashType
}

export interface TransportationDimensions {
  length: number | null
  width: number | null
  height: number | null
  weight: number | null
}

export interface TransportationRequest extends RequestCore {
  readonly type: 'transportation'
  fromCity: string
  toCity: string
  departureDate: string
  deliveryTerm: string
  dimensions: TransportationDimensions
  cargoTypes: string[]
  loadingMethods: string[]
  unloadingMethods: string[]
  budgetMin: number | null
  budgetMax: number | null
  comment: string
}

export type SchedulableRequest = InspectionRequest | WashingRequest

export type AdminRequest = SchedulableRequest | TransportationRequest

export interface AdminRequestsResponse {
  items: AdminRequest[]
  counts: Record<RequestStatus, number>
  totalPages: number
  page: number
}

export interface InspectionUpdatePayload {
  date: string
  // hh.mm.ss
  time: string
  nameOrCompany: string
  // 9 number after 375
  phone: string
  carBrand: string
  plateNumber: string
}

export interface WashingUpdatePayload {
  date: string
  time: string
  nameOrCompany: string
  phone: string
  vehicleType: VehicleType
  washType: WashType
}

export type AdminRequestUpdatePayload = InspectionUpdatePayload | WashingUpdatePayload

function buildLabels<T extends string>(
    options: readonly { label: string; value: string }[]
): Readonly<Record<T, string>> {
  return Object.fromEntries(options.map((option) => [option.value, option.label])) as Record<T, string>
}

export const REQUEST_TYPES: readonly RequestType[] = ['inspection', 'washing', 'transportation']

export const REQUEST_TYPE_LABELS: Readonly<Record<RequestType, string>> = {
  inspection: 'Гостехосмотр',
  washing: 'Мойка',
  transportation: 'Грузоперевозки'
}

export const REQUEST_STATUS_LABELS: Readonly<Record<RequestStatus, string>> = {
  active: 'Активна',
  completed: 'Завершена',
  cancelled: 'Отменена'
}

export const VEHICLE_TYPE_LABELS = buildLabels<VehicleType>(VEHICLE_TYPE_OPTIONS)
export const WASH_TYPE_LABELS = buildLabels<WashType>(WASH_TYPE_OPTIONS)

export const ALL_REQUEST_STATUSES: readonly RequestStatus[] = ['active', 'completed', 'cancelled']
export const TRANSPORTATION_REQUEST_STATUSES: readonly RequestStatus[] = ['active', 'completed']

export function isRequestType(value: unknown): value is RequestType {
  return typeof value === 'string' && (REQUEST_TYPES as string[]).includes(value)
}