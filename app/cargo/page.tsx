"use client"

import { AppHeader } from '@hascanb/arf-ui-kit/layout-kit'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Package, 
  Users, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight,
  Clock,
  CheckCircle2,
  Plus,
  ChevronRight
} from "lucide-react"
import Link from "next/link"

const statusConfig = {
  beklemede: { label: "Beklemede", className: "bg-amber-500/10 text-amber-500 border-amber-500/20" },
  teslim_alindi: { label: "Teslim Alındı", className: "bg-blue-500/10 text-blue-500 border-blue-500/20" },
  transfer: { label: "Transfer", className: "bg-purple-500/10 text-purple-500 border-purple-500/20" },
  dagitimda: { label: "Dağıtımda", className: "bg-sky-500/10 text-sky-500 border-sky-500/20" },
  teslim_edildi: { label: "Teslim Edildi", className: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" },
}

export default function HomePage() {
  const stats = [
    {
      title: "Toplam Kargo",
      value: "1,234",
      change: "+12.5%",
      changeType: "positive" as const,
      description: "geçen aya göre",
      icon: Package,
    },
    {
      title: "Teslim Edilen",
      value: "987",
      change: "+8.2%",
      changeType: "positive" as const,
      description: "geçen aya göre",
      icon: CheckCircle2,
    },
    {
      title: "Aktif Müşteriler",
      value: "456",
      change: "+5.1%",
      changeType: "positive" as const,
      description: "geçen aya göre",
      icon: Users,
    },
    {
      title: "Günlük Ciro",
      value: "12,450",
      suffix: "TL",
      change: "-2.4%",
      changeType: "negative" as const,
      description: "düne göre",
      icon: TrendingUp,
    },
  ]

  const recentCargos = [
    { id: "KRG-2024-001234", customer: "Ahmet Yılmaz", destination: "Ankara", status: "dagitimda", time: "2 saat önce" },
    { id: "KRG-2024-001235", customer: "Fatma Kaya", destination: "Bursa", status: "teslim_edildi", time: "3 saat önce" },
    { id: "KRG-2024-001236", customer: "Zeynep Öztürk", destination: "Antalya", status: "beklemede", time: "5 saat önce" },
    { id: "KRG-2024-001237", customer: "Can Yıldırım", destination: "İzmir", status: "transfer", time: "6 saat önce" },
  ]

  const quickActions = [
    { title: "Yeni Kargo", description: "Hızlı kargo oluştur", href: "/cargo/shipments/new", icon: Plus },
    { title: "Kargo Sorgula", description: "Takip numarası ile ara", href: "/cargo/shipments/track", icon: Package },
    { title: "Raporlar", description: "Detaylı analizler", href: "/cargo/reports", icon: TrendingUp },
  ]

  return (
    <>
      {/* AppHeader artık bir kütüphane bileşeni.
        Tüm metinleri, bildirim sayılarını ve ikon eylemlerini buradan yolluyoruz.
      */}
      <AppHeader 
        breadcrumbs={[
          { label: "Ana Sayfa" }
        ]}
        searchPlaceholder="Kargo ara..."
        searchShortcut={<>⌘K</>}
        notificationCount={3}
        notificationsLabel="Bildirimler"
        onSearchClick={() => console.log("Arama ekranı açılıyor...")}
        onNotificationClick={() => console.log("Bildirimler açılıyor...")}
      />
      
      <div className="flex flex-1 flex-col gap-6 p-6">
        {/* Header */}
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight">Hoş Geldiniz</h1>
          <p className="text-sm text-muted-foreground">
            Kargo otomasyon sistemi kontrol paneli - Bugünün özeti
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.title} className="relative overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
                    <stat.icon className="size-5 text-muted-foreground" />
                  </div>
                  <Badge 
                    variant="outline" 
                    className={`text-xs font-medium ${
                      stat.changeType === "positive" 
                        ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-600" 
                        : "border-red-500/20 bg-red-500/10 text-red-600"
                    }`}
                  >
                    {stat.changeType === "positive" ? (
                      <ArrowUpRight className="mr-1 size-3" />
                    ) : (
                      <ArrowDownRight className="mr-1 size-3" />
                    )}
                    {stat.change}
                  </Badge>
                </div>
                <div className="mt-4">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-semibold tracking-tight">{stat.value}</span>
                    {stat.suffix && (
                      <span className="text-lg font-medium text-muted-foreground">{stat.suffix}</span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{stat.title}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Recent Cargos */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <div>
                <CardTitle className="text-base font-medium">Son Kargolar</CardTitle>
                <CardDescription className="text-sm">
                  Son eklenen kargoların durumu
                </CardDescription>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/cargo/shipments" className="gap-1">
                  Tümü
                  <ChevronRight className="size-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {recentCargos.map((cargo) => (
                  <div key={cargo.id} className="flex items-center justify-between px-6 py-4 transition-colors hover:bg-muted/50">
                    <div className="flex items-center gap-4">
                      <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
                        <Package className="size-4 text-muted-foreground" />
                      </div>
                      <div>
                        <Link href={`/cargo/shipments/${cargo.id}`} className="font-medium hover:underline">
                          {cargo.id}
                        </Link>
                        <p className="text-sm text-muted-foreground">
                          {cargo.customer} - {cargo.destination}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge 
                        variant="outline"
                        className={statusConfig[cargo.status as keyof typeof statusConfig]?.className}
                      >
                        {statusConfig[cargo.status as keyof typeof statusConfig]?.label}
                      </Badge>
                      <span className="hidden text-xs text-muted-foreground sm:inline-flex items-center gap-1">
                        <Clock className="size-3" />
                        {cargo.time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions & System Status */}
          <div className="flex flex-col gap-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-base font-medium">Hızlı İşlemler</CardTitle>
                <CardDescription className="text-sm">
                  Sık kullanılan işlemler
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-2">
                {quickActions.map((action) => (
                  <Link 
                    key={action.title}
                    href={action.href}
                    className="flex items-center gap-3 rounded-lg border border-transparent p-3 transition-all hover:border-border hover:bg-muted/50"
                  >
                    <div className="flex size-9 items-center justify-center rounded-md bg-primary/10">
                      <action.icon className="size-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{action.title}</p>
                      <p className="text-xs text-muted-foreground">{action.description}</p>
                    </div>
                    <ChevronRight className="ml-auto size-4 text-muted-foreground" />
                  </Link>
                ))}
              </CardContent>
            </Card>

            {/* System Status */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-base font-medium">Sistem Durumu</CardTitle>
                <CardDescription className="text-sm">
                  Anlık sistem bilgileri
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-sm">API Servisleri</span>
                  </div>
                  <span className="text-xs text-muted-foreground">Aktif</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-sm">Veritabanı</span>
                  </div>
                  <span className="text-xs text-muted-foreground">Aktif</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="size-2 rounded-full bg-amber-500 animate-pulse" />
                    <span className="text-sm">SMS Servisi</span>
                  </div>
                  <span className="text-xs text-muted-foreground">Yavaş</span>
                </div>
                <div className="pt-2 border-t">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Son güncelleme</span>
                    <span className="font-medium">Şimdi</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  )
}