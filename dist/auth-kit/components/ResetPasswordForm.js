'use client';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
/**
 * Auth Kit - Reset Password Form Component
 *
 * Token ile şifre sıfırlama formu
 */
import { useState } from 'react';
import { useAuthKit } from '../context/useAuthKit';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert } from '@/components/ui/alert';
export function ResetPasswordForm({ token, onSuccess, onError, className }) {
    const { config, t } = useAuthKit();
    // ========== State ==========
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    // ========== Validation ==========
    const validate = () => {
        if (!password) {
            const errorMsg = t('validation.required');
            setError(errorMsg);
            onError?.(errorMsg);
            return false;
        }
        if (password.length < 8) {
            const errorMsg = t('validation.passwordTooShort');
            setError(errorMsg);
            onError?.(errorMsg);
            return false;
        }
        if (password !== confirmPassword) {
            const errorMsg = t('validation.passwordsDontMatch');
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
        if (!config.onResetPassword) {
            console.error('[AuthKit] config.onResetPassword is not defined');
            return;
        }
        setIsLoading(true);
        try {
            const data = {
                token,
                password,
                confirmPassword,
            };
            const response = await config.onResetPassword(data);
            if (response.success) {
                setSuccess(true);
                onSuccess?.(response);
                // Redirect to sign in after 2 seconds
                setTimeout(() => {
                    window.location.href = config.routes.signIn;
                }, 2000);
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
    return (_jsx("form", { onSubmit: handleSubmit, className: className, children: _jsxs("div", { className: "space-y-4", children: [error && (_jsx(Alert, { variant: "destructive", children: error })), success ? (_jsx(Alert, { children: t('resetPassword.success') })) : (_jsxs(_Fragment, { children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "password", children: t('resetPassword.password') }), _jsx(Input, { id: "password", type: "password", value: password, onChange: (e) => setPassword(e.target.value), placeholder: t('resetPassword.password'), disabled: isLoading, autoComplete: "new-password", autoFocus: true })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "confirmPassword", children: t('resetPassword.confirmPassword') }), _jsx(Input, { id: "confirmPassword", type: "password", value: confirmPassword, onChange: (e) => setConfirmPassword(e.target.value), placeholder: t('resetPassword.confirmPassword'), disabled: isLoading, autoComplete: "new-password" })] }), _jsx(Button, { type: "submit", className: "w-full", disabled: isLoading, children: isLoading ? '...' : t('resetPassword.submit') })] }))] }) }));
}
//# sourceMappingURL=ResetPasswordForm.js.map