'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { ResetPasswordPageContent } from '@hascanb/arf-ui-kit/auth-kit'

function ResetPasswordContent() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token') || 'demo-token'

  return <ResetPasswordPageContent token={token} />
}

export default function ArfResetPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordContent />
    </Suspense>
  )
}
