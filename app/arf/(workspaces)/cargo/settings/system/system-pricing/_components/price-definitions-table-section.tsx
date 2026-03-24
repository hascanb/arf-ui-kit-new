"use client"

import { useMemo, useState, type ChangeEvent } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import type { Table as TanStackTable } from "@tanstack/react-table"
import { DataTable, DataTablePagination } from "@hascanb/arf-ui-kit/datatable-kit"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  clonePricingDefinition,
  createPricingDefinition,
  exportPricingDefinition,
  fetchPricingDefinitionDetail,
  setPricingDefinitionStatus,
  updatePricingDefinition,
  type UpsertPriceDefinitionInput,
} from "../_api/price-definitions-api"
import { getPriceDefinitionsListColumns } from "../_columns/price-definitions-list-columns"
import type { PriceDefinitionDetail, PriceDefinitionRecord } from "../_types"
import { CreatePriceDefinitionModal } from "./create-price-definition-modal"

interface Props {
  data: PriceDefinitionRecord[]
}

function isExpired(validTo: string): boolean {
  return validTo < new Date().toISOString().slice(0, 10)
}

function matchesSearch(row: PriceDefinitionRecord, query: string): boolean {
  const normalized = query.toLocaleLowerCase("tr-TR")
  return `${row.name} ${row.code}`.toLocaleLowerCase("tr-TR").includes(normalized)
}

function toRecord(detail: PriceDefinitionDetail): PriceDefinitionRecord {
  return {
    id: detail.id,
    code: detail.code,
    name: detail.name,
    type: detail.type,
    isDefault: detail.isDefault,
    validFrom: detail.validFrom,
    validTo: detail.validTo,
    status: detail.status,
    ruleCount: detail.rules.length,
    createdAt: detail.createdAt,
    updatedAt: detail.updatedAt,
    createdBy: detail.createdBy,
    createdByName: detail.createdByName,
  }
}

export function PriceDefinitionsTableSection({ data }: Props) {
  const [rows, setRows] = useState<PriceDefinitionRecord[]>(data)
  const [table, setTable] = useState<TanStackTable<PriceDefinitionRecord> | null>(null)
  const [createOpen, setCreateOpen] = useState(false)
  const [editingDetail, setEditingDetail] = useState<PriceDefinitionDetail | undefined>(undefined)
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const q = searchParams.get("q") ?? ""
  const status = searchParams.get("status") ?? "all"
  const type = searchParams.get("type") ?? "all"
  const isDefault = searchParams.get("isDefault") ?? "all"

  const setParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (!value || value === "all") {
      params.delete(key)
    } else {
      params.set(key, value)
    }
    router.replace(params.size > 0 ? `${pathname}?${params.toString()}` : pathname)
  }

  const filtered = useMemo(() => {
    return rows.filter((row) => {
      if (q && !matchesSearch(row, q)) {
        return false
      }
      if (status !== "all" && row.status !== status) {
        return false
      }
      if (type !== "all" && row.type !== type) {
        return false
      }
      if (isDefault !== "all") {
        const required = isDefault === "true"
        if (row.isDefault !== required) {
          return false
        }
      }
      return true
    })
  }, [isDefault, q, rows, status, type])

  const columns = useMemo(
    () =>
      getPriceDefinitionsListColumns({
        onEdit: async (id) => {
          const detail = await fetchPricingDefinitionDetail(id)
          if (!detail) {
            return
          }
          setEditingDetail(detail)
          setCreateOpen(true)
        },
        onClone: async (id) => {
          const cloned = await clonePricingDefinition(id)
          if (!cloned) {
            return
          }
          setRows((prev) => [toRecord(cloned), ...prev])
        },
        onExport: async (id, format) => {
          const result = await exportPricingDefinition(id, format)
          window.alert(`Dışa aktarma hazır: ${result.url}`)
        },
        onToggleStatus: async (row) => {
          const next = row.status === "active" ? "passive" : "active"
          const updated = await setPricingDefinitionStatus(row.id, next)
          if (!updated) {
            return
          }
          setRows((prev) => prev.map((item) => (item.id === row.id ? toRecord(updated) : item)))
        },
      }),
    [],
  )

  const onSubmit = async (payload: UpsertPriceDefinitionInput & { id?: string }) => {
    if (payload.id) {
      const updated = await updatePricingDefinition(payload.id, payload)
      if (updated) {
        setRows((prev) => prev.map((item) => (item.id === updated.id ? toRecord(updated) : item)))
      }
      return
    }

    const created = await createPricingDefinition(payload)
    setRows((prev) => [toRecord(created), ...prev])
  }

  return (
    <div className="space-y-4">
      <CreatePriceDefinitionModal
        open={createOpen}
        onOpenChange={(open) => {
          setCreateOpen(open)
          if (!open) {
            setEditingDetail(undefined)
          }
        }}
        initialValue={editingDetail}
        onSubmit={onSubmit}
      />

      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:flex-row lg:items-center lg:justify-between">
        <div className="grid flex-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
          <Input value={q} onChange={(event: ChangeEvent<HTMLInputElement>) => setParam("q", event.target.value)} placeholder="Tarife adı veya kod ara..." />

          <Select value={status} onValueChange={(value: string) => setParam("status", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Durum" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tüm Durumlar</SelectItem>
              <SelectItem value="active">Aktif</SelectItem>
              <SelectItem value="passive">Pasif</SelectItem>
            </SelectContent>
          </Select>

          <Select value={type} onValueChange={(value: string) => setParam("type", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Tarife Tipi" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tüm Tipler</SelectItem>
              <SelectItem value="b2b">B2B</SelectItem>
              <SelectItem value="b2c">B2C</SelectItem>
            </SelectContent>
          </Select>

          <Select value={isDefault} onValueChange={(value: string) => setParam("isDefault", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Varsayılan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tümü</SelectItem>
              <SelectItem value="true">Sadece Default</SelectItem>
              <SelectItem value="false">Default Olmayanlar</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button type="button" variant="outline" onClick={() => router.replace(pathname)}>
            Filtreleri Sıfırla
          </Button>
          <Button type="button" onClick={() => setCreateOpen(true)}>
            Fiyat Oluştur
          </Button>
        </div>
      </div>

      <DataTable
        data={filtered}
        columns={columns}
        onTableReady={setTable}
        className="rounded-2xl border border-slate-200 bg-white shadow-sm"
        tableClassName="[&_tr[data-state=selected]]:bg-transparent"
      />

      <div className="text-xs text-slate-500">
        Not: Geçerlilik süresi dolmuş tarifeler gri görünümde listelenir ve önerilen kullanım dışıdır.
      </div>

      {table && <DataTablePagination table={table as TanStackTable<unknown>} />}

      <div className="hidden">
        {filtered.some((item) => isExpired(item.validTo)) ? "expired-present" : "no-expired"}
      </div>
    </div>
  )
}
