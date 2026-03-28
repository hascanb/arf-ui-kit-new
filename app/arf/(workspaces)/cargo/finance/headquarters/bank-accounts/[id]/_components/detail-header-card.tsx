"use client"

import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { BankAccountDetail } from "../../_types"
import { ArrowLeft, Copy, Edit3, Power, PowerOff, Share2 } from "lucide-react"

interface Props {
  bankAccount: BankAccountDetail
  onToggleStatus: () => void
  onEdit: () => void
}

export function DetailHeaderCard({ bankAccount, onToggleStatus, onEdit }: Props) {
  const isClosed = bankAccount.status === "closed"

  return (
    <Card className={cn("sticky top-2 z-20 rounded-2xl border-slate-200 bg-white shadow-sm", isClosed && "border-red-300 bg-red-50")}>
      <CardContent className="p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex items-start gap-3">
            <Button variant="ghost" size="icon" asChild className="mt-0.5 size-9 rounded-lg border border-slate-200 bg-white shadow-sm">
              <Link href="/arf/cargo/finance/headquarters/bank-accounts">
                <ArrowLeft className="size-4" />
              </Link>
            </Button>

            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl font-semibold tracking-tight text-slate-900">Banka Hesabı Detay: {bankAccount.label}</h1>
                <Badge variant="outline" className={cn("border", isClosed ? "border-red-200 bg-red-50 text-red-700" : "border-emerald-200 bg-emerald-50 text-emerald-700")}>
                  {isClosed ? "Kapalı" : "Kullanımda"}
                </Badge>
                <Badge variant="outline" className={cn("border", bankAccount.integrationStatus === "active" ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-slate-200 bg-slate-50 text-slate-700")}>
                  Entegrasyon {bankAccount.integrationStatus === "active" ? "Aktif" : "Pasif"}
                </Badge>
              </div>

              <p className="text-sm text-slate-600">
                {bankAccount.bankName} | {bankAccount.branchName} | <span className="font-mono">{bankAccount.iban.replace(/(.{4})/g, "$1 ").trim()}</span>
              </p>

              {isClosed && (
                <p className="text-xs font-medium text-red-700">
                  Bu hesap kapalı durumda. Şubelerin ödeme ekranında görünmemelidir.
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button type="button" variant="outline" size="sm" className="h-9" onClick={() => void navigator.clipboard?.writeText(bankAccount.iban)}>
              <Copy className="mr-1.5 size-4" />
              IBAN Kopyala
            </Button>
            <Button type="button" variant="outline" size="sm" className="h-9" onClick={() => void navigator.clipboard?.writeText(window.location.href)}>
              <Share2 className="mr-1.5 size-4" />
              Paylaş
            </Button>
            <Button type="button" variant="outline" size="sm" className="h-9" onClick={onToggleStatus}>
              {isClosed ? <Power className="mr-1.5 size-4" /> : <PowerOff className="mr-1.5 size-4" />}
              {isClosed ? "Kullanıma Aç" : "Kapat"}
            </Button>
            <Button type="button" size="sm" className="h-9" onClick={onEdit}>
              <Edit3 className="mr-1.5 size-4" />
              Düzenle
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
