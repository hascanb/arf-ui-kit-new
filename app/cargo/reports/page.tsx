import { AppHeader } from '@hascanb/arf-ui-kit/layout-kit'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BarChart3, TrendingUp, Package, Users, FileText, Download } from "lucide-react"

const reportTypes = [
  {
    title: "Günlük Kargo Raporu",
    description: "Günlük kargo hareketleri ve istatistikleri",
    icon: Package,
  },
  {
    title: "Haftalık Performans",
    description: "Haftalık şube ve kurye performansı",
    icon: TrendingUp,
  },
  {
    title: "Müşteri Analizi",
    description: "Müşteri segmentasyonu ve davranış analizi",
    icon: Users,
  },
  {
    title: "Gelir Raporu",
    description: "Dönem bazlı gelir ve maliyet analizi",
    icon: BarChart3,
  },
]

export default function RaporlarPage() {
  return (
    <>
      <AppHeader
        breadcrumbs={[
          { label: "Ana Sayfa", href: "/" },
          { label: "Raporlar" },
        ]}
      />
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Raporlar</h1>
            <p className="text-muted-foreground">
              Sistem raporlarını görüntüleyin ve indirin
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {reportTypes.map((report) => (
            <Card key={report.title}>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
                    <report.icon className="size-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{report.title}</CardTitle>
                    <CardDescription>{report.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1">
                    <FileText className="mr-2 size-4" />
                    Görüntüle
                  </Button>
                  <Button variant="outline" size="icon">
                    <Download className="size-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Placeholder for charts */}
        <Card>
          <CardHeader>
            <CardTitle>Özet Grafikler</CardTitle>
            <CardDescription>Son 30 günlük kargo istatistikleri</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex h-64 items-center justify-center rounded-lg border-2 border-dashed">
              <div className="text-center">
                <BarChart3 className="mx-auto size-12 text-muted-foreground" />
                <p className="mt-2 text-sm text-muted-foreground">
                  Grafik verileri yüklenecek...
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
