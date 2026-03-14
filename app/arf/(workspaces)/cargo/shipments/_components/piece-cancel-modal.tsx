"use client"

import { useState } from "react"
import { Ban, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

type PieceCancelModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  pieceNos: string[]
  category?: string
  onCategoryChange?: (value: string) => void
  reason: string
  onReasonChange: (value: string) => void
  note: string
  onNoteChange: (value: string) => void
  onConfirm: () => void
  confirmLabel?: string
}

const getPiecePreview = (pieceNos: string[]) => {
  if (pieceNos.length === 0) {
    return "-"
  }

  const firstFive = pieceNos.slice(0, 5).join(", ")

  if (pieceNos.length <= 5) {
    return firstFive
  }

  return `${firstFive} +${pieceNos.length - 5} daha`
}

export function PieceCancelModal({
  open,
  onOpenChange,
  pieceNos,
  category,
  onCategoryChange,
  reason,
  onReasonChange,
  note,
  onNoteChange,
  onConfirm,
  confirmLabel = "Parça İptal",
}: PieceCancelModalProps) {
  const [localCategory, setLocalCategory] = useState("operasyonel")

  if (!open) {
    return null
  }

  const categoryValue = category ?? localCategory
  const handleCategoryChange = (value: string) => {
    if (onCategoryChange) {
      onCategoryChange(value)
      return
    }

    setLocalCategory(value)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-[2px]">
      <div className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <h3 className="text-lg font-semibold text-slate-900">Parça İptal</h3>
          <Button type="button" variant="ghost" size="icon" className="size-8" onClick={() => onOpenChange(false)}>
            <X className="size-4" />
          </Button>
        </div>

        <div className="space-y-4 p-5">
          <div className="rounded-xl border border-rose-200 bg-rose-50 p-2.5">
            <p className="text-xs text-rose-600">Bu işlem seçili parçaları iptal eder ve geri alınamaz.</p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-2.5">
            <p className="text-xs text-slate-500">Seçili Parça Adeti</p>
            <p className="mt-1 text-sm font-semibold text-slate-900">{pieceNos.length || 0}</p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-2.5">
            <p className="text-xs text-slate-500">Parça Numaraları</p>
            <p className="mt-1 text-sm font-semibold text-slate-900">{getPiecePreview(pieceNos)}</p>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-1">
              <p className="text-xs text-slate-500">Kategori</p>
              <Select value={categoryValue} onValueChange={handleCategoryChange}>
                <SelectTrigger className="h-11 rounded-xl border-slate-200 bg-white">
                  <SelectValue placeholder="Kategori seçin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="operasyonel">Operasyonel</SelectItem>
                  <SelectItem value="musteri">Müşteri</SelectItem>
                  <SelectItem value="hasar">Hasar</SelectItem>
                  <SelectItem value="diger">Diğer</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <p className="text-xs text-slate-500">İptal Nedeni</p>
              <Select value={reason} onValueChange={onReasonChange}>
                <SelectTrigger className="h-11 rounded-xl border-slate-200 bg-white">
                  <SelectValue placeholder="Sebep seçin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="musteri_talebi">Müşteri talebi</SelectItem>
                  <SelectItem value="yanlis_parca_kaydi">Yanlış parça kaydı</SelectItem>
                  <SelectItem value="teslimat_imkansiz">Teslimat koşulu sağlanamadı</SelectItem>
                  <SelectItem value="hasarli_parca">Parça hasarlı / kullanılamaz</SelectItem>
                  <SelectItem value="diger_sebep">Diğer sebep</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-xs text-slate-500">Açıklama</p>
            <Textarea
              value={note}
              onChange={(event) => onNoteChange(event.target.value)}
              placeholder="Parça iptal detayını yazın..."
              className="min-h-24 rounded-xl border-slate-200 bg-white text-sm"
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Vazgeç
            </Button>
            <Button type="button" className="bg-rose-600 text-white hover:bg-rose-700" onClick={onConfirm}>
              <Ban className="size-4" />
              {confirmLabel}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
