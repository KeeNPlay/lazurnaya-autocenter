export const WASHING_CLOSING_TIME = '16:00:00'

export const WASHING_DURATION_MINUTES: Record<string, Record<string, number>> = {
    water: {
        car: 60,
        truck: 60,
        'truck-trailer': 60,
        bus: 60,
        'special-machinery': 60
    },
    'active-foam': {
        car: 60,
        truck: 60,
        'truck-trailer': 60,
        bus: 60,
        'special-machinery': 60
    },
    'dirt-blaster': {
        truck: 120,
        'truck-trailer': 120,
        'special-machinery': 120
    }
}

export function getWashingDurationMinutes(washType: string, vehicleType: string): number | undefined {
    return WASHING_DURATION_MINUTES[washType]?.[vehicleType]
}

export function timeStrToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number)
    return hours * 60 + minutes
}