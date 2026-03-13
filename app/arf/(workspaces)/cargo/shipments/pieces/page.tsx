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
  CalendarIcon,
  CheckCircle2,
  Eye,
  Filter,
  MoreHorizontal,
  Package,
  PlusCircle,
  Truck,
  X,
} from "lucide-react"

type PieceStatus = "beklemede" | "transfer" | "dagitimda" | "teslim_edildi"
type PieceType = "koli" | "palet" | "cuval"

type PieceRow = {
  id: string
  parca_no: string
  takip_no: string
  kargo_id: string
  odeme_turu: "Gönderici Ödemeli" | "Alıcı Ödemeli"
  kargo_durumu: PieceStatus
  parca_tipi: PieceType
  desi: number
  agirlik: number
  toplam_fiyat: number
  olusturulma_zamani: string
  guncellenme_zamani: string
  varis_zamani: string
  teslimat_zamani: string
  teslim_alan_adi: string
  teslim_alan_telefonu: string
  teslimat_resmi_var: boolean
  teslimat_resmi_url: string
}

type PieceSeed = {
  kargoId: string
  takipNo: string
  odemeTuru: PieceRow["odeme_turu"]
  kargoDurumu: PieceStatus
  createdAt: string
  updatedAt: string
  arrivalAt: string
  deliveredAt: string
  recipientName: string
  recipientPhone: string
  hasProofPhoto: boolean
  specs: Array<{ type: PieceType; count: number; desi: number; agirlik: number; fiyat: number }>
}

const toDateTimeString = (value: Date) => {
  const year = value.getFullYear()
  const month = String(value.getMonth() + 1).padStart(2, "0")
  const day = String(value.getDate()).padStart(2, "0")
  const hours = String(value.getHours()).padStart(2, "0")
  const minutes = String(value.getMinutes()).padStart(2, "0")
  return `${year}-${month}-${day} ${hours}:${minutes}`
}

const addMinutes = (base: string, minutes: number) => {
  const date = new Date(base)
  date.setMinutes(date.getMinutes() + minutes)
  return toDateTimeString(date)
}

const createPiecesFromSeed = (seed: PieceSeed): PieceRow[] => {
  let index = 1

  return seed.specs.flatMap((spec) =>
    Array.from({ length: spec.count }, () => {
      const suffix = String(index).padStart(2, "0")
      const pieceNo = `${seed.takipNo}${suffix}`
      const currentIndex = index
      index += 1

      const delivered = seed.kargoDurumu === "teslim_edildi"

      return {
        id: `${seed.kargoId}-${suffix}`,
        parca_no: pieceNo,
        takip_no: seed.takipNo,
        kargo_id: seed.kargoId,
        odeme_turu: seed.odemeTuru,
        kargo_durumu: seed.kargoDurumu,
        parca_tipi: spec.type,
        desi: spec.desi,
        agirlik: spec.agirlik,
        toplam_fiyat: spec.fiyat,
        olusturulma_zamani: addMinutes(seed.createdAt, currentIndex * 2),
        guncellenme_zamani: addMinutes(seed.updatedAt, currentIndex),
        varis_zamani: seed.arrivalAt,
        teslimat_zamani: delivered ? addMinutes(seed.deliveredAt, currentIndex) : "",
        teslim_alan_adi: delivered ? seed.recipientName : "—",
        teslim_alan_telefonu: delivered ? seed.recipientPhone : "—",
        teslimat_resmi_var: delivered ? seed.hasProofPhoto : false,
        teslimat_resmi_url:
          delivered && seed.hasProofPhoto
            ? `/mock/piece-proof-${((currentIndex - 1) % 2) + 1}.svg`
            : "",
      }
    }),
  )
}

