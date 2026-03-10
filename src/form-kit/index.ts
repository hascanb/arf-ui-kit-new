/**
 * Form Kit
 * 
 * Schema-driven form generation with Zod validation and react-hook-form.
 * 
 * @status Phase 3 Complete (100%)
 * @version 0.1.0
 * @features
 * - Schema-driven form generation
 * - Zod validation integration
 * - Type-safe field configurations
 * - Auto field type rendering
 * - Cross-field validation
 * - Layout system (columns, spacing, gap)
 * - 9 field types supported
 * - Custom field renderers
 */

// ============================================================================
// Components
// ============================================================================

export { SchemaForm } from './components/SchemaForm'
export { FieldRenderer } from './components/FieldRenderer'
export { WizardForm } from './components/WizardForm'

// ============================================================================
// Context & Provider
// ============================================================================

export { FormKitProvider, useFormKit } from './context/FormKitProvider'

// ============================================================================
// Hooks
// ============================================================================

export { useSchemaForm } from './hooks/useSchemaForm'
export { useAutoSave } from './hooks/useAutoSave'
export type { UseSchemaFormOptions } from './hooks/useSchemaForm'

// ============================================================================
// Utilities
// ============================================================================

export { buildSchema, buildField, addRefinements } from './utils/buildSchema'
export {
  createPasswordConfirmRefine,
  createPasswordStrengthRefine,
  createDateRangeRefine,
  createConditionalRequiredRefine,
  createFieldComparisonRefine,
  getPasswordRefinements,
} from './utils/create-refine'
export type {
  RefinementConfig,
  PasswordStrengthConfig,
} from './utils/create-refine'

// ============================================================================
// Types
// ============================================================================

export type {
  // Field types
  FieldType,
  FieldSize,
  FieldLayout,
  FieldOption,
  
  // Field configurations
  BaseFieldConfig,
  TextFieldConfig,
  NumberFieldConfig,
  TextareaFieldConfig,
  SelectFieldConfig,
  ComboboxFieldConfig,
  CheckboxFieldConfig,
  RadioFieldConfig,
  DateFieldConfig,
  FileFieldConfig,
  ArrayFieldConfig,
  CustomFieldConfig,
  FieldConfig,
  
  // Form configuration
  FormLayout,
  SubmitButtonConfig,
  FormConfig,
  
  // Component props
  SchemaFormProps,
  FieldRendererProps,
  CustomFieldRenderProps,
  
  // Hook types
  UseSchemaFormReturn,
  WizardStepConfig,
  WizardFormConfig,
  WizardFormProps,
  AutoSaveMode,
  UseAutoSaveOptions,
  UseAutoSaveReturn,
  
  // Provider types
  FormKitConfig,
} from './context/types'

// ============================================================================
// Version & Metadata
// ============================================================================

export const FORM_KIT_VERSION = '0.1.0'
export const FORM_KIT_STATUS = 'Phase 3 Complete'

/**
 * Supported field types
 */
export const SUPPORTED_FIELD_TYPES = [
  'text',
  'email',
  'password',
  'number',
  'textarea',
  'select',
  'checkbox',
  'radio',
  'combobox',
  'date',
  'file',
  'array',
  'custom',
] as const

