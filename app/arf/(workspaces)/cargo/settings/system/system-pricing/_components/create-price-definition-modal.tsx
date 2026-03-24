"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui"
import type { UpsertPriceDefinitionInput } from "../_api/price-definitions-api"
import type { PriceDefinitionDetail } from "../_types"
import { PriceDefinitionWizard } from "./price-definition-wizard"

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialValue?: PriceDefinitionDetail
  onSubmit: (payload: UpsertPriceDefinitionInput & { id?: string }) => Promise<void>
}

export function CreatePriceDefinitionModal({ open, onOpenChange, initialValue, onSubmit }: Props) {
  const isEdit = Boolean(initialValue)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] max-w-6xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Fiyat Tarifesini Düzenle" : "Fiyat Oluştur"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Tarife kimliği, barem matrisi ve ek hizmet kalemlerini güncelleyin."
              : "3 adımlı sihirbaz ile yeni fiyat tarifesi oluşturun."}
          </DialogDescription>
        </DialogHeader>

        <PriceDefinitionWizard
          title={isEdit ? "Tarife Güncelleme Sihirbazı" : "Tarife Oluşturma Sihirbazı"}
          submitLabel={isEdit ? "Güncelle" : "Kaydet"}
          submittingLabel={isEdit ? "Güncelleniyor..." : "Kaydediliyor..."}
          initialValue={initialValue}
          onCancel={() => onOpenChange(false)}
          onSubmit={async (payload) => {
            await onSubmit(payload)
            onOpenChange(false)
          }}
        />
      </DialogContent>
    </Dialog>
  )
}
