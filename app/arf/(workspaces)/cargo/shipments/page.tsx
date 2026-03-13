"use client"

import Link from "next/link"
import { type ChangeEvent, useCallback, useEffect, useMemo, useState } from "react"
import type {
  ColumnDef,
  ColumnFiltersState,
  PaginationState,
  SortingState,
  Table as TanStackTable,
  Updater,
} from "@tanstack/react-table"
import type { DateRange } from "react-day-picker"
import { tr } from "date-fns/locale"
import {
  DataTable,
  DataTableColumnHeader,
  DataTableExcelActions,
  DataTableFacetedFilter,
  DataTablePagination,
  DataTableToolbar,
} from "@hascanb/arf-ui-kit/datatable-kit"
import { AppHeader } from "@hascanb/arf-ui-kit/layout-kit"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Ban,
  CalendarIcon,
  CheckCircle2,
  Clock,
  Eye,
  Filter,
  MoreHorizontal,
  Package,
  Plus,
  PlusCircle,
  Truck,
} from "lucide-react"

const mockCargos = [
  {
    id: "1",
    takip_no: "ARF-10000300",
    gonderen_musteri: "Ahmet Yılmaz",
    gonderen_sube: "İstanbul Merkez Şube",
    alici_sube: "Ankara Şube",
    alici_musteri: "Mehmet Demir",
    alici_telefon: "0532 111 22 33",
    odeme_turu: "Gönderici Ödemeli",
    fatura_turu: "Gönderici",
    matrah: 105.93,
    kdv: 21.19,
    toplam: 127.12,
    t_adet: 3,
    t_desi: 12,
    parca_listesi: "3 Parça",
    irsaliye_no: "IRS-2026001",
    atf_no: "ATF-000123",
    olusturulma_zamani: "2024-01-15 09:30",
    varis_zamani: "2024-01-16 14:00",
    teslimat_zamani: "2024-01-17 11:20",
    kargo_durumu: "dagitimda",
    fatura_durumu: "kesildi",
    tahsilat_durumu: "tahsil_edildi",
    olusturan: "Ali Veli",
  },
  {
    id: "2",
    takip_no: "ARF-10000301",
    gonderen_musteri: "Fatma Kaya",
    gonderen_sube: "İzmir Şube",
    alici_sube: "Bursa Şube",
    alici_musteri: "Ali Veli",
    alici_telefon: "0542 222 33 44",
    odeme_turu: "Alıcı Ödemeli",
    fatura_turu: "Alıcı",
    matrah: 75.42,
    kdv: 15.08,
    toplam: 90.5,
    t_adet: 1,
    t_desi: 5,
    parca_listesi: "1 Parça",
    irsaliye_no: "IRS-2026002",
    atf_no: "ATF-000124",
    olusturulma_zamani: "2024-01-14 08:15",
    varis_zamani: "2024-01-15 12:30",
    teslimat_zamani: "2024-01-15 16:45",
    kargo_durumu: "teslim_edildi",
    fatura_durumu: "kesildi",
    tahsilat_durumu: "tahsil_edildi",
    olusturan: "Zeynep Arslan",
  },
  {
    id: "3",
    takip_no: "ARF-10000302",
    gonderen_musteri: "Zeynep Öztürk",
    gonderen_sube: "Ankara Şube",
    alici_sube: "Antalya Şube",
    alici_musteri: "Can Yıldırım",
    alici_telefon: "0555 333 44 55",
    odeme_turu: "Gönderici Ödemeli",
    fatura_turu: "Gönderici",
    matrah: 131.36,
    kdv: 26.27,
    toplam: 157.63,
    t_adet: 5,
    t_desi: 30,
    parca_listesi: "5 Parça",
    irsaliye_no: "IRS-2026003",
    atf_no: "",
    olusturulma_zamani: "2024-01-15 10:45",
    varis_zamani: "",
    teslimat_zamani: "",
    kargo_durumu: "beklemede",
    fatura_durumu: "kesilmedi",
    tahsilat_durumu: "beklemede",
    olusturan: "Murat Demir",
  },
  {
    id: "4",
    takip_no: "ARF-10000303",
    gonderen_musteri: "Murat Çelik",
    gonderen_sube: "Bursa Şube",
    alici_sube: "İstanbul Merkez Şube",
    alici_musteri: "Ayşe Korkmaz",
    alici_telefon: "0501 444 55 66",
    odeme_turu: "Alıcı Ödemeli",
    fatura_turu: "Alıcı",
    matrah: 65.68,
    kdv: 13.14,
    toplam: 78.82,
    t_adet: 2,
    t_desi: 8,
    parca_listesi: "2 Parça",
    irsaliye_no: "IRS-2026004",
    atf_no: "ATF-000126",
    olusturulma_zamani: "2024-01-15 07:00",
    varis_zamani: "2024-01-16 09:00",
    teslimat_zamani: "",
    kargo_durumu: "transfer",
    fatura_durumu: "kesilmedi",
    tahsilat_durumu: "beklemede",
    olusturan: "Ali Veli",
  },
  {
    id: "5",
    takip_no: "ARF-10000304",
    gonderen_musteri: "Elif Şahin",
    gonderen_sube: "Antalya Şube",
    alici_sube: "İzmir Şube",
    alici_musteri: "Burak Yıldız",
    alici_telefon: "0533 555 66 77",
    odeme_turu: "Gönderici Ödemeli",
    fatura_turu: "Gönderici",
    matrah: 94.92,
    kdv: 18.98,
    toplam: 113.9,
    t_adet: 4,
    t_desi: 18,
    parca_listesi: "4 Parça",
    irsaliye_no: "IRS-2026005",
    atf_no: "ATF-000127",
    olusturulma_zamani: "2024-01-14 13:20",
    varis_zamani: "2024-01-15 10:00",
    teslimat_zamani: "",
    kargo_durumu: "teslim_alindi",
    fatura_durumu: "kesildi",
    tahsilat_durumu: "beklemede",
    olusturan: "Zeynep Arslan",
  },
]

