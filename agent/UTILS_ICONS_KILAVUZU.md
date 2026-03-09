# 🎯 Utils & Icons Klasörleri - Kullanım Kılavuzu

## 📁 Klasör Yapısı

```
src/
├── auth-kit/
│   ├── utils/          ← Yardımcı fonksiyonlar
│   │   ├── validation.ts
│   │   ├── token.ts
│   │   └── index.ts
│   ├── icons/          ← Özel ikonlar
│   │   ├── AuthIcons.tsx
│   │   └── index.ts
│
├── layout-kit/
│   └── utils/          ← Navigation örnekleri
│       ├── navigation-examples.ts
│       └── index.ts
```

---

## 🔧 Auth Kit - Utils

### **validation.ts** - Form Doğrulama

```typescript
import { 
  isValidEmail, 
  getPasswordStrength,
  isValidPhoneNumber 
} from '@arftech/arfweb-shared-lib/auth-kit'

// Email kontrolü
if (!isValidEmail(email)) {
  console.error('Geçersiz email formatı')
}

// Şifre gücü hesaplama (0-4)
const strength = getPasswordStrength(password)
// 0: Çok Zayıf, 1: Zayıf, 2: Orta, 3: Güçlü, 4: Çok Güçlü

// Telefon numarası kontrolü (TR formatı)
if (isValidPhoneNumber('05551234567')) {
  console.log('Geçerli telefon numarası')
}
```

#### Mevcut Validation Fonksiyonları:

| Fonksiyon | Açıklama |
|-----------|----------|
| `isValidEmail(email)` | Email formatı kontrolü |
| `isValidUsername(username)` | Kullanıcı adı formatı (min 3 karakter, alfanumerik) |
| `isValidPhoneNumber(phone)` | Türkiye telefon numarası formatı |
| `isValidOtp(otp, length)` | OTP kodu formatı (varsayılan 6 haneli) |
| `getPasswordStrength(password)` | Şifre gücü skoru (0-4) |
| `getPasswordStrengthText(strength)` | Şifre gücü metni (Türkçe) |
| `passwordsMatch(pass1, pass2)` | İki şifre eşleşme kontrolü |
| `meetsMinPasswordLength(pass, min)` | Minimum uzunluk kontrolü |
| `calculatePasswordSimilarity(old, new)` | İki şifre benzerlik yüzdesi |

---

### **token.ts** - JWT & Storage Yönetimi

```typescript
import { 
  setToken, 
  getToken, 
  decodeToken,
  isTokenExpired 
} from '@arftech/arfweb-shared-lib/auth-kit'

// Kimlik doğrulama akışı
const handleLogin = (token: string) => {
  // Token'ı kaydet
  setToken(token)
  
  // Token'ı decode et
  const payload = decodeToken<{ userId: string, role: string }>(token)
  console.log('User ID:', payload?.userId)
  
  // Expire kontrolü
  if (isTokenExpired(token)) {
    console.warn('Token süresi dolmuş!')
  }
}

// Logout
import { clearAuth } from '@arftech/arfweb-shared-lib/auth-kit'

const handleLogout = () => {
  clearAuth() // Token, refresh token ve user verilerini temizler
}
```

#### Token Yönetim Fonksiyonları:

| Fonksiyon | Açıklama |
|-----------|----------|
| `setToken(token)` | Token'ı localStorage'a kaydet |
| `getToken()` | Token'ı localStorage'dan al |
| `removeToken()` | Token'ı sil |
| `setRefreshToken(token)` | Refresh token kaydet |
| `getRefreshToken()` | Refresh token al |
| `removeRefreshToken()` | Refresh token sil |
| `setUser(userData)` | Kullanıcı verisi kaydet |
| `getUser<T>()` | Kullanıcı verisi al (tipli) |
| `removeUser()` | Kullanıcı verisi sil |
| `clearAuth()` | Tüm auth verilerini temizle |
| `decodeToken<T>(token)` | JWT payload'ı decode et |
| `isTokenExpired(token)` | Token expire kontrolü |
| `getTokenExpiresIn(token)` | Token'ın kaç saniye sonra expire olacağı |
| `sessionStorage.set/get/remove/clear` | SessionStorage helper'ları |

---

## 🎨 Auth Kit - Icons

### **AuthIcons.tsx** - Özel İkonlar

```typescript
import { 
  FingerprintIcon,
  GoogleIcon,
  PasswordShowIcon 
} from '@arftech/arfweb-shared-lib/auth-kit'

export default function LoginPage() {
  return (
    <div>
      {/* Biyometrik giriş */}
      <button>
        <FingerprintIcon size={24} />
        Parmak İzi ile Giriş
      </button>
      
      {/* Social login */}
      <button>
        <GoogleIcon size={20} />
        Google ile Giriş
      </button>
      
      {/* Şifre göster/gizle */}
      <button onClick={() => setShow(!show)}>
        {show ? <PasswordShowIcon /> : <PasswordHideIcon />}
      </button>
    </div>
  )
}
```

#### Mevcut İkonlar:

| İkon | Kullanım Alanı |
|------|----------------|
| `FingerprintIcon` | Biyometrik kimlik doğrulama |
| `FaceIdIcon` | Yüz tanıma |
| `QrCodeIcon` | QR kod ile giriş |
| `TwoFactorIcon` | 2FA (İki Faktörlü Kimlik Doğrulama) |
| `EmailVerifiedIcon` | Email doğrulandı |
| `PhoneVerifiedIcon` | Telefon doğrulandı |
| `PasswordHideIcon` | Şifre gizle |
| `PasswordShowIcon` | Şifre göster |
| `GoogleIcon` | Google ile giriş |
| `GithubIcon` | GitHub ile giriş |
| `AppleIcon` | Apple ile giriş |

