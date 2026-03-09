/**
 * Layout Kit - DashboardLayout
 *
 * Tam özellikli dashboard layout wrapper
 * AppSidebar + AppHeader + Content + Optional Footer
 */
"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { AppHeader } from "./AppHeader";
import { AppFooter } from "./AppFooter";
export function DashboardLayout({ children, brand, user, navGroups, breadcrumbs, searchPlaceholder, notificationCount, showFooter = false, footerProps, onLogout, onSearchClick, onNotificationClick, }) {
    return (_jsxs(SidebarProvider, { children: [_jsx(AppSidebar, { brand: brand, user: user, navGroups: navGroups, onLogout: onLogout }), _jsxs(SidebarInset, { children: [_jsx(AppHeader, { breadcrumbs: breadcrumbs, searchPlaceholder: searchPlaceholder, notificationCount: notificationCount, onSearchClick: onSearchClick, onNotificationClick: onNotificationClick }), _jsx("main", { className: "flex flex-1 flex-col", children: children }), showFooter && _jsx(AppFooter, { ...footerProps })] })] }));
}
//# sourceMappingURL=DashboardLayout.js.map