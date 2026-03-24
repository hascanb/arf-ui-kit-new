"use client"

import { useMemo, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import type { Table as TanStackTable } from "@tanstack/react-table"
import {
  DataTable,
  DataTableExcelActions,
  DataTablePagination,
  DataTableToolbar,
} from "@hascanb/arf-ui-kit/datatable-kit"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { BarChart3, Clock3, Download, Package, ReceiptText, TrendingUp, Truck } from "lucide-react"
import { cn } from "@/lib/utils"
import { commissionColumns } from "../_columns/commission-columns"
import type { BranchCommissionRecord, BranchDetail } from "../_types"

function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  iconClass,
}: {
  label: string
  value: string
  sub?: string
  icon: React.ElementType
  iconClass?: string
}) {
  return (
    <Card className="rounded-2xl border-slate-200 bg-white shadow-sm">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-medium tracking-wide text-slate-500">{label}</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">{value}</p>
            {sub ? <p className="mt-1 text-xs text-slate-400">{sub}</p> : null}
          </div>
          <div className={cn("rounded-xl p-2.5", iconClass ?? "bg-slate-100")}>
            <Icon className="size-5 text-slate-600" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function parseDateInput(value: string, endOfDay = false) {
  if (!value) {
    return null
  }
  return new Date(`${value}T${endOfDay ? "23:59:59" : "00:00:00"}`)
}

interface Props {
  branch: BranchDetail
}

export function DetailCommissionSection({ branch }: Props) {
  const [table, setTable] = useState<TanStackTable<BranchCommissionRecord> | null>(null)
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const from = searchParams.get("from") ?? ""
  const to = searchParams.get("to") ?? ""
  const type = searchParams.get("tip") ?? "tumu"
  const status = searchParams.get("status") ?? "all"

  const updateQuery = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString())
    Object.entries(updates).forEach(([key, value]) => {
      if (!value || value === "tumu" || value === "all") {
        params.delete(key)
      } else {
        params.set(key, value)
      }
    })
    router.replace(params.size > 0 ? `${pathname}?${params.toString()}` : pathname)
  }

  const filteredRecords = useMemo(() => {
    const fromDate = parseDateInput(from)
    const toDate = parseDateInput(to, true)

    return branch.commissionRecords.filter((record) => {
      const processDate = new Date(record.processDate)
      if (fromDate && processDate < fromDate) {
        return false
      }
      if (toDate && processDate > toDate) {
        return false
      }
      if (type !== "tumu" && record.transactionType !== type) {
        return false
      }
      if (status !== "all" && record.status !== status) {
        return false
      }
      return true
    })
  }, [branch.commissionRecords, from, status, to, type])

  const totalEarning = filteredRecords.reduce((sum, record) => sum + record.netKazanc, 0)
  const pickupTotal = filteredRecords
    .filter((record) => record.transactionType === "alim")
    .reduce((sum, record) => sum + record.netKazanc, 0)
  const deliveryTotal = filteredRecords
    .filter((record) => record.transactionType === "dagitim")
    .reduce((sum, record) => sum + record.netKazanc, 0)
  const pendingAccrual = filteredRecords
    .filter((record) => record.status === "pending")
    .reduce((sum, record) => sum + record.netKazanc, 0)

  const currency = new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" })

  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard label="Dönemlik Toplam Kazanç" value={currency.format(totalEarning)} icon={TrendingUp} iconClass="bg-slate-100" />
        <StatCard label="Alım Hakediş Toplamı" value={currency.format(pickupTotal)} icon={Package} iconClass="bg-blue-50" />
        <StatCard label="Dağıtım Hakediş Toplamı" value={currency.format(deliveryTotal)} icon={Truck} iconClass="bg-violet-50" />
        <StatCard
          label="Aktif Hakediş Modeli"
          value={`Alım %${Math.round((branch.alimHakedisOrani ?? 0) * 100)} / Dağıtım %${Math.round((branch.dagitimHakedisOrani ?? 0) * 100)}`}
          icon={ReceiptText}
          iconClass="bg-amber-50"
        />
        <StatCard label="Onay Bekleyen Tahakkuk" value={currency.format(pendingAccrual)} icon={Clock3} iconClass="bg-emerald-50" />
      </div>

      <Card className="rounded-2xl border-slate-200 bg-white shadow-sm">
        <CardContent className="space-y-4 p-5">
          <div className="grid gap-3 lg:grid-cols-[1fr_1fr_200px_220px_auto]">
            <Input type="date" value={from} onChange={(event: React.ChangeEvent<HTMLInputElement>) => updateQuery({ from: event.target.value })} />
            <Input type="date" value={to} onChange={(event: React.ChangeEvent<HTMLInputElement>) => updateQuery({ to: event.target.value })} />
            <Select value={type} onValueChange={(value: string) => updateQuery({ tip: value })}>
              <SelectTrigger>
                <SelectValue placeholder="İşlem tipi" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tumu">Tümü</SelectItem>
                <SelectItem value="alim">Sadece Alımlar</SelectItem>
                <SelectItem value="dagitim">Sadece Dağıtımlar</SelectItem>
              </SelectContent>
            </Select>
            <Select value={status} onValueChange={(value: string) => updateQuery({ status: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Durum" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tümü</SelectItem>
                <SelectItem value="confirmed">Kesinleşti</SelectItem>
                <SelectItem value="pending">İşlemde</SelectItem>
                <SelectItem value="cancelled">İptal</SelectItem>
              </SelectContent>
            </Select>
            <Button type="button" variant="outline" className="h-9">
              <Download className="mr-2 size-4" />
              Hakediş Raporu Oluştur
            </Button>
          </div>

          {table && (
            <div className="flex items-center gap-2">
              <DataTableExcelActions table={table} filename="sube-hakedis-detay" exportSelected={false} exportLabel="Dışarı Aktar" />
              <DataTableToolbar table={table} searchKey="trackingNo" searchPlaceholder="Takip no ara..." viewLabel="Görünüm" columnsLabel="Sütunlar" resetLabel="Sıfırla" />
            </div>
          )}

          <DataTable columns={commissionColumns} data={filteredRecords} onTableReady={setTable} />
          {table && <DataTablePagination table={table as TanStackTable<unknown>} />}
        </CardContent>
      </Card>
    </div>
  )
}
