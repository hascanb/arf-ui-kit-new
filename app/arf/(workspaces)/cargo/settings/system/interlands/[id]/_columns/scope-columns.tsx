"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { DataTableColumnHeader } from "@hascanb/arf-ui-kit/datatable-kit"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2 } from "lucide-react"
import type { InterlandScopeRow } from "../../_types"

export interface InterlandScopeGroupedRow {
  id: string
  city: string
  district: string
  neighborhood: string
  neighborhoods: string[]
  sourceRows: InterlandScopeRow[]
}

export function getScopeColumns(
  onEdit: (row: InterlandScopeGroupedRow) => void,
  onDelete: (row: InterlandScopeGroupedRow) => void,
): ColumnDef<InterlandScopeGroupedRow>[] {
  return [
    {
      accessorKey: "city",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Şehir" />,
    },
    {
      accessorKey: "district",
      header: ({ column }) => <DataTableColumnHeader column={column} title="İlçe" />,
    },
    {
      accessorKey: "neighborhood",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Mahalle" />,
      cell: ({ row }) =>
        row.original.neighborhoods.length > 1
          ? `${row.original.neighborhoods.length} mahalle: ${row.original.neighborhoods.join(", ")}`
          : row.original.neighborhood,
    },
    {
      id: "actions",
      header: () => <span className="sr-only">İşlemler</span>,
      enableSorting: false,
      cell: ({ row }) => (
        <div className="flex justify-end gap-2">
          <Button type="button" size="sm" variant="outline" className="h-8" onClick={() => onEdit(row.original)}>
            <Pencil className="size-3.5" />
          </Button>
          <Button type="button" size="sm" variant="outline" className="h-8 border-red-200 text-red-700 hover:bg-red-50 hover:text-red-700" onClick={() => onDelete(row.original)}>
            <Trash2 className="size-3.5" />
          </Button>
        </div>
      ),
    },
  ]
}
