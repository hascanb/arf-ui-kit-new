export type SurchargeValueType = "fixed" | "percent"

export interface PriceSurcharge {
  smsNotificationFee: number
  codCommissionType: SurchargeValueType
  codCommissionValue: number
  pickupFee: number
  remoteAreaDeliveryFee: number
}
