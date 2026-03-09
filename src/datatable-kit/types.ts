/**
 * DataTable Kit - Type Definitions
 * 
 * TanStack Table tabanlı veri tablosu tipleri
 */

import type { 
  ColumnDef, 
  RowData,
  PaginationState,
  SortingState,
  ColumnFiltersState,
  VisibilityState,
  RowSelectionState,
  OnChangeFn,
  Table as TanStackTable
} from '@tanstack/react-table'

/**
 * DataTable ana props
 */
export interface DataTableProps<TData = unknown> {
  // Required
  data: TData[]
  columns: ColumnDef<TData, any>[]
  
  // Pagination
  enablePagination?: boolean
  pagination?: PaginationState
  onPaginationChange?: OnChangeFn<PaginationState>
  pageCount?: number
  manualPagination?: boolean
  
  // Sorting
  enableSorting?: boolean
  sorting?: SortingState
  onSortingChange?: OnChangeFn<SortingState>
  manualSorting?: boolean
  enableMultiSort?: boolean
  
  // Filtering
  enableGlobalFilter?: boolean
  globalFilter?: string
  onGlobalFilterChange?: OnChangeFn<string>
  columnFilters?: ColumnFiltersState
  onColumnFiltersChange?: OnChangeFn<ColumnFiltersState>
  manualFiltering?: boolean
  
  // Column Visibility
  enableColumnVisibility?: boolean
  columnVisibility?: VisibilityState
  onColumnVisibilityChange?: OnChangeFn<VisibilityState>
  
  // Row Selection
  enableRowSelection?: boolean | ((row: any) => boolean)
  rowSelection?: RowSelectionState
  onRowSelectionChange?: OnChangeFn<RowSelectionState>
  enableMultiRowSelection?: boolean
  
  // Custom Actions
  renderRowActions?: (row: any) => React.ReactNode
  renderBulkActions?: (selectedRows: any[]) => React.ReactNode
  
  // Toolbar
  showToolbar?: boolean
  showSearch?: boolean
  showColumnSelector?: boolean
  showExcelExport?: boolean
  toolbarClassName?: string
  
  // Table Layout
  enableHorizontalScroll?: boolean
  stickyFirstColumn?: boolean
  stickyLastColumn?: boolean
  enableColumnResizing?: boolean
  
  // Styling
  className?: string
  tableClassName?: string
  
  // Loading & Empty States
  isLoading?: boolean
  emptyMessage?: string
  loadingMessage?: string
  
  // Callbacks
  onRowClick?: (row: any) => void
  onRowDoubleClick?: (row: any) => void
  onTableReady?: (table: TanStackTable<TData>) => void
}

/**
 * Pagination component props
 */
export interface DataTablePaginationProps {
  table: TanStackTable<any>
  pageSizeOptions?: number[]
  showPageInfo?: boolean
  showPageSizeSelector?: boolean
}

/**
 * Column header props
 */
export interface DataTableColumnHeaderProps<TData = unknown> {
  column: any
  title: string
  className?: string
}

/**
 * Toolbar props
 */
export interface DataTableToolbarProps<TData = unknown> {
  table: TanStackTable<TData>
  searchKey?: string
  showSearch?: boolean
  showColumnSelector?: boolean
  showExcelExport?: boolean
  searchPlaceholder?: string
  className?: string
  children?: React.ReactNode
}

/**
 * View options (column visibility) props
 */
export interface DataTableViewOptionsProps<TData = unknown> {
  table: TanStackTable<TData>
  variant?: 'dropdown' | 'popover'
}

/**
 * Bulk actions props
 */
export interface DataTableBulkActionsProps<TData = unknown> {
  table: TanStackTable<TData>
  children?: React.ReactNode
  onDelete?: (rows: TData[]) => void
  onExport?: (rows: TData[]) => void
}

/**
 * Excel export options
 */
export interface ExcelExportOptions {
  filename?: string
  sheetName?: string
  includeHeaders?: boolean
  onlySelected?: boolean
}

/**
 * Faceted filter option
 */
export interface FacetedFilterOption {
  label: string
  value: string
  icon?: React.ComponentType<{ className?: string }>
}

/**
 * Faceted filter props
 */
export interface DataTableFacetedFilterProps<TData, TValue> {
  column?: any
  title?: string
  options: FacetedFilterOption[]
}

/**
 * Excel actions props
 */
export interface DataTableExcelActionsProps<TData> {
  table: TanStackTable<TData>
  filename?: string
  exportSelected?: boolean
  enableImport?: boolean
  onImport?: (data: TData[]) => void
  exportLabel?: string
  importLabel?: string
}

/**
 * Column meta data (custom properties)
 */
declare module '@tanstack/react-table' {
  interface ColumnMeta<TData extends RowData, TValue> {
    // Responsive
    hideBelow?: 'sm' | 'md' | 'lg' | 'xl'
    priority?: number
    
    // Styling
    headerClassName?: string
    cellClassName?: string
    
    // Excel
    excelFormat?: string
    excelWidth?: number
  }
}
