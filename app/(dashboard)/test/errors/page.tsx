/**
 * Errors-Kit Test Page
 * 
 * Demonstrates error handling with level-based actions
 */

'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import {
  ErrorsKitProvider,
  useErrorHandler,
  ErrorRenderer,
  createErrorHandler,
  type ErrorLevel,
} from '@arftech/arfweb-shared-lib/errors-kit'
import {
  NotFoundPage,
  UnauthorizedPage,
  ForbiddenPage,
  ServerErrorPage,
} from './example-pages'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

/**
 * Error map for ErrorRenderer
 */
const errorMap = {
  'not-found': NotFoundPage,
  'unauthorized': UnauthorizedPage,
  'forbidden': ForbiddenPage,
  'internal-server-error': ServerErrorPage,
  'bad-request': NotFoundPage, // Reuse NotFoundPage
  'maintenance-error': ServerErrorPage, // Reuse ServerErrorPage
}

/**
 * Test page content (inside provider)
 */
function TestContent() {
  const router = useRouter()
  const { handleError, getLevel, normalizeError } = useErrorHandler()
  const [lastError, setLastError] = useState<string>('')
  const [renderErrorCode, setRenderErrorCode] = useState<string>('not-found')

  /**
   * Simulate different error types
   */
  const simulateError = (type: string) => {
    let error: any

    switch (type) {
      case 'axios-404':
        error = {
          response: {
            status: 404,
            data: { code: 'USER_NOT_FOUND', message: 'Kullanıcı bulunamadı' },
          },
        }
        break

      case 'axios-401':
        error = {
          response: {
            status: 401,
            data: { code: 'UNAUTHORIZED', message: 'Oturum süresi doldu' },
          },
        }
        break

      case 'axios-500':
        error = {
          response: {
            status: 500,
            data: { code: 'INTERNAL_ERROR', message: 'Sunucu hatası' },
          },
        }
        break

      case 'fetch-403':
        error = {
          status: 403,
          statusText: 'Forbidden',
          message: 'Erişim engellendi',
        }
        break

      case 'custom-low':
        error = {
          code: 'VALIDATION_ERROR',
          message: 'Form doğrulama hatası',
        }
        break

      case 'custom-critical':
        error = {
          status: 503,
          code: 'SERVICE_UNAVAILABLE',
          message: 'Servis şu anda kullanılamıyor',
        }
        break

      case 'string':
        error = 'Bir hata oluştu'
        break

      case 'error-instance':
        error = new Error('Network request failed')
        break

      default:
        error = { message: 'Unknown error' }
    }

    // Handle error
    const normalized = normalizeError(error)
    const level = getLevel(error)
    
    setLastError(JSON.stringify({ ...normalized, level }, null, 2))
    handleError(error)
  }

  /**
   * Manual handler configuration test
   */
  const testManualHandler = () => {
    const customHandler = createErrorHandler({
      onToast: (msg: string, level?: string) => {
        toast.error(msg, {
          description: `Level: ${level}`,
        })
      },
      onRedirect: (path: string) => {
        toast.info(`Yönlendiriliyor: ${path}`)
      },
      on401: () => {
        toast.warning('401 yakalandı - Login sayfasına yönlendirilecek')
      },
    })

    customHandler.handleError({
      response: { status: 401 },
    })
  }

  return (
    <div className="container py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Errors-Kit Test Sayfası</h1>
        <p className="text-muted-foreground mt-2">
          Centralized error handling with level-based actions
        </p>
      </div>

      <Separator />

      {/* Error Simulation */}
      <Card>
        <CardHeader>
          <CardTitle>1. Error Simulation - Level-Based Actions</CardTitle>
          <CardDescription>
            Farklı hata tiplerini test edin. Her hata level'ına göre işlem yapılır (toast/redirect/modal).
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <Button onClick={() => simulateError('axios-404')} variant="outline">
              <Badge variant="secondary" className="mr-2">high</Badge>
              404 Not Found
            </Button>
            <Button onClick={() => simulateError('axios-401')} variant="outline">
              <Badge variant="secondary" className="mr-2">high</Badge>
              401 Unauthorized
            </Button>
            <Button onClick={() => simulateError('fetch-403')} variant="outline">
              <Badge variant="secondary" className="mr-2">high</Badge>
              403 Forbidden
            </Button>
            <Button onClick={() => simulateError('axios-500')} variant="outline">
              <Badge variant="destructive" className="mr-2">critical</Badge>
              500 Server Error
            </Button>
            <Button onClick={() => simulateError('custom-low')} variant="outline">
              <Badge className="mr-2">low</Badge>
              Custom Low
            </Button>
            <Button onClick={() => simulateError('custom-critical')} variant="outline">
              <Badge variant="destructive" className="mr-2">critical</Badge>
              Custom Critical
            </Button>
            <Button onClick={() => simulateError('string')} variant="outline">
              String Error
            </Button>
            <Button onClick={() => simulateError('error-instance')} variant="outline">
              Error Instance
            </Button>
          </div>

          {lastError && (
            <div className="space-y-2">
              <h3 className="font-semibold text-sm">Son Hata:</h3>
              <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-xs">
                {lastError}
              </pre>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Error Renderer */}
      <Card>
        <CardHeader>
          <CardTitle>2. ErrorRenderer - Dynamic Error Pages</CardTitle>
          <CardDescription>
            Error code'una göre dinamik sayfa render etme
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2 flex-wrap">
            <Button onClick={() => setRenderErrorCode('not-found')} variant="outline">
              404 Not Found
            </Button>
            <Button onClick={() => setRenderErrorCode('unauthorized')} variant="outline">
              401 Unauthorized
            </Button>
            <Button onClick={() => setRenderErrorCode('forbidden')} variant="outline">
              403 Forbidden
            </Button>
            <Button onClick={() => setRenderErrorCode('internal-server-error')} variant="outline">
              500 Server Error
            </Button>
          </div>

          <div className="border rounded-lg p-4 bg-muted/50">
            <ErrorRenderer
              errorCode={renderErrorCode}
              status={parseInt(renderErrorCode.split('-')[0]) || 500}
              message="Bu bir test hatasıdır"
              onBack={() => toast.info('onBack callback çalıştı')}
              onRetry={() => toast.info('onRetry callback çalıştı')}
            />
          </div>
        </CardContent>
      </Card>

      {/* Manual Handler */}
      <Card>
        <CardHeader>
          <CardTitle>3. Manual createErrorHandler</CardTitle>
          <CardDescription>
            Provider dışında manuel errorHandler kullanımı
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={testManualHandler}>
            Test Manual Handler (401)
          </Button>
        </CardContent>
      </Card>

      {/* Features List */}
      <Card>
        <CardHeader>
          <CardTitle>Errors-Kit Features</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-muted-foreground">✅</span>
              <div>
                <strong>Error Levels:</strong> low, medium, high, critical
              </div>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-muted-foreground">✅</span>
              <div>
                <strong>Level Actions:</strong> toast, redirect, reload, modal
              </div>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-muted-foreground">✅</span>
              <div>
                <strong>Error Normalization:</strong> Axios, Fetch, Custom errors
              </div>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-muted-foreground">✅</span>
              <div>
                <strong>Status Mapping:</strong> 400, 401, 403, 404, 500, 503
              </div>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-muted-foreground">✅</span>
              <div>
                <strong>ErrorRenderer:</strong> Dynamic error page rendering
              </div>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-muted-foreground">✅</span>
              <div>
                <strong>useErrorHandler Hook:</strong> React integration
              </div>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-muted-foreground">✅</span>
              <div>
                <strong>Type-Safe:</strong> Full TypeScript support
              </div>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}

/**
 * Main test page with provider
 */
export default function ErrorsKitTestPage() {
  const router = useRouter()

  return (
    <ErrorsKitProvider
      errorMap={errorMap}
      handlerConfig={{
        onToast: (message: string, level?: string) => {
          toast.error(message, {
            description: `Error Level: ${level}`,
          })
        },
        onRedirect: (path: string) => {
          toast.info(`Yönlendiriliyor: ${path}`)
          // Gerçek uygulamada: router.push(path)
        },
        on401: () => {
          toast.warning('Oturum süresi doldu')
          // Gerçek uygulamada: router.push('/signin')
        },
      }}
    >
      <TestContent />
    </ErrorsKitProvider>
  )
}
