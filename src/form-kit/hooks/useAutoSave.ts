'use client'

import { useEffect, useMemo, useState } from 'react'
import { useWatch } from 'react-hook-form'
import type { FieldValues } from 'react-hook-form'
import type { UseAutoSaveOptions, UseAutoSaveReturn } from '../context/types'

function safeParse<T>(raw: string | null): T | null {
  if (!raw) return null
  try {
    return JSON.parse(raw) as T
  } catch {
    return null
  }
}

export function useAutoSave<TValues extends FieldValues = FieldValues>({
  form,
  storageKey,
  mode = 'debounce',
  debounceMs = 800,
  enabled = true,
  restoreOnMount = true,
  onAutoSave,
}: UseAutoSaveOptions<TValues>): UseAutoSaveReturn {
  const values = useWatch({ control: form.control }) as TValues
  const [hasDraft, setHasDraft] = useState(false)

  useEffect(() => {
    if (!enabled || !restoreOnMount || typeof window === 'undefined') return

    const draft = safeParse<TValues>(window.localStorage.getItem(storageKey))
    if (draft) {
      form.reset(draft)
      setHasDraft(true)
    }
  }, [enabled, restoreOnMount, storageKey, form])

  const save = useMemo(
    () => async () => {
      if (!enabled || typeof window === 'undefined') return
      const snapshot = form.getValues()
      window.localStorage.setItem(storageKey, JSON.stringify(snapshot))
      setHasDraft(true)
      if (onAutoSave) {
        await onAutoSave(snapshot)
      }
    },
    [enabled, form, storageKey, onAutoSave]
  )

  useEffect(() => {
    if (!enabled || mode !== 'debounce') return

    const timer = window.setTimeout(() => {
      void save()
    }, debounceMs)

    return () => {
      window.clearTimeout(timer)
    }
  }, [values, enabled, mode, debounceMs, save])

  return {
    saveNow: save,
    onFieldBlur: async () => {
      if (mode !== 'onBlur') return
      await save()
    },
    clearDraft: () => {
      if (typeof window === 'undefined') return
      window.localStorage.removeItem(storageKey)
      setHasDraft(false)
    },
    hasDraft,
  }
}
