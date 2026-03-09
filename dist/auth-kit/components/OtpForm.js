'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Auth Kit - OTP Form Component
 *
 * 6 haneli OTP doğrulama formu
 * Ghost UI: InputOTP bileşeni dışarıdan import edilir
 */
import { useState } from 'react';
import { useAuthKit } from '../context/useAuthKit';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert } from '@/components/ui/alert';
import { InputOTP, InputOTPGroup, InputOTPSlot, } from '@/components/ui/input-otp';
export function OtpForm({ length = 6, username, onSuccess, onError, className } = {}) {
    const { config, t, lastUsername } = useAuthKit();
    // ========== State ==========
    const [code, setCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const [error, setError] = useState(null);
    const [successMsg, setSuccessMsg] = useState(null);
    const activeUsername = username || lastUsername || '';
    // ========== Validation ==========
    const validate = () => {
        if (code.length !== length) {
            const errorMsg = t('validation.invalidOtp');
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
        setSuccessMsg(null);
        if (!validate())
            return;
        if (!config.onOtpVerify) {
            console.error('[AuthKit] config.onOtpVerify is not defined');
            return;
        }
        setIsLoading(true);
        try {
            const otpData = {
                code,
                username: activeUsername,
            };
            const response = await config.onOtpVerify(otpData);
            if (response.success) {
                onSuccess?.(response);
                // Redirect
                const redirectUrl = config.routes.afterOtp || config.routes.afterSignIn;
                window.location.href = redirectUrl;
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
    // ========== Resend Handler ==========
    const handleResend = async () => {
        if (!config.onResendOtp) {
            console.warn('[AuthKit] config.onResendOtp is not defined');
            return;
        }
        setError(null);
        setSuccessMsg(null);
        setIsResending(true);
        try {
            const response = await config.onResendOtp(activeUsername);
            if (response.success) {
                setSuccessMsg('Kod tekrar gönderildi');
                setCode(''); // Reset code
            }
            else {
                setError(response.error || t('errors.generic'));
            }
        }
        catch (err) {
            const errorMsg = err instanceof Error ? err.message : t('errors.networkError');
            setError(errorMsg);
        }
        finally {
            setIsResending(false);
        }
    };
    return (_jsx("form", { onSubmit: handleSubmit, className: className, children: _jsxs("div", { className: "space-y-4", children: [error && (_jsx(Alert, { variant: "destructive", children: error })), successMsg && (_jsx(Alert, { children: successMsg })), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "otp", children: t('otp.code') }), _jsx("div", { className: "flex justify-center", children: _jsx(InputOTP, { maxLength: length, value: code, onChange: setCode, disabled: isLoading, children: _jsx(InputOTPGroup, { children: Array.from({ length }).map((_, index) => (_jsx(InputOTPSlot, { index: index }, index))) }) }) })] }), _jsx(Button, { type: "submit", className: "w-full", disabled: isLoading || code.length !== length, children: isLoading ? '...' : t('otp.submit') }), config.onResendOtp && (_jsxs("div", { className: "text-center", children: [_jsx("p", { className: "text-sm text-muted-foreground mb-2", children: t('otp.didntReceive') }), _jsx(Button, { type: "button", variant: "ghost", onClick: handleResend, disabled: isResending || isLoading, children: isResending ? '...' : t('otp.resend') })] })), _jsx("div", { className: "text-center", children: _jsx("a", { href: config.routes.signIn, className: "text-sm text-muted-foreground hover:text-primary", children: t('otp.backToSignIn') }) })] }) }));
}
//# sourceMappingURL=OtpForm.js.map