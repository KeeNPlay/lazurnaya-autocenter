import { z } from 'zod'
import { VEHICLE_TYPES, WASH_TYPES } from '../formEnums'
import { phoneSchema } from './phoneSchema'

export const washingFormSchema = z.object({
    date: z.string().regex(/^\d{2}\.\d{2}\.\d{4}$/, 'Некорректный формат даты'),
    time: z.string().regex(/^\d{2}:\d{2}:\d{2}$/, 'Некорректный формат времени'),
    nameOrCompany: z.string().trim().min(2).max(255),
    phone: phoneSchema,
    vehicleType: z.enum(VEHICLE_TYPES),
    washType: z.enum(WASH_TYPES),
    captchaToken: z.string().min(1, 'Капча не пройдена')
}).superRefine((data, ctx) => {
    if (!getWashingDurationMinutes(data.washType, data.vehicleType)) {
        ctx.addIssue({
            code: 'custom',
            path: ['washType'],
            message: 'Этот тип мойки недоступен для выбранного транспорта'
        })
    }
})

export type WashingFormInput = z.infer<typeof washingFormSchema>