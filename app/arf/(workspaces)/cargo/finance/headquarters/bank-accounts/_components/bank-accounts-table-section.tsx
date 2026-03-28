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
import { createBankAccount, setBankAccountStatus } from "../_api/bank-accounts-api"
import { getBankAccountsListColumns } from "../_columns/bank-accounts-list-columns"
import type { BankAccountRecord } from "../_types"
import { CreateBankAccountModal } from "./create-bank-account-modal"
import { mockBranches } from "../../../../settings/system/branches/_mock/branches-mock-data"

interface Props {
  data: BankAccountRecord[]
}

function matchesSearch(row: BankAccountRecord, query: string): boolean {
  const normalizedQuery = query.toLocaleLowerCase("tr-TR")
  return [row.bankName, row.branchName, row.label, row.accountHolder, row.iban]
    .join(" ")
    .toLocaleLowerCase("tr-TR")
    .includes(normalizedQuery)
}

export function BankAccountsTableSection({ data }: Props) {
  const [rows, setRows] = useState<BankAccountRecord[]>(data)
  const [table, setTable] = useState<TanStackTable<BankAccountRecord> | null>(null)
  const [createOpen, setCreateOpen] = useState(false)
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const query = searchParams.get("q") ?? ""
  const status = searchParams.get("status") ?? "all"
  const currency = searchParams.get("currency") ?? "all"
  const accountType = searchParams.get("accountType") ?? "all"

  const activeBranches = useMemo(
    () => mockBranches.filter((branch) => branch.aktif).map((branch) => ({ id: branch.id, name: branch.ad })),
    [],
  )

  const updateQueryParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (!value || value === "all") {
      params.delete(key)
    } else {
      params.set(key, value)
    }
    router.replace(params.size > 0 ? `${pathname}?${params.toString()}` : pathname)
  }

  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      if (query && !matchesSearch(row, query)) {
        return false
      }
      if (status !== "all" && row.status !== status) {
        return false
      }
      if (currency !== "all" && row.currency !== currency) {
        return false
      }
      if (accountType !== "all" && row.accountType !== accountType) {
        return false
      }
      return true
    })
  }, [accountType, currency, query, rows, status])

  const columns = useMemo(
    () =>
      getBankAccountsListColumns(async (row) => {
        const nextStatus = row.status === "active" ? "closed" : "active"
        const confirmed = window.confirm(
          `Banka hesabı ${nextStatus === "active" ? "kullanıma açılacak" : "kapatılacak"}. Onaylıyor musunuz?`,
        )

        if (!confirmed) {
          return
        }

        const updated = await setBankAccountStatus(row.id, nextStatus)
        if (!updated) {
          return
        }

        setRows((prev) => prev.map((item) => (item.id === row.id ? updated : item)))
      }),
    [],
  )

  return (
    <div className="space-y-4">
      <CreateBankAccountModal
        open={createOpen}
        onOpenChange={setCreateOpen}
        branches={activeBranches}
        onCreate={async (payload) => {
          const created = await createBankAccount(payload)
          setRows((prev) => [created, ...prev])
        }}
      />

      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:flex-row lg:items-center lg:justify-between">
        <div className="grid flex-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
          <Input
            value={query}
            onChange={(event: ChangeEvent<HTMLInputElement>) => updateQueryParam("q", event.target.value)}
            placeholder="IBAN veya etiket ara..."
          />

          <Select value={status} onValueChange={(value: string) => updateQueryParam("status", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Statü" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tüm Statüler</SelectItem>
              <SelectItem value="active">Kullanımda</SelectItem>
              <SelectItem value="closed">Kapalı</SelectItem>
            </SelectContent>
          </Select>

          <Select value={currency} onValueChange={(value: string) => updateQueryParam("currency", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Para Birimi" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tüm Para Birimleri</SelectItem>
              <SelectItem value="TRY">TRY</SelectItem>
              <SelectItem value="USD">USD</SelectItem>
              <SelectItem value="EUR">EUR</SelectItem>
            </SelectContent>
          </Select>

          <Select value={accountType} onValueChange={(value: string) => updateQueryParam("accountType", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Hesap Türü" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tüm Hesap Türleri</SelectItem>
              <SelectItem value="collection">Tahsilat</SelectItem>
              <SelectItem value="expense">Gider / Ödeme</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              router.replace(pathname)
            }}
          >
            Filtreleri Sıfırla
          </Button>
          <Button type="button" onClick={() => setCreateOpen(true)}>
            Banka Hesabı Oluştur
          </Button>
        </div>
      </div>

      <DataTable data={filteredRows} columns={columns} onTableReady={setTable} />

      {table && <DataTablePagination table={table as TanStackTable<unknown>} />}
    </div>
  )
}