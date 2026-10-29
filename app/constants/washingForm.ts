export interface TimeOption {
    label: string
    value: string
}

export interface SelectOption {
    label: string
    value: string
}

export const WASHING_TIME_SLOTS: TimeOption[] = [
    { label: '8:00', value: '08:00:00' },
    { label: '8:15', value: '08:15:00' },
    { label: '8:30', value: '08:30:00' },
    { label: '8:45', value: '08:45:00' },
    { label: '9:00', value: '09:00:00' },
    { label: '9:15', value: '09:15:00' },
    { label: '9:30', value: '09:30:00' },
    { label: '9:45', value: '09:45:00' },
    { label: '10:00', value: '10:00:00' },
    { label: '10:15', value: '10:15:00' },
    { label: '10:30', value: '10:30:00' },
    { label: '10:45', value: '10:45:00' },
    { label: '11:00', value: '11:00:00' },
    { label: '11:15', value: '11:15:00' },
    { label: '11:30', value: '11:30:00' },
    { label: '11:45', value: '11:45:00' },
    { label: '12:00', value: '12:00:00' },
    { label: '12:15', value: '12:15:00' },
    { label: '12:30', value: '12:30:00' },
    { label: '12:45', value: '12:45:00' },
    { label: '13:00', value: '13:00:00' },
    { label: '13:15', value: '13:15:00' },
    { label: '13:30', value: '13:30:00' },
    { label: '13:45', value: '13:45:00' },
    { label: '14:00', value: '14:00:00' },
    { label: '14:15', value: '14:15:00' },
    { label: '14:30', value: '14:30:00' },
    { label: '14:45', value: '14:45:00' },
    { label: '15:00', value: '15:00:00' },
    { label: '15:15', value: '15:15:00' },
    { label: '15:30', value: '15:30:00' },
]

// If anything is added, don't forget to update: formEnums.ts, pgEnum (schema.ts), shared/utils/washing.ts

export const VEHICLE_TYPE_OPTIONS: SelectOption[] = [
    { label: 'Легковой автомобиль', value: 'car' },
    { label: 'Грузовой автомобиль', value: 'truck' },
    { label: 'Грузовой автомобиль с полуприцепом', value: 'truck-trailer' },
    { label: 'Автобус', value: 'bus' },
    { label: 'Спецтехника', value: 'special-machinery' }
]

export const WASH_TYPE_OPTIONS: SelectOption[] = [
    { label: 'Обмыв без моющих средств', value: 'water' },
    { label: 'Пенно-активная мойка', value: 'active-foam' },
    { label: 'Грязевая фреза', value: 'dirt-blaster' }
]