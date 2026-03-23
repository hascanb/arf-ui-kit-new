// TODO: Remove when API is ready — replace with real fetch from backend
export type InvoiceStatus = "beklemede" | "odendi" | "gecikti" | "iptal"

export interface InvoiceRecord {
  id: string
  fatura_no: string
  musteri: string
  tutar: number
  durum: InvoiceStatus
  tarih: string
}

export const mockInvoices: InvoiceRecord[] = [
  {
    id: "1",
    fatura_no: "FTR-2024-0001",
    musteri: "ABC Ticaret Ltd.",
    tutar: 2450.0,
    durum: "odendi",
    tarih: "2024-01-15",
  },
  {
    id: "2",
    fatura_no: "FTR-2024-0002",
    musteri: "XYZ Lojistik",
    tutar: 1820.5,
    durum: "beklemede",
    tarih: "2024-01-14",
  },
  {
    id: "3",
    fatura_no: "FTR-2024-0003",
    musteri: "Ahmet Yılmaz",
    tutar: 145.0,
    durum: "gecikti",
    tarih: "2024-01-10",
  },
]

export const invoiceStatusMeta: Record<
  InvoiceStatus,
  { label: string; variant: "default" | "secondary" | "destructive" | "outline" }
> = {
  beklemede: { label: "Beklemede", variant: "outline" },
  odendi: { label: "Ödendi", variant: "default" },
  gecikti: { label: "Gecikti", variant: "destructive" },
  iptal: { label: "İptal", variant: "secondary" },
}
