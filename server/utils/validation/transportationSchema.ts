import { z } from 'zod'
import { CARGO_TYPES, LOADING_METHODS } from '../formEnums'
import {phoneSchema} from "./phoneSchema";

const optionalNumeric = z
    .union([z.string(), z.number()])
    .optional()
    .transform((val) => {
        if (val === undefined || val === '') return undefined
        const num = Number(val)
        return Number.isFinite(num) ? Math.round(num) : undefined
    })
    .pipe(z.number().int().min(0).optional())

export const transportationFormSchema = z.object({
    fromCity: z.string().trim().min(2, 'Укажите город отправления').max(255),
    toCity: z.string().trim().min(2, 'Укажите город доставки').max(255),
    departureDate: z.string().regex(/^\d{2}\.\d{2}\.\d{4}$/, 'Некорректный формат даты'),
    deliveryTerm: z.string().trim().max(100).optional().or(z.literal('')),
    nameOrCompany: z.string().trim().min(2, 'Минимум 2 символа').max(255, 'Слишком длинное значение'),
    phone: phoneSchema,
    dimensions: z.object({
        length: optionalNumeric,
        width: optionalNumeric,
        height: optionalNumeric,
        weight: optionalNumeric
    }),
    cargoTypes: z.array(z.enum(CARGO_TYPES)).default([]),
    loadingMethods: z.array(z.enum(LOADING_METHODS)).default([]),
    unloadingMethods: z.array(z.enum(LOADING_METHODS)).default([]),
    budget: z.tuple([z.number().min(0), z.number().min(0)]),
    comment: z.string().trim().max(1000).optional().or(z.literal('')),
    captchaToken: z.string().min(1, 'Капча не пройдена')
})

export type TransportationFormInput = z.infer<typeof transportationFormSchema>