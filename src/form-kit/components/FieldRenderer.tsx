/**
 * FieldRenderer Component
 * 
 * Automatically renders the appropriate field component based on field configuration.
 */

import { Controller } from 'react-hook-form'
import { cn } from '@/lib/utils'
import {
  FieldRendererProps,
  TextFieldConfig,
  NumberFieldConfig,
  TextareaFieldConfig,
  SelectFieldConfig,
  CheckboxFieldConfig,
  RadioFieldConfig,
  DateFieldConfig,
  FileFieldConfig,
  CustomFieldConfig,
} from '../context/types'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'

/**
 * Render a text-based field (text, email, password)
 */
function TextField({ config, control, showDescription, showRequired }: FieldRendererProps) {
  const fieldConfig = config as TextFieldConfig
  
  return (
    <Controller
      name={fieldConfig.name}
      control={control}
      render={({ field, fieldState }) => (
        <div className="space-y-2">
          <Label htmlFor={fieldConfig.name}>
            {fieldConfig.label}
            {showRequired && fieldConfig.required && <span className="text-destructive ml-1">*</span>}
          </Label>
          <Input
            {...field}
            id={fieldConfig.name}
            type={fieldConfig.type}
            placeholder={fieldConfig.placeholder}
            disabled={fieldConfig.disabled}
            maxLength={fieldConfig.maxLength}
            autoComplete={fieldConfig.autoComplete}
            className={cn(
              fieldState.error && 'border-destructive focus-visible:ring-destructive',
              fieldConfig.className
            )}
          />
          {showDescription && fieldConfig.description && (
            <p className="text-sm text-muted-foreground">{fieldConfig.description}</p>
          )}
          {fieldState.error && (
            <p className="text-sm text-destructive">{fieldState.error.message}</p>
          )}
        </div>
      )}
    />
  )
}

/**
 * Render a number field
 */
function NumberField({ config, control, showDescription, showRequired }: FieldRendererProps) {
  const fieldConfig = config as NumberFieldConfig
  
  return (
    <Controller
      name={fieldConfig.name}
      control={control}
      render={({ field, fieldState }) => (
        <div className="space-y-2">
          <Label htmlFor={fieldConfig.name}>
            {fieldConfig.label}
            {showRequired && fieldConfig.required && <span className="text-destructive ml-1">*</span>}
          </Label>
          <Input
            {...field}
            id={fieldConfig.name}
            type="number"
            placeholder={fieldConfig.placeholder}
            disabled={fieldConfig.disabled}
            min={fieldConfig.min}
            max={fieldConfig.max}
            step={fieldConfig.step}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => field.onChange(e.target.valueAsNumber)}
            className={cn(
              fieldState.error && 'border-destructive focus-visible:ring-destructive',
              fieldConfig.className
            )}
          />
          {showDescription && fieldConfig.description && (
            <p className="text-sm text-muted-foreground">{fieldConfig.description}</p>
          )}
          {fieldState.error && (
            <p className="text-sm text-destructive">{fieldState.error.message}</p>
          )}
        </div>
      )}
    />
  )
}

/**
 * Render a textarea field
 */
function TextareaField({ config, control, showDescription, showRequired }: FieldRendererProps) {
  const fieldConfig = config as TextareaFieldConfig
  
  return (
    <Controller
      name={fieldConfig.name}
      control={control}
      render={({ field, fieldState }) => (
        <div className="space-y-2">
          <Label htmlFor={fieldConfig.name}>
            {fieldConfig.label}
            {showRequired && fieldConfig.required && <span className="text-destructive ml-1">*</span>}
          </Label>
          <Textarea
            {...field}
            id={fieldConfig.name}
            placeholder={fieldConfig.placeholder}
            disabled={fieldConfig.disabled}
            rows={fieldConfig.rows}
            maxLength={fieldConfig.maxLength}
            className={cn(
              fieldState.error && 'border-destructive focus-visible:ring-destructive',
              fieldConfig.className
            )}
          />
          {showDescription && fieldConfig.description && (
            <p className="text-sm text-muted-foreground">{fieldConfig.description}</p>
          )}
          {fieldState.error && (
            <p className="text-sm text-destructive">{fieldState.error.message}</p>
          )}
        </div>
      )}
    />
  )
}

