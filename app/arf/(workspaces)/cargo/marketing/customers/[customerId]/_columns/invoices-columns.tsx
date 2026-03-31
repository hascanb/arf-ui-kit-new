"use client"

import Link from "next/link"
import type { ColumnDef } from "@tanstack/react-table"
import { DataTableColumnHeader } from "@hascanb/arf-ui-kit/datatable-kit"
import { Badge } from "@/components/ui/badge"
import type { FinancialExstreRecord, InvoicePaymentStatus } from "../_types/financial"

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY", minimumFractionDigits: 2 }).format(value)

const typeLabel: Record<string, { label: string; className: string }> = {
  fatura: { label: "Fatura", className: "bg-rose-500/10 text-rose-600 border-rose-500/20" },
  gelen_odeme: { label: "Gelen Ödeme", className: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" },
}

const statusConfig: Record<InvoicePaymentStatus, { label: string; className: string }> = {
  odendi: { label: "Ödendi", className: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" },
  bekliyor: { label: "Bekliyor", className: "bg-amber-500/10 text-amber-600 border-amber-500/20" },
  kismi: { label: "Kısmi", className: "bg-sky-500/10 text-sky-600 border-sky-500/20" },
  gecikti: { label: "Gecikti", className: "bg-rose-500/10 text-rose-600 border-rose-500/20" },
  reddedildi: { label: "Reddedildi", className: "bg-red-500/10 text-red-600 border-red-500/20" },
  iade: { label: "İade", className: "bg-purple-500/10 text-purple-600 border-purple-500/20" },
  iptal: { label: "İptal", className: "bg-slate-200 text-slate-600 border-slate-300" },
}

export const invoicesColumns: ColumnDef<FinancialExstreRecord>[] = [
  {
    accessorKey: "type",
    header: ({ column }) => <DataTableColumnHeader column={column} title="İşlem Tipi" />,
    filterFn: (row, columnId, filterValues: string[]) => filterValues.includes(row.getValue(columnId)),
    cell: ({ row }) => {
      const cfg = typeLabel[row.original.type]
      return cfg ? (
        <Badge variant="outline" className={cfg.className}>{cfg.label}</Badge>
      ) : <span>{row.original.type}</span>
    },
  },
  {
    accessorKey: "invoiceNo",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Fatura / Belge No" />,
    cell: ({ row }) => {
      if (row.original.type === "fatura" && row.original.invoiceId) {
        return (
          <Link
            href={`/arf/cargo/finance/headquarters/invoices/${row.original.invoiceId}`}
            className="font-mono text-sm text-slate-900 hover:text-blue-700"
          >
            {row.original.invoiceNo}
          </Link>
        )
      }

      return <span className="font-mono text-sm">{row.original.invoiceNo}</span>
    },
  },
  {
    accessorKey: "dueDate",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Vade Tarihi" />,
    cell: ({ row }) => (
      <span className="text-muted-foreground">{row.original.dueDate || "—"}</span>
    ),
  },
  {
    accessorKey: "description",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Açıklama" />,
    cell: ({ row }) => <span className="text-muted-foreground">{row.original.description}</span>,
  },
  {
    accessorKey: "debit",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Borç" />,
    cell: ({ row }) => (
      <span className="block text-right tabular-nums">
        {row.original.debit > 0 ? formatCurrency(row.original.debit) : "—"}
      </span>
    ),
  },
  {
    accessorKey: "credit",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Alacak" />,
    cell: ({ row }) => (
      <span className="block text-right tabular-nums text-emerald-600">
        {row.original.credit > 0 ? formatCurrency(row.original.credit) : "—"}
      </span>
    ),
  },
  {
    accessorKey: "remainingBalance",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Kalan Bakiye" />,
    cell: ({ row }) => (
      <span className="block text-right font-semibold tabular-nums">
        {formatCurrency(row.original.remainingBalance)}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Durum" />,
    filterFn: (row, columnId, filterValues: string[]) => filterValues.includes(row.getValue(columnId)),
    cell: ({ row }) => {
      const cfg = statusConfig[row.original.status]
      return cfg ? (
        <Badge variant="outline" className={cfg.className}>{cfg.label}</Badge>
      ) : <span>{row.original.status}</span>
    },
  },
]
