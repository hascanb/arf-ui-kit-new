import { AppHeader } from "@/components/composite/AppHeader"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Wallet, TrendingUp, TrendingDown, CreditCard, FileText, Plus } from "lucide-react"

// Mock data
const mockInvoices = [
  {
    id: "1",
    fatura_no: "FTR-2024-0001",
    musteri: "ABC Ticaret Ltd.",
    tutar: 2450.00,
    durum: "odendi",
    tarih: "2024-01-15",
  },
  {
    id: "2",
    fatura_no: "FTR-2024-0002",
    musteri: "XYZ Lojistik",
    tutar: 1820.50,
    durum: "beklemede",
    tarih: "2024-01-14",
  },
  {
    id: "3",
    fatura_no: "FTR-2024-0003",
    musteri: "Ahmet Yılmaz",
    tutar: 145.00,
    durum: "gecikti",
    tarih: "2024-01-10",
  },
]

const statusMap: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  beklemede: { label: "Beklemede", variant: "outline" },
  odendi: { label: "Ödendi", variant: "default" },
  gecikti: { label: "Gecikti", variant: "destructive" },
  iptal: { label: "İptal", variant: "secondary" },
}

export default function FinansPage() {
  const stats = [
    {
      title: "Toplam Gelir",
      value: "124,500 TL",
      change: "+12%",
      trend: "up",
      icon: Wallet,
    },
    {
      title: "Bekleyen Ödemeler",
      value: "18,320 TL",
      change: "-5%",
      trend: "down",
      icon: CreditCard,
    },
    {
      title: "Bu Ay Faturalar",
      value: "86",
      change: "+8%",
      trend: "up",
      icon: FileText,
    },
  ]

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

        {/* Recent Invoices */}
        <Card>
          <CardHeader>
            <CardTitle>Son Faturalar</CardTitle>
            <CardDescription>Sistemdeki son fatura kayıtları</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fatura No</TableHead>
                    <TableHead>Müşteri</TableHead>
                    <TableHead>Tutar</TableHead>
                    <TableHead>Durum</TableHead>
                    <TableHead>Tarih</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockInvoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-mono font-medium">
                        {invoice.fatura_no}
                      </TableCell>
                      <TableCell>{invoice.musteri}</TableCell>
                      <TableCell className="font-medium">
                        {invoice.tutar.toFixed(2)} TL
                      </TableCell>
                      <TableCell>
                        <Badge variant={statusMap[invoice.durum]?.variant || "default"}>
                          {statusMap[invoice.durum]?.label || invoice.durum}
                        </Badge>
                      </TableCell>
                      <TableCell>{invoice.tarih}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
