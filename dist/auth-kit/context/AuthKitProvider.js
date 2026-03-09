'use client';
import { jsx as _jsx } from "react/jsx-runtime";
/**
 * Auth Kit - Context Provider
 *
 * AuthKit konfigürasyonunu ve state'i yöneten Context Provider
 * Tüm auth bileşenlerini bu provider ile sarmak gerekir
 *
 * @example
 * <AuthKitProvider config={authConfig}>
 *   <App />
 * </AuthKitProvider>
 */
import { createContext, useState, useMemo, useCallback } from 'react';
import { useTranslation } from '../i18n/use-translation';
export const AuthKitContext = createContext(null);
export function AuthKitProvider({ config, children }) {
    // ========== State Management ==========
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [lastUsername, setLastUsername] = useState(null);
    // ========== Translation System ==========
    const { t: translateFn } = useTranslation(config.locale, config.translations);
    // ========== Custom Translation Function with Params ==========
    const t = useCallback((key, params) => {
        return translateFn(key, params);
    }, [translateFn]);
    // ========== Context Value ==========
    const contextValue = useMemo(() => ({
        config,
        t,
        isLoading,
        setIsLoading,
        error,
        setError,
        lastUsername,
        setLastUsername,
    }), [config, t, isLoading, error, lastUsername]);
    // ========== Debug Logging ==========
    if (config.debug) {
        console.log('[AuthKit] Provider initialized with config:', {
            locale: config.locale,
            hasOtpVerify: !!config.onOtpVerify,
            hasForgotPassword: !!config.onForgotPassword,
            hasResetPassword: !!config.onResetPassword,
            routes: config.routes,
        });
    }
    return (_jsx(AuthKitContext.Provider, { value: contextValue, children: children }));
}
//# sourceMappingURL=AuthKitProvider.js.map