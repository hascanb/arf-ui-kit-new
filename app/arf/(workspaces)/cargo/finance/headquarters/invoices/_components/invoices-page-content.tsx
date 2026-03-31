"use client"

import { useState } from "react"
import { AppHeader } from "@hascanb/arf-ui-kit/layout-kit"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronUp } from "lucide-react"
import type { InvoiceRecord, InvoiceSummary } from "../_types/invoice"
import { InvoiceSummaryCards } from "./invoice-summary-cards"
import { InvoicesTableSection } from "./invoices-table-section"

interface Props {
  invoices: InvoiceRecord[]
  summary: InvoiceSummary
}

export function InvoicesPageContent({ invoices, summary }: Props) {
  const [showHeaderSummary, setShowHeaderSummary] = useState(true)

  return (
    <>
      {showHeaderSummary && (
        <AppHeader
          breadcrumbs={[
            { label: "Ana Sayfa", href: "/" },
            { label: "Finans & Muhasebe", href: "/arf/cargo/finance" },
            { label: "Genel Merkez", href: "/arf/cargo/finance/headquarters" },
            { label: "Faturalar" },
          ]}
        />
      )}

      <div className="flex flex-1 flex-col gap-4 bg-slate-50 p-4 pt-0">
        <div className="flex flex-col gap-4 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-950">Faturalar</h1>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowHeaderSummary((prev) => !prev)}
            className="shrink-0"
          >
            {showHeaderSummary ? (
              <>
                <ChevronUp className="mr-2 size-4" />
                <span>Özeti Gizle</span>
              </>
            ) : (
              <>
                <ChevronUp className="mr-2 size-4 rotate-180" />
                <span>Özeti Göster</span>
              </>
            )}
          </Button>
        </div>

        {showHeaderSummary && <InvoiceSummaryCards summary={summary} />}

        <Card className="rounded-2xl border-slate-200 shadow-sm">
          <CardContent className="pt-4">
            <InvoicesTableSection data={invoices} />
          </CardContent>
        </Card>
      </div>
    </>
  )
}