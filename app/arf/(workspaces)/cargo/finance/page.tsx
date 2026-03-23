import { AppHeader } from '@hascanb/arf-ui-kit/layout-kit'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Wallet, TrendingUp, TrendingDown, CreditCard, FileText, Plus } from "lucide-react"
import { mockInvoices } from "./_mock/finance-mock-data"
import { FinanceInvoicesSection } from "./_components/finance-invoices-section"

const stats = [
  {
    title: "Toplam Gelir",
    value: "124.500 TL",
    change: "+12%",
    trend: "up" as const,
    icon: Wallet,
  },
  {
    title: "Bekleyen Ödemeler",
    value: "18.320 TL",
    change: "-5%",
    trend: "down" as const,
    icon: CreditCard,
  },
  {
    title: "Bu Ay Faturalar",
    value: "86",
    change: "+8%",
    trend: "up" as const,
    icon: FileText,
  },
]

export default function FinansPage() {
  return (
    <>
      <AppHeader
        breadcrumbs={[
          { label: "Ana Sayfa", href: "/" },
          { label: "Finans" },
        ]}
      />
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Finans</h1>
            <p className="text-muted-foreground">
              Finansal işlemleri ve faturaları yönetin
            </p>
          </div>
          <Button>
            <Plus className="mr-2 size-4" />
            Yeni Fatura
          </Button>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className="size-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="flex items-center gap-1 text-xs text-muted-foreground">
                  {stat.trend === "up" ? (
                    <TrendingUp className="size-3 text-green-600" />
                  ) : (
                    <TrendingDown className="size-3 text-red-600" />
                  )}
                  <span className={stat.trend === "up" ? "text-green-600" : "text-red-600"}>
                    {stat.change}
                  </span>
                  <span>geçen aya göre</span>
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Invoices */}
        <Card>
          <CardHeader>
            <CardTitle>Son Faturalar</CardTitle>
            <CardDescription>Sistemdeki son fatura kayıtları</CardDescription>
          </CardHeader>
          <CardContent>
            <FinanceInvoicesSection data={mockInvoices} />
          </CardContent>
        </Card>
      </div>
    </>
  )
}
