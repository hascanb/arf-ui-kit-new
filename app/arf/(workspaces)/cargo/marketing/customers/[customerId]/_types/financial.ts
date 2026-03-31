import type { CustomerShipmentRecord } from "../../_data/customers"

/** Fatura/ekstre satırı durum enum'ı */
export type InvoicePaymentStatus = "odendi" | "bekliyor" | "kismi" | "gecikti" | "reddedildi" | "iade" | "iptal"

/** Genişletilmiş tahsilat durumu (sözleşmesiz müşteriler için) */
export type ExtendedCollectionStatus =
  | "musteri_tahsil_edildi"
  | "bekliyor"
  | "gm_gonderildi"

/** Ekstre işlem tipi */
export type ExstreTransactionType = "fatura" | "gelen_odeme"

/** Açık Kargo satırı – mevcut CustomerShipmentRecord'dan türetilir */
export type OpenCargoRecord = CustomerShipmentRecord

/** Fatura/Ödeme ekstre kaydı */
export interface FinancialExstreRecord {
  id: string
  type: ExstreTransactionType
  invoiceId?: string
  invoiceNo: string
  dueDate: string
  description: string
  debit: number
  credit: number
  remainingBalance: number
  status: InvoicePaymentStatus
  relatedCargoCount?: number
  createdAt: string
}

/** Finansal KPI verileri */
export interface FinancialKpi {
  openCargoAmount: number
  pendingInvoiceDebt: number
  overdueDebt: number
  lastCollectionDate: string
  lastCollectionAmount: number
}

export interface InvoiceCustomerInfo {
  customerId: string
  customerType: "corporate" | "individual"
  tradeName: string
  taxOffice: string
  taxNumber: string
}

export interface CreateInvoicePayload {
  invoiceName: string
  issueDate: string
  dueDate: string
  note: string
  subTotal: number
  vatTotal: number
  grandTotal: number
}
