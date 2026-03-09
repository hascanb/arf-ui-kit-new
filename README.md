# ARF UI Kit

> Production-ready React UI Kit with comprehensive components for modern web applications

[![Version](https://img.shields.io/npm/v/@arftech/arf-ui-kit.svg)](https://www.npmjs.com/package/@arftech/arf-ui-kit)
[![License](https://img.shields.io/npm/l/@arftech/arf-ui-kit.svg)](https://github.com/arftech/arf-ui-kit/blob/main/LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18+-61dafb.svg)](https://reactjs.org/)
[![Storybook](https://img.shields.io/badge/Storybook-FF4785?logo=storybook&logoColor=white)](http://localhost:6006)

> ⚠️ **Security Notice:** DataTable-Kit uses `xlsx` library which has known vulnerabilities. See [SECURITY.md](SECURITY.md) for details and mitigation strategies.

## 🎨 Interactive Documentation

Explore all components in Storybook:
- **Local:** `npm run storybook` → [http://localhost:6006](http://localhost:6006)
- **40+ Interactive Stories** with Dark Mode support
- **Accessibility Testing** built-in with @storybook/addon-a11y
- **Live Code Examples** - see props, controls, and variants

## 📦 What's Included

ARF UI Kit provides 5 specialized kits for building modern web applications:

- 🔐 **[Auth-Kit](#auth-kit)** - Authentication forms and flows (Sign In, OTP, Password Reset)
- 📊 **[DataTable-Kit](#datatable-kit)** - Advanced data tables with sorting, filtering, Excel export
- 📝 **[Form-Kit](#form-kit)** - Schema-driven forms with Zod validation
- ❌ **[Errors-Kit](#errors-kit)** - Centralized error handling with level-based actions
- 🎨 **[Layout-Kit](#layout-kit)** - Dashboard layouts, headers, sidebars, footers

## 🚀 Installation

```bash
npm install @arftech/arf-ui-kit
# or
yarn add @arftech/arf-ui-kit
# or
pnpm add @arftech/arf-ui-kit
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

#### Quick Start

```tsx
import { SignInForm, AuthKitProvider } from '@arftech/arf-ui-kit/auth-kit'

function App() {
  return (
    <AuthKitProvider
      config={{
        apiBaseUrl: 'https://api.example.com',
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
- ✅ URL state synchronization
- ✅ Faceted filters
- ✅ Server-side pagination support

#### Quick Start

```tsx
import { DataTable, useTableUrlState } from '@arftech/arf-ui-kit/datatable-kit'
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
  const [tableState, setTableState] = useTableUrlState({
    pageSize: 10,
  })

  return (
    <DataTable
      columns={columns}
      data={data}
      state={tableState}
      onStateChange={setTableState}
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

- `useTableUrlState` - URL query sync
- `excel.ts` - Excel export/import/template/validate
- `get-page-numbers.ts` - Pagination helpers

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
import { SchemaForm, FieldConfig, buildSchema } from '@arftech/arf-ui-kit/form-kit'

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
} from '@arftech/arf-ui-kit/form-kit'

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
} from '@arftech/arf-ui-kit/errors-kit'

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
import { createErrorHandler } from '@arftech/arf-ui-kit/errors-kit'

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
  AppHeader, 
  AppSidebar, 
  AppFooter 
} from '@arftech/arf-ui-kit/layout-kit'

function App() {
  return (
    <DashboardLayout
      header={<AppHeader title="Dashboard" />}
      sidebar={<AppSidebar navigation={navItems} />}
      footer={<AppFooter />}
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
    './node_modules/@arftech/arf-ui-kit/**/*.{js,ts,jsx,tsx}',
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
      "@arftech/arf-ui-kit/*": ["./node_modules/@arftech/arf-ui-kit/dist/*"]
    }
  }
}
```

### Next.js

For Next.js projects, configure `next.config.js`:

```js
module.exports = {
  transpilePackages: ['@arftech/arf-ui-kit'],
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
