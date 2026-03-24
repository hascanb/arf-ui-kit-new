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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
const USERS_BASE = "/arf/cargo/settings/system/users"
import { ChevronDown, Eye, Pencil, ShieldBan, ShieldCheck, UserX } from "lucide-react"
import type { UserRecord, UserRole, UserStatus } from "../_types"
import { USER_ROLE_LABELS } from "../_types"

function formatRelativeTime(isoString: string | undefined): string {
  if (!isoString) return "—"
  const diffMs = Date.now() - new Date(isoString).valueOf()
  const diffMin = Math.floor(diffMs / 60_000)
  if (diffMin < 60) return `${diffMin} dk önce`
  const diffHr = Math.floor(diffMin / 60)
  if (diffHr < 24) return `${diffHr} saat önce`
  const diffDay = Math.floor(diffHr / 24)
  return `${diffDay} gün önce`
}

function getRoleBadgeClass(role: UserRole): string {
  switch (role) {
    case "superadmin":
      return "border-slate-700 bg-slate-800 text-white"
    case "hq_manager":
      return "border-violet-200 bg-violet-50 text-violet-700"
    case "tm_manager":
      return "border-blue-200 bg-blue-50 text-blue-700"
    case "branch_manager":
      return "border-emerald-200 bg-emerald-50 text-emerald-700"
    case "courier":
      return "border-amber-200 bg-amber-50 text-amber-700"
    case "operator":
      return "border-sky-200 bg-sky-50 text-sky-700"
    default:
      return "border-slate-200 bg-slate-50 text-slate-700"
  }
}

function getStatusBadgeClass(status: UserStatus): string {
  switch (status) {
    case "active":
      return "border-emerald-200 bg-emerald-50 text-emerald-700"
    case "passive":
      return "border-slate-200 bg-slate-50 text-slate-500"
    case "suspended":
      return "border-red-200 bg-red-50 text-red-700"
    default:
      return "border-slate-200 bg-slate-50 text-slate-700"
  }
}

function getStatusLabel(status: UserStatus): string {
  switch (status) {
    case "active":
      return "Aktif"
    case "passive":
      return "Pasif"
    case "suspended":
      return "Askıya Alındı"
    default:
      return status
  }
}

interface ColumnActions {
  onEdit: (row: UserRecord) => void
  onSuspend: (row: UserRecord) => void
  onReactivate: (row: UserRecord) => void
  onDeactivate: (row: UserRecord) => void
}

export function getUsersListColumns(actions: ColumnActions): ColumnDef<UserRecord>[] {
  return [
    {
      id: "fullName",
      accessorFn: (row) => `${row.firstName} ${row.lastName}`,
      header: ({ column }) => <DataTableColumnHeader column={column} title="Ad Soyad" />,
      cell: ({ row }) => {
        const initials = `${row.original.firstName[0] ?? ""}${row.original.lastName[0] ?? ""}`.toUpperCase()
        return (
          <div className="flex items-center gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-slate-100 text-xs font-semibold text-slate-700">
              {initials}
            </div>
            <div>
              <p className="font-medium text-slate-900">
                {row.original.firstName} {row.original.lastName}
              </p>
              {row.original.isTemporaryPassword && (
                <p className="text-xs text-amber-600">Şifre aktivasyonu bekleniyor</p>
              )}
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: "email",
      header: ({ column }) => <DataTableColumnHeader column={column} title="E-posta" />,
      cell: ({ row }) => (
        <span className="text-sm text-slate-700">{row.original.email}</span>
      ),
    },
    {
      accessorKey: "role",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Rol" />,
      cell: ({ row }) => (
        <Badge
          variant="outline"
          className={cn("border text-xs", getRoleBadgeClass(row.original.role))}
        >
          {USER_ROLE_LABELS[row.original.role]}
        </Badge>
      ),
    },
    {
      id: "location",
      accessorFn: (row) => row.locationName ?? "Tüm Sistem",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Bağlı Birim" />,
      cell: ({ row }) => (
        <span className="text-sm text-slate-700">
          {row.original.locationName ?? "Tüm Sistem"}
        </span>
      ),
    },
    {
      accessorKey: "phoneNumber",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Telefon" />,
      cell: ({ row }) => (
        <span className="text-sm text-slate-600">{row.original.phoneNumber}</span>
      ),
    },
    {
      accessorKey: "lastLogin",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Son Giriş" />,
      cell: ({ row }) => (
        <span className="text-sm text-slate-500">
          {formatRelativeTime(row.original.lastLogin)}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Durum" />,
      cell: ({ row }) => (
        <Badge
          variant="outline"
          className={cn("border text-xs", getStatusBadgeClass(row.original.status))}
        >
          {getStatusLabel(row.original.status)}
        </Badge>
      ),
    },
    {
      id: "actions",
      enableSorting: false,
      enableHiding: false,
      header: () => <span className="sr-only">İşlemler</span>,
      cell: ({ row }) => {
        const user = row.original
        const detailUrl = `${USERS_BASE}/${user.id}`
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button type="button" variant="outline" className="h-8 rounded-lg px-2.5 text-xs">
                İşlemler <ChevronDown className="ml-1 size-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={detailUrl}>
                  <Eye className="mr-2 size-4" />
                  Detay Görüntüle
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => actions.onEdit(user)}>
                <Pencil className="mr-2 size-4 text-slate-600" />
                Düzenle
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {user.status !== "active" && (
                <DropdownMenuItem onClick={() => actions.onReactivate(user)}>
                  <ShieldCheck className="mr-2 size-4 text-emerald-600" />
                  Aktifleştir
                </DropdownMenuItem>
              )}
              {user.status === "active" && (
                <DropdownMenuItem onClick={() => actions.onSuspend(user)}>
                  <ShieldBan className="mr-2 size-4 text-amber-600" />
                  Askıya Al
                </DropdownMenuItem>
              )}
              {user.status !== "passive" && (
                <DropdownMenuItem onClick={() => actions.onDeactivate(user)}>
                  <UserX className="mr-2 size-4 text-slate-500" />
                  Pasife Al
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]
}
