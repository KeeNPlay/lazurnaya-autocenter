export const WASHING_CLOSING_TIME = '16:00:00'

export const WASHING_DURATION_MINUTES: Record<string, Record<string, number>> = {
    water: {
        car: 30,
        truck: 30,
        'truck-trailer': 45,
        bus: 30,
        'special-machinery': 45
    },
    'active-foam': {
        car: 30,
        truck: 45,
        'truck-trailer': 60,
        bus: 45,
        'special-machinery': 60
    },
    'dirt-blaster': {
        truck: 90,
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