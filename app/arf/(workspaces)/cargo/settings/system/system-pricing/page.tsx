import { Suspense } from "react"
import { AppHeader } from "@hascanb/arf-ui-kit/layout-kit"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { fetchPriceDefinitions } from "./_api/price-definitions-api"
import { PriceDefinitionsTableSection } from "./_components/price-definitions-table-section"

export default async function SystemPricingPage() {
  const definitions = await fetchPriceDefinitions()

  return (
    <>
      <AppHeader
        breadcrumbs={[
          { label: "Ana Sayfa", href: "/" },
          { label: "Ayarlar", href: "/arf/cargo/settings/system" },
          { label: "Fiyat Tanımları" },
        ]}
      />

      <div className="flex flex-1 flex-col gap-4 bg-slate-50 p-4 pt-0">
        <Card className="rounded-2xl border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle>Fiyat Tanımları</CardTitle>
            <CardDescription>
              Varsayılan ve sözleşmesiz fiyat tarifelerini, barem kurallarını ve ek hizmet kalemlerini yönetin.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<div className="py-6 text-sm text-slate-500">Fiyat tanımları yükleniyor...</div>}>
              <PriceDefinitionsTableSection data={definitions} />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