/**
 * Render a select field
 */
function SelectField({ config, control, showDescription, showRequired }: FieldRendererProps) {
  const fieldConfig = config as SelectFieldConfig
  
  return (
    <Controller
      name={fieldConfig.name}
      control={control}
      render={({ field, fieldState }) => (
        <div className="space-y-2">
          <Label htmlFor={fieldConfig.name}>
            {fieldConfig.label}
            {showRequired && fieldConfig.required && <span className="text-destructive ml-1">*</span>}
          </Label>
          <Select
            value={field.value?.toString()}
            onValueChange={(value: string) => {
              // Try to parse as number if the original option value was a number
              const option = fieldConfig.options.find(opt => opt.value.toString() === value)
              field.onChange(option ? option.value : value)
            }}
            disabled={fieldConfig.disabled}
          >
            <SelectTrigger
              id={fieldConfig.name}
              className={cn(
                fieldState.error && 'border-destructive focus-visible:ring-destructive',
                fieldConfig.className
              )}
            >
              <SelectValue placeholder={fieldConfig.placeholder || 'Seçiniz...'} />
            </SelectTrigger>
            <SelectContent>
              {fieldConfig.options.map((option) => (
                <SelectItem key={option.value} value={option.value.toString()}>
                  {option.icon && <span className="mr-2">{option.icon}</span>}
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {showDescription && fieldConfig.description && (
            <p className="text-sm text-muted-foreground">{fieldConfig.description}</p>
          )}
          {fieldState.error && (
            <p className="text-sm text-destructive">{fieldState.error.message}</p>
          )}
        </div>
      )}
    />
  )
}

/**
 * Render a checkbox field
 */
function CheckboxField({ config, control, showDescription, showRequired }: FieldRendererProps) {
  const fieldConfig = config as CheckboxFieldConfig
  
  return (
    <Controller
      name={fieldConfig.name}
      control={control}
      render={({ field, fieldState }) => (
        <div className="space-y-2">
          <div className="flex items-start space-x-3">
            <Checkbox
              id={fieldConfig.name}
              checked={field.value}
              onCheckedChange={field.onChange}
              disabled={fieldConfig.disabled}
              className={cn(
                fieldState.error && 'border-destructive',
                fieldConfig.className
              )}
            />
            <div className="grid gap-1.5 leading-none">
              <Label
                htmlFor={fieldConfig.name}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {fieldConfig.checkboxLabel || fieldConfig.label}
                {showRequired && fieldConfig.required && <span className="text-destructive ml-1">*</span>}
              </Label>
              {showDescription && fieldConfig.description && (
                <p className="text-sm text-muted-foreground">{fieldConfig.description}</p>
              )}
            </div>
          </div>
          {fieldState.error && (
            <p className="text-sm text-destructive">{fieldState.error.message}</p>
          )}
        </div>
      )}
    />
  )
}

/**
 * Render a radio group field
 */
function RadioField({ config, control, showDescription, showRequired }: FieldRendererProps) {
  const fieldConfig = config as RadioFieldConfig
  
  return (
    <Controller
      name={fieldConfig.name}
      control={control}
      render={({ field, fieldState }) => (
        <div className="space-y-2">
          <Label>
            {fieldConfig.label}
            {showRequired && fieldConfig.required && <span className="text-destructive ml-1">*</span>}
          </Label>
          <RadioGroup
            value={field.value?.toString()}
            onValueChange={(value: string) => {
              // Try to parse as number if the original option value was a number
              const option = fieldConfig.options.find(opt => opt.value.toString() === value)
              field.onChange(option ? option.value : value)
            }}
            disabled={fieldConfig.disabled}
            className={cn(
              fieldConfig.orientation === 'horizontal' ? 'flex flex-row space-x-4' : 'flex flex-col space-y-2',
              fieldConfig.className
            )}
          >
            {fieldConfig.options.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem value={option.value.toString()} id={`${fieldConfig.name}-${option.value}`} />
                <Label htmlFor={`${fieldConfig.name}-${option.value}`} className="font-normal">
                  {option.icon && <span className="mr-2">{option.icon}</span>}
                  {option.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
          {showDescription && fieldConfig.description && (
            <p className="text-sm text-muted-foreground">{fieldConfig.description}</p>
          )}
          {fieldState.error && (
            <p className="text-sm text-destructive">{fieldState.error.message}</p>
          )}
        </div>
      )}
    />
  )
}

/**
 * Render a date field
 */
function DateField({ config, control, showDescription, showRequired }: FieldRendererProps) {
  const fieldConfig = config as DateFieldConfig
  
  return (
    <Controller
      name={fieldConfig.name}
      control={control}
      render={({ field, fieldState }) => (
        <div className="space-y-2">
          <Label htmlFor={fieldConfig.name}>
            {fieldConfig.label}
            {showRequired && fieldConfig.required && <span className="text-destructive ml-1">*</span>}
          </Label>
          <Input
            {...field}
            id={fieldConfig.name}
            type="date"
            disabled={fieldConfig.disabled}
            value={field.value instanceof Date ? field.value.toISOString().split('T')[0] : field.value || ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const date = e.target.value ? new Date(e.target.value) : null
              field.onChange(date)
            }}
            className={cn(
              fieldState.error && 'border-destructive focus-visible:ring-destructive',
              fieldConfig.className
            )}
          />
          {showDescription && fieldConfig.description && (
            <p className="text-sm text-muted-foreground">{fieldConfig.description}</p>
          )}
          {fieldState.error && (
            <p className="text-sm text-destructive">{fieldState.error.message}</p>
          )}
        </div>
      )}
    />
  )
}

/**
 * Render a file upload field
 */
function FileField({ config, control, showDescription, showRequired }: FieldRendererProps) {
  const fieldConfig = config as FileFieldConfig
  
  return (
    <Controller
      name={fieldConfig.name}
      control={control}
      render={({ field: { value, onChange, ...field }, fieldState }) => (
        <div className="space-y-2">
          <Label htmlFor={fieldConfig.name}>
            {fieldConfig.label}
            {showRequired && fieldConfig.required && <span className="text-destructive ml-1">*</span>}
          </Label>
          <Input
            {...field}
            id={fieldConfig.name}
            type="file"
            accept={fieldConfig.accept}
            multiple={fieldConfig.multiple}
            disabled={fieldConfig.disabled}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const files = e.target.files
              if (files) {
                onChange(fieldConfig.multiple ? Array.from(files) : files[0])
              }
            }}
            className={cn(
              fieldState.error && 'border-destructive focus-visible:ring-destructive',
              fieldConfig.className
            )}
          />
          {showDescription && fieldConfig.description && (
            <p className="text-sm text-muted-foreground">{fieldConfig.description}</p>
          )}
          {fieldState.error && (
            <p className="text-sm text-destructive">{fieldState.error.message}</p>
          )}
        </div>
      )}
    />
  )
}

/**
 * Render a custom field
 */
function CustomField({ config, control }: FieldRendererProps) {
  const fieldConfig = config as CustomFieldConfig
  
  return (
    <Controller
      name={fieldConfig.name}
      control={control}
      render={({ field, fieldState }) =>
        fieldConfig.render({
          name: field.name,
          value: field.value,
          onChange: field.onChange,
          onBlur: field.onBlur,
          error: fieldState.error?.message,
          disabled: fieldConfig.disabled,
        })
      }
    />
  )
}

/**
 * Main FieldRenderer component
 * 
 * Automatically renders the appropriate field component based on field type.
 */
export function FieldRenderer(props: FieldRendererProps) {
  const { config } = props
  
  const fieldType = config.type
  
  switch (fieldType) {
    case 'text':
    case 'email':
    case 'password':
      return <TextField {...props} />
    
    case 'number':
      return <NumberField {...props} />
    
    case 'textarea':
      return <TextareaField {...props} />
    
    case 'select':
      return <SelectField {...props} />
    
    case 'checkbox':
      return <CheckboxField {...props} />
    
    case 'radio':
      return <RadioField {...props} />
    
    case 'date':
      return <DateField {...props} />
    
    case 'file':
      return <FileField {...props} />
    
    case 'custom':
      return <CustomField {...props} />
    
    default:
      console.warn(`Unknown field type: ${fieldType}`)
      return null
  }
}
