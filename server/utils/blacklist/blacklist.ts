import { createError, isError } from 'h3'
import { and, eq, gt, lte } from 'drizzle-orm'
import { db } from '../db'
import { blacklist } from '../../database/schema'
import type { BlacklistEntry } from '../../../shared/utils/blacklist'

export const BLACKLIST_BLOCKED_MESSAGE =
    'Ваш номер телефона заблокирован в нашей системе. Если вы считаете, что это произошло ошибочно, пожалуйста, свяжитесь с менеджером'

const MINSK_OFFSET_MS = 3 * 60 * 60 * 1000

// Accepts 9 digits or `375` + 9 digits (with any formatting), and returns `375xxxxxxxxx`
export function normalizeBlacklistPhone(raw: unknown): string | null {
    if (typeof raw !== 'string' && typeof raw !== 'number') return null

    const digits = String(raw).replace(/\D/g, '')

    if (digits.length === 9) return `375${digits}`
    if (digits.length === 12 && digits.startsWith('375')) return digits

    return null
}

// Block duration: exactly one year from the moment of addition
export function getBlacklistExpiresAt(from: Date = new Date()): Date {
    const expiresAt = new Date(from)
    expiresAt.setUTCFullYear(expiresAt.getUTCFullYear() + 1)
    return expiresAt
}

export async function isPhoneBlacklisted(phone: string): Promise<boolean> {
    const rows = await db
        .select({ id: blacklist.id })
        .from(blacklist)
        .where(and(eq(blacklist.phone, phone), gt(blacklist.expiresAt, new Date())))
        .limit(1)

    return rows.length > 0
}

// Deleting expired records
export async function purgeExpiredBlacklist(): Promise<void> {
    await db.delete(blacklist).where(lte(blacklist.expiresAt, new Date()))
}

export function formatBlacklistDateTime(date: Date): string {
    const shifted = new Date(date.getTime() + MINSK_OFFSET_MS)
    const pad = (value: number): string => String(value).padStart(2, '0')

    return `${pad(shifted.getUTCDate())}.${pad(shifted.getUTCMonth() + 1)}.${shifted.getUTCFullYear()} ` +
        `${pad(shifted.getUTCHours())}:${pad(shifted.getUTCMinutes())}`
}

export function toBlacklistEntry(row: typeof blacklist.$inferSelect): BlacklistEntry {
    return {
        id: row.id,
        phone: row.phone,
        reason: row.reason,
        addedAt: formatBlacklistDateTime(row.createdAt)
    }
}

// Passes through existing HTTP errors; converts any others into a 500 error (with a Russian-language message)
export function throwBlacklistError(error: unknown, message: string): never {
    if (isError(error)) throw error

    console.error('[blacklist]', error)
    throw createError({ statusCode: 500, statusMessage: message })
}