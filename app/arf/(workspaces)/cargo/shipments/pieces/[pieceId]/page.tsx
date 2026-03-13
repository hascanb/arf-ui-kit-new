"use client"

import { useCallback, useMemo, useState } from "react"
import { useParams } from "next/navigation"
import type { ColumnDef, Table as TanStackTable } from "@tanstack/react-table"
import { DataTable, DataTableColumnHeader, DataTablePagination } from "@hascanb/arf-ui-kit/datatable-kit"
import { AppHeader } from "@hascanb/arf-ui-kit/layout-kit"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

type PieceStatus = "beklemede" | "transferde" | "dagitimda" | "teslim_edildi"
type PieceType = "koli" | "palet" | "cuval"
type MovementStatus = "kaydedildi" | "araca_yuklendi" | "aractan_indirildi" | "dagitimda" | "teslim_edildi"

type MovementRow = {
	id: string
	olusturulma_zamani: string
	islem_yapan: string
	islem_yapan_sube: string
	plaka: string
	durum: MovementStatus
	aciklama: string
}

type PieceDetail = {
	id: string
	parca_no: string
	takip_no: string
	kargo_kodu: string
	durum: PieceStatus
	parca_tipi: PieceType
	desi: number
	agirlik: number
	odeme_turu: "Gönderici Ödemeli" | "Alıcı Ödemeli"
	olusturulma_zamani: string
	guncellenme_zamani: string
	gonderici: string
	gonderici_telefon: string
	alici: string
	alici_telefon: string
	cikis_sube: string
	varis_sube: string
	hareketler: MovementRow[]
}

const pieceStatusConfig: Record<PieceStatus, { label: string; className: string }> = {
	beklemede: { label: "Beklemede", className: "border-amber-200 bg-amber-50 text-amber-700" },
	transferde: { label: "Transferde", className: "border-primary/20 bg-primary/10 text-foreground" },
	dagitimda: { label: "Dağıtımda", className: "border-secondary/25 bg-secondary/15 text-foreground" },
	teslim_edildi: { label: "Teslim Edildi", className: "border-emerald-200 bg-emerald-50 text-emerald-700" },
}

const movementStatusConfig: Record<MovementStatus, { label: string; className: string }> = {
	kaydedildi: { label: "Kaydedildi", className: "border-border bg-muted text-muted-foreground" },
	araca_yuklendi: { label: "Araca Yüklendi", className: "border-primary/20 bg-primary/10 text-foreground" },
	aractan_indirildi: { label: "Araçtan İndirildi", className: "border-amber-200 bg-amber-50 text-amber-700" },
	dagitimda: { label: "Dağıtımda", className: "border-secondary/25 bg-secondary/15 text-foreground" },
	teslim_edildi: { label: "Teslim Edildi", className: "border-emerald-200 bg-emerald-50 text-emerald-700" },
}

const pieceTypeLabel: Record<PieceType, string> = {
	koli: "Koli",
	palet: "Palet",
	cuval: "Çuval",
}

