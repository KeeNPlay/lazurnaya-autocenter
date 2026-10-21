export function useBookingModal() {
  const isOpen = useState<boolean>('booking-modal-open', () => false)

  const openModal = (): void => {
    isOpen.value = true
  }

  const closeModal = (): void => {
    isOpen.value = false
  }

  return { isOpen, openModal, closeModal }
}