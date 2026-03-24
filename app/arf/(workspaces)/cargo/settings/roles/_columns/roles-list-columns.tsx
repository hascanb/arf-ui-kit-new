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
import { ChevronDown, Copy, Eye, Pencil, Trash2 } from "lucide-react"
import type { RoleRecord } from "../_types"
import { ROLE_STATUS_LABELS } from "../_types"
import { SystemRoleBadge } from "../_components/system-role-badge"

const ROLES_BASE = "/arf/cargo/settings/roles"

interface ColumnActions {
  onEdit: (role: RoleRecord) => void
  onCopy: (role: RoleRecord) => void
  onSuspend: (role: RoleRecord) => void
  onDelete: (role: RoleRecord) => void
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })
}

export function getRolesListColumns(actions: ColumnActions): ColumnDef<RoleRecord>[] {
  return [
    {
      accessorKey: "name",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Rol Adi" />,
      cell: ({ row }) => (
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-medium text-slate-900">{row.original.name}</span>
            <SystemRoleBadge isSystem={row.original.roleType === "system"} />
          </div>
          {row.original.description && (
            <p className="line-clamp-1 text-xs text-slate-500">{row.original.description}</p>
          )}
        </div>
      ),
    },
    {
      id: "userCount",
      accessorFn: (row) => row.userCount,
      header: ({ column }) => <DataTableColumnHeader column={column} title="Kullanici Sayisi" />,
      cell: ({ row }) => (
        <Link
          href={`/arf/cargo/settings/users?role=${row.original.id}`}
          className="font-medium text-blue-700 hover:underline"
        >
          {row.original.userCount} Kisi
        </Link>
      ),
    },
    {
      accessorKey: "updatedAt",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Olusturulma / Son Guncelleme" />,
      cell: ({ row }) => (
        <div className="space-y-1">
          <div>
            <p className="text-xs text-slate-500">Olusturulma</p>
            <p className="text-sm text-slate-700">{formatDate(row.original.createdAt)}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Son Guncelleme</p>
            <p className="text-sm text-slate-700">{formatDate(row.original.updatedAt)}</p>
            <p className="text-xs text-slate-500">{row.original.updatedBy}</p>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Durum" />,
      cell: ({ row }) => (
        <Badge
          variant="outline"
          className={cn(
            "border text-xs",
            row.original.status === "active"
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-slate-200 bg-slate-50 text-slate-600",
          )}
        >
          {ROLE_STATUS_LABELS[row.original.status]}
        </Badge>
      ),
    },
    {
      id: "actions",
      enableSorting: false,
      enableHiding: false,
      header: () => <span className="sr-only">Islemler</span>,
      cell: ({ row }) => {
        const role = row.original
        const canDelete = role.roleType !== "system" && role.status === "passive"

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button type="button" variant="outline" className="h-8 rounded-lg px-2.5 text-xs">
                Islemler <ChevronDown className="ml-1 size-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`${ROLES_BASE}/${role.id}`}>
                  <Eye className="mr-2 size-4" />
                  Detay
                </Link>
              </DropdownMenuItem>

              {role.roleType !== "system" && (
                <DropdownMenuItem onClick={() => actions.onEdit(role)}>
                  <Pencil className="mr-2 size-4" />
                  Duzenle
                </DropdownMenuItem>
              )}

              <DropdownMenuItem onClick={() => actions.onCopy(role)}>
                <Copy className="mr-2 size-4" />
                Kopyala
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              {role.status === "active" ? (
                <DropdownMenuItem onClick={() => actions.onSuspend(role)}>
                  Pasife Cek
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem onClick={() => actions.onSuspend(role)}>
                  Aktif Et
                </DropdownMenuItem>
              )}

              {role.roleType !== "system" && (
                <DropdownMenuItem
                  disabled={!canDelete}
                  className={canDelete ? "text-red-600 focus:text-red-600" : "text-slate-400"}
                  onClick={() => canDelete && actions.onDelete(role)}
                >
                  <Trash2 className="mr-2 size-4" />
                  Sil
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]
}
