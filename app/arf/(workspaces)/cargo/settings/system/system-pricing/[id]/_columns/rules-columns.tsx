"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { DataTableColumnHeader } from "@hascanb/arf-ui-kit/datatable-kit"
import type { PriceRuleRow } from "../../_types"

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

export function getRulesColumns(): ColumnDef<PriceRuleRow>[] {
  return [
    {
      accessorKey: "unitType",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Tür" />,
      cell: ({ row }) => row.original.unitType.toUpperCase(),
    },
    {
      accessorKey: "shipmentType",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Gönderi Tipi" />,
      cell: ({ row }) => row.original.shipmentType,
    },
    {
      accessorKey: "regionLabel",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Mesafe / Bölge" />,
    },
    {
      id: "range",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Başlangıç - Bitiş" />,
      cell: ({ row }) => `${row.original.rangeStart.toFixed(2)} - ${row.original.rangeEnd.toFixed(2)}`,
    },
    {
      accessorKey: "basePrice",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Taban Fiyat" />,
      cell: ({ row }) => formatCurrency(row.original.basePrice),
    },
    {
      accessorKey: "incrementalPrice",
      header: ({ column }) => <DataTableColumnHeader column={column} title="+ Fiyat" />,
      cell: ({ row }) => formatCurrency(row.original.incrementalPrice),
    },
  ]
}
