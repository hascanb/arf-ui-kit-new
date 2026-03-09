"use client"

import { AppHeader } from "@arftech/arfweb-shared-lib/layout-kit/components/AppHeader"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"

export default function YeniKargoPage() {
  return (
    <>
      <AppHeader
        breadcrumbs={[
          { label: "Ana Sayfa", href: "/" },
          { label: "Kargolar", href: "/kargolar" },
          { label: "Yeni Kargo" },
        ]}
      />
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Yeni Kargo Oluştur</h1>
            <p className="text-muted-foreground">
              Yeni bir kargo kaydı oluşturun
            </p>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          {/* Gönderen Bilgileri */}
          <Card>
            <CardHeader>
              <CardTitle>Gönderen Bilgileri</CardTitle>
              <CardDescription>Kargoyu gönderen kişi/firma bilgileri</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="gonderen-ad">Ad Soyad</Label>
                  <Input id="gonderen-ad" placeholder="Ad Soyad" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gonderen-telefon">Telefon</Label>
                  <Input id="gonderen-telefon" placeholder="0 (5XX) XXX XX XX" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="gonderen-adres">Adres</Label>
                <Textarea id="gonderen-adres" placeholder="Tam adres..." />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="gonderen-il">İl</Label>
                  <Select>
                    <SelectTrigger id="gonderen-il">
                      <SelectValue placeholder="İl seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="istanbul">İstanbul</SelectItem>
                      <SelectItem value="ankara">Ankara</SelectItem>
                      <SelectItem value="izmir">İzmir</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gonderen-ilce">İlçe</Label>
                  <Select>
                    <SelectTrigger id="gonderen-ilce">
                      <SelectValue placeholder="İlçe seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kadikoy">Kadıköy</SelectItem>
                      <SelectItem value="besiktas">Beşiktaş</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Alıcı Bilgileri */}
          <Card>
            <CardHeader>
              <CardTitle>Alıcı Bilgileri</CardTitle>
              <CardDescription>Kargoyu alacak kişi/firma bilgileri</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="alici-ad">Ad Soyad</Label>
                  <Input id="alici-ad" placeholder="Ad Soyad" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="alici-telefon">Telefon</Label>
                  <Input id="alici-telefon" placeholder="0 (5XX) XXX XX XX" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="alici-adres">Adres</Label>
                <Textarea id="alici-adres" placeholder="Tam adres..." />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="alici-il">İl</Label>
                  <Select>
                    <SelectTrigger id="alici-il">
                      <SelectValue placeholder="İl seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="istanbul">İstanbul</SelectItem>
                      <SelectItem value="ankara">Ankara</SelectItem>
                      <SelectItem value="izmir">İzmir</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="alici-ilce">İlçe</Label>
                  <Select>
                    <SelectTrigger id="alici-ilce">
                      <SelectValue placeholder="İlçe seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cankaya">Çankaya</SelectItem>
                      <SelectItem value="kecioren">Keçiören</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Kargo Detayları */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Kargo Detayları</CardTitle>
              <CardDescription>Kargo içeriği ve teslimat bilgileri</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="kargo-tipi">Kargo Tipi</Label>
                  <Select>
                    <SelectTrigger id="kargo-tipi">
                      <SelectValue placeholder="Tip seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standart">Standart</SelectItem>
                      <SelectItem value="express">Express</SelectItem>
                      <SelectItem value="ayni_gun">Aynı Gün</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="odeme-tipi">Ödeme Tipi</Label>
                  <Select>
                    <SelectTrigger id="odeme-tipi">
                      <SelectValue placeholder="Ödeme seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gonderen_oder">Gönderen Öder</SelectItem>
                      <SelectItem value="alici_oder">Alıcı Öder</SelectItem>
                      <SelectItem value="sozlesmeli">Sözleşmeli</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="parca-sayisi">Parça Sayısı</Label>
                  <Input id="parca-sayisi" type="number" placeholder="1" defaultValue="1" />
                </div>
              </div>

              <Separator />

              <div className="grid gap-4 sm:grid-cols-4">
                <div className="space-y-2">
                  <Label htmlFor="agirlik">Ağırlık (kg)</Label>
                  <Input id="agirlik" type="number" placeholder="0.00" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="en">En (cm)</Label>
                  <Input id="en" type="number" placeholder="0" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="boy">Boy (cm)</Label>
                  <Input id="boy" type="number" placeholder="0" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="yukseklik">Yükseklik (cm)</Label>
                  <Input id="yukseklik" type="number" placeholder="0" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="aciklama">Kargo Açıklaması</Label>
                <Textarea id="aciklama" placeholder="Kargo içeriği hakkında bilgi..." />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ozel-talimat">Özel Talimatlar</Label>
                <Textarea id="ozel-talimat" placeholder="Teslimat için özel talimatlar..." />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2">
          <Button variant="outline">İptal</Button>
          <Button>Kargo Oluştur</Button>
        </div>
      </div>
    </>
  )
}
