import { promises as fs } from 'node:fs'
import { createHash, randomUUID } from 'node:crypto'
import { isAbsolute, join, resolve } from 'node:path'
import {
    getAdminFileName,
    type AdminFileInfo,
    type AdminFileKey
} from '~~/shared/utils/adminFiles'
import { formatMinskDateTime } from '../admin/adminRequestHelpers'

export interface StoredFile {
    data: Buffer
    updatedAt: Date | null
    etag: string
    isDefault: boolean
}

interface FileStat {
    size: number
    mtime: Date
}

function getUploadDir(): string {
    const configured = String(useRuntimeConfig().uploadDir ?? '').trim()
    const dir = configured || 'storage/docs'
    return isAbsolute(dir) ? dir : resolve(process.cwd(), dir)
}

function currentPath(key: AdminFileKey): string {
    return join(getUploadDir(), getAdminFileName(key))
}

function previousPath(key: AdminFileKey): string {
    return join(getUploadDir(), `${key}.prev.pdf`)
}

function isNotFound(error: unknown): boolean {
    return (error as NodeJS.ErrnoException | null)?.code === 'ENOENT'
}

async function statFile(path: string): Promise<FileStat | null> {
    try {
        const stat = await fs.stat(path)
        return { size: stat.size, mtime: stat.mtime }
    } catch (error) {
        if (isNotFound(error)) return null
        throw error
    }
}

async function readUploaded(path: string): Promise<{ data: Buffer; mtime: Date } | null> {
    try {
        const [data, stat] = await Promise.all([fs.readFile(path), fs.stat(path)])
        return { data, mtime: stat.mtime }
    } catch (error) {
        if (isNotFound(error)) return null
        throw error
    }
}

// The source versions are located in server/assets/docs and are included in the build
async function readSeed(key: AdminFileKey): Promise<Buffer | null> {
    const raw = await useStorage('assets:server').getItemRaw(`docs/${getAdminFileName(key)}`)
    if (!raw) return null
    return Buffer.from(raw as Uint8Array)
}

// Writing via a temporary file: this ensures the site won't be left with a corrupted PDF in the event of a failure
async function writeAtomic(target: string, data: Buffer, mtime?: Date | null): Promise<void> {
    const tmp = `${target}.${randomUUID()}.tmp`

    try {
        await fs.writeFile(tmp, data)
        if (mtime) await fs.utimes(tmp, mtime, mtime)
        await fs.rename(tmp, target)
    } catch (error) {
        await fs.rm(tmp, { force: true })
        throw error
    }
}

function formatDate(date: Date | null): string | null {
    if (!date) return null
    const formatted = formatMinskDateTime(date)
    return `${formatted.date} ${formatted.time}`
}

export async function readCurrentFile(key: AdminFileKey): Promise<StoredFile | null> {
    const uploaded = await readUploaded(currentPath(key))

    if (uploaded) {
        return {
            data: uploaded.data,
            updatedAt: uploaded.mtime,
            etag: `"${uploaded.data.length}-${uploaded.mtime.getTime()}"`,
            isDefault: false
        }
    }

    const seed = await readSeed(key)
    if (!seed) return null

    return {
        data: seed,
        updatedAt: null,
        etag: `"seed-${createHash('md5').update(seed).digest('hex')}"`,
        isDefault: true
    }
}

export async function getAdminFileInfo(key: AdminFileKey): Promise<AdminFileInfo> {
    const fileName = getAdminFileName(key)
    const uploaded = await statFile(currentPath(key))
    const previous = await statFile(previousPath(key))

    let size: number | null = null
    let isDefault = false

    if (uploaded) {
        size = uploaded.size
    } else {
        const seed = await readSeed(key)
        if (seed) {
            size = seed.length
            isDefault = true
        }
    }

    return {
        key,
        fileName,
        url: `/docs/${fileName}`,
        exists: size !== null,
        size,
        updatedAt: formatDate(uploaded?.mtime ?? null),
        isDefault,
        previous: previous ? { size: previous.size, updatedAt: formatDate(previous.mtime) } : null
    }
}

export async function saveAdminFile(key: AdminFileKey, data: Buffer): Promise<void> {
    await fs.mkdir(getUploadDir(), { recursive: true })

    // The current version (or one from the build) becomes the previous version
    const current = await readCurrentFile(key)
    if (current) await writeAtomic(previousPath(key), current.data, current.updatedAt)

    await writeAtomic(currentPath(key), data)
}

export async function restorePreviousAdminFile(key: AdminFileKey): Promise<void> {
    const previous = await readUploaded(previousPath(key))
    if (!previous) {
        throw createError({ statusCode: 404, statusMessage: 'Предыдущей версии файла нет' })
    }

    const current = await readCurrentFile(key)

    await writeAtomic(currentPath(key), previous.data, previous.mtime)
    // The current version is moved to "previous" versions, so the rollback can be undone
    if (current) await writeAtomic(previousPath(key), current.data, current.updatedAt)
}