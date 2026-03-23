# Mimari Kural Seti

> Bu doküman, `arf-ui-kit-new` monoreposunun geliştirme standartlarını belirler.
> Kit ve frontend ayrıldıktan sonra, backend bağlandıktan sonra da bu kurallar geçerliliğini korur.
> Her PR/geliştirme önce bu kural setine göre değerlendirilir.

---

## 1. Proje Yapısı ve Katman Sorumlulukları

```
arf-ui-kit-new/
├── src/           → KIT katmanı  (yayınlanacak npm paketi: @hascanb/arf-ui-kit)
├── app/           → UYGULAMA katmanı  (Next.js App Router)
│   └── arf/(workspaces)/cargo/   → Cargo iş uygulaması
└── playground/    → Kit geliştirme sandbox'ı (production build'e dahil edilmez)
```

### 1.1 Katmanlar ve Sorumluluğu

| Katman | Yer | Ne içerir | Ne içermez |
|--------|-----|-----------|------------|
| **Kit** | `src/` | Generic UI bileşenleri, mekanizmalar, tipler, hook'lar | İş mantığı, Türkçe metin, uygulama config |
| **App** | `app/arf/` | Sayfa yönlendirme, iş mantığı, uygulama config, mock/gerçek veri | Generic UI implementasyonu |
| **Playground** | `playground/` | Kit geliştirme testleri, izole demo | Production kodu, iş mantığı |

### 1.2 Bağımlılık Yönü

```
App  →  Kit  (app, kit'i kullanır)
Kit  ✗  App  (kit, app'e bağımlı OLAMAZ)
App  →  Backend API  (app, backend'e fetch/action ile bağlanır)
Kit  ✗  Backend API  (kit, doğrudan API çağrısı YAPAMAZ)
```

---

## 2. Next.js App Router Kuralları

### 2.1 Server vs Client Component Kararı

```
Önce Server Component dene.
Sadece aşağıdaki ihtiyaçlar varsa "use client" ekle:
  - useState / useReducer
  - useEffect / lifecycle
  - Browser API (window, localStorage, navigator)
  - Event handler (onClick, onChange) — RSC'de de mümkün ama side-effect içeriyorsa
  - Üçüncü parti client-only kütüphane
```

**Karar ağacı:**
```
Veri çekiyor mu?
  ├─ Evet → Server Component (async/await doğrudan)
  └─ Hayır → State/Event var mı?
               ├─ Evet → Client Component ("use client")
               └─ Hayır → Server Component (statik render)
```

### 2.2 `page.tsx` Kuralları

- `page.tsx` **Server Component** olmalıdır (varsayılan, "use client" YOK)
- `page.tsx` async olabilir (data fetch için)
- `page.tsx` düzenleyici/orkestratör rolündedir: layout'u düzenler, alt bileşenlere veri geçer
- `page.tsx` içinde iş mantığı UI kodu karışık **olmamalıdır**; ikincil bileşenler `_components/` klasörüne taşınır
- `page.tsx` içinde `useState`, `useEffect` **kullanılmaz**

```tsx
// ✅ DOĞRU
export default async function CustomersPage() {
  const customers = await fetchCustomers()   // server-side fetch
  return (
    <main>
      <PageHeader title="Müşteriler" />
      <CustomersTableSection initialData={customers} />  {/* client bileşen */}
    </main>
  )
}

// ❌ YANLIŞ
"use client"
export default function CustomersPage() {
  const [data, setData] = useState([])
  useEffect(() => { fetch("/api/customers").then(...) }, [])
  return <table>...</table>
}
```

### 2.3 `layout.tsx` Kuralları

