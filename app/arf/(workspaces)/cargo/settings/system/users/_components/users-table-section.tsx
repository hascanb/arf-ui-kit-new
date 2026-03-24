"use client"

import { useMemo, useState, type ChangeEvent } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import type { Table as TanStackTable } from "@tanstack/react-table"
import { DataTable, DataTablePagination } from "@hascanb/arf-ui-kit/datatable-kit"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { deactivateUser, reactivateUser, suspendUser } from "../_api/users-api"
import { getUsersListColumns } from "../_columns/users-list-columns"
import type { LocationOption, UserRecord } from "../_types"
import { USER_ROLE_LABELS } from "../_types"
import { CreateUserModal } from "./create-user-modal"
import { ExportUsersAction } from "./export-users-action"
import { UserEditModal } from "./user-edit-modal"
import { useUserRoleFilters } from "../_hooks/use-user-role-filters"

interface Props {
  data: UserRecord[]
  locations: LocationOption[]
}

export function UsersTableSection({ data, locations }: Props) {
  const [rows, setRows] = useState<UserRecord[]>(data)
  const [table, setTable] = useState<TanStackTable<UserRecord> | null>(null)
  const [createOpen, setCreateOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<UserRecord | null>(null)
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const query = searchParams.get("q") ?? ""
  const roleFilter = searchParams.get("role") ?? "all"
  const locationFilter = searchParams.get("location") ?? "all"
  const statusFilter = searchParams.get("status") ?? "all"

  const updateQueryParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (!value || value === "all") {
      params.delete(key)
    } else {
      params.set(key, value)
    }
    router.replace(params.size > 0 ? `${pathname}?${params.toString()}` : pathname)
  }

  const filteredRows = useUserRoleFilters(rows, {
    q: query,
    role: roleFilter,
    location: locationFilter,
    status: statusFilter,
  })

  const columns = useMemo(
    () =>
      getUsersListColumns({
        onEdit: (user) => setEditingUser(user),
        onSuspend: async (user) => {
          const confirmed = window.confirm(
            `${user.firstName} ${user.lastName} adlı kullanıcı askıya alınacak. Onaylıyor musunuz?`,
          )
          if (!confirmed) return
          const updated = await suspendUser(user.id)
          if (!updated) return
          setRows((prev) => prev.map((item) => (item.id === user.id ? updated : item)))
        },
        onReactivate: async (user) => {
          const confirmed = window.confirm(
            `${user.firstName} ${user.lastName} adlı kullanıcı aktifleştirilecek. Onaylıyor musunuz?`,
          )
          if (!confirmed) return
          const updated = await reactivateUser(user.id)
          if (!updated) return
          setRows((prev) => prev.map((item) => (item.id === user.id ? updated : item)))
        },
        onDeactivate: async (user) => {
          const confirmed = window.confirm(
            `${user.firstName} ${user.lastName} adlı kullanıcı pasife alınacak. Onaylıyor musunuz?`,
          )
          if (!confirmed) return
          const updated = await deactivateUser(user.id)
          if (!updated) return
          setRows((prev) => prev.map((item) => (item.id === user.id ? updated : item)))
        },
      }),
    [],
  )

  return (
    <div className="space-y-4">
      <CreateUserModal
        open={createOpen}
        onOpenChange={setCreateOpen}
        locations={locations}
        onCreate={(created: UserRecord) => {
          setRows((prev) => [created, ...prev])
        }}
      />
      {editingUser && (
        <UserEditModal
          open={!!editingUser}
          user={editingUser}
          locations={locations}
          onOpenChange={(open) => {
            if (!open) setEditingUser(null)
          }}
          onSaved={(updated) => {
            setRows((prev) => prev.map((item) => (item.id === updated.id ? updated : item)))
            setEditingUser(null)
          }}
        />
      )}

      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:flex-row lg:items-center lg:justify-between">
        <div className="grid flex-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
          <Input
            value={query}
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              updateQueryParam("q", event.target.value)
            }
            placeholder="Ad, soyad veya e-posta ara..."
          />

          <Select value={roleFilter} onValueChange={(value: string) => updateQueryParam("role", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Rol" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tüm Roller</SelectItem>
              {(Object.entries(USER_ROLE_LABELS) as [string, string][]).map(([key, label]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={locationFilter}
            onValueChange={(value: string) => updateQueryParam("location", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Birim" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tüm Birimler</SelectItem>
              {locations.map((loc) => (
                <SelectItem key={loc.id} value={loc.id}>
                  {loc.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={statusFilter}
            onValueChange={(value: string) => updateQueryParam("status", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Durum" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tüm Durumlar</SelectItem>
              <SelectItem value="active">Aktif</SelectItem>
              <SelectItem value="passive">Pasif</SelectItem>
              <SelectItem value="suspended">Askıya Alındı</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.replace(pathname)}
          >
            Filtreleri Sıfırla
          </Button>
          <ExportUsersAction rows={filteredRows} />
          <Button type="button" onClick={() => setCreateOpen(true)}>
            + Yeni Kullanıcı Ekle
          </Button>
        </div>
      </div>

      <DataTable data={filteredRows} columns={columns} onTableReady={setTable} />
      {table && <DataTablePagination table={table as TanStackTable<unknown>} />}
    </div>
  )
}
