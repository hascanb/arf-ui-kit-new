'use client'

/**
 * DataTable - Main Component
 * 
 * TanStack Table tabanlı, feature-rich veri tablosu bileşeni
 */

import React, { useMemo } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  type ColumnDef,
} from '@tanstack/react-table'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ScrollArea } from '@/components/ui/scroll-area'
import type { DataTableProps } from '../types'

export function DataTable<TData>({
  data,
  columns,
  
  // Pagination
  enablePagination = true,
  pagination,
  onPaginationChange,
  pageCount,
  manualPagination = false,
  
  // Sorting
  enableSorting = true,
  sorting,
  onSortingChange,
  manualSorting = false,
  enableMultiSort = true,
  
  // Filtering
  enableGlobalFilter = true,
  globalFilter,
  onGlobalFilterChange,
  columnFilters,
  onColumnFiltersChange,
  manualFiltering = false,
  
  // Column Visibility
  enableColumnVisibility = true,
  columnVisibility,
  onColumnVisibilityChange,
  
  // Row Selection
  enableRowSelection = false,
  rowSelection,
  onRowSelectionChange,
  enableMultiRowSelection = true,
  
  // Layout
  enableHorizontalScroll = true,
  stickyFirstColumn = false,
  stickyLastColumn = false,
  
  // Styling
  className,
  tableClassName,
  
  // States
  isLoading = false,
  emptyMessage = 'No data available.',
  loadingMessage = 'Loading...',
  
  // Callbacks
  onRowClick,
  onRowDoubleClick,
}: DataTableProps<TData>) {
  // Internal state management
  const [internalPagination, setInternalPagination] = React.useState<{
    pageIndex: number
    pageSize: number
  }>({
    pageIndex: 0,
    pageSize: 10,
  })
  
  const [internalSorting, setInternalSorting] = React.useState<any[]>([])
  const [internalGlobalFilter, setInternalGlobalFilter] = React.useState('')
  const [internalColumnFilters, setInternalColumnFilters] = React.useState<any[]>([])
  const [internalColumnVisibility, setInternalColumnVisibility] = React.useState<Record<string, boolean>>({})
  const [internalRowSelection, setInternalRowSelection] = React.useState<Record<string, boolean>>({})

  // Use controlled or internal state
  const paginationState = pagination ?? internalPagination
  const sortingState = sorting ?? internalSorting
  const globalFilterState = globalFilter ?? internalGlobalFilter
  const columnFiltersState = columnFilters ?? internalColumnFilters
  const columnVisibilityState = columnVisibility ?? internalColumnVisibility
  const rowSelectionState = rowSelection ?? internalRowSelection

  // TanStack Table instance
  const table = useReactTable({
    data,
    columns,
    
    // Core
    getCoreRowModel: getCoreRowModel(),
    
    // Pagination
    ...(enablePagination && {
      getPaginationRowModel: getPaginationRowModel(),
      manualPagination,
      pageCount,
    }),
    
    // Sorting
    ...(enableSorting && {
      getSortedRowModel: getSortedRowModel(),
      manualSorting,
      enableMultiSort,
    }),
    
    // Filtering
    ...(enableGlobalFilter && {
      getFilteredRowModel: getFilteredRowModel(),
      manualFiltering,
      globalFilterFn: 'includesString',
    }),
    
    // State
    state: {
      ...(enablePagination && { pagination: paginationState }),
      ...(enableSorting && { sorting: sortingState }),
      ...(enableGlobalFilter && { globalFilter: globalFilterState }),
      columnFilters: columnFiltersState,
      ...(enableColumnVisibility && { columnVisibility: columnVisibilityState }),
      ...(enableRowSelection && { rowSelection: rowSelectionState }),
    },
    
    // State updaters
    onPaginationChange: onPaginationChange ?? setInternalPagination,
    onSortingChange: onSortingChange ?? setInternalSorting,
    onGlobalFilterChange: onGlobalFilterChange ?? setInternalGlobalFilter,
    onColumnFiltersChange: onColumnFiltersChange ?? setInternalColumnFilters,
    onColumnVisibilityChange: onColumnVisibilityChange ?? setInternalColumnVisibility,
    onRowSelectionChange: onRowSelectionChange ?? setInternalRowSelection,
    
    // Row selection config
    enableRowSelection,
    enableMultiRowSelection,
  })

  // Table content
  const tableContent = (
    <Table className={tableClassName}>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <TableHead
                key={header.id}
                style={{
                  width: header.getSize() !== 150 ? header.getSize() : undefined,
                }}
                className={
                  stickyFirstColumn && header.index === 0
                    ? 'sticky left-0 z-10 bg-background'
                    : stickyLastColumn && header.index === headerGroup.headers.length - 1
                    ? 'sticky right-0 z-10 bg-background'
                    : undefined
                }
              >
                {header.isPlaceholder
                  ? null
                  : flexRender(header.column.columnDef.header, header.getContext())}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {isLoading ? (
          <TableRow>
            <TableCell colSpan={columns.length} className="h-24 text-center">
              {loadingMessage}
            </TableCell>
          </TableRow>
        ) : table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row) => (
            <TableRow
              key={row.id}
              data-state={row.getIsSelected() && 'selected'}
              onClick={() => onRowClick?.(row.original)}
              onDoubleClick={() => onRowDoubleClick?.(row.original)}
              className={onRowClick || onRowDoubleClick ? 'cursor-pointer' : undefined}
            >
              {row.getVisibleCells().map((cell, index) => (
                <TableCell
                  key={cell.id}
                  className={
                    stickyFirstColumn && index === 0
                      ? 'sticky left-0 z-10 bg-background'
                      : stickyLastColumn && index === row.getVisibleCells().length - 1
                      ? 'sticky right-0 z-10 bg-background'
                      : undefined
                  }
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={columns.length} className="h-24 text-center">
              {emptyMessage}
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  )

  return (
    <div className={className}>
      {enableHorizontalScroll ? (
        <ScrollArea className="rounded-md border">
          <div className="relative">{tableContent}</div>
        </ScrollArea>
      ) : (
        <div className="rounded-md border">{tableContent}</div>
      )}
    </div>
  )
}
