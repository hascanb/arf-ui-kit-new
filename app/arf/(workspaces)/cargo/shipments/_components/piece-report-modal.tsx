"use client"

import { AlertTriangle, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

type PieceReportModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  pieceNos: string[]
  reason: string
  onReasonChange: (value: string) => void
  description: string
  onDescriptionChange: (value: string) => void
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

export function PieceReportModal({
  open,
  onOpenChange,
  pieceNos,
  reason,
  onReasonChange,
  description,
  onDescriptionChange,
  onConfirm,
  confirmLabel = "İhbarı Kaydet",
}: PieceReportModalProps) {
  if (!open) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-[2px]">
      <div className="w-full max-w-3xl rounded-2xl border border-slate-200 bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <h3 className="text-lg font-semibold text-slate-900">Parça İhbar Et</h3>
          <Button type="button" variant="ghost" size="icon" className="size-8" onClick={() => onOpenChange(false)}>
            <X className="size-4" />
          </Button>
        </div>

        <div className="space-y-4 p-5">
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
              <p className="text-xs text-slate-500">İhbar Nedeni</p>
              <Select value={reason} onValueChange={onReasonChange}>
                <SelectTrigger className="h-11 rounded-xl border-slate-200 bg-white">
                  <SelectValue placeholder="Sebep seçin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hasarli_kargo">Hasarlı Kargo</SelectItem>
                  <SelectItem value="yanlis_urun">Yanlış Ürün</SelectItem>
                  <SelectItem value="eksik_hatali_evrak">Eksik/Hatalı Evrak</SelectItem>
                  <SelectItem value="saskin_kargo">Şaşkın Kargo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <p className="text-xs text-slate-500">Kanıt Görseli</p>
              <Input type="file" accept="image/*" className="h-10 rounded-xl border-slate-200 bg-white" />
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-xs text-slate-500">Açıklama</p>
            <Textarea
              value={description}
              onChange={(event) => onDescriptionChange(event.target.value)}
              placeholder="İhbar detayını yazın..."
              className="min-h-28 rounded-xl border-slate-200 bg-white text-sm"
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Vazgeç
            </Button>
            <Button type="button" className="bg-rose-600 text-white hover:bg-rose-700" onClick={onConfirm}>
              <AlertTriangle className="size-4" />
              {confirmLabel}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