type CargoRow = (typeof mockCargos)[number]

const kargoStatusConfig: Record<string, { label: string; className: string; icon: React.ComponentType<{ className?: string }> }> = {
  beklemede: { label: "Beklemede", className: "bg-amber-500/10 text-amber-600 border-amber-500/20", icon: Clock },
  teslim_alindi: { label: "Teslim Alındı", className: "bg-blue-500/10 text-blue-600 border-blue-500/20", icon: Package },
  transfer: { label: "Transfer", className: "bg-purple-500/10 text-purple-600 border-purple-500/20", icon: Truck },
  dagitimda: { label: "Dağıtımda", className: "bg-sky-500/10 text-sky-600 border-sky-500/20", icon: Truck },
  teslim_edildi: {
    label: "Teslim Edildi",
    className: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    icon: CheckCircle2,
  },
}

const faturaStatusConfig: Record<string, { label: string; className: string }> = {
  kesildi: { label: "Kesildi", className: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" },
  kesilmedi: { label: "Kesilmedi", className: "bg-slate-500/10 text-slate-500 border-slate-400/20" },
}

const tahsilatStatusConfig: Record<string, { label: string; className: string }> = {
  tahsil_edildi: { label: "Tahsil Edildi", className: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" },
  beklemede: { label: "Beklemede", className: "bg-amber-500/10 text-amber-600 border-amber-500/20" },
  iptal: { label: "İptal", className: "bg-red-500/10 text-red-600 border-red-500/20" },
}

const statusFilterOptions = [
  { label: "Beklemede", value: "beklemede" },
  { label: "Teslim Alındı", value: "teslim_alindi" },
  { label: "Transfer", value: "transfer" },
  { label: "Dağıtımda", value: "dagitimda" },
  { label: "Teslim Edildi", value: "teslim_edildi" },
]

const paymentTypeFilterOptions = [
  { label: "Gönderici Ödemeli", value: "Gönderici Ödemeli" },
  { label: "Alıcı Ödemeli", value: "Alıcı Ödemeli" },
]

const invoiceTypeFilterOptions = [
  { label: "Gönderici", value: "Gönderici" },
  { label: "Alıcı", value: "Alıcı" },
]

const collectionStatusFilterOptions = [
  { label: "Tahsil Edildi", value: "tahsil_edildi" },
  { label: "Beklemede", value: "beklemede" },
  { label: "İptal", value: "iptal" },
]

const isValidIsoDate = (value: string) => /^\d{4}-\d{2}-\d{2}$/.test(value)

const parseIsoDate = (value: string): Date | undefined => {
  if (!isValidIsoDate(value)) {
    return undefined
  }

  const [year, month, day] = value.split("-").map(Number)
  const date = new Date(year, month - 1, day)

  if (
    Number.isNaN(date.getTime()) ||
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return undefined
  }

  return date
}

const formatIsoDate = (date: Date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

const parseDisplayDate = (value: string): Date | undefined => {
  const match = value.trim().match(/^(\d{2})[./-](\d{2})[./-](\d{4})$/)
  if (!match) {
    return undefined
  }

  const day = Number(match[1])
  const month = Number(match[2])
  const year = Number(match[3])
  const date = new Date(year, month - 1, day)

  if (
    Number.isNaN(date.getTime()) ||
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return undefined
  }

  return date
}

const formatDisplayDate = (date: Date) => {
  const day = String(date.getDate()).padStart(2, "0")
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const year = date.getFullYear()
  return `${day}.${month}.${year}`
}

const formatRangeDisplay = (from?: string, to?: string) => {
  const fromDate = from ? parseIsoDate(from) : undefined
  const toDate = to ? parseIsoDate(to) : undefined

  if (!fromDate && !toDate) {
    return ""
  }

  if (fromDate && toDate && from === to) {
    return formatDisplayDate(fromDate)
  }

  if (fromDate && toDate) {
    return `${formatDisplayDate(fromDate)} - ${formatDisplayDate(toDate)}`
  }

  if (fromDate) {
    return formatDisplayDate(fromDate)
  }

  if (toDate) {
    return formatDisplayDate(toDate)
  }

  return ""
}

const parseRangeInput = (value: string): { from?: string; to?: string } => {
  const normalized = value.trim()
  if (!normalized) {
    return {}
  }

  const dateMatches = normalized.match(/\d{2}[./-]\d{2}[./-]\d{4}/g) ?? []
  if (dateMatches.length === 0) {
    return {}
  }

  const [firstDateText, secondDateText] = dateMatches
  if (!firstDateText) {
    return {}
  }

  const fromDate = parseDisplayDate(firstDateText)
  if (!fromDate) {
    return {}
  }

  if (dateMatches.length === 1) {
    const iso = formatIsoDate(fromDate)
    return { from: iso, to: iso }
  }

  const toDate = secondDateText ? parseDisplayDate(secondDateText) : undefined
  if (!toDate) {
    const iso = formatIsoDate(fromDate)
    return { from: iso, to: iso }
  }

  const [startDate, endDate] = fromDate <= toDate ? [fromDate, toDate] : [toDate, fromDate]

  return {
    from: formatIsoDate(startDate),
    to: formatIsoDate(endDate),
  }
}

const resolveUpdater = <T,>(updater: Updater<T>, previous: T): T =>
  typeof updater === "function" ? (updater as (old: T) => T)(previous) : updater

const getDateOnly = (value: string) => value.split(" ")[0] ?? ""

const queryCargos = ({
  pagination,
  sorting,
  columnFilters,
}: {
  pagination: PaginationState
  sorting: SortingState
  columnFilters: ColumnFiltersState
}) => {
  let filtered = [...mockCargos]

  for (const filter of columnFilters) {
    if (
      filter.id === "odeme_turu" ||
      filter.id === "kargo_durumu" ||
      filter.id === "fatura_turu" ||
      filter.id === "tahsilat_durumu"
    ) {
      const selected = Array.isArray(filter.value) ? (filter.value as string[]) : []
      if (selected.length > 0) {
        filtered = filtered.filter((row) => selected.includes(String(row[filter.id as keyof CargoRow] ?? "")))
      }
      continue
    }

    if (filter.id === "olusturulma_zamani") {
      const value = (filter.value ?? {}) as { from?: string; to?: string }
      if (value.from || value.to) {
        filtered = filtered.filter((row) => {
          const dateOnly = getDateOnly(row.olusturulma_zamani)
          if (!dateOnly) {
            return false
          }
          if (value.from && dateOnly < value.from) {
            return false
          }
          if (value.to && dateOnly > value.to) {
            return false
          }
          return true
        })
      }
    }
  }

  if (sorting.length > 0) {
    const [{ id, desc }] = sorting
    filtered.sort((a, b) => {
      const left = a[id as keyof CargoRow]
      const right = b[id as keyof CargoRow]

      if (typeof left === "number" && typeof right === "number") {
        return desc ? right - left : left - right
      }

      const leftText = String(left ?? "")
      const rightText = String(right ?? "")

      if (leftText === rightText) {
        return 0
      }

      if (desc) {
        return leftText < rightText ? 1 : -1
      }

      return leftText > rightText ? 1 : -1
    })
  }

  const totalRows = filtered.length
  const start = pagination.pageIndex * pagination.pageSize
  const end = start + pagination.pageSize

  return {
    rows: filtered.slice(start, end),
    totalRows,
  }
}

export default function KargolarPage() {
  const [table, setTable] = useState<TanStackTable<CargoRow> | null>(null)
  const [showFacetedFilters, setShowFacetedFilters] = useState(false)
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 5 })
  const [sorting, setSorting] = useState<SortingState>([{ id: "olusturulma_zamani", desc: true }])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [data, setData] = useState<CargoRow[]>([])
  const [totalRows, setTotalRows] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  const [createdAtFrom, setCreatedAtFrom] = useState("")
  const [createdAtTo, setCreatedAtTo] = useState("")
  const [createdAtRangeInput, setCreatedAtRangeInput] = useState("")
  const [isDateRangePickerOpen, setIsDateRangePickerOpen] = useState(false)

  useEffect(() => {
    let cancelled = false
    setIsLoading(true)

    const timer = window.setTimeout(() => {
      const result = queryCargos({ pagination, sorting, columnFilters })

      if (!cancelled) {
        setData(result.rows)
        setTotalRows(result.totalRows)
        setIsLoading(false)
      }
    }, 180)

    return () => {
      cancelled = true
      window.clearTimeout(timer)
    }
  }, [pagination, sorting, columnFilters])

  const summaryCards = useMemo(() => {
    const totalCargo = mockCargos.length
    const totalAmount = mockCargos.reduce((sum, row) => sum + row.toplam, 0)
    const deliveredCount = mockCargos.filter((row) => row.kargo_durumu === "teslim_edildi").length
    const waitingCount = mockCargos.filter((row) => row.kargo_durumu === "beklemede").length

    return [
      {
        label: "Toplam Kargo",
        value: new Intl.NumberFormat("tr-TR").format(totalCargo),
      },
      {
        label: "Toplam Tutar",
        value: new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(totalAmount),
      },
      {
        label: "Teslim Edildi",
        value: new Intl.NumberFormat("tr-TR").format(deliveredCount),
      },
      {
        label: "Beklemede",
        value: new Intl.NumberFormat("tr-TR").format(waitingCount),
      },
    ]
  }, [])

  const handleTableReady = useCallback((nextTable: TanStackTable<CargoRow>) => {
    setTable(nextTable)
  }, [])

  const handlePaginationChange = useCallback((updater: Updater<PaginationState>) => {
    setPagination((previous) => resolveUpdater(updater, previous))
  }, [])

  const handleSortingChange = useCallback((updater: Updater<SortingState>) => {
    setSorting((previous) => resolveUpdater(updater, previous))
    setPagination((previous) => ({ ...previous, pageIndex: 0 }))
  }, [])

  const handleColumnFiltersChange = useCallback((updater: Updater<ColumnFiltersState>) => {
    setColumnFilters((previous) => resolveUpdater(updater, previous))
    setPagination((previous) => ({ ...previous, pageIndex: 0 }))
  }, [])

  const setDateFilterValue = useCallback((from: string, to: string) => {
    const normalizedFrom = isValidIsoDate(from) ? from : undefined
    const normalizedTo = isValidIsoDate(to) ? to : undefined

    setColumnFilters((previous) => {
      const withoutCreated = previous.filter((item) => item.id !== "olusturulma_zamani")

      if (!normalizedFrom && !normalizedTo) {
        return withoutCreated
      }

      return [
        ...withoutCreated,
        {
          id: "olusturulma_zamani",
          value: { from: normalizedFrom, to: normalizedTo },
        },
      ]
    })

    setPagination((previous) => ({ ...previous, pageIndex: 0 }))
  }, [])

  const handleCreatedAtFilterChange = useCallback(
    (nextFrom: string, nextTo: string) => {
      setCreatedAtFrom(nextFrom)
      setCreatedAtTo(nextTo)
      setDateFilterValue(nextFrom, nextTo)
    },
    [setDateFilterValue],
  )

  const selectedCreatedAtRange = useMemo<DateRange | undefined>(() => {
    const fromDate = parseIsoDate(createdAtFrom)
    const toDate = parseIsoDate(createdAtTo)

    if (!fromDate && !toDate) {
      return undefined
    }

    if (fromDate && toDate) {
      return fromDate <= toDate ? { from: fromDate, to: toDate } : { from: toDate, to: fromDate }
    }

    if (fromDate) {
      return { from: fromDate, to: undefined }
    }

    return { from: toDate, to: undefined }
  }, [createdAtFrom, createdAtTo])

  const handleCreatedAtRangeInputChange = useCallback(
    (value: string) => {
      setCreatedAtRangeInput(value)
      const parsed = parseRangeInput(value)
      handleCreatedAtFilterChange(parsed.from ?? "", parsed.to ?? "")
    },
    [handleCreatedAtFilterChange],
  )

  const handleCreatedAtRangeSelect = useCallback(
    (range: DateRange | undefined) => {
      if (!range?.from) {
        setCreatedAtRangeInput("")
        handleCreatedAtFilterChange("", "")
        setIsDateRangePickerOpen(false)
        return
      }

      const fromIso = formatIsoDate(range.from)
      if (!range.to) {
        setCreatedAtRangeInput(formatDisplayDate(range.from))
        handleCreatedAtFilterChange(fromIso, "")
        return
      }

      const [startDate, endDate] = range.from <= range.to ? [range.from, range.to] : [range.to, range.from]
      const startIso = formatIsoDate(startDate)
      const endIso = formatIsoDate(endDate)

      setCreatedAtRangeInput(formatRangeDisplay(startIso, endIso))
      handleCreatedAtFilterChange(startIso, endIso)
    },
    [handleCreatedAtFilterChange],
  )

  useEffect(() => {
    const createdFilter = columnFilters.find((item) => item.id === "olusturulma_zamani")
    const value = (createdFilter?.value ?? {}) as { from?: string; to?: string }

    const nextFrom = value.from && isValidIsoDate(value.from) ? value.from : ""
    const nextTo = value.to && isValidIsoDate(value.to) ? value.to : ""

    if (nextFrom !== createdAtFrom) {
      setCreatedAtFrom(nextFrom)
    }

    if (nextTo !== createdAtTo) {
      setCreatedAtTo(nextTo)
    }

    const nextRangeText = formatRangeDisplay(nextFrom, nextTo)
    if (nextRangeText !== createdAtRangeInput) {
      setCreatedAtRangeInput(nextRangeText)
    }
  }, [columnFilters, createdAtFrom, createdAtTo, createdAtRangeInput])

  const columns = useMemo<ColumnDef<CargoRow>[]>(
    () => [
      {
        accessorKey: "takip_no",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Takip No" />,
        cell: ({ row }) => <span className="font-mono text-sm font-medium">{row.original.takip_no}</span>,
      },
      {
        accessorKey: "gonderen_musteri",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Gönderici Müşteri" />,
      },
      {
        accessorKey: "gonderen_sube",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Gönderici Şube" />,
        cell: ({ row }) => <span className="text-muted-foreground">{row.original.gonderen_sube}</span>,
      },
      {
        accessorKey: "alici_sube",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Alıcı Şube" />,
        cell: ({ row }) => <span className="text-muted-foreground">{row.original.alici_sube}</span>,
      },
      {
        accessorKey: "alici_musteri",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Alıcı Müşteri" />,
      },
      {
        accessorKey: "alici_telefon",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Alıcı Telefon" />,
        cell: ({ row }) => <span className="tabular-nums">{row.original.alici_telefon}</span>,
      },
      {
        accessorKey: "odeme_turu",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Ödeme Türü" />,
        cell: ({ row }) => <span className="text-muted-foreground">{row.original.odeme_turu}</span>,
      },
      {
        accessorKey: "fatura_turu",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Fatura Durumu" />,
        cell: ({ row }) => <span className="text-muted-foreground">{row.original.fatura_turu}</span>,
      },
      {
        accessorKey: "matrah",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Matrah (Fiyat)" />,
        cell: ({ row }) => (
          <span className="tabular-nums">
            {new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(row.original.matrah)}
          </span>
        ),
      },
      {
        accessorKey: "kdv",
        header: ({ column }) => <DataTableColumnHeader column={column} title="KDV (%20)" />,
        cell: ({ row }) => (
          <span className="tabular-nums">
            {new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(row.original.kdv)}
          </span>
        ),
      },
      {
        accessorKey: "toplam",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Toplam" />,
        cell: ({ row }) => (
          <span className="font-medium tabular-nums">
            {new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(row.original.toplam)}
          </span>
        ),
      },
      {
        accessorKey: "t_adet",
        header: ({ column }) => <DataTableColumnHeader column={column} title="T. Adet" />,
        cell: ({ row }) => <span className="tabular-nums">{row.original.t_adet}</span>,
      },
      {
        accessorKey: "t_desi",
        header: ({ column }) => <DataTableColumnHeader column={column} title="T. Desi" />,
        cell: ({ row }) => <span className="tabular-nums">{row.original.t_desi}</span>,
      },
      {
        accessorKey: "parca_listesi",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Parça Listesi" />,
        cell: ({ row }) => <span className="text-muted-foreground">{row.original.parca_listesi}</span>,
      },
      {
        accessorKey: "irsaliye_no",
        header: ({ column }) => <DataTableColumnHeader column={column} title="İrsaliye No" />,
        cell: ({ row }) => <span className="font-mono text-sm">{row.original.irsaliye_no || "—"}</span>,
      },
      {
        accessorKey: "atf_no",
        header: ({ column }) => <DataTableColumnHeader column={column} title="ATF No" />,
        cell: ({ row }) => <span className="font-mono text-sm">{row.original.atf_no || "—"}</span>,
      },
      {
        accessorKey: "olusturulma_zamani",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Oluşturulma Zamanı" />,
        cell: ({ row }) => <span className="text-muted-foreground">{row.original.olusturulma_zamani}</span>,
      },
      {
        accessorKey: "varis_zamani",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Varış Zamanı" />,
        cell: ({ row }) => <span className="text-muted-foreground">{row.original.varis_zamani || "—"}</span>,
      },
      {
        accessorKey: "teslimat_zamani",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Teslimat Zamanı" />,
        cell: ({ row }) => <span className="text-muted-foreground">{row.original.teslimat_zamani || "—"}</span>,
      },
      {
        accessorKey: "kargo_durumu",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Kargo Durumu" />,
        cell: ({ row }) => {
          const status = kargoStatusConfig[row.original.kargo_durumu]
          const StatusIcon = status?.icon || Package
          return (
            <Badge variant="outline" className={status?.className}>
              <StatusIcon className="mr-1.5 size-3" />
              {status?.label || row.original.kargo_durumu}
            </Badge>
          )
        },
      },
      {
        accessorKey: "fatura_durumu",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Fatura Durumu" />,
        cell: ({ row }) => {
          const status = faturaStatusConfig[row.original.fatura_durumu]
          return (
            <Badge variant="outline" className={status?.className}>
              {status?.label || row.original.fatura_durumu}
            </Badge>
          )
        },
      },
      {
        accessorKey: "tahsilat_durumu",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Tahsilat Durumu" />,
        cell: ({ row }) => {
          const status = tahsilatStatusConfig[row.original.tahsilat_durumu]
          return (
            <Badge variant="outline" className={status?.className}>
              {status?.label || row.original.tahsilat_durumu}
            </Badge>
          )
        },
      },
      {
        accessorKey: "olusturan",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Oluşturan" />,
        cell: ({ row }) => <span className="text-muted-foreground">{row.original.olusturan}</span>,
      },
      {
        id: "actions",
        header: "İşlemler",
        enableSorting: false,
        enableHiding: false,
        cell: ({ row }) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="size-8">
                <MoreHorizontal className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>İşlemler</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href={`/arf/cargo/shipments/${row.original.id}`}>
                  <Eye className="mr-2 size-4" />
                  Detay Görüntüle
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-amber-700 focus:text-amber-700">
                <Ban className="mr-2 size-4" />
                İptal Et
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ],
    [],
  )

  const pageCount = Math.max(1, Math.ceil(totalRows / pagination.pageSize))

  return (
    <>
      <AppHeader
        breadcrumbs={[
          { label: "Ana Sayfa", href: "/" },
          { label: "Kargo İşlemleri", href: "/arf/cargo/shipments" },
        { label: "Kargo Listesi" },
        ]}
      />
      <div className="flex flex-1 flex-col gap-6 p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Kargo Listesi</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" asChild>
              <Link href="/arf/cargo/shipments/new">
                <Plus className="mr-2 size-4" />
                Yeni Kargo
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {summaryCards.map((card) => (
            <Card key={card.label} className="rounded-2xl border-slate-200/80 bg-white shadow-none">
              <CardContent className="p-4">
                <p className="text-xs font-medium tracking-wide text-slate-500">{card.label}</p>
                <p className="mt-3 text-2xl font-semibold tabular-nums text-slate-900">{card.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardContent className="space-y-4">
            {table && (
              <div className="flex items-center gap-2">
                {!showFacetedFilters && <DataTableExcelActions table={table} filename="kargo-listesi" exportSelected={false} />}

                <DataTableToolbar table={table} showColumnSelector={!showFacetedFilters}>
                  <Button
                    type="button"
                    variant={showFacetedFilters ? "default" : "outline"}
                    size="sm"
                    className="mr-3 h-8"
                    onClick={() => setShowFacetedFilters((previous) => !previous)}
                  >
                    <Filter className="mr-2 h-4 w-4" />
                    Filtreler
                  </Button>

                  {showFacetedFilters && (
                    <div className="flex flex-wrap items-center gap-2">
                      <Popover open={isDateRangePickerOpen} onOpenChange={setIsDateRangePickerOpen}>
                        <PopoverTrigger asChild>
                          <Button variant="outline" size="sm" className="h-8 border-dashed">
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Oluşturulma Tarihi
                            {createdAtRangeInput && (
                              <Badge variant="secondary" className="ml-2 rounded-sm px-1 font-normal">
                                {createdAtRangeInput}
                              </Badge>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <div className="space-y-3 p-3">
                            <div className="flex items-center rounded-md border border-input bg-background px-2">
                              <Input
                                value={createdAtRangeInput}
                                placeholder="GG.AA.YYYY - GG.AA.YYYY"
                                onChange={(event: ChangeEvent<HTMLInputElement>) =>
                                  handleCreatedAtRangeInputChange(event.target.value)
                                }
                                className="h-8 w-[260px] border-0 px-0 focus-visible:ring-0"
                              />
                              <CalendarIcon className="size-4 text-muted-foreground" />
                            </div>

                            <div className="border-t pt-3">
                              <Calendar
                                mode="range"
                                selected={selectedCreatedAtRange}
                                onSelect={handleCreatedAtRangeSelect}
                                numberOfMonths={2}
                                locale={tr}
                                showOutsideDays={false}
                                initialFocus
                              />
                            </div>

                            <div className="flex justify-end gap-2 border-t pt-3">
                              {(createdAtFrom || createdAtTo) && (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setCreatedAtRangeInput("")
                                    handleCreatedAtFilterChange("", "")
                                  }}
                                >
                                  Temizle
                                </Button>
                              )}
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => setIsDateRangePickerOpen(false)}
                              >
                                Kapat
                              </Button>
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>

                      <DataTableFacetedFilter
                        column={table.getColumn("odeme_turu")}
                        title="Ödeme Türü"
                        options={paymentTypeFilterOptions}
                      />
                      <DataTableFacetedFilter
                        column={table.getColumn("kargo_durumu")}
                        title="Kargo Durumu"
                        options={statusFilterOptions}
                      />
                      <DataTableFacetedFilter
                        column={table.getColumn("fatura_turu")}
                        title="Fatura Durumu"
                        options={invoiceTypeFilterOptions}
                      />
                      <DataTableFacetedFilter
                        column={table.getColumn("tahsilat_durumu")}
                        title="Tahsilat Durumu"
                        options={collectionStatusFilterOptions}
                      />
                    </div>
                  )}
                </DataTableToolbar>
              </div>
            )}

            <DataTable
              data={data}
              columns={columns}
              enablePagination
              pagination={pagination}
              onPaginationChange={handlePaginationChange}
              pageCount={pageCount}
              manualPagination
              enableSorting
              sorting={sorting}
              onSortingChange={handleSortingChange}
              manualSorting
              enableGlobalFilter
              columnFilters={columnFilters}
              onColumnFiltersChange={handleColumnFiltersChange}
              manualFiltering
              enableColumnVisibility
              enableHorizontalScroll
              stickyLastColumn
              isLoading={isLoading}
              className="[&_thead_tr]:bg-slate-50 [&_thead_th]:font-semibold [&_thead_th]:text-slate-600"
              emptyMessage="Gösterilecek kargo bulunamadı."
              onTableReady={handleTableReady}
            />

            {table && (
              <DataTablePagination table={table as TanStackTable<unknown>} pageSizeOptions={[5, 10, 20, 50]} totalRows={totalRows} />
            )}
          </CardContent>
        </Card>
      </div>
    </>
  )
}