- Layout, tüm modülün shared shell'ini içerir (navigasyon, provider sarmalayıcılar)
- Layout "use client" olabilir (Provider'lar genelde client gerektirir)
- Layout **veri fetch etmez**; bunun için üst page veya provider kullanılır
- Layout içinde modal, dialog gibi inline UI bileşenleri **bulunmamalıdır** → `_components/` klasörüne taşınır
- Layout'taki navigasyon verisi (navGroups, brandData) ayrı bir `_data/nav.ts` dosyasına çıkarılır

### 2.4 Route Organizasyonu

```
cargo/
├── layout.tsx                    ← Shell: sidebar, header defaults, providers
├── page.tsx                      ← Dashboard (server)
├── _data/
│   └── nav.ts                    ← Navigasyon menüsü, brand data
├── customers/
│   ├── page.tsx                  ← Server: liste fetch + render
│   ├── _components/
│   │   └── customers-table-section.tsx  ← Client: tablo + filtre UI
│   └── [customerId]/
│       ├── page.tsx              ← Server: detay fetch + render
│       └── _components/          ← Client modal, form, aksiyon bileşenleri
├── shipments/
│   ├── page.tsx                  ← Server (veya Client: DataTable büyükse)
│   ├── _api/                     ← API çağrı fonksiyonları
│   ├── _columns/                 ← DataTable kolon tanımları
│   ├── _components/              ← Modal, form bileşenleri
│   ├── _hooks/                   ← Custom hooklar
│   ├── _mock/                    ← Geçici mock data (backend hazır olunca silinir)
│   └── _types/                   ← Bu modüle özel TS tipleri
```

---

## 3. Dosya ve Klasör Organizasyonu

### 3.1 İsimlendirme Kuralları

| Tür | Format | Örnek |
|-----|--------|-------|
| Sayfa dosyası | `kebab-case.tsx` | `page.tsx`, `layout.tsx` |
| Component dosyası | `kebab-case.tsx` | `customer-table-section.tsx` |
| Hook dosyası | `use-kebab-case.ts` | `use-shipment-modal-manager.ts` |
| Type dosyası | `kebab-case.ts` | `shipment-types.ts` |
| API/fetch dosyası | `kebab-case-api.ts` | `shipment-actions-api.ts` |
| Mock dosyası | `kebab-case-mock.ts` | `shipments-mock-data.ts` |
| Kolon tanımı | `kebab-case-columns.tsx` | `shipments-columns.tsx` |
| Component export | `PascalCase` | `CustomerTableSection` |
| Hook export | `useCamelCase` | `useShipmentModalManager` |
| Type export | `PascalCase` | `ShipmentRecord`, `ShipmentStatus` |

### 3.2 `_components/` İçindeki Dosya Sınıflandırması

```
_components/
├── *-section.tsx      ← Büyük interaktif bloklar ("use client", DataTable, form)
├── *-modal.tsx        ← Dialog/Sheet modal bileşenleri ("use client")
├── *-actions.tsx      ← Aksiyon butonları grubu ("use client")
├── *-card.tsx         ← Kart UI bileşeni (server veya client)
└── *-form.tsx         ← Form bileşeni ("use client", RHF bağlı)
```

### 3.3 Her Büyük Modül İçin Zorunlu Klasörler

Bir modül _gerçek veri çekecekse_ şu klasörler olmalıdır (henüz mock olsa bile):

```
modül/
├── _api/       ← fetch fonksiyonları (şimdi mock döner, sonra gerçek API'ye bağlanır)
├── _types/     ← bu modüle özel tipler
└── _mock/      ← geçici test verisi
```

---

## 4. Kit (`src/`) Geliştirme Standartları

### 4.1 Temel İlkeler

- **Sıfır iş mantığı**: Kit, uygulamaya özgü mantık içermez — hiçbir zaman.
- **Sıfır Türkçe metin**: UI string'leri ya prop ile alınır ya i18n mekanizmasıyla sağlanır.
- **Sıfır hard-coded veri**: Navigasyon, bildirim, kullanıcı verisi kit içinde olmaz.
- **Mekanizma sağlar, içerik almaz**: Kit bileşenleri şablon/mekanizma sunar; içeriği uygulama doldurur.

### 4.2 Kit İçinde "Use Client" Kararı

- Kit'te `"use client"` **direktifi** kullanılabilir; ancak sadece gerçekten client ihtiyacı olan bileşenler için.
- Her kit modülünün `index.ts`'i barrel export sağlar.

### 4.3 Kit'ten Uygulama'ya Veri Aktarımı

**Context + Provider pattern** kullanılır. Örnek:

```tsx
// Kit: mekanizma (src/layout-kit/context/app-header-defaults-context.tsx)
export function AppHeaderDefaultsProvider({ value, children }) { ... }
export function useAppHeaderDefaults() { ... }

// Uygulama: içerik (app/arf/(workspaces)/cargo/layout.tsx)
<AppHeaderDefaultsProvider value={{ searchPlaceholder: "Hızlı arama...", ... }}>
  {children}
</AppHeaderDefaultsProvider>
```

### 4.4 Kit Sub-modül Yapısı

Her `src/*-kit/` alt modülü:
```
*-kit/
├── index.ts         ← Barrel export (TÜM public API buradan)
├── components/      ← UI bileşenleri
├── context/         ← React Context + Provider
├── hooks/           ← Custom hooklar
├── types.ts         ← Public tip tanımları
└── utils/           ← Yardımcı fonksiyonlar
```

### 4.5 Kit Versiyon ve Changelog

- Her breaking change için `CHANGELOG.md` güncellenir.
- Semantic versioning: `MAJOR.MINOR.PATCH`
  - MAJOR: kırıcı değişiklik
  - MINOR: geriye dönük uyumlu yeni özellik
  - PATCH: hata düzeltme

---

## 5. State Yönetimi

### 5.1 State Katmanları

| State türü | Çözüm | Yer |
|-----------|-------|-----|
| Server verisi (liste, detay) | RSC async fetch → props | page.tsx |
| UI durumu (modal açık/kapalı, seçili tab) | `useState` | İlgili client bileşen |
| Form durumu | `react-hook-form` + `zod` | form bileşeni |
| Filtre/sıralama/sayfalama (URL'de kalmalı) | `useSearchParams` + URL state | section bileşen |
| Layout-level shared state (header defaults) | React Context | layout.tsx provider |
| Global app state | **Yok** — ihtiyaç duyulursa `Zustand` | Sadece gerçek ihtiyaçta |

### 5.2 URL State Kuralları

Filtreler, sıralama ve sayfalama **URL'de** tutulur (bookmarkable, paylaşılabilir, SSR-uyumlu):

```tsx
// ✅ DOĞRU
const searchParams = useSearchParams()
const page = searchParams.get("page") ?? "1"
const status = searchParams.get("status") ?? "all"

// ❌ YANLIŞ
const [page, setPage] = useState(1)
const [status, setStatus] = useState("all")
```

---

## 6. Veri Çekme Katmanı

### 6.1 Veri Akışı (Şimdiki → Gelecek)

```
Şimdi (Mock):
  page.tsx  →  _api/module-api.ts  →  _mock/module-mock-data.ts

Gelecekte (Backend bağlı):
  page.tsx  →  _api/module-api.ts  →  fetch("/api/v1/endpoint", { headers: {...} })
```

### 6.2 `_api/` Dosyası Kuralları

```ts
// ✅ DOĞRU: Tipler açık, dönüş tipi belli, error handling var
export async function fetchCustomers(filters: CustomerFilter): Promise<CustomerRecord[]> {
  // Şimdilik mock
  return mockCustomers.filter(...)
  
  // Backend hazır olunca:
  // const res = await fetch(`${API_BASE}/customers`, { ... })
  // if (!res.ok) throw new ApiError(res)
  // return res.json()
}

// ❌ YANLIŞ: any tipi, inline mock, hata yönetimi yok
const data = await fetch("/api/customers").then(r => r.json()) as any
```

### 6.3 Mock Data Kuralları

- Mock data `_mock/` klasöründe tutulur.
- Her mock dosyasının başına `// TODO: Remove when API is ready` yorumu eklenir.
- Mock data production build'e dahil edilmez (gelecekte env flag ile korunur).
- Mock yapısı gerçek API response'unu birebir yansıtır (aynı tip, alan adları).

---

## 7. TypeScript Standartları

### 7.1 Strict Kuralları

- `any` tipi **yasaktır** — `unknown` veya gerçek tip kullanılır.
- `as` type assertion **gerekçesiz kullanılmaz** — sadece kaçınılmaz yerlerde.
- Component props her zaman interface/type ile tanımlanır.
- API response tipleri `_types/` veya `types.ts` dosyasında tutulur.

### 7.2 Tip Konumlandırma

```
Paylaşılan tipler    → src/*-kit/types.ts  (kit tarafı)
Modüle özel tipler  → app/*/[modül]/_types/  (app tarafı)
Prop tipleri        → bileşenin kendi dosyasında (co-located)
```

### 7.3 Zorunlu Tipler

Her modülde şunlar her zaman tiplenmiş olmalıdır:
- API response nesneleri (`*Record`, `*Response`)
- Status enum/union'ları (`*Status`)
- Form şema tipleri (`z.infer<typeof formSchema>`)
- Component props'ları

---

## 8. Performans Kuralları

### 8.1 Bundle Boyutu

- İkon import'ları **named import** ile yapılır (`import { Package } from "lucide-react"`) — **wildcard yasak**.
- Ağır client bileşenler `next/dynamic` ile lazy load edilir:

```tsx
const HeavyChart = dynamic(() => import("./_components/heavy-chart"), { ssr: false })
```

- Büyük mock veri dosyaları client bundle'a dahil olmamalıdır (server-only).

### 8.2 Re-render Optimizasyonu

- `useMemo` ve `useCallback`: sadece ölçülmüş performans problemi varsa kullanılır (erken optimizasyon olmaz).
- DataTable kolon tanımları (`columns`) bileşen dışında veya `useMemo` içinde tanımlanır — render döngüsünde yeniden oluşturulmaz.

### 8.3 Görsel Performans

- Görseller `<Image>` (next/image) ile kullanılır — HTML `<img>` yasak.
- Font'lar `next/font` ile yüklenir.

---

## 9. Backend Entegrasyon Hazırlık Kuralları

### 9.1 API Client Yapısı

Backend bağlanmadan önce `app/lib/api-client.ts` hazırlanır:

```ts
// app/lib/api-client.ts
const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000"

export async function apiGet<T>(path: string): Promise<T> { ... }
export async function apiPost<T>(path: string, body: unknown): Promise<T> { ... }
export async function apiPatch<T>(path: string, body: unknown): Promise<T> { ... }
export async function apiDelete(path: string): Promise<void> { ... }
```

### 9.2 Environment Değişkenleri

| Değişken | Açıklama |
|----------|----------|
| `NEXT_PUBLIC_API_URL` | Backend base URL |
| `NEXT_PUBLIC_APP_ENV` | `development` / `staging` / `production` |

### 9.3 Server Action vs API Route

- Mutasyon (create, update, delete) → **Server Action** (`"use server"`)
- Harici backend sorgusu → `_api/` içine fetch, server component'ten çağrılır
- Real-time veya polling → client-side fetch (SWR veya React Query)

---

## 10. Güvenlik Kuralları

### 10.1 Input Validation

- Her form `zod` ile şema doğrulaması yapar — hem client (RHF) hem server action tarafında.
- URL parametrelerinden gelen değerler parse edilmeden kullanılmaz.

### 10.2 Hassas Veri

- Token, API key, secret `process.env` ile alınır — kaynak kodda kesinlikle olmaz.
- `NEXT_PUBLIC_` prefix'i **sadece** frontend'in görmesi gereken değerlere verilir.
- Mock data içinde gerçek kişisel veri (TC, telefon, e-posta) kullanılmaz.

---

## 11. Antipattern Yasak Listesi

| # | Yasak | Doğrusu |
|---|-------|---------|
| 1 | `page.tsx`'de `"use client"` + `useState` + `useEffect` + fetch | Server Component + RSC fetch; etkileşim için `_components/*-section.tsx` |
| 2 | Kit (`src/`) içinde Türkçe hard-coded metin | i18n prop'u veya uygulama katmanından Context ile geçirme |
| 3 | Kit (`src/`) içinde iş mantığı / uygulama config | Bu içerikler uygulama `layout.tsx` veya provider'a taşınır |
| 4 | Native HTML `<table>` listeler için | `DataTable` (datatable-kit) kullanılır |
| 5 | Kolon tanımları ve tipler `page.tsx` içinde inline | `_columns/` ve `_types/` klasörlerine ayrılır |
| 6 | `layout.tsx` içinde `Dialog`/modal UI kodu | `_components/settings-modal.tsx` gibi ayrı dosyaya çıkarılır |
| 7 | `layout.tsx` içinde navigasyon/kullanıcı verisi | `_data/nav.ts` dosyasına çıkarılır |
| 8 | Production sayfasından test rotasına (`/test/`) yönlendirme | Ya gerçek sayfa yapılır ya da 404 |
| 9 | Mock data `page.tsx` veya `layout.tsx` içinde inline | `_mock/` klasöründe ayrı dosya |
| 10 | TypeScript `any` tipi kullanımı | Gerçek tip veya `unknown` |
| 11 | Lucide gibi kütüphanelerden wildcard import | Named import: `import { X } from "lucide-react"` |
| 12 | `window.location.href` ile navigasyon | `useRouter().push()` veya `<Link>` |
| 13 | `<img>` HTML tag | `<Image>` (next/image) |
| 14 | Form yönetimi manuel `useState` ile | `react-hook-form` + `zod` + form-kit |

---

## 12. Kod İnceleme Kontrol Listesi

Her geliştirme tamamlandığında şu sorular geçilir:

- [ ] `page.tsx` server component mi?
- [ ] Etkileşimli parçalar `_components/*-section.tsx`'e ayrıldı mı?
- [ ] Tablo varsa `DataTable` kit mi kullanıldı?
- [ ] Kolon tanımları `_columns/`'a, tipler `_types/`'a çıkarıldı mı?
- [ ] Fetch varsa `_api/` fonksiyonundan mı geçiyor?
- [ ] Kit (`src/`) içine uygulama kodu/içerik girmedi mi?
- [ ] `any` tipi kullanılmadı mı?
- [ ] TypeScript hata yok mu? (`tsc --noEmit`)
- [ ] Mock data `_mock/` klasöründe mi?
- [ ] URL state kullanılması gereken filtre varsa `useSearchParams` mı kullanıldı?

---

## 13. Geçiş Planı (Monorepo → Ayrı Repolar)

### Aşama 1: Şu an (Monorepo geliştirme)
- `src/` = kit, `app/` = cargo uygulaması aynı repoda
- Kit değişiklikleri anında `app/`'e yansır
- `playground/` izole test ortamı

### Aşama 2: Kit ayrıştırma
- `src/` → yeni `arf-ui-kit` reposuna taşınır
- `tsconfig.build.json` + build pipeline hazırlanır
- npm'e publish edilir: `@hascanb/arf-ui-kit`
- `app/` package.json: `"@hascanb/arf-ui-kit": "^x.y.z"` (versiyon pin'li)

### Aşama 3: Backend bağlantısı
- `_api/` dosyaları mock'tan gerçek fetch'e geçirilir
- `app/lib/api-client.ts` aktive edilir
- Server Action'lar yazılır
- Mock dosyaları (`_mock/`) silinir

---

*Son güncelleme: Mart 2026*
