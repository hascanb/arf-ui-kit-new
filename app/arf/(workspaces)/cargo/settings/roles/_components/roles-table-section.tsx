"use client"

import { useEffect, useMemo, useState, type ChangeEvent } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import type { OnChangeFn, PaginationState, Table as TanStackTable } from "@tanstack/react-table"
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
import {
  activateRole,
  deleteRole,
  fetchRoleDetail,
  fetchRoles,
  suspendRole,
} from "../_api/roles-api"
import { getRolesListColumns } from "../_columns/roles-list-columns"
import { useRoleFilters } from "../_hooks/use-role-filters"
import type { ModuleCategory, PermissionDefinition, RoleDetail, RoleRecord } from "../_types"
import { CreateRoleModal } from "./create-role-modal"
import { RoleCopyAction } from "./role-copy-action"

interface Props {
  data: RoleRecord[]
  categories: ModuleCategory[]
  definitions: PermissionDefinition[]
}

export function RolesTableSection({ data, categories, definitions }: Props) {
  const [rows, setRows] = useState<RoleRecord[]>(data)
  const [table, setTable] = useState<TanStackTable<RoleRecord> | null>(null)
  const [createOpen, setCreateOpen] = useState(false)
  const [editRole, setEditRole] = useState<RoleDetail | null>(null)

  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const query = searchParams.get("q") ?? ""
  const statusFilter = searchParams.get("status") ?? "all"
  const typeFilter = searchParams.get("type") ?? "all"
  const sortBy = searchParams.get("sortBy") ?? "userCount"
  const pageParam = Number(searchParams.get("page") ?? "0")
  const currentPage = Number.isFinite(pageParam) && pageParam >= 0 ? pageParam : 0

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: currentPage,
    pageSize: 10,
  })

  const filteredRows = useRoleFilters(rows, {
    q: query,
    status: statusFilter,
    type: typeFilter,
    sortBy,
  })

  const updateQueryParam = (key: string, value: string, resetPage = true) => {
    const params = new URLSearchParams(searchParams.toString())
    if (!value || value === "all") {
      params.delete(key)
    } else {
      params.set(key, value)
    }
    if (resetPage) {
      params.delete("page")
    }
    router.replace(params.size > 0 ? `${pathname}?${params.toString()}` : pathname)
  }

  const handlePaginationChange: OnChangeFn<PaginationState> = (next) => {
    setPagination((prev) => {
      const resolved = typeof next === "function" ? next(prev) : next
      if (resolved.pageIndex === prev.pageIndex && resolved.pageSize === prev.pageSize) {
        return prev
      }

      const params = new URLSearchParams(searchParams.toString())
      if (resolved.pageIndex > 0) {
        params.set("page", String(resolved.pageIndex))
      } else {
        params.delete("page")
      }
      router.replace(params.size > 0 ? `${pathname}?${params.toString()}` : pathname)
      return resolved
    })
  }

  async function refreshRows() {
    const fresh = await fetchRoles()
    setRows(fresh)
  }

  const columns = useMemo(
    () =>
      getRolesListColumns({
        onEdit: async (role) => {
          const detail = await fetchRoleDetail(role.id)
          if (!detail) return
          setEditRole(detail)
        },
        onCopy: async (role) => {
          const nextName = window.prompt("Yeni rol adi", `${role.name} Kopyasi`)
          if (!nextName?.trim()) return
          const { copyRole } = await import("../_api/roles-api")
          const copied = await copyRole(role.id, nextName.trim())
          if (!copied) {
            window.alert("Rol kopyalanamadi")
            return
          }
          await refreshRows()
        },
        onSuspend: async (role) => {
          const updated =
            role.status === "active" ? await suspendRole(role.id) : await activateRole(role.id)
          if (!updated) return
          setRows((prev) => prev.map((item) => (item.id === role.id ? updated : item)))
        },
        onDelete: async (role) => {
          const confirmed = window.confirm(`${role.name} adli rol silinecek. Onayliyor musunuz?`)
          if (!confirmed) return
          const result = await deleteRole(role.id)
          if (!result.ok) {
            window.alert(result.reason ?? "Rol silinemedi")
            return
          }
          setRows((prev) => prev.filter((item) => item.id !== role.id))
        },
      }),
    [],
  )

  useEffect(() => {
    setRows(data)
  }, [data])

  useEffect(() => {
    setPagination((prev) => {
      if (prev.pageIndex === currentPage) return prev
      return { ...prev, pageIndex: currentPage }
    })
  }, [currentPage])

  return (
    <div className="space-y-4">
      <CreateRoleModal
        open={createOpen}
        categories={categories}
        definitions={definitions}
        roles={rows}
        onOpenChange={setCreateOpen}
        onSaved={() => void refreshRows()}
      />

      {editRole && (
        <CreateRoleModal
          open={!!editRole}
          mode="edit"
          initialRole={editRole}
          categories={categories}
          definitions={definitions}
          roles={rows}
          onOpenChange={(open) => {
            if (!open) setEditRole(null)
          }}
          onSaved={() => {
            setEditRole(null)
            void refreshRows()
          }}
        />
      )}

      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:flex-row lg:items-center lg:justify-between">
        <div className="grid flex-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
          <Input
            value={query}
            onChange={(event: ChangeEvent<HTMLInputElement>) => updateQueryParam("q", event.target.value)}
            placeholder="Rol adi veya aciklama ara..."
          />

          <Select
            value={statusFilter}
            onValueChange={(value: string) => updateQueryParam("status", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Durum" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tum Durumlar</SelectItem>
              <SelectItem value="active">Aktif</SelectItem>
              <SelectItem value="passive">Pasif</SelectItem>
            </SelectContent>
          </Select>

          <Select value={typeFilter} onValueChange={(value: string) => updateQueryParam("type", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Rol Tipi" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tum Tipler</SelectItem>
              <SelectItem value="system">Sistem</SelectItem>
              <SelectItem value="custom">Ozel</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={sortBy}
            onValueChange={(value: string) => updateQueryParam("sortBy", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Siralama" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="userCount">Kullanici Sayisi</SelectItem>
              <SelectItem value="createdAt">Olusturma Tarihi</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button type="button" variant="outline" onClick={() => router.replace(pathname)}>
            Filtreleri Sifirla
          </Button>
          {(filteredRows[0] ?? rows[0]) && (
            <RoleCopyAction role={(filteredRows[0] ?? rows[0]) as RoleRecord} onCopied={() => void refreshRows()} />
          )}
          <Button type="button" onClick={() => setCreateOpen(true)}>
            + Yeni Rol Olustur
          </Button>
        </div>
      </div>

      <DataTable
        data={filteredRows}
        columns={columns}
        onTableReady={setTable}
        pagination={pagination}
        onPaginationChange={handlePaginationChange}
      />
      {table && <DataTablePagination table={table as TanStackTable<unknown>} />}
    </div>
  )
}
