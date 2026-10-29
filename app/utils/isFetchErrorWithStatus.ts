export function isFetchErrorWithStatus(error: unknown, status: number): boolean {
    if (typeof error !== 'object' || error === null) return false

    const err = error as { statusCode?: number; response?: { status?: number } }
    return err.statusCode === status || err.response?.status === status
}