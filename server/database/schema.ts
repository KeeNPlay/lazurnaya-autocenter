import { pgTable, serial, varchar, timestamp } from 'drizzle-orm/pg-core'

export const admins = pgTable('admins', {
    id: serial('id').primaryKey(),
    login: varchar('login', { length: 255 }).notNull().unique(),
    passwordHash: varchar('password_hash', { length: 255 }).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull()
})