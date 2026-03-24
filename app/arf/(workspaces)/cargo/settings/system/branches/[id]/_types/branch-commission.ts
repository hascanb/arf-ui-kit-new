export type CommissionTransactionType = "alim" | "dagitim"
export type BranchCommissionStatus = "confirmed" | "pending" | "cancelled"

export interface BranchCommissionRecord {
  id: string
  processDate: string
  trackingNo: string
  transactionType: CommissionTransactionType
  kargoBedeli: number
  oran: number
  hesaplamaDetayi: string
  netKazanc: number
  status: BranchCommissionStatus
}
