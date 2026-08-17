import { readdir } from 'node:fs/promises'
import { join } from 'node:path'

const ALLOWED_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg', '.webp'])

export default defineEventHandler(async (): Promise<string[]> => {
  const galleryDir = join(process.cwd(), 'public', 'images', 'gallery')

  try {
    const files = await readdir(galleryDir)

    return files
      .filter((file) => {
        const extension = file.slice(file.lastIndexOf('.')).toLowerCase()
        return ALLOWED_EXTENSIONS.has(extension)
      })
      .map((file) => `/images/gallery/${file}`)
  } catch (error) {
    console.error('Не удалось прочитать папку галереи:', error)
    return []
  }
})