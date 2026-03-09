"use client"

import { useState } from "react"
import { AppHeader } from "@arftech/arfweb-shared-lib/layout-kit/components/AppHeader"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Search, Package } from "lucide-react"

export default function KargoSorgulaPage() {
  const [takipNo, setTakipNo] = useState("")

  return (
    <>
      <AppHeader
        breadcrumbs={[
          { label: "Ana Sayfa", href: "/" },
          { label: "Kargolar", href: "/kargolar" },
          { label: "Kargo Sorgula" },
        ]}
      />
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Kargo Sorgula</h1>
            <p className="text-muted-foreground">
              Takip numarası ile kargo durumunu sorgulayın
            </p>
          </div>
        </div>

        <div className="mx-auto w-full max-w-xl">
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-primary/10">
                <Package className="size-8 text-primary" />
              </div>
              <CardTitle>Kargo Takip</CardTitle>
              <CardDescription>
                Kargonuzun güncel durumunu öğrenmek için takip numarasını girin
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="takip-no">Takip Numarası</Label>
                <div className="flex gap-2">
                  <Input
                    id="takip-no"
                    placeholder="Örnek: KRG-2024-001234"
                    value={takipNo}
                    onChange={(e) => setTakipNo(e.target.value)}
                  />
                  <Button>
                    <Search className="mr-2 size-4" />
                    Sorgula
                  </Button>
                </div>
              </div>

              <div className="text-center text-sm text-muted-foreground">
                <p>Takip numaranızı kargo fişinden veya SMS/E-posta bildiriminden bulabilirsiniz.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}
