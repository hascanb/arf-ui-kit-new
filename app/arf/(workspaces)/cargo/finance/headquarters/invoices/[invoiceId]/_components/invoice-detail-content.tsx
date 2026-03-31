"use client"

import { useEffect, useMemo, useState, type ChangeEvent } from "react"
import type { Table as TanStackTable } from "@tanstack/react-table"
import { DataTable, DataTablePagination } from "@hascanb/arf-ui-kit/datatable-kit"
import { AppHeader } from "@hascanb/arf-ui-kit/layout-kit"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { addInvoicePayment, fetchInvoiceById, fetchInvoicePayments } from "../../_api/invoices-api"
import {
  formatDate,
  formatDateTime,
  formatMoney,
  getDueStatusMeta,
  getPaymentBankAccountLabel,
  getPaymentMatchType,
  INVOICE_STATUS_BADGE_CLASSES,
  INVOICE_STATUS_LABELS,
} from "../../_lib/invoice-presenters"
import type { InvoiceCargoSnapshot, InvoicePayment, InvoiceRecord } from "../../_types/invoice"
import { getCargoLinesColumns } from "../_columns/cargo-lines-columns"
import { getPaymentHistoryColumns } from "../_columns/payment-history-columns"
import type { InvoicePaymentHistoryRow } from "../_columns/payment-history-columns"
import { CalendarClock, Download, FileText, HandCoins, Wallet } from "lucide-react"

interface Props {
  initialInvoice: InvoiceRecord
  initialPayments: InvoicePayment[]
}

function buildFallbackCargoSnapshots(invoice: InvoiceRecord): InvoiceCargoSnapshot[] {
  const lineCount = Math.max(invoice.relatedCargoCount, 1)
  const baseUnit = Math.floor((invoice.subTotal / lineCount) * 100) / 100
  const vatUnit = Math.floor((invoice.vatTotal / lineCount) * 100) / 100

  return invoice.relatedCargoIds.map((cargoId, index) => {
    const isLast = index === invoice.relatedCargoIds.length - 1
    const usedBase = baseUnit * index
    const usedVat = vatUnit * index
    const baseAmount = isLast ? Number((invoice.subTotal - usedBase).toFixed(2)) : Number(baseUnit.toFixed(2))
    const vat = isLast ? Number((invoice.vatTotal - usedVat).toFixed(2)) : Number(vatUnit.toFixed(2))

    return {
      id: cargoId,
      trackingNo: cargoId.toUpperCase(),
      date: `${invoice.issueDate}T09:00:00`,
      route: `${invoice.operatingBranchName} -> Teslimat Hattı ${index + 1}`,
      status: invoice.status === "odendi" ? "Teslim Edildi" : "Faturalandı",
      pieceCount: 1 + (index % 3),
      amount: baseAmount + vat,
      senderCustomer: invoice.customerName,
      senderBranch: invoice.operatingBranchName,
      receiverBranch: `Dağıtım Şubesi ${index + 1}`,
      receiverCustomer: `Alıcı Müşteri ${index + 1}`,
      receiverPhone: `0532 000 0${index + 1}${index + 2}`,
      paymentType: index % 2 === 0 ? "Gönderici Ödemeli" : "Alıcı Ödemeli",
      invoiceType: invoice.customerType === "corporate" ? "Kurumsal Fatura" : "Bireysel Fatura",
      baseAmount,
      vat,
      volumetricWeight: 8 + index * 2,
      pieceList: `Koli-${index + 1}`,
      dispatchNo: `IRS-${invoice.invoiceNo.slice(-4)}-${index + 1}`,
      atfNo: `ATF-${invoice.invoiceNo.slice(-4)}-${index + 1}`,
      arrivalAt: `${invoice.issueDate}T13:30:00`,
      deliveryAt: invoice.status === "odendi" ? `${invoice.dueDate}T11:15:00` : "",
      lastActionAt: `${invoice.dueDate}T09:45:00`,
      pieceStatus: "Sağlam",
      invoiceStatus: "kesildi",
      collectionStatus:
        invoice.status === "odendi"
          ? "tahsil_edildi"
          : invoice.status === "iade"
            ? "iptal"
            : invoice.status === "kismi"
              ? "gm_gonderildi"
              : "beklemede",
      createdBy: invoice.createdBy,
    }
  })
}

