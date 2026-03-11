'use client'

import { AuthKitProvider, ForgotPasswordPageContent } from '@hascanb/arf-ui-kit/auth-kit'
import { demoAuthConfig } from '../../../../auth/config'

export default function TestForgotPasswordPage() {
  return (
    <AuthKitProvider config={demoAuthConfig}>
      <ForgotPasswordPageContent />
    </AuthKitProvider>
  )
}
