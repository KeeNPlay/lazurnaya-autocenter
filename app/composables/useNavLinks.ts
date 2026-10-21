import { ADMIN_HOME_PATH } from '~/constants/adminNav'

export interface INavLink {
  path: string
  title: string
}

const baseLinks: INavLink[] = [
  { path: '/', title: 'Главная' },
  { path: '/inspection', title: 'Гостехосмотр' },
  { path: '/washing', title: 'Мойка' },
  { path: '/transportation', title: 'Международные грузоперевозки' },
  { path: '/contacts', title: 'Контакты' }
]

export const useNavLinks = (): ComputedRef<INavLink[]> => {
  const { isAuthenticated } = useAdminAuth()

  return computed<INavLink[]>(() => {
    if (!isAuthenticated.value) return baseLinks

    return [...baseLinks, { path: ADMIN_HOME_PATH, title: 'Админ-панель' }]
  })
}