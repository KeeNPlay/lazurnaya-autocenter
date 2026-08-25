export type RequestStatus = 'active' | 'completed' | 'cancelled'
export type RequestType = 'inspection' | 'washing' | 'transportation'

export type WashType = 'complex' | 'express'
export type CarType = 'passenger' | 'truck'

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
  date: string
  time: string
  brand: string
  plateNumber: string
}

export interface WashingRequest extends RequestCore {
  readonly type: 'washing'
  date: string
  time: string
  carType: CarType
  washType: WashType
}

export interface TransportationDimensions {
  length: string
  width: string
  height: string
  weight: string
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
  comment: string
}

export type SchedulableRequest = InspectionRequest | WashingRequest

export type AdminRequest = SchedulableRequest | TransportationRequest

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

export const WASH_TYPE_LABELS: Readonly<Record<WashType, string>> = {
  complex: 'Комплексная мойка',
  express: 'Экспресс-мойка'
}

export const CAR_TYPE_LABELS: Readonly<Record<CarType, string>> = {
  passenger: 'Легковой автомобиль',
  truck: 'Грузовой автомобиль'
}

export const ALL_REQUEST_STATUSES: readonly RequestStatus[] = ['active', 'completed', 'cancelled']
export const TRANSPORTATION_REQUEST_STATUSES: readonly RequestStatus[] = ['active', 'completed']

export function isRequestType(value: unknown): value is RequestType {
  return typeof value === 'string' && (REQUEST_TYPES as string[]).includes(value)
}