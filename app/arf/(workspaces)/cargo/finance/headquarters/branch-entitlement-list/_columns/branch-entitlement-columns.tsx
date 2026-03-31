"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { DataTableColumnHeader } from "@hascanb/arf-ui-kit/datatable-kit"
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
import type { BranchEntitlementRow } from "../_types"

function formatMoney(value: number): string {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

function formatPercent(value: number): string {
  return `%${(value * 100).toFixed(0)}`
}

export function getBranchEntitlementColumns(): ColumnDef<BranchEntitlementRow>[] {
  return [
    {
      accessorKey: "branchName",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Şube" />,
      cell: ({ row }) => (
        <div>
          <p className="font-medium text-slate-900">{row.original.branchName}</p>
          <p className="text-xs text-slate-500">{row.original.branchCode}</p>
        </div>
      ),
    },
    {
      accessorKey: "alimHakedisOrani",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Alım Hakediş Oranı" />,
      cell: ({ row }) => <span className="text-sm text-slate-700">{formatPercent(row.original.alimHakedisOrani)}</span>,
    },
    {
      accessorKey: "dagitimHakedisOrani",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Dağıtım Hakediş Oranı" />,
      cell: ({ row }) => <span className="text-sm text-slate-700">{formatPercent(row.original.dagitimHakedisOrani)}</span>,
    },
    {
      accessorKey: "alimHakedisTotal",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Alım Hakediş Toplamı" />,
      cell: ({ row }) => <span className="text-slate-800">{formatMoney(row.original.alimHakedisTotal)}</span>,
    },
    {
      accessorKey: "dagitimHakedisTotal",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Dağıtım Hakediş Toplamı" />,
      cell: ({ row }) => <span className="text-slate-800">{formatMoney(row.original.dagitimHakedisTotal)}</span>,
    },
    {
      accessorKey: "toplamHakedis",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Toplam Hakediş" />,
      cell: ({ row }) => <span className="font-semibold text-slate-900">{formatMoney(row.original.toplamHakedis)}</span>,
    },
    {
      accessorKey: "teslimatiBeklenen",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Teslimatı Beklenen" />,
      cell: ({ row }) => (
        <span className={cn("font-medium", row.original.teslimatiBeklenen > 0 ? "text-amber-700" : "text-slate-500")}>
          {formatMoney(row.original.teslimatiBeklenen)}
        </span>
      ),
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
      accessorKey: "kargoAdedi",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Kargo Adedi" />,
      cell: ({ row }) => <span className="text-sm text-slate-700">{row.original.kargoAdedi.toLocaleString("tr-TR")}</span>,
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
              <DropdownMenuLabel>{`${row.original.branchName} İşlemler:`}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onSelect={() => {
                  console.log("Detay Görüntüle:", row.original.branchId)
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
