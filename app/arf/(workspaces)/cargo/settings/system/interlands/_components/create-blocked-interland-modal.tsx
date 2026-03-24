"use client"

import type { ChangeEvent } from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { BlockedInterlandPayload } from "../_types"

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreate: (payload: BlockedInterlandPayload) => Promise<void>
}

export function CreateBlockedInterlandModal({ open, onOpenChange, onCreate }: Props) {
  const [city, setCity] = useState("")
  const [district, setDistrict] = useState("")
  const [neighborhood, setNeighborhood] = useState("")
  const [reason, setReason] = useState("")
  const [startsAt, setStartsAt] = useState("")
  const [endsAt, setEndsAt] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const reset = () => {
    setCity("")
    setDistrict("")
    setNeighborhood("")
    setReason("")
    setStartsAt("")
    setEndsAt("")
  }

  const handleSubmit = async () => {
    if (!city.trim() || !district.trim() || !reason.trim() || isSubmitting) {
      return
    }

    setIsSubmitting(true)
    try {
      await onCreate({
        city: city.trim(),
        district: district.trim(),
        neighborhood: neighborhood.trim() || undefined,
        reason: reason.trim(),
        startsAt: startsAt || undefined,
        endsAt: endsAt || undefined,
      })
      reset()
      onOpenChange(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Yasaklı İnterland Oluştur</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-1 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="blocked-city">İl</Label>
            <Input id="blocked-city" value={city} onChange={(event: ChangeEvent<HTMLInputElement>) => setCity(event.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="blocked-district">İlçe</Label>
            <Input id="blocked-district" value={district} onChange={(event: ChangeEvent<HTMLInputElement>) => setDistrict(event.target.value)} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="blocked-neighborhood">Mahalle (Opsiyonel)</Label>
            <Input id="blocked-neighborhood" value={neighborhood} onChange={(event: ChangeEvent<HTMLInputElement>) => setNeighborhood(event.target.value)} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="blocked-reason">Yasaklama Nedeni</Label>
            <Input id="blocked-reason" value={reason} onChange={(event: ChangeEvent<HTMLInputElement>) => setReason(event.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="blocked-start">Başlangıç</Label>
            <Input id="blocked-start" type="date" value={startsAt} onChange={(event: ChangeEvent<HTMLInputElement>) => setStartsAt(event.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="blocked-end">Bitiş</Label>
            <Input id="blocked-end" type="date" value={endsAt} onChange={(event: ChangeEvent<HTMLInputElement>) => setEndsAt(event.target.value)} />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Vazgeç
          </Button>
          <Button type="button" onClick={handleSubmit} disabled={!city.trim() || !district.trim() || !reason.trim() || isSubmitting}>
            {isSubmitting ? "Kaydediliyor..." : "Kaydet"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
