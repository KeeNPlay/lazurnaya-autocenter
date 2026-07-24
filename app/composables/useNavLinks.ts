export interface INavLink {
  path: string
  title: string
}

export const useNavLinks = (): INavLink[] => {
  return [
    { path: '/', title: 'Главная' },
    { path: '/inspection', title: 'Гостехосмотр' },
    { path: '/washing', title: 'Мойка' },
    { path: '/transportation', title: 'Международные грузоперевозки' },
    { path: '/contacts', title: 'Контакты' },
  ]
}