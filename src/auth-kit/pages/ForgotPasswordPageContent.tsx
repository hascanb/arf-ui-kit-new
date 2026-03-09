'use client'

/**
 * Auth Kit - Forgot Password Page Content
 * 
 * Şifremi unuttum sayfası
 */

import React from 'react'
import { useAuthKit } from '../context/useAuthKit'
import { ForgotPasswordForm } from '../components/ForgotPasswordForm'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export function ForgotPasswordPageContent() {
  const { config, t } = useAuthKit()
  
  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-muted/40">
      <div className="w-full max-w-md">
        {/* Logo */}
        {config.ui?.logoUrl && (
          <div className="flex justify-center mb-8">
            <img 
              src={config.ui.logoUrl} 
              alt={config.ui.brandName || 'Logo'}
              className="h-12 w-auto"
            />
          </div>
        )}
        
        {/* Forgot Password Card */}
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">
              {t('forgotPassword.title')}
            </CardTitle>
            <CardDescription>
              {t('forgotPassword.subtitle')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ForgotPasswordForm />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
