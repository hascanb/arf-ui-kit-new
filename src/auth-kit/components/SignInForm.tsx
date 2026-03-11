'use client'

/**
 * Auth Kit - Sign In Form Component
 * 
 * Kullanıcı adı ve şifre ile giriş formu
 * Ghost UI pattern: Button, Input, Label, Checkbox bileşenleri dışarıdan import edilir
 */

import React, { useState } from 'react'
import { useAuthKit } from '../context/useAuthKit'
import type { SignInFormProps, SignInCredentials } from '../context/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Alert } from '@/components/ui/alert'
import { sanitizeAuthErrorMessage } from '../utils'

export function SignInForm({ 
  onSuccess, 
  onError, 
  className 
}: SignInFormProps = {}) {
  const { config, t, setLastUsername } = useAuthKit()
  const exposeErrorDetails = config.debug || config.maskSensitiveErrors === false
  const sanitizeError = (rawMessage: unknown, fallback: string) =>
    sanitizeAuthErrorMessage(rawMessage, {
      fallbackMessage: fallback,
      exposeDetails: exposeErrorDetails,
    })
  
  // ========== State ==========
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // ========== Validation ==========
  const validate = (): boolean => {
    if (!username.trim()) {
      const errorMsg = t('validation.required')
      setError(errorMsg)
      onError?.(errorMsg)
      return false
    }
    
    if (!password) {
      const errorMsg = t('validation.required')
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
    
    if (!validate()) return
    
    setIsLoading(true)
    
    try {
      const credentials: SignInCredentials = {
        username: username.trim(),
        password,
        rememberMe,
      }
      
      const response = await config.onSignIn(credentials)
      
      if (response.success) {
        // Kullanıcı adını sakla (OTP için gerekebilir)
        setLastUsername(username.trim())
        
        // Success callback
        onSuccess?.(response)
        
        // OTP gerekiyorsa OTP sayfasına yönlendir
        if (response.requiresOtp && config.routes.afterOtp) {
          window.location.href = config.routes.afterOtp
        } else {
          // Normal giriş - dashboard'a yönlendir
          window.location.href = config.routes.afterSignIn
        }
      } else {
        const errorMsg = sanitizeError(response.error, t('errors.generic'))
        setError(errorMsg)
        onError?.(errorMsg)
      }
    } catch (err) {
      const errorMsg = sanitizeError(err instanceof Error ? err.message : err, t('errors.networkError'))
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
        
        {/* Username Field */}
        <div className="space-y-2">
          <Label htmlFor="username">{t('signIn.username')}</Label>
          <Input
            id="username"
            type="text"
            value={username}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
            placeholder={t('signIn.username')}
            disabled={isLoading}
            autoComplete="username"
            autoFocus
          />
        </div>
        
        {/* Password Field */}
        <div className="space-y-2">
          <Label htmlFor="password">{t('signIn.password')}</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
            placeholder={t('signIn.password')}
            disabled={isLoading}
            autoComplete="current-password"
          />
        </div>
        
        {/* Remember Me & Forgot Password */}
        <div className="flex items-center justify-between">
          {config.ui?.showRememberMe !== false && (
            <div className="flex items-center space-x-2">
              <Checkbox
                id="rememberMe"
                checked={rememberMe}
                onCheckedChange={(checked: boolean | 'indeterminate') => setRememberMe(checked as boolean)}
                disabled={isLoading}
              />
              <Label htmlFor="rememberMe" className="text-sm cursor-pointer">
                {t('signIn.rememberMe')}
              </Label>
            </div>
          )}
          
          {config.ui?.showForgotPassword !== false && config.onForgotPassword && (
            <a 
              href={config.routes.forgotPassword}
              className="text-sm text-primary hover:underline"
            >
              {t('signIn.forgotPassword')}
            </a>
          )}
        </div>
        
        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? '...' : t('signIn.submit')}
        </Button>
        
        {/* Sign Up Link */}
        {config.ui?.showSignUpLink && config.routes.signUp && (
          <div className="text-center text-sm text-muted-foreground">
            {t('signIn.noAccount')}{' '}
            <a href={config.routes.signUp} className="text-primary hover:underline">
              {t('signIn.signUp')}
            </a>
          </div>
        )}
      </div>
    </form>
  )
}
