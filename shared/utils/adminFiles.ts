export const ADMIN_FILE_KEYS = [
    'inspection_pricelist',
    'washing_pricelist',
    'winter_washing_pricelist',
    'cmr',
    'licence'
] as const

export type AdminFileKey = (typeof ADMIN_FILE_KEYS)[number]

export const ADMIN_FILE_LABELS: Record<AdminFileKey, string> = {
    inspection_pricelist: 'Прайслист гостехосмотра',
    washing_pricelist: 'Прайслист мойки',
    winter_washing_pricelist: 'Прайслист мойки (зимний период)',
    cmr: 'CMR',
    licence: 'Лицензия'
}

export const ADMIN_FILE_MAX_SIZE_MB = 10
export const ADMIN_FILE_MAX_SIZE_BYTES = ADMIN_FILE_MAX_SIZE_MB * 1024 * 1024

export interface AdminFileVersionInfo {
    size: number
    // dd.mm.yyyy (UTC+3)
    updatedAt: string | null
}

export interface AdminFileInfo {
    key: AdminFileKey
    fileName: string
    url: string
    exists: boolean
    size: number | null
    // dd.mm.yyyy (UTC+3)
    updatedAt: string | null
    // true - default file from build
    isDefault: boolean
    previous: AdminFileVersionInfo | null
}

export function isAdminFileKey(value: unknown): value is AdminFileKey {
    return typeof value === 'string' && (ADMIN_FILE_KEYS as readonly string[]).includes(value)
}

export function getAdminFileName(key: AdminFileKey): string {
    return `${key}.pdf`
}

export function adminFileKeyFromName(name: string): AdminFileKey | null {
    if (!name.endsWith('.pdf')) return null
    const key = name.slice(0, -'.pdf'.length)
    return isAdminFileKey(key) ? key : null
}