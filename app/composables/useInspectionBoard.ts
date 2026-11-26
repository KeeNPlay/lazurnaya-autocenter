interface IBoardRecord {
    id: number
    at: number
    plate: string
}

interface IBoardResponse {
    now: number
    activeMinutes: number
    breakFrom: string
    breakTo: string
    records: IBoardRecord[]
}

type BoardMode = 'loading' | 'current' | 'break' | 'waiting' | 'finished' | 'empty'

const MINSK_OFFSET_MS = 3 * 60 * 60 * 1000 // UTC+3 (Europe/Minsk)
const POLL_INTERVAL_MS = 20_000
const CLOCK_INTERVAL_MS = 1_000
const LIST_LIMIT = 6

const pad = (value: number): string => String(value).padStart(2, '0')

const toMinsk = (ms: number): Date => new Date(ms + MINSK_OFFSET_MS)

const formatTime = (ms: number): string => {
    const date = toMinsk(ms)
    return `${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())}`
}

const formatDate = (ms: number): string => {
    const date = toMinsk(ms)
    return `${pad(date.getUTCDate())}.${pad(date.getUTCMonth() + 1)}.${date.getUTCFullYear()}`
}

const minutesOfDay = (ms: number): number => {
    const date = toMinsk(ms)
    return date.getUTCHours() * 60 + date.getUTCMinutes()
}

const parseHHMM = (value: string): number => {
    const [hours = '0', minutes = '0'] = value.split(':')
    return Number(hours) * 60 + Number(minutes)
}

