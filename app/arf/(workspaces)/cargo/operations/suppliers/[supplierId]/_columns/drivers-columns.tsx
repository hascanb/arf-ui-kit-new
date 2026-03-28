import type { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle } from "lucide-react"
import type { SupplierDriver, DriverStatus, LicenseClass } from "../_types"

const STATUS_BADGE: Record<DriverStatus, { label: string; className: string }> = {
  available: {
    label: "Müsait",
    className: "border-emerald-200 bg-emerald-50 text-emerald-700",
  },
  on_trip: {
    label: "Seferde",
    className: "border-blue-200 bg-blue-50 text-blue-700",
  },
  off_duty: {
    label: "Görev Dışı",
    className: "border-slate-200 bg-slate-50 text-slate-600",
  },
}

function isExpiringSoon(dateStr?: string): boolean {
  if (!dateStr) return false
  const date = new Date(dateStr)
  const thirtyDays = 30 * 24 * 60 * 60 * 1000
  return date.getTime() - Date.now() < thirtyDays && date > new Date()
}

export const driversColumns: ColumnDef<SupplierDriver>[] = [
  {
    accessorKey: "fullName",
    header: "Sürücü Adı",
    cell: ({ row }) => (
      <span className="font-medium text-slate-800">{row.original.fullName}</span>
    ),
  },
  {
    accessorKey: "phone",
    header: "Telefon",
    cell: ({ row }) => (
      <span className="text-sm text-slate-600">{row.original.phone}</span>
    ),
  },
  {
    accessorKey: "licenseClass",
    header: "Ehliyet",
    cell: ({ row }) => (
      <Badge variant="outline" className="border-slate-200 text-slate-600">
        Sınıf {row.original.licenseClass}
      </Badge>
    ),
  },
  {
    id: "licenseExpiry",
    header: "Ehliyet Bitiş",
    cell: ({ row }) => {
      const soon = isExpiringSoon(row.original.licenseExpiry)
      return (
        <span className={`text-sm ${soon ? "font-semibold text-amber-700" : "text-slate-600"}`}>
          {new Date(row.original.licenseExpiry).toLocaleDateString("tr-TR")}
          {soon && <AlertTriangle className="ml-1 inline size-3.5 text-amber-600" />}
        </span>
      )
    },
  },
  {
    id: "src",
    header: "SRC Belgesi",
    cell: ({ row }) => {
      if (!row.original.hasSrcCertificate) {
        return (
          <Badge variant="outline" className="border-rose-200 bg-rose-50 text-rose-600">
            Yok
          </Badge>
        )
      }
      const soon = isExpiringSoon(row.original.srcExpiryDate)
      return (
        <div className="flex items-center gap-1">
          <Badge
            variant="outline"
            className={soon ? "border-amber-200 bg-amber-50 text-amber-700" : "border-emerald-200 bg-emerald-50 text-emerald-700"}
          >
            {soon ? "Yakın Bitiş" : "Var"}
          </Badge>
          {row.original.srcExpiryDate && (
            <span className="text-xs text-slate-500">
              {new Date(row.original.srcExpiryDate).toLocaleDateString("tr-TR")}
            </span>
          )}
        </div>
      )
    },
  },
  {
    accessorKey: "status",
    header: "Durum",
    cell: ({ row }) => {
      const badge = STATUS_BADGE[row.original.status]
      return (
        <Badge variant="outline" className={badge.className}>
          {badge.label}
        </Badge>
      )
    },
  },
  {
    accessorKey: "totalTrips",
    header: "Toplam Sefer",
    cell: ({ row }) => (
      <span className="text-sm text-slate-700">{row.original.totalTrips}</span>
    ),
  },
  {
    id: "activeVehicle",
    header: "Aktif Araç",
    cell: ({ row }) => (
      <span className="font-mono text-sm text-slate-600">
        {row.original.activeVehiclePlate ?? <span className="font-sans text-slate-400">—</span>}
      </span>
    ),
  },
]
