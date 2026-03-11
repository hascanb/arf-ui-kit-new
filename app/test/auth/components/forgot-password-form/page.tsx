'use client'

import { AuthKitProvider, ForgotPasswordForm } from '@hascanb/arf-ui-kit/auth-kit'
import { demoAuthConfig } from '../../../../auth/config'

export default function ForgotPasswordFormDemoPage() {
  return (
    <div className="container max-w-md py-8">
      <AuthKitProvider config={demoAuthConfig}>
        <ForgotPasswordForm />
      </AuthKitProvider>
    </div>
  )
}
