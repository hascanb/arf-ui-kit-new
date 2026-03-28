"use client"

import { useMemo, useState, type ChangeEvent } from "react"
import type { Table as TanStackTable } from "@tanstack/react-table"
import { DataTable, DataTablePagination } from "@hascanb/arf-ui-kit/datatable-kit"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import type { BankAccountTransaction, Currency } from "../../_types"
import { getTransactionsColumns } from "../_columns/transactions-columns"

interface Props {
  transactions: BankAccountTransaction[]
  currency: Currency
}

function formatMoney(value: number, currency: Currency): string {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

export function DetailTransactionsSection({ transactions, currency }: Props) {
  const [table, setTable] = useState<TanStackTable<BankAccountTransaction> | null>(null)
  const [query, setQuery] = useState("")
  const [fromDate, setFromDate] = useState("")
  const [toDate, setToDate] = useState("")
  const [minAmount, setMinAmount] = useState("")
  const [maxAmount, setMaxAmount] = useState("")

  const columns = useMemo(() => getTransactionsColumns(), [])

  const filteredRows = useMemo(() => {
    return transactions.filter((item) => {
      if (query && !item.description.toLocaleLowerCase("tr-TR").includes(query.toLocaleLowerCase("tr-TR"))) {
        return false
      }
      if (fromDate && item.date.slice(0, 10) < fromDate) {
        return false
      }
      if (toDate && item.date.slice(0, 10) > toDate) {
        return false
      }
      if (minAmount && item.amount < Number(minAmount)) {
        return false
      }
      if (maxAmount && item.amount > Number(maxAmount)) {
        return false
      }
      return true
    })
  }, [fromDate, maxAmount, minAmount, query, toDate, transactions])

  const totalCredit = filteredRows.filter((item) => item.direction === "credit").reduce((sum, item) => sum + item.amount, 0)
  const totalDebit = filteredRows.filter((item) => item.direction === "debit").reduce((sum, item) => sum + item.amount, 0)
  const currentBalance = filteredRows[0]?.balanceAfter ?? transactions[0]?.balanceAfter ?? 0

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="rounded-2xl border-slate-200 shadow-sm">
          <CardHeader className="pb-2">
            <CardDescription>Toplam Giriş</CardDescription>
            <CardTitle className="text-lg text-emerald-700">{formatMoney(totalCredit, currency)}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="rounded-2xl border-slate-200 shadow-sm">
          <CardHeader className="pb-2">
            <CardDescription>Toplam Çıkış</CardDescription>
            <CardTitle className="text-lg text-red-700">{formatMoney(totalDebit, currency)}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="rounded-2xl border-slate-200 shadow-sm">
          <CardHeader className="pb-2">
            <CardDescription>Güncel Bakiye</CardDescription>
            <CardTitle className="text-lg text-slate-900">{formatMoney(currentBalance, currency)}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card className="rounded-2xl border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle>Hesap Hareketleri</CardTitle>
          <CardDescription>Tarih aralığı ve tutar sınırları ile filtrelenebilir hareket listesi.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
            <Input value={query} onChange={(event: ChangeEvent<HTMLInputElement>) => setQuery(event.target.value)} placeholder="Açıklama ara..." />
            <Input type="date" value={fromDate} onChange={(event: ChangeEvent<HTMLInputElement>) => setFromDate(event.target.value)} />
            <Input type="date" value={toDate} onChange={(event: ChangeEvent<HTMLInputElement>) => setToDate(event.target.value)} />
            <Input type="number" inputMode="decimal" value={minAmount} onChange={(event: ChangeEvent<HTMLInputElement>) => setMinAmount(event.target.value)} placeholder="Min tutar" />
            <Input type="number" inputMode="decimal" value={maxAmount} onChange={(event: ChangeEvent<HTMLInputElement>) => setMaxAmount(event.target.value)} placeholder="Max tutar" />
          </div>

          <DataTable data={filteredRows} columns={columns} onTableReady={setTable} emptyMessage="Hareket bulunamadı." />
          {table && <DataTablePagination table={table as TanStackTable<unknown>} />}
        </CardContent>
      </Card>
    </div>
  )
}
