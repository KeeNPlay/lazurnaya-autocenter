import { z } from 'zod'
import { phoneSchema } from './phoneSchema'

// For admin-panel and public form
export const inspectionBookingSchema = z.object({
    date: z.string().regex(/^\d{2}\.\d{2}\.\d{4}$/, 'Некорректный формат даты'),
    time: z.string().regex(/^\d{2}:\d{2}:\d{2}$/, 'Некорректный формат времени'),
    nameOrCompany: z.string().trim().min(2, 'Минимум 2 символа').max(255, 'Слишком длинное значение'),
    phone: phoneSchema,
    carBrand: z.string().trim().min(1, 'Укажите марку').max(100),
    plateNumber: z.string().trim().min(1, 'Укажите регистрационный знак').max(20)
})

// Only for public form
export const inspectionFormSchema = inspectionBookingSchema.extend({
    captchaToken: z.string().min(1, 'Капча не пройдена')
})

export type InspectionBookingInput = z.infer<typeof inspectionBookingSchema>
export type InspectionFormInput = z.infer<typeof inspectionFormSchema>