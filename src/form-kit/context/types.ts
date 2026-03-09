/**
 * Form Kit Type Definitions
 * 
 * Type-safe configuration for schema-driven forms with Zod validation.
 */

import { z } from 'zod'
import { UseFormReturn, FieldValues, DefaultValues } from 'react-hook-form'
import { ReactNode } from 'react'

/**
 * Supported field types for automatic rendering
 */
export type FieldType =
  | 'text'
  | 'email'
  | 'password'
  | 'number'
  | 'textarea'
  | 'select'
  | 'checkbox'
  | 'radio'
  | 'date'
  | 'file'
  | 'custom'

/**
 * Field size variants
 */
export type FieldSize = 'sm' | 'default' | 'lg'

/**
 * Field layout configuration
 */
export interface FieldLayout {
  /** Number of columns this field should span (1-12) */
  span?: number
  /** Vertical spacing (margin-bottom) */
  spacing?: 'none' | 'sm' | 'default' | 'lg'
  /** Horizontal alignment */
  align?: 'left' | 'center' | 'right'
}

/**
 * Select/Radio option configuration
 */
export interface FieldOption {
  label: string
  value: string | number
  disabled?: boolean
  icon?: ReactNode
}

/**
 * Base field configuration (common to all field types)
 */
export interface BaseFieldConfig {
  /** Unique field name (matches Zod schema key) */
  name: string
  /** Field label */
  label: string
  /** Field type */
  type: FieldType
  /** Placeholder text */
  placeholder?: string
  /** Help text displayed below the field */
  description?: string
  /** Whether the field is disabled */
  disabled?: boolean
  /** Whether the field is required (for UI indication) */
  required?: boolean
  /** Field size variant */
  size?: FieldSize
  /** Layout configuration */
  layout?: FieldLayout
  /** Custom CSS classes */
  className?: string
}

/**
 * Text-based field configuration (text, email, password)
 */
export interface TextFieldConfig extends BaseFieldConfig {
  type: 'text' | 'email' | 'password'
  /** Maximum character length */
  maxLength?: number
  /** Minimum character length */
  minLength?: number
  /** Input pattern (regex) */
  pattern?: string
  /** Auto-complete hint */
  autoComplete?: string
}

/**
 * Number field configuration
 */
export interface NumberFieldConfig extends BaseFieldConfig {
  type: 'number'
  /** Minimum value */
  min?: number
  /** Maximum value */
  max?: number
  /** Step increment */
  step?: number
}

/**
 * Textarea field configuration
 */
export interface TextareaFieldConfig extends BaseFieldConfig {
  type: 'textarea'
  /** Number of visible text rows */
  rows?: number
  /** Maximum character length */
  maxLength?: number
  /** Whether to auto-resize height */
  autoResize?: boolean
}

/**
 * Select field configuration
 */
export interface SelectFieldConfig extends BaseFieldConfig {
  type: 'select'
  /** Available options */
  options: FieldOption[]
  /** Whether multiple selection is allowed */
  multiple?: boolean
  /** Whether the select is searchable */
  searchable?: boolean
  /** Empty state text */
  emptyText?: string
}

/**
 * Checkbox field configuration
 */
export interface CheckboxFieldConfig extends BaseFieldConfig {
  type: 'checkbox'
  /** Checkbox label (displayed next to checkbox) */
  checkboxLabel?: string
}

/**
 * Radio field configuration
 */
export interface RadioFieldConfig extends BaseFieldConfig {
  type: 'radio'
  /** Available options */
  options: FieldOption[]
  /** Radio group display direction */
  orientation?: 'horizontal' | 'vertical'
}

/**
 * Date field configuration
 */
export interface DateFieldConfig extends BaseFieldConfig {
  type: 'date'
  /** Minimum allowed date */
  minDate?: Date
  /** Maximum allowed date */
  maxDate?: Date
  /** Date format for display */
  format?: string
}

/**
 * File upload field configuration
 */
export interface FileFieldConfig extends BaseFieldConfig {
  type: 'file'
  /** Accepted file types (MIME types or extensions) */
  accept?: string
  /** Whether multiple files can be selected */
  multiple?: boolean
  /** Maximum file size in bytes */
  maxSize?: number
  /** Maximum number of files */
  maxFiles?: number
}

