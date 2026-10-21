import 'dotenv/config'
import argon2 from 'argon2'
import postgres from 'postgres'
import { drizzle } from 'drizzle-orm/postgres-js'
import { admins } from '../server/database/schema'

async function main() {
    const [login, password] = process.argv.slice(2)

    if (!login || !password) {
        console.error('Использование: npm run seed:admin -- <login> <password>')
        process.exit(1)
    }

    const client = postgres(process.env.DATABASE_URL!)
    const db = drizzle(client)

    const passwordHash = await argon2.hash(password)
    await db.insert(admins).values({ login, passwordHash })

    console.log(`Админ "${login}" успешно создан`)
    await client.end()
}

main().catch((err) => {
    console.error('Ошибка:', err)
    process.exit(1)
})