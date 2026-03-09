# ARF UI Kit - Mimari Analiz ve Dönüşüm Rehberi

**Tarih:** 9 Mart 2026  
**Proje:** arf-ui-kit-new  
**Senior Architect:** Oğuz Hoca  
**Mimari Yaklaşım:** Monolitik → Modüler Kit Library

---

## 1. Mevcut Durum Analizi

### 1.1 Proje Yapısı

Proje Next.js 16.1.6 tabanlı bir TypeScript uygulamasıdır. İki ana bölümden oluşur:

```
arf-ui-kit-new/
├── src/                    # 🎯 SAF KÜTÜPHANE KODU (NPM Package Simülasyonu)
│   ├── auth-kit/           # Kimlik doğrulama modülü
│   ├── datatable-kit/      # Tablo bileşenleri modülü
│   ├── errors-kit/         # Hata yönetimi modülü
│   ├── form-kit/           # Form bileşenleri modülü
│   ├── layout-kit/         # Layout bileşenleri modülü
│   ├── externals.d.ts      # 👻 Ghost UI type tanımları
│   └── index.ts            # Ana barrel export
│
├── playground/             # 🔬 TEST & GELIŞTIRME ORTAMI
│   ├── components/ui/      # Shadcn UI bileşenleri
│   ├── lib/utils.ts        # Yardımcı fonksiyonlar
│   ├── styles/             # Global stiller
│   └── types/              # Playground tipleri
│
└── app/                    # 📱 DEMO UYGULAMA (Kargo Otomasyonu)
    ├── layout.tsx
    └── (dashboard)/        # Test sayfaları
```

### 1.2 Kritik Mimari Kararlar

#### A. Hayalet UI (Ghost UI) Pattern
**Tanım:** Kütüphane kendi UI bileşenlerini içermez, ana projeden import eder.

**Uygulama:**
```typescript
// src/externals.d.ts (Şu an boş, doldurulmalı)
declare module '@/components/ui/button' {
  export * from '@/components/ui/button'
}

declare module '@/components/ui/input' {
  export * from '@/components/ui/input'
}
// ... diğer UI bileşenleri
```

**Fayda:** 
- Kütüphane boyutu minimal kalır
- UI tasarımı ana proje tarafından kontrol edilir
- Kütüphane sadece mantık ve davranış sağlar

#### B. Barrel Export Pattern
**Tanım:** Her kit kendi `index.ts` üzerinden sadece gerekli exportları yapar.

**Örnek Yapı:**
```typescript
// src/auth-kit/index.ts
export { AuthKitProvider } from './context/AuthKitProvider'
export { useAuthKit } from './context/useAuthKit'
export { SignInForm, OtpForm } from './components'
export { SignInPageContent, OtpPageContent } from './pages'
export type { AuthKitConfig, AuthKitTranslations } from './context/types'
```

**Fayda:**
- Kontrollü API yüzeyi
- İç implementasyon detayları gizli kalır
- Tree-shaking optimize edilir

#### C. NPM Simülasyonu
**Tanım:** Kütüphane sanki NPM'den kurulmuş gibi kullanılır.

**tsconfig.json Ayarı:**
```json
{
  "paths": {
    "@/*": ["./playground/*"],
    "@arftech/arfweb-shared-lib/*": ["./src/*"]
  }
}
```

**Kullanım:**
```typescript
// playground veya app içinde
import { AuthKitProvider } from '@arftech/arfweb-shared-lib/auth-kit'
import { Button } from '@/components/ui/button' // Ghost UI
```

**Fayda:**
- Gerçek kullanım senaryosu test edilir
- Refactoring kolaylaşır
- NPM'e yayınlandığında hiçbir değişiklik gerekmez

---

## 2. auth-kit Modülü Detaylı Analiz

### 2.1 Mimari Gereksinimler

