import {
    pgTable, serial, varchar, text, timestamp, date, integer,
    pgEnum, uniqueIndex
} from 'drizzle-orm/pg-core'
import { sql } from 'drizzle-orm'

// enum's

export const requestTypeEnum = pgEnum('request_type', ['inspection', 'washing', 'transportation'])
export const requestStatusEnum = pgEnum('request_status', ['active', 'completed', 'cancelled'])

// If anything is added to the forms, don't forget to update the values in formEnums.ts, `pgEnum` (schema.ts) and `value` (constants/transportationForm.ts, components/Forms/WashingForm.vue).

export const vehicleTypeEnum = pgEnum('vehicle_type', [
    'car', 'truck', 'truck-trailer', 'bus', 'special-machinery'
])
export const washTypeEnum = pgEnum('wash_type', ['water', 'active-foam', 'dirt-blaster'])

export const cargoTypeEnum = pgEnum('cargo_type', [
    'thermal', 'no-thermal', 'fragile', 'liquid', 'refrigerator', 'unknown'
])
export const loadingMethodEnum = pgEnum('loading_method', ['rear', 'side', 'top', 'other'])

// admins table

export const admins = pgTable('admins', {
    id: serial('id').primaryKey(),
    login: varchar('login', { length: 255 }).notNull().unique(),
    passwordHash: varchar('password_hash', { length: 255 }).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull()
})

// requests table

export const requests = pgTable('requests', {
    id: serial('id').primaryKey(),
    type: requestTypeEnum('type').notNull(),
    status: requestStatusEnum('status').notNull().default('active'),
    nameOrCompany: varchar('name_or_company', { length: 255 }).notNull(),
    phone: varchar('phone', { length: 20 }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull()
})

// details: inspection table

export const inspectionDetails = pgTable('inspection_details', {
    requestId: integer('request_id').primaryKey()
        .references(() => requests.id, { onDelete: 'cascade' }),
    scheduledAt: timestamp('scheduled_at', { withTimezone: true }).notNull(),
    status: requestStatusEnum('status').notNull().default('active'),
    carBrand: varchar('car_brand', { length: 100 }).notNull(),
    plateNumber: varchar('plate_number', { length: 20 }).notNull()
}, (table) => ({
    activeSlotUnique: uniqueIndex('inspection_active_slot_unique')
        .on(table.scheduledAt)
        .where(sql`${table.status} = 'active'`)
}))

// details: washing table

export const washingDetails = pgTable('washing_details', {
    requestId: integer('request_id').primaryKey()
        .references(() => requests.id, { onDelete: 'cascade' }),
    scheduledAt: timestamp('scheduled_at', { withTimezone: true }).notNull(),
    durationMinutes: integer('duration_minutes').notNull(),
    status: requestStatusEnum('status').notNull().default('active'),
    vehicleType: vehicleTypeEnum('vehicle_type').notNull(),
    washType: washTypeEnum('wash_type').notNull()
})

// details: transportation table (without slot)

export const transportationDetails = pgTable('transportation_details', {
    requestId: integer('request_id').primaryKey()
        .references(() => requests.id, { onDelete: 'cascade' }),
    fromCity: varchar('from_city', { length: 255 }).notNull(),
    toCity: varchar('to_city', { length: 255 }).notNull(),
    departureDate: date('departure_date').notNull(),
    deliveryTerm: varchar('delivery_term', { length: 100 }),
    lengthCm: integer('length_cm'),
    widthCm: integer('width_cm'),
    heightCm: integer('height_cm'),
    weightKg: integer('weight_kg'),
    cargoTypes: cargoTypeEnum('cargo_types').array().notNull().default([]),
    loadingMethods: loadingMethodEnum('loading_methods').array().notNull().default([]),
    unloadingMethods: loadingMethodEnum('unloading_methods').array().notNull().default([]),
    budgetMin: integer('budget_min'),
    budgetMax: integer('budget_max'),
    comment: text('comment')
})