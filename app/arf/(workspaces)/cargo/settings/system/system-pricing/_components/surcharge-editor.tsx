"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { PriceSurcharge, SurchargeValueType } from "../_types"

interface Props {
  value: PriceSurcharge
  onChange: <K extends keyof PriceSurcharge>(key: K, value: PriceSurcharge[K]) => void
}

export function SurchargeEditor({ value, onChange }: Props) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="space-y-1.5">
        <Label>SMS Bildirim Ücreti (TL)</Label>
        <Input
          type="number"
          step="0.01"
          value={value.smsNotificationFee}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            onChange("smsNotificationFee", Number(event.target.value || 0))
          }
        />
      </div>

      <div className="space-y-1.5">
        <Label>Kapıda Ödeme Komisyon Tipi</Label>
        <Select
          value={value.codCommissionType}
          onValueChange={(next: SurchargeValueType) => onChange("codCommissionType", next)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="fixed">Sabit Tutar (TL)</SelectItem>
            <SelectItem value="percent">Yüzde (%)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label>
          Kapıda Ödeme Komisyonu {value.codCommissionType === "fixed" ? "(TL)" : "(%)"}
        </Label>
        <Input
          type="number"
          step="0.01"
          value={value.codCommissionValue}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            onChange("codCommissionValue", Number(event.target.value || 0))
          }
        />
      </div>

      <div className="space-y-1.5">
        <Label>Adresten Alım Ücreti (TL)</Label>
        <Input
          type="number"
          step="0.01"
          value={value.pickupFee}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => onChange("pickupFee", Number(event.target.value || 0))}
        />
      </div>

      <div className="space-y-1.5 md:col-span-2">
        <Label>Mobil Bölge (Köy/Ada) Ek Teslimat Ücreti (TL)</Label>
        <Input
          type="number"
          step="0.01"
          value={value.remoteAreaDeliveryFee}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            onChange("remoteAreaDeliveryFee", Number(event.target.value || 0))
          }
        />
      </div>
    </div>
  )
}
