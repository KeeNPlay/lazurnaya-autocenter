export function getServerErrorMessage(error: unknown, fallback: string): string {
    if (typeof error === 'object' && error !== null) {
        const err = error as { data?: { statusMessage?: string }; statusMessage?: string }
        return err.data?.statusMessage ?? err.statusMessage ?? fallback
    }
    return fallback
}