'use client'

/**
 * Auth Kit - Sign In Page Content (Alternative Layout)
 * 
 * Split-screen layout: Sol tarafta görsel, sağ tarafta form
 * Modern ve görsel ağırlıklı tasarım
 */

import React from 'react'
import { useAuthKit } from '../context/useAuthKit'
import { SignInForm } from '../components/SignInForm'

export function SignIn2PageContent() {
  const { config, t } = useAuthKit()
  
  return (
    <div className="flex min-h-screen">
      {/* Left Panel - Visual/Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary items-center justify-center p-12">
        <div className="max-w-md text-white space-y-6">
          {config.ui?.logoUrl && (
            <img 
              src={config.ui.logoUrl} 
              alt={config.ui.brandName || 'Logo'}
              className="h-16 w-auto mb-8"
            />
          )}
          {config.ui?.brandName && (
            <>
              <h1 className="text-4xl font-bold">
                Hoş Geldiniz
              </h1>
              <p className="text-lg text-primary-foreground/80">
                {config.ui.brandName} platformuna giriş yapın ve işlemlerinize devam edin.
              </p>
            </>
          )}
        </div>
      </div>
      
      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Logo */}
          {config.ui?.logoUrl && (
            <div className="flex justify-center lg:hidden">
              <img 
                src={config.ui.logoUrl} 
                alt={config.ui.brandName || 'Logo'}
                className="h-12 w-auto"
              />
            </div>
          )}
          
          {/* Header */}
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold">
              {t('signIn.title')}
            </h2>
            <p className="mt-2 text-muted-foreground">
              {t('signIn.subtitle')}
            </p>
          </div>
          
          {/* Form */}
          <SignInForm />
        </div>
      </div>
    </div>
  )
}
