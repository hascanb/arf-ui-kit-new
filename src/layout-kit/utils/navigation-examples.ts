/**
 * Layout Kit - Navigation Examples
 * 
 * Sidebar ve navigation yapılandırması için örnek data setleri
 */

import {
  Home,
  Package,
  Users,
  Building2,
  BarChart3,
  Wallet,
  Settings,
  Truck,
  TestTube2,
  ShieldCheck,
  LayoutDashboard,
  FileText,
  Bell,
  Table,
  Palette,
} from 'lucide-react'
import type { BrandData, UserData, NavGroup } from '../context/types'

/**
 * Örnek Marka/Logo Verisi
 */
export const exampleBrandData: BrandData = {
  title: 'ARF UI Kit',
  subtitle: 'Component Library v1.0',
  url: '/',
  icon: LayoutDashboard,
}

/**
 * Örnek Kullanıcı Verisi
 */
export const exampleUserData: UserData = {
  name: 'Demo User',
  email: 'demo@example.com',
  avatar: '',
  role: 'Admin',
}

/**
 * Temel Navigation Örneği
 */
export const basicNavGroups: NavGroup[] = [
  {
    label: 'Ana Menü',
    items: [
      {
        title: 'Ana Sayfa',
        url: '/',
        icon: Home,
      },
      {
        title: 'Dashboard',
        url: '/dashboard',
        icon: LayoutDashboard,
      },
    ],
  },
  {
    label: 'Sayfalar',
    items: [
      {
        title: 'Dokümanlar',
        url: '/documents',
        icon: FileText,
      },
      {
        title: 'Bildirimler',
        url: '/notifications',
        icon: Bell,
        badge: '5',
      },
    ],
  },
  {
    items: [
      {
        title: 'Ayarlar',
        url: '/settings',
        icon: Settings,
      },
    ],
  },
]

/**
 * Test & Development Navigation Örneği
 * Auth Kit ve UI Components test sayfaları için
 */
export const testNavGroups: NavGroup[] = [
  {
    label: 'Ana Menü',
    items: [
      {
        title: 'Ana Sayfa',
        url: '/',
        icon: Home,
      },
    ],
  },
  {
    label: 'Test & Geliştirme',
    items: [
      {
        title: 'Auth Kit Test',
        icon: ShieldCheck,
        items: [
          { title: 'Sign In (Standart)', url: '/auth/signin' },
          { title: 'Sign In 2 (Split)', url: '/auth/signin2' },
          { title: 'OTP Doğrulama', url: '/auth/otp' },
          { title: 'Şifremi Unuttum', url: '/auth/forgot-password' },
          { 
            title: 'Şifre Sıfırlama', 
            url: '/auth/reset-password?token=demo' 
          },
        ],
      },
      {
        title: 'Layout Kit Test',
        icon: LayoutDashboard,
        items: [
          { title: 'Dashboard Layout', url: '/test/layout/dashboard' },
          { title: 'Header Variants', url: '/test/layout/header' },
          { title: 'Sidebar Variants', url: '/test/layout/sidebar' },
          { title: 'Footer Variants', url: '/test/layout/footer' },
        ],
      },
      {
        title: 'DataTable Kit Test',
        icon: Table,
        items: [
          { title: 'Basic DataTable', url: '/test/datatable/basic' },
          { title: 'Advanced Features', url: '/test/datatable/advanced' },
          { title: 'Server-Side', url: '/test/datatable/server-side' },
        ],
      },
      {
        title: 'Form Kit Test',
        icon: FileText,
        items: [
          { title: 'Form Examples', url: '/test/form' },
        ],
      },
      {
        title: 'Component Gallery',
        url: '/gallery',
        icon: Palette,
        badge: '45+',
      },
    ],
  },
  {
    items: [
      {
        title: 'Ayarlar',
        url: '/settings',
        icon: Settings,
      },
    ],
  },
]

/**
 * E-ticaret Navigation Örneği
 */
