'use client'

import React, { type ErrorInfo, type ReactNode } from 'react'
import { Button } from '@/components/ui/button'

export interface GlobalErrorBoundaryProps {
  children: ReactNode
  homePath?: string
  genericMessage?: string
  showErrorDetails?: boolean
  onError?: (error: Error, errorInfo: ErrorInfo) => void
  onReset?: () => void
  onGoHome?: () => void
  fallback?: (props: {
    error: Error | null
    reset: () => void
    goHome: () => void
  }) => ReactNode
}

interface GlobalErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

export class GlobalErrorBoundary extends React.Component<GlobalErrorBoundaryProps, GlobalErrorBoundaryState> {
  state: GlobalErrorBoundaryState = {
    hasError: false,
    error: null,
  }

  static getDerivedStateFromError(error: Error): GlobalErrorBoundaryState {
    return {
      hasError: true,
      error,
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.props.onError?.(error, errorInfo)
  }

  reset = () => {
    this.setState({ hasError: false, error: null })
    this.props.onReset?.()
  }

  goHome = () => {
    if (this.props.onGoHome) {
      this.props.onGoHome()
      return
    }

    if (typeof window !== 'undefined') {
      window.location.href = this.props.homePath || '/'
    }
  }

  render(): ReactNode {
    if (!this.state.hasError) {
      return this.props.children
    }

    if (this.props.fallback) {
      return this.props.fallback({
        error: this.state.error,
        reset: this.reset,
        goHome: this.goHome,
      })
    }

    const shouldShowDetails =
      this.props.showErrorDetails ?? process.env.NODE_ENV !== 'production'
    const errorDetails = this.state.error?.message
      ? this.state.error.message.replace(/\s+/g, ' ').slice(0, 260)
      : ''

    return (
      <div className="flex min-h-[320px] items-center justify-center p-6">
        <div className="w-full max-w-md space-y-4 rounded-lg border bg-card p-6 text-center">
          <h2 className="text-xl font-semibold">Uygulama hatasi olustu</h2>
          <p className="text-sm text-muted-foreground">
            {this.props.genericMessage ||
              'Beklenmeyen bir hata yakalandi. Sayfayi sifirlayabilir veya ana sayfaya donebilirsiniz.'}
          </p>

          {shouldShowDetails && !!errorDetails && (
            <p className="rounded-md bg-muted p-2 text-left text-xs text-muted-foreground">
              {errorDetails}
            </p>
          )}

          <div className="flex items-center justify-center gap-2">
            <Button onClick={this.reset}>Tekrar Dene</Button>
            <Button variant="outline" onClick={this.goHome}>
              Ana Sayfaya Don
            </Button>
          </div>
        </div>
      </div>
    )
  }
}
