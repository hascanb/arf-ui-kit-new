'use client'

/**
 * Auth Kit - OTP Form Component
 * 
 * 6 haneli OTP doğrulama formu
 * Ghost UI: InputOTP bileşeni dışarıdan import edilir
 */

import React, { useState } from 'react'
import { useAuthKit } from '../context/useAuthKit'
import type { OtpFormProps, OtpData } from '../context/types'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Alert } from '@/components/ui/alert'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp'

export function OtpForm({ 
  length = 6,
  username,
  onSuccess, 
  onError, 
  className 
}: OtpFormProps = {}) {
  const { config, t, lastUsername } = useAuthKit()
  
  // ========== State ==========
  const [code, setCode] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)
  
  const activeUsername = username || lastUsername || ''
  
  // ========== Validation ==========
  const validate = (): boolean => {
    if (code.length !== length) {
      const errorMsg = t('validation.invalidOtp')
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
    setSuccessMsg(null)
    
    if (!validate()) return
    if (!config.onOtpVerify) {
      console.error('[AuthKit] config.onOtpVerify is not defined')
      return
    }
    
    setIsLoading(true)
    
    try {
      const otpData: OtpData = {
        code,
        username: activeUsername,
      }
      
      const response = await config.onOtpVerify(otpData)
      
      if (response.success) {
        onSuccess?.(response)
        
        // Redirect
        const redirectUrl = config.routes.afterOtp || config.routes.afterSignIn
        window.location.href = redirectUrl
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
  
  // ========== Resend Handler ==========
  const handleResend = async () => {
    if (!config.onResendOtp) {
      console.warn('[AuthKit] config.onResendOtp is not defined')
      return
    }
    
    setError(null)
    setSuccessMsg(null)
    setIsResending(true)
    
    try {
      const response = await config.onResendOtp(activeUsername)
      
      if (response.success) {
        setSuccessMsg('Kod tekrar gönderildi')
        setCode('') // Reset code
      } else {
        setError(response.error || t('errors.generic'))
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : t('errors.networkError')
      setError(errorMsg)
    } finally {
      setIsResending(false)
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
        
        {/* Success Alert */}
        {successMsg && (
          <Alert>
            {successMsg}
          </Alert>
        )}
        
        {/* OTP Input */}
        <div className="space-y-2">
          <Label htmlFor="otp">{t('otp.code')}</Label>
          <div className="flex justify-center">
            <InputOTP
              maxLength={length}
              value={code}
              onChange={setCode}
              disabled={isLoading}
            >
              <InputOTPGroup>
                {Array.from({ length }).map((_, index) => (
                  <InputOTPSlot key={index} index={index} />
                ))}
              </InputOTPGroup>
            </InputOTP>
          </div>
        </div>
        
        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full"
          disabled={isLoading || code.length !== length}
        >
          {isLoading ? '...' : t('otp.submit')}
        </Button>
        
        {/* Resend Button */}
        {config.onResendOtp && (
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">
              {t('otp.didntReceive')}
            </p>
            <Button
              type="button"
              variant="ghost"
              onClick={handleResend}
              disabled={isResending || isLoading}
            >
              {isResending ? '...' : t('otp.resend')}
            </Button>
          </div>
        )}
        
        {/* Back to Sign In */}
        <div className="text-center">
          <a 
            href={config.routes.signIn}
            className="text-sm text-muted-foreground hover:text-primary"
          >
            {t('otp.backToSignIn')}
          </a>
        </div>
      </div>
    </form>
  )
}
