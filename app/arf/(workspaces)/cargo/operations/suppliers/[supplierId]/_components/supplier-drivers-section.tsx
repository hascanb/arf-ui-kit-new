"use client"

import { useState } from "react"
import { Plus, Users } from "lucide-react"
import { AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { AddDriverModal } from "./add-driver-modal"
import type { SupplierDetail, SupplierDriver, DriverStatus } from "../_types"

const STATUS_BADGE: Record<DriverStatus, { label: string; className: string }> = {
  available: { label: "Müsait", className: "border-emerald-200 bg-emerald-50 text-emerald-700" },
  on_trip: { label: "Seferde", className: "border-blue-200 bg-blue-50 text-blue-700" },
  off_duty: { label: "Görev Dışı", className: "border-slate-200 bg-slate-50 text-slate-600" },
}

function isExpiringSoon(dateStr?: string): boolean {
  if (!dateStr) return false
  const date = new Date(dateStr)
  const thirtyDays = 30 * 24 * 60 * 60 * 1000
  return date.getTime() - Date.now() < thirtyDays && date > new Date()
}

interface Props {
  supplier: SupplierDetail
  onSupplierChange: (updated: SupplierDetail) => void
}

export function SupplierDriversSection({ supplier, onSupplierChange }: Props) {
  const [addOpen, setAddOpen] = useState(false)

  function handleDriverAdded(driver: SupplierDriver) {
    onSupplierChange({
      ...supplier,
      drivers: [...supplier.drivers, driver],
      driverCount: supplier.driverCount + 1,
    })
    setAddOpen(false)
  }

  return (
    <Card className="rounded-2xl border-slate-200">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="flex items-center gap-2 text-sm font-semibold text-slate-700">
          <Users className="size-4 text-slate-400" />
          Sürücü Listesi ({supplier.drivers.length})
        </CardTitle>
        <Button
          variant="outline"
          size="sm"
          className="h-8 rounded-lg text-xs"
          onClick={() => setAddOpen(true)}
        >
          <Plus className="mr-1 size-3.5" />
          Sürücü Ekle
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        {supplier.drivers.length === 0 ? (
          <p className="py-8 text-center text-sm text-slate-400">Henüz sürücü eklenmemiş.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-slate-100 bg-slate-50/50">
                <TableHead className="text-xs font-semibold text-slate-500">Sürücü Adı</TableHead>
                <TableHead className="text-xs font-semibold text-slate-500">Telefon</TableHead>
                <TableHead className="text-xs font-semibold text-slate-500">Ehliyet</TableHead>
                <TableHead className="text-xs font-semibold text-slate-500">Ehliyet Bitiş</TableHead>
                <TableHead className="text-xs font-semibold text-slate-500">SRC</TableHead>
                <TableHead className="text-xs font-semibold text-slate-500">Durum</TableHead>
                <TableHead className="text-xs font-semibold text-slate-500">Toplam Sefer</TableHead>
                <TableHead className="text-xs font-semibold text-slate-500">Aktif Araç</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {supplier.drivers.map((driver) => {
                const badge = STATUS_BADGE[driver.status]
                const licenseExpiringSoon = isExpiringSoon(driver.licenseExpiry)
                const srcExpiringSoon = isExpiringSoon(driver.srcExpiryDate)

                return (
                  <TableRow key={driver.id} className="border-slate-100">
                    <TableCell className="font-medium text-slate-800">
                      {driver.fullName}
                    </TableCell>
                    <TableCell className="text-sm text-slate-600">{driver.phone}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="border-slate-200 text-slate-600">
                        Sınıf {driver.licenseClass}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`text-sm ${licenseExpiringSoon ? "font-semibold text-amber-700" : "text-slate-600"}`}
                      >
                        {new Date(driver.licenseExpiry).toLocaleDateString("tr-TR")}
                        {licenseExpiringSoon && (
                          <AlertTriangle className="ml-1 inline size-3.5 text-amber-600" />
                        )}
                      </span>
                    </TableCell>
                    <TableCell>
                      {!driver.hasSrcCertificate ? (
                        <Badge
                          variant="outline"
                          className="border-rose-200 bg-rose-50 text-rose-600"
                        >
                          Yok
                        </Badge>
                      ) : (
                        <div className="flex items-center gap-1">
                          <Badge
                            variant="outline"
                            className={
                              srcExpiringSoon
                                ? "border-amber-200 bg-amber-50 text-amber-700"
                                : "border-emerald-200 bg-emerald-50 text-emerald-700"
                            }
                          >
                            {srcExpiringSoon ? "Yakın Bitiş" : "Var"}
                          </Badge>
                          {driver.srcExpiryDate && (
                            <span className="text-xs text-slate-500">
                              {new Date(driver.srcExpiryDate).toLocaleDateString("tr-TR")}
                            </span>
                          )}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={badge.className}>
                        {badge.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-slate-700">
                      {driver.totalTrips}
                    </TableCell>
                    <TableCell className="font-mono text-sm text-slate-600">
                      {driver.activeVehiclePlate ?? (
                        <span className="font-sans text-slate-400">—</span>
                      )}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>

      <AddDriverModal
        supplierId={supplier.id}
        open={addOpen}
        onOpenChange={setAddOpen}
        onAdded={handleDriverAdded}
      />
    </Card>
  )
}
