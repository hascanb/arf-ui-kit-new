"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Building2, Route, Truck, Users } from "lucide-react"
import { cn } from "@/lib/utils"
import { SupplierHeaderCard } from "./supplier-header-card"
import { SupplierProfileSection } from "./supplier-profile-section"
import { SupplierFleetSection } from "./supplier-fleet-section"
import { SupplierDriversSection } from "./supplier-drivers-section"
import { SupplierTripsSection } from "./supplier-trips-section"
import { SupplierEditModal } from "./supplier-edit-modal"
import type { SupplierDetail } from "../_types"

interface Props {
  initialSupplier: SupplierDetail
}

export function SupplierDetailContent({ initialSupplier }: Props) {
  const [supplier, setSupplier] = useState(initialSupplier)
  const [editOpen, setEditOpen] = useState(false)

  const isWarehouse = supplier.supplierType === "warehouse"
  const tabCount = isWarehouse ? 2 : 4

  return (
    <div className="space-y-6">
      <SupplierHeaderCard
        supplier={supplier}
        onEditClick={() => setEditOpen(true)}
        onSupplierChange={setSupplier}
      />

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList className={cn("grid h-10 w-full rounded-xl border border-slate-200 bg-slate-100 p-0.5", tabCount === 2 ? "grid-cols-2" : "grid-cols-4")}>
          <TabsTrigger value="profile" className="flex items-center gap-1.5 text-xs">
            <Building2 className="size-3.5" />
            Firma
          </TabsTrigger>
          {!isWarehouse && (
            <TabsTrigger value="fleet" className="flex items-center gap-1.5 text-xs">
              <Truck className="size-3.5" />
              Filo
            </TabsTrigger>
          )}
          {!isWarehouse && (
            <TabsTrigger value="drivers" className="flex items-center gap-1.5 text-xs">
              <Users className="size-3.5" />
              Sürücüler
            </TabsTrigger>
          )}
          <TabsTrigger value="trips" className="flex items-center gap-1.5 text-xs">
            <Route className="size-3.5" />
            Seferler
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <SupplierProfileSection
            supplier={supplier}
            onSupplierChange={setSupplier}
          />
        </TabsContent>

        {!isWarehouse && (
          <TabsContent value="fleet">
            <SupplierFleetSection supplier={supplier} onSupplierChange={setSupplier} />
          </TabsContent>
        )}

        {!isWarehouse && (
          <TabsContent value="drivers">
            <SupplierDriversSection supplier={supplier} onSupplierChange={setSupplier} />
          </TabsContent>
        )}

        <TabsContent value="trips">
          <SupplierTripsSection supplierId={supplier.id} />
        </TabsContent>
      </Tabs>

      <SupplierEditModal
        supplier={supplier}
        open={editOpen}
        onOpenChange={setEditOpen}
        onUpdated={(updated) => {
          setSupplier(updated)
          setEditOpen(false)
        }}
      />
    </div>
  )
}
