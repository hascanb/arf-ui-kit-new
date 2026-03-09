/**
 * Form-Kit Test Page
 * 
 * Demonstrates all FormKit features:
 * - All field types
 * - Schema validation with Zod
 * - Cross-field validation
 * - Layout system
 * - Required fields
 */

'use client'

import { useState } from 'react'
import { z } from 'zod'
import {
  SchemaForm,
  FieldConfig,
  buildSchema,
  addRefinements,
  createPasswordConfirmRefine,
  createPasswordStrengthRefine,
  createDateRangeRefine,
} from '@/form-kit'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'

export default function FormKitTestPage() {
  const [formData, setFormData] = useState<any>(null)

  // ============================================================================
  // Basic Registration Form
  // ============================================================================

  const basicFields: FieldConfig[] = [
    {
      name: 'firstName',
      type: 'text',
      label: 'İsim',
      placeholder: 'Adınızı giriniz',
      required: true,
      layout: { span: 6 },
    },
    {
      name: 'lastName',
      type: 'text',
      label: 'Soyisim',
      placeholder: 'Soyadınızı giriniz',
      required: true,
      layout: { span: 6 },
    },
    {
      name: 'email',
      type: 'email',
      label: 'E-posta',
      placeholder: 'ornek@email.com',
      required: true,
      description: 'Geçerli bir e-posta adresi giriniz',
    },
    {
      name: 'age',
      type: 'number',
      label: 'Yaş',
      placeholder: '18',
      required: true,
      min: 18,
      max: 100,
      description: '18 yaşından büyük olmalısınız',
    },
    {
      name: 'bio',
      type: 'textarea',
      label: 'Hakkında',
      placeholder: 'Kendinizden bahsedin...',
      rows: 4,
      maxLength: 500,
      description: 'En fazla 500 karakter',
    },
  ]

  const basicSchema = buildSchema(basicFields)

  // ============================================================================
  // Password Form with Validation
  // ============================================================================

  const passwordFields: FieldConfig[] = [
    {
      name: 'username',
      type: 'text',
      label: 'Kullanıcı Adı',
      placeholder: 'kullaniciadi',
      required: true,
      minLength: 3,
      maxLength: 20,
    },
    {
      name: 'password',
      type: 'password',
      label: 'Şifre',
      placeholder: '••••••••',
      required: true,
      minLength: 8,
      description: 'En az 8 karakter, büyük harf, küçük harf ve rakam içermelidir',
    },
    {
      name: 'confirmPassword',
      type: 'password',
      label: 'Şifre Tekrar',
      placeholder: '••••••••',
      required: true,
      description: 'Yukarıdaki şifreyi tekrar giriniz',
    },
  ]

  const passwordSchema = addRefinements(buildSchema(passwordFields), [
    createPasswordStrengthRefine({
      minLength: 8,
      requireUppercase: true,
      requireLowercase: true,
      requireNumber: true,
      requireSpecialChar: false,
    }),
    createPasswordConfirmRefine('password', 'confirmPassword'),
  ])

  // ============================================================================
  // Complex Form with All Field Types
  // ============================================================================

  const complexFields: FieldConfig[] = [
    {
      name: 'accountType',
      type: 'select',
      label: 'Hesap Tipi',
      required: true,
      options: [
        { label: 'Bireysel', value: 'individual' },
        { label: 'Kurumsal', value: 'corporate' },
        { label: 'Öğrenci', value: 'student' },
      ],
      layout: { span: 6 },
    },
    {
      name: 'country',
      type: 'select',
      label: 'Ülke',
      required: true,
      options: [
        { label: 'Türkiye', value: 'tr' },
        { label: 'Amerika', value: 'us' },
        { label: 'İngiltere', value: 'uk' },
        { label: 'Almanya', value: 'de' },
      ],
      layout: { span: 6 },
    },
    {
      name: 'gender',
      type: 'radio',
      label: 'Cinsiyet',
      required: true,
      options: [
        { label: 'Erkek', value: 'male' },
        { label: 'Kadın', value: 'female' },
        { label: 'Diğer', value: 'other' },
      ],
      orientation: 'horizontal',
    },
    {
      name: 'interests',
      type: 'checkbox',
      label: 'İlgi Alanları',
      checkboxLabel: 'Teknoloji, yazılım ve yenilikler hakkında bildirim almak istiyorum',
    },
    {
      name: 'birthDate',
      type: 'date',
      label: 'Doğum Tarihi',
      required: true,
      description: 'Doğum tarihinizi seçiniz',
    },
    {
      name: 'terms',
      type: 'checkbox',
      label: 'Kullanım Koşulları',
      checkboxLabel: 'Kullanım koşullarını okudum ve kabul ediyorum',
      required: true,
    },
  ]

  const complexSchema = buildSchema(complexFields)

  // ============================================================================
  // Date Range Form
  // ============================================================================

  const dateRangeFields: FieldConfig[] = [
    {
      name: 'startDate',
      type: 'date',
      label: 'Başlangıç Tarihi',
      required: true,
      layout: { span: 6 },
    },
    {
      name: 'endDate',
      type: 'date',
      label: 'Bitiş Tarihi',
      required: true,
      layout: { span: 6 },
    },
    {
      name: 'reason',
      type: 'textarea',
      label: 'Açıklama',
      placeholder: 'Tarih aralığı açıklaması...',
      rows: 3,
    },
  ]

  const dateRangeSchema = addRefinements(buildSchema(dateRangeFields), [
    createDateRangeRefine('startDate', 'endDate'),
  ])

  // ============================================================================
  // Submit Handlers
  // ============================================================================

  const handleBasicSubmit = async (data: any) => {
    console.log('Basic form data:', data)
    setFormData(data)
    toast.success('Form başarıyla gönderildi!', {
      description: `Email: ${data.email}`,
    })
  }

  const handlePasswordSubmit = async (data: any) => {
    console.log('Password form data:', data)
    toast.success('Şifre başarıyla oluşturuldu!', {
      description: `Kullanıcı: ${data.username}`,
    })
  }

  const handleComplexSubmit = async (data: any) => {
    console.log('Complex form data:', data)
    toast.success('Kayıt tamamlandı!', {
      description: `Hesap tipi: ${data.accountType}`,
    })
  }

  const handleDateRangeSubmit = async (data: any) => {
    console.log('Date range data:', data)
    toast.success('Tarih aralığı kaydedildi!', {
      description: `${new Date(data.startDate).toLocaleDateString()} - ${new Date(data.endDate).toLocaleDateString()}`,
    })
  }

  return (
    <div className="container py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Form-Kit Test Sayfası</h1>
        <p className="text-muted-foreground mt-2">
          Schema-driven form generation with Zod validation
        </p>
      </div>

      <Separator />

      {/* Basic Form */}
      <Card>
        <CardHeader>
          <CardTitle>1. Temel Kayıt Formu</CardTitle>
          <CardDescription>
            Text, email, number, textarea field tipleri - Layout: 2 sütun (firstName/lastName)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SchemaForm
            config={{
              schema: basicSchema,
              fields: basicFields,
              layout: { columns: 12, gap: 'default', maxWidth: '800px' },
              submitButton: { label: 'Kayıt Ol', variant: 'default' },
              onSubmit: handleBasicSubmit,
            }}
          />
        </CardContent>
      </Card>

      {/* Password Form */}
      <Card>
        <CardHeader>
          <CardTitle>2. Şifre Doğrulama Formu</CardTitle>
          <CardDescription>
            Password strength validation + confirmation matching
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SchemaForm
            config={{
              schema: passwordSchema,
              fields: passwordFields,
              layout: { columns: 1, gap: 'default', maxWidth: '500px' },
              submitButton: { label: 'Şifre Oluştur', variant: 'default' },
              onSubmit: handlePasswordSubmit,
            }}
          />
        </CardContent>
      </Card>

      {/* Complex Form */}
      <Card>
        <CardHeader>
          <CardTitle>3. Tüm Field Tipleri</CardTitle>
          <CardDescription>
            Select, radio, checkbox, date - Layout: 2 sütun (accountType/country)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SchemaForm
            config={{
              schema: complexSchema,
              fields: complexFields,
              layout: { columns: 12, gap: 'lg', maxWidth: '800px' },
              submitButton: { label: 'Gönder', variant: 'default', fullWidth: false },
              onSubmit: handleComplexSubmit,
            }}
          />
        </CardContent>
      </Card>

      {/* Date Range Form */}
      <Card>
        <CardHeader>
          <CardTitle>4. Tarih Aralığı Cross-Field Validation</CardTitle>
          <CardDescription>
            createDateRangeRefine - Bitiş tarihi başlangıçtan sonra olmalı
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SchemaForm
            config={{
              schema: dateRangeSchema,
              fields: dateRangeFields,
              layout: { columns: 12, gap: 'default', maxWidth: '600px' },
              submitButton: { label: 'Kaydet', variant: 'default' },
              onSubmit: handleDateRangeSubmit,
            }}
          />
        </CardContent>
      </Card>

      {/* Form Data Display */}
      {formData && (
        <Card>
          <CardHeader>
            <CardTitle>Son Gönderilen Form Verisi</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
              {JSON.stringify(formData, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
