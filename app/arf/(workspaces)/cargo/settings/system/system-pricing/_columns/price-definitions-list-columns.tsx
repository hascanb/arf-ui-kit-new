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
import type { PriceDefinitionRecord } from "../_types"
import { ChevronDown, Copy, Download, Eye, PencilLine, Power, PowerOff, Star } from "lucide-react"

function isExpired(validTo: string): boolean {
  const today = new Date().toISOString().slice(0, 10)
  return validTo < today
}

interface Actions {
  onEdit: (id: string) => void
  onClone: (id: string) => void
  onExport: (id: string, format: "pdf" | "excel") => void
  onToggleStatus: (row: PriceDefinitionRecord) => void
}

export function getPriceDefinitionsListColumns(actions: Actions): ColumnDef<PriceDefinitionRecord>[] {
  return [
    {
      id: "name",
      accessorFn: (row) => row.name,
      header: ({ column }) => <DataTableColumnHeader column={column} title="Tarife Adı & Kodu" />,
      cell: ({ row }) => (
        <div>
          <p className="font-medium text-slate-900">{row.original.name}</p>
          <p className="text-xs font-mono text-slate-500">{row.original.code}</p>
        </div>
      ),
    },
    {
      accessorKey: "isDefault",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Varsayılan" />,
      cell: ({ row }) =>
        row.original.isDefault ? (
          <Badge variant="outline" className="border-amber-200 bg-amber-50 text-amber-700">
            <Star className="mr-1 size-3.5 fill-amber-500 text-amber-500" />
            Default
          </Badge>
        ) : (
          <span className="text-xs text-slate-400">-</span>
        ),
    },
    {
      id: "validity",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Geçerlilik Aralığı" />,
      cell: ({ row }) => (
        <div className={cn("text-sm", isExpired(row.original.validTo) ? "text-slate-400" : "text-slate-700")}>
          {new Date(row.original.validFrom).toLocaleDateString("tr-TR")} - {new Date(row.original.validTo).toLocaleDateString("tr-TR")}
        </div>
      ),
    },
    {
      accessorKey: "ruleCount",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Kural Sayısı" />,
      cell: ({ row }) => <span className="text-sm font-medium text-slate-700">{row.original.ruleCount} Kural</span>,
    },
    {
      accessorKey: "status",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Durum" />,
      cell: ({ row }) => (
        <Badge
          variant="outline"
          className={cn(
            "border",
            row.original.status === "active"
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-red-200 bg-red-50 text-red-700",
          )}
        >
          {row.original.status === "active" ? "Aktif" : "Pasif"}
        </Badge>
      ),
    },
    {
      id: "actions",
      header: () => <span className="sr-only">İşlemler</span>,
      enableSorting: false,
      enableHiding: false,
      cell: ({ row }) => (
        <div className="flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 rounded-lg px-2.5 text-xs">
                İşlemler
                <ChevronDown className="ml-1 size-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem asChild>
                <Link href={`/arf/cargo/settings/system/system-pricing/${row.original.id}`}>
                  <Eye className="mr-2 size-4" />
                  Görüntüle / Düzenle
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => actions.onEdit(row.original.id)}>
                <PencilLine className="mr-2 size-4" />
                Hızlı Düzenle
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => actions.onClone(row.original.id)}>
                <Copy className="mr-2 size-4" />
                Kopyala (Clone)
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => actions.onExport(row.original.id, "excel")}>
                <Download className="mr-2 size-4" />
                Dışa Aktar (Excel)
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => actions.onToggleStatus(row.original)}>
                {row.original.status === "active" ? (
                  <PowerOff className="mr-2 size-4" />
                ) : (
                  <Power className="mr-2 size-4" />
                )}
                {row.original.status === "active" ? "Pasif Yap" : "Aktif Yap"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ]
}
