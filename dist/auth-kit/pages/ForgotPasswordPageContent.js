'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useAuthKit } from '../context/useAuthKit';
import { ForgotPasswordForm } from '../components/ForgotPasswordForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
export function ForgotPasswordPageContent() {
    const { config, t } = useAuthKit();
    return (_jsx("div", { className: "flex min-h-screen items-center justify-center p-4 bg-muted/40", children: _jsxs("div", { className: "w-full max-w-md", children: [config.ui?.logoUrl && (_jsx("div", { className: "flex justify-center mb-8", children: _jsx("img", { src: config.ui.logoUrl, alt: config.ui.brandName || 'Logo', className: "h-12 w-auto" }) })), _jsxs(Card, { children: [_jsxs(CardHeader, { className: "text-center", children: [_jsx(CardTitle, { className: "text-2xl font-bold", children: t('forgotPassword.title') }), _jsx(CardDescription, { children: t('forgotPassword.subtitle') })] }), _jsx(CardContent, { children: _jsx(ForgotPasswordForm, {}) })] })] }) }));
}
//# sourceMappingURL=ForgotPasswordPageContent.js.map