"use client"

import Link from "next/link"
import type { ColumnDef } from "@tanstack/react-table"
import { DataTableColumnHeader } from "@hascanb/arf-ui-kit/datatable-kit"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { ChevronDown, Eye, Pencil, Trash2 } from "lucide-react"
import {
  formatDate,
  formatMoney,
  INVOICE_STATUS_BADGE_CLASSES,
  INVOICE_STATUS_LABELS,
} from "../_lib/invoice-presenters"
import type { InvoiceRecord, InvoiceStatus } from "../_types/invoice"

// ---------------------------------------------------------------------------
// Column Actions type
// ---------------------------------------------------------------------------

export interface InvoiceColumnActions {
  onViewDetail: (row: InvoiceRecord) => void
  onReject: (row: InvoiceRecord) => void
  onRefund: (row: InvoiceRecord) => void
}

// ---------------------------------------------------------------------------
// Column definitions
// ---------------------------------------------------------------------------

export function getInvoicesColumns(actions: InvoiceColumnActions): ColumnDef<InvoiceRecord>[] {
  return [
    {
      accessorKey: "invoiceNo",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Fatura No" />,
      cell: ({ row }) => (
        <Link
          href={`/arf/cargo/finance/headquarters/invoices/${row.original.id}`}
          className="font-mono text-sm font-medium text-slate-900 hover:text-blue-700"
        >
          {row.original.invoiceNo}
        </Link>
      ),
    },
    {
      accessorKey: "customerName",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Müşteri" />,
      cell: ({ row }) => (
        <div>
          <p className="font-medium text-slate-900">{row.original.customerName}</p>
          <p className="text-xs text-slate-500">{row.original.taxNumber || "-"}</p>
        </div>
      ),
    },
    {
      accessorKey: "issueDate",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Düzenlenme" />,
      cell: ({ row }) => (
        <span className="text-sm text-slate-700">{formatDate(row.original.issueDate)}</span>
      ),
    },
    {
      accessorKey: "dueDate",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Vade" />,
      cell: ({ row }) => (
        <span className="text-sm text-slate-700">{formatDate(row.original.dueDate)}</span>
      ),
    },
    {
      accessorKey: "grandTotal",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Toplam" />,
      cell: ({ row }) => (
        <span className="text-sm font-medium text-slate-900">{formatMoney(row.original.grandTotal)}</span>
      ),
    },
    {
      accessorKey: "paidTotal",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Tahsil" />,
      cell: ({ row }) => (
        <span className="text-sm text-emerald-700">{formatMoney(row.original.paidTotal)}</span>
      ),
    },
    {
      accessorKey: "remainingBalance",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Kalan" />,
      cell: ({ row }) => {
        const value = row.original.remainingBalance
        return (
          <span className={cn("text-sm font-medium", value > 0 ? "text-rose-600" : "text-slate-400")}>
            {formatMoney(value)}
          </span>
        )
      },
    },
    {
      accessorKey: "relatedCargoCount",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Kargo" />,
      cell: ({ row }) => (
        <Badge variant="outline" className="border-slate-200 bg-slate-50 text-slate-600 text-xs">
          {row.original.relatedCargoCount} adet
        </Badge>
      ),
    },
    {
      accessorKey: "status",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Durum" />,
      cell: ({ row }) => {
        const status = row.original.status
        return (
          <Badge variant="outline" className={cn("text-xs", INVOICE_STATUS_BADGE_CLASSES[status])}>
            {INVOICE_STATUS_LABELS[status]}
          </Badge>
        )
      },
    },
    {
      id: "actions",
      header: () => <span className="sr-only">İşlemler</span>,
      cell: ({ row }) => {
        const inv = row.original
        const isPaid = inv.status === "odendi"
        const isRejectable = ["bekliyor", "gecikti"].includes(inv.status)

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-8 rounded-lg border-slate-200 bg-white px-2.5 text-xs font-medium"
              >
                İşlemler
                <ChevronDown className="ml-1 size-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              <DropdownMenuItem
                onClick={() => actions.onViewDetail(inv)}
                className="text-slate-800"
              >
                <Eye className="mr-2 size-4 text-slate-500" />
                <span>Detay Görüntüle</span>
              </DropdownMenuItem>
              {isRejectable && (
                <DropdownMenuItem
                  onClick={() => actions.onReject(inv)}
                  className="text-red-600 focus:text-red-600"
                >
                  <Trash2 className="mr-2 size-4" />
                  <span>Red İşaretle</span>
                </DropdownMenuItem>
              )}
              {isPaid && (
                <DropdownMenuItem
                  onClick={() => actions.onRefund(inv)}
                  className="text-purple-600 focus:text-purple-600"
                >
                  <Pencil className="mr-2 size-4" />
                  <span>İade İşaretle</span>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]
}
