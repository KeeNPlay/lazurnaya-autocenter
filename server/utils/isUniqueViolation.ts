export function isUniqueViolation(error: unknown): boolean {
    const cause = (error as { cause?: { code?: string } })?.cause
    return cause?.code === '23505' // error code PostgreSQL: unique_violation
}