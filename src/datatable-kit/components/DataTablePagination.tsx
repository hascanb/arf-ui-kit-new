'use client'

/**
 * DataTablePagination - Pagination Controls
 * 
 * Sayfa navigasyonu ve sayfa boyutu seçici
 */

import React from 'react'
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { DataTablePaginationProps } from '../types'

export function DataTablePagination({
  table,
  pageSizeOptions = [10, 20, 30, 40, 50],
  showPageInfo = true,
  showPageSizeSelector = true,
}: DataTablePaginationProps) {
  const currentPage = table.getState().pagination.pageIndex + 1
  const totalPages = table.getPageCount()
  const pageSize = table.getState().pagination.pageSize
  const totalRows = table.getFilteredRowModel().rows.length
  const startRow = totalRows === 0 ? 0 : currentPage * pageSize - pageSize + 1
  const endRow = Math.min(currentPage * pageSize, totalRows)

  return (
    <div className="flex items-center justify-between px-2 py-4">
      {/* Left: Page info & size selector */}
      <div className="flex items-center space-x-6">
        {showPageInfo && (
          <div className="flex-1 text-sm text-muted-foreground">
            Showing {startRow} to {endRow} of {totalRows} row(s)
          </div>
        )}
        
        {showPageSizeSelector && (
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">Rows per page</p>
            <Select
              value={`${pageSize}`}
              onValueChange={(value: string) => {
                table.setPageSize(Number(value))
              }}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue placeholder={pageSize} />
              </SelectTrigger>
              <SelectContent side="top">
                {pageSizeOptions.map((size) => (
                  <SelectItem key={size} value={`${size}`}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {/* Right: Navigation buttons */}
      <div className="flex items-center space-x-2">
        <div className="flex items-center justify-center text-sm font-medium">
          Page {currentPage} of {totalPages}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to first page</span>
            <ChevronsLeftIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to last page</span>
            <ChevronsRightIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