const pieceDetailMap: Record<string, PieceDetail> = {
	"piece-1": {
		id: "piece-1",
		parca_no: "10003757001",
		takip_no: "10003757",
		kargo_kodu: "10003757001",
		durum: "dagitimda",
		parca_tipi: "koli",
		desi: 35,
		agirlik: 35,
		odeme_turu: "Alıcı Ödemeli",
		olusturulma_zamani: "13/03/2026, 05:26",
		guncellenme_zamani: "13/03/2026, 09:03",
		gonderici: "ETHEM DEMİR",
		gonderici_telefon: "5462661483",
		alici: "ALI DALKILIÇ",
		alici_telefon: "5011740747",
		cikis_sube: "Mardin Nusaybin Şube",
		varis_sube: "Diyarbakır Transfer Merkezi",
		hareketler: [
			{
				id: "piece-1-m1",
				olusturulma_zamani: "13/03/2026, 09:03",
				islem_yapan: "Diyarbakır TM",
				islem_yapan_sube: "Merkez Şube",
				plaka: "21ABR479",
				durum: "aractan_indirildi",
				aciklama: "Parça transfer aracından indirildi.",
			},
			{
				id: "piece-1-m2",
				olusturulma_zamani: "13/03/2026, 05:34",
				islem_yapan: "Akbar Akyol",
				islem_yapan_sube: "Mardin Nusaybin Şube",
				plaka: "21ABR479",
				durum: "araca_yuklendi",
				aciklama: "Parça transfer aracına barkod okutularak yüklendi.",
			},
			{
				id: "piece-1-m3",
				olusturulma_zamani: "13/03/2026, 05:26",
				islem_yapan: "Akbar Akyol",
				islem_yapan_sube: "Mardin Nusaybin Şube",
				plaka: "-",
				durum: "kaydedildi",
				aciklama: "Parça oluşturuldu ve barkod üretildi.",
			},
		],
	},
	"piece-2": {
		id: "piece-2",
		parca_no: "10003757002",
		takip_no: "10003757",
		kargo_kodu: "10003757002",
		durum: "transferde",
		parca_tipi: "palet",
		desi: 24,
		agirlik: 18,
		odeme_turu: "Alıcı Ödemeli",
		olusturulma_zamani: "13/03/2026, 05:30",
		guncellenme_zamani: "13/03/2026, 08:12",
		gonderici: "ETHEM DEMİR",
		gonderici_telefon: "5462661483",
		alici: "ALI DALKILIÇ",
		alici_telefon: "5011740747",
		cikis_sube: "Mardin Nusaybin Şube",
		varis_sube: "Konya Meram Şube",
		hareketler: [
			{
				id: "piece-2-m1",
				olusturulma_zamani: "13/03/2026, 08:12",
				islem_yapan: "Diyarbakır TM",
				islem_yapan_sube: "Diyarbakır Transfer Merkezi",
				plaka: "34KL3419",
				durum: "araca_yuklendi",
				aciklama: "Parça varış hattı için araca yüklendi.",
			},
			{
				id: "piece-2-m2",
				olusturulma_zamani: "13/03/2026, 05:30",
				islem_yapan: "Akbar Akyol",
				islem_yapan_sube: "Mardin Nusaybin Şube",
				plaka: "-",
				durum: "kaydedildi",
				aciklama: "Parça oluşturuldu ve sisteme işlendi.",
			},
		],
	},
	"1-01": {
		id: "1-01",
		parca_no: "100101",
		takip_no: "1001",
		kargo_kodu: "100101",
		durum: "teslim_edildi",
		parca_tipi: "koli",
		desi: 4,
		agirlik: 3.2,
		odeme_turu: "Gönderici Ödemeli",
		olusturulma_zamani: "11/03/2026, 17:31",
		guncellenme_zamani: "12/03/2026, 22:33",
		gonderici: "MEHMET DEMİR",
		gonderici_telefon: "0532 111 22 33",
		alici: "AYŞE KORKMAZ",
		alici_telefon: "0542 222 33 44",
		cikis_sube: "Mardin Nusaybin Şube",
		varis_sube: "Diyarbakır Transfer Merkezi",
		hareketler: [
			{
				id: "1-01-m1",
				olusturulma_zamani: "12/03/2026, 22:33",
				islem_yapan: "Diyarbakır TM",
				islem_yapan_sube: "Diyarbakır Transfer Merkezi",
				plaka: "34KL3419",
				durum: "araca_yuklendi",
				aciklama: "Parça teslimat aracına yüklendi.",
			},
			{
				id: "1-01-m2",
				olusturulma_zamani: "11/03/2026, 20:50",
				islem_yapan: "Diyarbakır TM",
				islem_yapan_sube: "Diyarbakır Transfer Merkezi",
				plaka: "21ABR479",
				durum: "aractan_indirildi",
				aciklama: "Transfer aracından indirme tamamlandı.",
			},
			{
				id: "1-01-m3",
				olusturulma_zamani: "11/03/2026, 17:34",
				islem_yapan: "Akbar Akyol",
				islem_yapan_sube: "Mardin Nusaybin Şube",
				plaka: "21ABR479",
				durum: "araca_yuklendi",
				aciklama: "Çıkış için barkod okutularak araca yüklendi.",
			},
			{
				id: "1-01-m4",
				olusturulma_zamani: "11/03/2026, 17:31",
				islem_yapan: "Akbar Akyol",
				islem_yapan_sube: "Mardin Nusaybin Şube",
				plaka: "-",
				durum: "kaydedildi",
				aciklama: "Parça kaydı oluşturuldu.",
			},
		],
	},
}

