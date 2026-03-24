"use client"

import { useMemo, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import type { Table as TanStackTable } from "@tanstack/react-table"
import {
  DataTable,
  DataTableExcelActions,
  DataTableFacetedFilter,
  DataTablePagination,
  DataTableToolbar,
} from "@hascanb/arf-ui-kit/datatable-kit"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Filter, Package, Clock3, CheckCircle2, TrendingUp } from "lucide-react"
import { cn } from "@/lib/utils"
import { cargoesColumns } from "../_columns/cargoes-columns"
import type { BranchCargoRecord } from "../_types"

function StatCard({
  label,
  value,
  icon: Icon,
  iconClass,
}: {
  label: string
  value: string
  icon: React.ElementType
  iconClass?: string
}) {
  return (
    <Card className="rounded-2xl border-slate-200 bg-white shadow-sm">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-medium tracking-wide text-slate-500">{label}</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">{value}</p>
          </div>
          <div className={cn("rounded-xl p-2.5", iconClass ?? "bg-slate-100")}>
            <Icon className="size-5 text-slate-600" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface Props {
  cargoes: BranchCargoRecord[]
}

export function DetailCargoesSection({ cargoes }: Props) {
  const [table, setTable] = useState<TanStackTable<BranchCargoRecord> | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const currentDirection = searchParams.get("yon") ?? "tumu"

  const updateQuery = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value === "tumu" || value === "all") {
      params.delete(key)
    } else {
      params.set(key, value)
    }
    router.replace(params.size > 0 ? `${pathname}?${params.toString()}` : pathname)
  }

  const filteredCargoes = useMemo(() => {
    if (currentDirection === "tumu") {
      return cargoes
    }
    return cargoes.filter((cargo) => cargo.yon === currentDirection)
  }, [cargoes, currentDirection])

  const statusOptions = useMemo(
    () => [
      { label: "Bekliyor", value: "bekliyor" },
      { label: "Yolda", value: "yolda" },
      { label: "Teslim Edildi", value: "teslim_edildi" },
      { label: "İade", value: "iade" },
      { label: "İptal", value: "iptal" },
    ],
    [],
  )

  const toplamTutar = filteredCargoes.reduce((sum, cargo) => sum + cargo.kargoBedeli, 0)
  const teslimEdildi = filteredCargoes.filter((cargo) => cargo.durum === "teslim_edildi").length
  const beklemede = filteredCargoes.filter((cargo) => cargo.durum === "bekliyor" || cargo.durum === "yolda").length

  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Toplam Kargo" value={String(filteredCargoes.length)} icon={Package} iconClass="bg-slate-100" />
        <StatCard
          label="Toplam Tutar"
          value={new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY", maximumFractionDigits: 0 }).format(toplamTutar)}
          icon={TrendingUp}
          iconClass="bg-blue-50"
        />
        <StatCard label="Teslim Edildi" value={String(teslimEdildi)} icon={CheckCircle2} iconClass="bg-emerald-50" />
        <StatCard label="Beklemede" value={String(beklemede)} icon={Clock3} iconClass="bg-amber-50" />
      </div>

      <Card className="rounded-2xl border-slate-200 bg-white shadow-sm">
        <CardContent className="space-y-4 p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              {[
                { label: "Tümü", value: "tumu" },
                { label: "Gönderici", value: "gonderici" },
                { label: "Alıcı", value: "alici" },
              ].map((item) => (
                <Button
                  key={item.value}
                  type="button"
                  variant={currentDirection === item.value ? "default" : "outline"}
                  size="sm"
                  className="h-8"
                  onClick={() => updateQuery("yon", item.value)}
                >
                  {item.label}
                </Button>
              ))}
            </div>
            {currentDirection !== "tumu" && (
              <Badge variant="outline" className="border-slate-200 bg-slate-50 text-slate-600">
                Aktif filtre: {currentDirection === "gonderici" ? "Gönderici" : "Alıcı"}
              </Badge>
            )}
          </div>

          {table && (
            <div className="flex items-center gap-2">
              {!showFilters && (
                <DataTableExcelActions table={table} filename="sube-kargolari" exportSelected={false} exportLabel="Dışarı Aktar" />
              )}
              <DataTableToolbar table={table} searchKey="takipNo" searchPlaceholder="Takip no ara..." showColumnSelector={!showFilters} viewLabel="Görünüm" columnsLabel="Sütunlar" resetLabel="Sıfırla">
                <Button type="button" variant={showFilters ? "default" : "outline"} size="sm" className="mr-3 h-8" onClick={() => setShowFilters((value) => !value)}>
                  <Filter className="mr-2 size-4" />
                  Filtreleme
                </Button>
              </DataTableToolbar>
            </div>
          )}

          {showFilters && table && (
            <div className="flex flex-wrap gap-2">
              <DataTableFacetedFilter column={table.getColumn("durum")} title="Durum" options={statusOptions} />
            </div>
          )}

          <DataTable columns={cargoesColumns} data={filteredCargoes} onTableReady={setTable} />
          {table && <DataTablePagination table={table as TanStackTable<unknown>} />}
        </CardContent>
      </Card>
    </div>
  )
}
