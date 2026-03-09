'use client'

/**
 * Advanced DataTable Test Page
 * 
 * Gelişmiş DataTable özelliklerini test eder:
 * - Toolbar with search
 * - Bulk actions
 * - Sticky columns
 * - Loading states
 * - Empty states
 */

import React from 'react'
import { ColumnDef, Table as TanStackTable } from '@tanstack/react-table'
import {
  DataTable,
  DataTableColumnHeader,
  DataTableToolbar,
  DataTablePagination,
  DataTableBulkActions,
  DataTableFacetedFilter,
  DataTableExcelActions,
  createSelectionColumn,
} from '@arftech/arfweb-shared-lib/datatable-kit'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Download, Trash2, RefreshCw } from 'lucide-react'
import { mockProducts, type Product } from '../data'
import { toast } from 'sonner'

export default function AdvancedDataTableTestPage() {
  const [data, setData] = React.useState<Product[]>(mockProducts)
  const [isLoading, setIsLoading] = React.useState(false)
  const [rowSelection, setRowSelection] = React.useState<Record<string, boolean>>({})
  const [table, setTable] = React.useState<TanStackTable<Product> | null>(null)

  // Faceted filter options
  const categoryOptions = [
    { label: 'Laptop', value: 'Laptop' },
    { label: 'Smartphone', value: 'Smartphone' },
    { label: 'Tablet', value: 'Tablet' },
    { label: 'Accessory', value: 'Accessory' },
  ]

  const statusOptions = [
    { label: 'In Stock', value: 'In Stock' },
    { label: 'Low Stock', value: 'Low Stock' },
    { label: 'Out of Stock', value: 'Out of Stock' },
  ]

  const brandOptions = [
    { label: 'Apple', value: 'Apple' },
    { label: 'Samsung', value: 'Samsung' },
    { label: 'Dell', value: 'Dell' },
    { label: 'Sony', value: 'Sony' },
    { label: 'LG', value: 'LG' },
  ]

  // Simulate loading
  const handleRefresh = () => {
    setIsLoading(true)
    setData([])
    setTimeout(() => {
      setData(mockProducts)
      setIsLoading(false)
      toast.success('Data refreshed successfully')
    }, 1500)
  }

  // Simulate bulk delete
  const handleBulkDelete = (selectedRows: Product[]) => {
    const ids = selectedRows.map((row) => row.id)
    setData((prev) => prev.filter((item) => !ids.includes(item.id)))
    setRowSelection({})
    toast.success(`Deleted ${selectedRows.length} products`)
  }

  // Simulate bulk export
  const handleBulkExport = (selectedRows: Product[]) => {
    console.log('Exporting:', selectedRows)
    toast.success(`Exported ${selectedRows.length} products`)
  }

  // Handle Excel import
  const handleImport = (importedData: Product[]) => {
    setData(importedData)
    toast.success(`Data imported successfully`)
  }

  // Column definitions with sticky first/last columns
  const columns: ColumnDef<Product>[] = [
    createSelectionColumn<Product>(),
    {
      accessorKey: 'id',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Product ID" />
      ),
      cell: ({ row }) => (
        <div className="font-mono text-xs">{row.getValue('id')}</div>
      ),
    },
    {
      accessorKey: 'name',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Product Name" />
      ),
      cell: ({ row }) => (
        <div className="font-medium min-w-[200px]">{row.getValue('name')}</div>
      ),
    },
    {
      accessorKey: 'category',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Category" />
      ),
    },
    {
      accessorKey: 'brand',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Brand" />
      ),
    },
    {
      accessorKey: 'price',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Price" />
      ),
      cell: ({ row }) => {
        const price = row.getValue('price') as number
        return (
          <div className="font-semibold">
            {new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
            }).format(price)}
          </div>
        )
      },
    },
    {
      accessorKey: 'stock',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Stock" />
      ),
      cell: ({ row }) => {
        const stock = row.getValue('stock') as number
        return (
          <div className={stock === 0 ? 'text-red-600' : stock < 10 ? 'text-orange-600' : ''}>
            {stock} units
          </div>
        )
      },
    },
    {
      accessorKey: 'status',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
      cell: ({ row }) => {
        const status = row.getValue('status') as string
        return (
          <Badge
            variant={
              status === 'In Stock'
                ? 'default'
                : status === 'Low Stock'
                ? 'outline'
                : 'destructive'
            }
          >
            {status}
          </Badge>
        )
      },
    },
    {
      accessorKey: 'rating',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Rating" />
      ),
      cell: ({ row }) => {
        const rating = row.getValue('rating') as number
        return (
          <div className="flex items-center gap-1">
            <span className="text-yellow-500">★</span>
            <span>{rating.toFixed(1)}</span>
          </div>
        )
      },
    },
  ]

  return (
    <div className="container mx-auto py-10 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Advanced DataTable Test</h1>
          <p className="text-muted-foreground mt-2">
            Gelişmiş özellikler: Toolbar, Bulk Actions, Sticky Columns, Loading States
          </p>
        </div>
        <Button onClick={handleRefresh} variant="outline">
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh Data
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Product Inventory</CardTitle>
          <CardDescription>
            Manage your product catalog with advanced features
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Custom Toolbar */}
          {table && (
            <div className="flex items-center justify-between gap-2">
              <div className="flex flex-1 items-center gap-2">
                <DataTableToolbar
                  table={table}
                  searchKey="name"
                  searchPlaceholder="Search products..."
                >
                  {/* Faceted Filters */}
                  <DataTableFacetedFilter
                    column={table.getColumn('category')}
                    title="Category"
                    options={categoryOptions}
                  />
                  <DataTableFacetedFilter
                    column={table.getColumn('status')}
                    title="Status"
                    options={statusOptions}
                  />
                  <DataTableFacetedFilter
                    column={table.getColumn('brand')}
                    title="Brand"
                    options={brandOptions}
                  />
                </DataTableToolbar>
              </div>
              
              {/* Excel Actions */}
              <DataTableExcelActions
                table={table}
                filename="products-export"
                exportSelected={false}
                enableImport={true}
                onImport={handleImport}
              />
            </div>
          )}

          {/* DataTable with Advanced Features */}
          <DataTable
            data={data}
            columns={columns}
            // Pagination
            enablePagination
            // Sorting
            enableSorting
            enableMultiSort
            // Filtering
            enableGlobalFilter
            // Selection
            enableRowSelection
            enableMultiRowSelection
            rowSelection={rowSelection}
            onRowSelectionChange={setRowSelection}
            // Layout
            enableHorizontalScroll
            stickyFirstColumn
            stickyLastColumn
            // States
            isLoading={isLoading}
            loadingMessage="Loading products..."
            emptyMessage="No products found. Try adjusting your filters."
            // Expose table instance
            onTableReady={setTable}
          />

          {/* Pagination */}
          {table && (
            <DataTablePagination
              table={table}
              pageSizeOptions={[5, 10, 20, 50]}
            />
          )}

          {/* Bulk Actions */}
          {table && Object.keys(rowSelection).length > 0 && (
            <DataTableBulkActions
              table={table}
              onDelete={(rows) => handleBulkDelete(rows as Product[])}
            >
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const selected = data.filter((_, i) => rowSelection[i])
                  handleBulkExport(selected)
                }}
              >
                <Download className="mr-2 h-4 w-4" />
                Export Selected
              </Button>
            </DataTableBulkActions>
          )}
        </CardContent>
      </Card>

      {/* Feature Info */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Layout Features</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <Badge variant="outline">Horizontal Scroll</Badge>
              <span>Table scrolls horizontally when content overflows</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">Sticky Columns</Badge>
              <span>First and last columns stay fixed during scroll</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">Responsive</Badge>
              <span>Adapts to different screen sizes</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Interaction Features</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <Badge variant="outline">Bulk Actions</Badge>
              <span>Perform actions on selected rows</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">Loading States</Badge>
              <span>Graceful loading animations</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">Empty States</Badge>
              <span>User-friendly empty state messages</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
