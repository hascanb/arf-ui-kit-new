'use client'

import { AuthKitProvider, SignIn2PageContent } from '@hascanb/arf-ui-kit/auth-kit'
import { demoAuthConfig } from '../../../../auth/config'

export default function TestSignIn2Page() {
  return (
    <AuthKitProvider config={demoAuthConfig}>
      <SignIn2PageContent />
    </AuthKitProvider>
  )
}