#### ✅ Olması Gerekenler:
- **Pure Components:** Props-driven, side-effect free
- **Generic Config:** Callback-based, proje agnostik
- **i18n Support:** Çoklu dil desteği varsayılan
- **Type Safety:** Tam TypeScript desteği
- **Composable:** Bileşenler bağımsız kullanılabilir

#### ❌ Olmaması Gerekenler:
- Hardcoded metinler (TR/EN/...)
- API çağrıları (callback olmalı)
- Route tanımları (config'den almalı)
- Kargo/domain spesifik mantık
- localStorage/sessionStorage doğrudan erişimi

### 2.2 Modül Yapısı

```
src/auth-kit/
├── context/
│   ├── types.ts                    # Tüm type tanımları
│   ├── AuthKitProvider.tsx         # Context provider
│   └── useAuthKit.ts               # Context hook
│
├── i18n/
│   ├── defaults.ts                 # Varsayılan çeviriler (TR/EN)
│   └── use-translation.ts          # Translation hook
│
├── components/
│   ├── SignInForm.tsx              # Form bileşeni (kullanıcı/şifre)
│   ├── OtpForm.tsx                 # OTP giriş formu
│   ├── ForgotPasswordForm.tsx      # Şifre unuttum formu
│   └── ResetPasswordForm.tsx       # Şifre sıfırlama formu
│
├── pages/
│   ├── SignInPageContent.tsx       # Tam login sayfası
│   ├── SignIn2PageContent.tsx      # Alternatif login sayfası
│   ├── OtpPageContent.tsx          # OTP sayfası
│   ├── ForgotPasswordPageContent.tsx
│   └── ResetPasswordPageContent.tsx
│
└── index.ts                        # Barrel export
```

### 2.3 Veri Akışı

```
┌─────────────────────────────────────────────────────────────┐
│  App Level (Kütüphane Kullanıcısı)                         │
│  - AuthKitConfig tanımlar (callbacks, routes, i18n)         │
│  - AuthKitProvider ile uygulamayı sarar                     │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  AuthKitProvider (context/AuthKitProvider.tsx)              │
│  - Config'i context'e yerleştirir                           │
│  - Translations yönetimini sağlar                           │
│  - State management (isLoading, error, vb.)                 │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  useAuthKit Hook (context/useAuthKit.ts)                    │
│  - Config'e erişim sağlar                                   │
│  - Translations'ı expose eder                               │
│  - Helper fonksiyonlar sağlar                               │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  Components & Pages                                         │
│  - useAuthKit() ile config/translations alır                │
│  - Callback fonksiyonları çağırır                           │
│  - UI render eder (Ghost UI kullanarak)                     │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. Implementasyon Detayları

### 3.1 Type System (context/types.ts)

**AuthKitConfig Interface:**
```typescript
export interface AuthKitConfig {
  // Callback fonksiyonlar
  onSignIn: (credentials: SignInCredentials) => Promise<SignInResponse>
  onOtpVerify: (data: OtpData) => Promise<OtpResponse>
  onForgotPassword: (email: string) => Promise<ForgotPasswordResponse>
  onResetPassword: (data: ResetPasswordData) => Promise<ResetPasswordResponse>
  
  // Yönlendirme
  routes: {
    afterSignIn: string
    afterOtp?: string
    forgotPassword: string
    resetPassword: string
    signIn: string
  }
  
  // i18n
  locale?: 'tr' | 'en' | string
  translations?: Partial<AuthKitTranslations>
  
  // UI Konfigürasyonu
  ui?: {
    showRememberMe?: boolean
    showForgotPassword?: boolean
    logoUrl?: string
    brandName?: string
  }
}
```

**Veri Türleri:**
```typescript
export interface SignInCredentials {
  username: string
  password: string
  rememberMe?: boolean
}

export interface SignInResponse {
  success: boolean
  requiresOtp?: boolean
  error?: string
  data?: any
}

// ... diğer response/request tipleri
```

**Translation Interface:**
```typescript
export interface AuthKitTranslations {
  signIn: {
    title: string
    subtitle: string
    username: string
    password: string
    rememberMe: string
    submit: string
    forgotPassword: string
  }
  otp: {
    title: string
    description: string
    submit: string
    resend: string
  }
  // ... diğer bölümler
  errors: {
    required: string
    invalidEmail: string
    invalidPassword: string
    // ...
  }
}
```

### 3.2 Context & Provider (context/AuthKitProvider.tsx)

**Provider Yapısı:**
```typescript
import { createContext } from 'react'
import type { AuthKitConfig } from './types'

interface AuthKitContextValue {
  config: AuthKitConfig
  t: (key: string) => string  // Translation helper
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
}

export const AuthKitContext = createContext<AuthKitContextValue | null>(null)

export function AuthKitProvider({
  config,
  children
}: {
  config: AuthKitConfig
  children: React.ReactNode
}) {
  // State management
  // Translation merging
  // Context value hazırlama
  
  return (
    <AuthKitContext.Provider value={contextValue}>
      {children}
    </AuthKitContext.Provider>
  )
}
```

### 3.3 Translation System (i18n/)

**defaults.ts:**
```typescript
export const defaultTranslations = {
  tr: {
    signIn: {
      title: 'Giriş Yap',
      subtitle: 'Hesabınıza giriş yapın',
      // ...
    },
    // ...
  },
  en: {
    signIn: {
      title: 'Sign In',
      subtitle: 'Sign in to your account',
      // ...
    },
    // ...
  }
} as const
```

**use-translation.ts:**
```typescript
export function useTranslation() {
  const { config } = useAuthKit()
  
  const t = (key: string) => {
    // Key parsing (e.g., 'signIn.title' -> ['signIn', 'title'])
    // Custom translation lookup
    // Fallback to default
    // Return translation
  }
  
  return { t }
}
```

### 3.4 Form Components

**Örnek: SignInForm.tsx**
```typescript
import { useAuthKit } from '../context/useAuthKit'
import { Button } from '@/components/ui/button'  // Ghost UI
import { Input } from '@/components/ui/input'    // Ghost UI

export function SignInForm() {
  const { config, t } = useAuthKit()
  const [isLoading, setIsLoading] = useState(false)
  
  const handleSubmit = async (data: SignInCredentials) => {
    setIsLoading(true)
    try {
      const response = await config.onSignIn(data)
      if (response.success) {
        // Redirect logic using config.routes.afterSignIn
      }
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <form onSubmit={handleSubmit}>
      <Input 
        name="username" 
        placeholder={t('signIn.username')} 
      />
      {/* ... */}
      <Button type="submit" disabled={isLoading}>
        {t('signIn.submit')}
      </Button>
    </form>
  )
}
```

**Props Yaklaşımı:**
- Form validation: react-hook-form + zod
- Ghost UI: Tüm UI bileşenleri dışarıdan
- State: Local state (config'deki callbacks ile iletişim)

### 3.5 Page Components

**Örnek: SignInPageContent.tsx**
```typescript
export function SignInPageContent() {
  const { config, t } = useAuthKit()
  
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md space-y-6">
        {config.ui?.logoUrl && (
          <img src={config.ui.logoUrl} alt="Logo" />
        )}
        <h1>{t('signIn.title')}</h1>
        <SignInForm />
      </div>
    </div>
  )
}
```

**Sorumluluklar:**
- Layout & spacing
- Branding elements (logo, title)
- Form yerleşimi
- Responsive design

---

## 4. Kullanım Senaryosu (Playground/App)

### 4.1 Minimal Setup

```typescript
// app/layout.tsx veya pages/_app.tsx
import { AuthKitProvider } from '@arftech/arfweb-shared-lib/auth-kit'

const authConfig = {
  onSignIn: async (credentials) => {
    // API call
    const response = await fetch('/api/auth/signin', { 
      method: 'POST', 
      body: JSON.stringify(credentials) 
    })
    return await response.json()
  },
  
  routes: {
    afterSignIn: '/dashboard',
    forgotPassword: '/auth/forgot-password',
    resetPassword: '/auth/reset-password',
    signIn: '/auth/signin'
  },
  
  locale: 'tr',
  
  ui: {
    showRememberMe: true,
    logoUrl: '/logo.png',
    brandName: 'ARF Kargo'
  }
}

export default function RootLayout({ children }) {
  return (
    <AuthKitProvider config={authConfig}>
      {children}
    </AuthKitProvider>
  )
}
```

### 4.2 Sayfa Kullanımı

```typescript
// app/auth/signin/page.tsx
import { SignInPageContent } from '@arftech/arfweb-shared-lib/auth-kit'

export default function SignInPage() {
  return <SignInPageContent />
}
```

### 4.3 Custom Composition

```typescript
// app/auth/custom-signin/page.tsx
import { SignInForm, useAuthKit } from '@arftech/arfweb-shared-lib/auth-kit'

export default function CustomSignInPage() {
  return (
    <div className="custom-layout">
      <div className="left-panel">
        <img src="/hero.jpg" alt="Hero" />
      </div>
      <div className="right-panel">
        <SignInForm />
      </div>
    </div>
  )
}
```

---

## 5. Externals.d.ts Doldurma Stratejisi

### 5.1 Gerekli Ghost UI Bileşenleri

auth-kit için gerekli olan UI bileşenleri:

```typescript
// src/externals.d.ts
declare module '@/components/ui/button' {
  export type { ButtonProps } from '@/components/ui/button'
  export { Button, buttonVariants } from '@/components/ui/button'
}

declare module '@/components/ui/input' {
  export type { InputProps } from '@/components/ui/input'
  export { Input } from '@/components/ui/input'
}

declare module '@/components/ui/label' {
  export * from '@/components/ui/label'
}

declare module '@/components/ui/card' {
  export * from '@/components/ui/card'
}

declare module '@/components/ui/form' {
  export * from '@/components/ui/form'
}

declare module '@/components/ui/input-otp' {
  export * from '@/components/ui/input-otp'
}

declare module '@/components/ui/alert' {
  export * from '@/components/ui/alert'
}

declare module '@/components/ui/spinner' {
  export * from '@/components/ui/spinner'
}

declare module '@/lib/utils' {
  export { cn } from '@/lib/utils'
}
```

### 5.2 Diğer Kit'ler İçin Genişletme

Her kit kendi ihtiyaçlarını belirtmelidir:

- **form-kit:** Select, Checkbox, Radio, Textarea, DatePicker
- **datatable-kit:** Table, Pagination, Dropdown Menu
- **layout-kit:** Sidebar, Navigation Menu, Breadcrumb, Sheet
- **errors-kit:** Alert, Toast, Dialog

---

## 6. Geliştirme Checklist

### 6.1 auth-kit Tamamlanma Kriterleri

- [ ] **types.ts** tam ve eksiksiz
  - [ ] AuthKitConfig interface
  - [ ] Tüm callback type'ları
  - [ ] Request/Response interface'leri
  - [ ] AuthKitTranslations interface

- [ ] **AuthKitProvider.tsx** çalışıyor
  - [ ] Context oluşturuldu
  - [ ] State management hazır
  - [ ] Translation merging çalışıyor
  - [ ] Error boundaries eklendi

- [ ] **useAuthKit.ts** hook hazır
  - [ ] Context doğru consume ediliyor
  - [ ] Helper fonksiyonlar eklendi

- [ ] **i18n sistemi** hazır
  - [ ] defaults.ts TR/EN çevirileri
  - [ ] use-translation.ts çalışıyor
  - [ ] Nested key parsing

- [ ] **Form bileşenleri** hazır
  - [ ] SignInForm
  - [ ] OtpForm
  - [ ] ForgotPasswordForm
  - [ ] ResetPasswordForm
  - [ ] Validation (zod) eklendi
  - [ ] Error handling yapılıyor

- [ ] **Page bileşenleri** hazır
  - [ ] SignInPageContent
  - [ ] OtpPageContent
  - [ ] ForgotPasswordPageContent
  - [ ] ResetPasswordPageContent
  - [ ] Responsive design

- [ ] **Barrel export** (index.ts)
  - [ ] Public API belirlenmiş
  - [ ] Types export edilmiş
  - [ ] Components export edilmiş

- [ ] **externals.d.ts** doldurulmuş
  - [ ] Gerekli UI bileşenleri declare edilmiş

- [ ] **Playground test**
  - [ ] Demo sayfa oluşturuldu
  - [ ] AuthKitProvider configure edildi
  - [ ] Tüm formlar test edildi

### 6.2 Diğer Kit'ler İçin Template

auth-kit tamamlandıktan sonra aynı mimari diğer kit'lere uygulanacak:

1. **datatable-kit:** Tablo, filtreleme, sıralama, pagination
2. **form-kit:** Dinamik form builder, validation, field components
3. **layout-kit:** Sidebar, header, footer, breadcrumb
4. **errors-kit:** Global error handling, toast notifications

Her kit için:
- `context/types.ts` → Config & callback tanımları
- `context/Provider.tsx` → Context provider
- `i18n/` → Çeviri sistemi
- `components/` → Alt bileşenler
- `index.ts` → Barrel export
- Playground test sayfası

---

## 7. Mimari Prensipler Özeti

### 7.1 SOLID Principles

- **Single Responsibility:** Her kit tek bir domain'e odaklanır
- **Open/Closed:** Config ile extend edilebilir, modify gerektirmez
- **Liskov Substitution:** Bileşenler birbirinin yerine kullanılabilir
- **Interface Segregation:** Minimal, ihtiyaca özel interface'ler
- **Dependency Inversion:** Ghost UI ile soyutlama

### 7.2 Design Patterns

- **Provider Pattern:** Context-based configuration
- **Barrel Export Pattern:** Kontrollü API yüzeyi
- **Composition Pattern:** Küçük, birleştirilebilir bileşenler
- **Strategy Pattern:** Callback-based behavior injection
- **Factory Pattern:** Config'den runtime oluşturma

### 7.3 Best Practices

✅ **Yapılacaklar:**
- Props ile tüm davranışı kontrol et
- TypeScript strict mode kullan
- Minimal dependencies
- Tree-shakeable exports
- Comprehensive JSDoc
- Unit test coverage

❌ **Yapılmayacaklar:**
- Hardcoded strings
- Direct API calls
- Global state pollution
- Framework-specific patterns (Next.js only)
- Tight coupling with domain logic

---

## 8. Sonraki Adımlar

### Kısa Vadeli (Bu Sprint)
1. ✅ Analiz tamamlandı
2. ⏳ auth-kit implementasyonu
3. ⏳ Playground test sayfası
4. ⏳ Documentation

### Orta Vadeli (Gelecek Sprint)
1. datatable-kit implementasyonu
2. form-kit implementasyonu
3. Storybook entegrasyonu
4. Unit test coverage %80+

### Uzun Vadeli (Roadmap)
1. NPM'e package yayını
2. Monorepo yapısına geçiş (Turborepo/Nx)
3. Component playground (Storybook/Ladle)
4. Visual regression testing (Chromatic)
5. Automated documentation (TypeDoc)

---

## 9. Referanslar

- **Shadcn UI:** https://ui.shadcn.com/
- **React Context:** https://react.dev/reference/react/createContext
- **Barrel Exports:** https://basarat.gitbook.io/typescript/main-1/barrel
- **Ghost UI Pattern:** (Internal documentation)
- **ARF Kargo Domain:** (Internal wiki)

---

**Son Güncelleme:** 9 Mart 2026  
**Doküman Sahibi:** Senior Architect - Oğuz Hoca  
**Maintainer:** Development Team
