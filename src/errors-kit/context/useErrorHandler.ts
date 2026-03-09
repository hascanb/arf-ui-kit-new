/**
 * useErrorHandler Hook
 * 
 * Hook to access error handler functionality
 */

'use client'

import { useErrorsKitContext } from './ErrorsKitProvider'
import { createErrorHandler } from '../handler/createErrorHandler'
import { ErrorHandler } from './types'
import { useMemo } from 'react'

/**
 * Hook to access error handler
 * 
 * Returns the error handler from ErrorsKitProvider if available,
 * or creates a default handler if used outside provider.
 * 
 * @example
 * ```typescript
 * function MyComponent() {
 *   const { handleError, getLevel } = useErrorHandler()
 * 
 *   const fetchData = async () => {
 *     try {
 *       await apiCall()
 *     } catch (error) {
 *       handleError(error)
 *     }
 *   }
 * 
 *   return <button onClick={fetchData}>Fetch</button>
 * }
 * ```
 */
export function useErrorHandler(): ErrorHandler {
  // Try to get handler from context
  let handler: ErrorHandler | undefined

  try {
    const context = useErrorsKitContext()
    handler = context.handler
  } catch {
    // Not inside provider, will create default handler
  }

  // Create default handler if not provided by context
  const defaultHandler = useMemo(
    () =>
      createErrorHandler({
        onToast: (message) => {
          console.error('[ERROR]', message)
        },
      }),
    []
  )

  return handler || defaultHandler
}
