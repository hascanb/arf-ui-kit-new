export interface BranchEntitlementRow {
  branchId: string
  branchName: string
  branchCode: string
  alimHakedisOrani: number
  dagitimHakedisOrani: number
  alimHakedisTotal: number
  dagitimHakedisTotal: number
  toplamHakedis: number
  teslimatiBeklenen: number
  onaylanan: number
  onayBekleyen: number
  iptalEdilen: number
  kargoAdedi: number
}

export interface BranchEntitlementSummary {
  toplamHakedis: number
  alimHakedisTotal: number
  dagitimHakedisTotal: number
  teslimatiBeklenen: number
  onayBekleyen: number
}
