"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { DataTableColumnHeader } from "@hascanb/arf-ui-kit/datatable-kit"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { BankAccountTransaction } from "../../_types"

function formatMoney(value: number, currency: BankAccountTransaction["currency"]): string {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

export function getTransactionsColumns(): ColumnDef<BankAccountTransaction>[] {
  return [
    {
      accessorKey: "date",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Tarih" />,
      cell: ({ row }) => new Date(row.original.date).toLocaleString("tr-TR"),
    },
    {
      accessorKey: "description",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Açıklama" />,
      cell: ({ row }) => <span className="text-sm text-slate-700">{row.original.description}</span>,
    },
    {
      accessorKey: "direction",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Yön" />,
      cell: ({ row }) => (
        <Badge
          variant="outline"
          className={cn(
            "border",
            row.original.direction === "credit"
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-red-200 bg-red-50 text-red-700",
          )}
        >
          {row.original.direction === "credit" ? "Giriş" : "Çıkış"}
        </Badge>
      ),
    },
    {
      accessorKey: "amount",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Tutar" />,
      cell: ({ row }) => (
        <span className={cn("font-medium", row.original.direction === "credit" ? "text-emerald-700" : "text-red-700")}>
          {formatMoney(row.original.amount, row.original.currency)}
        </span>
      ),
    },
    {
      accessorKey: "balanceAfter",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Bakiye" />,
      cell: ({ row }) => <span className="font-medium text-slate-900">{formatMoney(row.original.balanceAfter, row.original.currency)}</span>,
    },
  ]
}
