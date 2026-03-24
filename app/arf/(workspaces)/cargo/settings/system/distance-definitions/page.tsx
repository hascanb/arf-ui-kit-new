import { Suspense } from "react"
import { AppHeader } from "@hascanb/arf-ui-kit/layout-kit"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { fetchDistanceDefinitions } from "./_api/distance-definitions-api"
import { DistanceDefinitionsTableSection } from "./_components/distance-definitions-table-section"

export default async function DistanceDefinitionsPage() {
  const definitions = await fetchDistanceDefinitions()

  return (
    <>
      <AppHeader
        breadcrumbs={[
          { label: "Ana Sayfa", href: "/" },
          { label: "Ayarlar", href: "/arf/cargo/settings" },
          { label: "Mesafe Tanımları" },
        ]}
      />

      <div className="flex flex-1 flex-col gap-4 bg-slate-50 p-4 pt-0">
        <Card className="rounded-2xl border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle>Mesafe Tanımları (Baremler)</CardTitle>
            <CardDescription>
              Min-max kilometre baremlerini yönetin, SLA hedeflerini bağlayın ve çakışma kontrolünü izleyin.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<div className="py-6 text-sm text-slate-500">Mesafe tanımları yükleniyor...</div>}>
              <DistanceDefinitionsTableSection data={definitions} />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
