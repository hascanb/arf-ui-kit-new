import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { Building2, CheckCircle2, PowerOff, Star, Truck } from "lucide-react"
import type { SupplierListKpi } from "../_types"

interface Props {
  kpi: SupplierListKpi
}

const ITEMS: Array<{
  key: keyof SupplierListKpi
  label: string
  icon: React.ComponentType<{ className?: string }>
}> = [
  { key: "total", label: "Toplam Tedarikçi", icon: Building2 },
  { key: "ozmal", label: "Özmal (Şirket İçi)", icon: Star },
  { key: "active", label: "Aktif", icon: CheckCircle2 },
  { key: "passive", label: "Pasif", icon: PowerOff },
  { key: "logistics", label: "Lojistik Firması", icon: Truck },
]

export function SuppliersKpiCards({ kpi }: Props) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
      {ITEMS.map((item) => (
        <Card key={item.key} className="rounded-2xl border-slate-200/80 bg-white shadow-none">
          <CardContent className="p-2">
            <div className="flex items-center gap-3 p-2">
              <div
                className={cn(
                  "flex size-10 shrink-0 items-center justify-center rounded-xl border",
                  "bg-primary/12 text-secondary border-secondary/25"
                )}
              >
                <item.icon className="size-5" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-xs text-slate-500">{item.label}</p>
                <p className="text-xl font-semibold text-foreground">{kpi[item.key]}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
