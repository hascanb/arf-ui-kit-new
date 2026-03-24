"use client"

import { useMemo, useState } from "react"
import type { Table as TanStackTable } from "@tanstack/react-table"
import {
  DataTable,
  DataTableFacetedFilter,
  DataTablePagination,
  DataTableToolbar,
} from "@hascanb/arf-ui-kit/datatable-kit"
import { getBranchesListColumns } from "../_columns/branches-list-columns"
import type { BranchRecord } from "../_mock/branches-mock-data"

export function BranchesTableSection({ data }: { data: BranchRecord[] }) {
  const [rows, setRows] = useState<BranchRecord[]>(data)
  const [table, setTable] = useState<TanStackTable<BranchRecord> | null>(null)

  const columns = useMemo(
    () =>
      getBranchesListColumns((branchId) => {
        if (!window.confirm("Şube durumu değiştirilecek. Onaylıyor musunuz?")) {
          return
        }

        setRows((prev) =>
          prev.map((branch) =>
            branch.id === branchId ? { ...branch, aktif: !branch.aktif } : branch,
          ),
        )
      }),
    [],
  )

  const durumOptions = useMemo(
    () => [
      { label: "Aktif", value: "aktif" },
      { label: "Pasif", value: "pasif" },
    ],
    [],
  )

  return (
    <div className="space-y-4">
      {table && (
        <DataTableToolbar
          table={table}
          searchKey="ad"
          searchPlaceholder="Şube ara..."
        >
          <DataTableFacetedFilter
            column={table.getColumn("aktif")}
            title="Durum"
            options={durumOptions}
          />
        </DataTableToolbar>
      )}

      <DataTable
        data={rows}
        columns={columns}
        onTableReady={setTable}
      />

      {table && <DataTablePagination table={table as TanStackTable<unknown>} />}
    </div>
  )
}
