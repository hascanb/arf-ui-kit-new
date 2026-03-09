/**
 * Layout Kit - Type Definitions
 *
 * Tüm layout bileşenleri için merkezi type tanımları
 */
import * as React from 'react';
/**
 * Breadcrumb navigasyon verisi
 */
export interface BreadcrumbData {
    label: string;
    href?: string;
}
/**
 * AppHeader bileşeni props'ları
 */
export interface AppHeaderProps {
    breadcrumbs?: BreadcrumbData[];
    searchPlaceholder?: string;
    searchShortcut?: React.ReactNode;
    notificationCount?: number;
    notificationsLabel?: string;
    onSearchClick?: () => void;
    onNotificationClick?: () => void;
}
/**
 * Sidebar alt menü öğesi
 */
export interface NavSubItem {
    title: string;
    url: string;
}
/**
 * Sidebar menü öğesi
 */
export interface NavItem {
    title: string;
    url?: string;
    icon: React.ElementType;
    badge?: string;
    items?: NavSubItem[];
}
/**
 * Sidebar menü grubu
 */
export interface NavGroup {
    label?: string;
    items: NavItem[];
}
/**
 * Kullanıcı profil verisi
 */
export interface UserData {
    name: string;
    email: string;
    avatar: string;
    role: string;
}
/**
 * Marka/Logo verisi
 */
export interface BrandData {
    title: string;
    subtitle: string;
    url: string;
    icon: React.ElementType;
}
/**
 * AppSidebar bileşeni props'ları
 */
export interface AppSidebarProps {
    brand: BrandData;
    user: UserData;
    navGroups: NavGroup[];
    onLogout?: () => void;
}
/**
 * Footer link verisi
 */
export interface FooterLink {
    label: string;
    href: string;
}
/**
 * Footer link grubu
 */
export interface FooterLinkGroup {
    title: string;
    links: FooterLink[];
}
/**
 * Footer sosyal medya linki
 */
export interface FooterSocialLink {
    label: string;
    href: string;
    icon: React.ElementType;
}
/**
 * AppFooter bileşeni props'ları
 */
export interface AppFooterProps {
    brandName?: string;
    copyright?: string;
    description?: string;
    linkGroups?: FooterLinkGroup[];
    socialLinks?: FooterSocialLink[];
    className?: string;
}
/**
 * DashboardLayout bileşeni props'ları
 */
export interface DashboardLayoutProps {
    children: React.ReactNode;
    brand: BrandData;
    user: UserData;
    navGroups: NavGroup[];
    breadcrumbs?: BreadcrumbData[];
    searchPlaceholder?: string;
    notificationCount?: number;
    showFooter?: boolean;
    footerProps?: Omit<AppFooterProps, 'className'>;
    onLogout?: () => void;
    onSearchClick?: () => void;
    onNotificationClick?: () => void;
}
/**
 * Theme provider props (re-exported from next-themes)
 */
export interface ThemeProviderProps {
    children: React.ReactNode;
    attribute?: string;
    defaultTheme?: string;
    enableSystem?: boolean;
    disableTransitionOnChange?: boolean;
    storageKey?: string;
    themes?: string[];
    forcedTheme?: string;
    enableColorScheme?: boolean;
}
//# sourceMappingURL=types.d.ts.map