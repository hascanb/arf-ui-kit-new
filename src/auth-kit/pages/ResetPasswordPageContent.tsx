'use client'

/**
 * Auth Kit - Reset Password Page Content
 * 
 * Şifre sıfırlama sayfası
 * URL'den token parametresi alır
 */

import React from 'react'
import { useAuthKit } from '../context/useAuthKit'
import { ResetPasswordForm } from '../components/ResetPasswordForm'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface ResetPasswordPageContentProps {
  /** Reset token (URL'den alınır) */
  token: string
}

export function ResetPasswordPageContent({ token }: ResetPasswordPageContentProps) {
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
        
        {/* Reset Password Card */}
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">
              {t('resetPassword.title')}
            </CardTitle>
            <CardDescription>
              {t('resetPassword.subtitle')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResetPasswordForm token={token} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
