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
  mainContentId = 'main-content',
  showSkipToContent = true,
  skipToContentLabel = 'Ana icerige gec',
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
      {showSkipToContent && (
        <a
          href={`#${mainContentId}`}
          className="sr-only z-50 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground focus:not-sr-only focus:absolute focus:left-4 focus:top-4"
        >
          {skipToContentLabel}
        </a>
      )}
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
        <main id={mainContentId} tabIndex={-1} className="flex flex-1 flex-col">
          {children}
        </main>
        {showFooter && <AppFooter {...footerProps} />}
      </SidebarInset>
    </SidebarProvider>
  )
}
