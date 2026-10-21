interface IStat {
  value: string
  description: string
}

export const useStats = (): IStat[] => [
  { value: '20000+', description: 'проведённых техосмотров' },
  { value: '1200+', description: 'моек за прошлый год' },
  { value: '10+', description: 'лет на рынке' },
  { value: '15+', description: 'стран в географии перевозок' },
]