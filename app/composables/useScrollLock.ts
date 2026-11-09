// Shared between the burger menu and modals: scrolling is unlocked only when
// every lock has been released (otherwise one component can unlock another's scroll)
const activeLocks = new Set<symbol>()

export function useScrollLock() {
    const lenis = useLenis()
    const id = Symbol('scroll-lock')

    function sync(): void {
        if (!import.meta.client) return

        const locked = activeLocks.size > 0
        document.body.style.overflow = locked ? 'hidden' : ''

        if (locked) lenis?.stop()
        else lenis?.start()
    }

    function lock(): void {
        activeLocks.add(id)
        sync()
    }

    function unlock(): void {
        activeLocks.delete(id)
        sync()
    }

    onScopeDispose(unlock)

    return { lock, unlock }
}