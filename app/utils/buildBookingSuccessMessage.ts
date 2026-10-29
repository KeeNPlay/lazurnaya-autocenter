export function buildBookingSuccessMessage(ddmmyyyy: string, time: string): string {
    const timeFormatted = time.slice(0, 5).replace(':', '.')

    return `Вы записаны на ${ddmmyyyy} в ${timeFormatted}.\n` +
        'Просим Вас своевременно прибыть на визит. Обращаем внимание, что при систематических неявках номер телефона вносится в черный список.\n' +
        'Для переноса или отмены записи, пожалуйста, свяжитесь с нами: +375 44 715 44 44.'
}