export function useInspectionBoard() {
    const records = ref<IBoardRecord[]>([])
    const activeMinutes = ref<number>(15)
    const breakFrom = ref<string>('13:00')
    const breakTo = ref<string>('13:30')

    // The difference between the server clock and this PC's clock
    const offsetMs = ref<number>(0)
    const clock = ref<number>(Date.now())

    const loaded = ref<boolean>(false)
    const connected = ref<boolean>(true)

    // Manually pinning the highlight to a specific entry
    const pinnedId = ref<number | null>(null)

    const nowMs = computed<number>(() => clock.value + offsetMs.value)

    const timeText = computed<string>(() => formatTime(nowMs.value))
    const dateText = computed<string>(() => formatDate(nowMs.value))

    // Time-based highlighting: an entry remains highlighted until the next entry, but for no longer than activeMinutes
    const activeIndex = computed<number>(() => {
        const now = nowMs.value
        let index = -1

        for (let i = 0; i < records.value.length; i++) {
            const record = records.value[i]
            if (record && record.at <= now) {
                index = i
            } else {
                break
            }
        }

        if (index === -1) return -1

        const record = records.value[index]
        if (!record) return -1

        return now < record.at + activeMinutes.value * 60_000 ? index : -1
    })

    const autoFocusId = computed<number | null>(() => {
        if (activeIndex.value < 0) return null
        return records.value[activeIndex.value]?.id ?? null
    })

    // As soon as the backlight on the watch switches to a different entry, the manual lock is released
    watch(autoFocusId, (): void => {
        pinnedId.value = null
    })

    const pinnedIndex = computed<number>(() => {
        if (pinnedId.value === null) return -1
        return records.value.findIndex((record) => record.id === pinnedId.value)
    })

    const isPinned = computed<boolean>(() => pinnedIndex.value >= 0)

    const focusIndex = computed<number>(() => (isPinned.value ? pinnedIndex.value : activeIndex.value))

    const currentRecord = computed<IBoardRecord | null>(() => {
        if (focusIndex.value < 0) return null
        return records.value[focusIndex.value] ?? null
    })

    const current = computed<{ plate: string; time: string } | null>(() => {
        const record = currentRecord.value
        return record ? { plate: record.plate, time: formatTime(record.at) } : null
    })

    // Records following the current one (or, if there is no current one, all future records)
    const upcoming = computed<IBoardRecord[]>(() => {
        if (focusIndex.value >= 0) return records.value.slice(focusIndex.value + 1)
        return records.value.filter((record) => record.at > nowMs.value)
    })

    const visibleList = computed(() =>
        upcoming.value.slice(0, LIST_LIMIT).map((record) => ({
            id: record.id,
            plate: record.plate,
            time: formatTime(record.at)
        }))
    )

    const hiddenCount = computed<number>(() => Math.max(0, upcoming.value.length - LIST_LIMIT))

    const nextTime = computed<string>(() => {
        const first = upcoming.value[0]
        return first ? formatTime(first.at) : ''
    })

    const inBreak = computed<boolean>(() => {
        const minutes = minutesOfDay(nowMs.value)
        return minutes >= parseHHMM(breakFrom.value) && minutes < parseHHMM(breakTo.value)
    })

    const mode = computed<BoardMode>(() => {
        if (!loaded.value) return 'loading'
        if (focusIndex.value >= 0) return 'current'
        if (inBreak.value) return 'break'
        if (upcoming.value.length > 0) return 'waiting'
        return records.value.length > 0 ? 'finished' : 'empty'
    })

    // Manual switching
    const pastCount = computed<number>(
        () => records.value.filter((record) => record.at <= nowMs.value).length
    )

    const prevIndex = computed<number>(() =>
        focusIndex.value >= 0 ? focusIndex.value - 1 : pastCount.value - 1
    )

    const nextIndex = computed<number>(() =>
        focusIndex.value >= 0 ? focusIndex.value + 1 : pastCount.value
    )

    const canPrev = computed<boolean>(() => prevIndex.value >= 0 && prevIndex.value < records.value.length)
    const canNext = computed<boolean>(() => nextIndex.value >= 0 && nextIndex.value < records.value.length)

    function pinTo(index: number): void {
        const record = records.value[index]
        if (record) pinnedId.value = record.id
    }

    function goPrev(): void {
        if (canPrev.value) pinTo(prevIndex.value)
    }

    function goNext(): void {
        if (canNext.value) pinTo(nextIndex.value)
    }

    function resetPin(): void {
        pinnedId.value = null
    }

    // Загрузка данных
    let isLoading = false
    let loadedDay: string | null = null

    async function load(): Promise<void> {
        if (isLoading) return
        isLoading = true

        try {
            const data = await $fetch<IBoardResponse>('/api/board/inspection')

            offsetMs.value = data.now - Date.now()
            activeMinutes.value = data.activeMinutes
            breakFrom.value = data.breakFrom
            breakTo.value = data.breakTo
            records.value = data.records

            if (loadedDay === null) {
                loadedDay = formatDate(Date.now() + offsetMs.value)
            }

            connected.value = true
            loaded.value = true
        } catch {
            // Remain on the last received data, display a "Нет связи" indicator
            connected.value = false
        } finally {
            isLoading = false
        }
    }

    function tick(): void {
        clock.value = Date.now()

        // Change of day: reload the page (this also picks up any new versions of the site)
        if (loadedDay !== null && connected.value && formatDate(nowMs.value) !== loadedDay) {
            window.location.reload()
        }
    }

    let clockTimer: ReturnType<typeof setInterval> | null = null
    let pollTimer: ReturnType<typeof setInterval> | null = null

    onMounted((): void => {
        void load()
        clockTimer = setInterval(tick, CLOCK_INTERVAL_MS)
        pollTimer = setInterval(() => void load(), POLL_INTERVAL_MS)
    })

    onBeforeUnmount((): void => {
        if (clockTimer) clearInterval(clockTimer)
        if (pollTimer) clearInterval(pollTimer)
    })

    return {
        loaded,
        connected,
        mode,
        timeText,
        dateText,
        current,
        nextTime,
        breakTo,
        visibleList,
        hiddenCount,
        isPinned,
        canPrev,
        canNext,
        goPrev,
        goNext,
        resetPin
    }
}