"use client"

import { useState } from "react"
import type { ColumnDef, Table as TanStackTable } from "@tanstack/react-table"
import {
  DataTable,
  DataTableColumnHeader,
  DataTablePagination,
} from "@hascanb/arf-ui-kit/datatable-kit"
import type {
  CustomerFinancialMovementRecord,
  FinancialMovementType,
} from "../../_data/customers"

const financialTypeLabel: Record<FinancialMovementType, string> = {
  fatura: "Fatura",
  tahsilat: "Tahsilat",
  odeme: "Ödeme",
  iade: "İade",
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    minimumFractionDigits: 2,
  }).format(value)

const columns: ColumnDef<CustomerFinancialMovementRecord>[] = [
  {
    accessorKey: "date",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Tarih" />,
  },
  {
    accessorKey: "type",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Tip" />,
    cell: ({ row }) => financialTypeLabel[row.original.type],
  },
  {
    accessorKey: "documentNo",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Belge No" />,
    cell: ({ row }) => <span className="font-mono text-xs">{row.original.documentNo}</span>,
  },
  {
    accessorKey: "description",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Açıklama" />,
  },
  {
    accessorKey: "debit",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Borç" />,
    cell: ({ row }) => <span className="block text-right">{formatCurrency(row.original.debit)}</span>,
  },
  {
    accessorKey: "credit",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Alacak" />,
    cell: ({ row }) => <span className="block text-right">{formatCurrency(row.original.credit)}</span>,
  },
  {
    accessorKey: "balance",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Bakiye" />,
    cell: ({ row }) => (
      <span className="block text-right font-semibold">{formatCurrency(row.original.balance)}</span>
    ),
  },
]

export function CustomerFinancialMovementsSection({
  movements,
}: {
  movements: CustomerFinancialMovementRecord[]
}) {
  const [table, setTable] = useState<TanStackTable<CustomerFinancialMovementRecord> | null>(null)

  return (
    <div className="space-y-3">
      <DataTable
        data={movements}
        columns={columns}
        onTableReady={setTable}
      />
      {table && <DataTablePagination table={table as TanStackTable<unknown>} pageSizeOptions={[5, 10, 20, 50]} />}
    </div>
  )
}
