"use client"

import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { ArrowLeft, Edit3, Power, PowerOff, Share2 } from "lucide-react"
import type { InterlandDetail } from "../../_types"

interface Props {
  interland: InterlandDetail
  onToggleStatus: () => void
  onEdit: () => void
}

export function DetailHeaderCard({ interland, onToggleStatus, onEdit }: Props) {
  const isPassive = interland.status === "passive"

  return (
    <Card className={cn("sticky top-2 z-20 rounded-2xl border-slate-200 bg-white shadow-sm", isPassive && "border-red-300 bg-[#FEE2E2]")}>
      <CardContent className="p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex items-start gap-3">
            <Button variant="ghost" size="icon" asChild className="mt-0.5 size-9 rounded-lg border border-slate-200 bg-white shadow-sm">
              <Link href="/arf/cargo/settings/system/interlands">
                <ArrowLeft className="size-4" />
              </Link>
            </Button>
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl font-semibold tracking-tight text-slate-900">İnterland Detay: {interland.name}</h1>
                <Badge variant="outline" className={cn("border", isPassive ? "border-red-200 bg-red-50 text-red-700" : "border-emerald-200 bg-emerald-50 text-emerald-700")}>
                  {isPassive ? "Pasif" : "Aktif"}
                </Badge>
              </div>
              <p className="text-sm text-slate-600">
                İnterland Adı: <span className="font-medium">{interland.name}</span> | Bağlı Şube: <span className="font-medium">{interland.branchName}</span>
              </p>
              {isPassive && <p className="text-xs font-medium text-red-700">Bu interland pasif durumda. Operasyon buraya yeni kargo yönlendirmemelidir.</p>}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button type="button" variant="outline" size="sm" className="h-9" onClick={() => void navigator.clipboard?.writeText(window.location.href)}>
              <Share2 className="mr-1.5 size-4" />
              Paylaş
            </Button>
            <Button type="button" variant="outline" size="sm" className="h-9" onClick={onToggleStatus}>
              {isPassive ? <Power className="mr-1.5 size-4" /> : <PowerOff className="mr-1.5 size-4" />}
              {isPassive ? "Aktif Yap" : "Pasif Yap"}
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
