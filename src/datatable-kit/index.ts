/**
 * DataTable Kit
 * 
 * TanStack Table-based data table components with sorting, filtering, pagination.
 * 
 * @status Sprint 1 Complete (Core Features)
 * @version 0.1.0
 */

// Core component
export { DataTable } from './components/DataTable'

// Sub-components
export { DataTablePagination } from './components/DataTablePagination'
export { DataTableColumnHeader } from './components/DataTableColumnHeader'
export { DataTableToolbar } from './components/DataTableToolbar'
export { DataTableViewOptions } from './components/DataTableViewOptions'
export { DataTableBulkActions } from './components/DataTableBulkActions'

// Utilities
export { createSelectionColumn } from './components/SelectionColumn'

// Types
export type {
  DataTableProps,
  DataTablePaginationProps,
  DataTableColumnHeaderProps,
  DataTableToolbarProps,
  DataTableViewOptionsProps,
  DataTableBulkActionsProps,
  ExcelExportOptions,
} from './types'

export const DATATABLE_KIT_VERSION = '0.1.0'
