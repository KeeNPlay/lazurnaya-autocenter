import { z } from 'zod'
import { VEHICLE_TYPES, WASH_TYPES } from '../formEnums'
import { phoneSchema } from './phoneSchema'

const washingFieldsSchema = z.object({
    date: z.string().regex(/^\d{2}\.\d{2}\.\d{4}$/, 'Некорректный формат даты'),
    time: z.string().regex(/^\d{2}:\d{2}:\d{2}$/, 'Некорректный формат времени'),
    nameOrCompany: z.string().trim().min(2).max(255),
    phone: phoneSchema,
    vehicleType: z.enum(VEHICLE_TYPES),
    washType: z.enum(WASH_TYPES)
})

const isCombinationAllowed = (data: z.infer<typeof washingFieldsSchema>): boolean =>
    !!getWashingDurationMinutes(data.washType, data.vehicleType)

const combinationIssue = {
    path: ['washType'],
    message: 'Этот тип мойки недоступен для выбранного транспорта'
}

// For admin-panel
export const washingBookingSchema = washingFieldsSchema.refine(isCombinationAllowed, combinationIssue)

// For public form
export const washingFormSchema = washingFieldsSchema
    .extend({ captchaToken: z.string().min(1, 'Капча не пройдена') })
    .refine(isCombinationAllowed, combinationIssue)

export type WashingBookingInput = z.infer<typeof washingBookingSchema>
export type WashingFormInput = z.infer<typeof washingFormSchema>