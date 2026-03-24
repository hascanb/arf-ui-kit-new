"use client"

import Link from "next/link"
import type { ColumnDef } from "@tanstack/react-table"
import { DataTableColumnHeader } from "@hascanb/arf-ui-kit/datatable-kit"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { BranchCommissionRecord } from "../_types"

const typeConfig = {
  alim: { label: "Alım", className: "border-blue-200 bg-blue-50 text-blue-700" },
  dagitim: { label: "Dağıtım", className: "border-violet-200 bg-violet-50 text-violet-700" },
} satisfies Record<BranchCommissionRecord["transactionType"], { label: string; className: string }>

const statusConfig = {
  confirmed: { label: "Kesinleşti", className: "border-emerald-200 bg-emerald-50 text-emerald-700" },
  pending: { label: "İşlemde", className: "border-amber-200 bg-amber-50 text-amber-700" },
  cancelled: { label: "İptal", className: "border-red-200 bg-red-50 text-red-700" },
} satisfies Record<BranchCommissionRecord["status"], { label: string; className: string }>

export const commissionColumns: ColumnDef<BranchCommissionRecord>[] = [
  {
    accessorKey: "processDate",
    header: ({ column }) => <DataTableColumnHeader column={column} title="İşlem Tarihi" />,
    cell: ({ row }) => new Date(row.original.processDate).toLocaleString("tr-TR"),
  },
  {
    accessorKey: "trackingNo",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Takip No" />,
    cell: ({ row }) => (
      <Link
        href={`/arf/cargo/shipments?search=${row.original.trackingNo}`}
        className="font-mono text-sm font-semibold text-secondary underline decoration-secondary/40 underline-offset-4 transition-colors hover:text-primary"
      >
        {row.original.trackingNo}
      </Link>
    ),
  },
  {
    accessorKey: "transactionType",
    header: ({ column }) => <DataTableColumnHeader column={column} title="İşlem Tipi" />,
    cell: ({ row }) => {
      const config = typeConfig[row.original.transactionType]
      return (
        <Badge variant="outline" className={cn("border", config.className)}>
          {config.label}
        </Badge>
      )
    },
    filterFn: (row, id, value: string[]) => value.includes(String(row.getValue(id))),
  },
  {
    accessorKey: "kargoBedeli",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Kargo Bedeli" />,
    cell: ({ row }) =>
      new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(
        row.original.kargoBedeli,
      ),
  },
  {
    accessorKey: "hesaplamaDetayi",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Hesaplama Detayı" />,
  },
  {
    accessorKey: "netKazanc",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Net Kazanç" />,
    cell: ({ row }) => (
      <span className={cn("font-semibold tabular-nums", row.original.status === "cancelled" && "text-red-700") }>
        {new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(
          row.original.netKazanc,
        )}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Durum" />,
    cell: ({ row }) => {
      const config = statusConfig[row.original.status]
      return (
        <Badge variant="outline" className={cn("border", config.className)}>
          {config.label}
        </Badge>
      )
    },
    filterFn: (row, id, value: string[]) => value.includes(String(row.getValue(id))),
  },
]
