import { AppHeader } from "@hascanb/arf-ui-kit/layout-kit"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { fetchInterlands } from "./_api/interland-list-api"
import { InterlandsTableSection } from "./_components/interlands-table-section"

export default async function InterlandsPage() {
  const interlands = await fetchInterlands()

  return (
    <>
      <AppHeader
        breadcrumbs={[
          { label: "Ana Sayfa", href: "/" },
          { label: "Ayarlar", href: "/arf/cargo/settings/system" },
          { label: "İnterlandlar" },
        ]}
      />

      <div className="flex flex-1 flex-col gap-4 bg-slate-50 p-4 pt-0">
        <Card className="rounded-2xl border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle>İnterland Tanımları</CardTitle>
            <CardDescription>Ayarlar kapsamındaki tüm interland kayıtlarını yönetin.</CardDescription>
          </CardHeader>
          <CardContent>
            <InterlandsTableSection data={interlands} />
          </CardContent>
        </Card>
      </div>
    </>
  )
}
