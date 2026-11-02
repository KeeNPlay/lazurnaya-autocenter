import type { InspectionUpdatePayload, WashingUpdatePayload } from '~/types/request'
import type { TransportationForm } from '~/constants/transportationForm'

// The fields used when creating an inspection or wash are the same as those used when editing one
export type InspectionCreatePayload = InspectionUpdatePayload
export type WashingCreatePayload = WashingUpdatePayload
export type SchedulableCreatePayload = InspectionCreatePayload | WashingCreatePayload

// The same fields as those sent by the public form, but without captchaToken
export type TransportationCreatePayload = TransportationForm & { budget: [number, number] }

export type AdminRequestCreatePayload = SchedulableCreatePayload | TransportationCreatePayload