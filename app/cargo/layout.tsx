"use client"

import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { AppSidebar } from '@hascanb/arf-ui-kit/layout-kit'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import {
  Home,
  Package,
  Users,
  Building2,
  BarChart3,
  Wallet,
  Settings,
  Truck,
  FlaskConical,
} from 'lucide-react'

const brandData = {
  title: 'Kargo Sistemi',
  subtitle: 'Cargo Workspace',
  url: '/cargo',
  icon: Truck,
}

const userData = {
  name: 'Ahmet Yılmaz',
  email: 'ahmet@kargosistemi.com',
  avatar: '',
  role: 'Şube Yetkilisi',
}

const navGroups = [
  {
    label: 'Menü',
    items: [
      {
        title: 'Ana Sayfa',
        url: '/cargo',
        icon: Home,
      },
      {
        title: 'Kargolar',
        icon: Package,
        badge: '12',
        items: [
          { title: 'Tüm Kargolar', url: '/cargo/shipments' },
          { title: 'Yeni Kargo', url: '/cargo/shipments/new' },
          { title: 'Kargo Sorgula', url: '/cargo/shipments/track' },
        ],
      },
    ],
  },
  {
    label: 'Yönetim',
    items: [
      {
        title: 'Müşteriler',
        url: '/cargo/customers',
        icon: Users,
      },
      {
        title: 'Şubeler',
        url: '/cargo/branches',
        icon: Building2,
      },
    ],
  },
  {
    label: 'Analiz',
    items: [
      {
        title: 'Raporlar',
        url: '/cargo/reports',
        icon: BarChart3,
      },
      {
        title: 'Finans',
        url: '/cargo/finance',
        icon: Wallet,
      },
    ],
  },
  {
    label: 'Çalışma Alanları',
    items: [
      {
        title: 'Test ve Docs Hub',
        url: '/test',
        icon: FlaskConical,
      },
      {
        title: 'Ayarlar',
        url: '/cargo/settings',
        icon: Settings,
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
        onLogout={() => console.log('Çıkış yapıldı')}
      />
      <SidebarInset>{children}</SidebarInset>
      <Toaster />
      <Sonner />
    </SidebarProvider>
  )
}
