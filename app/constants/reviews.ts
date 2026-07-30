export type Rating = 1 | 2 | 3 | 4 | 5

export interface IReview {
  id: number
  author: string
  text: string
  rating: Rating
  mapsLink: string
}

export const reviews: IReview[] = [
  {
    id: 1,
    author: 'Саша Плюс',
    text: 'Отличная станция технического осмотра, вежливый компетентный, добродушный персонал, все расскажут, подскажут, помогут и работают в понедельник.',
    rating: 5,
    mapsLink: 'https://yandex.by/maps/org/1014717321/reviews?reviews%5BpublicId%5D=wmk199y00fymzkntvbb86paq4m&utm_source=review',
  },
  {
    id: 2,
    author: 'Диана А.',
    text: 'Огромная благодарность специалистам по техосмотру за добросовестную работу. Быстро, оперативно, без лишних слов.',
    rating: 5,
    mapsLink: 'https://yandex.by/maps/org/1014717321/reviews?reviews%5BpublicId%5D=xqgg0f1rzjqtaf56fz18ygwfxm&utm_source=review',
  },
  {
    id: 3,
    author: 'Dmitry',
    text: 'Очень хорошая станция. Работают быстро и чётко. Прошёл техосмотр за 10 минут. Кажется, это мой рекорд. На прошлой машине специалисту не понравились как работают тормоза. И действительно на Сто сказали, что нужно почистить суппорта.',
    rating: 5,
    mapsLink: 'https://yandex.by/maps/org/1014717321/reviews?reviews%5BpublicId%5D=hb4zhgkzqbvtmckjwar2bydx8r&utm_source=review',
  },
  {
    id: 4,
    author: 'Николай Легеза',
    text: 'Всегда четкое и оперативное обслуживание',
    rating: 5,
    mapsLink: 'https://yandex.by/maps/org/1014717321/reviews?reviews%5BpublicId%5D=e1ectjcwbxuw7a6yhx3a425r6r&utm_source=review',
  },
  {
    id: 5,
    author: 'Татьяна Анисенко',
    text: 'Я была первая и все быстро прошла.Спасибо!! Рекомендую!',
    rating: 5,
    mapsLink: 'https://yandex.by/maps/org/1014717321/reviews?reviews%5BpublicId%5D=jqat3c8ha4v58g1ek33ve6hwkw&utm_source=review',
  },
  {
    id: 6,
    author: 'Михаил Дорощенко',
    text: 'Отличный техосмотр. Прохожу здесь техосмотр каждый год уже около девяти лет. В этом году на прохождение потратил 15 минут. Все отлично. Рекомендую.',
    rating: 5,
    mapsLink: 'https://yandex.by/maps/org/1014717321/reviews?reviews%5BpublicId%5D=997f88wde9jbzxgwwt189e5vcc&utm_source=review',
  },
  {
    id: 7,
    author: 'Добрый Тип',
    text: 'Быстро, удобно, качественно. За работу в понедельник еще плюс.',
    rating: 5,
    mapsLink: 'https://yandex.by/maps/org/1014717321/reviews?reviews%5BpublicId%5D=5p9hw4u9mjym1yedqe6kf29pmm&utm_source=review',
  },
  {
    id: 8,
    author: 'Дмитрий Чучваго',
    text: 'Все отлично, техосмотр прохожу почти 10 лет только тут. Быстро, просто и очередей нет если приезжать в рабочее время не в час пик)',
    rating: 5,
    mapsLink: 'https://yandex.by/maps/org/1014717321/reviews?reviews%5BpublicId%5D=t5ua17vhctbthnqatqzup6x4jm&utm_source=review',
  },
]