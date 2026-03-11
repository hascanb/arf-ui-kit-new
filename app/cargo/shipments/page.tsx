"use client"

import Link from "next/link"
import { AppHeader } from '@hascanb/arf-ui-kit/layout-kit'
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Eye, 
  Edit, 
  Trash2,
  Download,
  Package,
  Truck,
  CheckCircle2,
  Clock
} from "lucide-react"

// Mock data
const mockCargos = [
  {
    id: "1",
    takip_no: "KRG-2024-001234",
    gonderen: "Ahmet Yılmaz",
    alici: "Mehmet Demir",
    cikis: "İstanbul",
    varis: "Ankara",
    durum: "dagitimda",
    tarih: "2024-01-15",
    ucret: "125.00",
  },
  {
    id: "2",
    takip_no: "KRG-2024-001235",
    gonderen: "Fatma Kaya",
    alici: "Ali Veli",
    cikis: "İzmir",
    varis: "Bursa",
    durum: "teslim_edildi",
    tarih: "2024-01-14",
    ucret: "89.50",
  },
  {
    id: "3",
    takip_no: "KRG-2024-001236",
    gonderen: "Zeynep Öztürk",
    alici: "Can Yıldırım",
    cikis: "Ankara",
    varis: "Antalya",
    durum: "beklemede",
    tarih: "2024-01-15",
    ucret: "156.00",
  },
  {
    id: "4",
    takip_no: "KRG-2024-001237",
    gonderen: "Murat Çelik",
    alici: "Ayşe Korkmaz",
    cikis: "Bursa",
    varis: "İstanbul",
    durum: "transfer",
    tarih: "2024-01-15",
    ucret: "78.00",
  },
  {
    id: "5",
    takip_no: "KRG-2024-001238",
    gonderen: "Elif Şahin",
    alici: "Burak Yıldız",
    cikis: "Antalya",
    varis: "İzmir",
    durum: "teslim_alindi",
    tarih: "2024-01-14",
    ucret: "112.50",
  },
]

const statusConfig: Record<string, { label: string; className: string; icon: React.ComponentType<{ className?: string }> }> = {
  beklemede: { label: "Beklemede", className: "bg-amber-500/10 text-amber-600 border-amber-500/20", icon: Clock },
  teslim_alindi: { label: "Teslim Alındı", className: "bg-blue-500/10 text-blue-600 border-blue-500/20", icon: Package },
  transfer: { label: "Transfer", className: "bg-purple-500/10 text-purple-600 border-purple-500/20", icon: Truck },
  dagitimda: { label: "Dağıtımda", className: "bg-sky-500/10 text-sky-600 border-sky-500/20", icon: Truck },
  teslim_edildi: { label: "Teslim Edildi", className: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20", icon: CheckCircle2 },
  iade: { label: "İade", className: "bg-red-500/10 text-red-600 border-red-500/20", icon: Package },
  iptal: { label: "İptal", className: "bg-red-500/10 text-red-600 border-red-500/20", icon: Package },
}

const summaryStats = [
  { label: "Toplam", value: "1,234", icon: Package },
  { label: "Dağıtımda", value: "156", icon: Truck },
  { label: "Teslim Edildi", value: "987", icon: CheckCircle2 },
  { label: "Beklemede", value: "91", icon: Clock },
]

export default function KargolarPage() {
  return (
    <>
      <AppHeader
        breadcrumbs={[
          { label: "Ana Sayfa", href: "/" },
          { label: "Kargolar" },
        ]}
      />
      <div className="flex flex-1 flex-col gap-6 p-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Kargolar</h1>
            <p className="text-sm text-muted-foreground">
              Tüm kargoları görüntüleyin ve yönetin
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Download className="mr-2 size-4" />
              Dışa Aktar
            </Button>
            <Button size="sm" asChild>
              <Link href="/cargo/shipments/new">
                <Plus className="mr-2 size-4" />
                Yeni Kargo
              </Link>
            </Button>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {summaryStats.map((stat) => (
            <Card key={stat.label}>
              <CardContent className="flex items-center gap-4 p-4">
                <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
                  <stat.icon className="size-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-semibold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Table Card */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle className="text-base font-medium">Kargo Listesi</CardTitle>
                <CardDescription className="text-sm">
                  Sistemdeki tüm kargoların listesi
                </CardDescription>
              </div>
              {/* Filters */}
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input 
                    placeholder="Takip numarası ile ara..." 
                    className="w-64 pl-9" 
                  />
                </div>
                <Button variant="outline" size="icon">
                  <Filter className="size-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {/* Table */}
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="h-11 px-6">Takip No</TableHead>
                    <TableHead className="h-11">Gönderen</TableHead>
                    <TableHead className="h-11">Alıcı</TableHead>
                    <TableHead className="h-11">Güzergah</TableHead>
                    <TableHead className="h-11">Durum</TableHead>
                    <TableHead className="h-11">Ücret</TableHead>
                    <TableHead className="h-11">Tarih</TableHead>
                    <TableHead className="h-11 w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockCargos.map((cargo) => {
                    const status = statusConfig[cargo.durum]
                    const StatusIcon = status?.icon || Package
                    return (
                      <TableRow key={cargo.id} className="group">
                        <TableCell className="px-6 font-medium">
                          <Link
                            href={`/cargo/shipments/${cargo.id}`}
                            className="hover:underline"
                          >
                            {cargo.takip_no}
                          </Link>
                        </TableCell>
                        <TableCell>{cargo.gonderen}</TableCell>
                        <TableCell>{cargo.alici}</TableCell>
                        <TableCell>
                          <span className="text-muted-foreground">{cargo.cikis}</span>
                          <span className="mx-1.5 text-muted-foreground/50">→</span>
                          <span>{cargo.varis}</span>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={status?.className}>
                            <StatusIcon className="mr-1.5 size-3" />
                            {status?.label || cargo.durum}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium">{cargo.ucret} TL</TableCell>
                        <TableCell className="text-muted-foreground">{cargo.tarih}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="size-8 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <MoreHorizontal className="size-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              <DropdownMenuLabel>İşlemler</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem asChild>
                                <Link href={`/cargo/shipments/${cargo.id}`}>
                                  <Eye className="mr-2 size-4" />
                                  Detay Görüntüle
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="mr-2 size-4" />
                                Düzenle
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive focus:text-destructive">
                                <Trash2 className="mr-2 size-4" />
                                Sil
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
            {/* Pagination placeholder */}
            <div className="flex items-center justify-between border-t px-6 py-4">
              <p className="text-sm text-muted-foreground">
                Toplam <span className="font-medium">5</span> kayıt gösteriliyor
              </p>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" disabled>
                  Önceki
                </Button>
                <Button variant="outline" size="sm" disabled>
                  Sonraki
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
