import { AppHeader } from "@arftech/arfweb-shared-lib/layout-kit/components/AppHeader"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { User, Building, Bell, Shield, Palette } from "lucide-react"

export default function AyarlarPage() {
  return (
    <>
      <AppHeader
        breadcrumbs={[
          { label: "Ana Sayfa", href: "/" },
          { label: "Ayarlar" },
        ]}
      />
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Ayarlar</h1>
            <p className="text-muted-foreground">
              Sistem ayarlarını ve tercihlerini yönetin
            </p>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          {/* Profil Ayarları */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <User className="size-5 text-muted-foreground" />
                <CardTitle>Profil Ayarları</CardTitle>
              </div>
              <CardDescription>Kişisel bilgilerinizi güncelleyin</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="ad">Ad</Label>
                  <Input id="ad" defaultValue="Ahmet" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="soyad">Soyad</Label>
                  <Input id="soyad" defaultValue="Yılmaz" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">E-posta</Label>
                <Input id="email" type="email" defaultValue="ahmet@kargosistemi.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="telefon">Telefon</Label>
                <Input id="telefon" defaultValue="0532 123 45 67" />
              </div>
              <Button>Kaydet</Button>
            </CardContent>
          </Card>

          {/* Firma Ayarları */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Building className="size-5 text-muted-foreground" />
                <CardTitle>Firma Ayarları</CardTitle>
              </div>
              <CardDescription>Firma bilgilerini yönetin</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="firma-adi">Firma Adı</Label>
                <Input id="firma-adi" defaultValue="Kargo Otomasyon A.Ş." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vergi-no">Vergi Numarası</Label>
                <Input id="vergi-no" defaultValue="1234567890" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="firma-adres">Adres</Label>
                <Input id="firma-adres" defaultValue="İstanbul, Türkiye" />
              </div>
              <Button>Kaydet</Button>
            </CardContent>
          </Card>

          {/* Bildirim Ayarları */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Bell className="size-5 text-muted-foreground" />
                <CardTitle>Bildirim Ayarları</CardTitle>
              </div>
              <CardDescription>Bildirim tercihlerini yönetin</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>E-posta Bildirimleri</Label>
                  <p className="text-sm text-muted-foreground">
                    Önemli güncellemeler için e-posta al
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>SMS Bildirimleri</Label>
                  <p className="text-sm text-muted-foreground">
                    Kritik uyarılar için SMS al
                  </p>
                </div>
                <Switch />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Tarayıcı Bildirimleri</Label>
                  <p className="text-sm text-muted-foreground">
                    Anlık bildirimler al
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>

          {/* Güvenlik */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Shield className="size-5 text-muted-foreground" />
                <CardTitle>Güvenlik</CardTitle>
              </div>
              <CardDescription>Hesap güvenliğini yönetin</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="mevcut-sifre">Mevcut Şifre</Label>
                <Input id="mevcut-sifre" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="yeni-sifre">Yeni Şifre</Label>
                <Input id="yeni-sifre" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sifre-tekrar">Şifre Tekrar</Label>
                <Input id="sifre-tekrar" type="password" />
              </div>
              <Button>Şifreyi Değiştir</Button>
            </CardContent>
          </Card>

          {/* Görünüm */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Palette className="size-5 text-muted-foreground" />
                <CardTitle>Görünüm</CardTitle>
              </div>
              <CardDescription>Arayüz görünüm tercihlerini yönetin</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Tema</Label>
                  <Select defaultValue="light">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Açık</SelectItem>
                      <SelectItem value="dark">Koyu</SelectItem>
                      <SelectItem value="system">Sistem</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Dil</Label>
                  <Select defaultValue="tr">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tr">Türkçe</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}
