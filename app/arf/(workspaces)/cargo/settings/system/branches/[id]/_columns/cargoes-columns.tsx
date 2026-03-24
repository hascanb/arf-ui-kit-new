"use client"

import Link from "next/link"
import type { ColumnDef } from "@tanstack/react-table"
import { DataTableColumnHeader } from "@hascanb/arf-ui-kit/datatable-kit"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { BranchCargoRecord } from "../_types"

const directionConfig = {
  gonderici: {
    label: "Gönderici",
    className: "border-blue-200 bg-blue-50 text-blue-700",
  },
  alici: {
    label: "Alıcı",
    className: "border-violet-200 bg-violet-50 text-violet-700",
  },
} satisfies Record<BranchCargoRecord["yon"], { label: string; className: string }>

const statusConfig = {
  bekliyor: {
    label: "Bekliyor",
    className: "border-amber-200 bg-amber-50 text-amber-700",
  },
  yolda: {
    label: "Yolda",
    className: "border-sky-200 bg-sky-50 text-sky-700",
  },
  teslim_edildi: {
    label: "Teslim Edildi",
    className: "border-emerald-200 bg-emerald-50 text-emerald-700",
  },
  iade: {
    label: "İade",
    className: "border-rose-200 bg-rose-50 text-rose-700",
  },
  iptal: {
    label: "İptal",
    className: "border-red-200 bg-red-50 text-red-700",
  },
} satisfies Record<BranchCargoRecord["durum"], { label: string; className: string }>

export const cargoesColumns: ColumnDef<BranchCargoRecord>[] = [
  {
    accessorKey: "takipNo",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Takip No" />,
    cell: ({ row }) => (
      <Link
        href={`/arf/cargo/shipments?search=${row.original.takipNo}`}
        className="font-mono text-sm font-semibold text-secondary underline decoration-secondary/40 underline-offset-4 transition-colors hover:text-primary"
      >
        {row.original.takipNo}
      </Link>
    ),
  },
  {
    accessorKey: "yon",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Yön" />,
    cell: ({ row }) => {
      const config = directionConfig[row.original.yon]
      return (
        <Badge variant="outline" className={cn("border", config.className)}>
          {config.label}
        </Badge>
      )
    },
    filterFn: (row, id, value: string[]) => value.includes(String(row.getValue(id))),
  },
  {
    accessorKey: "gondericiAdSoyad",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Gönderici" />,
  },
  {
    accessorKey: "aliciAdSoyad",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Alıcı" />,
  },
  {
    accessorKey: "kargoBedeli",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Kargo Bedeli" />,
    cell: ({ row }) => (
      <span className="font-medium tabular-nums">
        {new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(
          row.original.kargoBedeli,
        )}
      </span>
    ),
  },
  {
    accessorKey: "durum",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Durum" />,
    cell: ({ row }) => {
      const config = statusConfig[row.original.durum]
      return (
        <Badge variant="outline" className={cn("border", config.className)}>
          {config.label}
        </Badge>
      )
    },
    filterFn: (row, id, value: string[]) => value.includes(String(row.getValue(id))),
  },
  {
    accessorKey: "tarih",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Tarih" />,
    cell: ({ row }) => (
      <span className="text-sm text-slate-600">
        {new Date(row.original.tarih).toLocaleString("tr-TR")}
      </span>
    ),
  },
  {
    accessorKey: "teslimTarihi",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Teslim Tarihi" />,
    cell: ({ row }) => (
      <span className="text-sm text-slate-600">
        {row.original.teslimTarihi
          ? new Date(row.original.teslimTarihi).toLocaleString("tr-TR")
          : "-"}
      </span>
    ),
  },
]
