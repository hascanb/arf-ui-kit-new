'use client'

import { ResetPasswordPageContent } from '@arftech/arfweb-shared-lib/auth-kit'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function ResetPasswordContent() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token') || 'demo-token'
  
  return <ResetPasswordPageContent token={token} />
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordContent />
    </Suspense>
  )
}
