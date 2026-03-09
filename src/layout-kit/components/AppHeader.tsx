"use client"

import * as React from "react"
import { Bell, Search } from "lucide-react"

import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import type { AppHeaderProps } from "../context/types"

export function AppHeader({ 
  breadcrumbs = [],
  searchPlaceholder = "Search...",
  searchShortcut,
  notificationCount = 0,
  notificationsLabel = "Notifications",
  onSearchClick,
  onNotificationClick
}: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-3 border-b bg-background/95 px-4 backdrop-blur supports-backdrop-filter:bg-background/60">
      <SidebarTrigger className="-ml-1 size-8" />
      <Separator orientation="vertical" className="h-4" />

      {/* Breadcrumbs */}
      {breadcrumbs.length > 0 && (
        <Breadcrumb className="hidden md:flex">
          <BreadcrumbList>
            {breadcrumbs.map((crumb, index) => (
              <React.Fragment key={index}>
                <BreadcrumbItem>
                  {index < breadcrumbs.length - 1 ? (
                    <BreadcrumbLink 
                      href={crumb.href || "#"}
                      className="text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {crumb.label}
                    </BreadcrumbLink>
                  ) : (
                    <BreadcrumbPage className="font-medium">{crumb.label}</BreadcrumbPage>
                  )}
                </BreadcrumbItem>
                {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
              </React.Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      )}

      {/* Spacer */}
      <div className="flex-1" />

      {/* Search Button (Desktop) */}
      <Button 
        variant="outline" 
        onClick={onSearchClick}
        className="hidden h-9 w-64 justify-start gap-2 px-3 text-sm text-muted-foreground md:flex"
      >
        <Search className="size-4" />
        <span className="flex-1 text-left">{searchPlaceholder}</span>
        {searchShortcut && (
          <kbd className="pointer-events-none flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
            {searchShortcut}
          </kbd>
        )}
      </Button>

      {/* Mobile Search */}
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={onSearchClick}
        className="size-8 md:hidden"
      >
        <Search className="size-4" />
        <span className="sr-only">{searchPlaceholder}</span>
      </Button>

      {/* Notifications */}
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={onNotificationClick}
        className="relative size-8"
      >
        <Bell className="size-4" />
        {notificationCount > 0 && (
          <Badge 
            variant="destructive" 
            className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full p-0 text-[10px]"
          >
            {notificationCount > 99 ? '99+' : notificationCount}
          </Badge>
        )}
        <span className="sr-only">{notificationsLabel}</span>
      </Button>
    </header>
  )
}