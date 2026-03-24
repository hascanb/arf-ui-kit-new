"use client"

import { useMemo, useState } from "react"
import type { Table as TanStackTable } from "@tanstack/react-table"
import { DataTable, DataTablePagination } from "@hascanb/arf-ui-kit/datatable-kit"
import { AppHeader } from "@hascanb/arf-ui-kit/layout-kit"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { setBankAccountStatus, updateBankAccount } from "../../_api/bank-accounts-api"
import { mockBranches } from "../../../branches/_mock/branches-mock-data"
import type { BankAccountDetail } from "../../_types"
import { getAuditColumns } from "../_columns/audit-columns"
import { BankAccountEditModal } from "./bank-account-edit-modal"
import { DetailHeaderCard } from "./detail-header-card"
import { DetailOverviewSection } from "./detail-overview-section"
import { DetailTransactionsSection } from "./detail-transactions-section"

interface Props {
  initialBankAccount: BankAccountDetail
}

export function DetailContent({ initialBankAccount }: Props) {
  const [bankAccount, setBankAccount] = useState(initialBankAccount)
  const [editOpen, setEditOpen] = useState(false)
  const [auditTable, setAuditTable] = useState<TanStackTable<BankAccountDetail["auditLogs"][number]> | null>(null)

  const branches = useMemo(
    () => mockBranches.filter((branch) => branch.aktif).map((branch) => ({ id: branch.id, name: branch.ad })),
    [],
  )
  const auditColumns = useMemo(() => getAuditColumns(), [])

  return (
    <>
      <AppHeader
        breadcrumbs={[
          { label: "Ana Sayfa", href: "/" },
          { label: "Ayarlar", href: "/arf/cargo/settings/system" },
          { label: "Banka Hesapları", href: "/arf/cargo/settings/system/bank-accounts" },
          { label: bankAccount.label },
        ]}
      />

      <BankAccountEditModal
        open={editOpen}
        onOpenChange={setEditOpen}
        branches={branches}
        value={{
          id: bankAccount.id,
          iban: bankAccount.iban,
          bankName: bankAccount.bankName,
          branchName: bankAccount.branchName,
          currency: bankAccount.currency,
          accountHolder: bankAccount.accountHolder,
          label: bankAccount.label,
          accountType: bankAccount.accountType,
          isOpenToAllBranches: bankAccount.isOpenToAllBranches,
          allowedBranchIds: bankAccount.allowedBranchIds,
          integrationStatus: bankAccount.integrationStatus,
        }}
        onSave={async (payload) => {
          const updated = await updateBankAccount(bankAccount.id, payload)
          if (updated) {
            setBankAccount(updated)
          }
        }}
      />

      <div className="flex flex-1 flex-col gap-4 bg-slate-50 p-4 pt-0">
        <DetailHeaderCard
          bankAccount={bankAccount}
          onEdit={() => setEditOpen(true)}
          onToggleStatus={async () => {
            const nextStatus = bankAccount.status === "active" ? "closed" : "active"
            const confirmed = window.confirm(
              `Banka hesabı ${nextStatus === "active" ? "kullanıma açılacak" : "kapatılacak"}. Onaylıyor musunuz?`,
            )

            if (!confirmed) {
              return
            }

            const updated = await setBankAccountStatus(bankAccount.id, nextStatus)
            if (updated) {
              setBankAccount(updated)
            }
          }}
        />

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid h-10 w-full grid-cols-3 rounded-xl border border-slate-200 bg-slate-100 p-0.5">
            <TabsTrigger value="overview" className="text-xs">Genel Bilgiler</TabsTrigger>
            <TabsTrigger value="transactions" className="text-xs">Hesap Hareketleri</TabsTrigger>
            <TabsTrigger value="audit" className="text-xs">Geçmiş</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <DetailOverviewSection bankAccount={bankAccount} />
          </TabsContent>

          <TabsContent value="transactions">
            <DetailTransactionsSection transactions={bankAccount.transactions} currency={bankAccount.currency} />
          </TabsContent>

          <TabsContent value="audit">
            <Card className="rounded-2xl border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle>Geçmiş (Audit Trail)</CardTitle>
                <CardDescription>Bu banka hesabında yapılan son değişiklikler.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <DataTable
                  data={bankAccount.auditLogs}
                  columns={auditColumns}
                  onTableReady={setAuditTable}
                  emptyMessage="Henüz audit kaydı bulunmuyor."
                />
                {auditTable && <DataTablePagination table={auditTable as TanStackTable<unknown>} />}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  )
}