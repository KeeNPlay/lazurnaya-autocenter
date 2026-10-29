import 'dotenv/config'
import postgres from 'postgres'
import { drizzle } from 'drizzle-orm/postgres-js'
import { migrate } from 'drizzle-orm/postgres-js/migrator'

async function main() {
    const client = postgres(process.env.DATABASE_URL!, { max: 1 })
    const db = drizzle(client)

    console.log('Applying migrations')
    await migrate(db, { migrationsFolder: './server/database/migrations' })
    console.log('Migrations applied successfully')

    await client.end()
}

main().catch((err) => {
    console.error('Migration error:', err)
    process.exit(1)
})