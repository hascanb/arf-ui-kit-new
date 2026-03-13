"use client"

import Link from "next/link"
import { type ChangeEvent, useCallback, useMemo, useState } from "react"
import type { ColumnDef, Table as TanStackTable } from "@tanstack/react-table"
import { DataTable, DataTableColumnHeader, DataTablePagination, createSelectionColumn } from "@hascanb/arf-ui-kit/datatable-kit"
import { AppHeader } from "@hascanb/arf-ui-kit/layout-kit"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { AlertTriangle, ArrowRightLeft, Ban, Building2, CheckCircle2, Copy, Eye, Package, Printer, Route, Truck, X } from "lucide-react"

type EventStage = "hazirlaniyor" | "transferde" | "varis" | "dagitimda" | "teslim"
type EventStatus = "completed" | "active" | "pending"

type EventItem = {
  title: string
  description: string
  time: string
  done?: boolean
  stage: EventStage
  status: EventStatus
  subtitle?: string
}

type PartyCustomerType = "corporate" | "individual"

type PartyInfo = {
  customerType: PartyCustomerType
  displayName: string
  companyName?: string
  taxNumber?: string
  taxOffice?: string
  tcIdentityNumber?: string
  contactName: string
  phone: string
  email?: string
  branch: string
  city: string
  district: string
  neighborhood: string
  fullAddress: string
}

type PieceDetailStatus = "olusturuldu" | "transferde" | "dagitimda" | "teslim_edildi"

type PieceDetailRow = {
  id: string
  parca_no: string
  parca_durumu: PieceDetailStatus
  ihbar_edildi?: boolean
  ihbar_zamani?: string
  ihbar_sebebi?: string
  ihbar_aciklama?: string
  ihbar_kanit_url?: string
  parca_tipi: string
  desi: number
  agirlik: number
  olusturulma_zamani: string
  guncellenme_zamani: string
  varis_zamani: string
  teslimat_zamani: string
  teslim_alan_ad: string
  teslim_alan_soyad: string
  teslim_alan_telefonu: string
  teslimat_resmi_url?: string
}

const pieceStatusConfig: Record<PieceDetailStatus, { label: string; className: string }> = {
  olusturuldu: { label: "Oluşturuldu", className: "border-secondary/25 bg-secondary/10 text-secondary" },
  transferde: { label: "Transferde", className: "border-primary/25 bg-primary/10 text-foreground" },
  dagitimda: { label: "Dağıtımda", className: "border-amber-200 bg-amber-50 text-amber-700" },
  teslim_edildi: { label: "Teslim Edildi", className: "border-primary/25 bg-primary/15 text-foreground" },
}

const detailData = {
  takipNo: "10003757",
  durum: "Dağıtımda",
  gonderen: "Demir Lojistik",
  alici: "ALI DALKILIÇ",
  gonderiTarihi: "13.03.2026 17:26",
  odemeTuru: "Alıcı Ödemeli",
  faturaTuru: "Alıcı",
  faturaDurumu: "Beklemede",
  toplamTutar: "399,6 ₺",
  parcaSayisi: "2",
  toplamDesi: "24",
  irsaliyeNo: "IRS-2026001",
  atfNo: "ATF-000123",
  olusturan: "Ali Veli",
  rota: "Mardin Nusaybin Şube → Konya Şube",
  transferHatti: "Mardin Nusaybin TM → Konya Transfer Merkezi",
  varisSubesi: "Konya Meram Şube",
  teslimatDeneyimi: ["Çok Kötü", "Kötü", "Orta", "İyi", "Çok İyi"],
  takipGecmisi: [
    {
      title: "Hazırlanıyor",
      description: "Gönderi kaydı alındı ve şube çıkışı için hazırlandı.",
      time: "13.03.2026 17:26",
      done: true,
      stage: "hazirlaniyor",
      status: "completed",
      subtitle: "Çıkış Şubesi: Mardin Nusaybin",
    },
    {
      title: "Transferde",
      description: "Gönderi transfer hattına alındı.",
      time: "13.03.2026 18:05",
      done: true,
      stage: "transferde",
      status: "completed",
      subtitle: "Hat: Mardin Nusaybin TM → Konya Transfer Merkezi",
    },
    {
      title: "Varış Şubede",
      description: "Gönderi varış şubesine ulaştı.",
      time: "13.03.2026 18:34",
      done: true,
      stage: "varis",
      status: "completed",
      subtitle: "Varış Şubesi: Konya Meram Şube",
    },
    {
      title: "Dağıtımda",
      description: "Kurye teslimat için dağıtıma çıktı.",
      time: "13.03.2026 19:10",
      done: true,
      stage: "dagitimda",
      status: "active",
    },
    {
      title: "Teslim Edildi",
      description: "Teslimat tamamlandığında bu adım aktif olur.",
      time: "-",
      stage: "teslim",
      status: "pending",
    },
  ] satisfies EventItem[],
  senderInfo: {
    customerType: "corporate",
    displayName: "ETHEM DEMIR",
    companyName: "Demir Lojistik",
    taxNumber: "33224394904",
    taxOffice: "Mardin Vergi Dairesi",
    contactName: "Ethem Demir",
    phone: "5462661483",
    email: "operasyon@ethemdemir.com",
    branch: "Mardin Nusaybin Şube",
    city: "Mardin",
    district: "Nusaybin",
    neighborhood: "Abdulkadirpaşa",
    fullAddress: "TOKİ Lojmanları 3. Blok No:12 Nusaybin / Mardin",
  } satisfies PartyInfo,
  receiverInfo: {
    customerType: "individual",
    displayName: "ALI DALKILIÇ",
    tcIdentityNumber: "12345678901",
    contactName: "Ali Dalkılıç",
    phone: "5011740747",
    email: "",
    branch: "Konya Şube",
    city: "Konya",
    district: "Meram",
    neighborhood: "Şehitler Mahallesi",
    fullAddress: "MEHMET AKİF ERSOY MAH TEMUZLAR ŞEHİTLER CAD ÖZEL APT NO13 DAİRE 1 DOĞAN ERKEK KUAFÖRÜ",
  } satisfies PartyInfo,
  parcaDetaylari: [
    {
      id: "piece-1",
      parca_no: "10003757001",
      parca_durumu: "teslim_edildi",
      ihbar_edildi: true,
      ihbar_zamani: "13.03.2026 19:20",
      ihbar_sebebi: "Hasarlı Kargo",
      ihbar_aciklama: "Parçanın dış ambalajında yırtık ve ezilme tespit edildi.",
      ihbar_kanit_url: "https://picsum.photos/seed/ihbar-1/900/600",
      parca_tipi: "Palet",
      desi: 14,
      agirlik: 35,
      olusturulma_zamani: "13.03.2026 17:26",
      guncellenme_zamani: "13.03.2026 19:10",
      varis_zamani: "13.03.2026 18:34",
      teslimat_zamani: "13.03.2026 19:02",
      teslim_alan_ad: "Ali",
      teslim_alan_soyad: "Dalkılıç",
      teslim_alan_telefonu: "0501 174 07 47",
      teslimat_resmi_url: "https://picsum.photos/seed/teslimat-1/900/600",
    },
    {
      id: "piece-2",
      parca_no: "10003757002",
      parca_durumu: "olusturuldu",
      ihbar_edildi: false,
      parca_tipi: "Koli",
      desi: 10,
      agirlik: 18,
      olusturulma_zamani: "13.03.2026 17:27",
      guncellenme_zamani: "13.03.2026 17:34",
      varis_zamani: "-",
      teslimat_zamani: "-",
      teslim_alan_ad: "",
      teslim_alan_soyad: "",
      teslim_alan_telefonu: "",
      teslimat_resmi_url: "",
    },
  ] satisfies PieceDetailRow[],
}

