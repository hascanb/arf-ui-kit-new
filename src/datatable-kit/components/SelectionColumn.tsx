'use client'

/**
 * SelectionColumn - Row Selection Column Helper
 * 
 * Checkbox column oluşturma helper'ı
 * Header checkbox: Select all on page
 * Cell checkbox: Individual row selection
 */

import React from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import type { ColumnDef } from '@tanstack/react-table'

export function createSelectionColumn<TData>(): ColumnDef<TData> {
  return {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value: boolean) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value: boolean) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  }
}
