"use client"

import { ArrowRightLeft, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

type ShipmentHandoverModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  trackingNo: string
  receiverBranch: string
  reason: string
  onReasonChange: (value: string) => void
  note: string
  onNoteChange: (value: string) => void
  onConfirm: () => void
}

export function ShipmentHandoverModal({
  open,
  onOpenChange,
  trackingNo,
  receiverBranch,
  reason,
  onReasonChange,
  note,
  onNoteChange,
  onConfirm,
}: ShipmentHandoverModalProps) {
  if (!open) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-[2px]">
      <div className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <h3 className="text-lg font-semibold text-slate-900">Kargoyu Devret</h3>
          <Button type="button" variant="ghost" size="icon" className="size-8" onClick={() => onOpenChange(false)}>
            <X className="size-4" />
          </Button>
        </div>

        <div className="space-y-4 p-5">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-2.5">
            <p className="text-xs text-slate-500">Takip No</p>
            <p className="mt-1 text-sm font-semibold text-slate-900">{trackingNo || "-"}</p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-2.5">
            <p className="text-xs text-slate-500">Devredilecek Şube</p>
            <p className="mt-1 text-sm font-semibold text-slate-900">{receiverBranch || "-"}</p>
            <p className="mt-1 text-xs text-slate-500">Devir işlemi kurye tarafından alıcı şubeye yapılır.</p>
          </div>

          <div className="space-y-1">
            <p className="text-xs text-slate-500">Devir Nedeni</p>
            <Select value={reason} onValueChange={onReasonChange}>
              <SelectTrigger className="h-11 rounded-xl border-slate-200 bg-white">
                <SelectValue placeholder="Sebep seçin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="musteri_adreste_degil">Müşteri adreste değil</SelectItem>
                <SelectItem value="musteriye_ulasilamiyor">Müşteriye ulaşılamıyor</SelectItem>
                <SelectItem value="diger_sebep">Diğer sebep</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <p className="text-xs text-slate-500">Açıklama (Opsiyonel)</p>
            <Textarea
              value={note}
              onChange={(event) => onNoteChange(event.target.value)}
              placeholder="Devretme ile ilgili kısa not ekleyin..."
              className="min-h-24 rounded-xl border-slate-200 bg-white text-sm"
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Vazgeç
            </Button>
            <Button type="button" onClick={onConfirm}>
              <ArrowRightLeft className="size-4" />
              Devret
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
