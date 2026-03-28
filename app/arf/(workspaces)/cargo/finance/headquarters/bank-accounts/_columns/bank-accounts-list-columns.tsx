"use client"

import Link from "next/link"
import type { ColumnDef } from "@tanstack/react-table"
import { DataTableColumnHeader } from "@hascanb/arf-ui-kit/datatable-kit"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import type { BankAccountRecord, Currency } from "../_types"
import { ChevronDown, Copy, Eye, Link2, Power, PowerOff } from "lucide-react"

function formatMoney(value: number, currency: Currency): string {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

function getCurrencyBadgeClass(currency: Currency): string {
  switch (currency) {
    case "USD":
      return "border-amber-200 bg-amber-50 text-amber-700"
    case "EUR":
      return "border-violet-200 bg-violet-50 text-violet-700"
    default:
      return "border-blue-200 bg-blue-50 text-blue-700"
  }
}

function getStatusBadgeClass(status: BankAccountRecord["status"]): string {
  return status === "active"
    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
    : "border-red-200 bg-red-50 text-red-700"
}

function getIntegrationBadgeClass(status: BankAccountRecord["integrationStatus"]): string {
  return status === "active"
    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
    : "border-red-200 bg-red-50 text-red-700"
}

function getAccountTypeBadgeClass(type: BankAccountRecord["accountType"]): string {
  return type === "collection"
    ? "border-sky-200 bg-sky-50 text-sky-700"
    : "border-orange-200 bg-orange-50 text-orange-700"
}

export function getBankAccountsListColumns(
  onToggleStatus: (row: BankAccountRecord) => void,
): ColumnDef<BankAccountRecord>[] {
  return [
    {
      id: "bank",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Banka ve Şube" />,
      cell: ({ row }) => {
        const initials = row.original.bankName
          .split(" ")
          .slice(0, 2)
          .map((item) => item[0])
          .join("")
          .toUpperCase()

        return (
          <div className="flex items-center gap-3">
            <Avatar className="size-9 border border-slate-200 bg-white">
              <AvatarFallback className="bg-slate-100 text-xs font-semibold text-slate-700">{initials}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-slate-900">{row.original.bankName}</p>
              <p className="text-xs text-slate-500">{row.original.branchName}</p>
            </div>
          </div>
        )
      },
    },
    {
      id: "label",
      accessorFn: (row) => row.label,
      header: ({ column }) => <DataTableColumnHeader column={column} title="Etiket / Unvan" />,
      cell: ({ row }) => (
        <div>
          <p className="font-medium text-slate-900">{row.original.label}</p>
          <p className="text-xs text-slate-500">{row.original.accountHolder}</p>
        </div>
      ),
    },
    {
      accessorKey: "iban",
      header: ({ column }) => <DataTableColumnHeader column={column} title="IBAN" />,
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm text-slate-700">{row.original.iban.replace(/(.{4})/g, "$1 ").trim()}</span>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-7"
            onClick={() => void navigator.clipboard?.writeText(row.original.iban)}
          >
            <Copy className="size-3.5" />
            <span className="sr-only">IBAN kopyala</span>
          </Button>
        </div>
      ),
    },
    {
      accessorKey: "currency",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Para Birimi" />,
      cell: ({ row }) => (
        <Badge variant="outline" className={cn("border", getCurrencyBadgeClass(row.original.currency))}>
          {row.original.currency}
        </Badge>
      ),
    },
    {
      accessorKey: "balance",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Bakiye" />,
      cell: ({ row }) => <span className="font-medium text-slate-900">{formatMoney(row.original.balance, row.original.currency)}</span>,
    },
    {
      accessorKey: "accountType",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Hesap Türü" />,
      cell: ({ row }) => (
        <Badge variant="outline" className={cn("border", getAccountTypeBadgeClass(row.original.accountType))}>
          {row.original.accountType === "collection" ? "Tahsilat" : "Gider / Ödeme"}
        </Badge>
      ),
    },
    {
      accessorKey: "integrationStatus",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Entegrasyon" />,
      cell: ({ row }) => (
        <Badge variant="outline" className={cn("border", getIntegrationBadgeClass(row.original.integrationStatus))}>
          {row.original.integrationStatus === "active" ? "Aktif" : "Pasif"}
        </Badge>
      ),
    },
    {
      accessorKey: "status",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Statü" />,
      cell: ({ row }) => (
        <Badge variant="outline" className={cn("border", getStatusBadgeClass(row.original.status))}>
          {row.original.status === "active" ? "Kullanımda" : "Kapalı"}
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
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuItem asChild>
                <Link href={`/arf/cargo/finance/headquarters/bank-accounts/${row.original.id}`}>
                  <Eye className="mr-2 size-4" />
                  Detay Görüntüle
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => void navigator.clipboard?.writeText(row.original.iban)}>
                <Copy className="mr-2 size-4" />
                IBAN Kopyala
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => void navigator.clipboard?.writeText(`${window.location.origin}/arf/cargo/finance/headquarters/bank-accounts/${row.original.id}`)}>
                <Link2 className="mr-2 size-4" />
                Bağlantı Kopyala
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => onToggleStatus(row.original)}>
                {row.original.status === "active" ? (
                  <PowerOff className="mr-2 size-4" />
                ) : (
                  <Power className="mr-2 size-4" />
                )}
                {row.original.status === "active" ? "Kapat" : "Kullanıma Aç"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ]
}
