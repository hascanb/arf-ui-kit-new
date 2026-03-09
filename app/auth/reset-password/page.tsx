'use client'

import { ResetPasswordPageContent } from '@arftech/arfweb-shared-lib/auth-kit'
import { useSearchParams } from 'next/navigation'

export default function ResetPasswordPage() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token') || 'demo-token'
  
  return <ResetPasswordPageContent token={token} />
}
