'use client'

import { AuthKitProvider, OtpPageContent } from '@hascanb/arf-ui-kit/auth-kit'
import { demoAuthConfig } from '../../../../auth/config'

export default function TestOtpPage() {
  return (
    <AuthKitProvider config={demoAuthConfig}>
      <OtpPageContent />
    </AuthKitProvider>
  )
}
