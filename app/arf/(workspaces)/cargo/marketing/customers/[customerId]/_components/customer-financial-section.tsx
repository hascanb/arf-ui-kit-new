"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type {
  FinancialExstreRecord,
  FinancialKpi,
  InvoiceCustomerInfo,
  OpenCargoRecord,
} from "../_types/financial"
import { FinancialKpiCards } from "./financial-kpi-cards"
import { OpenCargosTableSection } from "./open-cargos-table-section"
import { InvoicesTableSection } from "./invoices-table-section"

export function CustomerFinancialSection({
  kpi,
  openCargos,
  invoices,
  customerInfo,
}: {
  kpi: FinancialKpi
  openCargos: OpenCargoRecord[]
  invoices: FinancialExstreRecord[]
  customerInfo: InvoiceCustomerInfo
}) {
  return (
    <div className="space-y-4">
      <FinancialKpiCards kpi={kpi} />

      <Tabs defaultValue="open-cargos" className="space-y-3">
        <TabsList className="grid h-10 w-full grid-cols-2 rounded-xl border border-slate-200 bg-slate-100 p-0.5">
          <TabsTrigger value="open-cargos">
            Açık Kargolar ({openCargos.length})
          </TabsTrigger>
          <TabsTrigger value="invoices">
            Faturalar ve Tahsilatlar
          </TabsTrigger>
        </TabsList>

        <TabsContent value="open-cargos">
          <OpenCargosTableSection data={openCargos} customerInfo={customerInfo} />
        </TabsContent>

        <TabsContent value="invoices">
          <InvoicesTableSection data={invoices} customerId={customerInfo.customerId} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
