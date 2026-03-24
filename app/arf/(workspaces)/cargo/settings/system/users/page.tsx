import { Suspense } from "react"
import { AppHeader } from "@hascanb/arf-ui-kit/layout-kit"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { fetchLocations, fetchUsers } from "./_api/users-api"
import { UsersTableSection } from "./_components/users-table-section"

export default async function UsersPage() {
  const [users, locations] = await Promise.all([fetchUsers(), fetchLocations()])

  return (
    <>
      <AppHeader
        breadcrumbs={[
          { label: "Ana Sayfa", href: "/" },
          { label: "Ayarlar", href: "/arf/cargo/settings/system" },
          { label: "Kullanıcılar" },
        ]}
      />

      <div className="flex flex-1 flex-col gap-4 bg-slate-50 p-4 pt-0">
        <Card className="rounded-2xl border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle>Kullanıcı Listesi</CardTitle>
            <CardDescription>
              Sistemdeki tüm kullanıcıları yönetin; yeni hesap ekleyin, askıya alın veya pasife
              alın.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense
              fallback={
                <div className="py-6 text-sm text-slate-500">Kullanıcılar yükleniyor...</div>
              }
            >
              <UsersTableSection data={users} locations={locations} />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
