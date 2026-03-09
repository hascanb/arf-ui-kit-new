# ARF UI Kit - Auth Kit Kullanım Rehberi

## 🎯 Genel Bakış

auth-kit, kimlik doğrulama süreçlerini yönetmek için tasarlanmış modüler, yeniden kullanılabilir bir kütüphanedir. Ghost UI pattern kullanarak tam bağımsızlık sağlar.

## 📦 Kurulum ve Yapılandırma

### 1. AuthKitProvider Kurulumu

Auth sayfalarınızı `AuthKitProvider` ile sarın:

```tsx
// app/auth/layout.tsx
import { AuthKitProvider } from '@arftech/arfweb-shared-lib/auth-kit'
import type { AuthKitConfig } from '@arftech/arfweb-shared-lib/auth-kit'

const authConfig: AuthKitConfig = {
  onSignIn: async (credentials) => {
    const response = await fetch('/api/auth/signin', {
      method: 'POST',
      body: JSON.stringify(credentials),
    })
    return await response.json()
  },
  
  routes: {
    afterSignIn: '/dashboard',
    forgotPassword: '/auth/forgot-password',
    resetPassword: '/auth/reset-password',
    signIn: '/auth/signin',
  },
  
  locale: 'tr',
  
  ui: {
    showRememberMe: true,
    logoUrl: '/logo.svg',
    brandName: 'Şirket Adı',
  },
}

export default function AuthLayout({ children }) {
  return (
    <AuthKitProvider config={authConfig}>
      {children}
    </AuthKitProvider>
  )
}
```

### 2. Sayfa Bileşenlerini Kullanma

```tsx
// app/auth/signin/page.tsx
import { SignInPageContent } from '@arftech/arfweb-shared-lib/auth-kit'

export default function SignInPage() {
  return <SignInPageContent />
}
```

## 🎨 Kullanılabilir Bileşenler

### Sayfa Bileşenleri (Page Components)

Tam sayfa layout'ları:

- `SignInPageContent` - Standart giriş sayfası (card layout)
- `SignIn2PageContent` - Alternatif giriş sayfası (split-screen)
- `OtpPageContent` - OTP doğrulama sayfası
- `ForgotPasswordPageContent` - Şifremi unuttum sayfası
- `ResetPasswordPageContent` - Şifre sıfırlama sayfası

### Form Bileşenleri (Form Components)

Kompozisyon için kullanılabilir formlar:

- `SignInForm` - Giriş formu
- `OtpForm` - OTP formu
- `ForgotPasswordForm` - Şifremi unuttum formu
- `ResetPasswordForm` - Şifre sıfırlama formu

```tsx
// Özel layout ile kullanım
import { SignInForm } from '@arftech/arfweb-shared-lib/auth-kit'

export default function CustomSignInPage() {
  return (
    <div className="custom-layout">
      <div className="left-panel">
        <HeroImage />
      </div>
      <div className="right-panel">
        <SignInForm />
      </div>
    </div>
  )
}
```

## ⚙️ Konfigürasyon

### AuthKitConfig Interface

```typescript
interface AuthKitConfig {
  // Callback fonksiyonlar
  onSignIn: (credentials: SignInCredentials) => Promise<SignInResponse>
  onOtpVerify?: (data: OtpData) => Promise<OtpResponse>
  onForgotPassword?: (data: ForgotPasswordData) => Promise<ForgotPasswordResponse>
  onResetPassword?: (data: ResetPasswordData) => Promise<ResetPasswordResponse>
  onResendOtp?: (username: string) => Promise<{ success: boolean; error?: string }>
  
  // Routing
  routes: {
    afterSignIn: string
    afterOtp?: string
    forgotPassword: string
    resetPassword: string
    signIn: string
    signUp?: string
  }
  
  // i18n
  locale?: string
  translations?: Partial<AuthKitTranslations>
  
  // UI
  ui?: {
    showRememberMe?: boolean
    showForgotPassword?: boolean
    showSignUpLink?: boolean
    logoUrl?: string
    brandName?: string
  }
  
  debug?: boolean
}
```

### Response Interface'leri

```typescript
interface SignInResponse {
  success: boolean
  requiresOtp?: boolean  // true ise OTP sayfasına yönlendirir
  error?: string
  data?: {
    user?: any
    token?: string
  }
}
```

## 🌍 Çoklu Dil Desteği

### Varsayılan Diller

- Türkçe (`tr`)
- İngilizce (`en`)

### Özel Çeviriler

```tsx
const authConfig: AuthKitConfig = {
  locale: 'tr',
  translations: {
    signIn: {
      title: 'Özel Giriş Başlığı',
      subtitle: 'Özel alt başlık',
    },
    validation: {
      required: 'Bu alan zorunlu',
    },
  },
  // ... diğer config
}
```