const buildFallbackDetail = (pieceId: string): PieceDetail => {
	const normalized = pieceId || "piece-unknown"

	return {
		id: normalized,
		parca_no: normalized,
		takip_no: normalized.split("-")[0] || "1000",
		kargo_kodu: normalized,
		durum: "beklemede",
		parca_tipi: "koli",
		desi: 0,
		agirlik: 0,
		odeme_turu: "Alıcı Ödemeli",
		olusturulma_zamani: "-",
		guncellenme_zamani: "-",
		gonderici: "-",
		gonderici_telefon: "-",
		alici: "-",
		alici_telefon: "-",
		cikis_sube: "-",
		varis_sube: "-",
		hareketler: [],
	}
}

function InfoCell({ label, value }: { label: string; value: string }) {
	return (
		<div className="rounded-xl border border-slate-200 bg-white px-3.5 py-2.5">
			<p className="text-xs text-slate-500">{label}</p>
			<p className="mt-1 text-base font-semibold leading-tight tracking-tight text-slate-900">{value}</p>
		</div>
	)
}

export default function ParcaDetayPage() {
	const params = useParams<{ pieceId: string }>()
	const [table, setTable] = useState<TanStackTable<MovementRow> | null>(null)

	const pieceId = useMemo(() => {
		if (!params?.pieceId) {
			return "piece-1"
		}

		return Array.isArray(params.pieceId) ? params.pieceId[0] : params.pieceId
	}, [params])

	const detail = useMemo(() => {
		return pieceDetailMap[pieceId] ?? buildFallbackDetail(pieceId)
	}, [pieceId])

	const handleTableReady = useCallback((nextTable: TanStackTable<MovementRow>) => {
		setTable(nextTable)
	}, [])

	const movementColumns = useMemo<ColumnDef<MovementRow>[]>(
		() => [
			{
				accessorKey: "olusturulma_zamani",
				header: ({ column }) => <DataTableColumnHeader column={column} title="Oluşturulma Zamanı" />,
			},
			{
				accessorKey: "islem_yapan",
				header: ({ column }) => <DataTableColumnHeader column={column} title="İşlem Yapan" />,
			},
			{
				accessorKey: "islem_yapan_sube",
				header: ({ column }) => <DataTableColumnHeader column={column} title="İşlem Yapan Şube" />,
			},
			{
				accessorKey: "plaka",
				header: ({ column }) => <DataTableColumnHeader column={column} title="Plaka" />,
				cell: ({ row }) => <span className="font-medium text-slate-700">{row.original.plaka || "-"}</span>,
			},
			{
				accessorKey: "durum",
				header: ({ column }) => <DataTableColumnHeader column={column} title="Durum" />,
				cell: ({ row }) => {
					const status = movementStatusConfig[row.original.durum]
					return (
						<Badge variant="outline" className={status.className}>
							{status.label}
						</Badge>
					)
				},
			},
			{
				accessorKey: "aciklama",
				header: ({ column }) => <DataTableColumnHeader column={column} title="Açıklama" />,
				cell: ({ row }) => <span className="text-slate-600">{row.original.aciklama}</span>,
			},
		],
		[],
	)

	const status = pieceStatusConfig[detail.durum]

	return (
		<>
			<AppHeader
				breadcrumbs={[
					{ label: "Ana Sayfa", href: "/" },
					{ label: "Kargo İşlemleri", href: "/arf/cargo/shipments" },
					{ label: "Parça Listesi", href: "/arf/cargo/shipments/pieces" },
					{ label: `Parça ${detail.parca_no}` },
				]}
			/>

			<div className="flex flex-1 flex-col gap-3 bg-slate-50 p-3 pt-2.5 lg:gap-4">
				<Card className="rounded-xl border-slate-200 bg-white shadow-sm">
					<CardContent className="space-y-3 p-3.5 lg:p-4">
						<div className="flex flex-wrap items-start justify-between gap-2">
							<div>
								<h1 className="text-[24px] font-semibold tracking-tight text-slate-900">Parça Detayı: {detail.parca_no}</h1>
								<p className="mt-1 text-sm text-slate-600">Takip No: {detail.takip_no}</p>
							</div>

							<Badge variant="outline" className={status.className}>
								{status.label}
							</Badge>
						</div>

						<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
							<InfoCell label="Parça/Barkod No" value={detail.parca_no} />
							<InfoCell label="Parça Tipi" value={pieceTypeLabel[detail.parca_tipi]} />
							<InfoCell label="Desi" value={String(detail.desi)} />
							<InfoCell label="Ağırlık" value={`${detail.agirlik} kg`} />
							<InfoCell label="Ödeme Türü" value={detail.odeme_turu} />
							<InfoCell label="Oluşturulma Zamanı" value={detail.olusturulma_zamani} />
							<InfoCell label="Güncellenme Zamanı" value={detail.guncellenme_zamani} />
							<InfoCell label="Kargo Kodu" value={detail.kargo_kodu} />
						</div>
					</CardContent>
				</Card>

				<Card className="rounded-xl border-slate-200 bg-white shadow-sm">
					<CardContent className="space-y-3 p-3.5">
						<h2 className="text-xl font-semibold tracking-tight text-slate-900">Kargo Bağlamı</h2>
						<div className="grid gap-3 md:grid-cols-2">
							<div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
								<p className="text-xs text-slate-500">Gönderici</p>
								<p className="mt-1 text-sm font-semibold text-slate-900">{detail.gonderici}</p>
								<p className="text-xs text-slate-600">{detail.gonderici_telefon}</p>
							</div>
							<div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
								<p className="text-xs text-slate-500">Alıcı</p>
								<p className="mt-1 text-sm font-semibold text-slate-900">{detail.alici}</p>
								<p className="text-xs text-slate-600">{detail.alici_telefon}</p>
							</div>
							<div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
								<p className="text-xs text-slate-500">Çıkış Şubesi</p>
								<p className="mt-1 text-sm font-semibold text-slate-900">{detail.cikis_sube}</p>
							</div>
							<div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
								<p className="text-xs text-slate-500">Varış Şubesi</p>
								<p className="mt-1 text-sm font-semibold text-slate-900">{detail.varis_sube}</p>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card className="rounded-xl border-slate-200 bg-white shadow-sm">
					<CardContent className="space-y-3 p-3.5">
						<h2 className="text-xl font-semibold tracking-tight text-slate-900">Parça Hareketleri</h2>
						<DataTable
							data={detail.hareketler}
							columns={movementColumns}
							enableSorting
							enableGlobalFilter
							enableColumnVisibility
							enableHorizontalScroll
							emptyMessage="Bu parçaya ait hareket kaydı bulunamadı."
							className="[&_thead_tr]:bg-slate-50 [&_thead_th]:font-semibold [&_thead_th]:text-slate-600"
							onTableReady={handleTableReady}
						/>

						{table && (
							<DataTablePagination
								table={table as TanStackTable<unknown>}
								pageSizeOptions={[5, 10, 20]}
								totalRows={detail.hareketler.length}
							/>
						)}
					</CardContent>
				</Card>
			</div>
		</>
	)
}
