export function formatPhone(phone: string): string {
    const digits = phone.replace(/\D/g, '')
    const match = /^375(\d{2})(\d{3})(\d{2})(\d{2})$/.exec(digits)

    if (!match) return phone

    return `+375 (${match[1]}) ${match[2]}-${match[3]}-${match[4]}`
}

// 375291234567 → 291234567 (such format as in BaseFormPhoneInput)
export function phoneToLocalDigits(phone: string): string {
    const digits = phone.replace(/\D/g, '')
    return digits.startsWith('375') ? digits.slice(3) : digits
}