const notesHistory = [
  {
    source: "Operasyon Merkezi",
    note: "Şube çıkışı tamamlandı, transfer merkezine yönlendirildi.",
    date: "26.02.2026 09:40",
    tag: "Operasyon",
  },
  {
    source: "Destek Ekibi",
    note: "Alıcı teslimat saatini 14:00 sonrası olarak iletti.",
    date: "26.02.2026 10:15",
    tag: "Destek",
  },
]

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-3.5 py-2.5">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 text-xl font-semibold leading-tight tracking-tight text-slate-900">{value}</p>
    </div>
  )
}

function InfoCell({ label, value, compact }: { label: string; value: string; compact?: boolean }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-3.5 py-2.5">
      <p className="text-xs text-slate-500">{label}</p>
      <p className={`mt-1 font-semibold tracking-tight text-slate-900 ${compact ? "text-sm leading-snug" : "text-base leading-tight"}`}>
        {value}
      </p>
    </div>
  )
}

const timelineStageIcon: Record<EventStage, typeof Package> = {
  hazirlaniyor: Package,
  transferde: Route,
  varis: Building2,
  dagitimda: Truck,
  teslim: CheckCircle2,
}

const timelineStatusStyles: Record<EventStatus, { card: string; iconWrap: string; icon: string; title: string; subtitleBadge: string; subtitleDot: string; line: string }> = {
  completed: {
    card: "border-primary/25 bg-primary/5",
    iconWrap: "border-primary/25 bg-primary/10",
    icon: "text-primary",
    title: "text-foreground",
    subtitleBadge: "border-primary/20 bg-background text-foreground/80",
    subtitleDot: "bg-primary",
    line: "bg-primary/40",
  },
  active: {
    card: "border-secondary/35 bg-secondary/10",
    iconWrap: "border-secondary/35 bg-secondary/20",
    icon: "text-foreground",
    title: "text-foreground",
    subtitleBadge: "border-secondary/30 bg-background text-foreground/80",
    subtitleDot: "bg-foreground/70",
    line: "bg-linear-to-r from-secondary to-border",
  },
  pending: {
    card: "border-border bg-muted/30",
    iconWrap: "border-border bg-background",
    icon: "text-muted-foreground",
    title: "text-muted-foreground",
    subtitleBadge: "border-border bg-background text-muted-foreground",
    subtitleDot: "bg-muted-foreground/50",
    line: "bg-border",
  },
}

