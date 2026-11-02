import { timeStrToMinutes } from './washing'

const MINSK_OFFSET_MS = 3 * 60 * 60 * 1000
const SLOT_STEP_MINUTES = 15
const TIME_WITHOUT_SECONDS_RE = /^\d{2}:\d{2}:00$/

export const INSPECTION_AUTO_COMPLETE_MINUTES = 15

const INSPECTION_FIRST_SLOT = 8 * 60 + 30
const INSPECTION_LAST_SLOT = 16 * 60 + 30
const INSPECTION_LUNCH_FIRST_BLOCKED = 12 * 60 + 45
const INSPECTION_LUNCH_LAST_BLOCKED = 13 * 60 + 15

const WASHING_FIRST_SLOT = 8 * 60

export function isValidInspectionTime(time: string): boolean {
    if (!TIME_WITHOUT_SECONDS_RE.test(time)) return false

    const minutes = timeStrToMinutes(time)
    if (minutes % SLOT_STEP_MINUTES !== 0) return false
    if (minutes < INSPECTION_FIRST_SLOT || minutes > INSPECTION_LAST_SLOT) return false

    return minutes < INSPECTION_LUNCH_FIRST_BLOCKED || minutes > INSPECTION_LUNCH_LAST_BLOCKED
}

export function isValidWashingStartTime(time: string): boolean {
    if (!TIME_WITHOUT_SECONDS_RE.test(time)) return false

    const minutes = timeStrToMinutes(time)
    return minutes % SLOT_STEP_MINUTES === 0 && minutes >= WASHING_FIRST_SLOT
}

export function isMinskWeekend(date: Date): boolean {
    const day = new Date(date.getTime() + MINSK_OFFSET_MS).getUTCDay()
    return day === 0 || day === 6
}