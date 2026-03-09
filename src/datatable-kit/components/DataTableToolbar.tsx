'use client'

/**
 * DataTableToolbar - Search, Filters & Actions
 * 
 * Global search, filter controls, ve toolbar actions
 */

import React from 'react'
import { Cross2Icon } from '@radix-ui/react-icons'
import { SearchIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { DataTableToolbarProps } from '../types'
import { DataTableViewOptions } from './DataTableViewOptions'

export function DataTableToolbar<TData>({
  table,
  searchKey,
  searchPlaceholder = 'Search...',
  children,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0 || !!table.getState().globalFilter

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        {/* Global Search */}
        {searchKey && (
          <div className="relative w-full max-w-sm">
            <SearchIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={searchPlaceholder}
              value={(table.getColumn(searchKey)?.getFilterValue() as string) ?? ''}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                table.getColumn(searchKey)?.setFilterValue(event.target.value)
              }
              className="h-9 w-full pl-8"
            />
          </div>
        )}
        
        {/* Custom filters/actions slot */}
        {children}
        
        {/* Clear filters button */}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => {
              table.resetColumnFilters()
              table.setGlobalFilter('')
            }}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      
      {/* Right side: Column selector */}
      <DataTableViewOptions table={table} />
    </div>
  )
}
