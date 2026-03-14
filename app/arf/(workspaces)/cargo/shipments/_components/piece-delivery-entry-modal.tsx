"use client"

import type { ChangeEvent } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X } from "lucide-react"

type PieceDeliveryEntryModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  pieceNos: string[]
  firstName: string
  onFirstNameChange: (value: string) => void
  lastName: string
  onLastNameChange: (value: string) => void
  phone: string
  onPhoneChange: (value: string) => void
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

export function PieceDeliveryEntryModal({
  open,
  onOpenChange,
  pieceNos,
  firstName,
  onFirstNameChange,
  lastName,
  onLastNameChange,
  phone,
  onPhoneChange,
  onConfirm,
  confirmLabel = "Kaydet",
}: PieceDeliveryEntryModalProps) {
  if (!open) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-[2px]">
      <div className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <h3 className="text-lg font-semibold text-slate-900">Teslimat Bilgisi Al</h3>
          <Button type="button" variant="ghost" size="icon" className="size-8" onClick={() => onOpenChange(false)}>
            <X className="size-4" />
          </Button>
        </div>

        <div className="space-y-4 p-5">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-2.5">
            <p className="text-xs text-slate-500">Seçili Parça Adedi</p>
            <p className="mt-1 text-sm font-semibold text-slate-900">{pieceNos.length || 0}</p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-2.5">
            <p className="text-xs text-slate-500">Parça Noları</p>
            <p className="mt-1 text-sm font-semibold text-slate-900">{getPiecePreview(pieceNos)}</p>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-1">
              <p className="text-xs text-slate-500">Ad</p>
              <Input
                value={firstName}
                onChange={(event: ChangeEvent<HTMLInputElement>) => onFirstNameChange(event.target.value)}
                placeholder="Ad"
                className="h-9"
              />
            </div>
            <div className="space-y-1">
              <p className="text-xs text-slate-500">Soyad</p>
              <Input
                value={lastName}
                onChange={(event: ChangeEvent<HTMLInputElement>) => onLastNameChange(event.target.value)}
                placeholder="Soyad"
                className="h-9"
              />
            </div>
            <div className="space-y-1 md:col-span-2">
              <p className="text-xs text-slate-500">Telefon Numarası</p>
              <Input
                value={phone}
                onChange={(event: ChangeEvent<HTMLInputElement>) => onPhoneChange(event.target.value)}
                placeholder="05xx xxx xx xx"
                className="h-9"
              />
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
            <p className="text-xs text-slate-500">Resim</p>
            <div className="mt-2 max-w-sm">
              <Input type="file" accept="image/*" className="h-9 bg-white" />
            </div>
          </div>

          <p className="text-xs text-slate-500">Kaydet ile girilen teslimat bilgileri seçili parçaların tamamına uygulanır.</p>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Vazgeç
            </Button>
            <Button type="button" onClick={onConfirm}>
              {confirmLabel}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