const pieceSeeds: PieceSeed[] = [
  {
    kargoId: "1",
    takipNo: "1001",
    odemeTuru: "Gönderici Ödemeli",
    kargoDurumu: "teslim_edildi",
    createdAt: "2026-03-10 09:00",
    updatedAt: "2026-03-11 12:30",
    arrivalAt: "2026-03-11 09:45",
    deliveredAt: "2026-03-11 15:10",
    recipientName: "Mehmet Demir",
    recipientPhone: "0532 111 22 33",
    hasProofPhoto: true,
    specs: [
      { type: "koli", count: 5, desi: 4, agirlik: 3.2, fiyat: 78.9 },
      { type: "palet", count: 1, desi: 18, agirlik: 22.5, fiyat: 196.4 },
    ],
  },
  {
    kargoId: "2",
    takipNo: "1002",
    odemeTuru: "Alıcı Ödemeli",
    kargoDurumu: "dagitimda",
    createdAt: "2026-03-09 13:20",
    updatedAt: "2026-03-10 09:10",
    arrivalAt: "2026-03-10 08:20",
    deliveredAt: "2026-03-10 17:00",
    recipientName: "Ayşe Korkmaz",
    recipientPhone: "0542 222 33 44",
    hasProofPhoto: false,
    specs: [
      { type: "koli", count: 3, desi: 5, agirlik: 4.1, fiyat: 64.75 },
      { type: "palet", count: 2, desi: 14, agirlik: 19.2, fiyat: 158.2 },
    ],
  },
  {
    kargoId: "3",
    takipNo: "1003",
    odemeTuru: "Gönderici Ödemeli",
    kargoDurumu: "transfer",
    createdAt: "2026-03-08 10:45",
    updatedAt: "2026-03-09 14:25",
    arrivalAt: "",
    deliveredAt: "",
    recipientName: "Burak Yıldız",
    recipientPhone: "0555 333 44 55",
    hasProofPhoto: false,
    specs: [
      { type: "koli", count: 4, desi: 6, agirlik: 4.8, fiyat: 71.4 },
      { type: "cuval", count: 1, desi: 9, agirlik: 8.2, fiyat: 84.6 },
    ],
  },
  {
    kargoId: "4",
    takipNo: "1004",
    odemeTuru: "Alıcı Ödemeli",
    kargoDurumu: "beklemede",
    createdAt: "2026-03-07 08:35",
    updatedAt: "2026-03-07 09:20",
    arrivalAt: "",
    deliveredAt: "",
    recipientName: "Selin Aydın",
    recipientPhone: "0501 444 55 66",
    hasProofPhoto: false,
    specs: [
      { type: "palet", count: 2, desi: 16, agirlik: 20.3, fiyat: 175.9 },
      { type: "koli", count: 2, desi: 3, agirlik: 2.6, fiyat: 52.0 },
    ],
  },
]

const allPieces = pieceSeeds.flatMap(createPiecesFromSeed)

