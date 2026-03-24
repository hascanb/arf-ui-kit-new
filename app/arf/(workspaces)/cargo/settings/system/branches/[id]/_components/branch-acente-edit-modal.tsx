"use client"

import type { ChangeEvent } from "react"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { BranchDetail } from "../_types"

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  value: Pick<
    BranchDetail,
    | "vergiDairesi"
    | "vkn"
    | "acenteSahibi"
    | "acenteSahibiTelefon"
    | "acenteSahibiEposta"
    | "acenteYoneticisi"
    | "acenteYoneticisiTelefon"
    | "bankAdi"
    | "iban"
    | "hesapSahibi"
  >
  onSave: (
    value: Pick<
      BranchDetail,
      | "vergiDairesi"
      | "vkn"
      | "acenteSahibi"
      | "acenteSahibiTelefon"
      | "acenteSahibiEposta"
      | "acenteYoneticisi"
      | "acenteYoneticisiTelefon"
      | "bankAdi"
      | "iban"
      | "hesapSahibi"
    >,
  ) => void
}

export function BranchAcenteEditModal({ open, onOpenChange, value, onSave }: Props) {
  const [form, setForm] = useState(value)

  useEffect(() => {
    setForm(value)
  }, [value, open])

  const updateField = (key: keyof typeof form, nextValue: string) => {
    setForm((prev) => ({ ...prev, [key]: nextValue }))
  }

  const handleInputChange = (key: keyof typeof form) => (event: ChangeEvent<HTMLInputElement>) => {
    updateField(key, event.target.value)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Acente Bilgilerini Düzenle</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-2 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="agency-tax-office">Vergi Dairesi</Label>
            <Input id="agency-tax-office" value={form.vergiDairesi ?? ""} onChange={handleInputChange("vergiDairesi")} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="agency-vkn">VKN</Label>
            <Input id="agency-vkn" value={form.vkn ?? ""} onChange={handleInputChange("vkn")} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="agency-owner">Acente Sahibi</Label>
            <Input id="agency-owner" value={form.acenteSahibi ?? ""} onChange={handleInputChange("acenteSahibi")} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="agency-owner-phone">Sahibi Telefon</Label>
            <Input id="agency-owner-phone" value={form.acenteSahibiTelefon ?? ""} onChange={handleInputChange("acenteSahibiTelefon")} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="agency-owner-email">Sahibi E-posta</Label>
            <Input id="agency-owner-email" value={form.acenteSahibiEposta ?? ""} onChange={handleInputChange("acenteSahibiEposta")} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="agency-manager">Acente Yöneticisi</Label>
            <Input id="agency-manager" value={form.acenteYoneticisi ?? ""} onChange={handleInputChange("acenteYoneticisi")} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="agency-manager-phone">Yönetici Telefon</Label>
            <Input id="agency-manager-phone" value={form.acenteYoneticisiTelefon ?? ""} onChange={handleInputChange("acenteYoneticisiTelefon")} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="agency-bank">Banka</Label>
            <Input id="agency-bank" value={form.bankAdi ?? ""} onChange={handleInputChange("bankAdi")} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="agency-account-holder">Hesap Sahibi</Label>
            <Input id="agency-account-holder" value={form.hesapSahibi ?? ""} onChange={handleInputChange("hesapSahibi")} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="agency-iban">IBAN</Label>
            <Input id="agency-iban" value={form.iban ?? ""} onChange={handleInputChange("iban")} />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Vazgeç
          </Button>
          <Button
            type="button"
            onClick={() => {
              onSave(form)
              onOpenChange(false)
            }}
          >
            Kaydet
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
