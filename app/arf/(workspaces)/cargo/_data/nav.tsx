/**
 * Cargo layout için navigasyon verileri, marka konfigürasyonu ve kullanıcı verileri.
 * Gerçek backend bağlantısı kurulduğunda userData auth servisinden gelecek.
 */

import type { AppHeaderProps, SidebarSettingsModalConfig } from '@hascanb/arf-ui-kit/layout-kit'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
  Activity,
  BadgeDollarSign,
  Banknote,
  BarChart3,
  Bike,
  BookOpenText,
  Building,
  Building2,
  Car,
  ClipboardList,
  CreditCard,
  Boxes,
  Factory,
  FileSignature,
  FileSpreadsheet,
  GitBranch,
  HandCoins,
  Handshake,
  Landmark,
  ListTree,
  Map,
  MapPinned,
  Package,
  Users,
  LayoutDashboard,
  Wallet,
  Settings,
  ShieldCheck,
  SlidersHorizontal,
  Route,
  Ruler,
  ScrollText,
  Tags,
  Truck,
  Warehouse,
  PlugZap,
  Receipt,
  UserRound,
  UsersRound,
  PackagePlus,
  Search,
  List,
  PackageX,
  Layers,
  Palette,
} from 'lucide-react'
import { ARF_ROUTES } from '../../../_shared/routes'

const R = ARF_ROUTES.cargo

export const brandData = {
  title: 'Kargo',
  subtitle: 'V1.0',
  url: R.root,
  icon: Package,
}

export const brandOptions = [
  {
    id: 'cargo',
    title: 'Kargo',
    subtitle: 'V1.0',
    url: R.root,
    icon: Package,
    shortcut: '1',
  },
  {
    id: 'courier',
    title: 'Kurye',
    subtitle: 'Yakında',
    url: ARF_ROUTES.root,
    icon: Bike,
    shortcut: '2',
  },
  {
    id: 'logistics',
    title: 'Lojistik',
    subtitle: 'Yakında',
    url: ARF_ROUTES.root,
    icon: Truck,
    shortcut: '3',
  },
  {
    id: 'fleet',
    title: 'Filo',
    subtitle: 'Yakında',
    url: ARF_ROUTES.root,
    icon: Boxes,
    shortcut: '4',
  },
  {
    id: 'warehouse',
    title: 'Depo Yönetimi',
    subtitle: 'Yakında',
    url: ARF_ROUTES.root,
    icon: Warehouse,
    shortcut: '5',
  },
  {
    id: 'partner',
    title: 'Partner',
    subtitle: 'Yakında',
    url: ARF_ROUTES.root,
    icon: Handshake,
    shortcut: '6',
  },
]

// TODO: Replace with auth session data when backend is ready
export const userData = {
  name: 'Ahmet Yılmaz',
  email: 'ahmet@kargosistemi.com',
  avatar: '',
  role: 'Şube Yetkilisi',
}

export type SearchCommandFactory = (push: (url: string) => void) => NonNullable<AppHeaderProps['searchCommands']>

export const createCargoHeaderSearchCommands: SearchCommandFactory = (push) => [
  {
    id: 'open-drafts',
    label: 'Taslakları Aç',
    group: 'Hızlı İşlemler',
    keywords: ['taslak', 'kayıt', 'devam'],
    shortcut: 'T',
    onSelect: () => push(R.shipments.new),
  },
  {
    id: 'save-draft',
    label: 'Taslak Olarak Kaydet',
    group: 'Hızlı İşlemler',
    keywords: ['taslak', 'kaydet', 'kargo'],
    shortcut: 'K',
    onSelect: () => push(R.shipments.new),
  },
  {
    id: 'go-pieces',
    label: 'Parça Listesine Git',
    group: 'Gezinme',
    keywords: ['parça', 'liste', 'kargolar'],
    onSelect: () => push(R.shipments.pieces),
  },
  {
    id: 'go-pricing',
    label: 'Fiyatlandırmaya Git',
    group: 'Gezinme',
    keywords: ['fiyat', 'ücret', 'hesapla'],
    onSelect: () => push(R.settings.system.systemPricing),
  },
]

export const cargoHeaderInitialNotifications: NonNullable<AppHeaderProps['notifications']> = [
  {
    id: 'fallback-notif-1',
    title: 'Taslak kaydı güncellendi',
    description: 'Son düzenlemeler yeni kargo taslağına işlendi.',
    timeLabel: 'Az önce',
    isRead: false,
  },
  {
    id: 'fallback-notif-2',
    title: 'Parça listesi hazır',
    description: 'Kayda devam etmek için fiyatlandırma bölümüne geçebilirsiniz.',
    timeLabel: '2 dk önce',
    isRead: false,
  },
  {
    id: 'fallback-notif-3',
    title: 'Hızlı işlem ipucu',
    description: 'Cmd/Ctrl + K ile hızlı komut penceresini açabilirsiniz.',
    timeLabel: '10 dk önce',
    isRead: true,
  },
]