const kargoStatusConfig: Record<PieceStatus, { label: string; className: string }> = {
  beklemede: { label: "Beklemede", className: "bg-amber-500/10 text-amber-600 border-amber-500/20" },
  transfer: { label: "Transfer", className: "bg-purple-500/10 text-purple-600 border-purple-500/20" },
  dagitimda: { label: "Dağıtımda", className: "bg-sky-500/10 text-sky-600 border-sky-500/20" },
  teslim_edildi: { label: "Teslim Edildi", className: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" },
}

const pieceTypeConfig: Record<PieceType, { label: string; className: string }> = {
  koli: { label: "Koli", className: "bg-slate-500/10 text-slate-700 border-slate-400/30" },
  palet: { label: "Palet", className: "bg-indigo-500/10 text-indigo-700 border-indigo-500/20" },
  cuval: { label: "Çuval", className: "bg-orange-500/10 text-orange-700 border-orange-500/20" },
}

const odemeFilterOptions = [
  { label: "Gönderici Ödemeli", value: "Gönderici Ödemeli" },
  { label: "Alıcı Ödemeli", value: "Alıcı Ödemeli" },
]

const statusFilterOptions = [
  { label: "Beklemede", value: "beklemede" },
  { label: "Transfer", value: "transfer" },
  { label: "Dağıtımda", value: "dagitimda" },
  { label: "Teslim Edildi", value: "teslim_edildi" },
]

const pieceTypeFilterOptions = [
  { label: "Koli", value: "koli" },
  { label: "Palet", value: "palet" },
  { label: "Çuval", value: "cuval" },
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

const queryPieces = ({
  pagination,
  sorting,
  columnFilters,
}: {
  pagination: PaginationState
  sorting: SortingState
  columnFilters: ColumnFiltersState
}) => {
  let filtered = [...allPieces]

  for (const filter of columnFilters) {
    if (filter.id === "odeme_turu") {
      const selected = Array.isArray(filter.value) ? (filter.value as string[]) : []
      if (selected.length > 0) {
        filtered = filtered.filter((row) => selected.includes(row.odeme_turu))
      }
      continue
    }

    if (filter.id === "kargo_durumu") {
      const selected = Array.isArray(filter.value) ? (filter.value as string[]) : []
      if (selected.length > 0) {
        filtered = filtered.filter((row) => selected.includes(row.kargo_durumu))
      }
      continue
    }

    if (filter.id === "parca_tipi") {
      const selected = Array.isArray(filter.value) ? (filter.value as string[]) : []
      if (selected.length > 0) {
        filtered = filtered.filter((row) => selected.includes(row.parca_tipi))
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
      continue
    }
  }

  if (sorting.length > 0) {
    const [{ id, desc }] = sorting
    filtered.sort((a, b) => {
      const left = a[id as keyof PieceRow]
      const right = b[id as keyof PieceRow]

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

export default function ParcaListesiPage() {
  const [table, setTable] = useState<TanStackTable<PieceRow> | null>(null)
  const [showFacetedFilters, setShowFacetedFilters] = useState(false)
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 })
  const [sorting, setSorting] = useState<SortingState>([{ id: "olusturulma_zamani", desc: true }])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [data, setData] = useState<PieceRow[]>([])
  const [totalRows, setTotalRows] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  const [createdAtFrom, setCreatedAtFrom] = useState("")
  const [createdAtTo, setCreatedAtTo] = useState("")
  const [createdAtRangeInput, setCreatedAtRangeInput] = useState("")
  const [isDateRangePickerOpen, setIsDateRangePickerOpen] = useState(false)
  const [deliveryInfoModalPiece, setDeliveryInfoModalPiece] = useState<PieceRow | null>(null)

  useEffect(() => {
    let cancelled = false
    setIsLoading(true)

    const timer = window.setTimeout(() => {
      const result = queryPieces({ pagination, sorting, columnFilters })

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
    const totalPieceCount = allPieces.length
    const totalPrice = allPieces.reduce((sum, row) => sum + row.toplam_fiyat, 0)
    const deliveredCount = allPieces.filter((row) => row.kargo_durumu === "teslim_edildi").length

    return [
      {
        label: "Toplam Parça",
        value: new Intl.NumberFormat("tr-TR").format(totalPieceCount),
      },
      {
        label: "Toplam Fiyat",
        value: new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(totalPrice),
      },
      {
        label: "Teslim Edilen Parça",
        value: new Intl.NumberFormat("tr-TR").format(deliveredCount),
      },
    ]
  }, [])

  const handleTableReady = useCallback((nextTable: TanStackTable<PieceRow>) => {
    setTable(nextTable)
  }, [])

  const hasDeliveryInfo = useCallback((piece: PieceRow) => {
    return [piece.teslimat_zamani, piece.teslim_alan_adi, piece.teslim_alan_telefonu, piece.teslimat_resmi_url]
      .some((value) => Boolean(value && value !== "—"))
  }, [])

  const getDeliveryNameParts = useCallback((fullName: string) => {
    if (!fullName || fullName === "—") {
      return { firstName: "-", lastName: "-" }
    }

    const pieces = fullName.trim().split(/\s+/)
    const firstName = pieces.shift() || "-"
    const lastName = pieces.join(" ") || "-"

    return { firstName, lastName }
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
      return fromDate <= toDate
        ? { from: fromDate, to: toDate }
        : { from: toDate, to: fromDate }
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

  const columns = useMemo<ColumnDef<PieceRow>[]>(
    () => [
      {
        accessorKey: "parca_no",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Parça No" />,
        cell: ({ row }) => <span className="font-mono text-sm font-semibold">{row.original.parca_no}</span>,
      },
      {
        accessorKey: "takip_no",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Takip No" />,
        cell: ({ row }) => <span className="font-mono text-sm">{row.original.takip_no}</span>,
      },
      {
        accessorKey: "odeme_turu",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Ödeme Türü" />,
        cell: ({ row }) => <span className="text-muted-foreground">{row.original.odeme_turu}</span>,
      },
      {
        accessorKey: "kargo_durumu",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Kargo Durumu" />,
        cell: ({ row }) => {
          const status = kargoStatusConfig[row.original.kargo_durumu]
          const statusIcon = row.original.kargo_durumu === "teslim_edildi" ? CheckCircle2 : Truck
          const StatusIcon = statusIcon || Package
          return (
            <Badge variant="outline" className={status.className}>
              <StatusIcon className="mr-1.5 size-3" />
              {status.label}
            </Badge>
          )
        },
      },
      {
        accessorKey: "parca_tipi",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Parça Tipi" />,
        cell: ({ row }) => {
          const pieceType = pieceTypeConfig[row.original.parca_tipi]
          return (
            <Badge variant="outline" className={pieceType.className}>
              {pieceType.label}
            </Badge>
          )
        },
      },
      {
        accessorKey: "desi",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Desi" />,
        cell: ({ row }) => <span className="tabular-nums">{row.original.desi}</span>,
      },
      {
        accessorKey: "agirlik",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Ağırlık" />,
        cell: ({ row }) => <span className="tabular-nums">{row.original.agirlik.toFixed(1)} kg</span>,
      },
      {
        accessorKey: "toplam_fiyat",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Toplam Fiyat" />,
        cell: ({ row }) => (
          <span className="font-medium tabular-nums">
            {new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(row.original.toplam_fiyat)}
          </span>
        ),
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
        cell: ({ row }) => <span className="text-muted-foreground">{row.original.varis_zamani || "—"}</span>,
      },
      {
        accessorKey: "teslimat_zamani",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Teslimat Zamanı" />,
        cell: ({ row }) => <span className="text-muted-foreground">{row.original.teslimat_zamani || "—"}</span>,
      },
      {
        id: "teslimat_bilgi",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Teslimat Bilgi" />,
        enableSorting: false,
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
              title="Teslimat bilgisini görüntüle"
              onClick={() => setDeliveryInfoModalPiece(row.original)}
            >
              <Eye className="size-4" />
            </Button>
          )
        },
      },
      {
        id: "actions",
        header: "İşlem",
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
                <Link href={`/arf/cargo/shipments/${row.original.kargo_id}`}>
                  <Eye className="mr-2 size-4" />
                  Kargo Detay
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/arf/cargo/shipments/pieces/${row.original.id}`}>
                  <Package className="mr-2 size-4" />
                  Parça Detay
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ],
    [hasDeliveryInfo],
  )

  const pageCount = Math.max(1, Math.ceil(totalRows / pagination.pageSize))

  return (
    <>
      <AppHeader
        breadcrumbs={[
          { label: "Ana Sayfa", href: "/" },
          { label: "Kargo İşlemleri", href: "/arf/cargo/shipments" },
          { label: "Parça Listesi" },
        ]}
      />

      <div className="flex flex-1 flex-col gap-6 p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-semibold tracking-tight">Parça Listesi</h1>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
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
                {!showFacetedFilters && (
                  <DataTableExcelActions table={table} filename="parca-listesi" exportSelected={false} />
                )}

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
                        options={odemeFilterOptions}
                      />
                      <DataTableFacetedFilter
                        column={table.getColumn("kargo_durumu")}
                        title="Kargo Durumu"
                        options={statusFilterOptions}
                      />
                      <DataTableFacetedFilter
                        column={table.getColumn("parca_tipi")}
                        title="Parça Tipi"
                        options={pieceTypeFilterOptions}
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
              emptyMessage="Gösterilecek parça bulunamadı."
              onTableReady={handleTableReady}
            />

            {table && (
              <DataTablePagination
                table={table as TanStackTable<unknown>}
                pageSizeOptions={[10, 20, 50]}
                totalRows={totalRows}
              />
            )}
          </CardContent>
        </Card>
      </div>

      {deliveryInfoModalPiece && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-[2px]">
          <div className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <h2 className="text-lg font-semibold text-slate-900">Teslimat Bilgisi - Parça {deliveryInfoModalPiece.parca_no}</h2>
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
                  <Input value={getDeliveryNameParts(deliveryInfoModalPiece.teslim_alan_adi).firstName} readOnly className="h-9" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-slate-500">Soyad</p>
                  <Input value={getDeliveryNameParts(deliveryInfoModalPiece.teslim_alan_adi).lastName} readOnly className="h-9" />
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
                      alt={`${deliveryInfoModalPiece.parca_no} teslimat resmi`}
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
    </>
  )
}
