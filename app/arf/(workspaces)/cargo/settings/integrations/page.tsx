import { Suspense } from "react"
import { AppHeader } from "@hascanb/arf-ui-kit/layout-kit"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { fetchAvailablePlatforms, fetchIntegrationCategories, fetchIntegrations } from "./_api/integrations-api"
import { IntegrationsMarketplaceSection } from "./_components/integrations-marketplace-section"

export default async function IntegrationsPage() {
  const [integrations, platforms, categories] = await Promise.all([
    fetchIntegrations(),
    fetchAvailablePlatforms(),
    fetchIntegrationCategories(),
  ])

  return (
    <>
      <AppHeader
        breadcrumbs={[
          { label: "Ana Sayfa", href: "/" },
          { label: "Ayarlar", href: "/arf/cargo/settings" },
          { label: "Entegrasyonlar" },
        ]}
      />

      <div className="flex flex-1 flex-col gap-4 bg-slate-50 p-4 pt-0">
        <Card className="rounded-2xl border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle>Entegrasyonlar</CardTitle>
            <CardDescription>
              Dış sistemlerle veri köprülerinizi yönetin, test edin ve izleyin.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<div className="py-6 text-sm text-slate-500">Entegrasyonlar yükleniyor...</div>}>
              <IntegrationsMarketplaceSection
                integrations={integrations}
                platforms={platforms}
                categories={categories}
              />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
