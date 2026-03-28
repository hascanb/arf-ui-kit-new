"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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

  return (
    <div className="space-y-6">
      <SupplierHeaderCard
        supplier={supplier}
        onEditClick={() => setEditOpen(true)}
        onSupplierChange={setSupplier}
      />

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList className="h-10 rounded-xl bg-white shadow-sm">
          <TabsTrigger value="profile" className="rounded-lg px-5 text-sm">
            Profil
          </TabsTrigger>
          {!isWarehouse && (
            <TabsTrigger value="fleet" className="rounded-lg px-5 text-sm">
              Filo
            </TabsTrigger>
          )}
          {!isWarehouse && (
            <TabsTrigger value="drivers" className="rounded-lg px-5 text-sm">
              Sürücüler
            </TabsTrigger>
          )}
          <TabsTrigger value="trips" className="rounded-lg px-5 text-sm">
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
