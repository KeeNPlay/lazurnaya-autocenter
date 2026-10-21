export type DescriptionPart =
    | { type: 'text', value: string }
    | { type: 'link', value: string, to: string, external?: boolean }

export type IconPart =
    | { type: 'text', value: string }
    | { type: 'icon', value: string }

export interface ICardDescription {
    title: string
    descriptionPart: DescriptionPart[]
    icon: IconPart 
}