**Props:**
```typescript
interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number // Varsayılan: 24
}
```

---

## 🏗️ Layout Kit - Utils

### **navigation-examples.ts** - Hazır Menü Örnekleri

```typescript
import { 
  testNavGroups,
  cargoNavGroups,
  exampleBrandData 
} from '@arftech/arfweb-shared-lib/layout-kit'

export default function DashboardLayout() {
  return (
    <DashboardLayout
      brandData={exampleBrandData}
      userData={{ name: '...', email: '...' }}
      navGroups={testNavGroups} // Test menüsü
      showFooter
    />
  )
}
```

#### Hazır Navigation Setleri:

| Preset | Açıklama |
|--------|----------|
| `basicNavGroups` | Basit 2-sayfalık menü |
| `testNavGroups` | **Auth Kit + Layout Kit test sayfaları** |
| `ecommerceNavGroups` | E-ticaret örneği |
| `cargoNavGroups` | Kargo sistemi örneği (mevcut proje) |
| `nestedNavGroups` | 3 seviye nested menü |

#### Test Navigation İçeriği:

##### `testNavGroups` - Test Menüsü

```
Test & Geliştirme
├── Auth Kit Test
│   ├── Sign In (Standart)
│   ├── Sign In 2 (Split)
│   ├── OTP Doğrulama
│   ├── Şifremi Unuttum
│   └── Şifre Sıfırlama
├── Layout Kit Test
│   ├── Dashboard Layout
│   ├── Header Variants
│   ├── Sidebar Variants
│   └── Footer Variants
└── Component Gallery (45+ component)
```

---

## 💡 Kullanım Senaryoları

### 1️⃣ Sign In Form'da Validation

```typescript
'use client'
import { SignInForm } from '@arftech/arfweb-shared-lib/auth-kit'
import { 
  isValidEmail, 
  getPasswordStrength 
} from '@arftech/arfweb-shared-lib/auth-kit'

export default function CustomSignIn() {
  const handleSubmit = async (data) => {
    // Özel validation
    if (!isValidEmail(data.email)) {
      alert('Geçersiz email!')
      return
    }
    
    const passwordStrength = getPasswordStrength(data.password)
    if (passwordStrength < 2) {
      alert('Şifreniz çok zayıf!')
      return
    }
    
    // API call...
  }
  
  return <SignInForm onSignIn={handleSubmit} />
}
```

### 2️⃣ Token Yönetimi ile Protected Route

```typescript
'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getToken, isTokenExpired } from '@arftech/arfweb-shared-lib/auth-kit'

export default function ProtectedPage() {
  const router = useRouter()
  
  useEffect(() => {
    const token = getToken()
    
    if (!token || isTokenExpired(token)) {
      router.push('/auth/signin')
    }
  }, [router])
  
  return <div>Protected Content</div>
}
```

### 3️⃣ Custom Social Login Buttons

```typescript
import { GoogleIcon, GithubIcon } from '@arftech/arfweb-shared-lib/auth-kit'
import { Button } from '@/components/ui/button'

export function SocialLogins() {
  return (
    <div className="space-y-2">
      <Button variant="outline" className="w-full">
        <GoogleIcon size={20} className="mr-2" />
        Google ile Giriş
      </Button>
      
      <Button variant="outline" className="w-full">
        <GithubIcon size={20} className="mr-2" />
        GitHub ile Giriş
      </Button>
    </div>
  )
}
```

### 4️⃣ Test Ortamı Dashboard

```typescript
import { DashboardLayout, testNavGroups } from '@arftech/arfweb-shared-lib/layout-kit'

export default function TestLayout({ children }) {
  return (
    <DashboardLayout
      brandData={{
        title: 'Test Ortamı',
        subtitle: 'UI Kit Development',
        url: '/',
      }}
      userData={{
        name: 'Developer',
        email: 'dev@test.com',
        role: 'Admin',
      }}
      navGroups={testNavGroups} // Auth + Layout + Gallery testi
    >
      {children}
    </DashboardLayout>
  )
}
```

---

## 📊 Durum Raporu

### ✅ Auth Kit Utils (100%)
- ✅ `validation.ts` - 9 fonksiyon
- ✅ `token.ts` - 17 fonksiyon
- ✅ Barrel export

### ✅ Auth Kit Icons (100%)
- ✅ 11 özel ikon komponenti
- ✅ `IconProps` type definition
- ✅ Barrel export

### ✅ Layout Kit Utils (100%)
- ✅ 7 hazır navigation seti
- ✅ Test menüsü dahil
- ✅ `testNavGroups` - Auth Kit + Layout Kit test sayfaları
- ✅ Örnek brand/user data

---

## 🎯 Sonuç

**Tüm utils ve icons klasörleri artık dolu ve kullanıma hazır!**

- **Auth Kit:** 26 utility fonksiyonu + 11 ikon
- **Layout Kit:** 7 navigation preset'i + test menüsü
- **Test İnfrastrüktürü:** `testNavGroups` ile tüm kit'ler test edilebilir
- **TypeScript:** Tüm fonksiyonlar tam tip desteği ile

---

📖 **İlgili Dosyalar:**
- [Auth Kit Utils](src/auth-kit/utils/)
- [Auth Kit Icons](src/auth-kit/icons/)
- [Layout Kit Utils](src/layout-kit/utils/)
- [Layout Kit README](LAYOUT_KIT_README.md)
- [Tamamlanma Raporu](KIT_TAMAMLANMA_RAPORU.md)
