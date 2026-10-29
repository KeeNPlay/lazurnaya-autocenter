import { WASHING_TIME_SLOTS } from '~/constants/washingForm'
import { toMinskParts, ddmmyyyyToIsoKey, isoKeyToDdMmYyyy, dateToIsoKey, getMinskNowParts, isPastMinskTime } from '~/utils/minskTime'

interface BusyInterval {
    startMinutes: number
    endMinutes: number
}

const state = reactive({
    busyByDate: new Map<string, BusyInterval[]>(),
    loaded: false
})
const loading = ref(false)
const error = ref<string | null>(null)

export function useWashingSchedule() {
    async function load(force = false): Promise<void> {
        if ((state.loaded && !force) || loading.value) return
        loading.value = true
        error.value = null
        try {
            const busySlots = await $fetch<{ scheduledAt: string; durationMinutes: number }[]>('/api/forms/washing-busy-slots')
            state.busyByDate.clear()
            for (const slot of busySlots) {
                const { date, time } = toMinskParts(slot.scheduledAt)
                const startMinutes = timeStrToMinutes(time)
                const endMinutes = startMinutes + slot.durationMinutes
                if (!state.busyByDate.has(date)) state.busyByDate.set(date, [])
                state.busyByDate.get(date)!.push({ startMinutes, endMinutes })
            }
            state.loaded = true
        } catch (err) {
            error.value = getServerErrorMessage(err, 'Не удалось проверить занятость времени. Откройте календарь ещё раз через минуту.')
            console.error('Не удалось загрузить расписание мойки:', err)
        } finally {
            loading.value = false
        }
    }

    function getAvailableTimeOptions(ddmmyyyy: string, washType: string, vehicleType: string) {
        const durationMinutes = getWashingDurationMinutes(washType, vehicleType)
        if (!durationMinutes || !ddmmyyyy) {
            return WASHING_TIME_SLOTS.map((slot) => ({ ...slot, disabled: true }))
        }

        const isoKey = ddmmyyyyToIsoKey(ddmmyyyy)
        const busyIntervals = state.busyByDate.get(isoKey) ?? []
        const closingMinutes = timeStrToMinutes(WASHING_CLOSING_TIME)

        return WASHING_TIME_SLOTS.map((slot) => {
            const startMinutes = timeStrToMinutes(slot.value)
            const endMinutes = startMinutes + durationMinutes

            const exceedsClosing = endMinutes > closingMinutes
            const overlapsBusy = busyIntervals.some((interval) => startMinutes < interval.endMinutes && endMinutes > interval.startMinutes)
            const isPast = isPastMinskTime(isoKey, slot.value)

            return { ...slot, disabled: exceedsClosing || overlapsBusy || isPast }
        })
    }

    function isDateFullyBooked(date: Date, washType: string, vehicleType: string): boolean {
        const isoKey = dateToIsoKey(date)
        const options = getAvailableTimeOptions(isoKeyToDdMmYyyy(isoKey), washType, vehicleType)
        return options.every((option) => option.disabled)
    }

    function markSlotAsBusy(ddmmyyyy: string, time: string, durationMinutes: number): void {
        const isoKey = ddmmyyyyToIsoKey(ddmmyyyy)
        const startMinutes = timeStrToMinutes(time)
        const endMinutes = startMinutes + durationMinutes
        if (!state.busyByDate.has(isoKey)) state.busyByDate.set(isoKey, [])
        state.busyByDate.get(isoKey)!.push({ startMinutes, endMinutes })
    }

    return { loading, error, load, getAvailableTimeOptions, isDateFullyBooked, markSlotAsBusy }
}