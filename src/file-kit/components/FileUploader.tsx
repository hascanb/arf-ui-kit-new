'use client'

import { useMemo, useRef, useState } from 'react'
import { z } from 'zod'
import { UploadCloud, X, File as FileIcon, Image as ImageIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import type { FileUploaderProps } from '../context/types'

function fileKey(file: File): string {
  return `${file.name}-${file.size}-${file.lastModified}`
}

export function FileUploader({
  value = [],
  onChange,
  accept,
  multiple = true,
  maxFiles = 5,
  maxSizeMb = 5,
  disabled = false,
  className,
  showPreview = true,
  onUpload,
  header,
}: FileUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [progressMap, setProgressMap] = useState<Record<string, number>>({})

  const maxSizeBytes = maxSizeMb * 1024 * 1024

  const validator = useMemo(
    () =>
      z
        .instanceof(File)
        .refine((file) => file.size <= maxSizeBytes, `Maksimum dosya boyutu ${maxSizeMb}MB olmalidir`)
        .refine((file) => {
          if (!accept) return true
          const accepted = accept
            .split(',')
            .map((item) => item.trim().toLowerCase())
            .filter(Boolean)

          if (accepted.length === 0) return true

          const fileExt = `.${file.name.split('.').pop()?.toLowerCase() || ''}`
          return accepted.some((rule) => {
            if (rule.startsWith('.')) return rule === fileExt
            if (rule.endsWith('/*')) return file.type.startsWith(rule.replace('/*', '/'))
            return file.type === rule
          })
        }, 'Dosya tipi desteklenmiyor'),
    [accept, maxSizeBytes, maxSizeMb]
  )

  const emitFiles = async (incoming: File[]) => {
    if (disabled || incoming.length === 0) return

    const selected = multiple ? [...value, ...incoming].slice(0, maxFiles) : [incoming[0]]
    const validFiles: File[] = []

    for (const file of selected) {
      const parsed = validator.safeParse(file)
      if (!parsed.success) {
        toast.error(parsed.error.issues[0]?.message || 'Dosya dogrulanamadi', {
          description: file.name,
        })
        continue
      }
      validFiles.push(file)
    }

    onChange?.(validFiles)

    if (!onUpload) return

    for (const file of validFiles) {
      const key = fileKey(file)
      setProgressMap((prev) => ({ ...prev, [key]: 0 }))

      try {
        await onUpload(file, (percent) => {
          setProgressMap((prev) => ({ ...prev, [key]: Math.max(0, Math.min(100, percent)) }))
        })
        setProgressMap((prev) => ({ ...prev, [key]: 100 }))
      } catch {
        toast.error('Yukleme basarisiz', { description: file.name })
      }
    }
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files ? Array.from(event.target.files) : []
    void emitFiles(files)
    event.target.value = ''
  }

  const removeFile = (index: number) => {
    const next = value.filter((_, i) => i !== index)
    onChange?.(next)
  }

  return (
    <div className={cn('space-y-4', className)}>
      {header}

      <div
        className={cn(
          'rounded-lg border border-dashed p-6 text-center transition-colors',
          isDragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/30',
          disabled && 'cursor-not-allowed opacity-50'
        )}
        onDragOver={(event) => {
          event.preventDefault()
          if (!disabled) setIsDragging(true)
        }}
        onDragLeave={(event) => {
          event.preventDefault()
          setIsDragging(false)
        }}
        onDrop={(event) => {
          event.preventDefault()
          setIsDragging(false)
          const files = Array.from(event.dataTransfer.files || [])
          void emitFiles(files)
        }}
      >
        <UploadCloud className="mx-auto h-8 w-8 text-muted-foreground" />
        <p className="mt-2 text-sm font-medium">Dosyalari surukleyip birakin veya secin</p>
        <p className="mt-1 text-xs text-muted-foreground">Maksimum {maxFiles} dosya, dosya basi {maxSizeMb}MB</p>

        <Button type="button" variant="outline" size="sm" className="mt-4" disabled={disabled} onClick={() => inputRef.current?.click()}>
          Dosya Sec
        </Button>

        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          className="hidden"
          onChange={handleInputChange}
        />
      </div>

      {value.length > 0 && (
        <div className="space-y-3">
          {value.map((file, index) => {
            const key = fileKey(file)
            const progress = progressMap[key]
            const isImage = file.type.startsWith('image/')
            const previewUrl = isImage && showPreview ? URL.createObjectURL(file) : null

            return (
              <div key={key} className="rounded-md border p-3">
                <div className="flex items-center gap-3">
                  {isImage && previewUrl ? (
                    // URL object is only used as short-lived preview source for local files.
                    <img src={previewUrl} alt={file.name} className="h-12 w-12 rounded object-cover" />
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded bg-muted">
                      {isImage ? <ImageIcon className="h-5 w-5" /> : <FileIcon className="h-5 w-5" />}
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{file.name}</p>
                    <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    {typeof progress === 'number' && <Progress value={progress} className="mt-2" />}
                  </div>

                  <Button type="button" variant="ghost" size="icon" onClick={() => removeFile(index)} disabled={disabled}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
