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
  import * as React from 'react'
  
  export const Select: React.FC<any>
  export const SelectGroup: React.FC<any>
  export const SelectValue: React.FC<any>
  export const SelectTrigger: React.ForwardRefExoticComponent<any>
  export const SelectContent: React.ForwardRefExoticComponent<any>
  export const SelectLabel: React.ForwardRefExoticComponent<any>
  export const SelectItem: React.ForwardRefExoticComponent<any>
  export const SelectSeparator: React.ForwardRefExoticComponent<any>
  export const SelectScrollUpButton: React.ForwardRefExoticComponent<any>
  export const SelectScrollDownButton: React.ForwardRefExoticComponent<any>
}

declare module '@/components/ui/textarea' {
  import * as React from 'react'
  export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}
  export const Textarea: React.ForwardRefExoticComponent<TextareaProps>
}

declare module '@/components/ui/radio-group' {
  import * as React from 'react'
  export const RadioGroup: React.ForwardRefExoticComponent<any>
  export const RadioGroupItem: React.ForwardRefExoticComponent<any>
}

declare module '@/components/ui/switch' {
  export * from '@/components/ui/switch'
}

declare module '@/components/ui/slider' {
  export * from '@/components/ui/slider'
}

declare module '@/components/ui/calendar' {
  import React from 'react'
  export type CalendarProps = any
  export const Calendar: React.ForwardRefExoticComponent<CalendarProps>
}

declare module '@/components/ui/popover' {
  import * as React from 'react'
  
  export const Popover: React.FC<any>
  export const PopoverTrigger: React.ForwardRefExoticComponent<any>
  export const PopoverContent: React.ForwardRefExoticComponent<any>
  export const PopoverAnchor: React.ForwardRefExoticComponent<any>
}

declare module '@/components/ui/command' {
  import * as React from 'react'
  
  export const Command: React.ForwardRefExoticComponent<any>
  export const CommandDialog: React.FC<any>
  export const CommandInput: React.ForwardRefExoticComponent<any>
  export const CommandList: React.ForwardRefExoticComponent<any>
  export const CommandEmpty: React.ForwardRefExoticComponent<any>
  export const CommandGroup: React.ForwardRefExoticComponent<any>
  export const CommandItem: React.ForwardRefExoticComponent<any>
  export const CommandShortcut: React.FC<any>
  export const CommandSeparator: React.ForwardRefExoticComponent<any>
}

declare module '@/components/ui/separator' {
  import * as React from 'react'
  
  export const Separator: React.ForwardRefExoticComponent<any>
}

declare module '@/components/ui/popover' {
  export * from '@/components/ui/popover'
}

// Table components (datatable-kit için)
declare module '@/components/ui/table' {
  import * as React from 'react'
  
  export const Table: React.ForwardRefExoticComponent<React.HTMLAttributes<HTMLTableElement>>
  export const TableHeader: React.ForwardRefExoticComponent<React.HTMLAttributes<HTMLTableSectionElement>>
  export const TableBody: React.ForwardRefExoticComponent<React.HTMLAttributes<HTMLTableSectionElement>>
  export const TableFooter: React.ForwardRefExoticComponent<React.HTMLAttributes<HTMLTableSectionElement>>
  export const TableRow: React.ForwardRefExoticComponent<React.HTMLAttributes<HTMLTableRowElement>>
  export const TableHead: React.ForwardRefExoticComponent<React.ThHTMLAttributes<HTMLTableCellElement>>
  export const TableCell: React.ForwardRefExoticComponent<React.TdHTMLAttributes<HTMLTableCellElement>>
  export const TableCaption: React.ForwardRefExoticComponent<React.HTMLAttributes<HTMLElement>>
}

declare module '@/components/ui/scroll-area' {
  import * as React from 'react'
  
  export const ScrollArea: React.ForwardRefExoticComponent<any>
  export const ScrollBar: React.ForwardRefExoticComponent<any>
}

declare module '@/components/ui/dropdown-menu' {
  import * as React from 'react'
  
  export const DropdownMenu: React.FC<any>
  export const DropdownMenuTrigger: React.ForwardRefExoticComponent<any>
  export const DropdownMenuContent: React.ForwardRefExoticComponent<any>
  export const DropdownMenuGroup: React.ForwardRefExoticComponent<any>
  export const DropdownMenuPortal: React.FC<any>
  export const DropdownMenuSub: React.FC<any>
  export const DropdownMenuSubContent: React.ForwardRefExoticComponent<any>
  export const DropdownMenuSubTrigger: React.ForwardRefExoticComponent<any>
  export const DropdownMenuLabel: React.ForwardRefExoticComponent<any>
  export const DropdownMenuItem: React.ForwardRefExoticComponent<any>
  export const DropdownMenuCheckboxItem: React.ForwardRefExoticComponent<any>
  export const DropdownMenuRadioGroup: React.ForwardRefExoticComponent<any>
  export const DropdownMenuRadioItem: React.ForwardRefExoticComponent<any>
  export const DropdownMenuSeparator: React.ForwardRefExoticComponent<any>
  export const DropdownMenuShortcut: React.FC<any>
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

declare module '@/components/ui/progress' {
  export { Progress } from '@/components/ui/progress'
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
// Icons (Radix UI Icons)
// ============================================================================

declare module '@radix-ui/react-icons' {
  import * as React from 'react'
  
  export const MixerHorizontalIcon: React.FC<React.SVGProps<SVGSVGElement>>
  export const Cross2Icon: React.FC<React.SVGProps<SVGSVGElement>>
  export const TrashIcon: React.FC<React.SVGProps<SVGSVGElement>>
  export const ArrowDownIcon: React.FC<React.SVGProps<SVGSVGElement>>
  export const ArrowUpIcon: React.FC<React.SVGProps<SVGSVGElement>>
  export const ChevronsUpDownIcon: React.FC<React.SVGProps<SVGSVGElement>>
}

// ============================================================================
// Hooks
// ============================================================================

declare module '@/hooks/use-toast' {
  export * from '@/hooks/use-toast'
}
