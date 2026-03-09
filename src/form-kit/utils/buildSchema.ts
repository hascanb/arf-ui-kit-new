/**
 * Build Schema Utility
 * 
 * Generate Zod schemas from field configurations.
 */

import { z } from 'zod'
import {
  FieldConfig,
  TextFieldConfig,
  NumberFieldConfig,
  TextareaFieldConfig,
  SelectFieldConfig,
  CheckboxFieldConfig,
  RadioFieldConfig,
  DateFieldConfig,
  FileFieldConfig,
} from '../context/types'

/**
 * Build a Zod schema field from a field configuration
 */
export function buildField(config: FieldConfig): z.ZodTypeAny {
  switch (config.type) {
    case 'text':
    case 'email':
    case 'password':
      return buildTextField(config as TextFieldConfig)
    
    case 'number':
      return buildNumberField(config as NumberFieldConfig)
    
    case 'textarea':
      return buildTextareaField(config as TextareaFieldConfig)
    
    case 'select':
      return buildSelectField(config as SelectFieldConfig)
    
    case 'checkbox':
      return buildCheckboxField(config as CheckboxFieldConfig)
    
    case 'radio':
      return buildRadioField(config as RadioFieldConfig)
    
    case 'date':
      return buildDateField(config as DateFieldConfig)
    
    case 'file':
      return buildFileField(config as FileFieldConfig)
    
    case 'custom':
      // For custom fields, return a generic any schema
      // Users should provide their own validation
      return z.any()
    
    default:
      return z.string()
  }
}

/**
 * Build schema for text-based fields
 */
function buildTextField(config: TextFieldConfig): z.ZodString {
  let schema = z.string()

  // Email validation
  if (config.type === 'email') {
    schema = schema.email('Geçerli bir e-posta adresi giriniz')
  }

  // Min length
  if (config.minLength !== undefined) {
    schema = schema.min(config.minLength, `En az ${config.minLength} karakter olmalıdır`)
  }

  // Max length
  if (config.maxLength !== undefined) {
    schema = schema.max(config.maxLength, `En fazla ${config.maxLength} karakter olabilir`)
  }

  // Pattern validation
  if (config.pattern) {
    schema = schema.regex(new RegExp(config.pattern), 'Geçersiz format')
  }

  // Required validation - MUST BE LAST
  if (config.required) {
    schema = schema.min(1, `${config.label} zorunludur`)
  } else {
    schema = schema.optional() as any
  }

  return schema
}

/**
 * Build schema for number fields
 */
function buildNumberField(config: NumberFieldConfig): z.ZodNumber {
  let schema = z.number({
    invalid_type_error: 'Geçerli bir sayı giriniz',
    required_error: `${config.label} zorunludur`,
  })

  // Min value
  if (config.min !== undefined) {
    schema = schema.min(config.min, `En az ${config.min} olmalıdır`)
  }

  // Max value
  if (config.max !== undefined) {
    schema = schema.max(config.max, `En fazla ${config.max} olabilir`)
  }

  // Required validation - MUST BE LAST
  if (!config.required) {
    schema = schema.optional() as any
  }

  return schema
}

/**
 * Build schema for textarea fields
 */
function buildTextareaField(config: TextareaFieldConfig): z.ZodString {
  let schema = z.string()

  // Max length
  if (config.maxLength !== undefined) {
    schema = schema.max(config.maxLength, `En fazla ${config.maxLength} karakter olabilir`)
  }

  // Required validation - MUST BE LAST
  if (config.required) {
    schema = schema.min(1, `${config.label} zorunludur`)
  } else {
    schema = schema.optional() as any
  }

  return schema
}

/**
 * Build schema for select fields
 */
function buildSelectField(config: SelectFieldConfig): z.ZodTypeAny {
  const validValues = config.options.map(opt => opt.value)

  if (config.multiple) {
    let schema = z.array(z.union([z.string(), z.number()]))
    
    if (config.required) {
      schema = schema.min(1, `En az bir seçim yapınız`) as any
    } else {
      schema = schema.optional() as any
    }
    
    return schema
  } else {
    let schema = z.union([z.string(), z.number()])
    
    if (config.required) {
      schema = schema.refine(val => validValues.includes(val), {
        message: 'Geçerli bir seçenek seçiniz',
      }) as any
    } else {
      schema = schema.optional() as any
    }
    
    return schema
  }
}

