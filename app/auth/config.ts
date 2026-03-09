/**
 * Auth Kit Demo Configuration
 * 
 * Bu dosya auth-kit'in test için örnek bir konfigürasyonunu içerir
 */

import type { AuthKitConfig } from '@arftech/arfweb-shared-lib/auth-kit'

export const demoAuthConfig: AuthKitConfig = {
  // ========== Callbacks ==========
  onSignIn: async (credentials) => {
    console.log('[Demo] Sign in attempt:', credentials)
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    
    // Demo: Kullanıcı adı "admin" ve şifre "password123" ise başarılı
    if (credentials.username === 'admin' && credentials.password === 'password123') {
      return {
        success: true,
        requiresOtp: true, // OTP test için
        data: {
          user: { username: 'admin' },
        },
      }
    }
    
    // Demo: Kullanıcı adı "user" ve şifre "password" ise OTP'siz başarılı
    if (credentials.username === 'user' && credentials.password === 'password') {
      return {
        success: true,
        requiresOtp: false,
        data: {
          user: { username: 'user' },
          token: 'demo-jwt-token',
        },
      }
    }
    
    return {
      success: false,
      error: 'Kullanıcı adı veya şifre hatalı',
    }
  },
  
  onOtpVerify: async (data) => {
    console.log('[Demo] OTP verify attempt:', data)
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    
    // Demo: OTP kodu "123456" ise başarılı
    if (data.code === '123456') {
      return {
        success: true,
        data: {
          token: 'demo-jwt-token',
          user: { username: data.username },
        },
      }
    }
    
    return {
      success: false,
      error: 'Geçersiz doğrulama kodu',
    }
  },
  
  onForgotPassword: async (data) => {
    console.log('[Demo] Forgot password attempt:', data)
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    
    return {
      success: true,
      message: 'Şifre sıfırlama bağlantısı e-posta adresinize gönderildi',
    }
  },
  
  onResetPassword: async (data) => {
    console.log('[Demo] Reset password attempt:', data)
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    
    return {
      success: true,
      message: 'Şifreniz başarıyla sıfırlandı',
    }
  },
  
  onResendOtp: async (username) => {
    console.log('[Demo] Resend OTP:', username)
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))
    
    return {
      success: true,
    }
  },
  
  // ========== Routes ==========
  routes: {
    afterSignIn: '/dashboard',
    afterOtp: '/dashboard',
    forgotPassword: '/auth/forgot-password',
    resetPassword: '/auth/reset-password',
    signIn: '/auth/signin',
    signUp: '/auth/signup',
  },
  
  // ========== i18n ==========
  locale: 'tr',
  
  // ========== UI Config ==========
  ui: {
    showRememberMe: true,
    showForgotPassword: true,
    showSignUpLink: false,
    logoUrl: '/logo.svg',
    brandName: 'ARF Kargo',
  },
  
  // ========== Debug ==========
  debug: true,
}
