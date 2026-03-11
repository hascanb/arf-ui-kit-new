'use client'

/**
 * Auth Layout
 * AuthKitProvider ile auth sayfalarını sarar
 */

import { AuthKitProvider } from '@hascanb/arf-ui-kit/auth-kit'
import { demoAuthConfig } from './config'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthKitProvider config={demoAuthConfig}>
      {children}
    </AuthKitProvider>
  )
}
