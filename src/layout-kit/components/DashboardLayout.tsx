/**
 * Layout Kit - DashboardLayout
 * 
 * Tam özellikli dashboard layout wrapper
 * AppSidebar + AppHeader + Content + Optional Footer
 */

"use client"

import * as React from "react"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "./AppSidebar"
import { AppHeader } from "./AppHeader"
import { AppFooter } from "./AppFooter"
import type { DashboardLayoutProps } from "../context/types"

export function DashboardLayout({
  children,
  brand,
  user,
  navGroups,
  breadcrumbs,
  searchPlaceholder,
  notificationCount,
  showFooter = false,
  footerProps,
  onLogout,
  onSearchClick,
  onNotificationClick,
}: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <AppSidebar
        brand={brand}
        user={user}
        navGroups={navGroups}
        onLogout={onLogout}
      />
      <SidebarInset>
        <AppHeader
          breadcrumbs={breadcrumbs}
          searchPlaceholder={searchPlaceholder}
          notificationCount={notificationCount}
          onSearchClick={onSearchClick}
          onNotificationClick={onNotificationClick}
        />
        <main className="flex flex-1 flex-col">
          {children}
        </main>
        {showFooter && <AppFooter {...footerProps} />}
      </SidebarInset>
    </SidebarProvider>
  )
}
