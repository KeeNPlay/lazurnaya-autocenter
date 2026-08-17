export function useHeaderHeight() {
  const headerHeight = useState<number>('header-height', () => 0)

  return { headerHeight }
}