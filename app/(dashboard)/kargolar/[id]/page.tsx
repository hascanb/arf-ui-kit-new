import { AppHeader } from "@/components/composite/AppHeader"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Package, User, MapPin, Truck, Clock, Edit, Printer } from "lucide-react"

// Mock data for demonstration
const mockCargo = {
  id: "1",
  takip_no: "KRG-2024-001234",
  barkod: "1234567890123",
  durum: "dagitimda",
  kargo_tipi: "express",
  odeme_tipi: "gonderen_oder",
  gonderen: {
    ad: "Ahmet Yılmaz",
    telefon: "0532 123 45 67",
    adres: "Kadıköy, İstanbul",
  },
  alici: {
    ad: "Mehmet Demir",
    telefon: "0533 987 65 43",
    adres: "Çankaya, Ankara",
  },
  agirlik: 2.5,
  desi: 3,
  ucret: 45.00,
  created_at: "2024-01-15 10:30",
  hareketler: [
    { tarih: "2024-01-15 10:30", durum: "Kargo oluşturuldu", konum: "İstanbul Merkez" },
    { tarih: "2024-01-15 14:00", durum: "Teslim alındı", konum: "İstanbul Merkez Şube" },
    { tarih: "2024-01-15 18:00", durum: "Transfer merkeze gönderildi", konum: "İstanbul Transfer" },
    { tarih: "2024-01-16 08:00", durum: "Ankara transfer merkezine ulaştı", konum: "Ankara Transfer" },
    { tarih: "2024-01-16 10:00", durum: "Dağıtıma çıkarıldı", konum: "Ankara Çankaya Şube" },
  ],
}

const statusMap: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  beklemede: { label: "Beklemede", variant: "outline" },
  teslim_alindi: { label: "Teslim Alındı", variant: "secondary" },
  transfer: { label: "Transfer", variant: "secondary" },
  dagitimda: { label: "Dağıtımda", variant: "default" },
  teslim_edildi: { label: "Teslim Edildi", variant: "default" },
  iade: { label: "İade", variant: "destructive" },
  iptal: { label: "İptal", variant: "destructive" },
}

export default async function KargoDetayPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  
  return (
    <>
      <AppHeader
        breadcrumbs={[
          { label: "Ana Sayfa", href: "/" },
          { label: "Kargolar", href: "/kargolar" },
          { label: mockCargo.takip_no },
        ]}
      />
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight">
                {mockCargo.takip_no}
              </h1>
              <Badge variant={statusMap[mockCargo.durum]?.variant || "default"}>
                {statusMap[mockCargo.durum]?.label || mockCargo.durum}
              </Badge>
            </div>
            <p className="text-muted-foreground">
              Kargo ID: {id} | Barkod: {mockCargo.barkod}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="icon">
              <Printer className="size-4" />
            </Button>
            <Button variant="outline">
              <Edit className="mr-2 size-4" />
              Düzenle
            </Button>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {/* Gönderen */}
          <Card>
            <CardHeader className="flex flex-row items-center gap-2">
              <User className="size-5 text-muted-foreground" />
              <div>
                <CardTitle className="text-base">Gönderen</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="font-medium">{mockCargo.gonderen.ad}</p>
              <p className="text-sm text-muted-foreground">{mockCargo.gonderen.telefon}</p>
              <div className="flex items-start gap-1 text-sm text-muted-foreground">
                <MapPin className="mt-0.5 size-4 shrink-0" />
                <span>{mockCargo.gonderen.adres}</span>
              </div>
            </CardContent>
          </Card>

          {/* Alıcı */}
          <Card>
            <CardHeader className="flex flex-row items-center gap-2">
              <User className="size-5 text-muted-foreground" />
              <div>
                <CardTitle className="text-base">Alıcı</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="font-medium">{mockCargo.alici.ad}</p>
              <p className="text-sm text-muted-foreground">{mockCargo.alici.telefon}</p>
              <div className="flex items-start gap-1 text-sm text-muted-foreground">
                <MapPin className="mt-0.5 size-4 shrink-0" />
                <span>{mockCargo.alici.adres}</span>
              </div>
            </CardContent>
          </Card>

          {/* Kargo Detayları */}
          <Card>
            <CardHeader className="flex flex-row items-center gap-2">
              <Package className="size-5 text-muted-foreground" />
              <div>
                <CardTitle className="text-base">Kargo Bilgileri</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tip:</span>
                <span className="font-medium capitalize">{mockCargo.kargo_tipi}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Ödeme:</span>
                <span className="font-medium">Gönderen Öder</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Ağırlık:</span>
                <span className="font-medium">{mockCargo.agirlik} kg</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Desi:</span>
                <span className="font-medium">{mockCargo.desi}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Ücret:</span>
                <span className="font-bold">{mockCargo.ucret.toFixed(2)} TL</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Hareket Geçmişi */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="size-5" />
              Hareket Geçmişi
            </CardTitle>
            <CardDescription>Kargonun tüm hareket kayıtları</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative space-y-4">
              {mockCargo.hareketler.map((hareket, index) => (
                <div key={index} className="flex gap-4">
                  <div className="relative flex flex-col items-center">
                    <div className="flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <Clock className="size-4" />
                    </div>
                    {index < mockCargo.hareketler.length - 1 && (
                      <div className="absolute top-8 h-full w-px bg-border" />
                    )}
                  </div>
                  <div className="flex-1 pb-4">
                    <p className="font-medium">{hareket.durum}</p>
                    <p className="text-sm text-muted-foreground">{hareket.konum}</p>
                    <p className="text-xs text-muted-foreground">{hareket.tarih}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
