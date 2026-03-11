"use client"

import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { AppSidebar } from '@hascanb/arf-ui-kit/layout-kit'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import {
  FlaskConical,
  LayoutDashboard,
  ShieldCheck,
  Table,
  KeyRound,
  FileUp,
  AlertTriangle,
  Bell,
  Wrench,
  House,
  Images,
} from 'lucide-react'

const brandData = {
  title: 'ARF UI Kit Lab',
  subtitle: 'Test ve Dokümantasyon',
  url: '/test',
  icon: FlaskConical,
}

const userData = {
  name: 'QA Workspace',
  email: 'qa@arf-ui-kit.local',
  avatar: '',
  role: 'Validation Hub',
}

const navGroups = [
  {
    label: 'Lab Giriş',
    items: [
      {
        title: 'Test Home',
        url: '/test',
        icon: LayoutDashboard,
      },
      {
        title: 'Cargo Workspace',
        url: '/cargo',
        icon: House,
      },
    ],
  },
  {
    label: 'Kit Testleri',
    items: [
      {
        title: 'Auth Kit',
        icon: ShieldCheck,
        items: [
          { title: 'Landing', url: '/test/auth' },
          { title: 'Demo Hub', url: '/test/auth/demo' },
          { title: 'SignIn Template', url: '/test/auth/pages/signin' },
          { title: 'SignIn2 Template', url: '/test/auth/pages/signin2' },
          { title: 'OTP Template', url: '/test/auth/pages/otp' },
          { title: 'Forgot Password Template', url: '/test/auth/pages/forgot-password' },
          { title: 'Reset Password Template', url: '/test/auth/pages/reset-password' },
          { title: 'SignIn Form', url: '/test/auth/components/signin-form' },
          { title: 'OTP Form', url: '/test/auth/components/otp-form' },
          { title: 'Forgot Password Form', url: '/test/auth/components/forgot-password-form' },
          { title: 'Reset Password Form', url: '/test/auth/components/reset-password-form' },
        ],
      },
      {
        title: 'Layout Kit',
        icon: LayoutDashboard,
        items: [
          { title: 'Landing', url: '/test/layout-kit' },
          { title: 'Demo', url: '/test/layout/dashboard' },
          { title: 'Header', url: '/test/layout/header' },
          { title: 'Sidebar', url: '/test/layout/sidebar' },
          { title: 'Footer', url: '/test/layout/footer' },
        ],
      },
      {
        title: 'DataTable Kit',
        icon: Table,
        items: [
          { title: 'Landing', url: '/test/datatable' },
          { title: 'Demo', url: '/test/datatable/basic' },
          { title: 'Advanced', url: '/test/datatable/advanced' },
          { title: 'Server-side', url: '/test/datatable/server-side' },
        ],
      },
      {
        title: 'Form Kit',
        icon: KeyRound,
        items: [
          { title: 'Landing', url: '/test/form' },
          { title: 'Demo Hub', url: '/test/form/demo' },
          { title: 'Advanced Form', url: '/test/form/advanced' },
        ],
      },
      {
        title: 'File Kit',
        icon: FileUp,
        items: [
          { title: 'Landing', url: '/test/file-uploader' },
          { title: 'Demo Hub', url: '/test/file-uploader/demo' },
        ],
      },
      {
        title: 'Errors Kit',
        icon: AlertTriangle,
        items: [
          { title: 'Landing', url: '/test/errors' },
          { title: 'Demo Hub', url: '/test/errors/demo' },
        ],
      },
      {
        title: 'Feedback Kit',
        icon: Bell,
        items: [
          { title: 'Landing', url: '/test/feedback' },
          { title: 'Demo Hub', url: '/test/feedback/demo' },
        ],
      },
      {
        title: 'Utils ve Icons',
        icon: Wrench,
        items: [
          { title: 'Validation Utils', url: '/test/utils/validation' },
          { title: 'Token Utils', url: '/test/utils/token' },
          { title: 'Auth Icons', url: '/test/icons/auth' },
        ],
      },
      {
        title: 'Component Gallery',
        icon: Images,
        items: [{ title: 'Gallery Hub', url: '/test/gallery' }],
      },
    ],
  },
]

export default function TestLayout({
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
        onLogout={() => console.log('Lab oturumu kapatıldı')}
      />
      <SidebarInset>{children}</SidebarInset>
      <Toaster />
      <Sonner />
    </SidebarProvider>
  )
}
