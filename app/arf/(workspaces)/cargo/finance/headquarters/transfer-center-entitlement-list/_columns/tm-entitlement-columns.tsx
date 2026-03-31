"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { DataTableColumnHeader } from "@hascanb/arf-ui-kit/datatable-kit"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown, Eye } from "lucide-react"
import { cn } from "@/lib/utils"
import type { TmEntitlementRow } from "../_types"

function formatMoney(value: number): string {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

function formatCommissionValue(row: TmEntitlementRow): string {
  if (row.commissionModel === "per_piece") {
    return `${row.commissionValue}₺/parça`
  }
  return `%${(row.commissionValue * 100).toFixed(0)}`
}

export function getTmEntitlementColumns(): ColumnDef<TmEntitlementRow>[] {
  return [
    {
      accessorKey: "transferCenterName",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Transfer Merkezi" />,
      cell: ({ row }) => (
        <div>
          <p className="font-medium text-slate-900">{row.original.transferCenterName}</p>
          <p className="text-xs text-slate-500">{row.original.transferCenterCode}</p>
        </div>
      ),
    },
    {
      accessorKey: "commissionModel",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Hakediş Tipi" />,
      cell: ({ row }) => (
        <Badge
          variant="outline"
          className={cn(
            "border",
            row.original.commissionModel === "per_piece"
              ? "border-blue-200 bg-blue-50 text-blue-700"
              : "border-purple-200 bg-purple-50 text-purple-700",
          )}
        >
          {row.original.commissionModel === "per_piece" ? "Parça Başı" : "Yüzdelik"}
        </Badge>
      ),
    },
    {
      accessorKey: "commissionValue",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Hakediş Değeri" />,
      cell: ({ row }) => <span className="text-sm font-medium text-slate-700">{formatCommissionValue(row.original)}</span>,
    },
    {
      accessorKey: "toplamHakedis",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Toplam Hakediş" />,
      cell: ({ row }) => <span className="font-semibold text-slate-900">{formatMoney(row.original.toplamHakedis)}</span>,
    },
    {
      accessorKey: "onaylanan",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Onaylanan" />,
      cell: ({ row }) => <span className="font-medium text-emerald-700">{formatMoney(row.original.onaylanan)}</span>,
    },
    {
      accessorKey: "onayBekleyen",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Onay Bekleyen" />,
      cell: ({ row }) => (
        <span className={cn("font-medium", row.original.onayBekleyen > 0 ? "text-amber-700" : "text-slate-500")}>
          {formatMoney(row.original.onayBekleyen)}
        </span>
      ),
    },
    {
      accessorKey: "iptalEdilen",
      header: ({ column }) => <DataTableColumnHeader column={column} title="İptal Edilen" />,
      cell: ({ row }) => (
        <span className={cn("font-medium", row.original.iptalEdilen > 0 ? "text-red-600" : "text-slate-400")}>
          {formatMoney(row.original.iptalEdilen)}
        </span>
      ),
    },
    {
      accessorKey: "toplamParcaAdedi",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Parça Adedi" />,
      cell: ({ row }) => <span className="text-sm text-slate-700">{row.original.toplamParcaAdedi.toLocaleString("tr-TR")}</span>,
    },
    {
      accessorKey: "toplamKargoBedeli",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Kargo Bedeli Toplamı" />,
      cell: ({ row }) => <span className="text-slate-800">{formatMoney(row.original.toplamKargoBedeli)}</span>,
    },
    {
      id: "actions",
      header: () => <span className="sr-only">İşlemler</span>,
      enableSorting: false,
      enableHiding: false,
      cell: ({ row }) => (
        <div className="flex justify-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 rounded-lg border-slate-200 bg-white px-2.5 text-xs font-medium">
                İşlemler
                <ChevronDown className="ml-1 size-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              <DropdownMenuLabel>{`${row.original.transferCenterName} İşlemler:`}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onSelect={() => {
                  console.log("Detay Görüntüle:", row.original.transferCenterId)
                }}
              >
                <Eye className="mr-2 size-4" />
                Detay Görüntüle
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ]
}
