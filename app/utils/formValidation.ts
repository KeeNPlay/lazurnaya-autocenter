// Phone is stored as 9 digits after +375 (the mask removes the static part)
export const PHONE_DIGITS_LENGTH = 9

export function isPhoneComplete(phone: string): boolean {
    return phone.length === PHONE_DIGITS_LENGTH
}

export function hasText(value: string, minLength = 1): boolean {
    return value.trim().length >= minLength
}