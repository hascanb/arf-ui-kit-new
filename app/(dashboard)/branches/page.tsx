import { AppHeader } from "@arftech/arfweb-shared-lib/layout-kit/components/AppHeader"
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
import { Plus, Search, Filter, MapPin, Phone } from "lucide-react"

// Mock data
const mockBranches = [
  {
    id: "1",
    kod: "IST-001",
    ad: "İstanbul Merkez",
    il: "İstanbul",
    ilce: "Kadıköy",
    telefon: "0216 123 45 67",
    yetkili: "Ali Yılmaz",
    aktif: true,
  },
  {
    id: "2",
    kod: "ANK-001",
    ad: "Ankara Merkez",
    il: "Ankara",
    ilce: "Çankaya",
    telefon: "0312 234 56 78",
    yetkili: "Veli Demir",
    aktif: true,
  },
  {
    id: "3",
    kod: "IZM-001",
    ad: "İzmir Merkez",
    il: "İzmir",
    ilce: "Konak",
    telefon: "0232 345 67 89",
    yetkili: "Ayşe Kaya",
    aktif: true,
  },
  {
    id: "4",
    kod: "IST-002",
    ad: "İstanbul Anadolu",
    il: "İstanbul",
    ilce: "Üsküdar",
    telefon: "0216 456 78 90",
    yetkili: "Mehmet Can",
    aktif: false,
  },
]

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
            {/* Filters */}
            <div className="mb-4 flex items-center gap-2">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
                <Input placeholder="Şube ara..." className="pl-8" />
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
                    <TableHead>Şube Kodu</TableHead>
                    <TableHead>Şube Adı</TableHead>
                    <TableHead>Konum</TableHead>
                    <TableHead>Telefon</TableHead>
                    <TableHead>Yetkili</TableHead>
                    <TableHead>Durum</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockBranches.map((branch) => (
                    <TableRow key={branch.id}>
                      <TableCell className="font-mono font-medium">{branch.kod}</TableCell>
                      <TableCell className="font-medium">{branch.ad}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <MapPin className="size-3" />
                          {branch.il}, {branch.ilce}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Phone className="size-3" />
                          {branch.telefon}
                        </div>
                      </TableCell>
                      <TableCell>{branch.yetkili}</TableCell>
                      <TableCell>
                        <Badge variant={branch.aktif ? "default" : "secondary"}>
                          {branch.aktif ? "Aktif" : "Pasif"}
                        </Badge>
                      </TableCell>
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
