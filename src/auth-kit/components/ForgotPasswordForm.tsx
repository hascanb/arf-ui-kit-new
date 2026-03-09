'use client'

/**
 * Auth Kit - Forgot Password Form Component
 * 
 * E-posta ile şifre sıfırlama bağlantısı gönderme formu
 */

import React, { useState } from 'react'
import { useAuthKit } from '../context/useAuthKit'
import type { ForgotPasswordFormProps, ForgotPasswordData } from '../context/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert } from '@/components/ui/alert'

export function ForgotPasswordForm({ 
  onSuccess, 
  onError, 
  className 
}: ForgotPasswordFormProps = {}) {
  const { config, t } = useAuthKit()
  
  // ========== State ==========
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  
  // ========== Validation ==========
  const validate = (): boolean => {
    if (!email.trim()) {
      const errorMsg = t('validation.required')
      setError(errorMsg)
      onError?.(errorMsg)
      return false
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      const errorMsg = t('validation.invalidEmail')
      setError(errorMsg)
      onError?.(errorMsg)
      return false
    }
    
    return true
  }
  
  // ========== Submit Handler ==========
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)
    
    if (!validate()) return
    if (!config.onForgotPassword) {
      console.error('[AuthKit] config.onForgotPassword is not defined')
      return
    }
    
    setIsLoading(true)
    
    try {
      const data: ForgotPasswordData = {
        email: email.trim(),
      }
      
      const response = await config.onForgotPassword(data)
      
      if (response.success) {
        setSuccess(true)
        onSuccess?.(response)
      } else {
        const errorMsg = response.error || t('errors.generic')
        setError(errorMsg)
        onError?.(errorMsg)
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : t('errors.networkError')
      setError(errorMsg)
      onError?.(errorMsg)
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <form onSubmit={handleSubmit} className={className}>
      <div className="space-y-4">
        {/* Error Alert */}
        {error && (
          <Alert variant="destructive">
            {error}
          </Alert>
        )}
        
        {/* Success Message */}
        {success ? (
          <Alert>
            {t('forgotPassword.checkEmail')}
          </Alert>
        ) : (
          <>
            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email">{t('forgotPassword.email')}</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                placeholder={t('forgotPassword.email')}
                disabled={isLoading}
                autoComplete="email"
                autoFocus
              />
            </div>
            
            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? '...' : t('forgotPassword.submit')}
            </Button>
          </>
        )}
        
        {/* Back to Sign In */}
        <div className="text-center">
          <a 
            href={config.routes.signIn}
            className="text-sm text-muted-foreground hover:text-primary"
          >
            {t('forgotPassword.backToSignIn')}
          </a>
        </div>
      </div>
    </form>
  )
}
