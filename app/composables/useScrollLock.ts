// Shared by the burger menu and modals: scrolling is unlocked only when every lock is released.
// A lock with `fixBody: true` additionally pins the body with position: fixed —
// iOS Safari ignores `overflow: hidden` on body, so the page keeps scrolling under a tall modal.
const activeLocks = new Map<symbol, boolean>()

let isBodyFixed = false
let savedScrollY = 0

interface LockOptions {
    fixBody?: boolean
}

export function useScrollLock() {
    const lenis = useLenis()
    const id = Symbol('scroll-lock')

    function fixBody(): void {
        const body = document.body
        savedScrollY = window.scrollY
        body.style.position = 'fixed'
        body.style.top = `-${savedScrollY}px`
        body.style.left = '0'
        body.style.right = '0'
        body.style.width = '100%'
        isBodyFixed = true
    }

    function unfixBody(): void {
        const body = document.body
        body.style.position = ''
        body.style.top = ''
        body.style.left = ''
        body.style.right = ''
        body.style.width = ''
        isBodyFixed = false
        window.scrollTo({ top: savedScrollY, behavior: 'instant' })
    }

    function sync(): void {
        if (!import.meta.client) return

        const locked = activeLocks.size > 0
        const needFixed = [...activeLocks.values()].some(Boolean)

        if (needFixed && !isBodyFixed) fixBody()
        else if (!needFixed && isBodyFixed) unfixBody()

        document.body.style.overflow = locked ? 'hidden' : ''

        if (locked) lenis?.stop()
        else lenis?.start()
    }

    function lock(options: LockOptions = {}): void {
        activeLocks.set(id, options.fixBody ?? false)
        sync()
    }

    function unlock(): void {
        activeLocks.delete(id)
        sync()
    }

    onScopeDispose(unlock)

    return { lock, unlock }
}