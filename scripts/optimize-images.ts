import { promises as fs } from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'

const SRC = path.resolve('images-src')
const OUT = path.resolve('public/images')

const MAX_WIDTH = 1920
const QUALITY = 75

async function walk(dir: string): Promise<string[]> {
    const entries = await fs.readdir(dir, { withFileTypes: true })
    const files = await Promise.all(
        entries.map((e) => {
            const full = path.join(dir, e.name)
            return e.isDirectory() ? walk(full) : [full]
        })
    )
    return files.flat()
}

async function main() {
    const files = await walk(SRC)
    let before = 0
    let after = 0

    for (const file of files) {
        const ext = path.extname(file).toLowerCase()
        if (!['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) continue

        const rel = path.relative(SRC, file)
        const outFile = path.join(OUT, rel)
        await fs.mkdir(path.dirname(outFile), { recursive: true })

        let pipeline = sharp(file)
            .rotate()
            .resize({ width: MAX_WIDTH, withoutEnlargement: true })

        if (ext === '.jpg' || ext === '.jpeg') {
            pipeline = pipeline.jpeg({ quality: QUALITY, mozjpeg: true, progressive: true })
        } else if (ext === '.png') {
            pipeline = pipeline.png({ compressionLevel: 9, palette: true })
        } else {
            pipeline = pipeline.webp({ quality: QUALITY })
        }

        await pipeline.toFile(outFile)

        const [a, b] = await Promise.all([fs.stat(file), fs.stat(outFile)])
        before += a.size
        after += b.size
        console.log(`${rel}: ${(a.size / 1048576).toFixed(2)} → ${(b.size / 1048576).toFixed(2)} МБ`)
    }

    console.log(`\nИтого: ${(before / 1048576).toFixed(1)} → ${(after / 1048576).toFixed(1)} МБ`)
}

main().catch((e) => {
    console.error(e)
    process.exit(1)
})