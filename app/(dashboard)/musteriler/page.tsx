import { AppHeader } from "@/components/composite/AppHeader"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Filter } from "lucide-react"

// Mock data
const mockCustomers = [
  {
    id: "1",
    ad: "Ahmet Yılmaz",
    tip: "bireysel",
    telefon: "0532 123 45 67",
    email: "ahmet@email.com",
    il: "İstanbul",
    kargo_sayisi: 24,
  },
  {
    id: "2",
    ad: "ABC Ticaret Ltd.",
    tip: "kurumsal",
    telefon: "0212 456 78 90",
    email: "info@abcticaret.com",
    il: "Ankara",
    kargo_sayisi: 156,
  },
  {
    id: "3",
    ad: "Fatma Kaya",
    tip: "bireysel",
    telefon: "0533 987 65 43",
    email: "fatma@email.com",
    il: "İzmir",
    kargo_sayisi: 8,
  },
]

export default function MusterilerPage() {
  return (
    <>
      <AppHeader
        breadcrumbs={[
          { label: "Ana Sayfa", href: "/" },
          { label: "Müşteriler" },
        ]}
      />
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Müşteriler</h1>
            <p className="text-muted-foreground">
              Müşteri kayıtlarını görüntüleyin ve yönetin
            </p>
          </div>
          <Button>
            <Plus className="mr-2 size-4" />
            Yeni Müşteri
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Müşteri Listesi</CardTitle>
            <CardDescription>Sistemdeki tüm müşterilerin listesi</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Filters */}
            <div className="mb-4 flex items-center gap-2">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
                <Input placeholder="Müşteri ara..." className="pl-8" />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="size-4" />
              </Button>
            </div>

            {/* Table */}
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ad / Firma</TableHead>
                    <TableHead>Tip</TableHead>
                    <TableHead>Telefon</TableHead>
                    <TableHead>E-posta</TableHead>
                    <TableHead>İl</TableHead>
                    <TableHead className="text-right">Kargo Sayısı</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockCustomers.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell className="font-medium">{customer.ad}</TableCell>
                      <TableCell>
                        <Badge variant={customer.tip === "kurumsal" ? "default" : "secondary"}>
                          {customer.tip === "kurumsal" ? "Kurumsal" : "Bireysel"}
                        </Badge>
                      </TableCell>
                      <TableCell>{customer.telefon}</TableCell>
                      <TableCell>{customer.email}</TableCell>
                      <TableCell>{customer.il}</TableCell>
                      <TableCell className="text-right">{customer.kargo_sayisi}</TableCell>
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
