"use client"

import { useEffect, useMemo, useState, type ChangeEvent } from "react"

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import type {
  CreateInvoicePayload,
  InvoiceCustomerInfo,
  OpenCargoRecord,
} from "../_types/financial"

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY", minimumFractionDigits: 2 }).format(value)

const toDateInputValue = (date: Date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

const addDays = (dateText: string, days: number) => {
  const date = new Date(`${dateText}T00:00:00`)
  date.setDate(date.getDate() + days)
  return toDateInputValue(date)
}

export function CreateInvoiceModal({
  open,
  onOpenChange,
  selectedCargos,
  customerInfo,
  onConfirm,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedCargos: OpenCargoRecord[]
  customerInfo: InvoiceCustomerInfo
  onConfirm: (payload: CreateInvoicePayload) => void
}) {
  const [invoiceName, setInvoiceName] = useState("")
  const [issueDate, setIssueDate] = useState("")
  const [dueDate, setDueDate] = useState("")
  const [duePreset, setDuePreset] = useState("7")
  const [note, setNote] = useState("")

  const subTotal = useMemo(
    () =>
      selectedCargos.reduce(
        (acc, cargo) => acc + (cargo.baseAmount ?? Number((cargo.amount / 1.2).toFixed(2))),
        0,
      ),
    [selectedCargos],
  )

  const vatTotal = useMemo(
    () =>
      selectedCargos.reduce((acc, cargo) => {
        if (typeof cargo.vat === "number") {
          return acc + cargo.vat
        }

        const fallbackBase = cargo.baseAmount ?? Number((cargo.amount / 1.2).toFixed(2))
        return acc + (cargo.amount - fallbackBase)
      }, 0),
    [selectedCargos],
  )

  const grandTotal = useMemo(() => subTotal + vatTotal, [subTotal, vatTotal])

  useEffect(() => {
    if (!open) return

    const today = toDateInputValue(new Date())
    setIssueDate(today)
    setDuePreset("7")
    setDueDate(addDays(today, 7))
    setNote("")
    setInvoiceName(`${customerInfo.tradeName} - ${selectedCargos.length} Kargo Faturası`)
  }, [open, customerInfo.tradeName, selectedCargos.length])

  const customerTypeLabel = customerInfo.customerType === "corporate" ? "Kurumsal" : "Bireysel"

  const handlePresetChange = (value: string) => {
    setDuePreset(value)
    if (issueDate) {
      setDueDate(addDays(issueDate, Number(value)))
    }
  }

  const handleIssueDateChange = (value: string) => {
    setIssueDate(value)
    if (duePreset) {
      setDueDate(addDays(value, Number(duePreset)))
    }
  }

  const handleConfirm = () => {
    onConfirm({
      invoiceName,
      issueDate,
      dueDate,
      note,
      subTotal,
      vatTotal,
      grandTotal,
    })
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
        <AlertDialogHeader>
          <AlertDialogTitle>Fatura Oluştur</AlertDialogTitle>
        </AlertDialogHeader>

        <div className="space-y-4">
          <div className="grid gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3 md:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Müşteri Tipi</Label>
              <Input value={customerTypeLabel} disabled readOnly />
            </div>
            <div className="space-y-1.5">
              <Label>Şirket Ünvanı</Label>
              <Input value={customerInfo.tradeName} disabled readOnly />
            </div>
            <div className="space-y-1.5">
              <Label>Vergi Dairesi</Label>
              <Input value={customerInfo.taxOffice} disabled readOnly />
            </div>
            <div className="space-y-1.5">
              <Label>Vergi No</Label>
              <Input value={customerInfo.taxNumber} disabled readOnly />
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-1.5 md:col-span-2">
              <Label>Fatura İsmi</Label>
              <Input
                value={invoiceName}
                onChange={(event: ChangeEvent<HTMLInputElement>) => setInvoiceName(event.target.value)}
                placeholder="Fatura ismini giriniz"
              />
            </div>

            <div className="space-y-1.5">
              <Label>Düzenlenme Tarihi</Label>
              <Input
                type="date"
                value={issueDate}
                onChange={(event: ChangeEvent<HTMLInputElement>) => handleIssueDateChange(event.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label>Vade Seçeneği</Label>
              <Select value={duePreset} onValueChange={handlePresetChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Vade seçiniz" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Aynı Gün</SelectItem>
                  <SelectItem value="7">7 Gün</SelectItem>
                  <SelectItem value="14">14 Gün</SelectItem>
                  <SelectItem value="30">30 Gün</SelectItem>
                  <SelectItem value="60">60 Gün</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>Vade Tarihi</Label>
              <Input
                type="date"
                value={dueDate}
                onChange={(event: ChangeEvent<HTMLInputElement>) => setDueDate(event.target.value)}
              />
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <Label>Fatura Notu</Label>
              <Textarea
                value={note}
                onChange={(event: ChangeEvent<HTMLTextAreaElement>) => setNote(event.target.value)}
                placeholder="Faturaya eklenecek not"
                rows={3}
              />
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 p-3">
            <p className="text-sm text-slate-600">
              Seçili <strong>{selectedCargos.length}</strong> kargo için fatura özeti
            </p>
            <div className="mt-3 space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Ara Toplam</span>
                <strong>{formatCurrency(subTotal)}</strong>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Toplam KDV</span>
                <strong>{formatCurrency(vatTotal)}</strong>
              </div>
              <div className="flex items-center justify-between border-t border-slate-200 pt-2 text-base">
                <span>Genel Toplam</span>
                <strong>{formatCurrency(grandTotal)}</strong>
              </div>
            </div>
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel>İptal</AlertDialogCancel>
          <Button onClick={handleConfirm} disabled={!invoiceName || !issueDate || !dueDate}>
            Fatura Oluştur
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
