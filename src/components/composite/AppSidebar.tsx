"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Home,
  Package,
  Users,
  Building2,
  BarChart3,
  Wallet,
  Settings,
  ChevronRight,
  ChevronsUpDown,
  LogOut,
  User,
  Bell,
  Truck,
  Search,
  Sparkles,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

// Navigation data
const mainNavItems = [
  {
    title: "Ana Sayfa",
    url: "/",
    icon: Home,
  },
]

const cargoNavItems = [
  {
    title: "Kargolar",
    icon: Package,
    badge: "12",
    items: [
      { title: "Tüm Kargolar", url: "/kargolar" },
      { title: "Yeni Kargo", url: "/kargolar/yeni" },
      { title: "Kargo Sorgula", url: "/kargolar/sorgula" },
    ],
  },
]

const managementNavItems = [
  {
    title: "Müşteriler",
    url: "/musteriler",
    icon: Users,
  },
  {
    title: "Şubeler",
    url: "/subeler",
    icon: Building2,
  },
]

const analysisNavItems = [
  {
    title: "Raporlar",
    url: "/raporlar",
    icon: BarChart3,
  },
  {
    title: "Finans",
    url: "/finans",
    icon: Wallet,
  },
]

const settingsNavItems = [
  {
    title: "Ayarlar",
    url: "/ayarlar",
    icon: Settings,
  },
]

// Mock user data
const userData = {
  name: "Ahmet Yılmaz",
  email: "ahmet@kargosistemi.com",
  avatar: "",
  role: "Şube Yetkilisi",
}

export function AppSidebar() {
  const pathname = usePathname()
  const { state } = useSidebar()
  const isCollapsed = state === "collapsed"

  const isActive = (url: string) => {
    if (url === "/") return pathname === "/"
    return pathname.startsWith(url)
  }

  const isSubActive = (items: { url: string }[]) => {
    return items.some((item) => pathname.startsWith(item.url))
  }

  return (
    <Sidebar collapsible="icon" className="border-r-0">
      <SidebarHeader className="border-b border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild className="hover:bg-transparent">
              <Link href="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-linear-to-br from-foreground to-foreground/80 text-background shadow-sm">
                  <Truck className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold tracking-tight">Kargo Sistemi</span>
                  <span className="truncate text-xs text-muted-foreground">
                    Otomasyon v1.0
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="gap-0">
        {/* Main Navigation */}
        <SidebarGroup className="py-4">
          <SidebarGroupLabel className="px-4 text-xs font-medium text-muted-foreground/70 uppercase tracking-wider">
            Menü
          </SidebarGroupLabel>
          <SidebarGroupContent className="px-2">
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.url)}
                    tooltip={item.title}
                    className="h-9 rounded-md transition-colors"
                  >
                    <Link href={item.url}>
                      <item.icon className="size-4" />
                      <span className="font-medium">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}

              {/* Kargolar - Collapsible */}
              {cargoNavItems.map((item) => (
                <Collapsible
                  key={item.title}
                  asChild
                  defaultOpen={isSubActive(item.items)}
                  className="group/collapsible"
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton
                        tooltip={item.title}
                        isActive={isSubActive(item.items)}
                        className="h-9 rounded-md transition-colors"
                      >
                        <item.icon className="size-4" />
                        <span className="font-medium">{item.title}</span>
                        {item.badge && !isCollapsed && (
                          <Badge variant="secondary" className="ml-auto h-5 px-1.5 text-[10px] font-semibold">
                            {item.badge}
                          </Badge>
                        )}
                        <ChevronRight className="ml-auto size-4 shrink-0 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub className="mr-0 pr-0">
                        {item.items.map((subItem) => (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton
                              asChild
                              isActive={pathname === subItem.url}
                              className="h-8 rounded-md"
                            >
                              <Link href={subItem.url}>
                                <span>{subItem.title}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Management */}
        <SidebarGroup className="py-4 border-t border-sidebar-border">
          <SidebarGroupLabel className="px-4 text-xs font-medium text-muted-foreground/70 uppercase tracking-wider">
            Yönetim
          </SidebarGroupLabel>
          <SidebarGroupContent className="px-2">
            <SidebarMenu>
              {managementNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.url)}
                    tooltip={item.title}
                    className="h-9 rounded-md transition-colors"
                  >
                    <Link href={item.url}>
                      <item.icon className="size-4" />
                      <span className="font-medium">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Analysis */}
        <SidebarGroup className="py-4 border-t border-sidebar-border">
          <SidebarGroupLabel className="px-4 text-xs font-medium text-muted-foreground/70 uppercase tracking-wider">
            Analiz
          </SidebarGroupLabel>
          <SidebarGroupContent className="px-2">
            <SidebarMenu>
              {analysisNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.url)}
                    tooltip={item.title}
                    className="h-9 rounded-md transition-colors"
                  >
                    <Link href={item.url}>
                      <item.icon className="size-4" />
                      <span className="font-medium">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Settings */}
        <SidebarGroup className="mt-auto py-4 border-t border-sidebar-border">
          <SidebarGroupContent className="px-2">
            <SidebarMenu>
              {settingsNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.url)}
                    tooltip={item.title}
                    className="h-9 rounded-md transition-colors"
                  >
                    <Link href={item.url}>
                      <item.icon className="size-4" />
                      <span className="font-medium">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="h-auto rounded-lg p-2 data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="size-8 rounded-lg ring-1 ring-sidebar-border">
                    <AvatarImage src={userData.avatar} alt={userData.name} />
                    <AvatarFallback className="rounded-lg bg-linear-to-br from-muted to-muted/50 text-xs font-semibold">
                      {userData.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      {userData.name}
                    </span>
                    <span className="truncate text-xs text-muted-foreground">
                      {userData.role}
                    </span>
                  </div>
                  <ChevronsUpDown className="ml-auto size-4 text-muted-foreground" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-xl"
                side={isCollapsed ? "right" : "top"}
                align="end"
                sideOffset={8}
              >
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-3 px-2 py-2.5 text-left text-sm">
                    <Avatar className="size-9 rounded-lg">
                      <AvatarImage src={userData.avatar} alt={userData.name} />
                      <AvatarFallback className="rounded-lg bg-linear-to-br from-muted to-muted/50 font-semibold">
                        {userData.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">
                        {userData.name}
                      </span>
                      <span className="truncate text-xs text-muted-foreground">
                        {userData.email}
                      </span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem className="gap-2 rounded-lg">
                    <User className="size-4" />
                    Profil
                  </DropdownMenuItem>
                  <DropdownMenuItem className="gap-2 rounded-lg">
                    <Bell className="size-4" />
                    Bildirimler
                    <Badge variant="secondary" className="ml-auto h-5 px-1.5 text-[10px]">3</Badge>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="gap-2 rounded-lg">
                    <Settings className="size-4" />
                    Ayarlar
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="gap-2 rounded-lg text-red-600 focus:text-red-600">
                  <LogOut className="size-4" />
                  Çıkış Yap
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
