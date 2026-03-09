'use client'

/**
 * Basic DataTable Test Page
 * 
 * Temel DataTable özelliklerini test eder:
 * - Pagination
 * - Sorting
 * - Column visibility
 * - Global search
 */

import React from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { DataTable, DataTableColumnHeader, createSelectionColumn } from '@arftech/arfweb-shared-lib/datatable-kit'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { MoreHorizontal, Eye } from 'lucide-react'
import { mockUsers, type User } from '../data'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export default function BasicDataTableTestPage() {
  const [selectedRows, setSelectedRows] = React.useState<Record<string, boolean>>({})

  // Column definitions
  const columns: ColumnDef<User>[] = [
    createSelectionColumn<User>(),
    {
      accessorKey: 'name',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Name" />
      ),
      cell: ({ row }) => <div className="font-medium">{row.getValue('name')}</div>,
    },
    {
      accessorKey: 'email',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Email" />
      ),
    },
    {
      accessorKey: 'role',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Role" />
      ),
      cell: ({ row }) => {
        const role = row.getValue('role') as string
        return (
          <Badge variant={role === 'Admin' ? 'default' : 'secondary'}>
            {role}
          </Badge>
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
              status === 'Active' 
                ? 'default' 
                : status === 'Pending' 
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
      accessorKey: 'department',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Department" />
      ),
    },
    {
      accessorKey: 'joinDate',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Join Date" />
      ),
      cell: ({ row }) => {
        const date = new Date(row.getValue('joinDate'))
        return date.toLocaleDateString('tr-TR')
      },
    },
    {
      accessorKey: 'salary',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Salary" />
      ),
      cell: ({ row }) => {
        const salary = row.getValue('salary') as number
        return new Intl.NumberFormat('tr-TR', {
          style: 'currency',
          currency: 'TRY',
        }).format(salary)
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const user = row.original

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(user.id)}
              >
                Copy user ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Eye className="mr-2 h-4 w-4" />
                View details
              </DropdownMenuItem>
              <DropdownMenuItem>Edit user</DropdownMenuItem>
              <DropdownMenuItem className="text-red-600">
                Delete user
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  return (
    <div className="container mx-auto py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Basic DataTable Test</h1>
        <p className="text-muted-foreground mt-2">
          Temel özellikler: Pagination, Sorting, Search, Column Visibility
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
          <CardDescription>
            {mockUsers.length} users in the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            data={mockUsers}
            columns={columns}
            enablePagination
            enableSorting
            enableGlobalFilter
            enableColumnVisibility
            enableRowSelection
            rowSelection={selectedRows}
            onRowSelectionChange={setSelectedRows}
            onRowClick={(row) => {
              console.log('Row clicked:', row.original)
            }}
          />
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card>
        <CardHeader>
          <CardTitle>Test Features</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge>✅</Badge>
            <span>Pagination with page size selector</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge>✅</Badge>
            <span>Column sorting (click headers)</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge>✅</Badge>
            <span>Global search filtering</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge>✅</Badge>
            <span>Column visibility toggle</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge>✅</Badge>
            <span>Row selection with checkboxes</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge>✅</Badge>
            <span>Row actions dropdown</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge>✅</Badge>
            <span>Custom cell rendering (badges, currency)</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
