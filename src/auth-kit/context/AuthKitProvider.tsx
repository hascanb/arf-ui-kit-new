'use client'

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

import React, { createContext, useState, useMemo, useCallback } from 'react'
import type { AuthKitConfig, AuthKitContextValue } from './types'
import { useTranslation } from '../i18n/use-translation'

export const AuthKitContext = createContext<AuthKitContextValue | null>(null)

interface AuthKitProviderProps {
  /** Kütüphane konfigürasyonu */
  config: AuthKitConfig
  
  /** Child components */
  children: React.ReactNode
}

export function AuthKitProvider({ config, children }: AuthKitProviderProps) {
  // ========== State Management ==========
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastUsername, setLastUsername] = useState<string | null>(null)
  
  // ========== Translation System ==========
  const { t: translateFn } = useTranslation(
    config.locale,
    config.translations
  )
  
  // ========== Custom Translation Function with Params ==========
  const t = useCallback(
    (key: string, params?: Record<string, string>) => {
      return translateFn(key, params)
    },
    [translateFn]
  )
  
  // ========== Context Value ==========
  const contextValue = useMemo<AuthKitContextValue>(
    () => ({
      config,
      t,
      isLoading,
      setIsLoading,
      error,
      setError,
      lastUsername,
      setLastUsername,
    }),
    [config, t, isLoading, error, lastUsername]
  )
  
  // ========== Debug Logging ==========
  if (config.debug) {
    console.log('[AuthKit] Provider initialized with config:', {
      locale: config.locale,
      hasOtpVerify: !!config.onOtpVerify,
      hasForgotPassword: !!config.onForgotPassword,
      hasResetPassword: !!config.onResetPassword,
      routes: config.routes,
    })
  }
  
  return (
    <AuthKitContext.Provider value={contextValue}>
      {children}
    </AuthKitContext.Provider>
  )
}
