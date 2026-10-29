import { z } from 'zod'

export const phoneSchema = z
    .string()
    .trim()
    .regex(/^\d{9}$/, 'Некорректный номер телефона')
    .transform((val) => `375${val}`)