"use client"

import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { Banknote, ArrowDownToLine, ArrowUpFromLine, Clock, AlertCircle } from "lucide-react"
import type { BranchEntitlementSummary } from "../_types"

interface Props {
  summary: BranchEntitlementSummary
}

function formatMoney(value: number): string {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

const cards = [
  {
    key: "toplamHakedis" as const,
    label: "Toplam Hakediş",
    icon: Banknote,
    iconWrapClass: "bg-primary/12 text-secondary border-secondary/25",
    valueClass: "text-foreground",
    format: (s: BranchEntitlementSummary) => formatMoney(s.toplamHakedis),
  },
  {
    key: "alimHakedisTotal" as const,
    label: "Alım Hakediş Toplamı",
    icon: ArrowDownToLine,
    iconWrapClass: "bg-primary/12 text-secondary border-secondary/25",
    valueClass: "text-foreground",
    format: (s: BranchEntitlementSummary) => formatMoney(s.alimHakedisTotal),
  },
  {
    key: "dagitimHakedisTotal" as const,
    label: "Dağıtım Hakediş Toplamı",
    icon: ArrowUpFromLine,
    iconWrapClass: "bg-primary/12 text-secondary border-secondary/25",
    valueClass: "text-foreground",
    format: (s: BranchEntitlementSummary) => formatMoney(s.dagitimHakedisTotal),
  },
  {
    key: "teslimatiBeklenen" as const,
    label: "Teslimatı Beklenen",
    icon: Clock,
    iconWrapClass: "bg-amber-50 text-amber-600 border-amber-200",
    valueClass: "text-amber-700",
    format: (s: BranchEntitlementSummary) => formatMoney(s.teslimatiBeklenen),
  },
  {
    key: "onayBekleyen" as const,
    label: "Onay Bekleyen",
    icon: AlertCircle,
    iconWrapClass: "bg-red-50 text-red-600 border-red-200",
    valueClass: "text-red-600",
    format: (s: BranchEntitlementSummary) => formatMoney(s.onayBekleyen),
  },
]

export function BranchEntitlementSummaryCards({ summary }: Props) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
      {cards.map((card) => (
        <Card key={card.key} className="rounded-2xl border-slate-200/80 bg-white shadow-none">
          <CardContent className="p-2">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[11px] font-medium tracking-wide text-slate-500">{card.label}</p>
                <p className={cn("mt-1 text-xl font-semibold tabular-nums leading-tight", card.valueClass)}>
                  {card.format(summary)}
                </p>
              </div>
              <div className={cn("flex size-8 shrink-0 items-center justify-center rounded-xl border", card.iconWrapClass)}>
                <card.icon className="size-4" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
