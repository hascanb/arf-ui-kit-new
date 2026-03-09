"use client"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@arftech/arfweb-shared-lib/layout-kit/components/AppSidebar"
import { Toaster } from "@/components/ui/toaster"
import { Toaster as Sonner } from "@/components/ui/sonner"
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
  LogIn,
  KeyRound,
  ShieldCheck,
  Table,
} from "lucide-react"

// 1. Marka (Logo ve İsim) Verisi
const brandData = {
  title: "Kargo Sistemi",
  subtitle: "Otomasyon v1.0",
  url: "/",
  icon: Truck,
}

// 2. Kullanıcı Verisi
const userData = {
  name: "Ahmet Yılmaz",
  email: "ahmet@kargosistemi.com",
  avatar: "",
  role: "Şube Yetkilisi",
}

// 3. Menü Linkleri (İngilizce rotalara güncellendi)
const navGroups = [
  {
    label: "Menü",
    items: [
      {
        title: "Ana Sayfa",
        url: "/",
        icon: Home,
      },
      {
        title: "Kargolar",
        icon: Package,
        badge: "12",
        items: [
          { title: "Tüm Kargolar", url: "/shipments" },
          { title: "Yeni Kargo", url: "/shipments/new" },
          { title: "Kargo Sorgula", url: "/shipments/track" },
        ],
      },
    ],
  },
  {
    label: "Yönetim",
    items: [
      {
        title: "Müşteriler",
        url: "/customers",
        icon: Users,
      },
      {
        title: "Şubeler",
        url: "/branches",
        icon: Building2,
      },
    ],
  },
  {
    label: "Analiz",
    items: [
      {
        title: "Raporlar",
        url: "/reports",
        icon: BarChart3,
      },
      {
        title: "Finans",
        url: "/finance",
        icon: Wallet,
      },
    ],
  },
  {
    label: "Test & Geliştirme",
    items: [
      {
        title: "Auth Kit Test",
        icon: ShieldCheck,
        items: [
          { title: "Sign In (Standart)", url: "/auth/signin" },
          { title: "Sign In 2 (Split)", url: "/auth/signin2" },
          { title: "OTP Doğrulama", url: "/auth/otp" },
          { title: "Şifremi Unuttum", url: "/auth/forgot-password" },
          { title: "Şifre Sıfırlama", url: "/auth/reset-password?token=demo" },
        ],
      },
      {
        title: "Layout Kit Test",
        icon: LogIn,
        items: [
          { title: "Dashboard Layout", url: "/test/layout/dashboard" },
          { title: "Header Variants", url: "/test/layout/header" },
          { title: "Sidebar Variants", url: "/test/layout/sidebar" },
          { title: "Footer Variants", url: "/test/layout/footer" },
        ],
      },
      {
        title: "DataTable Kit Test",
        icon: Table,
        items: [
          { title: "Basic DataTable", url: "/test/datatable/basic" },
          { title: "Advanced Features", url: "/test/datatable/advanced" },
          { title: "Server-Side", url: "/test/datatable/server-side" },
        ],
      },
      {
        title: "Form Kit Test",
        icon: KeyRound,
        items: [
          { title: "Form Examples", url: "/test/form" },
        ],
      },
      {
        title: "Errors Kit Test",
        icon: TestTube2,
        items: [
          { title: "Error Handling", url: "/test/errors" },
        ],
      },
      {
        title: "Utils & Icons Test",
        icon: TestTube2,
        items: [
          { title: "Validation Utils", url: "/test/utils/validation" },
          { title: "Token Utils", url: "/test/utils/token" },
          { title: "Auth Icons", url: "/test/icons/auth" },
        ],
      },
      {
        title: "Component Gallery",
        url: "/gallery",
        icon: TestTube2,
      },
    ],
  },
  {
    items: [
      {
        title: "Ayarlar",
        url: "/settings",
        icon: Settings,
      },
    ],
  },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      {/* Kütüphaneden gelen Sidebar'a verileri Props olarak gönderiyoruz */}
      <AppSidebar 
        brand={brandData} 
        user={userData} 
        navGroups={navGroups} 
        onLogout={() => console.log("Çıkış yapıldı")}
      />
      <SidebarInset>{children}</SidebarInset>
      <Toaster />
      <Sonner />
    </SidebarProvider>
  )
}