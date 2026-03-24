"use client"

import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { PriceDefinitionDetail } from "../../_types"
import { ArrowLeft, Copy, Edit3, Power, PowerOff, Share2, Star } from "lucide-react"

interface Props {
  detail: PriceDefinitionDetail
  onEdit: () => void
  onToggleStatus: () => void
}

export function DetailHeaderCard({ detail, onEdit, onToggleStatus }: Props) {
  const passive = detail.status === "passive"

  return (
    <Card className={cn("sticky top-2 z-20 rounded-2xl border-slate-200 bg-white shadow-sm", passive && "border-red-200 bg-red-50") }>
      <CardContent className="p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex items-start gap-3">
            <Button variant="ghost" size="icon" asChild className="mt-0.5 size-9 rounded-lg border border-slate-200 bg-white shadow-sm">
              <Link href="/arf/cargo/settings/system/system-pricing">
                <ArrowLeft className="size-4" />
              </Link>
            </Button>

            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl font-semibold tracking-tight text-slate-900">Fiyat Detay: {detail.name}</h1>
                <Badge variant="outline" className={cn("border", passive ? "border-red-200 bg-red-50 text-red-700" : "border-emerald-200 bg-emerald-50 text-emerald-700")}>
                  {passive ? "Pasif" : "Aktif"}
                </Badge>
                {detail.isDefault && (
                  <Badge variant="outline" className="border-amber-200 bg-amber-50 text-amber-700">
                    <Star className="mr-1 size-3.5 fill-amber-500 text-amber-500" />
                    Varsayılan
                  </Badge>
                )}
              </div>
              <p className="text-sm text-slate-600">{detail.code} | {detail.type.toUpperCase()} | {detail.ruleCount} kural</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button type="button" variant="outline" size="sm" className="h-9" onClick={() => void navigator.clipboard?.writeText(detail.code)}>
              <Copy className="mr-1.5 size-4" />
              Kod Kopyala
            </Button>
            <Button type="button" variant="outline" size="sm" className="h-9" onClick={() => void navigator.clipboard?.writeText(window.location.href)}>
              <Share2 className="mr-1.5 size-4" />
              Paylaş
            </Button>
            <Button type="button" variant="outline" size="sm" className="h-9" onClick={onToggleStatus}>
              {passive ? <Power className="mr-1.5 size-4" /> : <PowerOff className="mr-1.5 size-4" />}
              {passive ? "Aktif Yap" : "Pasif Yap"}
            </Button>
            <Button type="button" size="sm" className="h-9" onClick={onEdit}>
              <Edit3 className="mr-1.5 size-4" />
              Düzenle
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