## 🧪 Demo ve Test

### Test Kullanıcıları

Proje demo mode'da şu kullanıcılarla test edilebilir:

1. **OTP ile giriş:**
   - Kullanıcı: `admin`
   - Şifre: `password123`
   - OTP Kodu: `123456`

2. **Direkt giriş:**
   - Kullanıcı: `user`
   - Şifre: `password`

### Demo Sayfaları

- `/auth/signin` - Standart giriş sayfası
- `/auth/signin2` - Split-screen giriş sayfası
- `/auth/otp` - OTP doğrulama
- `/auth/forgot-password` - Şifremi unuttum
- `/auth/reset-password?token=demo` - Şifre sıfırlama

## 🎯 Kullanım Senaryoları

### Senaryo 1: Basit Giriş

```tsx
const config: AuthKitConfig = {
  onSignIn: async (credentials) => {
    const res = await fetch('/api/auth/signin', {
      method: 'POST',
      body: JSON.stringify(credentials),
    })
    return res.json()
  },
  routes: {
    afterSignIn: '/dashboard',
    signIn: '/auth/signin',
  },
}
```

### Senaryo 2: OTP ile İki Faktörlü Doğrulama

```tsx
const config: AuthKitConfig = {
  onSignIn: async (credentials) => {
    // İlk adım: Kullanıcı doğrulama
    const res = await loginUser(credentials)
    return {
      success: true,
      requiresOtp: true, // OTP gerekli
    }
  },
  onOtpVerify: async (data) => {
    // İkinci adım: OTP doğrulama
    const res = await verifyOtp(data.code, data.username)
    return res
  },
  routes: {
    afterSignIn: '/dashboard',
    afterOtp: '/dashboard',
    signIn: '/auth/signin',
  },
}
```

### Senaryo 3: Şifre Sıfırlama

```tsx
const config: AuthKitConfig = {
  onForgotPassword: async (data) => {
    await sendResetEmail(data.email)
    return { success: true }
  },
  onResetPassword: async (data) => {
    await resetPassword(data.token, data.password)
    return { success: true }
  },
  routes: {
    forgotPassword: '/auth/forgot-password',
    resetPassword: '/auth/reset-password',
    signIn: '/auth/signin',
  },
}
```

## 🎨 Özelleştirme

### Form Props Kullanımı

Her form bileşeni callbacks kabul eder:

```tsx
<SignInForm 
  onSuccess={(response) => {
    console.log('Giriş başarılı:', response)
  }}
  onError={(error) => {
    console.error('Giriş hatası:', error)
  }}
  className="custom-form"
/>
```

### useAuthKit Hook

```tsx
import { useAuthKit } from '@arftech/arfweb-shared-lib/auth-kit'

function CustomComponent() {
  const { config, t, isLoading, setIsLoading } = useAuthKit()
  
  return (
    <div>
      <h1>{t('signIn.title')}</h1>
      {isLoading && <Spinner />}
    </div>
  )
}
```

## 🏗️ Mimari Prensipler

### Ghost UI Pattern

Kütüphane kendi UI bileşenlerini içermez. Tüm UI bileşenleri (`Button`, `Input`, vb.) ana projeden import edilir:

```tsx
// ✅ Doğru: Ghost UI
import { Button } from '@/components/ui/button'

// ❌ Yanlış: Kütüphane içinde UI bileşeni
import { Button } from './components/Button'
```

### Pure Components

Tüm bileşenler "pure" (saf) olmalıdır:

- ✅ Props-driven
- ✅ No side effects
- ✅ No hardcoded text
- ✅ No direct API calls
- ❌ No domain-specific logic

## 📚 Type Safety

Tüm public API'ler TypeScript ile tam desteklenir:

```typescript
import type { 
  AuthKitConfig,
  SignInCredentials,
  SignInResponse,
} from '@arftech/arfweb-shared-lib/auth-kit'
```

## 🐛 Debug Mode

```tsx
const config: AuthKitConfig = {
  debug: true, // Console'da detaylı loglar
  // ... diğer config
}
```

## 📦 NPM'e Yayınlama (Gelecek)

Kütüphane NPM'e yayınlandığında hiçbir kod değişikliği gerekmez:

```bash
npm install @arftech/arfweb-shared-lib
```

```tsx
// Aynı import path
import { AuthKitProvider } from '@arftech/arfweb-shared-lib/auth-kit'
```

---

**Geliştirici:** ARF Tech Team  
**Versiyon:** 1.0.0  
**Tarih:** 9 Mart 2026
