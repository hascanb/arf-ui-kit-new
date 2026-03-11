'use client'

/**
 * DataTable - Main Component
 * 
 * TanStack Table tabanlı, feature-rich veri tablosu bileşeni
 */

import React, { useMemo, useRef } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getExpandedRowModel,
  flexRender,
  type ColumnDef,
  type ColumnFiltersState,
  type ExpandedState,
  type Row,
  type SortingState,
} from '@tanstack/react-table'
import { useVirtualizer } from '@tanstack/react-virtual'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
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
  virtualized = false,
  tableHeight = 480,
  estimateRowHeight = 52,
  overscan = 8,
  stickyFirstColumn = false,
  stickyLastColumn = false,

  // Advanced rows
  renderRowActions,
  renderSubComponent,
  expandOnRowClick = false,
  allowVirtualizedExpansion = false,
  
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
  onTableReady,
}: DataTableProps<TData>) {
  // Internal state management
  const [internalPagination, setInternalPagination] = React.useState<{
    pageIndex: number
    pageSize: number
  }>({
    pageIndex: 0,
    pageSize: 10,
  })
  
  const [internalSorting, setInternalSorting] = React.useState<SortingState>([])
  const [internalGlobalFilter, setInternalGlobalFilter] = React.useState('')
  const [internalColumnFilters, setInternalColumnFilters] = React.useState<ColumnFiltersState>([])
  const [internalColumnVisibility, setInternalColumnVisibility] = React.useState<Record<string, boolean>>({})
  const [internalRowSelection, setInternalRowSelection] = React.useState<Record<string, boolean>>({})
  const [internalExpanded, setInternalExpanded] = React.useState<ExpandedState>({})

  const tableContainerRef = useRef<HTMLDivElement>(null)

  // Use controlled or internal state
  const paginationState = pagination ?? internalPagination
  const sortingState = sorting ?? internalSorting
  const globalFilterState = globalFilter ?? internalGlobalFilter
  const columnFiltersState = columnFilters ?? internalColumnFilters
  const columnVisibilityState = columnVisibility ?? internalColumnVisibility
  const rowSelectionState = rowSelection ?? internalRowSelection
  const canRenderExpandedRows = !!renderSubComponent && (!virtualized || allowVirtualizedExpansion)

  const computedColumns = useMemo<ColumnDef<TData, unknown>[]>(() => {
    if (!renderRowActions) {
      return columns as ColumnDef<TData, unknown>[]
    }

    return [
      ...(columns as ColumnDef<TData, unknown>[]),
      {
        id: '__inline_actions__',
        header: 'Actions',
        cell: ({ row }) => renderRowActions(row.original),
      },
    ]
  }, [columns, renderRowActions])

  // TanStack Table instance
  const table = useReactTable<TData>({
    data,
    columns: computedColumns,
    
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
      getFacetedRowModel: getFacetedRowModel(),
      getFacetedUniqueValues: getFacetedUniqueValues(),
      manualFiltering,
      globalFilterFn: 'includesString',
    }),

    ...(canRenderExpandedRows && {
      getExpandedRowModel: getExpandedRowModel(),
      enableExpanding: true,
      getRowCanExpand: () => true,
    }),
    
    // State
    state: {
      ...(enablePagination && { pagination: paginationState }),
      ...(enableSorting && { sorting: sortingState }),
      ...(enableGlobalFilter && { globalFilter: globalFilterState }),
      columnFilters: columnFiltersState,
      ...(enableColumnVisibility && { columnVisibility: columnVisibilityState }),
      ...(enableRowSelection && { rowSelection: rowSelectionState }),
      ...(canRenderExpandedRows && { expanded: internalExpanded }),
    },
    
    // State updaters
    onPaginationChange: onPaginationChange ?? setInternalPagination,
    onSortingChange: onSortingChange ?? setInternalSorting,
    onGlobalFilterChange: onGlobalFilterChange ?? setInternalGlobalFilter,
    onColumnFiltersChange: onColumnFiltersChange ?? setInternalColumnFilters,
    onColumnVisibilityChange: onColumnVisibilityChange ?? setInternalColumnVisibility,
    onRowSelectionChange: onRowSelectionChange ?? setInternalRowSelection,
    ...(canRenderExpandedRows && { onExpandedChange: setInternalExpanded }),
    
    // Row selection config
    enableRowSelection,
    enableMultiRowSelection,
  })

  // Expose table instance to parent
  React.useEffect(() => {
    if (onTableReady) {
      onTableReady(table)
    }
  }, [table, onTableReady])

  React.useEffect(() => {
    if (process.env.NODE_ENV !== 'production' && virtualized && renderSubComponent && !allowVirtualizedExpansion) {
      console.warn(
        'DataTable: expanded sub-rows are disabled while virtualization is enabled unless allowVirtualizedExpansion is explicitly set to true.'
      )
    }
  }, [allowVirtualizedExpansion, renderSubComponent, virtualized])

  const rows = table.getRowModel().rows

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => tableContainerRef.current,
    estimateSize: () => estimateRowHeight,
    overscan,
  })

  const virtualRows = virtualized ? rowVirtualizer.getVirtualItems() : []
  const totalVirtualSize = virtualized ? rowVirtualizer.getTotalSize() : 0
  const paddingTop = virtualized && virtualRows.length > 0 ? virtualRows[0].start : 0
  const paddingBottom =
    virtualized && virtualRows.length > 0
      ? totalVirtualSize - virtualRows[virtualRows.length - 1].end
      : 0

  const hasInteractiveRow = !!onRowClick || !!onRowDoubleClick || (expandOnRowClick && canRenderExpandedRows)

  const renderMainRow = (row: Row<TData>) => (
    <React.Fragment key={row.id}>
      <TableRow
        data-state={row.getIsSelected() && 'selected'}
        onClick={() => {
          if (canRenderExpandedRows && expandOnRowClick) {
            row.toggleExpanded()
          }
          onRowClick?.(row.original)
        }}
        onDoubleClick={() => onRowDoubleClick?.(row.original)}
        className={hasInteractiveRow ? 'cursor-pointer' : undefined}
      >
        {row.getVisibleCells().map((cell, index: number) => (
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

      {canRenderExpandedRows && row.getIsExpanded() && (
        <TableRow>
          <TableCell colSpan={row.getVisibleCells().length} className="bg-muted/40">
            {renderSubComponent(row.original)}
          </TableCell>
        </TableRow>
      )}
    </React.Fragment>
  )

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
            <TableCell colSpan={computedColumns.length} className="h-24 text-center">
              {loadingMessage}
            </TableCell>
          </TableRow>
        ) : rows?.length ? (
          virtualized ? (
            <>
              {paddingTop > 0 && (
                <TableRow>
                  <TableCell colSpan={computedColumns.length} style={{ height: `${paddingTop}px` }} />
                </TableRow>
              )}

              {virtualRows.map((virtualRow) => {
                const row = rows[virtualRow.index]
                return row ? renderMainRow(row) : null
              })}

              {paddingBottom > 0 && (
                <TableRow>
                  <TableCell colSpan={computedColumns.length} style={{ height: `${paddingBottom}px` }} />
                </TableRow>
              )}
            </>
          ) : (
            rows.map((row) => renderMainRow(row))
          )
        ) : (
          <TableRow>
            <TableCell colSpan={computedColumns.length} className="h-24 text-center">
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
          <div className="relative min-w-max" ref={virtualized ? tableContainerRef : undefined} style={virtualized ? { maxHeight: tableHeight, overflowY: 'auto' } : undefined}>
            {tableContent}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      ) : (
        <div className="rounded-md border" ref={virtualized ? tableContainerRef : undefined} style={virtualized ? { maxHeight: tableHeight, overflowY: 'auto' } : undefined}>
          {tableContent}
        </div>
      )}
    </div>
  )
}
