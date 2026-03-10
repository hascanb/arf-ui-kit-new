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
          View
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[220px] p-2">
        <p className="px-2 py-1 text-sm font-medium">Toggle columns</p>
        <div className="mt-1 space-y-1">
        {toggleableColumns.map((column) => {
            const isVisible = localVisibility[column.id] ?? column.getIsVisible()
            return (
              <button
                key={column.id}
                type="button"
                className="hover:bg-accent hover:text-accent-foreground flex w-full items-center rounded-sm px-2 py-1.5 text-left text-sm capitalize"
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
                {column.id}
              </button>
            )
          })}
        </div>
      </PopoverContent>
    </Popover>
  )
}
