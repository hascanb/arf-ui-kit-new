"use client"

import { useState } from "react"
import { AppHeader } from '@hascanb/arf-ui-kit/layout-kit'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, ChevronDown, ChevronUp, CircleDollarSign, Package, Plus, ShieldCheck, Users } from "lucide-react"
import { customerDetails, customerListRows } from "./_data/customers"
import { CustomersTableSection } from "./_components/customers-table-section"

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    minimumFractionDigits: 2,
  }).format(value)

export default function MusterilerPage() {
  const [isSummaryVisible, setIsSummaryVisible] = useState(true)

  const totalCustomerCount = customerListRows.length
  const activeCustomerCount = customerListRows.filter((row) => row.durum === "active").length
  const deliveredShipmentCount = customerListRows.reduce((acc, row) => acc + row.teslim_edilen_sayisi, 0)
  const totalShipmentAmount = customerDetails.reduce(
    (acc, customer) => acc + customer.shipments.reduce((shipmentAcc, shipment) => shipmentAcc + shipment.amount, 0),
    0,
  )
  const totalOpenBalance = customerDetails.reduce(
    (acc, customer) => acc + (customer.financialMovements[customer.financialMovements.length - 1]?.balance ?? 0),
    0,
  )
  const totalActiveContractCount = customerListRows.reduce((acc, row) => acc + row.aktif_sozlesme_sayisi, 0)

  const summaryCards = [
    { label: "Toplam Müşteri", value: String(totalCustomerCount), icon: Users },
    { label: "Aktif Müşteri", value: String(activeCustomerCount), icon: CheckCircle2 },
    { label: "Teslim Edilen Kargo", value: String(deliveredShipmentCount), icon: Package },
    { label: "Toplam Ciro", value: formatCurrency(totalShipmentAmount), icon: CircleDollarSign },
    { label: "Açık Bakiye", value: formatCurrency(totalOpenBalance), icon: CircleDollarSign },
    { label: "Aktif Sözleşme", value: String(totalActiveContractCount), icon: ShieldCheck },
  ]

  return (
    <>
      <AppHeader
        breadcrumbs={[
          { label: "Ana Sayfa", href: "/" },
          { label: "Müşteriler" },
        ]}
      />

      <div className="flex flex-1 flex-col gap-6 bg-slate-50 p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Müşteriler</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsSummaryVisible((prev) => !prev)}
            >
              {isSummaryVisible ? <ChevronUp className="mr-2 size-4" /> : <ChevronDown className="mr-2 size-4" />}
              {isSummaryVisible ? "Özeti Gizle" : "Özeti Göster"}
            </Button>
            <Button className="shrink-0">
              <Plus className="mr-2 size-4" />
              Yeni Müşteri
            </Button>
          </div>
        </div>

        {isSummaryVisible && (
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
            {summaryCards.map((card) => (
              <Card key={card.label} className="rounded-2xl border-slate-200 bg-white shadow-sm">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-medium tracking-wide text-slate-500">{card.label}</p>
                    <span className="inline-flex size-7 items-center justify-center rounded-lg border border-secondary/30 bg-primary/12 text-secondary">
                      <card.icon className="size-4" />
                    </span>
                  </div>
                  <p className="mt-1 text-xl font-semibold tracking-tight text-slate-900">{card.value}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <Card className="rounded-2xl border-slate-200 bg-white shadow-sm">
          <CardContent>
            <CustomersTableSection data={customerListRows} />
          </CardContent>
        </Card>
      </div>
    </>
  )
}