export function InvoiceDetailContent({ initialInvoice, initialPayments }: Props) {
  const [invoice, setInvoice] = useState(initialInvoice)
  const [payments, setPayments] = useState(initialPayments)
  const [cargoTable, setCargoTable] = useState<TanStackTable<InvoiceCargoSnapshot> | null>(null)
  const [paymentTable, setPaymentTable] = useState<TanStackTable<InvoicePaymentHistoryRow> | null>(null)
  const [matchOpen, setMatchOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [matchDate, setMatchDate] = useState(new Date().toISOString().slice(0, 10))
  const [matchAmount, setMatchAmount] = useState(String(initialInvoice.remainingBalance || ""))
  const [matchChannel, setMatchChannel] = useState<InvoicePayment["channel"]>("eft")
  const [referenceNo, setReferenceNo] = useState("")

  useEffect(() => {
    const refresh = async () => {
      const [nextInvoice, nextPayments] = await Promise.all([
        fetchInvoiceById(initialInvoice.id),
        fetchInvoicePayments(initialInvoice.id),
      ])

      if (nextInvoice) {
        setInvoice(nextInvoice)
      }

      setPayments(nextPayments)
    }

    window.addEventListener("arf-headquarters-invoices-updated", refresh)
    return () => window.removeEventListener("arf-headquarters-invoices-updated", refresh)
  }, [initialInvoice.id])

  const dueStatus = useMemo(() => getDueStatusMeta(invoice), [invoice])
  const cargoRows = useMemo(
    () => (invoice.cargoSnapshots?.length ? invoice.cargoSnapshots.map((cargo) => ({ ...cargo })) : buildFallbackCargoSnapshots(invoice)),
    [invoice],
  )
  const cargoColumns = useMemo(() => getCargoLinesColumns(), [])
  const paymentColumns = useMemo(() => getPaymentHistoryColumns(), [])
  const paymentRows = useMemo<InvoicePaymentHistoryRow[]>(
    () =>
      payments
        .map((payment) => ({
          id: payment.id,
          paymentDate: payment.paymentDate,
          bankAccountLabel: getPaymentBankAccountLabel(payment),
          amount: payment.amount,
          matchType: getPaymentMatchType(payment),
          description: payment.referenceNo || `${invoice.invoiceNo} tahsilatı`,
        }))
        .sort((left, right) => right.paymentDate.localeCompare(left.paymentDate)),
    [invoice.invoiceNo, payments],
  )

  const matchDisabled = ["odendi", "reddedildi", "iade", "iptal"].includes(invoice.status)
  const parsedMatchAmount = Number(matchAmount.replace(",", "."))
  const dueDaysLabel = dueStatus.label

  async function handleMatchPayment() {
    if (!matchDate || !parsedMatchAmount || parsedMatchAmount <= 0) return

    setSaving(true)
    try {
      const result = await addInvoicePayment(invoice.id, {
        paymentDate: matchDate,
        amount: parsedMatchAmount,
        channel: matchChannel,
        referenceNo: referenceNo.trim() || `${invoice.invoiceNo}-MANUEL`,
      })

      if (!result) {
        window.alert("Tahsilat eşleştirme işlemi tamamlanamadı.")
        return
      }

      setInvoice(result.invoice)
      setPayments((prev) => [...prev, result.payment].sort((left, right) => right.paymentDate.localeCompare(left.paymentDate)))
      setMatchAmount(String(result.invoice.remainingBalance || ""))
      setReferenceNo("")
      setMatchOpen(false)
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <AppHeader
        breadcrumbs={[
          { label: "Ana Sayfa", href: "/" },
          { label: "Finans & Muhasebe", href: "/arf/cargo/finance" },
          { label: "Genel Merkez", href: "/arf/cargo/finance/headquarters" },
          { label: "Faturalar", href: "/arf/cargo/finance/headquarters/invoices" },
          { label: invoice.invoiceNo },
        ]}
      />

      <div className="flex flex-1 flex-col gap-4 bg-slate-50 p-4 pt-0">
        <Card className="overflow-hidden rounded-3xl border-slate-200 bg-white shadow-sm">
          <CardHeader className="gap-0 bg-[linear-gradient(135deg,rgba(248,250,252,0.98),rgba(241,245,249,0.90))] px-0 py-0">
            <div className="flex flex-col gap-4 px-6 pt-6 pb-5 lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-3">
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">Fatura Detayı</p>
                <div className="flex flex-wrap items-center gap-2">
                  <CardTitle className="text-2xl font-semibold text-slate-900">{invoice.invoiceNo}</CardTitle>
                  <Badge variant="outline" className={INVOICE_STATUS_BADGE_CLASSES[invoice.status]}>
                    {INVOICE_STATUS_LABELS[invoice.status]}
                  </Badge>
                </div>

              </div>

              <div className="flex flex-wrap items-center gap-2 self-start lg:self-auto">
                <Button
                  type="button"
                  variant="outline"
                  className="h-9 rounded-xl border-slate-200 bg-white px-4 text-sm text-slate-700 shadow-sm hover:bg-slate-50"
                  onClick={() => window.print()}
                >
                  <Download className="mr-1.5 size-3.5" />
                  PDF İndir
                </Button>
                <Button
                  type="button"
                  className="h-9 rounded-xl px-4 text-sm"
                  onClick={() => {
                    setMatchAmount(String(invoice.remainingBalance || ""))
                    setMatchOpen(true)
                  }}
                  disabled={matchDisabled}
                >
                  <HandCoins className="mr-1.5 size-3.5" />
                  Tahsilat Eşleştir
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="h-9 rounded-xl border-orange-200 bg-orange-50 px-4 text-sm text-orange-700 shadow-sm hover:bg-orange-100"
                >
                  İade İşaretle
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="h-9 rounded-xl border-red-200 bg-red-50 px-4 text-sm text-red-700 shadow-sm hover:bg-red-100"
                >
                  Red İşaretle
                </Button>
              </div>
            </div>

            <div className="grid gap-0 border-t border-slate-200 md:grid-cols-2 lg:grid-cols-4">
              <div className="border-slate-200 px-6 py-4 md:border-r">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">Müşteri</p>
                <p className="mt-1.5 text-sm font-medium text-slate-700">{invoice.customerName}</p>
                <p className="text-xs text-slate-500">{invoice.taxNumber || "Vergi numarası yok"}</p>
              </div>

              <div className="border-slate-200 px-6 py-4 md:border-r lg:border-r">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">Fatura Notu</p>
                <p className="mt-1.5 text-sm font-medium text-slate-700 line-clamp-2">{invoice.note || "—"}</p>
                <p className="text-xs text-slate-500">{invoice.note ? "Not eklendi" : "Not eklenmemiş"}</p>
              </div>
              <div className="border-slate-200 px-6 py-4 md:border-r">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">Oluşturulma</p>
                <p className="mt-1.5 text-sm font-medium text-slate-700">{formatDateTime(invoice.createdAt)}</p>
                <p className="text-xs text-slate-500">{invoice.createdBy}</p>
              </div>
              <div className="px-6 py-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">Son Durum Değişimi</p>
                <p className="mt-1.5 text-sm font-medium text-slate-700">{formatDateTime(invoice.statusChangedAt)}</p>
                <p className="text-xs text-slate-500">{invoice.statusChangedBy}</p>
              </div>
            </div>

            <div className="grid gap-0 border-t border-slate-200 sm:grid-cols-2 lg:grid-cols-4">
              <div className="border-slate-200 px-6 py-4 sm:border-r">
                <div className="space-y-1">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">Fatura Tutarı</p>
                  <p className="text-lg font-bold text-slate-900">{formatMoney(invoice.grandTotal)}</p>
                  <p className="text-xs text-slate-500">{formatMoney(invoice.subTotal)} + {formatMoney(invoice.vatTotal)} KDV</p>
                </div>
              </div>
              <div className="border-slate-200 px-6 py-4 sm:border-r">
                <div className="space-y-1">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">Tahsil Edilen</p>
                  <p className="text-lg font-bold text-emerald-700">{formatMoney(invoice.paidTotal)}</p>
                  <p className="text-xs text-slate-500">{payments.length} eşleşme bulundu</p>
                </div>
              </div>
              <div className="border-slate-200 px-6 py-4 sm:border-r">
                <div className="space-y-1">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">Kalan Bakiye</p>
                  <p className={`text-lg font-bold ${invoice.remainingBalance > 0 ? "text-rose-600" : "text-slate-900"}`}>
                    {formatMoney(invoice.remainingBalance)}
                  </p>
                  <p className="text-xs text-slate-500">{invoice.remainingBalance > 0 ? "Tahsil edilecek" : "Kapandı"}</p>
                </div>
              </div>
              <div className="px-6 py-4">
                <div className="space-y-1">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">Vade / Gecikme</p>
                  <p className={`text-lg font-bold leading-tight ${dueStatus.className.includes("rose") ? "text-rose-600" : dueStatus.className.includes("emerald") ? "text-emerald-700" : dueStatus.className.includes("sky") ? "text-sky-700" : "text-slate-900"}`}>
                    {dueStatus.label}
                  </p>
                  <p className="text-xs text-slate-500">{formatDate(invoice.dueDate)}</p>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        <Tabs defaultValue="cargoes" className="space-y-4">
          <TabsList className="grid h-10 w-full grid-cols-2 rounded-xl border border-slate-200 bg-slate-100 p-0.5">
            <TabsTrigger value="cargoes" className="text-xs">Kargo Kalemleri</TabsTrigger>
            <TabsTrigger value="payments" className="text-xs">Tahsilat ve Eşleşme Geçmişi</TabsTrigger>
          </TabsList>

          <TabsContent value="cargoes">
            <Card className="rounded-2xl border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle>Kargo Kalemleri</CardTitle>
                <CardDescription>Bu faturaya dahil edilen kargolar.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <DataTable
                  columns={cargoColumns}
                  data={cargoRows}
                  onTableReady={setCargoTable}
                  enableHorizontalScroll
                  emptyMessage="Bu faturaya bağlı kargo kalemi bulunamadı."
                />
                {cargoTable && <DataTablePagination table={cargoTable as TanStackTable<unknown>} />}

                <div className="grid gap-3 border-t border-slate-200 pt-4 md:grid-cols-3">
                  <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                    <p className="text-xs font-medium uppercase tracking-[0.14em] text-slate-400">Ara Toplam</p>
                    <p className="mt-1 text-lg font-semibold text-slate-900">{formatMoney(invoice.subTotal)}</p>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                    <p className="text-xs font-medium uppercase tracking-[0.14em] text-slate-400">Toplam KDV</p>
                    <p className="mt-1 text-lg font-semibold text-slate-900">{formatMoney(invoice.vatTotal)}</p>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                    <p className="text-xs font-medium uppercase tracking-[0.14em] text-slate-400">Genel Toplam</p>
                    <p className="mt-1 text-lg font-semibold text-slate-900">{formatMoney(invoice.grandTotal)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments">
            <Card className="rounded-2xl border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle>Tahsilat ve Eşleşme Geçmişi</CardTitle>
                <CardDescription>Bu faturaya ait tahsilatların banka, eşleşme tipi ve dekont bazlı denetim izi.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <DataTable
                  columns={paymentColumns}
                  data={paymentRows}
                  onTableReady={setPaymentTable}
                  emptyMessage="Bu faturaya ait eşleşen tahsilat bulunmuyor."
                />
                {paymentTable && <DataTablePagination table={paymentTable as TanStackTable<unknown>} />}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={matchOpen} onOpenChange={setMatchOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Tahsilat Eşleştir</DialogTitle>
            <DialogDescription>
              {invoice.invoiceNo} numaralı fatura için manuel tahsilat eşleştirmesi yapın.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-2 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="payment-date">Eşleşme Tarihi</Label>
              <Input id="payment-date" type="date" value={matchDate} onChange={(event: ChangeEvent<HTMLInputElement>) => setMatchDate(event.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="payment-amount">Gelen Tutar</Label>
              <Input id="payment-amount" inputMode="decimal" value={matchAmount} onChange={(event: ChangeEvent<HTMLInputElement>) => setMatchAmount(event.target.value)} placeholder="0,00" />
            </div>
            <div className="space-y-1.5">
              <Label>Tahsilat Kanalı</Label>
              <Select value={matchChannel} onValueChange={(value: InvoicePayment["channel"]) => setMatchChannel(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Kanal seçin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="eft">EFT</SelectItem>
                  <SelectItem value="havale">Havale</SelectItem>
                  <SelectItem value="nakit">Nakit</SelectItem>
                  <SelectItem value="mahsup">Mahsup</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="reference-no">Açıklama / Dekont No</Label>
              <Input id="reference-no" value={referenceNo} onChange={(event: ChangeEvent<HTMLInputElement>) => setReferenceNo(event.target.value)} placeholder="Örn: EFT-2026-0401" />
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
            <p>Güncel kalan bakiye: <strong className="text-slate-900">{formatMoney(invoice.remainingBalance)}</strong></p>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setMatchOpen(false)}>
              Vazgeç
            </Button>
            <Button onClick={() => void handleMatchPayment()} disabled={saving || !matchDate || !(parsedMatchAmount > 0)}>
              {saving ? "Kaydediliyor..." : "Tahsilatı Eşleştir"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}