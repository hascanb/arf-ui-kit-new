"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { PriceSurcharge } from "../../_types"

interface Props {
  surcharges: PriceSurcharge
}

function money(value: number): string {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

export function DetailSurchargesSection({ surcharges }: Props) {
  const codLabel =
    surcharges.codCommissionType === "fixed"
      ? `${money(surcharges.codCommissionValue)}`
      : `%${surcharges.codCommissionValue.toFixed(2)}`

  return (
    <Card className="rounded-2xl border-slate-200 shadow-sm">
      <CardHeader>
        <CardTitle>Ek Hizmetler ve Kesintiler</CardTitle>
        <CardDescription>Tarifeye yansıyan operasyonel ek ücret kalemleri.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3 md:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
          <p className="text-xs text-slate-500">SMS Bildirim Ücreti</p>
          <p className="font-medium text-slate-900">{money(surcharges.smsNotificationFee)}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
          <p className="text-xs text-slate-500">Kapıda Ödeme Komisyonu</p>
          <p className="font-medium text-slate-900">{codLabel}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
          <p className="text-xs text-slate-500">Adresten Alım Ücreti</p>
          <p className="font-medium text-slate-900">{money(surcharges.pickupFee)}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
          <p className="text-xs text-slate-500">Mobil Bölge Ek Teslimat</p>
          <p className="font-medium text-slate-900">{money(surcharges.remoteAreaDeliveryFee)}</p>
        </div>
      </CardContent>
    </Card>
  )
}
