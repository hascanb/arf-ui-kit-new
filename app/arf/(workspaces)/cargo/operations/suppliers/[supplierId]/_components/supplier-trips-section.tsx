"use client"

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
import { Route } from "lucide-react"
import Link from "next/link"
import { ARF_ROUTES } from "../../../../../../_shared/routes"

interface MockTrip {
  id: string
  tripNo: string
  lineSummary: string
  status: "created" | "on_road" | "completed" | "cancelled"
  vehiclePlate?: string
  driverName?: string
  createdAt: string
}

const STATUS_BADGE: Record<string, { label: string; className: string }> = {
  created: { label: "Bekliyor", className: "border-slate-200 bg-slate-50 text-slate-600" },
  on_road: { label: "Yolda", className: "border-blue-200 bg-blue-50 text-blue-700" },
  completed: { label: "Tamamlandı", className: "border-emerald-200 bg-emerald-50 text-emerald-700" },
  cancelled: { label: "İptal", className: "border-rose-200 bg-rose-50 text-rose-600" },
}

const MOCK_SUPPLIER_TRIPS: Record<string, MockTrip[]> = {
  "1": [
    {
      id: "trip-10000164",
      tripNo: "10000164",
      lineSummary: "Silopi → Cizre → Nusaybin → Mardin → Diyarbakır T.M.",
      status: "on_road",
      vehiclePlate: "34 ABC 001",
      driverName: "Mehmet Demir",
      createdAt: "2024-01-15T08:00:00Z",
    },
    {
      id: "trip-10000160",
      tripNo: "10000160",
      lineSummary: "İstanbul → Ankara",
      status: "completed",
      vehiclePlate: "34 DEF 002",
      driverName: "Ali Kaya",
      createdAt: "2024-01-10T10:00:00Z",
    },
  ],
  "2": [
    {
      id: "trip-10000165",
      tripNo: "10000165",
      lineSummary: "Van T.M. → Erciş → Patnos → Ağrı",
      status: "created",
      vehiclePlate: "06 XYZ 100",
      driverName: "Hasan Çelik",
      createdAt: "2024-02-01T09:00:00Z",
    },
  ],
}

interface Props {
  supplierId: string
}

export function SupplierTripsSection({ supplierId }: Props) {
  const trips = MOCK_SUPPLIER_TRIPS[supplierId] ?? []

  return (
    <Card className="rounded-2xl border-slate-200">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm font-semibold text-slate-700">
          <Route className="size-4 text-slate-400" />
          Sefer Geçmişi ({trips.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {trips.length === 0 ? (
          <p className="py-8 text-center text-sm text-slate-400">
            Bu tedarikçiye ait sefer kaydı bulunamadı.
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-slate-100 bg-slate-50/50">
                <TableHead className="text-xs font-semibold text-slate-500">Sefer No</TableHead>
                <TableHead className="text-xs font-semibold text-slate-500">Hat</TableHead>
                <TableHead className="text-xs font-semibold text-slate-500">Araç - Sürücü</TableHead>
                <TableHead className="text-xs font-semibold text-slate-500">Durum</TableHead>
                <TableHead className="text-xs font-semibold text-slate-500">Tarih</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {trips.map((trip) => {
                const badge = STATUS_BADGE[trip.status]
                return (
                  <TableRow key={trip.id} className="border-slate-100">
                    <TableCell>
                      <Link
                        href={`${ARF_ROUTES.cargo.operations.trips}/${trip.id}`}
                        className="text-sm font-semibold text-primary hover:underline"
                      >
                        #{trip.tripNo}
                      </Link>
                    </TableCell>
                    <TableCell className="text-sm text-slate-700">
                      {trip.lineSummary}
                    </TableCell>
                    <TableCell className="text-sm text-slate-600">
                      {trip.vehiclePlate && trip.driverName
                        ? `${trip.vehiclePlate} - ${trip.driverName}`
                        : <span className="text-slate-400">—</span>}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={badge.className}>
                        {badge.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-slate-600">
                      {new Date(trip.createdAt).toLocaleDateString("tr-TR")}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
