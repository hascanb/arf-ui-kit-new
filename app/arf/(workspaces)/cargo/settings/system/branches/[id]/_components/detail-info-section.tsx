"use client"

import { useRef, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { ArrowRight, Building2, FileText, Pencil, Upload, Trash2, Briefcase, Warehouse } from "lucide-react"
import type { BranchDetail, BranchDocument, BranchDocumentType } from "../_types"
import { BranchAcenteEditModal } from "./branch-acente-edit-modal"
import { BranchInfoEditModal } from "./branch-info-edit-modal"

function InfoRow({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="grid grid-cols-2 gap-2 border-b border-slate-100 py-2 text-sm last:border-b-0">
      <dt className="font-medium text-slate-500">{label}</dt>
      <dd className="text-right text-slate-800">{value ?? <span className="text-slate-400">-</span>}</dd>
    </div>
  )
}

const documentTypeLabels: Record<BranchDocumentType, string> = {
  vergi_levhasi: "Vergi Levhası",
  sozlesme: "Sözleşme",
  imza_sirkuleri: "İmza Sirküleri",
  diger: "Diğer",
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function maskIban(iban?: string) {
  if (!iban) return undefined
  const cleaned = iban.replace(/\s+/g, "")
  if (cleaned.length < 8) return iban
  return `${cleaned.slice(0, 4)} **** **** **** ${cleaned.slice(-4)}`
}

interface Props {
  branch: BranchDetail
  onBranchChange: React.Dispatch<React.SetStateAction<BranchDetail>>
}

export function DetailInfoSection({ branch, onBranchChange }: Props) {
  const [infoModalOpen, setInfoModalOpen] = useState(false)
  const [agencyModalOpen, setAgencyModalOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const documents = branch.documents

  const handleDeleteDocument = (documentId: string) => {
    if (!window.confirm("Bu dosyayı silmek istediğinizden emin misiniz?")) {
      return
    }

    onBranchChange((prev) => ({
      ...prev,
      documents: prev.documents.filter((document) => document.id !== documentId),
    }))
  }

  const handleUploadDocument = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) {
      return
    }

    const newDocument: BranchDocument = {
      id: `doc-${Date.now()}`,
      type: "diger",
      fileName: file.name,
      fileSize: file.size,
      uploadedAt: new Date().toISOString(),
      uploadedBy: "Mevcut Kullanıcı",
      url: URL.createObjectURL(file),
    }

    onBranchChange((prev) => ({
      ...prev,
      documents: [newDocument, ...prev.documents],
    }))
    event.target.value = ""
  }

  return (
    <>
      <BranchInfoEditModal
        open={infoModalOpen}
        onOpenChange={setInfoModalOpen}
        value={{
          il: branch.il,
          ilce: branch.ilce,
          mahalle: branch.mahalle,
          acikAdres: branch.acikAdres,
          telefon: branch.telefon,
          eposta: branch.eposta,
          calismaSaatleri: branch.calismaSaatleri,
        }}
        onSave={(value) => onBranchChange((prev) => ({ ...prev, ...value }))}
      />
      <BranchAcenteEditModal
        open={agencyModalOpen}
        onOpenChange={setAgencyModalOpen}
        value={{
          vergiDairesi: branch.vergiDairesi,
          vkn: branch.vkn,
          acenteSahibi: branch.acenteSahibi,
          acenteSahibiTelefon: branch.acenteSahibiTelefon,
          acenteSahibiEposta: branch.acenteSahibiEposta,
          acenteYoneticisi: branch.acenteYoneticisi,
          acenteYoneticisiTelefon: branch.acenteYoneticisiTelefon,
          bankAdi: branch.bankAdi,
          iban: branch.iban,
          hesapSahibi: branch.hesapSahibi,
        }}
        onSave={(value) => onBranchChange((prev) => ({ ...prev, ...value }))}
      />

      <div className="grid gap-4 xl:grid-cols-2">
        <Card className="rounded-2xl border-slate-200 bg-white shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <Building2 className="size-4 text-slate-400" />
              Şube Bilgileri
            </CardTitle>
            <Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => setInfoModalOpen(true)}>
              <Pencil className="mr-1.5 size-3.5" />
              Düzenle
            </Button>
          </CardHeader>
          <Separator />
          <CardContent className="pt-4">
            <dl>
              <InfoRow label="İl / İlçe" value={`${branch.il} / ${branch.ilce}`} />
              <InfoRow label="Mahalle" value={branch.mahalle} />
              <InfoRow label="Açık Adres" value={branch.acikAdres} />
              <InfoRow label="Telefon" value={branch.telefon} />
              <InfoRow label="E-posta" value={branch.eposta} />
              <InfoRow label="Merkez Adı" value={branch.bagliMerkezAdi} />
              <InfoRow label="Merkez Kodu" value={branch.bagliMerkezKodu} />
              <InfoRow label="Çalışma Saatleri" value={branch.calismaSaatleri} />
            </dl>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-slate-200 bg-white shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <Briefcase className="size-4 text-slate-400" />
              Şube Acente Bilgileri
            </CardTitle>
            <Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => setAgencyModalOpen(true)}>
              <Pencil className="mr-1.5 size-3.5" />
              Düzenle
            </Button>
          </CardHeader>
          <Separator />
          <CardContent className="pt-4">
            <dl>
              <InfoRow label="Vergi Dairesi" value={branch.vergiDairesi} />
              <InfoRow label="VKN" value={branch.vkn} />
              <InfoRow label="Acente Sahibi" value={branch.acenteSahibi} />
              <InfoRow label="Sahibi Telefon" value={branch.acenteSahibiTelefon} />
              <InfoRow label="Sahibi E-posta" value={branch.acenteSahibiEposta} />
              <InfoRow label="Acente Yöneticisi" value={branch.acenteYoneticisi} />
              <InfoRow label="Yönetici Telefon" value={branch.acenteYoneticisiTelefon} />
              <InfoRow
                label="Hakediş Oranı"
                value={`Alım: %${Math.round((branch.alimHakedisOrani ?? 0) * 100)} / Dağıtım: %${Math.round((branch.dagitimHakedisOrani ?? 0) * 100)}`}
              />
              <InfoRow label="Banka Adı" value={branch.bankAdi} />
              <InfoRow label="IBAN" value={maskIban(branch.iban)} />
              <InfoRow label="Hesap Sahibi" value={branch.hesapSahibi} />
            </dl>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-slate-200 bg-white shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <FileText className="size-4 text-slate-400" />
              Şube Acente Dosyaları
            </CardTitle>
            <>
              <input ref={fileInputRef} type="file" className="hidden" onChange={handleUploadDocument} />
              <Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => fileInputRef.current?.click()}>
                <Upload className="mr-1.5 size-3.5" />
                Dosya Yükle
              </Button>
            </>
          </CardHeader>
          <Separator />
          <CardContent className="pt-4">
            {documents.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-2 py-8 text-slate-400">
                <FileText className="size-8" />
                <p className="text-sm">Henüz dosya yüklenmemiş</p>
              </div>
            ) : (
              <ul className="space-y-3">
                {documents.map((document) => (
                  <li key={document.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-slate-800">{document.fileName}</p>
                        <p className="text-xs text-slate-500">{documentTypeLabels[document.type]} • {formatBytes(document.fileSize)}</p>
                        <p className="text-xs text-slate-400">
                          {new Date(document.uploadedAt).toLocaleDateString("tr-TR")} • {document.uploadedBy}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" className="h-8 text-xs" asChild>
                          <a href={document.url} target="_blank" rel="noreferrer">
                            İndir
                          </a>
                        </Button>
                        <Button variant="outline" size="sm" className="h-8 border-red-200 text-red-700 hover:bg-red-50 hover:text-red-700" onClick={() => handleDeleteDocument(document.id)}>
                          <Trash2 className="size-3.5" />
                        </Button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-slate-200 bg-white shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <Warehouse className="size-4 text-slate-400" />
              Bağlı Transfer Merkezi
            </CardTitle>
          </CardHeader>
          <Separator />
          <CardContent className="pt-4">
            {branch.bagliMerkezId ? (
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <dl>
                  <InfoRow label="Merkez Adı" value={branch.bagliMerkezAdi} />
                  <InfoRow label="Merkez Kodu" value={branch.bagliMerkezKodu} />
                  <InfoRow label="Şehir" value={branch.bagliMerkezSehir} />
                </dl>
                <div className="mt-4 flex justify-end">
                  <Button variant="outline" size="sm" className="h-8 text-xs" asChild>
                    <Link href={`/arf/cargo/settings/system/transfer-centers/${branch.bagliMerkezId}`}>
                      Detayı Görüntüle
                      <ArrowRight className="ml-1.5 size-3.5" />
                    </Link>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-10 text-center text-sm text-slate-500">
                Bağlı merkez bulunamadı.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  )
}
