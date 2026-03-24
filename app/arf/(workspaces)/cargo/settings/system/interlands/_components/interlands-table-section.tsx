"use client"

import { useMemo, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import type { Table as TanStackTable } from "@tanstack/react-table"
import {
  DataTable,
  DataTablePagination,
  DataTableToolbar,
} from "@hascanb/arf-ui-kit/datatable-kit"
import { Button } from "@/components/ui/button"
import { createBlockedInterland } from "../_api/create-blocked-interland-api"
import { createInterland } from "../_api/create-interland-api"
import { mockBranches } from "../_mock/interlands-mock-data"
import { getInterlandsListColumns } from "../_columns/interlands-list-columns"
import type { InterlandRecord } from "../_types"
import { CreateBlockedInterlandModal } from "./create-blocked-interland-modal"
import { CreateInterlandModal } from "./create-interland-modal"

interface Props {
  data: InterlandRecord[]
}

export function InterlandsTableSection({ data }: Props) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const [rows, setRows] = useState<InterlandRecord[]>(data)
  const [table, setTable] = useState<TanStackTable<InterlandRecord> | null>(null)
  const [createOpen, setCreateOpen] = useState(false)
  const [createBlockedOpen, setCreateBlockedOpen] = useState(false)

  const statusQuery = searchParams.get("status") ?? "all"

  const columns = useMemo(
    () =>
      getInterlandsListColumns(
        (id: string) => {
          if (!window.confirm("İnterland durumu değiştirilecek. Onaylıyor musunuz?")) {
            return
          }
          setRows((prev) =>
            prev.map((item) =>
              item.id === id
                ? {
                    ...item,
                    status: item.status === "active" ? "passive" : "active",
                    updatedAt: new Date().toISOString(),
                  }
                : item,
            ),
          )
        },
        (id: string) => {
          if (!window.confirm("İnterland kaydı silinecek. Onaylıyor musunuz?")) {
            return
          }
          setRows((prev) => prev.filter((item) => item.id !== id))
        },
      ),
    [],
  )

  const filteredRows = useMemo(() => {
    if (statusQuery === "all") {
      return rows
    }
    return rows.filter((item) => item.status === statusQuery)
  }, [rows, statusQuery])

  const updateStatusQuery = (value: "all" | "active" | "passive") => {
    const params = new URLSearchParams(searchParams.toString())
    if (value === "all") {
      params.delete("status")
    } else {
      params.set("status", value)
    }
    router.replace(params.size > 0 ? `${pathname}?${params.toString()}` : pathname)
  }

  return (
    <div className="space-y-4">
      <CreateInterlandModal
        open={createOpen}
        onOpenChange={setCreateOpen}
        branches={mockBranches.map((item) => ({ id: item.id, name: item.name }))}
        onCreate={async (payload) => {
          const newRecord = await createInterland(payload)
          setRows((prev) => [newRecord, ...prev])
          return newRecord
        }}
      />
      <CreateBlockedInterlandModal
        open={createBlockedOpen}
        onOpenChange={setCreateBlockedOpen}
        onCreate={createBlockedInterland}
      />

      <div className="flex flex-wrap items-center gap-2">
        <Button onClick={() => setCreateOpen(true)}>İnterland Oluştur</Button>
        <Button variant="outline" onClick={() => setCreateBlockedOpen(true)}>
          Yasaklı İnterland Oluştur
        </Button>
        <Button variant={statusQuery === "all" ? "default" : "outline"} onClick={() => updateStatusQuery("all")}>Tüm Durumlar</Button>
        <Button variant={statusQuery === "active" ? "default" : "outline"} onClick={() => updateStatusQuery("active")}>Sadece Aktif</Button>
        <Button variant={statusQuery === "passive" ? "default" : "outline"} onClick={() => updateStatusQuery("passive")}>Sadece Pasif</Button>
      </div>

      {table && (
        <DataTableToolbar table={table} searchKey="name" searchPlaceholder="İnterland ara..." />
      )}

      <DataTable data={filteredRows} columns={columns} onTableReady={setTable} />

      {table && <DataTablePagination table={table as TanStackTable<unknown>} />}
    </div>
  )
}