function TimelineBlock({ items }: { items: EventItem[] }) {
  return (
    <div className="overflow-x-auto pb-1">
      <div className="flex min-w-[1080px] gap-3 px-1 py-1">
        {items.map((item, index) => (
          <div key={`${item.title}-${item.time}`} className="relative min-w-[200px] flex-1">
            <div className="relative z-10 mb-2.5 flex items-center gap-2">
              {(() => {
                const StageIcon = timelineStageIcon[item.stage]
                const style = timelineStatusStyles[item.status]

                return (
                  <>
                    <div className={`flex size-10 items-center justify-center rounded-full border-2 ${style.iconWrap}`}>
                      <StageIcon className={`size-5 ${style.icon}`} />
                    </div>
                    <p className={`text-xl font-semibold leading-tight tracking-tight lg:text-2xl ${style.title}`}>
                      {item.title}
                    </p>
                    {index < items.length - 1 && <div className={`ml-1 h-0.5 min-w-6 flex-1 ${style.line}`} />}
                  </>
                )
              })()}
            </div>

            <div className={`rounded-2xl border p-3 ${timelineStatusStyles[item.status].card}`}>
              {item.subtitle && (
                <div className={`mb-2 inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-medium ${timelineStatusStyles[item.status].subtitleBadge}`}>
                  <span className={`size-1.5 rounded-full ${timelineStatusStyles[item.status].subtitleDot}`} />
                  {item.subtitle}
                </div>
              )}
              <p className="text-sm text-foreground/85">{item.description}</p>
              <p className="mt-2 text-xs font-medium text-muted-foreground">{item.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function DetailField({ label, value, fullWidth }: { label: string; value?: string; fullWidth?: boolean }) {
  return (
    <div className={`rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 ${fullWidth ? "md:col-span-2" : ""}`}>
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-medium text-slate-900">{value || "-"}</p>
    </div>
  )
}

function PartyInfoCard({ title, party }: { title: string; party: PartyInfo }) {
  const typeLabel = party.customerType === "corporate" ? "Kurumsal" : "Bireysel"
  const typeBadgeClass =
    party.customerType === "corporate"
      ? "border-secondary/30 bg-secondary/12 text-foreground"
      : "border-primary/30 bg-primary/15 text-foreground"

  return (
    <Card className="rounded-xl border-slate-200 bg-white shadow-sm">
      <CardContent className="space-y-3 p-3.5">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-xl font-semibold tracking-tight text-slate-900">{title}</h3>
          <Badge className={`rounded-lg border px-3 py-1 text-xs font-semibold uppercase tracking-wide ${typeBadgeClass}`}>
            {typeLabel}
          </Badge>
        </div>

        <div className="grid gap-2.5 md:grid-cols-2">
          <DetailField
            label={party.customerType === "corporate" ? "Şirket Ünvanı" : "Müşteri"}
            value={party.customerType === "corporate" ? party.companyName || party.displayName : party.displayName}
          />

          {party.customerType === "corporate" ? (
            <>
              <DetailField label="Yetkili" value={party.contactName} />
              <DetailField label="Vergi Numarası" value={party.taxNumber} />
              <DetailField label="Vergi Dairesi" value={party.taxOffice} />
              <DetailField label="E-posta" value={party.email || "-"} />
            </>
          ) : (
            <>
              <DetailField label="TC Kimlik No" value={party.tcIdentityNumber} />
              <DetailField label="E-posta" value={party.email || "-"} />
            </>
          )}

          <DetailField label="Telefon" value={party.phone} />
          <DetailField label="Şube" value={party.branch} />
          <DetailField label="İl" value={party.city} />
          <DetailField label="İlçe" value={party.district} />
          <DetailField label="Mahalle" value={party.neighborhood} />
          <DetailField label="Açık Adres" value={party.fullAddress} fullWidth />
        </div>
      </CardContent>
    </Card>
  )
}

export default function KargoDetayPage() {
  const [pieceTable, setPieceTable] = useState<TanStackTable<PieceDetailRow> | null>(null)
  const [deliveryInfoModalPiece, setDeliveryInfoModalPiece] = useState<PieceDetailRow | null>(null)
  const [reportInfoModalPiece, setReportInfoModalPiece] = useState<PieceDetailRow | null>(null)
  const [deliveryEntryModalOpen, setDeliveryEntryModalOpen] = useState(false)
  const [deliveryEntryPieceNos, setDeliveryEntryPieceNos] = useState<string[]>([])
  const [deliveryEntryFirstName, setDeliveryEntryFirstName] = useState("")
  const [deliveryEntryLastName, setDeliveryEntryLastName] = useState("")
  const [deliveryEntryPhone, setDeliveryEntryPhone] = useState("")
  const [reportModalOpen, setReportModalOpen] = useState(false)
  const [reportPieceNos, setReportPieceNos] = useState<string[]>([])
  const [reportReason, setReportReason] = useState("hasarli_kargo")
  const [reportDescription, setReportDescription] = useState("")
  const [handoverModalOpen, setHandoverModalOpen] = useState(false)
  const [handoverReason, setHandoverReason] = useState("musteri_adreste_degil")
  const [handoverNote, setHandoverNote] = useState("")
  const [cancelModalOpen, setCancelModalOpen] = useState(false)
  const [cancelReason, setCancelReason] = useState("musteri_talebi")
  const [cancelNote, setCancelNote] = useState("")
  const [isNoteEditorOpen, setIsNoteEditorOpen] = useState(false)
  const [noteDraft, setNoteDraft] = useState("")
  const [bulkActionNotice, setBulkActionNotice] = useState("")

  const handlePieceTableReady = useCallback((nextTable: TanStackTable<PieceDetailRow>) => {
    setPieceTable(nextTable)
  }, [])

  const hasDeliveryInfo = useCallback((piece: PieceDetailRow) => {
    return [piece.teslimat_zamani, piece.teslim_alan_ad, piece.teslim_alan_soyad, piece.teslim_alan_telefonu, piece.teslimat_resmi_url]
      .some((value) => Boolean(value && value !== "-"))
  }, [])

  const handleOpenDeliveryEntryModal = useCallback(() => {
    const selectedRows = pieceTable?.getSelectedRowModel().rows.map((row) => row.original) ?? []
    if (selectedRows.length === 0) {
      setBulkActionNotice("Teslim Et için en az bir parça seçin.")
      return
    }

    setBulkActionNotice("")
    const targetRows = selectedRows
    const firstPiece = targetRows[0]

    setDeliveryEntryPieceNos(targetRows.map((piece) => piece.parca_no))
    setDeliveryEntryFirstName(firstPiece?.teslim_alan_ad && firstPiece.teslim_alan_ad !== "-" ? firstPiece.teslim_alan_ad : "")
    setDeliveryEntryLastName(firstPiece?.teslim_alan_soyad && firstPiece.teslim_alan_soyad !== "-" ? firstPiece.teslim_alan_soyad : "")
    setDeliveryEntryPhone(
      firstPiece?.teslim_alan_telefonu && firstPiece.teslim_alan_telefonu !== "-" ? firstPiece.teslim_alan_telefonu : "",
    )
    setDeliveryEntryModalOpen(true)
  }, [pieceTable])

  const handleOpenReportModal = useCallback(() => {
    const selectedRows = pieceTable?.getSelectedRowModel().rows.map((row) => row.original) ?? []
    if (selectedRows.length === 0) {
      setBulkActionNotice("İhbar Et için en az bir parça seçin.")
      return
    }

    setBulkActionNotice("")
    setReportPieceNos(selectedRows.map((piece) => piece.parca_no))
    setReportModalOpen(true)
  }, [pieceTable])

  const deliveryEntryPieceNoPreview = useMemo(() => {
    if (deliveryEntryPieceNos.length === 0) {
      return "-"
    }

    const firstFive = deliveryEntryPieceNos.slice(0, 5).join(", ")

    if (deliveryEntryPieceNos.length <= 5) {
      return firstFive
    }

    return `${firstFive} +${deliveryEntryPieceNos.length - 5} daha`
  }, [deliveryEntryPieceNos])

  const reportPieceNoPreview = useMemo(() => {
    if (reportPieceNos.length === 0) {
      return "-"
    }

    const firstFive = reportPieceNos.slice(0, 5).join(", ")

    if (reportPieceNos.length <= 5) {
      return firstFive
    }

    return `${firstFive} +${reportPieceNos.length - 5} daha`
  }, [reportPieceNos])

  const pieceColumns = useMemo<ColumnDef<PieceDetailRow>[]>(
    () => [
      createSelectionColumn<PieceDetailRow>(),
      {
        accessorKey: "parca_no",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Parça No" />,
        cell: ({ row }) => <span className="font-mono text-sm font-medium">{row.original.parca_no}</span>,
      },
      {
        accessorKey: "parca_durumu",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Parça Durumu" />,
        cell: ({ row }) => {
          const status = pieceStatusConfig[row.original.parca_durumu]
          return (
            <Badge variant="outline" className={status.className}>
              {status.label}
            </Badge>
          )
        },
      },
      {
        accessorKey: "parca_tipi",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Parça Tipi" />,
      },
      {
        accessorKey: "desi",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Desi" />,
        cell: ({ row }) => <span className="tabular-nums">{row.original.desi}</span>,
      },
      {
        accessorKey: "agirlik",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Ağırlık" />,
        cell: ({ row }) => <span className="tabular-nums">{row.original.agirlik}</span>,
      },
      {
        accessorKey: "olusturulma_zamani",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Oluşturulma Zamanı" />,
        cell: ({ row }) => <span className="text-muted-foreground">{row.original.olusturulma_zamani}</span>,
      },
      {
        accessorKey: "guncellenme_zamani",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Güncellenme Zamanı" />,
        cell: ({ row }) => <span className="text-muted-foreground">{row.original.guncellenme_zamani}</span>,
      },
      {
        accessorKey: "varis_zamani",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Varış Zamanı" />,
        cell: ({ row }) => <span className="text-muted-foreground">{row.original.varis_zamani || "-"}</span>,
      },
      {
        id: "teslimat_bilgi",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Teslimat Bilgi" />,
        enableSorting: false,
        size: 120,
        cell: ({ row }) => {
          if (!hasDeliveryInfo(row.original)) {
            return <span className="text-muted-foreground">-</span>
          }

          return (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-8 rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 hover:text-emerald-700"
              aria-label="Teslimat bilgisini görüntüle"
              onClick={() => setDeliveryInfoModalPiece(row.original)}
            >
              <Eye className="size-4" />
            </Button>
          )
        },
      },
      {
        id: "ihbar_bilgi",
        header: ({ column }) => <DataTableColumnHeader column={column} title="İhbar Bilgi" />,
        enableSorting: false,
        size: 120,
        cell: ({ row }) => {
          if (!row.original.ihbar_edildi) {
            return <span className="text-muted-foreground">-</span>
          }

          return (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-8 rounded-lg border border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100 hover:text-rose-700"
              aria-label="İhbar bilgisini görüntüle"
              onClick={() => setReportInfoModalPiece(row.original)}
            >
              <Eye className="size-4" />
            </Button>
          )
        },
      },
      {
        id: "actions",
        header: "Detay",
        enableSorting: false,
        enableHiding: false,
        size: 84,
        cell: ({ row }) => (
          <Button
            variant="ghost"
            size="icon"
            className="size-8 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 hover:text-slate-900"
            asChild
          >
            <Link href={`/arf/cargo/shipments/pieces/${row.original.id}`} aria-label="Parça detayına git">
              <Eye className="size-4" />
            </Link>
          </Button>
        ),
      },
    ],
    [hasDeliveryInfo],
  )

  return (
    <>
      <AppHeader
        breadcrumbs={[
          { label: "Ana Sayfa", href: "/" },
          { label: "Kargo İşlemleri", href: "/arf/cargo/shipments" },
          { label: `Takip ${detailData.takipNo}` },
        ]}
      />

      <div className="flex flex-1 flex-col gap-3 bg-slate-50 p-3 pt-2.5 lg:gap-4">
        <Card className="relative overflow-hidden rounded-xl border-slate-200 bg-white shadow-sm">
          <div className="pointer-events-none absolute -right-20 -top-20 size-72 rounded-full bg-primary/15 blur-3xl" />
          <div className="pointer-events-none absolute -left-24 bottom-0 size-72 rounded-full bg-secondary/10 blur-3xl" />

          <CardContent className="relative space-y-3 p-3.5 lg:p-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-[26px] font-semibold tracking-tight text-slate-900">Takip No: {detailData.takipNo}</h1>
                  <Badge className="rounded-lg border border-slate-200 bg-white px-2.5 py-0.5 text-xs font-medium text-slate-700">
                    {detailData.durum}
                  </Badge>
                </div>
                <p className="mt-1.5 text-sm text-slate-600">
                  Gönderen: {detailData.gonderen} · Alıcı: {detailData.alici}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Button className="h-9 rounded-lg px-3.5 text-sm font-semibold">
                  <Printer className="size-4" />
                  Bilgi Fişi
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="h-9 rounded-lg px-3.5 text-sm font-semibold"
                  onClick={() => setHandoverModalOpen(true)}
                >
                  <ArrowRightLeft className="size-4" />
                  Devret
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="h-9 rounded-lg border-rose-200 px-3.5 text-sm font-semibold text-rose-600 hover:bg-rose-50"
                  onClick={() => setCancelModalOpen(true)}
                >
                  <Ban className="size-4" />
                  İptal
                </Button>
                <Button variant="outline" className="h-9 rounded-lg px-3.5 text-sm font-semibold" aria-label="Takip linkini kopyala">
                  <Copy className="size-4" />
                  Takip Linki
                </Button>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <InfoCell label="Rota" value={detailData.rota} compact />
              <InfoCell label="Toplam Parça Sayısı" value={detailData.parcaSayisi} />
              <InfoCell label="Toplam Desi" value={detailData.toplamDesi} />
              <InfoCell label="Toplam Tutar" value={detailData.toplamTutar} />
              <InfoCell label="İrsaliye No" value={detailData.irsaliyeNo} />
              <InfoCell label="ATF No" value={detailData.atfNo} />
              <InfoCell label="Oluşturulma Zamanı" value={detailData.gonderiTarihi} />
              <InfoCell label="Oluşturan" value={detailData.olusturan} />
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="details" className="space-y-3">
          <TabsList className="grid h-10 w-full grid-cols-4 rounded-xl border border-slate-200 bg-slate-100 p-0.5">
            <TabsTrigger
              value="details"
              className="rounded-lg border border-transparent text-sm text-slate-700 transition-colors hover:bg-slate-50 hover:text-slate-900 data-[state=active]:border-slate-200 data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm"
            >
              Detaylar
            </TabsTrigger>
            <TabsTrigger
              value="billing"
              className="rounded-lg border border-transparent text-sm text-slate-700 transition-colors hover:bg-slate-50 hover:text-slate-900 data-[state=active]:border-slate-200 data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm"
            >
              Fatura
            </TabsTrigger>
            <TabsTrigger
              value="events"
              className="rounded-lg border border-transparent text-sm text-slate-700 transition-colors hover:bg-slate-50 hover:text-slate-900 data-[state=active]:border-slate-200 data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm"
            >
              Hareketler
            </TabsTrigger>
            <TabsTrigger
              value="notes"
              className="rounded-lg border border-transparent text-sm text-slate-700 transition-colors hover:bg-slate-50 hover:text-slate-900 data-[state=active]:border-slate-200 data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm"
            >
              Notlar
            </TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-3">
            <div className="grid gap-3 lg:grid-cols-2">
              <PartyInfoCard title="Gönderici Bilgileri" party={detailData.senderInfo} />
              <PartyInfoCard title="Alıcı Bilgileri" party={detailData.receiverInfo} />
            </div>

            <Card className="rounded-xl border-slate-200 bg-white shadow-sm">
              <CardContent className="space-y-3 p-3.5">
                <h3 className="text-xl font-semibold tracking-tight text-slate-900">Parça Detayları</h3>

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-2">
                  <div className="flex flex-wrap gap-2">
                    <Button className="h-9 rounded-xl px-3.5 text-sm font-semibold shadow-sm">
                      <Printer className="size-4" />
                      Barkodları Yazdır
                    </Button>
                    <Button
                      variant="outline"
                      className="h-9 rounded-xl border-slate-300 bg-white px-3.5 text-sm font-semibold hover:bg-slate-50"
                      onClick={handleOpenDeliveryEntryModal}
                    >
                      <CheckCircle2 className="size-4" />
                      Teslim Et
                    </Button>
                    <Button
                      variant="outline"
                      className="h-9 rounded-xl border-rose-200 bg-rose-50/70 px-3.5 text-sm font-semibold text-rose-700 hover:bg-rose-100"
                      onClick={handleOpenReportModal}
                    >
                      <AlertTriangle className="size-4" />
                      İhbar Et
                    </Button>
                  </div>
                </div>

                {bulkActionNotice && <p className="text-xs font-medium text-rose-600">{bulkActionNotice}</p>}

                <DataTable
                  data={detailData.parcaDetaylari}
                  columns={pieceColumns}
                  enableSorting
                  enableGlobalFilter
                  enableColumnVisibility
                  enableHorizontalScroll
                  stickyRightColumnCount={3}
                  enableRowSelection
                  className="[&_thead_tr]:bg-slate-50 [&_thead_th]:font-semibold [&_thead_th]:text-slate-600"
                  emptyMessage="Gösterilecek parça bulunamadı."
                  onTableReady={handlePieceTableReady}
                />

                {pieceTable && (
                  <DataTablePagination
                    table={pieceTable as TanStackTable<unknown>}
                    pageSizeOptions={[5, 10, 20]}
                    totalRows={detailData.parcaDetaylari.length}
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="billing" className="space-y-3">
            <div className="grid gap-3 lg:grid-cols-3">
              <StatCard label="Ara Toplam" value="333 ₺" />
              <StatCard label="KDV" value="66,6 ₺" />
              <StatCard label="Genel Toplam" value="399,6 ₺" />
            </div>

            <div className="grid gap-3 lg:grid-cols-[2fr_1fr]">
              <Card className="rounded-xl border-slate-200 bg-white shadow-sm">
                <CardContent className="space-y-3 p-3.5">
                  <h3 className="text-xl font-semibold tracking-tight text-slate-900">Faturalama Bilgileri</h3>
                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-2.5">
                      <p className="text-xs text-slate-500">Fatura Kesilecek Müşteri</p>
                      <p className="text-base font-semibold leading-tight tracking-tight text-slate-900">{detailData.gonderen}</p>
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-2.5">
                      <p className="text-xs text-slate-500">Ödeme Türü</p>
                      <p className="text-base font-semibold leading-tight tracking-tight text-slate-900">{detailData.odemeTuru}</p>
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-2.5">
                      <p className="text-xs text-slate-500">Fatura Türü</p>
                      <p className="text-base font-semibold leading-tight tracking-tight text-slate-900">{detailData.faturaTuru}</p>
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-2.5">
                      <p className="text-xs text-slate-500">Fatura Durumu</p>
                      <p className="text-base font-semibold leading-tight tracking-tight text-slate-900">{detailData.faturaDurumu}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-xl border-slate-200 bg-white shadow-sm">
                <CardContent className="space-y-2.5 p-3.5">
                  <h3 className="text-xl font-semibold tracking-tight text-slate-900">İşlemler</h3>
                  <Button variant="outline" className="h-9 w-full justify-start rounded-lg px-3.5 text-sm font-semibold">Faturayı Görüntüle</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="events" className="space-y-3">
            <Card className="rounded-xl border-slate-200 bg-white shadow-sm">
              <CardContent className="space-y-4 p-3.5">
                <h3 className="text-xl font-semibold tracking-tight text-slate-900">Kargo Zaman Akışı</h3>

                <div className="grid gap-3 md:grid-cols-2">
                  <div className="rounded-xl border border-border bg-muted/40 p-3">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Route className="size-4" />
                      <p className="text-xs font-semibold uppercase tracking-wide">Transfer Hattı</p>
                    </div>
                    <p className="mt-1.5 text-sm font-semibold text-foreground">{detailData.transferHatti}</p>
                  </div>
                  <div className="rounded-xl border border-border bg-muted/40 p-3">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Building2 className="size-4" />
                      <p className="text-xs font-semibold uppercase tracking-wide">Varış Şubesi</p>
                    </div>
                    <p className="mt-1.5 text-sm font-semibold text-foreground">{detailData.varisSubesi}</p>
                  </div>
                </div>

                <TimelineBlock items={detailData.takipGecmisi} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notes">
            <Card className="rounded-xl border-slate-200 bg-white shadow-sm">
              <CardContent className="space-y-3 p-3.5">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-xl font-semibold tracking-tight text-slate-900">Notlar</h3>
                  <Button
                    type="button"
                    variant={isNoteEditorOpen ? "outline" : "default"}
                    className="h-9 rounded-lg px-3.5 text-sm font-semibold"
                    onClick={() => setIsNoteEditorOpen((prev) => !prev)}
                  >
                    Yeni Not Ekle
                  </Button>
                </div>

                {isNoteEditorOpen && (
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-2.5">
                    <p className="mb-2 text-sm font-semibold text-slate-700">Yeni Not Ekle</p>
                    <Textarea
                      placeholder="Operasyon veya destek notu girin..."
                      className="min-h-24 rounded-xl border-slate-200 bg-white text-sm"
                      value={noteDraft}
                      onChange={(event) => setNoteDraft(event.target.value)}
                    />
                    <div className="mt-2 flex justify-end gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        className="h-9 rounded-lg px-3.5 text-sm font-semibold"
                        onClick={() => {
                          setNoteDraft("")
                          setIsNoteEditorOpen(false)
                        }}
                      >
                        Vazgeç
                      </Button>
                      <Button className="h-9 rounded-lg px-3.5 text-sm font-semibold">Notu Kaydet</Button>
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  {notesHistory.map((item) => (
                    <div key={`${item.source}-${item.date}`} className="rounded-xl border border-slate-200 bg-white p-3">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="text-sm font-semibold text-slate-800">{item.source}</p>
                        <Badge
                          className={`rounded-xl border px-3 py-1 text-sm ${
                            item.tag === "Destek"
                              ? "border-amber-200 bg-amber-50 text-amber-700"
                              : "border-slate-200 bg-white text-slate-700"
                          }`}
                        >
                          {item.tag}
                        </Badge>
                      </div>
                      <p className="mt-2 text-sm text-slate-700">{item.note}</p>
                      <p className="mt-1 text-sm text-slate-500">{item.date}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {deliveryInfoModalPiece && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-[2px]">
          <div className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <h3 className="text-lg font-semibold text-slate-900">Teslim Alan Kişi Bilgisi</h3>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-8"
                onClick={() => setDeliveryInfoModalPiece(null)}
              >
                <X className="size-4" />
              </Button>
            </div>

            <div className="space-y-4 p-5">
              <div className="grid gap-3 md:grid-cols-2">
                <div className="space-y-1">
                  <p className="text-xs text-slate-500">Ad</p>
                  <Input value={deliveryInfoModalPiece.teslim_alan_ad || "-"} readOnly className="h-9" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-slate-500">Soyad</p>
                  <Input value={deliveryInfoModalPiece.teslim_alan_soyad || "-"} readOnly className="h-9" />
                </div>
                <div className="space-y-1 md:col-span-2">
                  <p className="text-xs text-slate-500">Teslimat Zamanı</p>
                  <Input value={deliveryInfoModalPiece.teslimat_zamani || "-"} readOnly className="h-9" />
                </div>
                <div className="space-y-1 md:col-span-2">
                  <p className="text-xs text-slate-500">Telefon Numarası</p>
                  <Input value={deliveryInfoModalPiece.teslim_alan_telefonu || "-"} readOnly className="h-9" />
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <p className="text-xs text-slate-500">Resim</p>
                <div className="mt-2 overflow-hidden rounded-lg border border-slate-200 bg-white">
                  {deliveryInfoModalPiece.teslimat_resmi_url ? (
                    <img
                      src={deliveryInfoModalPiece.teslimat_resmi_url}
                      alt="Teslimat resmi"
                      className="h-56 w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-40 items-center justify-center text-sm text-slate-500">-</div>
                  )}
                </div>
              </div>

              <div className="flex justify-end">
                <Button type="button" variant="outline" onClick={() => setDeliveryInfoModalPiece(null)}>
                  Kapat
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {reportInfoModalPiece && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-[2px]">
          <div className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <h3 className="text-lg font-semibold text-slate-900">İhbar Bilgisi</h3>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-8"
                onClick={() => setReportInfoModalPiece(null)}
              >
                <X className="size-4" />
              </Button>
            </div>

            <div className="space-y-4 p-5">
              <div className="grid gap-3 md:grid-cols-2">
                <div className="space-y-1">
                  <p className="text-xs text-slate-500">Parça No</p>
                  <Input value={reportInfoModalPiece.parca_no || "-"} readOnly className="h-9" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-slate-500">İhbar Zamanı</p>
                  <Input value={reportInfoModalPiece.ihbar_zamani || "-"} readOnly className="h-9" />
                </div>
                <div className="space-y-1 md:col-span-2">
                  <p className="text-xs text-slate-500">İhbar Sebebi</p>
                  <Input value={reportInfoModalPiece.ihbar_sebebi || "-"} readOnly className="h-9" />
                </div>
                <div className="space-y-1 md:col-span-2">
                  <p className="text-xs text-slate-500">Açıklama</p>
                  <Textarea
                    value={reportInfoModalPiece.ihbar_aciklama || "-"}
                    readOnly
                    className="min-h-24 rounded-xl border-slate-200 bg-white text-sm"
                  />
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <p className="text-xs text-slate-500">Kanıt Görseli</p>
                <div className="mt-2 overflow-hidden rounded-lg border border-slate-200 bg-white">
                  {reportInfoModalPiece.ihbar_kanit_url ? (
                    <img
                      src={reportInfoModalPiece.ihbar_kanit_url}
                      alt="İhbar kanıt görseli"
                      className="h-56 w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-40 items-center justify-center text-sm text-slate-500">-</div>
                  )}
                </div>
              </div>

              <div className="flex justify-end">
                <Button type="button" variant="outline" onClick={() => setReportInfoModalPiece(null)}>
                  Kapat
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {deliveryEntryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-[2px]">
          <div className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <h3 className="text-lg font-semibold text-slate-900">Teslimat Bilgisi Al</h3>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-8"
                onClick={() => setDeliveryEntryModalOpen(false)}
              >
                <X className="size-4" />
              </Button>
            </div>

            <div className="space-y-4 p-5">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-2.5">
                <p className="text-xs text-slate-500">Seçili Parça Adedi</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">{deliveryEntryPieceNos.length || 0}</p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-2.5">
                <p className="text-xs text-slate-500">Parça Noları</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">{deliveryEntryPieceNoPreview}</p>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <div className="space-y-1">
                  <p className="text-xs text-slate-500">Ad</p>
                  <Input
                    value={deliveryEntryFirstName}
                    onChange={(event: ChangeEvent<HTMLInputElement>) => setDeliveryEntryFirstName(event.target.value)}
                    placeholder="Ad"
                    className="h-9"
                  />
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-slate-500">Soyad</p>
                  <Input
                    value={deliveryEntryLastName}
                    onChange={(event: ChangeEvent<HTMLInputElement>) => setDeliveryEntryLastName(event.target.value)}
                    placeholder="Soyad"
                    className="h-9"
                  />
                </div>
                <div className="space-y-1 md:col-span-2">
                  <p className="text-xs text-slate-500">Telefon Numarası</p>
                  <Input
                    value={deliveryEntryPhone}
                    onChange={(event: ChangeEvent<HTMLInputElement>) => setDeliveryEntryPhone(event.target.value)}
                    placeholder="05xx xxx xx xx"
                    className="h-9"
                  />
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <p className="text-xs text-slate-500">Resim</p>
                <div className="mt-2 max-w-sm">
                  <Input type="file" accept="image/*" className="h-9 bg-white" />
                </div>
              </div>

              <p className="text-xs text-slate-500">
                Kaydet ile girilen teslimat bilgileri seçili parcaların tamamına uygulanır.
              </p>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setDeliveryEntryModalOpen(false)}>
                  Vazgeç
                </Button>
                <Button type="button" onClick={() => setDeliveryEntryModalOpen(false)}>
                  Kaydet
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {reportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-[2px]">
          <div className="w-full max-w-3xl rounded-2xl border border-slate-200 bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <h3 className="text-lg font-semibold text-slate-900">Parça İhbar Et</h3>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-8"
                onClick={() => setReportModalOpen(false)}
              >
                <X className="size-4" />
              </Button>
            </div>

            <div className="space-y-4 p-5">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-2.5">
                <p className="text-xs text-slate-500">Seçili Parça Adeti</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">{reportPieceNos.length || 0}</p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-2.5">
                <p className="text-xs text-slate-500">Parça Numaraları</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">{reportPieceNoPreview}</p>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <div className="space-y-1">
                  <p className="text-xs text-slate-500">İhbar Sebebi</p>
                  <Select value={reportReason} onValueChange={setReportReason}>
                    <SelectTrigger className="h-11 rounded-xl border-slate-200 bg-white">
                      <SelectValue placeholder="Sebep seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hasarli_kargo">Hasarlı Kargo</SelectItem>
                      <SelectItem value="yanlis_urun">Yanlış Ürün</SelectItem>
                      <SelectItem value="eksik_hatali_evrak">Eksik/Hatalı Evrak</SelectItem>
                      <SelectItem value="saskin_kargo">Şaşkın Kargo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <p className="text-xs text-slate-500">Kanıt Görseli</p>
                  <Input type="file" accept="image/*" className="h-10 rounded-xl border-slate-200 bg-white" />
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-xs text-slate-500">Açıklama</p>
                <Textarea
                  value={reportDescription}
                  onChange={(event: ChangeEvent<HTMLTextAreaElement>) => setReportDescription(event.target.value)}
                  placeholder="İhbar detayını yazın..."
                  className="min-h-28 rounded-xl border-slate-200 bg-white text-sm"
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setReportModalOpen(false)}>
                  Vazgeç
                </Button>
                <Button
                  type="button"
                  className="bg-rose-600 text-white hover:bg-rose-700"
                  onClick={() => setReportModalOpen(false)}
                >
                  İhbarı Kaydet
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {handoverModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-[2px]">
          <div className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <h3 className="text-lg font-semibold text-slate-900">Kargoyu Devret</h3>
              <Button type="button" variant="ghost" size="icon" className="size-8" onClick={() => setHandoverModalOpen(false)}>
                <X className="size-4" />
              </Button>
            </div>

            <div className="space-y-4 p-5">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-2.5">
                <p className="text-xs text-slate-500">Takip No</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">{detailData.takipNo}</p>
              </div>

              <div className="space-y-1">
                <p className="text-xs text-slate-500">Devretme Sebebi</p>
                <Select value={handoverReason} onValueChange={setHandoverReason}>
                  <SelectTrigger className="h-11 rounded-xl border-slate-200 bg-white">
                    <SelectValue placeholder="Sebep seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="musteri_adreste_degil">Müşteri adreste değil</SelectItem>
                    <SelectItem value="musteriye_ulasilamiyor">Müşteriye ulaşılamıyor</SelectItem>
                    <SelectItem value="diger_sebep">Diğer sebep</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <p className="text-xs text-slate-500">Açıklama (Opsiyonel)</p>
                <Textarea
                  value={handoverNote}
                  onChange={(event: ChangeEvent<HTMLTextAreaElement>) => setHandoverNote(event.target.value)}
                  placeholder="Devretme ile ilgili kısa not ekleyin..."
                  className="min-h-24 rounded-xl border-slate-200 bg-white text-sm"
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setHandoverModalOpen(false)}>
                  Vazgeç
                </Button>
                <Button type="button" onClick={() => setHandoverModalOpen(false)}>
                  <ArrowRightLeft className="size-4" />
                  Devret
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {cancelModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-[2px]">
          <div className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <h3 className="text-lg font-semibold text-slate-900">Gönderiyi İptal Et</h3>
              <Button type="button" variant="ghost" size="icon" className="size-8" onClick={() => setCancelModalOpen(false)}>
                <X className="size-4" />
              </Button>
            </div>

            <div className="space-y-4 p-5">
              <div className="rounded-xl border border-rose-200 bg-rose-50 p-2.5">
                <p className="text-xs text-rose-600">Bu işlem gönderiyi iptal eder ve geri alınamaz.</p>
              </div>

              <div className="space-y-1">
                <p className="text-xs text-slate-500">İptal Sebebi</p>
                <Select value={cancelReason} onValueChange={setCancelReason}>
                  <SelectTrigger className="h-11 rounded-xl border-slate-200 bg-white">
                    <SelectValue placeholder="Sebep seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="musteri_talebi">Müşteri talebi</SelectItem>
                    <SelectItem value="yanlis_gonderi_kaydi">Yanlış gönderi kaydı</SelectItem>
                    <SelectItem value="tasimaya_uygunsuz">Taşımaya uygunsuz içerik</SelectItem>
                    <SelectItem value="diger_sebep">Diğer sebep</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <p className="text-xs text-slate-500">Açıklama</p>
                <Textarea
                  value={cancelNote}
                  onChange={(event: ChangeEvent<HTMLTextAreaElement>) => setCancelNote(event.target.value)}
                  placeholder="İptal detayını yazın..."
                  className="min-h-24 rounded-xl border-slate-200 bg-white text-sm"
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setCancelModalOpen(false)}>
                  Vazgeç
                </Button>
                <Button type="button" className="bg-rose-600 text-white hover:bg-rose-700" onClick={() => setCancelModalOpen(false)}>
                  <Ban className="size-4" />
                  Gönderiyi İptal Et
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