export const ecommerceNavGroups: NavGroup[] = [
  {
    label: 'Menü',
    items: [
      {
        title: 'Ana Sayfa',
        url: '/',
        icon: Home,
      },
      {
        title: 'Ürünler',
        icon: Package,
        items: [
          { title: 'Tüm Ürünler', url: '/products' },
          { title: 'Yeni Ürün Ekle', url: '/products/new' },
          { title: 'Kategoriler', url: '/products/categories' },
          { title: 'Stok Yönetimi', url: '/products/inventory' },
        ],
      },
    ],
  },
  {
    label: 'Müşteriler',
    items: [
      {
        title: 'Müşteri Listesi',
        url: '/customers',
        icon: Users,
        badge: '234',
      },
      {
        title: 'Siparişler',
        url: '/orders',
        icon: Package,
        badge: '12',
      },
    ],
  },
  {
    label: 'Analiz',
    items: [
      {
        title: 'Raporlar',
        url: '/reports',
        icon: BarChart3,
      },
      {
        title: 'Finans',
        url: '/finance',
        icon: Wallet,
      },
    ],
  },
  {
    items: [
      {
        title: 'Ayarlar',
        url: '/settings',
        icon: Settings,
      },
    ],
  },
]

/**
 * Kargo Sistemi Navigation Örneği (Mevcut Projeden)
 */
export const cargoNavGroups: NavGroup[] = [
  {
    label: 'Menü',
    items: [
      {
        title: 'Ana Sayfa',
        url: '/',
        icon: Home,
      },
      {
        title: 'Kargolar',
        icon: Package,
        badge: '12',
        items: [
          { title: 'Tüm Kargolar', url: '/shipments' },
          { title: 'Yeni Kargo', url: '/shipments/new' },
          { title: 'Kargo Sorgula', url: '/shipments/track' },
        ],
      },
    ],
  },
  {
    label: 'Yönetim',
    items: [
      {
        title: 'Müşteriler',
        url: '/customers',
        icon: Users,
      },
      {
        title: 'Şubeler',
        url: '/branches',
        icon: Building2,
      },
    ],
  },
  {
    label: 'Analiz',
    items: [
      {
        title: 'Raporlar',
        url: '/reports',
        icon: BarChart3,
      },
      {
        title: 'Finans',
        url: '/finance',
        icon: Wallet,
      },
    ],
  },
  {
    label: 'Test & Geliştirme',
    items: [
      {
        title: 'Auth Kit Test',
        icon: ShieldCheck,
        items: [
          { title: 'Sign In (Standart)', url: '/auth/signin' },
          { title: 'Sign In 2 (Split)', url: '/auth/signin2' },
          { title: 'OTP Doğrulama', url: '/auth/otp' },
          { title: 'Şifremi Unuttum', url: '/auth/forgot-password' },
          { title: 'Şifre Sıfırlama', url: '/auth/reset-password?token=demo' },
        ],
      },
      {
        title: 'Component Gallery',
        url: '/gallery',
        icon: TestTube2,
      },
    ],
  },
  {
    items: [
      {
        title: 'Ayarlar',
        url: '/settings',
        icon: Settings,
      },
    ],
  },
]

/**
 * Advanced Navigation Örneği (Çoklu alt menü)
 */
export const nestedNavGroups: NavGroup[] = [
  {
    label: 'Ana Menü',
    items: [
      {
        title: 'Dashboard',
        url: '/dashboard',
        icon: Home,
      },
    ],
  },
  {
    label: 'Modüller',
    items: [
      {
        title: 'Auth Kit',
        icon: ShieldCheck,
        items: [
          { title: 'Components', url: '/modules/auth/components' },
          { title: 'Pages', url: '/modules/auth/pages' },
          { title: 'Context', url: '/modules/auth/context' },
          { title: 'Utils', url: '/modules/auth/utils' },
        ],
      },
      {
        title: 'Layout Kit',
        icon: LayoutDashboard,
        items: [
          { title: 'Dashboard', url: '/modules/layout/dashboard' },
          { title: 'Header', url: '/modules/layout/header' },
          { title: 'Sidebar', url: '/modules/layout/sidebar' },
          { title: 'Footer', url: '/modules/layout/footer' },
        ],
      },
      {
        title: 'Form Kit',
        icon: FileText,
        items: [
          { title: 'Text Fields', url: '/modules/form/text' },
          { title: 'Select Fields', url: '/modules/form/select' },
          { title: 'Validation', url: '/modules/form/validation' },
        ],
      },
    ],
  },
]
