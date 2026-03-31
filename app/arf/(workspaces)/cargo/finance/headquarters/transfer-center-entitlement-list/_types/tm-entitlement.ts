export type CommissionModel = "per_piece" | "percentage"

export interface TmEntitlementRow {
  transferCenterId: string
  transferCenterName: string
  transferCenterCode: string
  commissionModel: CommissionModel
  commissionValue: number
  toplamHakedis: number
  onaylanan: number
  onayBekleyen: number
  iptalEdilen: number
  toplamParcaAdedi: number
  toplamKargoBedeli: number
}

export interface TmEntitlementSummary {
  toplamHakedis: number
  parcaBasiToplam: number
  yuzdelikToplam: number
  onayBekleyen: number
  iptalEdilen: number
}
