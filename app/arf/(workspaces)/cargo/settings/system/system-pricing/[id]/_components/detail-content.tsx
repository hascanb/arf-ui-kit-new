"use client"

import { useState } from "react"
import { AppHeader } from "@hascanb/arf-ui-kit/layout-kit"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  setPricingDefinitionStatus,
  updatePricingDefinition,
  type UpsertPriceDefinitionInput,
} from "../../_api/price-definitions-api"
import type { PriceDefinitionDetail } from "../../_types"
import { CreatePriceDefinitionModal } from "../../_components/create-price-definition-modal"
import { DetailHeaderCard } from "./detail-header-card"
import { DetailOverviewSection } from "./detail-overview-section"
import { DetailRulesSection } from "./detail-rules-section"
import { DetailSurchargesSection } from "./detail-surcharges-section"

interface Props {
  initialDetail: PriceDefinitionDetail
}

export function DetailContent({ initialDetail }: Props) {
  const [detail, setDetail] = useState(initialDetail)
  const [editOpen, setEditOpen] = useState(false)

  return (
    <>
      <AppHeader
        breadcrumbs={[
          { label: "Ana Sayfa", href: "/" },
          { label: "Ayarlar", href: "/arf/cargo/settings/system" },
          { label: "Fiyat Tanımları", href: "/arf/cargo/settings/system/system-pricing" },
          { label: detail.name },
        ]}
      />

      <CreatePriceDefinitionModal
        open={editOpen}
        onOpenChange={setEditOpen}
        initialValue={detail}
        onSubmit={async (payload: UpsertPriceDefinitionInput & { id?: string }) => {
          const updated = await updatePricingDefinition(detail.id, payload)
          if (updated) {
            setDetail(updated)
          }
        }}
      />

      <div className="flex flex-1 flex-col gap-4 bg-slate-50 p-4 pt-0">
        <DetailHeaderCard
          detail={detail}
          onEdit={() => setEditOpen(true)}
          onToggleStatus={async () => {
            const next = detail.status === "active" ? "passive" : "active"
            const updated = await setPricingDefinitionStatus(detail.id, next)
            if (updated) {
              setDetail(updated)
            }
          }}
        />

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid h-10 w-full grid-cols-3 rounded-xl border border-slate-200 bg-slate-100 p-0.5">
            <TabsTrigger value="overview" className="text-xs">Genel</TabsTrigger>
            <TabsTrigger value="rules" className="text-xs">Barem Kuralları</TabsTrigger>
            <TabsTrigger value="surcharges" className="text-xs">Ek Hizmetler</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <DetailOverviewSection detail={detail} />
          </TabsContent>

          <TabsContent value="rules">
            <DetailRulesSection rules={detail.rules} />
          </TabsContent>

          <TabsContent value="surcharges">
            <DetailSurchargesSection surcharges={detail.surcharges} />
          </TabsContent>
        </Tabs>
      </div>
    </>
  )
}
