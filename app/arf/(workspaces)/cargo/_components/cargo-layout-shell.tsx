"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import {
  AppHeaderDefaultsProvider,
  AppSidebar,
  type AppHeaderProps,
} from "@hascanb/arf-ui-kit/layout-kit"
import { LifeBuoy } from "lucide-react"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Toaster } from "@/components/ui/toaster"
import { Toaster as Sonner } from "@/components/ui/sonner"
import { ARF_ROUTES } from "../../../_shared/routes"
import {
  brandData,
  brandOptions,
  userData,
  navGroups,
  sidebarUserMenuLabels,
  sidebarSettingsModalConfig,
  cargoHeaderInitialNotifications,
  createCargoHeaderSearchCommands,
} from "../_data/nav"
import { SupportModal } from "./support-modal"

export function CargoLayoutShell({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false)
  const [headerNotifications, setHeaderNotifications] = useState(cargoHeaderInitialNotifications)

  const cargoHeaderDefaults = useMemo<Partial<AppHeaderProps>>(
    () => ({
      searchPlaceholder: "Hızlı işlem ara...",
      commandTitle: "Hızlı İşlemler",
      commandDescription: "İşlem veya ekran adı yazarak hızlıca ilerleyin.",
      searchEmptyMessage: "Uygun hızlı işlem bulunamadı.",
      notificationsLabel: "Bildirimler",
      notificationsMenuLabel: "Bildirimler",
      notificationsEmptyMessage: "Yeni bildiriminiz yok.",
      markAllAsReadLabel: "Tümünü okundu yap",
      viewAllNotificationsLabel: "Tüm bildirimleri görüntüle",
      searchCommands: createCargoHeaderSearchCommands(router.push),
      notifications: headerNotifications,
      onMarkAllAsRead: () => {
        setHeaderNotifications((current) => current.map((item) => ({ ...item, isRead: true })))
      },
    }),
    [headerNotifications, router],
  )

  return (
    <AppHeaderDefaultsProvider value={cargoHeaderDefaults}>
      <SidebarProvider>
        <AppSidebar
          brand={brandData}
          brandOptions={brandOptions}
          addBrandLabel="Tümünü Gör"
          onAddBrand={() => router.push(ARF_ROUTES.root)}
          userMenuLabels={sidebarUserMenuLabels}
          settingsModalConfig={sidebarSettingsModalConfig}
          user={userData}
          navGroups={navGroups}
          quickActions={[
            {
              id: "support",
              label: "Yardım & Destek",
              icon: LifeBuoy,
              onSelect: () => setIsSupportModalOpen(true),
            },
          ]}
          onLogout={() => console.log("Çıkış yapıldı")}
        />

        <SidebarInset>{children}</SidebarInset>

        <SupportModal open={isSupportModalOpen} onOpenChange={setIsSupportModalOpen} />

        <Toaster />
        <Sonner />
      </SidebarProvider>
    </AppHeaderDefaultsProvider>
  )
}
