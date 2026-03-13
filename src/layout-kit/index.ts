/**
 * Layout Kit - Public API
 * 
 * Dashboard layout modülü barrel export
 * Sadece public API'yi expose eder
 */

// ========== Components ==========
export { AppHeader } from './components/AppHeader'
export { AppSidebar } from './components/AppSidebar'
export { AppFooter } from './components/AppFooter'
export { DashboardLayout } from './components/DashboardLayout'
export { ThemeProvider } from './components/ThemeProvider'

// ========== Types ==========
export type {
  // AppHeader
  BreadcrumbData,
  AppHeaderProps,
  
  // AppSidebar
  NavSubItem,
  NavItem,
  NavGroup,
  UserData,
  BrandData,
  BrandSwitcherItem,
  SidebarQuickActionItem,
  AppSidebarProps,
  
  // AppFooter
  FooterLink,
  FooterLinkGroup,
  FooterSocialLink,
  AppFooterProps,
  
  // DashboardLayout
  DashboardLayoutProps,
  
  // ThemeProvider
  ThemeProviderProps,
} from './context/types'

// ========== Utils ==========
export {
  exampleBrandData,
  exampleBrandOptions,
  exampleUserData,
  basicNavGroups,
  testNavGroups,
  ecommerceNavGroups,
  cargoNavGroups,
  nestedNavGroups,
} from './utils'