import { z } from 'zod'
import { VEHICLE_TYPES, WASH_TYPES } from '../formEnums'
import { phoneSchema } from './phoneSchema'

const dateField = z.string().regex(/^\d{2}\.\d{2}\.\d{4}$/, 'Некорректный формат даты')
const timeField = z.string().regex(/^\d{2}:\d{2}:\d{2}$/, 'Некорректный формат времени')
const nameField = z.string().trim().min(2, 'Минимум 2 символа').max(255, 'Слишком длинное значение')

export const adminInspectionUpdateSchema = z.object({
    date: dateField,
    time: timeField,
    nameOrCompany: nameField,
    phone: phoneSchema,
    carBrand: z.string().trim().min(1, 'Укажите марку').max(100, 'Слишком длинное значение'),
    plateNumber: z.string().trim().min(1, 'Укажите регистрационный знак').max(20, 'Слишком длинное значение')
})

export const adminWashingUpdateSchema = z.object({
    date: dateField,
    time: timeField,
    nameOrCompany: nameField,
    phone: phoneSchema,
    vehicleType: z.enum(VEHICLE_TYPES),
    washType: z.enum(WASH_TYPES)
}).superRefine((data, ctx) => {
    if (!getWashingDurationMinutes(data.washType, data.vehicleType)) {
        ctx.addIssue({
            code: 'custom',
            path: ['washType'],
            message: 'Этот тип мойки недоступен для выбранного транспорта'
        })
    }
})