"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import type { Table as TanStackTable } from "@tanstack/react-table"
import {
  DataTable,
  DataTablePagination,
} from "@hascanb/arf-ui-kit/datatable-kit"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { getScopeColumns, type InterlandScopeGroupedRow } from "../_columns/scope-columns"
import type { InterlandAuditLog, InterlandDetail, InterlandScopeRow } from "../../_types"
import { ScopeUpdateModal } from "./scope-update-modal"

interface Props {
  interland: InterlandDetail
  onInterlandChange: (next: InterlandDetail) => void
  onAuditAppend: (entry: Omit<InterlandAuditLog, "id" | "createdAt">) => void
}

export function DetailOverviewSection({ interland, onInterlandChange, onAuditAppend }: Props) {
  const [table, setTable] = useState<TanStackTable<InterlandScopeGroupedRow> | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingRow, setEditingRow] = useState<InterlandScopeGroupedRow | undefined>(undefined)

  const cities = useMemo(() => new Set(interland.scopeRows.map((item) => item.city)).size, [interland.scopeRows])
  const districts = useMemo(
    () => new Set(interland.scopeRows.map((item) => `${item.city}-${item.district}`)).size,
    [interland.scopeRows],
  )

  const groupedRows = useMemo<InterlandScopeGroupedRow[]>(() => {
    const grouped = new Map<
      string,
      { city: string; district: string; neighborhoods: string[]; sourceRows: InterlandScopeRow[] }
    >()

    for (const item of interland.scopeRows) {
      const key = `${item.city}__${item.district}`
      const existing = grouped.get(key)

      if (!existing) {
        grouped.set(key, {
          city: item.city,
          district: item.district,
          neighborhoods: [item.neighborhood],
          sourceRows: [item],
        })
        continue
      }

      if (!existing.neighborhoods.includes(item.neighborhood)) {
        existing.neighborhoods.push(item.neighborhood)
      }
      existing.sourceRows.push(item)
    }

    return Array.from(grouped.values())
      .map((group) => ({
        id: `${group.city}-${group.district}`,
        city: group.city,
        district: group.district,
        neighborhoods: group.neighborhoods.sort((a, b) => a.localeCompare(b, "tr")),
        neighborhood:
          group.neighborhoods.length === 1
            ? group.neighborhoods[0]
            : `${group.neighborhoods.length} mahalle seçili`,
        sourceRows: group.sourceRows,
      }))
      .sort((a, b) => `${a.city}-${a.district}`.localeCompare(`${b.city}-${b.district}`, "tr"))
  }, [interland.scopeRows])

  const updateInterlandRows = (updatedRows: InterlandScopeRow[]) => {
    onInterlandChange({
      ...interland,
      scopeRows: updatedRows,
      cityCount: new Set(updatedRows.map((item) => item.city)).size,
      districtCount: new Set(updatedRows.map((item) => `${item.city}-${item.district}`)).size,
      neighborhoodCount: updatedRows.length,
    })
  }

  const columns = useMemo(
    () =>
      getScopeColumns(
        (row) => {
          setEditingRow(row)
          setModalOpen(true)
        },
        async (row) => {
          if (!window.confirm("Kapsam satırı silinecek. Onaylıyor musunuz?")) {
            return
          }

          const sourceIds = new Set(row.sourceRows.map((item) => item.id))
          const updatedRows = interland.scopeRows.filter((item) => !sourceIds.has(item.id))
          updateInterlandRows(updatedRows)

          onAuditAppend({
            actionType: "scope_delete",
            oldValue: `${row.city} / ${row.district} / ${row.neighborhoods.join(", ")}`,
            newValue: "-",
            actorId: "current-user",
            actorName: "Mevcut Kullanıcı",
          })
        },
      ),
    [interland, onAuditAppend],
  )

  return (
    <div className="space-y-4">
      <ScopeUpdateModal
        open={modalOpen}
        onOpenChange={(open) => {
          setModalOpen(open)
          if (!open) {
            setEditingRow(undefined)
          }
        }}
        initial={
          editingRow
            ? {
                city: editingRow.city,
                district: editingRow.district,
                neighborhoods: editingRow.neighborhoods,
                sourceIds: editingRow.sourceRows.map((item) => item.id),
              }
            : undefined
        }
        scopeRows={interland.scopeRows}
        onSave={async (payload) => {
          const uniqueNeighborhoods = Array.from(new Set(payload.neighborhoods)).sort((a, b) =>
            a.localeCompare(b, "tr"),
          )

          const sourceIds = new Set(payload.sourceIds ?? [])
          const remainingRows =
            sourceIds.size > 0
              ? interland.scopeRows.filter((item) => !sourceIds.has(item.id))
              : interland.scopeRows

          const nextRows: InterlandScopeRow[] = uniqueNeighborhoods.map((neighborhood, index) => ({
            id: `scope-${Date.now()}-${index}`,
            city: payload.city,
            district: payload.district,
            neighborhood,
          }))

          const dedupedByKey = new Map<string, InterlandScopeRow>()
          for (const row of [...nextRows, ...remainingRows]) {
            const key = `${row.city}__${row.district}__${row.neighborhood}`
            if (!dedupedByKey.has(key)) {
              dedupedByKey.set(key, row)
            }
          }

          const updatedRows = Array.from(dedupedByKey.values())
          updateInterlandRows(updatedRows)

          onAuditAppend({
            actionType: payload.sourceIds?.length ? "scope_update" : "scope_add",
            oldValue:
              payload.sourceIds?.length && editingRow
                ? `${editingRow.city} / ${editingRow.district} / ${editingRow.neighborhoods.join(", ")}`
                : "-",
            newValue: `${payload.city} / ${payload.district} / ${uniqueNeighborhoods.join(", ")}`,
            actorId: "current-user",
            actorName: "Mevcut Kullanıcı",
          })
        }}
      />

      <Card className="rounded-2xl border-slate-200 bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-sm font-semibold text-slate-700">Kapsam Özeti</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-600">
            Bu interland toplam <span className="font-semibold text-slate-900">{districts} ilçe</span> ve <span className="font-semibold text-slate-900">{interland.scopeRows.length} mahalleyi</span> kapsamaktadır.
          </p>
          <div className="mt-3 grid gap-2 sm:grid-cols-3">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm">Şehir: <span className="font-semibold">{cities}</span></div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm">İlçe: <span className="font-semibold">{districts}</span></div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm">Mahalle: <span className="font-semibold">{interland.scopeRows.length}</span></div>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl border-slate-200 bg-white shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-semibold text-slate-700">Kapsam ve Hiyerarşi</CardTitle>
          <Button type="button" size="sm" onClick={() => setModalOpen(true)}>
            Kapsamı Güncelle
          </Button>
        </CardHeader>
        <Separator />
        <CardContent className="pt-4">
          <DataTable data={groupedRows} columns={columns} onTableReady={setTable} />
          {table && <DataTablePagination table={table as TanStackTable<unknown>} />}
        </CardContent>
      </Card>

      <Card className="rounded-2xl border-slate-200 bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-sm font-semibold text-slate-700">Lojistik Hiyerarşi</CardTitle>
        </CardHeader>
        <Separator />
        <CardContent className="space-y-2 pt-4 text-sm text-slate-600">
          <p>
            Bağlı Şube: <Link className="font-medium text-secondary hover:underline" href={`/arf/cargo/settings/system/branches/${interland.branchId}`}>{interland.branchName}</Link>
          </p>
          <p>
            Transfer Merkezi: {interland.transferCenterId ? (
              <Link className="font-medium text-secondary hover:underline" href={`/arf/cargo/settings/system/transfer-centers/${interland.transferCenterId}`}>{interland.transferCenterName}</Link>
            ) : (
              "-"
            )}
          </p>
          <p>Şube Müdürü: <span className="font-medium text-slate-800">{interland.branchManagerName ?? "-"}</span></p>
          <p>İletişim: <span className="font-medium text-slate-800">{interland.branchManagerPhone ?? "-"}</span></p>
        </CardContent>
      </Card>
    </div>
  )
}
