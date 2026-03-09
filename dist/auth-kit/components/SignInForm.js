'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Auth Kit - Sign In Form Component
 *
 * Kullanıcı adı ve şifre ile giriş formu
 * Ghost UI pattern: Button, Input, Label, Checkbox bileşenleri dışarıdan import edilir
 */
import { useState } from 'react';
import { useAuthKit } from '../context/useAuthKit';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert } from '@/components/ui/alert';
export function SignInForm({ onSuccess, onError, className } = {}) {
    const { config, t, setLastUsername } = useAuthKit();
    // ========== State ==========
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    // ========== Validation ==========
    const validate = () => {
        if (!username.trim()) {
            const errorMsg = t('validation.required');
            setError(errorMsg);
            onError?.(errorMsg);
            return false;
        }
        if (!password) {
            const errorMsg = t('validation.required');
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
        if (!validate())
            return;
        setIsLoading(true);
        try {
            const credentials = {
                username: username.trim(),
                password,
                rememberMe,
            };
            const response = await config.onSignIn(credentials);
            if (response.success) {
                // Kullanıcı adını sakla (OTP için gerekebilir)
                setLastUsername(username.trim());
                // Success callback
                onSuccess?.(response);
                // OTP gerekiyorsa OTP sayfasına yönlendir
                if (response.requiresOtp && config.routes.afterOtp) {
                    window.location.href = config.routes.afterOtp;
                }
                else {
                    // Normal giriş - dashboard'a yönlendir
                    window.location.href = config.routes.afterSignIn;
                }
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
    return (_jsx("form", { onSubmit: handleSubmit, className: className, children: _jsxs("div", { className: "space-y-4", children: [error && (_jsx(Alert, { variant: "destructive", children: error })), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "username", children: t('signIn.username') }), _jsx(Input, { id: "username", type: "text", value: username, onChange: (e) => setUsername(e.target.value), placeholder: t('signIn.username'), disabled: isLoading, autoComplete: "username", autoFocus: true })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "password", children: t('signIn.password') }), _jsx(Input, { id: "password", type: "password", value: password, onChange: (e) => setPassword(e.target.value), placeholder: t('signIn.password'), disabled: isLoading, autoComplete: "current-password" })] }), _jsxs("div", { className: "flex items-center justify-between", children: [config.ui?.showRememberMe !== false && (_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(Checkbox, { id: "rememberMe", checked: rememberMe, onCheckedChange: (checked) => setRememberMe(checked), disabled: isLoading }), _jsx(Label, { htmlFor: "rememberMe", className: "text-sm cursor-pointer", children: t('signIn.rememberMe') })] })), config.ui?.showForgotPassword !== false && config.onForgotPassword && (_jsx("a", { href: config.routes.forgotPassword, className: "text-sm text-primary hover:underline", children: t('signIn.forgotPassword') }))] }), _jsx(Button, { type: "submit", className: "w-full", disabled: isLoading, children: isLoading ? '...' : t('signIn.submit') }), config.ui?.showSignUpLink && config.routes.signUp && (_jsxs("div", { className: "text-center text-sm text-muted-foreground", children: [t('signIn.noAccount'), ' ', _jsx("a", { href: config.routes.signUp, className: "text-primary hover:underline", children: t('signIn.signUp') })] }))] }) }));
}
//# sourceMappingURL=SignInForm.js.map