'use client'

/**
 * DataTableViewOptions - Column Visibility Toggle
 * 
 * Kolon görünürlüğü seçici
 */

import React from 'react'
import { Check, SlidersHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import type { DataTableViewOptionsProps } from '../types'

const COLUMN_LABEL_OVERRIDES: Record<string, string> = {
  takip_no: 'Takip No',
  gonderen_musteri: 'Gönderen Müşteri',
  gonderen_sube: 'Gönderen Şube',
  alici_sube: 'Alıcı Şube',
  alici_musteri: 'Alıcı Müşteri',
  alici_telefon: 'Alıcı Telefon',
  odeme_turu: 'Ödeme Türü',
  fatura_turu: 'Fatura Türü',
  matrah: 'Matrah',
  kdv: 'KDV',
  toplam: 'Toplam',
  t_adet: 'T. Adet',
  t_desi: 'T. Desi',
  parca_listesi: 'Parça Listesi',
  irsaliye_no: 'İrsaliye No',
  atf_no: 'ATF No',
  olusturulma_zamani: 'Oluşturulma Zamanı',
  varis_zamani: 'Varış Zamanı',
  teslimat_zamani: 'Teslimat Zamanı',
  kargo_durumu: 'Kargo Durumu',
  fatura_durumu: 'Fatura Durumu',
  tahsilat_durumu: 'Tahsilat Durumu',
  olusturan: 'Oluşturan',
}

function prettifyColumnId(columnId: string) {
  return columnId
    .split('_')
    .filter(Boolean)
    .map((segment) => {
      const lower = segment.toLowerCase()
      if (lower === 'no') {
        return 'No'
      }
      if (lower === 'kdv' || lower === 'atf') {
        return lower.toUpperCase()
      }
      if (lower === 't') {
        return 'T.'
      }
      return lower.charAt(0).toUpperCase() + lower.slice(1)
    })
    .join(' ')
}

function resolveColumnLabel(columnId: string, header: unknown) {
  const overrideLabel = COLUMN_LABEL_OVERRIDES[columnId]
  if (overrideLabel) {
    return overrideLabel
  }

  if (typeof header === 'string' && header.trim().length > 0) {
    return header
  }

  return prettifyColumnId(columnId)
}

export function DataTableViewOptions<TData>({ table }: DataTableViewOptionsProps<TData>) {
  const [localVisibility, setLocalVisibility] = React.useState<Record<string, boolean>>({})

  React.useEffect(() => {
    const nextVisibility: Record<string, boolean> = {}
    for (const column of table.getAllLeafColumns()) {
      nextVisibility[column.id] = column.getIsVisible()
    }
    setLocalVisibility(nextVisibility)
  }, [table])

  const toggleableColumns = table
    .getAllLeafColumns()
    .filter((column) => column.getCanHide())

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="ml-auto hidden h-8 lg:flex">
          <SlidersHorizontal className="mr-2 h-4 w-4" />
          Görünüm
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[220px] p-2">
        <p className="px-2 py-1 text-sm font-medium">Sütunlar</p>
        <div className="mt-1 max-h-80 space-y-1 overflow-y-auto pr-1 pb-1">
        {toggleableColumns.map((column) => {
            const isVisible = localVisibility[column.id] ?? column.getIsVisible()
            const columnLabel = resolveColumnLabel(column.id, column.columnDef.header)
            return (
              <button
                key={column.id}
                type="button"
                className="hover:bg-accent hover:text-accent-foreground flex w-full items-center rounded-sm px-2 py-1.5 text-left text-sm"
                onClick={() => {
                  const nextVisibility = !isVisible
                  setLocalVisibility((prev) => ({
                    ...prev,
                    [column.id]: nextVisibility,
                  }))
                  column.toggleVisibility(nextVisibility)
                }}
              >
                <span className="mr-2 inline-flex w-4 items-center justify-center">
                  {isVisible ? <Check className="h-4 w-4" /> : null}
                </span>
                {columnLabel}
              </button>
            )
          })}
        </div>
      </PopoverContent>
    </Popover>
  )
}
