"use client"

import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { AppSidebar } from '@hascanb/arf-ui-kit/layout-kit'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import {
  Activity,
  BadgeDollarSign,
  Banknote,
  BarChart3,
  BookOpenText,
  Building,
  Building2,
  Car,
  ClipboardList,
  CreditCard,
  Factory,
  FileSignature,
  FileSpreadsheet,
  GitBranch,
  HandCoins,
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
} from 'lucide-react'
import { ARF_ROUTES } from '../../_shared/routes'

const R = ARF_ROUTES.cargo

const brandData = {
  title: 'Kargo Sistemi',
  subtitle: 'Cargo Workspace',
  url: R.root,
  icon: Truck,
}

const userData = {
  name: 'Ahmet Yılmaz',
  email: 'ahmet@kargosistemi.com',
  avatar: '',
  role: 'Şube Yetkilisi',
}

const quickActions = [
  {
    id: 'support',
    label: 'Yardım & Destek',
    url: R.support,
    icon: LifeBuoy,
  },
]

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
  return (
    <SidebarProvider>
      <AppSidebar
        brand={brandData}
        user={userData}
        navGroups={navGroups}
        quickActions={quickActions}
        onLogout={() => console.log('Çıkış yapıldı')}
      />
      <SidebarInset>{children}</SidebarInset>
      <Toaster />
      <Sonner />
    </SidebarProvider>
  )
}
