import { INSPECTION_TIME_SLOTS } from '~/constants/inspectionFormTime'
import { toMinskParts, ddmmyyyyToIsoKey, isoKeyToDdMmYyyy, getMinskNowParts, isPastMinskTime } from '~/utils/minskTime'

function dateToKey(date: Date): string {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
}

const state = reactive({ busyByDate: new Map<string, Set<string>>(), fullyBookedDates: new Set<string>(), loaded: false })
const loading = ref(false)
const error = ref<string | null>(null)

function recalcFullyBookedForDate(dateKey: string): void {
    const busyTimes = state.busyByDate.get(dateKey)
    if (!busyTimes) return
    const allSlotValues = INSPECTION_TIME_SLOTS.map((slot) => slot.value)
    if (allSlotValues.every((value) => busyTimes.has(value))) {
        state.fullyBookedDates.add(dateKey)
    } else {
        state.fullyBookedDates.delete(dateKey)
    }
}

export function useInspectionSchedule() {
    async function load(force = false): Promise<void> {
        if ((state.loaded && !force) || loading.value) return
        loading.value = true
        error.value = null
        try {
            const busySlots = await $fetch<string[]>('/api/forms/inspection-busy-slots')
            state.busyByDate.clear()
            state.fullyBookedDates.clear()
            for (const iso of busySlots) {
                const { date, time } = toMinskParts(iso)
                if (!state.busyByDate.has(date)) state.busyByDate.set(date, new Set())
                state.busyByDate.get(date)!.add(time)
            }
            for (const dateKey of state.busyByDate.keys()) recalcFullyBookedForDate(dateKey)
            state.loaded = true
        } catch (err) {
            error.value = getServerErrorMessage(err, 'Не удалось проверить занятость времени. Откройте календарь ещё раз через минуту.')
            console.error('Не удалось загрузить расписание гостехосмотра:', err)
        } finally {
            loading.value = false
        }
    }

    function getAvailableTimeOptions(ddmmyyyy: string) {
        if (!ddmmyyyy) return INSPECTION_TIME_SLOTS.map((slot) => ({ ...slot, disabled: false }))
        const isoKey = ddmmyyyyToIsoKey(ddmmyyyy)
        const busyTimes = state.busyByDate.get(isoKey) ?? new Set<string>()
        return INSPECTION_TIME_SLOTS.map((slot) => ({
            ...slot,
            disabled: busyTimes.has(slot.value) || isPastMinskTime(isoKey, slot.value)
        }))
    }

    function isDateFullyBooked(date: Date): boolean {
        const dateKey = dateToKey(date)
        if (state.fullyBookedDates.has(dateKey)) return true
        if (dateKey === getMinskNowParts().date) {
            return getAvailableTimeOptions(isoKeyToDdMmYyyy(dateKey)).every((option) => option.disabled)
        }
        return false
    }

    function getBusyTimesForDate(ddmmyyyy: string): Set<string> {
        if (!ddmmyyyy) return new Set()
        return state.busyByDate.get(ddmmyyyyToIsoKey(ddmmyyyy)) ?? new Set()
    }

    function markSlotAsBusy(ddmmyyyy: string, time: string): void {
        const dateKey = ddmmyyyyToIsoKey(ddmmyyyy)
        if (!state.busyByDate.has(dateKey)) state.busyByDate.set(dateKey, new Set())
        state.busyByDate.get(dateKey)!.add(time)
        recalcFullyBookedForDate(dateKey)
    }

    return { loading, error, load, getAvailableTimeOptions, isDateFullyBooked, getBusyTimesForDate, markSlotAsBusy }
}