"use client"

import { useEffect, useMemo, useState, type ChangeEvent } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import type { OnChangeFn, PaginationState, Table as TanStackTable } from "@tanstack/react-table"
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
  createDistanceDefinition,
  deleteDistanceDefinition,
  setDistanceDefinitionStatus,
  updateDistanceDefinition,
} from "../_api/distance-definitions-api"
import { getDistanceDefinitionsListColumns } from "../_columns/distance-definitions-list-columns"
import type { DistanceDefinitionRecord, DistanceSlaTarget } from "../_types"
import { DISTANCE_SLA_LABELS } from "../_types"
import { CreateDistanceDefinitionModal } from "./create-distance-definition-modal"
import { DistanceDefinitionFormModal } from "./distance-definition-form-modal"

interface Props {
  data: DistanceDefinitionRecord[]
}

function normalize(value: string): string {
  return value.toLocaleLowerCase("tr-TR")
}

export function DistanceDefinitionsTableSection({ data }: Props) {
  const [rows, setRows] = useState<DistanceDefinitionRecord[]>([...data].sort((a, b) => a.minKm - b.minKm))
  const [table, setTable] = useState<TanStackTable<DistanceDefinitionRecord> | null>(null)
  const [createOpen, setCreateOpen] = useState(false)
  const [editRow, setEditRow] = useState<DistanceDefinitionRecord | null>(null)

  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const query = searchParams.get("q") ?? ""
  const statusFilter = searchParams.get("status") ?? "all"
  const slaFilter = searchParams.get("sla") ?? "all"
  const pageParam = Number(searchParams.get("page") ?? "0")
  const currentPage = Number.isFinite(pageParam) && pageParam >= 0 ? pageParam : 0

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: currentPage,
    pageSize: 10,
  })

  const filteredRows = useMemo(() => {
    const q = normalize(query.trim())

    return [...rows]
      .filter((row) => {
        if (statusFilter !== "all" && row.status !== statusFilter) return false
        if (slaFilter !== "all" && row.slaTarget !== slaFilter) return false
        if (!q) return true

        const haystack = normalize(`${row.name} ${row.description ?? ""}`)
        return haystack.includes(q)
      })
      .sort((a, b) => a.minKm - b.minKm)
  }, [query, rows, slaFilter, statusFilter])

  const updateQueryParam = (key: string, value: string, resetPage = true) => {
    const params = new URLSearchParams(searchParams.toString())
    if (!value || value === "all") {
      params.delete(key)
    } else {
      params.set(key, value)
    }

    if (resetPage) {
      params.delete("page")
    }

    router.replace(params.size > 0 ? `${pathname}?${params.toString()}` : pathname)
  }

  const handlePaginationChange: OnChangeFn<PaginationState> = (next) => {
    setPagination((prev) => {
      const resolved = typeof next === "function" ? next(prev) : next
      if (resolved.pageIndex === prev.pageIndex && resolved.pageSize === prev.pageSize) {
        return prev
      }

      const params = new URLSearchParams(searchParams.toString())
      if (resolved.pageIndex > 0) {
        params.set("page", String(resolved.pageIndex))
      } else {
        params.delete("page")
      }

      router.replace(params.size > 0 ? `${pathname}?${params.toString()}` : pathname)
      return resolved
    })
  }

  const columns = useMemo(
    () =>
      getDistanceDefinitionsListColumns({
        onEdit: (row) => setEditRow(row),
        onDelete: async (row) => {
          const confirmed = window.confirm(`${row.name} baremi silinecek. Onaylıyor musunuz?`)
          if (!confirmed) return
          await deleteDistanceDefinition(row.id)
          setRows((prev) => prev.filter((item) => item.id !== row.id))
        },
        onToggleStatus: async (row) => {
          const next = row.status === "active" ? "passive" : "active"
          try {
            const updated = await setDistanceDefinitionStatus(row.id, next)
            if (!updated) return
            setRows((prev) => prev.map((item) => (item.id === row.id ? updated : item)))
          } catch (error) {
            window.alert(error instanceof Error ? error.message : "Durum değişikliği kaydedilemedi")
          }
        },
      }),
    [],
  )

  useEffect(() => {
    setRows([...data].sort((a, b) => a.minKm - b.minKm))
  }, [data])

  useEffect(() => {
    setPagination((prev) => {
      if (prev.pageIndex === currentPage) return prev
      return { ...prev, pageIndex: currentPage }
    })
  }, [currentPage])

  return (
    <div className="space-y-4">
      <CreateDistanceDefinitionModal
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSubmit={async (payload) => {
          const created = await createDistanceDefinition(payload)
          setRows((prev) => [created, ...prev].sort((a, b) => a.minKm - b.minKm))
        }}
      />

      {editRow && (
        <DistanceDefinitionFormModal
          open={!!editRow}
          mode="edit"
          initial={editRow}
          onOpenChange={(open) => {
            if (!open) setEditRow(null)
          }}
          onSubmit={async (payload) => {
            const updated = await updateDistanceDefinition(editRow.id, payload)
            if (!updated) return
            setRows((prev) => prev.map((item) => (item.id === updated.id ? updated : item)))
            setEditRow(null)
          }}
        />
      )}

      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:flex-row lg:items-center lg:justify-between">
        <div className="grid flex-1 gap-3 md:grid-cols-3">
          <Input
            value={query}
            onChange={(event: ChangeEvent<HTMLInputElement>) => updateQueryParam("q", event.target.value)}
            placeholder="İsim veya açıklama ara..."
          />

          <Select value={statusFilter} onValueChange={(value: string) => updateQueryParam("status", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Durum" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tüm Durumlar</SelectItem>
              <SelectItem value="active">Aktif</SelectItem>
              <SelectItem value="passive">Pasif</SelectItem>
            </SelectContent>
          </Select>

          <Select value={slaFilter} onValueChange={(value: string) => updateQueryParam("sla", value)}>
            <SelectTrigger>
              <SelectValue placeholder="SLA" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tüm SLA Hedefleri</SelectItem>
              {(["24h", "48h", "72h"] as DistanceSlaTarget[]).map((sla) => (
                <SelectItem key={sla} value={sla}>
                  {DISTANCE_SLA_LABELS[sla]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button type="button" variant="outline" onClick={() => router.replace(pathname)}>
            Filtreleri Sıfırla
          </Button>
          <Button type="button" onClick={() => setCreateOpen(true)}>
            + Mesafe Ekle
          </Button>
        </div>
      </div>

      <DataTable
        data={filteredRows}
        columns={columns}
        onTableReady={setTable}
        pagination={pagination}
        onPaginationChange={handlePaginationChange}
      />
      {table && <DataTablePagination table={table as TanStackTable<unknown>} />}
    </div>
  )
}
