"use client"

import { useState } from "react"
import { Plus, Truck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Wrench } from "lucide-react"
import { AddVehicleModal } from "./add-vehicle-modal"
import type { SupplierDetail, SupplierVehicle, VehicleStatus, VehicleType } from "../_types"

const VEHICLE_TYPE_LABELS: Record<VehicleType, string> = {
  tir: "TIR",
  kamyon: "Kamyon",
  van: "Van",
  pickup: "Pickup",
}

const STATUS_BADGE: Record<VehicleStatus, { label: string; className: string }> = {
  idle: { label: "Müsait", className: "border-emerald-200 bg-emerald-50 text-emerald-700" },
  on_road: { label: "Yolda", className: "border-blue-200 bg-blue-50 text-blue-700" },
  maintenance: { label: "Bakımda", className: "border-amber-200 bg-amber-50 text-amber-700" },
}

interface Props {
  supplier: SupplierDetail
  onSupplierChange: (updated: SupplierDetail) => void
}

export function SupplierFleetSection({ supplier, onSupplierChange }: Props) {
  const [addOpen, setAddOpen] = useState(false)

  function handleVehicleAdded(vehicle: SupplierVehicle) {
    onSupplierChange({
      ...supplier,
      vehicles: [...supplier.vehicles, vehicle],
      vehicleCount: supplier.vehicleCount + 1,
    })
    setAddOpen(false)
  }

  return (
    <Card className="rounded-2xl border-slate-200">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="flex items-center gap-2 text-sm font-semibold text-slate-700">
          <Truck className="size-4 text-slate-400" />
          Araç Listesi ({supplier.vehicles.length})
        </CardTitle>
        <Button
          variant="outline"
          size="sm"
          className="h-8 rounded-lg text-xs"
          onClick={() => setAddOpen(true)}
        >
          <Plus className="mr-1 size-3.5" />
          Araç Ekle
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        {supplier.vehicles.length === 0 ? (
          <p className="py-8 text-center text-sm text-slate-400">Henüz araç eklenmemiş.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-slate-100 bg-slate-50/50">
                <TableHead className="text-xs font-semibold text-slate-500">Plaka</TableHead>
                <TableHead className="text-xs font-semibold text-slate-500">Araç</TableHead>
                <TableHead className="text-xs font-semibold text-slate-500">Tip</TableHead>
                <TableHead className="text-xs font-semibold text-slate-500">Kapasite</TableHead>
                <TableHead className="text-xs font-semibold text-slate-500">Durum</TableHead>
                <TableHead className="text-xs font-semibold text-slate-500">Sürücü</TableHead>
                <TableHead className="text-xs font-semibold text-slate-500">Muayene</TableHead>
                <TableHead className="text-xs font-semibold text-slate-500"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {supplier.vehicles.map((vehicle) => {
                const badge = STATUS_BADGE[vehicle.status]
                return (
                  <TableRow key={vehicle.id} className="border-slate-100">
                    <TableCell className="font-mono text-sm font-semibold">
                      {vehicle.plate}
                    </TableCell>
                    <TableCell className="text-sm">
                      {vehicle.brand} {vehicle.model} ({vehicle.year})
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="border-slate-200 text-slate-600">
                        {VEHICLE_TYPE_LABELS[vehicle.vehicleType]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-slate-700">
                      {vehicle.capacity} ton
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={badge.className}>
                        {badge.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-slate-600">
                      {vehicle.currentDriverName ?? <span className="text-slate-400">—</span>}
                    </TableCell>
                    <TableCell className="text-sm text-slate-600">
                      {vehicle.nextInspectionDate
                        ? new Date(vehicle.nextInspectionDate).toLocaleDateString("tr-TR")
                        : <span className="text-slate-400">—</span>}
                    </TableCell>
                    <TableCell>
                      {vehicle.isInsuranceExpiringSoon && (
                        <div className="flex items-center gap-1 text-amber-600">
                          <AlertTriangle className="size-3.5" />
                          <span className="text-xs">Sigorta</span>
                        </div>
                      )}
                      {vehicle.status === "maintenance" && (
                        <div className="flex items-center gap-1 text-amber-600">
                          <Wrench className="size-3.5" />
                          <span className="text-xs">Bakımda</span>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>

      <AddVehicleModal
        supplierId={supplier.id}
        open={addOpen}
        onOpenChange={setAddOpen}
        onAdded={handleVehicleAdded}
      />
    </Card>
  )
}
