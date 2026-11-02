export type AdminNotificationVariant = 'error' | 'success'

export interface AdminNotification {
    id: number
    variant: AdminNotificationVariant
    message: string
}

const AUTO_DISMISS_MS = 60_000
const MAX_VISIBLE = 5

let nextId = 1
const timers = new Map<number, ReturnType<typeof setTimeout>>()

export function useAdminNotifications() {
    const notifications = useState<AdminNotification[]>('admin-notifications', () => [])

    function dismiss(id: number): void {
        const timer = timers.get(id)
        if (timer) {
            clearTimeout(timer)
            timers.delete(id)
        }
        notifications.value = notifications.value.filter((item) => item.id !== id)
    }

    function notify(variant: AdminNotificationVariant, message: string): number {
        const id = nextId++

        notifications.value = [...notifications.value, { id, variant, message }].slice(-MAX_VISIBLE)

        if (import.meta.client) {
            timers.set(id, setTimeout(() => dismiss(id), AUTO_DISMISS_MS))
        }

        return id
    }

    return { notifications, notify, dismiss }
}