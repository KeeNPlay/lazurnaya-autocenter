export type RequestStatus = 'active' | 'completed' | 'cancelled'
export type RequestType = 'inspection' | 'washing'

export type WashType = 'complex' | 'express'
export type CarType = 'passenger' | 'truck'

interface BaseRequest {
  readonly id: number
  status: RequestStatus
  nameOrCompany: string
  phone: string
  date: string
  time: string
  readonly createdAt: string
  readonly updatedAt: string
}

export interface InspectionRequest extends BaseRequest {
  readonly type: 'inspection'
  brand: string
  plateNumber: string
}

export interface WashingRequest extends BaseRequest {
  readonly type: 'washing'
  carType: CarType
  washType: WashType
}

export type AdminRequest = InspectionRequest | WashingRequest

export const REQUEST_TYPES: readonly RequestType[] = ['inspection', 'washing']

export const REQUEST_TYPE_LABELS: Readonly<Record<RequestType, string>> = {
  inspection: 'Гостехосмотр',
  washing: 'Мойка'
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

export function isRequestType(value: unknown): value is RequestType {
  return typeof value === 'string' && (REQUEST_TYPES as string[]).includes(value)
}