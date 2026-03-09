import type { Meta, StoryObj } from '@storybook/react';
import { DataTable } from '../../src/datatable-kit/components/DataTable';
import { ColumnDef } from '@tanstack/react-table';

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
  createdAt: string;
};

const sampleData: User[] = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    role: 'Admin',
    status: 'active',
    createdAt: '2026-01-15',
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'User',
    status: 'active',
    createdAt: '2026-02-10',
  },
  {
    id: 3,
    name: 'Bob Johnson',
    email: 'bob@example.com',
    role: 'User',
    status: 'inactive',
    createdAt: '2026-03-05',
  },
  {
    id: 4,
    name: 'Alice Williams',
    email: 'alice@example.com',
    role: 'Moderator',
    status: 'active',
    createdAt: '2026-01-20',
  },
  {
    id: 5,
    name: 'Charlie Brown',
    email: 'charlie@example.com',
    role: 'User',
    status: 'active',
    createdAt: '2026-02-28',
  },
];

const columns: ColumnDef<User, any>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    size: 60,
  },
  {
    accessorKey: 'name',
    header: 'Name',
    size: 150,
  },
  {
    accessorKey: 'email',
    header: 'Email',
    size: 200,
  },
  {
    accessorKey: 'role',
    header: 'Role',
    size: 120,
  },
  {
    accessorKey: 'status',
    header: 'Status',
    size: 100,
    cell: ({ getValue }) => {
      const status = getValue() as string;
      return (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            status === 'active'
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
              : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
          }`}
        >
          {status}
        </span>
      );
    },
  },
  {
    accessorKey: 'createdAt',
    header: 'Created At',
    size: 120,
  },
];

const meta: Meta<typeof DataTable> = {
  title: 'DataTable-Kit/DataTable',
  component: DataTable,
  decorators: [
    (Story) => (
      <div className="min-h-screen p-8 bg-background">
        <div className="max-w-6xl mx-auto">
          <Story />
        </div>
      </div>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof DataTable>;

export const Default: Story = {
  args: {
    data: sampleData,
    columns: columns as ColumnDef<unknown, any>[],
  },
};

export const WithSearch: Story = {
  args: {
    data: sampleData,
    columns: columns as ColumnDef<unknown, any>[],
    enableSearch: true,
    searchPlaceholder: 'Search users...',
  },
};

export const WithSorting: Story = {
  args: {
    data: sampleData,
    columns: columns as ColumnDef<unknown, any>[],
    enableSorting: true,
  },
};

export const WithFiltering: Story = {
  args: {
    data: sampleData,
    columns: columns as ColumnDef<unknown, any>[],
    enableColumnFilters: true,
  },
};

export const WithPagination: Story = {
  args: {
    data: Array.from({ length: 50 }, (_, i) => ({
      id: i + 1,
      name: `User ${i + 1}`,
      email: `user${i + 1}@example.com`,
      role: i % 3 === 0 ? 'Admin' : i % 2 === 0 ? 'Moderator' : 'User',
      status: (i % 4 === 0 ? 'inactive' : 'active') as 'active' | 'inactive',
      createdAt: `2026-0${(i % 9) + 1}-${String((i % 28) + 1).padStart(2, '0')}`,
    })),
    columns: columns as ColumnDef<unknown, any>[],
    enablePagination: true,
    pageSize: 10,
  },
};

export const WithExport: Story = {
  args: {
    data: sampleData,
    columns: columns as ColumnDef<unknown, any>[],
    enableExport: true,
    exportFileName: 'users',
  },
};

export const FullFeatured: Story = {
  args: {
    data: Array.from({ length: 50 }, (_, i) => ({
      id: i + 1,
      name: `User ${i + 1}`,
      email: `user${i + 1}@example.com`,
      role: i % 3 === 0 ? 'Admin' : i % 2 === 0 ? 'Moderator' : 'User',
      status: (i % 4 === 0 ? 'inactive' : 'active') as 'active' | 'inactive',
      createdAt: `2026-0${(i % 9) + 1}-${String((i % 28) + 1).padStart(2, '0')}`,
    })),
    columns: columns as ColumnDef<unknown, any>[],
    enableSearch: true,
    enableSorting: true,
    enableColumnFilters: true,
    enablePagination: true,
    enableExport: true,
    pageSize: 10,
    searchPlaceholder: 'Search users...',
    exportFileName: 'users-export',
  },
};

export const Empty: Story = {
  args: {
    data: [],
    columns: columns as ColumnDef<unknown, any>[],
    emptyMessage: 'No users found',
  },
};

export const Loading: Story = {
  args: {
    data: sampleData,
    columns: columns as ColumnDef<unknown, any>[],
    isLoading: true,
  },
};
