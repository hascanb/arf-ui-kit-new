"use client"

import { useState } from "react"
import { AlertTriangle, FileText, Plus, Upload } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { DocumentUploadModal } from "./document-upload-modal"
import type { SupplierDetail, SupplierDocument } from "../_types"

const DOCUMENT_TYPE_LABELS: Record<string, string> = {
  vergi_levhasi: "Vergi Levhası",
  imza_sirkuleri: "İmza Sirküleri",
  tasima_sozlesmesi: "Taşıma Sözleşmesi",
  k_belgesi: "K Belgesi",
  src_belgesi: "SRC Belgesi",
  trafik_sigortasi: "Trafik Sigortası",
  kasko: "Kasko",
  diger: "Diğer",
}

const CONTRACT_TYPE_LABELS: Record<string, string> = {
  fixed_salary: "Sabit Maaşlı",
  per_trip: "Sefer Başı",
  per_desi: "Desi Başı",
  commission: "Komisyon",
}

interface Props {
  supplier: SupplierDetail
  onSupplierChange: (updated: SupplierDetail) => void
}

export function SupplierProfileSection({ supplier, onSupplierChange }: Props) {
  const [docUploadOpen, setDocUploadOpen] = useState(false)

  function handleDocumentAdded(newDoc: SupplierDocument) {
    onSupplierChange({
      ...supplier,
      documents: [...supplier.documents, newDoc],
    })
  }

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      {/* Firma Bilgileri */}
      <Card className="rounded-2xl border-slate-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-slate-700">Firma Bilgileri</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <InfoRow label="Tedarikçi Adı" value={supplier.name} />
          <Separator />
          <InfoRow label="Vergi Dairesi" value={supplier.taxOffice} />
          <Separator />
          <InfoRow label="VKN / TCKN" value={supplier.taxNumber} />
          <Separator />
          <InfoRow label="Adres" value={supplier.officialAddress} />
          <Separator />
          <InfoRow label="Şehir" value={supplier.city} />
          <Separator />
          <InfoRow
            label="Kayıt Tarihi"
            value={supplier.createdAt ? new Date(supplier.createdAt).toLocaleDateString("tr-TR") : undefined}
          />
        </CardContent>
      </Card>

      {/* İletişim & Anlaşma */}
      <Card className="rounded-2xl border-slate-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-slate-700">İletişim & Anlaşma</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <InfoRow label="Yetkili" value={supplier.contactPerson} />
          <Separator />
          <InfoRow label="Unvan" value={supplier.contactPersonTitle} />
          <Separator />
          <InfoRow label="Telefon" value={supplier.contactPhone} />
          <Separator />
          <InfoRow label="E-posta" value={supplier.contactEmail} />
          <Separator />
          <InfoRow
            label="Sözleşme Tipi"
            value={
              supplier.contractType
                ? CONTRACT_TYPE_LABELS[supplier.contractType] ?? supplier.contractType
                : undefined
            }
          />
          <Separator />
          <InfoRow
            label="Ödeme Vadesi"
            value={supplier.paymentTermDays ? `${supplier.paymentTermDays} gün` : undefined}
          />
          {supplier.pricePerTrip !== undefined && (
            <>
              <Separator />
              <InfoRow
                label="Sefer Başı Ücret"
                value={`${supplier.pricePerTrip.toLocaleString("tr-TR")} ₺`}
              />
            </>
          )}
          {supplier.pricePerDesi !== undefined && (
            <>
              <Separator />
              <InfoRow
                label="Desi Başı Ücret"
                value={`${supplier.pricePerDesi.toLocaleString("tr-TR")} ₺`}
              />
            </>
          )}
        </CardContent>
      </Card>

      {/* Banka Bilgileri */}
      <Card className="rounded-2xl border-slate-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-slate-700">Banka Bilgileri</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <InfoRow label="IBAN" value={supplier.iban} monospace />
          <Separator />
          <InfoRow label="Hesap Sahibi" value={supplier.accountHolder} />
        </CardContent>
      </Card>

      {/* Evraklar */}
      <Card className="rounded-2xl border-slate-200">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-sm font-semibold text-slate-700">Evraklar</CardTitle>
          <Button
            variant="outline"
            size="sm"
            className="h-8 rounded-lg text-xs"
            onClick={() => setDocUploadOpen(true)}
          >
            <Plus className="mr-1 size-3.5" />
            Evrak Ekle
          </Button>
        </CardHeader>
        <CardContent>
          {supplier.documents.length === 0 ? (
            <p className="py-3 text-center text-sm text-slate-400">Henüz evrak eklenmemiş.</p>
          ) : (
            <ul className="space-y-2">
              {supplier.documents.map((doc) => (
                <DocumentRow key={doc.id} doc={doc} />
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <DocumentUploadModal
        supplierId={supplier.id}
        open={docUploadOpen}
        onOpenChange={setDocUploadOpen}
        onUploaded={handleDocumentAdded}
      />
    </div>
  )
}

function InfoRow({
  label,
  value,
  monospace,
}: {
  label: string
  value?: string
  monospace?: boolean
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="shrink-0 text-slate-500">{label}</span>
      <span
        className={`text-right font-medium text-slate-800 ${monospace ? "font-mono text-xs" : ""}`}
      >
        {value ?? <span className="font-normal text-slate-400">—</span>}
      </span>
    </div>
  )
}

function DocumentRow({ doc }: { doc: SupplierDocument }) {
  const borderColor = doc.isExpired
    ? "border-rose-400 bg-rose-50"
    : doc.isExpiringSoon
      ? "border-amber-400 bg-amber-50"
      : "border-slate-200 bg-white"

  return (
    <li
      className={`flex items-center justify-between rounded-lg border border-l-4 px-3 py-2 ${borderColor}`}
    >
      <div className="flex items-center gap-2">
        <FileText className="size-4 shrink-0 text-slate-400" />
        <div>
          <p className="text-sm font-medium text-slate-700">
            {DOCUMENT_TYPE_LABELS[doc.documentType] ?? doc.label}
          </p>
          {doc.expiryDate && (
            <p className="text-xs text-slate-500">
              Bitiş: {new Date(doc.expiryDate).toLocaleDateString("tr-TR")}
            </p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-1.5">
        {doc.isExpired && (
          <Badge variant="outline" className="border-rose-200 bg-rose-100 text-rose-700 text-xs">
            <AlertTriangle className="mr-1 size-3" />
            Süresi Dolmuş
          </Badge>
        )}
        {doc.isExpiringSoon && !doc.isExpired && (
          <Badge variant="outline" className="border-amber-200 bg-amber-100 text-amber-700 text-xs">
            <AlertTriangle className="mr-1 size-3" />
            Yakın Bitiş
          </Badge>
        )}
        {doc.fileUrl && (
          <a
            href={doc.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-1"
          >
            <Upload className="size-3.5 text-slate-400 hover:text-primary" />
          </a>
        )}
      </div>
    </li>
  )
}
