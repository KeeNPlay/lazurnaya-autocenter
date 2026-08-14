import type { ICardDescription } from '~/constants/pageDescriptionCard'

export const clientInfo: ICardDescription[] = [
    {
        icon: { type: 'icon', value: 'heroicons:document-text-20-solid'},
        title: 'Реквизиты',
        descriptionPart: [
            { type: 'text', value: 'ООО «Автоцентр на Лазурной»\n' },
            { type: 'text', value: '246000, Республика Беларусь, г. Гомель, ул. Лазурная, д. 19, комната 16\n' },
            { type: 'text', value: 'УНП 491324076; ОКПО 304968723000\n' },
            { type: 'text', value: 'Банк: г. Минск, ОАО «АСБ Беларусбанк»\n' },
            { type: 'text', value: 'Р/с BY57AKBB30121263300173000000\n' },
            { type: 'text', value: 'Код банка: AKBBBY2Х\n' },
            { type: 'text', value: 'Телефон/факс: ' },
            { type: 'link', value: '+375 (232) 50-00-01\n', to: 'tel:+375232500001', external: true },
            { type: 'text', value: 'E-mail: '},
            { type: 'link', value: 'valerydrozd@gmail.com\n', to: 'mailto:valerydrozd@gmail.com', external: true }
        ]
    },
    {
        icon: { type: 'icon', value: 'heroicons:receipt-percent-20-solid'},
        title: 'Прайслист',
        descriptionPart: [
            { type: 'text', value: 'Услуги по мойке автотранспорта: ' },
            { type: 'link', value: 'лето', to: 'docs/washing_pricelist.pdf', external: true },
            { type: 'text', value: ', ' },
            { type: 'link', value: 'зима', to: 'docs/winter_washing_pricelist.pdf', external: true },
            { type: 'text', value: '\n* Скидка предоставляется для транспортных средств проходивших государственный технический осмотр на диагностической станции предприятия в день прохождения.\n* По согласованию с администрацией возможны дополнительные работы не предусмотренные настоящим прейскурантом по договорной цене.\n' },
            { type: 'link', value: 'Услуги по проведению государственного технического осмотра транспортных средств', to: 'docs/inspection_pricelist.pdf', external: true },
        ],
    },
]