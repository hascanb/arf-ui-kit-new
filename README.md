# ARF UI Kit

Production-ready React UI Kit for modern operational and dashboard applications.

[![Version](https://img.shields.io/npm/v/@hascanb/arf-ui-kit.svg)](https://www.npmjs.com/package/@hascanb/arf-ui-kit)
[![License](https://img.shields.io/npm/l/@hascanb/arf-ui-kit.svg)](https://github.com/hascanb/arf-ui-kit-new/blob/main/LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18+-61dafb.svg)](https://react.dev/)

Security note: DataTable-Kit uses `xlsx`. Review [SECURITY.md](SECURITY.md) before enabling Excel upload/import in production.

## Table of Contents

- [Overview](#overview)
- [Installation](#installation)
- [Global Setup (Recommended)](#global-setup-recommended)
- [Kit Selection Map](#kit-selection-map)
- [Auth-Kit](#auth-kit)
- [DataTable-Kit](#datatable-kit)
- [Form-Kit](#form-kit)
- [File-Kit](#file-kit)
- [Feedback-Kit](#feedback-kit)
- [Errors-Kit](#errors-kit)
- [Layout-Kit](#layout-kit)
- [Release Flow](#release-flow)
- [Links](#links)

## Overview

ARF UI Kit is split into 7 independent modules:

- `auth-kit`: sign-in, OTP, forgot/reset password flow components
- `datatable-kit`: data table with sorting/filtering/pagination/selection/Excel helpers
- `form-kit`: schema-driven forms with Zod + React Hook Form
- `file-kit`: upload widgets with preview, progress, dedupe, RHF integration
- `feedback-kit`: centralized toast notification layer
- `errors-kit`: normalized error handling and level-based actions
- `layout-kit`: dashboard shell components (header/sidebar/footer/layout)

You can import all kits from root:

```tsx
import { AuthKitProvider, DataTable, SchemaForm } from '@hascanb/arf-ui-kit'
```

Or use subpath imports for clear boundaries:

```tsx
import { AuthKitProvider, SignInForm } from '@hascanb/arf-ui-kit/auth-kit'
import { DataTable } from '@hascanb/arf-ui-kit/datatable-kit'
```

## Installation

```bash
npm install @hascanb/arf-ui-kit
```

Required peer dependencies:

```bash
npm install react react-dom
npm install next
npm install react-hook-form zod
npm install lucide-react
npm install tailwindcss
```

Recommended app dependencies (commonly used with this kit):

```bash
npm install @tanstack/react-table sonner class-variance-authority clsx tailwind-merge
```

Next.js recommendation:

```js
// next.config.mjs
const nextConfig = {
  transpilePackages: ['@hascanb/arf-ui-kit'],
}

export default nextConfig
```

Tailwind recommendation:

```js
// tailwind.config.js
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './node_modules/@hascanb/arf-ui-kit/**/*.{js,ts,jsx,tsx}',
  ],
}
```

## Global Setup (Recommended)

In medium/large apps, wire providers once in the root layout.

```tsx
'use client'

import { ReactNode } from 'react'
import {
  AuthKitProvider,
  FeedbackProvider,
  ErrorsKitProvider,
  FormKitProvider,
} from '@hascanb/arf-ui-kit'

const errorMap = {
  'not-found': ({ message }: { message?: string }) => <div>Not found: {message}</div>,
  forbidden: ({ message }: { message?: string }) => <div>Forbidden: {message}</div>,
  'internal-server-error': ({ message }: { message?: string }) => <div>Server error: {message}</div>,
}

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <FeedbackProvider position="top-right" richColors>
      <ErrorsKitProvider
        errorMap={errorMap}
        handlerConfig={{
          onToast: (message) => console.error(message),
          onRedirect: (path) => {
            window.location.href = path
          },
          on401: '/auth/signin',
        }}
      >
        <FormKitProvider
          config={{
            defaultFieldSize: 'default',
            defaultLayout: { columns: 12, gap: 'default' },
          }}
        >
          <AuthKitProvider
            config={{
              onSignIn: async ({ username, password }) => {
                const response = await fetch('/api/auth/signin', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ username, password }),
                })

                if (!response.ok) {
                  return { success: false, error: 'Authentication failed' }
                }

                return { success: true }
              },
              routes: {
                afterSignIn: '/dashboard',
                forgotPassword: '/auth/forgot-password',
                resetPassword: '/auth/reset-password',
                signIn: '/auth/signin',
              },
            }}
          >
            {children}
          </AuthKitProvider>
        </FormKitProvider>
      </ErrorsKitProvider>
    </FeedbackProvider>
  )
}
```

## Kit Selection Map

| Need | Kit | Result |
|---|---|---|
| Sign-in and password flows | `auth-kit` | Authentication pages/forms with callback-based backend integration |
| Advanced data grid | `datatable-kit` | Search/sort/filter/paginate/select table experience |
| Dynamic form generation | `form-kit` | Field config + Zod schema driven forms |
| Upload pipeline | `file-kit` | Upload component with preview and progress |
| User notifications | `feedback-kit` | Centralized success/error/warning/info toasts |
| Unified error policy | `errors-kit` | One error handling contract for all layers |
| Dashboard shell | `layout-kit` | Sidebar/header/footer/content layout primitives |

## Auth-Kit

### What it provides

- `AuthKitProvider` for global auth config
- Forms: `SignInForm`, `OtpForm`, `ForgotPasswordForm`, `ResetPasswordForm`
- Page content blocks: `SignInPageContent`, `SignIn2PageContent`, `OtpPageContent`, `ForgotPasswordPageContent`, `ResetPasswordPageContent`

### Required config

At minimum, pass:

- `onSignIn`
- `routes.afterSignIn`
- `routes.forgotPassword`
- `routes.resetPassword`
- `routes.signIn`

### End-to-end usage

```tsx
'use client'

import { useRouter } from 'next/navigation'
import {
  AuthKitProvider,
  SignInForm,
  OtpForm,
  type SignInCredentials,
} from '@hascanb/arf-ui-kit/auth-kit'

export default function AuthPage() {
  const router = useRouter()

  async function onSignIn(credentials: SignInCredentials) {
    const response = await fetch('/api/auth/signin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    })

    if (!response.ok) {
      return { success: false, error: 'Invalid credentials' }
    }

    const payload = (await response.json()) as { requiresOtp?: boolean }
    return { success: true, requiresOtp: payload.requiresOtp }
  }

  return (
    <AuthKitProvider
      config={{
        onSignIn,
        onOtpVerify: async ({ code, username }) => {
          const res = await fetch('/api/auth/otp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code, username }),
          })
          return res.ok ? { success: true } : { success: false, error: 'OTP failed' }
        },
        routes: {
          afterSignIn: '/dashboard',
          afterOtp: '/dashboard',
          forgotPassword: '/auth/forgot-password',
          resetPassword: '/auth/reset-password',
          signIn: '/auth/signin',
        },
        locale: 'tr',
        maskSensitiveErrors: true,
        sessionTimeout: 30 * 60 * 1000,
        onSessionTimeout: () => router.push('/auth/signin'),
      }}
    >
      <SignInForm onSuccess={() => router.push('/dashboard')} />
      <OtpForm />
    </AuthKitProvider>
  )
}
```

### Production guidance

- Keep `maskSensitiveErrors` enabled.
- Use HTTPS-only cookie/session strategy in backend.
- Clear local auth state on `onSessionTimeout`.
- Add rate limits and lockout policies for OTP routes.

## DataTable-Kit

### What it provides

- Main component: `DataTable`
- Optional building blocks: `DataTableToolbar`, `DataTablePagination`, `DataTableViewOptions`, `DataTableBulkActions`, `DataTableExcelActions`, `DataTableFacetedFilter`
- State hooks: `useDataTableSync`, `useTableUrlState`
- Excel helpers: `exportToExcel`, `importFromExcel`, `validateExcelFile`, `downloadExcelTemplate`

### End-to-end usage

```tsx
'use client'

import { ColumnDef } from '@tanstack/react-table'
import { DataTable, useDataTableSync } from '@hascanb/arf-ui-kit/datatable-kit'

type Order = {
  id: string
  customer: string
  amount: number
  status: 'pending' | 'delivered' | 'canceled'
}

const columns: ColumnDef<Order, unknown>[] = [
  { accessorKey: 'id', header: 'Order ID' },
  { accessorKey: 'customer', header: 'Customer' },
  { accessorKey: 'amount', header: 'Amount' },
  { accessorKey: 'status', header: 'Status' },
]

export function OrdersTable({ data }: { data: Order[] }) {
  const sync = useDataTableSync({
    defaultPagination: { pageIndex: 0, pageSize: 10 },
    searchColumnId: 'id',
    searchDebounceMs: 400,
  })

  return (
    <DataTable
      data={data}
      columns={columns}
      pagination={sync.pagination}
      sorting={sync.sorting}
      columnFilters={sync.columnFilters}
      onPaginationChange={sync.onPaginationChange}
      onSortingChange={sync.onSortingChange}
      onColumnFiltersChange={sync.onColumnFiltersChange}
      enablePagination
      enableSorting
      enableGlobalFilter
      enableColumnVisibility
      enableRowSelection
      showToolbar
      showSearch
      showColumnSelector
      showExcelExport
    />
  )
}
```

### Server-side mode

When data comes from backend paging/filtering:

- Set `manualPagination`, `manualSorting`, `manualFiltering`.
- Pass `pageCount` from backend response.
- Use `onSearchApplied` in `useDataTableSync` to trigger request updates.

### Security guidance (Excel)

- Accept only trusted files.
- Keep strict file size/type/row limits.
- Validate imported data again on backend before persistence.

## Form-Kit

### What it provides

- Components: `SchemaForm`, `FieldRenderer`, `WizardForm`
- Provider: `FormKitProvider`
- Helpers: `buildSchema`, `addRefinements`, `buildField`
- Refinements: `createPasswordConfirmRefine`, `createDateRangeRefine`, `createConditionalRequiredRefine`, `createFieldComparisonRefine`, `createPasswordStrengthRefine`

### End-to-end usage

```tsx
'use client'

import {
  SchemaForm,
  buildSchema,
  addRefinements,
  createPasswordConfirmRefine,
  type FieldConfig,
} from '@hascanb/arf-ui-kit/form-kit'

const fields: FieldConfig[] = [
  {
    type: 'email',
    name: 'email',
    label: 'Email',
    required: true,
    layout: { span: 12 },
  },
  {
    type: 'password',
    name: 'password',
    label: 'Password',
    required: true,
    minLength: 8,
    layout: { span: 6 },
  },
  {
    type: 'password',
    name: 'confirmPassword',
    label: 'Confirm Password',
    required: true,
    minLength: 8,
    layout: { span: 6 },
  },
]

const schema = addRefinements(buildSchema(fields), [
  createPasswordConfirmRefine('password', 'confirmPassword'),
])

export function RegistrationForm() {
  return (
    <SchemaForm
      config={{
        schema,
        fields,
        onSubmit: async (data) => {
          await fetch('/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
          })
        },
        submitButton: {
          label: 'Create Account',
          variant: 'default',
          fullWidth: true,
        },
      }}
      showDescriptions
      showRequired
    />
  )
}
```

### Form-Kit implementation tips

- Build field list from business metadata if your form changes by tenant/role.
- Keep UI-level validation in schema, business validation in backend.
- Use `WizardForm` for long, multi-step forms.
- Use `useAutoSave` for drafts and conflict resolution.

## File-Kit

### What it provides

- `FileUploader` for standalone upload flows
- `RHFFileUploader` for React Hook Form-managed forms
- `toFormData` for nested value to multipart conversion

### Standalone usage

```tsx
'use client'

import { FileUploader, toFormData } from '@hascanb/arf-ui-kit/file-kit'

export function AttachmentUploader() {
  return (
    <FileUploader
      maxFiles={5}
      maxSizeMb={10}
      multiple
      showPreview
      dedupeFiles
      uploadStrategy="sequential"
      onUpload={async (file, onProgress) => {
        onProgress(25)

        const formData = toFormData({
          file,
          module: 'shipment',
          uploadedAt: new Date(),
        })

        await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })

        onProgress(100)
      }}
    />
  )
}
```

### React Hook Form usage

```tsx
'use client'

import { useForm } from 'react-hook-form'
import { RHFFileUploader } from '@hascanb/arf-ui-kit/file-kit'

type FormValues = {
  documents: File[]
}

export function DocumentForm() {
  const { control, handleSubmit } = useForm<FormValues>({
    defaultValues: { documents: [] },
  })

  return (
    <form onSubmit={handleSubmit((values) => console.log(values))}>
      <RHFFileUploader<FormValues>
        control={control}
        name="documents"
        maxFiles={3}
        maxSizeMb={5}
      />
      <button type="submit">Submit</button>
    </form>
  )
}
```

### Upload security checklist

- Validate MIME type and extension on backend.
- Perform virus/malware scan if required by policy.
- Apply role-based access control to upload endpoints.
- Store immutable audit logs for critical document flows.

## Feedback-Kit

### What it provides

- `FeedbackProvider`
- `useFeedback`
- API: `notify`, `success`, `error`, `warning`, `info`

### End-to-end usage

```tsx
'use client'

import { FeedbackProvider, useFeedback } from '@hascanb/arf-ui-kit/feedback-kit'

function SaveButton() {
  const feedback = useFeedback()

  return (
    <button
      onClick={() => {
        feedback.success('Saved', 'Changes have been successfully persisted.')
      }}
    >
      Save
    </button>
  )
}

export function FeedbackDemo() {
  return (
    <FeedbackProvider position="top-right" richColors>
      <SaveButton />
    </FeedbackProvider>
  )
}
```

### Operational tips

- Keep toast messages short and action-oriented.
- Use `error` for user action errors, reserve `warning` for risky but recoverable situations.
- Do not expose sensitive backend payloads in toast descriptions.

## Errors-Kit

### What it provides

- Components: `ErrorRenderer`, `GlobalErrorBoundary`
- Provider: `ErrorsKitProvider`
- Hook: `useErrorHandler`
- Factory: `createErrorHandler`

### End-to-end usage

```tsx
'use client'

import { ErrorsKitProvider, useErrorHandler } from '@hascanb/arf-ui-kit/errors-kit'

const errorMap = {
  'not-found': ({ message }: { message?: string }) => <div>Not found: {message}</div>,
  forbidden: ({ message }: { message?: string }) => <div>Forbidden: {message}</div>,
  'internal-server-error': ({ message }: { message?: string }) => <div>Server error: {message}</div>,
}

function FetchButton() {
  const { handleError } = useErrorHandler()

  return (
    <button
      onClick={async () => {
        try {
          const response = await fetch('/api/resource')
          if (!response.ok) {
            throw { status: response.status, message: 'Request failed' }
          }
        } catch (error) {
          handleError(error)
        }
      }}
    >
      Fetch
    </button>
  )
}

export function ErrorsDemo() {
  return (
    <ErrorsKitProvider
      errorMap={errorMap}
      handlerConfig={{
        onToast: (message) => console.error(message),
        onRedirect: (path) => {
          window.location.href = path
        },
        on401: '/auth/signin',
      }}
    >
      <FetchButton />
    </ErrorsKitProvider>
  )
}
```

### Error policy design guidance

- Define one status-to-slug map and keep it stable.
- Route 401/403 handling through one security policy.
- Log normalized errors centrally for observability.

## Layout-Kit

### What it provides

- Layout components: `DashboardLayout`, `AppHeader`, `AppSidebar`, `AppFooter`, `ThemeProvider`
- Ready navigation data: `basicNavGroups`, `testNavGroups`, `ecommerceNavGroups`, `cargoNavGroups`, `nestedNavGroups`
- Demo data: `exampleBrandData`, `exampleUserData`

### End-to-end usage

```tsx
'use client'

import {
  DashboardLayout,
  basicNavGroups,
  exampleBrandData,
  exampleUserData,
} from '@hascanb/arf-ui-kit/layout-kit'

export function DashboardPage({ children }: { children: React.ReactNode }) {
  return (
    <DashboardLayout
      brand={exampleBrandData}
      user={exampleUserData}
      navGroups={basicNavGroups}
      showSkipToContent
      mainContentId="main-content"
      showFooter
      breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }]}
      onLogout={() => {
        window.location.href = '/auth/signin'
      }}
    >
      {children}
    </DashboardLayout>
  )
}
```

### Layout implementation tips

- Keep navigation data in one typed source.
- Keep `mainContentId` stable for accessibility and skip-links.
- Define role-based nav filtering before passing `navGroups`.

## Release Flow

This repository publishes to npm via GitHub Actions on tag push.

1. Update `package.json` and `CHANGELOG.md`.
2. Commit changes.
3. Push tag:

```bash
git tag vX.Y.Z
git push origin main --tags
```

`publish.yml` triggers on `push.tags: v*`. It can also be manually run from Actions.

## Links

- npm: https://www.npmjs.com/package/@hascanb/arf-ui-kit
- repository: https://github.com/hascanb/arf-ui-kit-new
- demo/deploy: https://arf-ui-kit.vercel.app
- changelog: [CHANGELOG.md](CHANGELOG.md)
- security policy: [SECURITY.md](SECURITY.md)
- license: [LICENSE](LICENSE)
