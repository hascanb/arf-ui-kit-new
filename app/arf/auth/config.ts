import type { AuthKitConfig } from '@hascanb/arf-ui-kit/auth-kit'
import { ARF_ROUTES } from '../_shared/routes'

export const arfAuthConfig: AuthKitConfig = {
  onSignIn: async (credentials) => {
    console.log('[ARF] Sign in attempt:', credentials)

    await new Promise((resolve) => setTimeout(resolve, 1200))

    if (credentials.username === 'admin' && credentials.password === 'password123') {
      return {
        success: true,
        requiresOtp: true,
        data: {
          user: { username: 'admin' },
        },
      }
    }

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

  onGoogleSignIn: async () => {
    console.log('[ARF] Google sign in attempt')

    await new Promise((resolve) => setTimeout(resolve, 1500))

    return {
      success: true,
      requiresOtp: false,
      data: {
        user: { username: 'google-user', email: 'user@gmail.com' },
        token: 'demo-google-jwt-token',
      },
    }
  },

  onAppleSignIn: async () => {
    console.log('[ARF] Apple sign in attempt')

    await new Promise((resolve) => setTimeout(resolve, 1500))

    return {
      success: true,
      requiresOtp: false,
      data: {
        user: { username: 'apple-user', email: 'user@icloud.com' },
        token: 'demo-apple-jwt-token',
      },
    }
  },

  onOtpVerify: async (data) => {
    console.log('[ARF] OTP verify attempt:', data)

    await new Promise((resolve) => setTimeout(resolve, 900))

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
      error: 'Gecersiz dogrulama kodu',
    }
  },

  onForgotPassword: async () => {
    await new Promise((resolve) => setTimeout(resolve, 800))

    return {
      success: true,
      message: 'Sifre sifirlama baglantisi e-posta adresinize gonderildi',
    }
  },

  onResetPassword: async () => {
    await new Promise((resolve) => setTimeout(resolve, 800))

    return {
      success: true,
      message: 'Sifreniz basariyla sifirlandi',
    }
  },

  onResendOtp: async () => {
    await new Promise((resolve) => setTimeout(resolve, 400))

    return {
      success: true,
    }
  },

  routes: {
    afterSignIn: ARF_ROUTES.root,
    afterOtp: ARF_ROUTES.root,
    forgotPassword: ARF_ROUTES.auth.forgotPassword,
    resetPassword: ARF_ROUTES.auth.resetPassword,
    signIn: ARF_ROUTES.auth.signIn,
    signUp: ARF_ROUTES.auth.signUp,
  },

  locale: 'tr',

  ui: {
    showRememberMe: true,
    showForgotPassword: true,
    showSignUpLink: true,
    showSocialLogins: true,
    socialProviders: ['google', 'apple'],
    logoUrl: undefined,
    brandName: 'ARF',
    theme: 'light',
    primaryColor: '#2b2a31',
    accentColor: '#5b5752',
    borderRadius: 'rounded-2xl',
    signIn2: {
      badge: 'Arf Workspace',
      title: 'Hoş Geldiniz',
      description: 'Giriş yaparak iş süreçlerinizi kolaylaştırın',
      backgroundImageUrl: undefined,
      backgroundImageAlt: 'Lojistik ve sürece ilişkin arka plan',
    },
  },

  debug: true,
}
