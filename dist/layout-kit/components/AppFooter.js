/**
 * Layout Kit - AppFooter
 *
 * Dashboard footer bileşeni
 * - Marka bilgisi
 * - Link grupları
 * - Sosyal medya linkleri
 * - Copyright
 */
"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
export function AppFooter({ brandName = "ARF Technology", copyright, description, linkGroups = [], socialLinks = [], className = "", }) {
    const currentYear = new Date().getFullYear();
    const copyrightText = copyright || `© ${currentYear} ${brandName}. All rights reserved.`;
    return (_jsx("footer", { className: `border-t bg-background ${className}`, children: _jsxs("div", { className: "container mx-auto px-4 py-8", children: [_jsxs("div", { className: "grid gap-8 md:grid-cols-2 lg:grid-cols-4", children: [_jsxs("div", { className: "space-y-3", children: [_jsx("h3", { className: "text-lg font-semibold", children: brandName }), description && (_jsx("p", { className: "text-sm text-muted-foreground", children: description })), socialLinks.length > 0 && (_jsx("div", { className: "flex gap-2 pt-2", children: socialLinks.map((social, index) => {
                                        const Icon = social.icon;
                                        return (_jsx(Link, { href: social.href, target: "_blank", rel: "noopener noreferrer", className: "flex size-9 items-center justify-center rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground", "aria-label": social.label, children: _jsx(Icon, { className: "size-4" }) }, index));
                                    }) }))] }), linkGroups.map((group, groupIndex) => (_jsxs("div", { className: "space-y-3", children: [_jsx("h4", { className: "text-sm font-semibold", children: group.title }), _jsx("ul", { className: "space-y-2", children: group.links.map((link, linkIndex) => (_jsx("li", { children: _jsx(Link, { href: link.href, className: "text-sm text-muted-foreground transition-colors hover:text-foreground", children: link.label }) }, linkIndex))) })] }, groupIndex)))] }), _jsx(Separator, { className: "my-6" }), _jsxs("div", { className: "flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left", children: [_jsx("p", { className: "text-sm text-muted-foreground", children: copyrightText }), _jsxs("div", { className: "flex gap-4 text-sm text-muted-foreground", children: [_jsx(Link, { href: "/privacy", className: "transition-colors hover:text-foreground", children: "Privacy Policy" }), _jsx(Link, { href: "/terms", className: "transition-colors hover:text-foreground", children: "Terms of Service" })] })] })] }) }));
}
//# sourceMappingURL=AppFooter.js.map