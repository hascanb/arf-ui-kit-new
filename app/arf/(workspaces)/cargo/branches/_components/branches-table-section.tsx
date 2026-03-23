"use client"

import { useMemo, useState } from "react"
import type { ColumnDef, Table as TanStackTable } from "@tanstack/react-table"
import {
  DataTable,
  DataTableColumnHeader,
  DataTableFacetedFilter,
  DataTablePagination,
  DataTableToolbar,
} from "@hascanb/arf-ui-kit/datatable-kit"
import { Badge } from "@/components/ui/badge"
import { MapPin, Phone } from "lucide-react"
import type { BranchRecord } from "../_mock/branches-mock-data"

const columns: ColumnDef<BranchRecord>[] = [
  {
    accessorKey: "kod",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Şube Kodu" />,
    cell: ({ row }) => (
      <span className="font-mono font-medium">{row.original.kod}</span>
    ),
  },
  {
    accessorKey: "ad",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Şube Adı" />,
    cell: ({ row }) => <span className="font-medium">{row.original.ad}</span>,
  },
  {
    id: "konum",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Konum" />,
    cell: ({ row }) => (
      <div className="flex items-center gap-1 text-muted-foreground">
        <MapPin className="size-3" />
        {row.original.il}, {row.original.ilce}
      </div>
    ),
  },
  {
    accessorKey: "telefon",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Telefon" />,
    cell: ({ row }) => (
      <div className="flex items-center gap-1 text-muted-foreground">
        <Phone className="size-3" />
        {row.original.telefon}
      </div>
    ),
  },
  {
    accessorKey: "yetkili",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Yetkili" />,
  },
  {
    accessorKey: "aktif",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Durum" />,
    cell: ({ row }) => (
      <Badge variant={row.original.aktif ? "default" : "secondary"}>
        {row.original.aktif ? "Aktif" : "Pasif"}
      </Badge>
    ),
    filterFn: (row, id, value: string[]) => {
      const aktif = row.getValue(id) as boolean
      return value.includes(aktif ? "aktif" : "pasif")
    },
  },
]

export function BranchesTableSection({ data }: { data: BranchRecord[] }) {
  const [table, setTable] = useState<TanStackTable<BranchRecord> | null>(null)

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
        data={data}
        columns={columns}
        onTableReady={setTable}
      />

      {table && <DataTablePagination table={table as TanStackTable<unknown>} />}
    </div>
  )
}
