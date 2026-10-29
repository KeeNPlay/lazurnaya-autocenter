import { eq, and } from 'drizzle-orm'
import type { PgTable } from 'drizzle-orm/pg-core'

export function isSlotTakenError(error: unknown): boolean {
    return (
        typeof error === 'object' &&
        error !== null &&
        'cause' in error &&
        typeof (error as any).cause?.code === 'string' &&
        (error as any).cause.code === '23505' // unique_violation
    )
}