/**
 * Build schema for checkbox fields
 */
function buildCheckboxField(config: CheckboxFieldConfig): z.ZodBoolean {
  let schema = z.boolean()

  if (config.required) {
    schema = schema.refine(val => val === true, {
      message: `${config.label} kabul edilmelidir`,
    }) as any
  } else {
    schema = schema.optional() as any
  }

  return schema
}

/**
 * Build schema for radio fields
 */
function buildRadioField(config: RadioFieldConfig): z.ZodTypeAny {
  const validValues = config.options.map(opt => opt.value)
  let schema = z.union([z.string(), z.number()])

  if (config.required) {
    schema = schema.refine(val => validValues.includes(val), {
      message: 'Bir seçenek seçiniz',
    }) as any
  } else {
    schema = schema.optional() as any
  }

  return schema
}

/**
 * Build schema for date fields
 */
function buildDateField(config: DateFieldConfig): z.ZodDate {
  let schema = z.date({
    invalid_type_error: 'Geçerli bir tarih giriniz',
    required_error: `${config.label} zorunludur`,
  })

  // Min date
  if (config.minDate) {
    schema = schema.min(config.minDate, `${config.minDate.toLocaleDateString()} tarihinden önce olamaz`)
  }

  // Max date
  if (config.maxDate) {
    schema = schema.max(config.maxDate, `${config.maxDate.toLocaleDateString()} tarihinden sonra olamaz`)
  }

  // Required validation - MUST BE LAST
  if (!config.required) {
    schema = schema.optional() as any
  }

  return schema
}

/**
 * Build schema for file upload fields
 */
function buildFileField(config: FileFieldConfig): z.ZodTypeAny {
  if (config.multiple) {
    let schema = z.array(z.instanceof(File))
    
    if (config.required) {
      schema = schema.min(1, 'En az bir dosya seçiniz') as any
    } else {
      schema = schema.optional() as any
    }
    
    // Max files validation
    if (config.maxFiles !== undefined) {
      schema = schema.max(config.maxFiles, `En fazla ${config.maxFiles} dosya seçebilirsiniz`) as any
    }
    
    return schema
  } else {
    let schema = z.instanceof(File)
    
    if (config.required) {
      schema = schema.refine(val => val !== undefined, {
        message: 'Bir dosya seçiniz',
      }) as any
    } else {
      schema = schema.optional() as any
    }
    
    return schema
  }
}

/**
 * Build a complete Zod object schema from field configurations
 * 
 * @param fields - Array of field configurations
 * @returns Zod object schema
 * 
 * @example
 * ```ts
 * const fields: FieldConfig[] = [
 *   { name: 'email', type: 'email', label: 'Email', required: true },
 *   { name: 'password', type: 'password', label: 'Password', required: true, minLength: 8 },
 * ]
 * 
 * const schema = buildSchema(fields)
 * // Returns: z.object({ email: z.string().email(), password: z.string().min(8) })
 * ```
 */
export function buildSchema<T extends FieldConfig[]>(
  fields: T
): z.ZodObject<Record<string, z.ZodTypeAny>> {
  const shape: Record<string, z.ZodTypeAny> = {}

  for (const field of fields) {
    shape[field.name] = buildField(field)
  }

  return z.object(shape)
}

/**
 * Add custom refinements to a schema
 * 
 * @param schema - Base Zod schema
 * @param refinements - Array of refinement functions
 * @returns Enhanced schema with refinements
 * 
 * @example
 * ```ts
 * const schema = buildSchema(fields)
 * const enhancedSchema = addRefinements(schema, [
 *   (data) => data.password === data.confirmPassword,
 *   { message: 'Şifreler eşleşmiyor', path: ['confirmPassword'] }
 * ])
 * ```
 */
export function addRefinements<T extends z.ZodObject<any>>(
  schema: T,
  refinements: Array<{
    validate: (data: any) => boolean
    message: string
    path?: string[]
  }>
): T {
  let enhancedSchema = schema

  for (const refinement of refinements) {
    enhancedSchema = enhancedSchema.refine(refinement.validate, {
      message: refinement.message,
      path: refinement.path,
    }) as any
  }

  return enhancedSchema
}
