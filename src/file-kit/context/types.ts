import type { ReactNode } from 'react'
import type { Control, FieldPath, FieldValues } from 'react-hook-form'

export interface FileUploaderProps {
  value?: File[]
  onChange?: (files: File[]) => void
  accept?: string
  multiple?: boolean
  maxFiles?: number
  maxSizeMb?: number
  disabled?: boolean
  className?: string
  showPreview?: boolean
  onUpload?: (file: File, onProgress: (percent: number) => void) => Promise<void>
  header?: ReactNode
}

export interface RHFFileUploaderProps<TValues extends FieldValues = FieldValues> extends Omit<FileUploaderProps, 'value' | 'onChange'> {
  control: Control<TValues>
  name: FieldPath<TValues>
}
