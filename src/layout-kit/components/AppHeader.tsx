"use client"

import * as React from "react"
import { Bell, Search } from "lucide-react"

import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import type { AppHeaderProps } from "../context/types"

const DEFAULT_COMMAND_GROUP = "Commands"

export function AppHeader({ 
  breadcrumbs = [],
  searchPlaceholder = "Search...",
  searchShortcut,
  searchCommands = [],
  commandTitle = "Search commands",
  commandDescription = "Search for an action to run.",
  searchEmptyMessage = "No result found.",
  notificationCount = 0,
  notificationsLabel = "Notifications",
  onSearchClick,
  onNotificationClick
}: AppHeaderProps) {
  const [isCommandOpen, setIsCommandOpen] = React.useState(false)

  const groupedCommands = React.useMemo(() => {
    const groups = new Map<string, typeof searchCommands>()

    searchCommands.forEach((item) => {
      const groupKey = item.group?.trim() || DEFAULT_COMMAND_GROUP
      const existingGroup = groups.get(groupKey)

      if (existingGroup) {
        existingGroup.push(item)
      } else {
        groups.set(groupKey, [item])
      }
    })

    return Array.from(groups.entries()).map(([group, items]) => ({ group, items }))
  }, [searchCommands])

  const openCommand = React.useCallback(() => {
    onSearchClick?.()
    setIsCommandOpen(true)
  }, [onSearchClick])

  const handleCommandSelect = React.useCallback((onSelect?: () => void) => {
    onSelect?.()
    setIsCommandOpen(false)
  }, [])

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault()
        setIsCommandOpen(true)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  return (
    <>
      <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-3 border-b bg-background/95 px-4 backdrop-blur supports-backdrop-filter:bg-background/60">
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
          onClick={openCommand}
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
          onClick={openCommand}
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

      <CommandDialog
        open={isCommandOpen}
        onOpenChange={setIsCommandOpen}
        title={commandTitle}
        description={commandDescription}
      >
        <CommandInput placeholder={searchPlaceholder} />
        <CommandList>
          <CommandEmpty>{searchEmptyMessage}</CommandEmpty>

          {groupedCommands.map(({ group, items }, groupIndex) => (
            <React.Fragment key={group}>
              {groupIndex > 0 && <CommandSeparator />}
              <CommandGroup heading={group}>
                {items.map((item) => (
                  <CommandItem
                    key={item.id}
                    keywords={item.keywords}
                    onSelect={() => handleCommandSelect(item.onSelect)}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                    {item.shortcut && <CommandShortcut>{item.shortcut}</CommandShortcut>}
                  </CommandItem>
                ))}
              </CommandGroup>
            </React.Fragment>
          ))}
        </CommandList>
      </CommandDialog>
    </>
  )
}