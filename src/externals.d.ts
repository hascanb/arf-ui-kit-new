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

declare module '@/components/ui/field' {
  export {
    Field,
    FieldLabel,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLegend,
    FieldSeparator,
    FieldSet,
    FieldContent,
    FieldTitle,
  } from '@/components/ui/field'
}

declare module '@/components/ui/select' {
  import * as React from 'react'
  
  export const Select: React.FC<Record<string, unknown>>
  export const SelectGroup: React.FC<Record<string, unknown>>
  export const SelectValue: React.FC<Record<string, unknown>>
  export const SelectTrigger: React.ForwardRefExoticComponent<Record<string, unknown>>
  export const SelectContent: React.ForwardRefExoticComponent<Record<string, unknown>>
  export const SelectLabel: React.ForwardRefExoticComponent<Record<string, unknown>>
  export const SelectItem: React.ForwardRefExoticComponent<Record<string, unknown>>
  export const SelectSeparator: React.ForwardRefExoticComponent<Record<string, unknown>>
  export const SelectScrollUpButton: React.ForwardRefExoticComponent<Record<string, unknown>>
  export const SelectScrollDownButton: React.ForwardRefExoticComponent<Record<string, unknown>>
}

declare module '@/components/ui/textarea' {
  import * as React from 'react'
  export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}
  export const Textarea: React.ForwardRefExoticComponent<TextareaProps>
}

declare module '@/components/ui/radio-group' {
  import * as React from 'react'
  export const RadioGroup: React.ForwardRefExoticComponent<Record<string, unknown>>
  export const RadioGroupItem: React.ForwardRefExoticComponent<Record<string, unknown>>
}

declare module '@/components/ui/switch' {
  import * as React from 'react'
  export const Switch: React.ForwardRefExoticComponent<Record<string, unknown>>
}

declare module '@/components/ui/slider' {
  export * from '@/components/ui/slider'
}

declare module '@/components/ui/calendar' {
  import React from 'react'
  export type CalendarProps = Record<string, unknown>
  export const Calendar: React.ForwardRefExoticComponent<CalendarProps>
}

declare module '@/components/ui/popover' {
  import * as React from 'react'
  
  export const Popover: React.FC<Record<string, unknown>>
  export const PopoverTrigger: React.ForwardRefExoticComponent<Record<string, unknown>>
  export const PopoverContent: React.ForwardRefExoticComponent<Record<string, unknown>>
  export const PopoverAnchor: React.ForwardRefExoticComponent<Record<string, unknown>>
}

declare module '@/components/ui/command' {
  import * as React from 'react'
  
  export const Command: React.ForwardRefExoticComponent<Record<string, unknown>>
  export const CommandDialog: React.FC<Record<string, unknown>>
  export const CommandInput: React.ForwardRefExoticComponent<Record<string, unknown>>
  export const CommandList: React.ForwardRefExoticComponent<Record<string, unknown>>
  export const CommandEmpty: React.ForwardRefExoticComponent<Record<string, unknown>>
  export const CommandGroup: React.ForwardRefExoticComponent<Record<string, unknown>>
  export const CommandItem: React.ForwardRefExoticComponent<Record<string, unknown>>
  export const CommandShortcut: React.FC<Record<string, unknown>>
  export const CommandSeparator: React.ForwardRefExoticComponent<Record<string, unknown>>
}

declare module '@/components/ui/separator' {
  import * as React from 'react'
  
  export const Separator: React.ForwardRefExoticComponent<Record<string, unknown>>
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
  
  export const ScrollArea: React.ForwardRefExoticComponent<Record<string, unknown>>
  export const ScrollBar: React.ForwardRefExoticComponent<Record<string, unknown>>
}

declare module '@/components/ui/dropdown-menu' {
  import * as React from 'react'
  
  export const DropdownMenu: React.FC<Record<string, unknown>>
  export const DropdownMenuTrigger: React.ForwardRefExoticComponent<Record<string, unknown>>
  export const DropdownMenuContent: React.ForwardRefExoticComponent<Record<string, unknown>>
  export const DropdownMenuGroup: React.ForwardRefExoticComponent<Record<string, unknown>>
  export const DropdownMenuPortal: React.FC<Record<string, unknown>>
  export const DropdownMenuSub: React.FC<Record<string, unknown>>
  export const DropdownMenuSubContent: React.ForwardRefExoticComponent<Record<string, unknown>>
  export const DropdownMenuSubTrigger: React.ForwardRefExoticComponent<Record<string, unknown>>
  export const DropdownMenuLabel: React.ForwardRefExoticComponent<Record<string, unknown>>
  export const DropdownMenuItem: React.ForwardRefExoticComponent<Record<string, unknown>>
  export const DropdownMenuCheckboxItem: React.ForwardRefExoticComponent<Record<string, unknown>>
  export const DropdownMenuRadioGroup: React.ForwardRefExoticComponent<Record<string, unknown>>
  export const DropdownMenuRadioItem: React.ForwardRefExoticComponent<Record<string, unknown>>
  export const DropdownMenuSeparator: React.ForwardRefExoticComponent<Record<string, unknown>>
  export const DropdownMenuShortcut: React.FC<Record<string, unknown>>
}

declare module '@/components/ui/hover-card' {
  import * as React from 'react'

  export const HoverCard: React.FC<Record<string, unknown>>
  export const HoverCardTrigger: React.ForwardRefExoticComponent<Record<string, unknown>>
  export const HoverCardContent: React.ForwardRefExoticComponent<Record<string, unknown>>
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
