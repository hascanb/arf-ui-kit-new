"use client"

import { useMemo, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import type { Table as TanStackTable } from "@tanstack/react-table"
import { DataTable, DataTableColumnHeader, DataTablePagination } from "@hascanb/arf-ui-kit/datatable-kit"
import type { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { AuditLogEntry } from "../../_types/audit-log"

interface Props {
  auditLogs: AuditLogEntry[]
}

const ACTION_LABELS: Record<AuditLogEntry["action"], string> = {
  login: "Giriş",
  logout: "Çıkış",
  shipment_status_updated: "Gönderi Güncellendi",
  shipment_created: "Gönderi Oluşturuldu",
  user_created: "Kullanıcı Oluşturuldu",
  user_modified: "Kullanıcı Düzenlendi",
  user_suspended: "Kullanıcı Askıya Alındı",
  password_changed: "Şifre Değiştirildi",
  role_changed: "Rol Değiştirildi",
}

const RESOURCE_LABELS: Record<AuditLogEntry["resourceType"], string> = {
  shipment: "Gönderi",
  user: "Kullanıcı",
  system: "Sistem",
  finance: "Finans",
}

const ACTION_BADGE_CLASSES: Partial<Record<AuditLogEntry["action"], string>> = {
  login: "bg-emerald-50 text-emerald-700 border-emerald-200",
  logout: "bg-slate-100 text-slate-600 border-slate-200",
  user_suspended: "bg-red-100 text-red-700 border-red-200",
  password_changed: "bg-amber-100 text-amber-700 border-amber-200",
  role_changed: "bg-purple-100 text-purple-700 border-purple-200",
  shipment_status_updated: "bg-blue-100 text-blue-700 border-blue-200",
  shipment_created: "bg-teal-100 text-teal-700 border-teal-200",
}

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("tr-TR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

const columns: ColumnDef<AuditLogEntry>[] = [
  {
    accessorKey: "timestamp",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Tarih / Saat" />,
    cell: ({ row }) => (
      <span className="text-xs text-slate-600">{formatDateTime(row.original.timestamp)}</span>
    ),
  },
  {
    accessorKey: "action",
    header: ({ column }) => <DataTableColumnHeader column={column} title="İşlem" />,
    cell: ({ row }) => {
      const action = row.original.action
      return (
        <Badge
          variant="outline"
          className={`text-xs ${ACTION_BADGE_CLASSES[action] ?? "bg-slate-100 text-slate-700 border-slate-200"}`}
        >
          {ACTION_LABELS[action] ?? action}
        </Badge>
      )
    },
  },
  {
    accessorKey: "resourceType",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Kaynak" />,
    cell: ({ row }) => (
      <span className="text-xs text-slate-700">
        {RESOURCE_LABELS[row.original.resourceType]}
      </span>
    ),
  },
  {
    accessorKey: "description",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Açıklama" />,
    cell: ({ row }) => (
      <span className="text-xs text-slate-600">{row.original.description}</span>
    ),
  },
  {
    accessorKey: "ipAddress",
    header: ({ column }) => <DataTableColumnHeader column={column} title="IP Adresi" />,
    cell: ({ row }) => (
      <span className="font-mono text-xs text-slate-500">
        {row.original.ipAddress ?? "—"}
      </span>
    ),
  },
]

export function UserAuditTrailSection({ auditLogs }: Props) {
  const [table, setTable] = useState<TanStackTable<AuditLogEntry> | null>(null)
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const query = searchParams.get("logQ") ?? ""
  const actionFilter = searchParams.get("logAction") ?? "all"

  function updateQueryParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (!value || value === "all") {
      params.delete(key)
    } else {
      params.set(key, value)
    }
    router.replace(params.size > 0 ? `${pathname}?${params.toString()}` : pathname)
  }

  const filteredLogs = useMemo(() => {
    return auditLogs.filter((log) => {
      if (actionFilter !== "all" && log.action !== actionFilter) return false
      if (query) {
        const q = query.toLocaleLowerCase("tr-TR")
        if (
          !log.description.toLocaleLowerCase("tr-TR").includes(q) &&
          !(log.ipAddress ?? "").includes(q) &&
          !ACTION_LABELS[log.action].toLocaleLowerCase("tr-TR").includes(q)
        ) {
          return false
        }
      }
      return true
    })
  }, [auditLogs, actionFilter, query])

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <Input
          placeholder="Açıklama veya IP ara..."
          value={query}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateQueryParam("logQ", e.target.value)}
          className="h-8 w-56 text-sm"
        />
        <Select value={actionFilter} onValueChange={(v: string) => updateQueryParam("logAction", v)}>
          <SelectTrigger className="h-8 w-48 text-xs">
            <SelectValue placeholder="İşlem tipi" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tüm işlemler</SelectItem>
            {(Object.entries(ACTION_LABELS) as [AuditLogEntry["action"], string][]).map(
              ([key, label]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              ),
            )}
          </SelectContent>
        </Select>
      </div>

      <DataTable columns={columns} data={filteredLogs} onTableReady={setTable} />
      {table && <DataTablePagination table={table as TanStackTable<unknown>} />}
    </div>
  )
}
