"use client"

import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { BankAccountDetail } from "../../_types"
import { mockBranches } from "../../../branches/_mock/branches-mock-data"

interface Props {
  bankAccount: BankAccountDetail
}

function formatMoney(value: number, currency: BankAccountDetail["currency"]): string {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

export function DetailOverviewSection({ bankAccount }: Props) {
  const allowedBranches = mockBranches.filter((branch) => bankAccount.allowedBranchIds.includes(branch.id))

  return (
    <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
      <Card className="rounded-2xl border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle>Genel Bilgiler</CardTitle>
          <CardDescription>Hesabın finansal ve kurumsal kimliği.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-wide text-slate-500">IBAN</p>
            <div className="mt-2 flex items-center justify-between gap-3">
              <p className="font-mono text-sm font-medium text-slate-900">{bankAccount.iban.replace(/(.{4})/g, "$1 ").trim()}</p>
              <Button type="button" variant="outline" size="sm" onClick={() => void navigator.clipboard?.writeText(bankAccount.iban)}>
                Kopyala
              </Button>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-wide text-slate-500">Bakiye</p>
            <p className="mt-2 text-lg font-semibold text-slate-900">{formatMoney(bankAccount.balance, bankAccount.currency)}</p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <p className="text-xs uppercase tracking-wide text-slate-500">Banka ve Şube</p>
            <p className="mt-2 font-medium text-slate-900">{bankAccount.bankName}</p>
            <p className="text-sm text-slate-500">{bankAccount.branchName}</p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <p className="text-xs uppercase tracking-wide text-slate-500">Hesap Türü</p>
            <p className="mt-2 font-medium text-slate-900">
              {bankAccount.accountType === "collection" ? "Tahsilat Hesabı" : "Gider / Ödeme Hesabı"}
            </p>
            <p className="text-sm text-slate-500">{bankAccount.accountHolder}</p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4 md:col-span-2">
            <p className="text-xs uppercase tracking-wide text-slate-500">Etiket</p>
            <p className="mt-2 font-medium text-slate-900">{bankAccount.label}</p>
            <p className="text-sm text-slate-500">Oluşturan: {bankAccount.createdByName}</p>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        <Card className="rounded-2xl border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle>Kapsam ve Görünürlük</CardTitle>
            <CardDescription>Şube whitelist mantığı ve erişim kapsamı.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {bankAccount.accountType === "expense" ? (
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                Bu hesap gider / ödeme hesabıdır ve yalnızca Genel Merkez ekranlarında kullanılmalıdır.
              </div>
            ) : bankAccount.isOpenToAllBranches ? (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
                Bu hesap tüm aktif şubelere açıktır.
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-sm font-medium text-slate-800">Sadece seçili şubeler görebilir</p>
                <div className="flex flex-wrap gap-2">
                  {allowedBranches.map((branch) => (
                    <Badge key={branch.id} variant="outline" className="border-slate-200 bg-slate-50 text-slate-700">
                      <Link href={`/arf/cargo/settings/system/branches/${branch.id}`}>{branch.ad}</Link>
                    </Badge>
                  ))}
                  {allowedBranches.length === 0 && <span className="text-sm text-slate-500">Whitelist şube bulunmuyor.</span>}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle>Entegrasyon ve Operasyon</CardTitle>
            <CardDescription>Ekstre akışı ve sistemsel kullanım durumu.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-slate-700">
            <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
              <span>Entegrasyon Durumu</span>
              <Badge variant="outline" className={bankAccount.integrationStatus === "active" ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-slate-200 bg-slate-100 text-slate-700"}>
                {bankAccount.integrationStatus === "active" ? "Aktif" : "Pasif"}
              </Badge>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
              <span>Hesap Statüsü</span>
              <Badge variant="outline" className={bankAccount.status === "active" ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-red-200 bg-red-50 text-red-700"}>
                {bankAccount.status === "active" ? "Kullanımda" : "Kapalı"}
              </Badge>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-600">
              {bankAccount.integrationStatus === "active"
                ? "Bu hesap için otomatik ekstre akışı açık. Mutabakat ekranları bu hesaptan veri alabilir."
                : "Bu hesapta otomatik entegrasyon kapalı. Hareketler manuel veya dış yükleme ile takip edilir."}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
