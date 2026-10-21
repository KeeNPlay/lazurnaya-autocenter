export default defineEventHandler(async (event) => {
    if (!event.path.startsWith('/api/admin')) return
    if (event.path === '/api/admin/login') return

    // requireUserSession returns 401 if session does not exist
    await requireUserSession(event)
})