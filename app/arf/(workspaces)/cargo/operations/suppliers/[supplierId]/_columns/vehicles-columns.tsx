import type { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Wrench } from "lucide-react"
import type { SupplierVehicle, VehicleStatus, VehicleType } from "../_types"

const VEHICLE_TYPE_LABELS: Record<VehicleType, string> = {
  tir: "TIR",
  kamyon: "Kamyon",
  van: "Van",
  pickup: "Pickup",
}

const STATUS_BADGE: Record<VehicleStatus, { label: string; className: string }> = {
  idle: {
    label: "Müsait",
    className: "border-emerald-200 bg-emerald-50 text-emerald-700",
  },
  on_road: {
    label: "Yolda",
    className: "border-blue-200 bg-blue-50 text-blue-700",
  },
  maintenance: {
    label: "Bakımda",
    className: "border-amber-200 bg-amber-50 text-amber-700",
  },
}

export const vehiclesColumns: ColumnDef<SupplierVehicle>[] = [
  {
    accessorKey: "plate",
    header: "Plaka",
    cell: ({ row }) => (
      <span className="font-mono text-sm font-semibold">{row.original.plate}</span>
    ),
  },
  {
    id: "brandModel",
    header: "Araç",
    cell: ({ row }) => (
      <span className="text-sm">
        {row.original.brand} {row.original.model} ({row.original.year})
      </span>
    ),
  },
  {
    accessorKey: "vehicleType",
    header: "Tip",
    cell: ({ row }) => (
      <Badge variant="outline" className="border-slate-200 text-slate-600">
        {VEHICLE_TYPE_LABELS[row.original.vehicleType]}
      </Badge>
    ),
  },
  {
    accessorKey: "capacity",
    header: "Kapasite",
    cell: ({ row }) => (
      <span className="text-sm text-slate-700">{row.original.capacity} ton</span>
    ),
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
    id: "driver",
    header: "Sürücü",
    cell: ({ row }) => (
      <span className="text-sm text-slate-600">
        {row.original.currentDriverName ?? <span className="text-slate-400">—</span>}
      </span>
    ),
  },
  {
    id: "inspection",
    header: "Muayene",
    cell: ({ row }) => {
      const date = row.original.nextInspectionDate
      return date ? (
        <span className="text-sm text-slate-600">
          {new Date(date).toLocaleDateString("tr-TR")}
        </span>
      ) : (
        <span className="text-slate-400">—</span>
      )
    },
  },
  {
    id: "alerts",
    header: "",
    cell: ({ row }) => {
      if (row.original.isInsuranceExpiringSoon) {
        return (
          <div className="flex items-center gap-1 text-amber-600">
            <AlertTriangle className="size-3.5" />
            <span className="text-xs">Sigorta bitiyor</span>
          </div>
        )
      }
      if (row.original.status === "maintenance") {
        return (
          <div className="flex items-center gap-1 text-amber-600">
            <Wrench className="size-3.5" />
            <span className="text-xs">Bakımda</span>
          </div>
        )
      }
      return null
    },
  },
]
