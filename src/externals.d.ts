/**
 * Ghost UI - External Dependencies
 * 
 * Bu dosya, kütüphane içinde kullanılan ancak kütüphanenin kendisinde bulunmayan
 * UI bileşenlerinin type tanımlarını içerir (Ghost UI Pattern)
 * 
 * Kütüphane kullanıcısı, bu bileşenleri kendi projesinde sağlamakla yükümlüdür.
 * Örneğin: Shadcn UI bileşenleri playground/components/ui/ altında olmalıdır.
 */

// ============================================================================
// UI Components (Shadcn UI)
// ============================================================================

declare module '@/components/ui/button' {
  export type { ButtonProps } from '@/components/ui/button'
  export { Button, buttonVariants } from '@/components/ui/button'
}

declare module '@/components/ui/input' {
  export type { InputProps } from '@/components/ui/input'
  export { Input } from '@/components/ui/input'
}

declare module '@/components/ui/label' {
  export { Label } from '@/components/ui/label'
}

declare module '@/components/ui/checkbox' {
  export { Checkbox } from '@/components/ui/checkbox'
}

declare module '@/components/ui/badge' {
  export { Badge, badgeVariants } from '@/components/ui/badge'
}

declare module '@/components/ui/avatar' {
  export { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
}

declare module '@/components/ui/collapsible' {
  export { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible'
}

declare module '@/components/ui/card' {
  export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, CardAction } from '@/components/ui/card'
}

declare module '@/components/ui/alert' {
  export { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
}

declare module '@/components/ui/input-otp' {
  export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator } from '@/components/ui/input-otp'
}

declare module '@/components/ui/spinner' {
  export * from '@/components/ui/spinner'
}

// Form components (form-kit için)
declare module '@/components/ui/form' {
  export * from '@/components/ui/form'
}

declare module '@/components/ui/select' {
  export * from '@/components/ui/select'
}

declare module '@/components/ui/textarea' {
  export * from '@/components/ui/textarea'
}

declare module '@/components/ui/radio-group' {
  export * from '@/components/ui/radio-group'
}

declare module '@/components/ui/switch' {
  export * from '@/components/ui/switch'
}

declare module '@/components/ui/slider' {
  export * from '@/components/ui/slider'
}

declare module '@/components/ui/calendar' {
  export * from '@/components/ui/calendar'
}

declare module '@/components/ui/popover' {
  export * from '@/components/ui/popover'
}

// Table components (datatable-kit için)
declare module '@/components/ui/table' {
  export * from '@/components/ui/table'
}

declare module '@/components/ui/dropdown-menu' {
  export {
    DropdownMenu,
    DropdownMenuPortal,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuLabel,
    DropdownMenuItem,
    DropdownMenuCheckboxItem,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubTrigger,
    DropdownMenuSubContent,
  } from '@/components/ui/dropdown-menu'
}

declare module '@/components/ui/pagination' {
  export * from '@/components/ui/pagination'
}

// Layout components (layout-kit için)
declare module '@/components/ui/sidebar' {
  export {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupAction,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarInput,
    SidebarInset,
    SidebarMenu,
    SidebarMenuAction,
    SidebarMenuBadge,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSkeleton,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    SidebarProvider,
    SidebarRail,
    SidebarSeparator,
    SidebarTrigger,
    useSidebar,
  } from '@/components/ui/sidebar'
}

declare module '@/components/ui/navigation-menu' {
  export * from '@/components/ui/navigation-menu'
}

declare module '@/components/ui/breadcrumb' {
  export {
    Breadcrumb,
    BreadcrumbList,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbPage,
    BreadcrumbSeparator,
    BreadcrumbEllipsis,
  } from '@/components/ui/breadcrumb'
}

declare module '@/components/ui/sheet' {
  export * from '@/components/ui/sheet'
}

declare module '@/components/ui/separator' {
  export { Separator } from '@/components/ui/separator'
}

// Dialog & Modal components (errors-kit için)
declare module '@/components/ui/dialog' {
  export * from '@/components/ui/dialog'
}

declare module '@/components/ui/toast' {
  export * from '@/components/ui/toast'
}

declare module '@/components/ui/toaster' {
  export { Toaster } from '@/components/ui/toaster'
}

declare module '@/components/ui/sonner' {
  export { Toaster } from '@/components/ui/sonner'
}

declare module '@/components/ui/alert-dialog' {
  export * from '@/components/ui/alert-dialog'
}

// ============================================================================
// Utility Functions
// ============================================================================

declare module '@/lib/utils' {
  export { cn } from '@/lib/utils'
}

// ============================================================================
// Hooks
// ============================================================================

declare module '@/hooks/use-toast' {
  export * from '@/hooks/use-toast'
}
