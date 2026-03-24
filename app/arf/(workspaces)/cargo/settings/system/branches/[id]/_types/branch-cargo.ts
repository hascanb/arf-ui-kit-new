export type CargoDirection = "gonderici" | "alici"
export type CargoStatus = "bekliyor" | "yolda" | "teslim_edildi" | "iade" | "iptal"

export interface BranchCargoRecord {
  id: string
  takipNo: string
  yon: CargoDirection
  gondericiSubeId?: string
  gondericiSubeAdi?: string
  aliciSubeId?: string
  aliciSubeAdi?: string
  gondericiAdSoyad: string
  aliciAdSoyad: string
  kargoBedeli: number
  durum: CargoStatus
  tarih: string
  teslimTarihi?: string
}
