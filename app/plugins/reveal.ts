import type { Directive } from 'vue'

type RevealValue = number | { delay?: number } | undefined

declare module 'vue' {
    interface GlobalDirectives {
        vReveal: Directive<HTMLElement, RevealValue>
    }
}

const DURATION = 800

let observer: IntersectionObserver | undefined
const delays = new WeakMap<HTMLElement, number>()
const timers = new WeakMap<HTMLElement, ReturnType<typeof setTimeout>>()

function getDelay(value: RevealValue): number {
    return typeof value === 'number' ? value : (value?.delay ?? 0)
}

function reveal(el: HTMLElement): void {
    el.dataset.reveal = 'shown'

    timers.set(el, setTimeout(() => {
        delete el.dataset.reveal
        el.style.removeProperty('--reveal-delay')
    }, (delays.get(el) ?? 0) + DURATION + 100))
}

function getObserver(): IntersectionObserver {
    observer ??= new IntersectionObserver((entries) => {
        for (const entry of entries) {
            if (!entry.isIntersecting) continue
            observer?.unobserve(entry.target)
            reveal(entry.target as HTMLElement)
        }
    }, {
        rootMargin: '0px 0px -10% 0px',
    })
    return observer
}

export default defineNuxtPlugin((nuxtApp) => {
    useHead({
        noscript: [
            { innerHTML: '<style>[data-reveal]{opacity:1!important;transform:none!important}</style>' },
        ],
    })

    nuxtApp.vueApp.directive('reveal', {
        getSSRProps() {
            return { 'data-reveal': 'hidden' }
        },

        mounted(el, { value }) {
            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                delete el.dataset.reveal
                return
            }

            const delay = getDelay(value)
            delays.set(el, delay)
            el.style.setProperty('--reveal-delay', `${delay}ms`)
            el.dataset.reveal = 'hidden'
            getObserver().observe(el)
        },

        unmounted(el) {
            observer?.unobserve(el)
            clearTimeout(timers.get(el))
        },
    } satisfies Directive<HTMLElement, RevealValue>)
})