export const supportTopics = [
  'Parça teslim durumunu nasıl güncellerim?',
  'Kargo iptal süreci nasıl ilerler?',
  'Teslimat Bilgi sekmesindeki uyarılar ne anlama geliyor?',
  'Takip numarasıyla hızlı sorgulama nasıl yapılır?',
]

export const sidebarUserMenuLabels = {
  profile: 'Profil',
  settings: 'Ayarlar',
  logout: 'Çıkış Yap',
}

export const sidebarSettingsModalConfig: SidebarSettingsModalConfig = {
  labels: {
    title: 'Ayarlar',
    rootBreadcrumb: 'Ayarlar',
    closeSrText: 'Kapat',
  },
  sections: [
    { id: 'profile', label: 'Profil', icon: UserRound },
    { id: 'theme', label: 'Tema', icon: Palette },
  ],
  defaultSectionId: 'profile',
  profileSectionId: 'profile',
  settingsSectionId: 'theme',
  renderContent: (activeSection) => {
    if (activeSection.id === 'theme') {
      return (
        <div className='space-y-4'>
          <div className='rounded-2xl border bg-card p-5'>
            <h3 className='text-base font-semibold'>Tema Tercihi</h3>
            <p className='mt-1 text-sm text-muted-foreground'>
              Uygulama görünümünü kişisel tercihinize göre ayarlayın.
            </p>
            <div className='mt-4 grid gap-2 sm:grid-cols-3'>
              <button type='button' className='rounded-lg border border-lime-300 bg-lime-50 px-3 py-2 text-sm font-medium'>Açık</button>
              <button type='button' className='rounded-lg border px-3 py-2 text-sm'>Koyu</button>
              <button type='button' className='rounded-lg border px-3 py-2 text-sm'>Sistem</button>
            </div>
          </div>
          <div className='rounded-2xl border bg-card p-5'>
            <h3 className='text-base font-semibold'>Görünüm Ayarları</h3>
            <div className='mt-4 space-y-4'>
              <div className='flex items-center justify-between rounded-lg border bg-muted/20 px-3 py-2'>
                <div>
                  <p className='text-sm font-medium'>Kompakt Liste Görünümü</p>
                  <p className='text-xs text-muted-foreground'>Tablolarda daha fazla satır gösterir.</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className='flex items-center justify-between rounded-lg border bg-muted/20 px-3 py-2'>
                <div>
                  <p className='text-sm font-medium'>Animasyonları Azalt</p>
                  <p className='text-xs text-muted-foreground'>Geçiş efektlerini sadeleştirir.</p>
                </div>
                <Switch />
              </div>
            </div>
            <div className='mt-4 flex justify-end'>
              <Button className='bg-lime-400 text-black hover:bg-lime-300'>Tema Ayarlarını Kaydet</Button>
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className='space-y-4'>
        <div className='rounded-2xl border bg-card p-5'>
          <h3 className='text-base font-semibold'>Profil Bilgileri</h3>
          <p className='mt-1 text-sm text-muted-foreground'>Hesap bilgileriniz görüntülenir.</p>
          <div className='mt-4 grid gap-3 sm:grid-cols-2'>
            <div className='rounded-lg border bg-muted/20 px-3 py-2'>
              <p className='text-xs text-muted-foreground'>Ad Soyad</p>
              <p className='text-sm font-medium'>{userData.name}</p>
            </div>
            <div className='rounded-lg border bg-muted/20 px-3 py-2'>
              <p className='text-xs text-muted-foreground'>Rol</p>
              <p className='text-sm font-medium'>{userData.role}</p>
            </div>
            <div className='rounded-lg border bg-muted/20 px-3 py-2 sm:col-span-2'>
              <p className='text-xs text-muted-foreground'>E-posta</p>
              <p className='text-sm font-medium'>{userData.email}</p>
            </div>
          </div>
        </div>

        <div className='rounded-2xl border bg-card p-5'>
          <h3 className='text-base font-semibold'>Şifre Değiştir</h3>
          <p className='mt-1 text-sm text-muted-foreground'>Şifrenizi güvenli şekilde güncelleyin.</p>
          <div className='mt-4 grid gap-3'>
            <div className='space-y-1.5'>
              <Label htmlFor='current-password'>Mevcut Şifre</Label>
              <Input id='current-password' type='password' placeholder='Mevcut şifrenizi girin' />
            </div>
            <div className='space-y-1.5'>
              <Label htmlFor='new-password'>Yeni Şifre</Label>
              <Input id='new-password' type='password' placeholder='Yeni şifrenizi girin' />
            </div>
            <div className='space-y-1.5'>
              <Label htmlFor='new-password-confirm'>Yeni Şifre (Tekrar)</Label>
              <Input id='new-password-confirm' type='password' placeholder='Yeni şifrenizi tekrar girin' />
            </div>
          </div>
          <div className='mt-4 flex justify-end'>
            <Button className='bg-lime-400 text-black hover:bg-lime-300'>Şifreyi Güncelle</Button>
          </div>
        </div>
      </div>
    )
  },
}

export const navGroups = [
  {
    items: [
      {
        title: 'Dashboard',
        url: R.root,
        icon: LayoutDashboard,
        items: [
          { title: 'Kargo', url: R.dashboard.kargo, icon: Package },
          { title: 'Operasyon', url: R.dashboard.operasyon, icon: Truck },
          { title: 'Finans', url: R.dashboard.finans, icon: Wallet },
        ],
      },
      {
        title: 'Kargo İşlemleri',
        url: R.shipments.list,
        icon: Package,
        items: [
          { title: 'Yeni Kargo', url: R.shipments.new, icon: PackagePlus },
          { title: 'Kargo Sorgula', url: R.shipments.track, icon: Search },
          { title: 'Kargo Listesi', url: R.shipments.list, icon: List },
          { title: 'İptal Kargo Listesi', url: R.shipments.canceled, icon: PackageX },
          { title: 'Parça Listesi', url: R.shipments.pieces, icon: Layers },
        ],
      },
      {
        title: 'Operasyon İşlemleri',
        icon: Truck,
        items: [
          { title: 'Sefer Listesi', url: R.operations.routes, icon: Route },
          { title: 'Hat Listesi', url: R.operations.lines, icon: GitBranch },
          { title: 'KTF Listesi', url: R.operations.ktf, icon: ClipboardList },
          { title: 'İnterland Birimleri', url: R.operations.interlandUnits, icon: Building2 },
          { title: 'Tedarikçiler', url: R.definitions.suppliers, icon: Factory },
          { title: 'Sürücüler', url: R.definitions.drivers, icon: UserRound },
          { title: 'Araçlar', url: R.definitions.vehicles, icon: Car },
        ],
      },
      {
        title: 'Satış & Pazarlama',
        icon: Users,
        items: [
          { title: 'Müşteriler', url: R.sales.customers, icon: UsersRound },
          { title: 'Sözleşmeler', url: R.sales.contracts, icon: FileSignature },
          { title: 'Fiyat Listesi', url: R.sales.priceLists, icon: Tags },
        ],
      },

      {
        title: 'Finans & Muhasebe',
        icon: Wallet,
        items: [
          {
            title: 'Şube & Transfer Merkezi',
            url: R.finance.branchTransferCenter.root,
            items: [
              { title: 'Faturalar', url: R.finance.branchTransferCenter.invoices, icon: Receipt },
              { title: 'Şube Kasa', url: R.finance.branchTransferCenter.branchCash, icon: Wallet },
              { title: 'Şube Kasa Özet', url: R.finance.branchTransferCenter.branchCashSummary, icon: BarChart3 },
              { title: 'Şube Hakediş Detay', url: R.finance.branchTransferCenter.branchEntitlementDetail, icon: ScrollText },
              { title: 'Transfer Merkezi Hakediş Detay', url: R.finance.branchTransferCenter.transferCenterEntitlementDetail, icon: FileSpreadsheet },
            ],
          },
          {
            title: 'Genel Merkez',
            url: R.finance.headOffice.root,
            items: [
              { title: 'Müşteri Kasası', url: R.finance.headOffice.customerCash, icon: Banknote },
              { title: 'Müşteri Kasa Listesi', url: R.finance.headOffice.customerCashList, icon: BookOpenText },
              { title: 'Tahsilat Ekstre', url: R.finance.headOffice.collectionStatement, icon: HandCoins },
              { title: 'Şube Kasaları', url: R.finance.headOffice.branchCashes, icon: Building },
              { title: 'Şube Kasa Listeleri', url: R.finance.headOffice.branchCashLists, icon: ListTree },
              { title: 'Şube Hakediş Listesi', url: R.finance.headOffice.branchEntitlementList, icon: Landmark },
              { title: 'Transfer Merkezi Hakediş Listesi', url: R.finance.headOffice.transferCenterEntitlementList, icon: CreditCard },
            ],
          },
        ],
      },
      {
        title: 'Ayarlar',
        icon: Settings,
        items: [
          { title: 'Transfer Merkezleri', url: R.settings.system.transferCenters, icon: Landmark },
          { title: 'Şubeler', url: R.settings.system.branches, icon: Building2 },
          { title: 'İnterlandlar', url: R.settings.system.interlands, icon: MapPinned },
          { title: 'Banka Hesapları', url: R.settings.system.bankAccounts, icon: CreditCard },
          { title: 'Fiyat Tanımları', url: R.settings.system.systemPricing, icon: SlidersHorizontal },
          { title: 'Adres Tanımları', url: R.settings.system.neighborhoods, icon: Map },
          { title: 'Mesafe Tanımları', url: R.settings.system.distances, icon: Ruler },
          { title: 'Kullanıcılar', url: R.settings.system.users, icon: UsersRound },
          { title: 'Roller', url: R.settings.roles, icon: ShieldCheck },
          { title: 'Entegrasyonlar', url: R.settings.integrations, icon: PlugZap },
        ],
      },
    ],
  },
]
