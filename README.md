# ARF UI Kit

> Production-ready React UI Kit with comprehensive components for modern web applications

[![Version](https://img.shields.io/npm/v/@hascanb/arf-ui-kit.svg)](https://www.npmjs.com/package/@hascanb/arf-ui-kit)
[![License](https://img.shields.io/npm/l/@hascanb/arf-ui-kit.svg)](https://github.com/arftech/arf-ui-kit/blob/main/LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18+-61dafb.svg)](https://reactjs.org/)

> ⚠️ **Security Notice:** DataTable-Kit uses `xlsx` library which has known vulnerabilities. See [SECURITY.md](SECURITY.md) for details and mitigation strategies.

## 📦 What's Included

ARF UI Kit provides 7 specialized kits for building modern web applications:

- 🔐 **[Auth-Kit](#auth-kit)** - Authentication forms and flows (Sign In, OTP, Password Reset)
- 📊 **[DataTable-Kit](#datatable-kit)** - Advanced data tables with sorting, filtering, Excel export
- 📝 **[Form-Kit](#form-kit)** - Schema-driven forms with Zod validation
- 📁 **[File-Kit](#file-kit)** - File upload workflows with preview, progress, and RHF integration
- 🔔 **[Feedback-Kit](#feedback-kit)** - Centralized toast and in-app feedback orchestration
- ❌ **[Errors-Kit](#errors-kit)** - Centralized error handling with level-based actions
- 🎨 **[Layout-Kit](#layout-kit)** - Dashboard layouts, headers, sidebars, footers

## 🏗️ Uygulama Mimarisi (Cargo / Test Hub)

Bu repodaki Next.js uygulaması iki ayrı çalışma alanına ayrılmıştır:

- **Cargo Workspace (`/cargo`)**: Operasyonel ekranlar — sevkiyat oluşturma, müşteri, şube, finans ve raporlama.
- **Test & Docs Hub (`/test`)**: Kit doğrulama, canlı demo, API referansları ve erişilebilirlik panelleri.
- **Giriş Seçici (`/`)**: Kullanıcıyı bilinçli olarak iki çalışma alanından birine yönlendirir.

### Information Architecture

```mermaid
flowchart TD
  A[/ / Entry Chooser] --> B[/cargo / Cargo Workspace]
  A --> C[/test / Test & Docs Hub]

  B --> B1[/cargo/shipments]
  B --> B2[/cargo/customers]
  B --> B3[/cargo/branches]
  B --> B4[/cargo/reports]
  B --> B5[/cargo/finance]

  C --> C1[/test/auth]
  C --> C2[/test/datatable]
  C --> C3[/test/layout-kit]
  C --> C4[/test/form]
  C --> C5[/test/file-uploader]
  C --> C6[/test/errors]
  C --> C7[/test/feedback]
  C --> C8[/test/gallery]
  C --> C9[/test/a11y]
  C --> C10[/test/benchmarks]
```

### Cargo Workspace Rehberi

- Odak: Kargo oluşturma, listeleme, takip ve raporlama.
- Hedef URL: `http://localhost:3000/cargo`
- Başlangıç akışları:
  - Yeni kargo: `/cargo/shipments/new`
  - Takip: `/cargo/shipments/track`
  - Raporlar: `/cargo/reports`

### Test & Docs Hub Rehberi

- Odak: Kit bazlı demo, API referansları ve test senaryoları.
- Hedef URL: `http://localhost:3000/test`
- Kritik sayfalar:
  - DataTable genel bakış: `/test/datatable`
  - Layout Kit genel bakış: `/test/layout-kit`
  - Bileşen galerisi: `/test/gallery`
  - A11y paneli: `/test/a11y`
  - Benchmark paneli: `/test/benchmarks`

## 🚀 Installation

```bash
npm install @hascanb/arf-ui-kit
# or
yarn add @hascanb/arf-ui-kit
# or
pnpm add @hascanb/arf-ui-kit
```

### Peer Dependencies

```bash
npm install react react-dom next
npm install @radix-ui/react-* lucide-react
npm install @tanstack/react-table
npm install react-hook-form zod
npm install tailwindcss class-variance-authority clsx tailwind-merge
```

## 📚 Documentation

### Auth-Kit

Complete authentication UI components with i18n support.

#### Features
- ✅ 4 form components (SignIn, ForgotPassword, ResetPassword, OTP)
- ✅ 5 page layouts (single/split column)
- ✅ OAuth integration (Google, Apple)
- ✅ i18n support (en/tr)
- ✅ Zod validation
- ✅ Session timeout contract (`sessionTimeout`, `onSessionTimeout`)
- ✅ Sensitive backend error masking (`maskSensitiveErrors`, default: `true`)

#### Quick Start

```tsx
import { SignInForm, AuthKitProvider } from '@hascanb/arf-ui-kit/auth-kit'

function App() {
  return (
    <AuthKitProvider
      config={{
        apiBaseUrl: 'https://api.example.com',
        maskSensitiveErrors: true,
        sessionTimeout: 30 * 60 * 1000,
        onSessionTimeout: () => {
          // clear session and redirect login
          router.push('/auth/signin')
        },
        onSuccess: (data) => console.log('Success:', data),
        onError: (error) => console.error('Error:', error),
      }}
    >
      <SignInForm
        enableRememberMe
        enableSocialLogin
        onForgotPassword={() => navigate('/forgot-password')}
      />
    </AuthKitProvider>
  )
}
```

#### Components

- `SignInForm` - Email/password with social login
- `ForgotPasswordForm` - Email validation
- `ResetPasswordForm` - Password strength validation
- `OtpForm` - 6-digit verification
- Page layouts: `SignInPageContent`, `SignIn2PageContent`, etc.

---

### DataTable-Kit

Advanced data tables with TanStack Table v8.

#### Features
- ✅ Sorting, filtering, pagination
- ✅ Row selection (single/bulk)
- ✅ Column visibility
- ✅ Excel import/export
- ✅ Excel import security controls (size/mime/rows/columns/trusted source confirmation)
- ✅ URL state synchronization
- ✅ Faceted filters
- ✅ Server-side pagination support

#### Quick Start

```tsx
'use client'

import { DataTable, useDataTableSync } from '@hascanb/arf-ui-kit/datatable-kit'
import { ColumnDef } from '@tanstack/react-table'

interface Payment {
  id: string
  amount: number
  status: 'pending' | 'success' | 'failed'
}

const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
  },
  {
    accessorKey: 'amount',
    header: 'Amount',
  },
  {
    accessorKey: 'status',
    header: 'Status',
  },
]

function PaymentsTable({ data }: { data: Payment[] }) {
  const sync = useDataTableSync({
    defaultPagination: { pageIndex: 0, pageSize: 10 },
    searchColumnId: 'id',
    searchDebounceMs: 400,
  })

  return (
    <DataTable
      columns={columns}
      data={data}
      pagination={sync.pagination}
      sorting={sync.sorting}
      columnFilters={sync.columnFilters}
      onPaginationChange={sync.onPaginationChange}
      onSortingChange={sync.onSortingChange}
      onColumnFiltersChange={sync.onColumnFiltersChange}
      enableFiltering
      enableSorting
      enableRowSelection
    />
  )
}
```

#### Components

- `DataTable` - Main table component
- `DataTablePagination` - Pagination controls
- `DataTableToolbar` - Search, filters, actions
- `DataTableColumnHeader` - Sortable headers
- `DataTableViewOptions` - Column visibility
- `DataTableBulkActions` - Mass operations
- `DataTableExcelActions` - Excel import/export
- `SelectionColumn` - Checkbox helper

#### Hooks & Utils

- `useDataTableSync` - URL query sync, debounced search state, and server-side friendly table coordination
- `useTableUrlState` - Low-level URL state sync helper
- `excel.ts` - Excel export/import/template/validate
- `get-page-numbers.ts` - Pagination helpers

#### Security Notes (Excel)

- Import only trusted files
- Keep legacy `.xls` disabled unless you absolutely need it
- Apply strict size and row limits in UI and server
- Always run server-side validation before persistence

---

### File-Kit

File upload bileşenleri with preview, dedupe, upload states and RHF integration.

#### Quick Start

```tsx
import { FileUploader, toFormData } from '@hascanb/arf-ui-kit/file-kit'

function FileDemo() {
  return (
    <FileUploader
      maxFiles={5}
      maxSizeMb={5}
      uploadStrategy="sequential"
      dedupeFiles
      onUpload={async (file, onProgress) => {
        onProgress(35)
        const formData = toFormData({ file, module: 'profile' })
        await fetch('/api/upload', { method: 'POST', body: formData })
        onProgress(100)
      }}
    />
  )
}
```

---

### Feedback-Kit

Sonner tabanlı merkezi bildirim katmanı.

#### Quick Start

```tsx
import { FeedbackProvider, useFeedback } from '@hascanb/arf-ui-kit/feedback-kit'

function SaveButton() {
  const feedback = useFeedback()

  return (
    <button onClick={() => feedback.success('Kaydedildi', 'Değişiklikleriniz başarıyla kaydedildi.')}>
      Kaydet
    </button>
  )
}

function App() {
  return (
    <FeedbackProvider>
      <SaveButton />
    </FeedbackProvider>
  )
}
```

---

### Form-Kit

Schema-driven form generation with Zod validation.

#### Features
- ✅ 10 field types (text, email, password, number, textarea, select, combobox, checkbox, radio, date, file, custom)
- ✅ Schema-driven generation
- ✅ Zod validation integration
- ✅ Cross-field validation
- ✅ Layout system (1-12 columns)
- ✅ Type-safe configurations

#### Quick Start

```tsx
import { SchemaForm, FieldConfig, buildSchema } from '@hascanb/arf-ui-kit/form-kit'

const fields: FieldConfig[] = [
  {
    name: 'email',
    type: 'email',
    label: 'Email Address',
    required: true,
    layout: { span: 12 },
  },
  {
    name: 'password',
    type: 'password',
    label: 'Password',
    required: true,
    minLength: 8,
    layout: { span: 12 },
  },
]

const schema = buildSchema(fields)

function RegistrationForm() {
  const handleSubmit = async (data: any) => {
    console.log('Form data:', data)
  }

  return (
    <SchemaForm
      config={{
        schema,
        fields,
        layout: { columns: 12, gap: 'lg' },
        submitButton: { label: 'Register', variant: 'default' },
        onSubmit: handleSubmit,
      }}
    />
  )
}
```

#### Field Types

| Type | Description | Validation |
|------|-------------|------------|
| `text` | Text input | minLength, maxLength, pattern |
| `email` | Email input | Email validation |
| `password` | Password input | minLength, strength |
| `number` | Number input | min, max |
| `textarea` | Multi-line text | minLength, maxLength, rows |
| `select` | Dropdown select | Options, searchable |
| `combobox` | Searchable select | Options, search |
| `checkbox` | Single checkbox | Boolean |
| `radio` | Radio group | Options |
| `date` | Date picker | minDate, maxDate |
| `file` | File upload | accept, multiple |
| `custom` | Custom render | - |

#### Cross-Field Validation

```tsx
import { 
  addRefinements, 
  createPasswordConfirmRefine,
  createDateRangeRefine 
} from '@hascanb/arf-ui-kit/form-kit'

const schema = addRefinements(buildSchema(fields), [
  createPasswordConfirmRefine('password', 'confirmPassword'),
  createDateRangeRefine('startDate', 'endDate'),
])
```

**Available Refinements:**
- `createPasswordStrengthRefine` - Password strength validation
- `createPasswordConfirmRefine` - Password confirmation
- `createDateRangeRefine` - Date range validation
- `createConditionalRequiredRefine` - Conditional required fields
- `createFieldComparisonRefine` - Field comparison
- `createMinMaxRefine` - Min/max value validation

---

### Errors-Kit

Centralized error handling with level-based actions.

#### Features
- ✅ 4 error levels (low, medium, high, critical)
- ✅ Level-based actions (toast, redirect, reload, modal)
- ✅ Error normalization (Axios, Fetch, Custom)
- ✅ Status to level mapping
- ✅ Special 401 handling
- ✅ Dynamic error pages

#### Quick Start

```tsx
import { 
  ErrorsKitProvider, 
  useErrorHandler,
  ErrorRenderer 
} from '@hascanb/arf-ui-kit/errors-kit'

// Error page components
const errorMap = {
  'not-found': NotFoundPage,
  'unauthorized': UnauthorizedPage,
  'forbidden': ForbiddenPage,
  'internal-server-error': ServerErrorPage,
}

function App() {
  return (
    <ErrorsKitProvider
      errorMap={errorMap}
      handlerConfig={{
        onToast: (msg) => toast.error(msg),
        onRedirect: (path) => router.push(path),
        on401: '/login',
      }}
    >
      <YourApp />
    </ErrorsKitProvider>
  )
}

// In components
function MyComponent() {
  const { handleError } = useErrorHandler()

  const fetchData = async () => {
    try {
      await apiCall()
    } catch (error) {
      handleError(error) // Auto-handled based on level
    }
  }

  return <button onClick={fetchData}>Fetch</button>
}
```

#### Error Levels

| Level | Action | Use Case |
|-------|--------|----------|
| `low` | Toast | Minor validation errors |
| `medium` | Toast | Request timeouts, 400 errors |
| `high` | Redirect | 401, 403, 404 errors |
| `critical` | Modal | 500, 503 server errors |

#### Custom Handler

```tsx
import { createErrorHandler } from '@hascanb/arf-ui-kit/errors-kit'

const handler = createErrorHandler({
  levelForStatus: {
    400: 'medium',
    401: 'high',
    403: 'high',
    404: 'high',
    500: 'critical',
  },
  onToast: (message) => toast.error(message),
  onRedirect: (path) => navigate(path),
  on401: () => {
    localStorage.removeItem('token')
    navigate('/login')
  },
})

handler.handleError(error)
```

---

### Layout-Kit

Dashboard layouts with responsive design.

#### Features
- ✅ Responsive dashboard layout
- ✅ Collapsible sidebar
- ✅ Sticky header
- ✅ Footer with links
- ✅ Breadcrumb support
- ✅ Navigation presets

#### Quick Start

```tsx
import { 
  DashboardLayout,
  basicNavGroups,
  exampleBrandData,
  exampleUserData,
} from '@hascanb/arf-ui-kit/layout-kit'

function App() {
  return (
    <DashboardLayout
      brand={exampleBrandData}
      user={exampleUserData}
      navGroups={basicNavGroups}
      showSkipToContent
      mainContentId="main-content"
    >
      {children}
    </DashboardLayout>
  )
}
```

#### Navigation Structure

```tsx
const navigation = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Reports",
    icon: FileText,
    items: [
      { title: "Sales", url: "/reports/sales" },
      { title: "Analytics", url: "/reports/analytics" },
    ],
  },
]
```

---

## 🎨 Styling

This library uses **Tailwind CSS** and **Shadcn UI** patterns. Make sure you have Tailwind configured:

```js
// tailwind.config.js
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './node_modules/@hascanb/arf-ui-kit/**/*.{js,ts,jsx,tsx}',
  ],
  // ... rest of config
}
```

### CSS Variables

The library uses CSS variables for theming. Add these to your `globals.css`:

```css
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --primary: 222.2 47.4% 11.2%;
    --primary-foreground: 210 40% 98%;
    /* ... other variables */
  }
}
```

---

## 🔧 Configuration

### TypeScript

The library is fully typed. Add these to your `tsconfig.json`:

```json
{
  "compilerOptions": {
    "paths": {
      "@hascanb/arf-ui-kit/*": ["./node_modules/@hascanb/arf-ui-kit/dist/*"]
    }
  }
}
```

### Next.js

For Next.js projects, configure `next.config.js`:

```js
module.exports = {
  transpilePackages: ['@hascanb/arf-ui-kit'],
}
```

---

## 📖 Examples

Check out the [examples folder](./examples) for full working examples:

- **Next.js App Router** - Full-stack example with all kits
- **Vite + React** - Client-only example
- **Form Wizard** - Multi-step form example
- **Admin Dashboard** - Complete dashboard example

---

## 🤝 Contributing

Contributions are welcome! Please read our [contributing guidelines](./CONTRIBUTING.md) first.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

MIT © [ARF Technology](https://github.com/arftech)

---

## 🙏 Acknowledgments

Built with:
- [React](https://reactjs.org/)
- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Shadcn UI](https://ui.shadcn.com/)
- [TanStack Table](https://tanstack.com/table)
- [React Hook Form](https://react-hook-form.com/)
- [Zod](https://zod.dev/)
- [Radix UI](https://www.radix-ui.com/)
- [Lucide Icons](https://lucide.dev/)

---

## 📞 Support

- 📧 Email: support@arftech.com
- 💬 Discord: [Join our community](https://discord.gg/arftech)
- 🐛 Issues: [GitHub Issues](https://github.com/arftech/arf-ui-kit/issues)
- 📚 Docs: [Full Documentation](https://docs.arftech.com)

---

**Made with ❤️ by ARF Technology**
