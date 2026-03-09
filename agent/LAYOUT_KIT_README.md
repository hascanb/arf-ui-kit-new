# Layout Kit - Kullanım Kılavuzu

Layout Kit, ARF UI Kit'in dashboard layout modülüdür. Sidebar, header, footer ve tam entegre layout çözümleri sunar.

## 📦 Kurulum

```typescript
import { 
  DashboardLayout,
  AppHeader,
  AppSidebar,
  AppFooter,
  ThemeProvider 
} from '@arftech/arfweb-shared-lib/layout-kit'
```

## 🎯 Kullanım

### 1. DashboardLayout (Tam Çözüm)

En basit kullanım için tüm layout'u tek seferde kullanın:

```typescript
import { DashboardLayout } from '@arftech/arfweb-shared-lib/layout-kit'
import { Home, Package, Users, Settings } from 'lucide-react'

const navGroups = [
  {
    label: "Menü",
    items: [
      { title: "Ana Sayfa", url: "/", icon: Home },
      { title: "Kargolar", url: "/shipments", icon: Package },
    ]
  }
]

export default function Layout({ children }) {
  return (
    <DashboardLayout
      brand={{
        title: "ARF Kargo",
        subtitle: "v1.0",
        url: "/",
        icon: Package
      }}
      user={{
        name: "Ahmet Yılmaz",
        email: "ahmet@example.com",
        avatar: "/avatars/01.png",
        role: "Yönetici"
      }}
      navGroups={navGroups}
      breadcrumbs={[
        { label: "Ana Sayfa", href: "/" },
        { label: "Kargolar" }
      ]}
      notificationCount={5}
      showFooter={true}
      onLogout={() => console.log("Logout")}
    >
      {children}
    </DashboardLayout>
  )
}
```

### 2. Manuel Layout (Parça Parça)

Daha fazla kontrol için bileşenleri ayrı ayrı kullanın:

```typescript
import { 
  AppSidebar, 
  AppHeader,
  AppFooter 
} from '@arftech/arfweb-shared-lib/layout-kit'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'

export default function Layout({ children }) {
  return (
    <SidebarProvider>
      <AppSidebar
        brand={...}
        user={...}
        navGroups={...}
        onLogout={...}
      />
      <SidebarInset>
        <AppHeader
          breadcrumbs={...}
          notificationCount={...}
        />
        <main>{children}</main>
        <AppFooter {...} />
      </SidebarInset>
    </SidebarProvider>
  )
}
```

### 3. AppSidebar (Sidebar Only)

```typescript
const navGroups = [
  {
    label: "Yönetim",
    items: [
      {
        title: "Müşteriler",
        url: "/customers",
        icon: Users,
        badge: "12"
      },
      {
        title: "Ayarlar",
        url: "/settings",
        icon: Settings,
        items: [
          { title: "Profil", url: "/settings/profile" },
          { title: "Güvenlik", url: "/settings/security" }
        ]
      }
    ]
  }
]

<AppSidebar
  brand={brandData}
  user={userData}
  navGroups={navGroups}
  onLogout={() => signOut()}
/>
```

### 4. AppHeader

```typescript
<AppHeader
  breadcrumbs={[
    { label: "Dashboard", href: "/" },
    { label: "Kargolar", href: "/shipments" },
    { label: "Detay" }
  ]}
  searchPlaceholder="Ara..."
  searchShortcut={<>⌘K</>}
  notificationCount={3}
  onSearchClick={() => openSearchModal()}
  onNotificationClick={() => openNotifications()}
/>
```

### 5. AppFooter

```typescript
<AppFooter
  brandName="ARF Technology"
  description="Profesyonel kargo yönetim sistemleri"
  linkGroups={[
    {
      title: "Ürünler",
      links: [
        { label: "Kargo Takip", href: "/products/tracking" },
        { label: "Şube Yönetimi", href: "/products/branches" }
      ]
    },
    {
      title: "Destek",
      links: [
        { label: "Yardım Merkezi", href: "/help" },
        { label: "İletişim", href: "/contact" }
      ]
    }
  ]}
  socialLinks={[
    {
      label: "Twitter",
      href: "https://twitter.com/arftech",
      icon: Twitter
    }
  ]}
/>
```

