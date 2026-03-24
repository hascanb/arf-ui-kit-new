import { Suspense } from "react"
import { AppHeader } from "@hascanb/arf-ui-kit/layout-kit"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { fetchModuleCategories, fetchPermissionDefinitions, fetchRoles } from "./_api/roles-api"
import { RolesTableSection } from "./_components/roles-table-section"

export default async function RolesPage() {
  const [roles, categories, definitions] = await Promise.all([
    fetchRoles(),
    fetchModuleCategories(),
    fetchPermissionDefinitions(),
  ])

  return (
    <>
      <AppHeader
        breadcrumbs={[
          { label: "Ana Sayfa", href: "/" },
          { label: "Ayarlar", href: "/arf/cargo/settings" },
          { label: "Rol Listesi" },
        ]}
      />

      <div className="flex flex-1 flex-col gap-4 bg-slate-50 p-4 pt-0">
        <Card className="rounded-2xl border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle>Rol Listesi</CardTitle>
            <CardDescription>
              Sistem ve ozel rolleri yonetin, yetki matrislerini duzenleyin ve kopyalayin.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<div className="py-6 text-sm text-slate-500">Roller yukleniyor...</div>}>
              <RolesTableSection data={roles} categories={categories} definitions={definitions} />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
