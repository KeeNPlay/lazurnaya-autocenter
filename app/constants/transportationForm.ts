export interface SelectOption {
  label: string
  value: string
}

export const CARGO_TYPE_OPTIONS: SelectOption[] = [
  { label: 'Тепловой режим', value: 'thermal' },
  { label: 'Без теплового режима', value: 'no-thermal' },
  { label: 'Хрупкий груз', value: 'fragile' },
  { label: 'Жидкий груз', value: 'liquid' },
  { label: 'Рефрижератор', value: 'refrigerator' },
  { label: 'Неизвестно', value: 'unknown' }
]

export const LOADING_METHOD_OPTIONS: SelectOption[] = [
  { label: 'Задняя', value: 'rear' },
  { label: 'Боковая', value: 'side' },
  { label: 'Верхняя', value: 'top' },
  { label: 'Иной способ', value: 'other' }
]

export const BUDGET_RANGE = {
  min: 0,
  max: 10000,
  step: 100,
  default: [1000, 5000] as [number, number]
} as const

export interface TransportationDimensions {
  length: string
  width: string
  height: string
  weight: string
}

export interface TransportationForm {
  fromCity: string
  toCity: string
  departureDate: string
  deliveryTerm: string
  nameOrCompany: string
  phone: string
  dimensions: TransportationDimensions
  cargoTypes: string[]
  loadingMethods: string[]
  unloadingMethods: string[]
  comment: string
}

export const createEmptyTransportationForm = (): TransportationForm => ({
  fromCity: '',
  toCity: '',
  departureDate: '',
  deliveryTerm: '',
  nameOrCompany: '',
  phone: '',
  dimensions: { length: '', width: '', height: '', weight: '' },
  cargoTypes: [],
  loadingMethods: [],
  unloadingMethods: [],
  comment: ''
})

export function getOptionLabels(values: readonly string[], options: readonly SelectOption[]): string {
  if (values.length === 0) return '—'

  return values
    .map((value) => options.find((option) => option.value === value)?.label ?? value)
    .join(', ')
}