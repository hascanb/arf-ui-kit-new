import { Suspense } from "react"
import { AppHeader } from "@hascanb/arf-ui-kit/layout-kit"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { fetchBankAccounts } from "./_api/bank-accounts-api"
import { BankAccountsTableSection } from "./_components/bank-accounts-table-section"

export default async function BankAccountsPage() {
  const bankAccounts = await fetchBankAccounts()

  return (
    <>
      <AppHeader
        breadcrumbs={[
          { label: "Ana Sayfa", href: "/" },
          { label: "Ayarlar", href: "/arf/cargo/settings/system" },
          { label: "Banka Hesapları" },
        ]}
      />

      <div className="flex flex-1 flex-col gap-4 bg-slate-50 p-4 pt-0">
        <Card className="rounded-2xl border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle>Banka Hesapları</CardTitle>
            <CardDescription>
              Şubelerin para yatıracağı ve sistemin havuzunu besleyecek whitelist banka hesaplarını yönetin.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<div className="py-6 text-sm text-slate-500">Banka hesapları yükleniyor...</div>}>
              <BankAccountsTableSection data={bankAccounts} />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
