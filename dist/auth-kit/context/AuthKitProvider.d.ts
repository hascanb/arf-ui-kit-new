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
import React from 'react';
import type { AuthKitConfig, AuthKitContextValue } from './types';
export declare const AuthKitContext: React.Context<AuthKitContextValue | null>;
interface AuthKitProviderProps {
    /** Kütüphane konfigürasyonu */
    config: AuthKitConfig;
    /** Child components */
    children: React.ReactNode;
}
export declare function AuthKitProvider({ config, children }: AuthKitProviderProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=AuthKitProvider.d.ts.map