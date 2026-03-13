/**
 * Layout Kit - Type Definitions
 * 
 * Tüm layout bileşenleri için merkezi type tanımları
 */

import * as React from 'react'

// ========== AppHeader Types ==========

/**
 * Breadcrumb navigasyon verisi
 */
export interface BreadcrumbData {
  label: string
  href?: string
}

/**
 * AppHeader command palette item
 */
export interface HeaderCommandItem {
  id: string
  label: string
  group?: string
  keywords?: string[]
  shortcut?: string
  icon?: React.ReactNode
  onSelect?: () => void
}

/**
 * AppHeader bileşeni props'ları
 */
export interface AppHeaderProps {
  breadcrumbs?: BreadcrumbData[]
  searchPlaceholder?: string
  searchShortcut?: React.ReactNode
  searchCommands?: HeaderCommandItem[]
  commandTitle?: string
  commandDescription?: string
  searchEmptyMessage?: string
  notificationCount?: number
  notificationsLabel?: string
  onSearchClick?: () => void
  onNotificationClick?: () => void
}

// ========== AppSidebar Types ==========

/**
 * Sidebar alt menü öğesi
 */
export interface NavSubItem {
  title: string
  url: string
  icon?: React.ElementType
  badge?: string
  items?: NavSubItem[]
}

/**
 * Sidebar menü öğesi
 */
export interface NavItem {
  title: string
  url?: string
  icon: React.ElementType
  badge?: string
  items?: NavSubItem[]
}

/**
 * Sidebar menü grubu
 */
export interface NavGroup {
  label?: string
  items: NavItem[]
}

/**
 * Kullanıcı profil verisi
 */
export interface UserData {
  name: string
  email: string
  avatar: string
  role: string
}

/**
 * Marka/Logo verisi
 */
export interface BrandData {
  title: string
  subtitle: string
  url: string
  icon: React.ElementType
}

/**
 * Sidebar header switcher item
 */
export interface BrandSwitcherItem extends BrandData {
  id: string
  shortcut?: string
  onSelect?: () => void
}

/**
 * Sidebar footer quick action item
 */
export interface SidebarQuickActionItem {
  id: string
  label: string
  url?: string
  icon: React.ElementType
  onSelect?: () => void
}

/**
 * AppSidebar bileşeni props'ları
 */
export interface AppSidebarProps {
  brand: BrandData
  brandOptions?: BrandSwitcherItem[]
  brandMenuLabel?: string
  addBrandLabel?: string
  onAddBrand?: () => void
  quickActions?: SidebarQuickActionItem[]
  user: UserData
  navGroups: NavGroup[]
  onLogout?: () => void
}

// ========== AppFooter Types ==========

/**
 * Footer link verisi
 */
export interface FooterLink {
  label: string
  href: string
}

/**
 * Footer link grubu
 */
export interface FooterLinkGroup {
  title: string
  links: FooterLink[]
}

/**
 * Footer sosyal medya linki
 */
export interface FooterSocialLink {
  label: string
  href: string
  icon: React.ElementType
}

/**
 * AppFooter bileşeni props'ları
 */
export interface AppFooterProps {
  brandName?: string
  copyright?: string
  description?: string
  linkGroups?: FooterLinkGroup[]
  socialLinks?: FooterSocialLink[]
  className?: string
}

// ========== DashboardLayout Types ==========

/**
 * DashboardLayout bileşeni props'ları
 */
export interface DashboardLayoutProps {
  children: React.ReactNode
  brand: BrandData
  brandOptions?: BrandSwitcherItem[]
  brandMenuLabel?: string
  addBrandLabel?: string
  onAddBrand?: () => void
  quickActions?: SidebarQuickActionItem[]
  user: UserData
  navGroups: NavGroup[]
  mainContentId?: string
  showSkipToContent?: boolean
  skipToContentLabel?: string
  breadcrumbs?: BreadcrumbData[]
  searchPlaceholder?: string
  searchCommands?: HeaderCommandItem[]
  commandTitle?: string
  commandDescription?: string
  searchEmptyMessage?: string
  notificationCount?: number
  showFooter?: boolean
  footerProps?: Omit<AppFooterProps, 'className'>
  onLogout?: () => void
  onSearchClick?: () => void
  onNotificationClick?: () => void
}

// ========== ThemeProvider Types ==========

/**
 * Theme provider props (re-exported from next-themes)
 */
export interface ThemeProviderProps {
  children: React.ReactNode
  attribute?: string
  defaultTheme?: string
  enableSystem?: boolean
  disableTransitionOnChange?: boolean
  storageKey?: string
  themes?: string[]
  forcedTheme?: string
  enableColorScheme?: boolean
}
