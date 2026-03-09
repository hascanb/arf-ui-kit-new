'use client';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
/**
 * Auth Kit - Forgot Password Form Component
 *
 * E-posta ile şifre sıfırlama bağlantısı gönderme formu
 */
import { useState } from 'react';
import { useAuthKit } from '../context/useAuthKit';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert } from '@/components/ui/alert';
export function ForgotPasswordForm({ onSuccess, onError, className } = {}) {
    const { config, t } = useAuthKit();
    // ========== State ==========
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    // ========== Validation ==========
    const validate = () => {
        if (!email.trim()) {
            const errorMsg = t('validation.required');
            setError(errorMsg);
            onError?.(errorMsg);
            return false;
        }
        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            const errorMsg = t('validation.invalidEmail');
            setError(errorMsg);
            onError?.(errorMsg);
            return false;
        }
        return true;
    };
    // ========== Submit Handler ==========
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);
        if (!validate())
            return;
        if (!config.onForgotPassword) {
            console.error('[AuthKit] config.onForgotPassword is not defined');
            return;
        }
        setIsLoading(true);
        try {
            const data = {
                email: email.trim(),
            };
            const response = await config.onForgotPassword(data);
            if (response.success) {
                setSuccess(true);
                onSuccess?.(response);
            }
            else {
                const errorMsg = response.error || t('errors.generic');
                setError(errorMsg);
                onError?.(errorMsg);
            }
        }
        catch (err) {
            const errorMsg = err instanceof Error ? err.message : t('errors.networkError');
            setError(errorMsg);
            onError?.(errorMsg);
        }
        finally {
            setIsLoading(false);
        }
    };
    return (_jsx("form", { onSubmit: handleSubmit, className: className, children: _jsxs("div", { className: "space-y-4", children: [error && (_jsx(Alert, { variant: "destructive", children: error })), success ? (_jsx(Alert, { children: t('forgotPassword.checkEmail') })) : (_jsxs(_Fragment, { children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "email", children: t('forgotPassword.email') }), _jsx(Input, { id: "email", type: "email", value: email, onChange: (e) => setEmail(e.target.value), placeholder: t('forgotPassword.email'), disabled: isLoading, autoComplete: "email", autoFocus: true })] }), _jsx(Button, { type: "submit", className: "w-full", disabled: isLoading, children: isLoading ? '...' : t('forgotPassword.submit') })] })), _jsx("div", { className: "text-center", children: _jsx("a", { href: config.routes.signIn, className: "text-sm text-muted-foreground hover:text-primary", children: t('forgotPassword.backToSignIn') }) })] }) }));
}
//# sourceMappingURL=ForgotPasswordForm.js.map