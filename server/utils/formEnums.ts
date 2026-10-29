// If anything is added to the forms, don't forget to update the values in formEnums.ts, `pgEnum` (schema.ts) and `value` (constants/transportationForm.ts, components/Forms/WashingForm.vue).

export const VEHICLE_TYPES = ['car', 'truck', 'truck-trailer', 'bus', 'special-machinery'] as const
export const WASH_TYPES = ['water', 'active-foam', 'dirt-blaster'] as const

export const CARGO_TYPES = ['thermal', 'no-thermal', 'fragile', 'liquid', 'refrigerator', 'unknown'] as const
export const LOADING_METHODS = ['rear', 'side', 'top', 'other'] as const