"use client"

import { useMemo, useState, type ChangeEvent } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { createIntegration } from "../_api/integrations-api"
import type {
  CreateIntegrationPayload,
  IntegrationCategoryOption,
  IntegrationPlatform,
  IntegrationRecord,
} from "../_types"
import { useIntegrationFilters } from "../_hooks/use-integration-filters"
import { CreateIntegrationModal } from "./create-integration-modal"
import { IntegrationCard } from "./integration-card"

interface Props {
  integrations: IntegrationRecord[]
  platforms: IntegrationPlatform[]
  categories: IntegrationCategoryOption[]
}

export function IntegrationsMarketplaceSection({ integrations, platforms, categories }: Props) {
  const [rows, setRows] = useState(integrations)
  const [modalOpen, setModalOpen] = useState(false)
  const [initialPlatformId, setInitialPlatformId] = useState<string | undefined>(undefined)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const category = searchParams.get("category") ?? "all"
  const status = searchParams.get("status") ?? "all"
  const q = searchParams.get("q") ?? ""
  const pageParam = Number(searchParams.get("page") ?? "1")
  const currentPage = Number.isFinite(pageParam) && pageParam > 0 ? pageParam : 1
  const pageSize = 6

  const filteredRows = useIntegrationFilters(rows, { category, status, q })
  const pagedRows = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filteredRows.slice(start, start + pageSize)
  }, [currentPage, filteredRows])
  const totalPages = Math.max(1, Math.ceil(filteredRows.length / pageSize))

  const categoryButtons = useMemo(
    () => [{ id: "all", label: "Tümü" }, ...categories.map((item) => ({ id: item.id, label: item.label }))],
    [categories],
  )

  const setParam = (key: string, value: string, resetPage = true) => {
    const params = new URLSearchParams(searchParams.toString())
    if (!value || value === "all") {
      params.delete(key)
    } else {
      params.set(key, value)
    }
    if (resetPage) {
      params.delete("page")
    }
    router.replace(params.size > 0 ? `${pathname}?${params.toString()}` : pathname)
  }

  const handleCreate = async (payload: CreateIntegrationPayload) => {
    const created = await createIntegration(payload)
    setRows((prev) => [created, ...prev])
    setSuccessMessage("Entegrasyon başarıyla oluşturuldu.")
  }

  return (
    <div className="space-y-4">
      {successMessage ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {successMessage}
        </div>
      ) : null}

      <CreateIntegrationModal
        open={modalOpen}
        platforms={platforms}
        initialPlatformId={initialPlatformId}
        onOpenChange={(open) => {
          setModalOpen(open)
          if (!open) setInitialPlatformId(undefined)
        }}
        onCreate={handleCreate}
      />

      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:flex-row lg:items-center lg:justify-between">
        <div className="grid flex-1 gap-3 md:grid-cols-3">
          <Input value={q} onChange={(event: ChangeEvent<HTMLInputElement>) => setParam("q", event.target.value)} placeholder="Platform adı ara..." />

          <Select value={status} onValueChange={(value: string) => setParam("status", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Durum" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tüm Durumlar</SelectItem>
              <SelectItem value="connected">Bağlı</SelectItem>
              <SelectItem value="disconnected">Bağlantı Koptu</SelectItem>
              <SelectItem value="error">Hata</SelectItem>
              <SelectItem value="pending_setup">Kurulum Bekliyor</SelectItem>
            </SelectContent>
          </Select>

          <Button type="button" variant="outline" onClick={() => router.replace(pathname)}>Filtreleri Sıfırla</Button>
        </div>

        <Button type="button" onClick={() => setModalOpen(true)}>+ Yeni Entegrasyon Oluştur / Bağla</Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {categoryButtons.map((item) => (
          <Button key={item.id} variant={category === item.id ? "default" : "outline"} size="sm" onClick={() => setParam("category", item.id)}>
            {item.label}
          </Button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {pagedRows.map((row) => (
          <IntegrationCard
            key={row.id}
            row={row}
            onConnect={(platformId) => {
              setInitialPlatformId(platformId)
              setModalOpen(true)
            }}
            onDuplicate={(rowToClone) => {
              setInitialPlatformId(rowToClone.platformId)
              setModalOpen(true)
            }}
          />
        ))}
      </div>

      <div className="flex items-center justify-between">
        <p className="text-xs text-slate-500">Sayfa {currentPage} / {totalPages}</p>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={currentPage <= 1}
            onClick={() => setParam("page", String(currentPage - 1), false)}
          >
            Önceki
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={currentPage >= totalPages}
            onClick={() => setParam("page", String(currentPage + 1), false)}
          >
            Sonraki
          </Button>
        </div>
      </div>
    </div>
  )
}
