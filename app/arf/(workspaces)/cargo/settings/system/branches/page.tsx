import { AppHeader } from '@hascanb/arf-ui-kit/layout-kit'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus } from "lucide-react"
import { mockBranches } from "./_mock/branches-mock-data"
import { BranchesTableSection } from "./_components/branches-table-section"

export default function SubelerPage() {
  return (
    <>
      <AppHeader
        breadcrumbs={[
          { label: "Ana Sayfa", href: "/" },
          { label: "Şubeler" },
        ]}
      />
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Şubeler</h1>
            <p className="text-muted-foreground">
              Şube kayıtlarını görüntüleyin ve yönetin
            </p>
          </div>
          <Button>
            <Plus className="mr-2 size-4" />
            Yeni Şube
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Şube Listesi</CardTitle>
            <CardDescription>Sistemdeki tüm şubelerin listesi</CardDescription>
          </CardHeader>
          <CardContent>
            <BranchesTableSection data={mockBranches} />
          </CardContent>
        </Card>
      </div>
    </>
  )
}
