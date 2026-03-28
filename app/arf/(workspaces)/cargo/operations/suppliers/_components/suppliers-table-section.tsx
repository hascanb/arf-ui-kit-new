"use client"

import { useMemo, useState } from "react"
import type { OnChangeFn, PaginationState, Table as TanStackTable } from "@tanstack/react-table"
import {
  DataTable,
  DataTableExcelActions,
  DataTableFacetedFilter,
  DataTablePagination,
  DataTableToolbar,
} from "@hascanb/arf-ui-kit/datatable-kit"
import { Card, CardContent } from "@/components/ui/card"
import { toggleSupplierStatus } from "../_api/suppliers-list-api"
import { getSuppliersColumns } from "../_columns/suppliers-columns"
import type { SupplierRecord } from "../_types"

interface Props {
  rows: SupplierRecord[]
  onRowsChange: (rows: SupplierRecord[]) => void
  pagination: PaginationState
  onPaginationChange: OnChangeFn<PaginationState>
  onCreateOpen: () => void
  onEditOpen: (supplier: SupplierRecord) => void
}

const supplierTypeOptions = [
  { label: "Özmal", value: "ozmal" },
  { label: "Lojistik", value: "logistics" },
  { label: "Kamyon Sahibi", value: "truck_owner" },
  { label: "Ambar", value: "warehouse" },
]

const contractTypeOptions = [
  { label: "Sabit Maaşlı", value: "fixed_salary" },
  { label: "Sefer Başı", value: "per_trip" },
  { label: "Desi Başı", value: "per_desi" },
  { label: "Komisyon", value: "commission" },
]

const statusOptions = [
  { label: "Aktif", value: "active" },
  { label: "Pasif", value: "passive" },
]

export function SuppliersTableSection({
  rows,
  onRowsChange,
  pagination,
  onPaginationChange,
  onEditOpen,
}: Props) {
  const [table, setTable] = useState<TanStackTable<SupplierRecord> | null>(null)

  const columns = useMemo(
    () =>
      getSuppliersColumns({
        onToggleStatus: async (supplier) => {
          const ok = window.confirm(
            `${supplier.name} tedarikçisi ${supplier.status === "active" ? "pasife" : "aktife"} alınsın mı?`
          )
          if (!ok) return
          const updated = await toggleSupplierStatus(supplier.id)
          if (!updated) return
          onRowsChange(rows.map((r) => (r.id === updated.id ? updated : r)))
        },
        onEdit: onEditOpen,
      }),
    [rows, onRowsChange, onEditOpen]
  )

  return (
    <Card className="rounded-2xl border-slate-200/80 shadow-none">
      <CardContent className="p-4 space-y-4">
        {table && (
          <div className="flex items-center gap-2">
            <DataTableExcelActions
              table={table}
              filename="tedarikci-listesi"
              exportSelected={false}
              exportLabel="Dışarı Aktar"
            />
            <DataTableToolbar
              table={table}
              searchPlaceholder="Tedarikçi adı veya yetkili ara..."
              showColumnSelector
              viewLabel="Görünüm"
              columnsLabel="Sütunlar"
              resetLabel="Sıfırla"
            >
              <DataTableFacetedFilter
                column={table.getColumn("supplierType")}
                title="Tedarikçi Tipi"
                options={supplierTypeOptions}
              />
              <DataTableFacetedFilter
                column={table.getColumn("contractType")}
                title="Sözleşme Tipi"
                options={contractTypeOptions}
              />
              <DataTableFacetedFilter
                column={table.getColumn("status")}
                title="Durum"
                options={statusOptions}
              />
            </DataTableToolbar>
          </div>
        )}

        <DataTable
          columns={columns}
          data={rows}
          onTableReady={setTable}
          pagination={pagination}
          onPaginationChange={onPaginationChange}
          enablePagination
          enableSorting
          enableColumnVisibility
          enableHorizontalScroll
          stickyFirstColumn
          stickyLastColumn
          className="[&_thead_tr]:bg-slate-50 [&_thead_th]:font-semibold [&_thead_th]:text-slate-600"
          emptyMessage="Gösterilecek tedarikçi bulunamadı."
        />

        {table && (
          <DataTablePagination
            table={table as TanStackTable<unknown>}
            pageSizeOptions={[10, 20, 50]}
          />
        )}
      </CardContent>
    </Card>
  )
}
