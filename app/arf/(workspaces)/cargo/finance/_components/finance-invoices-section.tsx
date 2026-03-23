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
import type { InvoiceRecord } from "../_mock/finance-mock-data"
import { invoiceStatusMeta } from "../_mock/finance-mock-data"

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    minimumFractionDigits: 2,
  }).format(value)

const columns: ColumnDef<InvoiceRecord>[] = [
  {
    accessorKey: "fatura_no",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Fatura No" />,
    cell: ({ row }) => (
      <span className="font-mono font-medium">{row.original.fatura_no}</span>
    ),
  },
  {
    accessorKey: "musteri",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Müşteri" />,
  },
  {
    accessorKey: "tutar",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Tutar" />,
    cell: ({ row }) => (
      <span className="font-medium">{formatCurrency(row.original.tutar)}</span>
    ),
  },
  {
    accessorKey: "durum",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Durum" />,
    cell: ({ row }) => {
      const meta = invoiceStatusMeta[row.original.durum]
      return <Badge variant={meta?.variant ?? "default"}>{meta?.label ?? row.original.durum}</Badge>
    },
    filterFn: (row, id, value: string[]) => value.includes(row.getValue(id)),
  },
  {
    accessorKey: "tarih",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Tarih" />,
  },
]

export function FinanceInvoicesSection({ data }: { data: InvoiceRecord[] }) {
  const [table, setTable] = useState<TanStackTable<InvoiceRecord> | null>(null)

  const durumOptions = useMemo(
    () => [
      { label: "Beklemede", value: "beklemede" },
      { label: "Ödendi", value: "odendi" },
      { label: "Gecikti", value: "gecikti" },
      { label: "İptal", value: "iptal" },
    ],
    [],
  )

  return (
    <div className="space-y-4">
      {table && (
        <DataTableToolbar
          table={table}
          searchKey="musteri"
          searchPlaceholder="Müşteri veya fatura ara..."
        >
          <DataTableFacetedFilter
            column={table.getColumn("durum")}
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
