"use client"

import { useState } from 'react'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { AppSidebar, type SidebarSettingsModalConfig } from '@hascanb/arf-ui-kit/layout-kit'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
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
  KeyRound,
  Landmark,
  ListTree,
  Map,
  MapPinned,
  Package,
  Users,
  LayoutDashboard,
  LifeBuoy,
  Wallet,
  Settings,
  ShieldBan,
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
  Wrench,
  PackagePlus,
  Search,
  List,
  PackageX,
  Layers,
  Palette,
  Phone,
} from 'lucide-react'
import { ARF_ROUTES } from '../../_shared/routes'

const R = ARF_ROUTES.cargo

const brandData = {
  title: 'Kargo',
  subtitle: 'V1.0',
  url: R.root,
  icon: Package,
}

const brandOptions = [
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

const userData = {
  name: 'Ahmet Yılmaz',
  email: 'ahmet@kargosistemi.com',
  avatar: '',
  role: 'Şube Yetkilisi',
}

const supportTopics = [
  'Parça teslim durumunu nasıl güncellerim?',
  'Kargo iptal süreci nasıl ilerler?',
  'Teslimat Bilgi sekmesindeki uyarılar ne anlama geliyor?',
  'Takip numarasıyla hızlı sorgulama nasıl yapılır?',
]

const sidebarUserMenuLabels = {
  profile: 'Profil',
  settings: 'Ayarlar',
  logout: 'Çıkış Yap',
}

const sidebarSettingsModalConfig: SidebarSettingsModalConfig = {
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

const navGroups = [
  {
    items: [
      {
        title: 'Dashboard',
        icon: LayoutDashboard,
        items: [
          { title: 'Operasyon', url: R.dashboard.operasyon, icon: Activity },
          { title: 'Finans', url: R.dashboard.finans, icon: BadgeDollarSign },
          { title: 'Harita', url: R.dashboard.harita, icon: Map },
        ],
      },
      {
        title: 'Kargo İşlemleri',
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
        title: 'Tanımlamalar',
        icon: Wrench,
        items: [
          { title: 'Tedarikçiler', url: R.definitions.suppliers, icon: Factory },
          { title: 'Sürücüler', url: R.definitions.drivers, icon: UserRound },
          { title: 'Araçlar', url: R.definitions.vehicles, icon: Car },
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
          {
            title: 'Sistem',
            url: R.settings.root,
            items: [
              { title: 'Transfer Merkezleri', url: R.settings.system.transferCenters, icon: Landmark },
              { title: 'Şubeler', url: R.settings.system.branches, icon: Building2 },
              { title: 'İnterlandlar', url: R.settings.system.interlands, icon: MapPinned },
              { title: 'Yasaklı İnterlandlar', url: R.settings.system.blockedInterlands, icon: ShieldBan },
              { title: 'Banka Hesapları', url: R.settings.system.bankAccounts, icon: CreditCard },
              { title: 'Sistem Fiyat Tanımı', url: R.settings.system.systemPricing, icon: SlidersHorizontal },
              { title: 'Hatlar', url: R.settings.system.lines, icon: Route },
              { title: 'Mahalle', url: R.settings.system.neighborhoods, icon: Map },
              { title: 'Mesafeler', url: R.settings.system.distances, icon: Ruler },
              { title: 'Kullanıcılar', url: R.settings.system.users, icon: UsersRound },
              { title: 'Yetkiler', url: R.settings.system.permissions, icon: ShieldCheck },
            ],
          },
          { title: 'Entegrasyonlar', url: R.settings.integrations, icon: PlugZap },
          {
            title: 'Kullanıcı',
            url: R.settings.user.root,
            items: [
              { title: 'Şifre Değiştir', url: R.settings.user.changePassword, icon: KeyRound },
            ],
          },
        ],
      },
    ],
  },
]

export default function CargoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false)

  const quickActions = [
    {
      id: 'support',
      label: 'Yardım & Destek',
      icon: LifeBuoy,
      onSelect: () => setIsSupportModalOpen(true),
    },
  ]

  return (
    <SidebarProvider>
      <AppSidebar
        brand={brandData}
        brandOptions={brandOptions}
        addBrandLabel='Tümünü Gör'
        onAddBrand={() => {
          window.location.href = ARF_ROUTES.root
        }}
        userMenuLabels={sidebarUserMenuLabels}
        settingsModalConfig={sidebarSettingsModalConfig}
        user={userData}
        navGroups={navGroups}
        quickActions={quickActions}
        onLogout={() => console.log('Çıkış yapıldı')}
      />
      <SidebarInset>{children}</SidebarInset>

      <Dialog open={isSupportModalOpen} onOpenChange={setIsSupportModalOpen}>
        <DialogContent className='overflow-hidden p-0 sm:max-w-3xl'>
          <div className='border-b bg-linear-to-br from-lime-200/80 via-background to-background px-6 py-5'>
            <DialogHeader className='text-left'>
              <div className='mb-2 flex flex-wrap items-center gap-2'>
                <Badge className='bg-lime-300 text-black hover:bg-lime-300'>Yardım Merkezi</Badge>
                <Badge variant='outline'>Kargo V1.0</Badge>
              </div>
              <DialogTitle className='text-2xl font-semibold tracking-tight'>
                Yardım & Destek
              </DialogTitle>
              <DialogDescription className='max-w-2xl text-sm'>
                Operasyon, teslimat ve ekran kullanımıyla ilgili destek taleplerini buradan başlatabilirsiniz.
                Acil durumlarda öncelikli destek kanalını kullanın.
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className='space-y-6 px-6 py-5'>
            <section className='grid gap-3 md:grid-cols-3'>
              <button
                type='button'
                onClick={() => {
                  window.location.href = 'mailto:destek@kargosistemi.com?subject=ARF%20Kargo%20Destek%20Talebi'
                }}
                className='group rounded-xl border border-border bg-card p-4 text-left transition-colors hover:border-lime-300 hover:bg-lime-50/60'
              >
                <LifeBuoy className='mb-3 size-5 text-foreground/80 transition-transform group-hover:scale-105' />
                <p className='text-sm font-semibold'>Yeni Destek Talebi</p>
                <p className='mt-1 text-xs text-muted-foreground'>
                  Destek ekibine e-posta ile ekran görüntüsü ekleyerek detaylı talep açın.
                </p>
              </button>

              <button
                type='button'
                onClick={() => {
                  window.location.href = 'tel:+902120000000'
                }}
                className='group rounded-xl border border-border bg-card p-4 text-left transition-colors hover:border-lime-300 hover:bg-lime-50/60'
              >
                <Phone className='mb-3 size-5 text-foreground/80 transition-transform group-hover:scale-105' />
                <p className='text-sm font-semibold'>Acil Operasyon Hattı</p>
                <p className='mt-1 text-xs text-muted-foreground'>
                  Kritik sevkiyat sorunlarında doğrudan canlı operasyon hattını arayın.
                </p>
              </button>

              <button
                type='button'
                onClick={() => {
                  window.location.href = R.support
                }}
                className='group rounded-xl border border-border bg-card p-4 text-left transition-colors hover:border-lime-300 hover:bg-lime-50/60'
              >
                <BookOpenText className='mb-3 size-5 text-foreground/80 transition-transform group-hover:scale-105' />
                <p className='text-sm font-semibold'>Destek Dokümantasyonu</p>
                <p className='mt-1 text-xs text-muted-foreground'>
                  Sık yapılan işlemler ve kullanım adımlarını tek noktadan görüntüleyin.
                </p>
              </button>
            </section>

            <section className='grid gap-4 md:grid-cols-2'>
              <div className='rounded-xl border border-border bg-muted/20 p-4'>
                <p className='mb-3 text-sm font-semibold'>Sık Yardım Başlıkları</p>
                <div className='space-y-2'>
                  {supportTopics.map((topic) => (
                    <div key={topic} className='rounded-lg border border-border/70 bg-background px-3 py-2 text-xs text-foreground/85'>
                      {topic}
                    </div>
                  ))}
                </div>
              </div>

              <div className='rounded-xl border border-border bg-muted/20 p-4'>
                <p className='mb-3 text-sm font-semibold'>Servis Bilgisi</p>
                <div className='space-y-3 text-xs text-muted-foreground'>
                  <div className='rounded-lg border border-border/70 bg-background px-3 py-2'>
                    <p className='font-medium text-foreground'>Destek Saatleri</p>
                    <p>Pazartesi - Cumartesi, 08:00 - 22:00</p>
                  </div>
                  <div className='rounded-lg border border-border/70 bg-background px-3 py-2'>
                    <p className='font-medium text-foreground'>Hedef İlk Yanıt Süresi</p>
                    <p>Kritik taleplerde 15 dk, standart taleplerde 2 saat</p>
                  </div>
                  <div className='rounded-lg border border-border/70 bg-background px-3 py-2'>
                    <p className='font-medium text-foreground'>Öneri</p>
                    <p>Talep açarken takip no ve parça no bilgilerini ekleyin.</p>
                  </div>
                </div>
              </div>
            </section>

            <div className='flex flex-wrap justify-end gap-2'>
              <Button variant='outline' onClick={() => setIsSupportModalOpen(false)}>
                Kapat
              </Button>
              <Button
                onClick={() => {
                  window.location.href = 'mailto:destek@kargosistemi.com?subject=ARF%20Kargo%20Destek%20Talebi'
                }}
                className='bg-lime-400 text-black hover:bg-lime-300'
              >
                Talep Oluştur
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Toaster />
      <Sonner />
    </SidebarProvider>
  )
}