/**
 * Custom field configuration (for custom renderers)
 */
export interface CustomFieldConfig extends BaseFieldConfig {
  type: 'custom'
  /** Custom render function */
  render: (props: CustomFieldRenderProps) => React.ReactElement
}

/**
 * Props passed to custom field renderers
 */
export interface CustomFieldRenderProps {
  /** Field name */
  name: string
  /** Field value */
  value: any
  /** Change handler */
  onChange: (value: any) => void
  /** Blur handler */
  onBlur: () => void
  /** Field error message (if any) */
  error?: string
  /** Whether the field is disabled */
  disabled?: boolean
}

/**
 * Union type of all field configurations
 */
export type FieldConfig =
  | TextFieldConfig
  | NumberFieldConfig
  | TextareaFieldConfig
  | SelectFieldConfig
  | CheckboxFieldConfig
  | RadioFieldConfig
  | DateFieldConfig
  | FileFieldConfig
  | CustomFieldConfig

/**
 * Form layout configuration
 */
export interface FormLayout {
  /** Number of columns in the form grid (1-12) */
  columns?: number
  /** Gap between fields */
  gap?: 'none' | 'sm' | 'default' | 'lg'
  /** Maximum form width */
  maxWidth?: string
}

/**
 * Form submit button configuration
 */
export interface SubmitButtonConfig {
  /** Button label */
  label?: string
  /** Whether to show loading state during submission */
  loading?: boolean
  /** Loading text */
  loadingText?: string
  /** Whether the button is disabled */
  disabled?: boolean
  /** Button size */
  size?: FieldSize
  /** Button variant */
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  /** Full width button */
  fullWidth?: boolean
  /** Custom CSS classes */
  className?: string
}

/**
 * Complete form configuration
 */
export interface FormConfig<TSchema extends z.ZodType<any, any, any>> {
  /** Zod validation schema */
  schema: TSchema
  /** Field configurations */
  fields: FieldConfig[]
  /** Form layout */
  layout?: FormLayout
  /** Submit button configuration */
  submitButton?: SubmitButtonConfig
  /** Default form values */
  defaultValues?: DefaultValues<z.infer<TSchema>>
  /** Form submit handler */
  onSubmit: (data: z.infer<TSchema>) => void | Promise<void>
  /** Form error handler */
  onError?: (errors: any) => void
  /** Custom form class name */
  className?: string
}

/**
 * Hook return type for useSchemaForm
 */
export interface UseSchemaFormReturn<TFieldValues extends FieldValues = FieldValues> {
  /** react-hook-form instance */
  form: UseFormReturn<TFieldValues>
  /** Whether the form is currently submitting */
  isSubmitting: boolean
  /** Whether the form is valid */
  isValid: boolean
  /** Submit handler */
  handleSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>
  /** Reset form to default values */
  reset: () => void
  /** Set form error */
  setError: (name: string, error: { type: string; message: string }) => void
}

/**
 * FormKit Provider configuration
 */
export interface FormKitConfig {
  /** Default field size */
  defaultFieldSize?: FieldSize
  /** Default form layout */
  defaultLayout?: FormLayout
  /** Default submit button config */
  defaultSubmitButton?: Partial<SubmitButtonConfig>
  /** Custom field renderers */
  customRenderers?: Record<string, (props: CustomFieldRenderProps) => ReactNode>
}

/**
 * Props for SchemaForm component
 */
export interface SchemaFormProps<TSchema extends z.ZodType<any, any, any>> {
  /** Form configuration */
  config: FormConfig<TSchema>
  /** Whether to show field descriptions */
  showDescriptions?: boolean
  /** Whether to show required indicators */
  showRequired?: boolean
}

/**
 * Props for FieldRenderer component
 */
export interface FieldRendererProps {
  /** Field configuration */
  config: FieldConfig
  /** react-hook-form control */
  control: any
  /** Whether to show field description */
  showDescription?: boolean
  /** Whether to show required indicator */
  showRequired?: boolean
}
