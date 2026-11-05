export const BLACKLIST_REASON_MAX_LENGTH = 500 as const
export const BLACKLIST_PAGE_SIZE = 10 as const

export interface BlacklistEntry {
    id: number
    // 375xxxxxxxxx
    phone: string
    reason: string | null
    // dd.mm.yyyy (UTC+3)
    addedAt: string
}

export interface BlacklistResponse {
    items: BlacklistEntry[]
    total: number
    page: number
    totalPages: number
}

export interface BlacklistCreatePayload {
    phone: string
    reason: string
}