### 6. ThemeProvider

```typescript
import { ThemeProvider } from '@arftech/arfweb-shared-lib/layout-kit'

<ThemeProvider
  attribute="class"
  defaultTheme="system"
  enableSystem
  disableTransitionOnChange
>
  <DashboardLayout {...}>
    {children}
  </DashboardLayout>
</ThemeProvider>
```

## 📋 Type Definitions

### DashboardLayoutProps

```typescript
interface DashboardLayoutProps {
  children: React.ReactNode
  brand: BrandData
  user: UserData
  navGroups: NavGroup[]
  breadcrumbs?: BreadcrumbData[]
  searchPlaceholder?: string
  notificationCount?: number
  showFooter?: boolean
  footerProps?: AppFooterProps
  onLogout?: () => void
  onSearchClick?: () => void
  onNotificationClick?: () => void
}
```

### NavGroup

```typescript
interface NavGroup {
  label?: string
  items: NavItem[]
}

interface NavItem {
  title: string
  url?: string
  icon: React.ElementType
  badge?: string
  items?: NavSubItem[]  // Alt menü
}
```

### BrandData & UserData

```typescript
interface BrandData {
  title: string
  subtitle: string
  url: string
  icon: React.ElementType
}

interface UserData {
  name: string
  email: string
  avatar: string
  role: string
}
```

## 🎨 Ghost UI Dependencies

Layout Kit aşağıdaki UI bileşenlerine ihtiyaç duyar:

**Gerekli Bileşenler:**
- `@/components/ui/sidebar`
- `@/components/ui/breadcrumb`
- `@/components/ui/button`
- `@/components/ui/separator`
- `@/components/ui/badge`
- `@/components/ui/avatar`
- `@/components/ui/dropdown-menu`
- `@/components/ui/collapsible`

Bu bileşenler projenizde mevcut olmalıdır (örn: Shadcn UI).

## ✨ Özellikler

### AppSidebar Features
- ✅ Collapsible (daraltılabilir)
- ✅ Nested navigation (alt menüler)
- ✅ Active state detection
- ✅ Badge support
- ✅ User dropdown
- ✅ Responsive design

### AppHeader Features
- ✅ Sticky header
- ✅ Breadcrumb navigation
- ✅ Search bar (desktop + mobile)
- ✅ Notification counter
- ✅ Backdrop blur effect
- ✅ Sidebar toggle

### DashboardLayout Features
- ✅ Tam entegre layout
- ✅ Opsiyonel footer
- ✅ Responsive
- ✅ Dark mode ready

## 🔗 İlişkili Modüller

- **auth-kit**: Kimlik doğrulama için
- **playground/components/ui**: Ghost UI bileşenleri

## 📝 Notlar

1. **Sidebar State**: Sidebar durumu (açık/kapalı) localStorage'da otomatik saklanır
2. **Active Links**: `usePathname()` ile aktif link otomatik algılanır
3. **Theme**: ThemeProvider ile dark/light mode desteği
4. **Mobile**: Mobilde sidebar otomatik drawer olur

## 🐛 Troubleshooting

### "Module not found" hatası
```bash
# tsconfig.json paths kontrolü:
"@/*": ["./playground/*"]
"@arftech/arfweb-shared-lib/*": ["./src/*"]
```

### Sidebar açılmıyor
```typescript
// SidebarProvider'ın children içinde olduğundan emin olun
<SidebarProvider>
  <AppSidebar ... />
  <SidebarInset>...</SidebarInset>
</SidebarProvider>
```

### Active link çalışmıyor
```typescript
// URL'lerin doğru tanımlandığından emin olun
{ title: "Ana Sayfa", url: "/" }  // ✅ Doğru
{ title: "Ana Sayfa", url: "" }   // ❌ Yanlış
```

---

**Son Güncelleme**: 9 Mart 2026  
**Versiyon**: 1.0.0
