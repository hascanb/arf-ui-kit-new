"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { validatePricingRules, type UpsertPriceDefinitionInput } from "../_api/price-definitions-api"
import type {
  PriceDefinitionDetail,
  PriceDefinitionStatus,
  PriceDefinitionType,
  PriceRuleRow,
  PriceSurcharge,
} from "../_types"
import { RulesMatrixEditor } from "./rules-matrix-editor"
import { SurchargeEditor } from "./surcharge-editor"

const ruleSchema = z.object({
  id: z.string().min(1),
  unitType: z.enum(["desi", "kg"]),
  shipmentType: z.enum(["koli", "zarf", "palet"]),
  regionType: z.enum(["city_inner", "city_outer", "all_turkey", "line_based"]),
  regionLabel: z.string().min(1),
  rangeStart: z.number().min(0),
  rangeEnd: z.number().min(0),
  basePrice: z.number().min(0),
  incrementalPrice: z.number().min(0),
  sortOrder: z.number().min(1),
})

const surchargeSchema = z.object({
  smsNotificationFee: z.number().min(0),
  codCommissionType: z.enum(["fixed", "percent"]),
  codCommissionValue: z.number().min(0),
  pickupFee: z.number().min(0),
  remoteAreaDeliveryFee: z.number().min(0),
})

const formSchema = z
  .object({
    id: z.string().optional(),
    name: z.string().min(2, "Tarife adı zorunludur."),
    code: z.string().min(3, "Tarife kodu zorunludur."),
    type: z.enum(["b2b", "b2c"]),
    isDefault: z.boolean(),
    validFrom: z.string().min(1, "Başlangıç tarihi zorunludur."),
    validTo: z.string().min(1, "Bitiş tarihi zorunludur."),
    status: z.enum(["active", "passive"]),
    rules: z.array(ruleSchema).min(1, "En az bir barem satırı gerekir."),
    surcharges: surchargeSchema,
  })
  .superRefine((value, context) => {
    if (value.validFrom > value.validTo) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["validTo"],
        message: "Geçerlilik bitiş tarihi başlangıç tarihinden önce olamaz.",
      })
    }
  })

type WizardFormValues = z.infer<typeof formSchema>

interface Props {
  title: string
  submitLabel: string
  submittingLabel: string
  initialValue?: PriceDefinitionDetail
  onCancel: () => void
  onSubmit: (payload: UpsertPriceDefinitionInput & { id?: string }) => Promise<void>
}

function createDefaultRule(index: number): PriceRuleRow {
  return {
    id: `rule-${Date.now()}-${index}`,
    unitType: "desi",
    shipmentType: "koli",
    regionType: "city_inner",
    regionLabel: "Şehir İçi (0-50 km)",
    rangeStart: 0,
    rangeEnd: 5,
    basePrice: 0,
    incrementalPrice: 0,
    sortOrder: index + 1,
  }
}

function createDefaultSurcharges(): PriceSurcharge {
  return {
    smsNotificationFee: 2.5,
    codCommissionType: "fixed",
    codCommissionValue: 40,
    pickupFee: 20,
    remoteAreaDeliveryFee: 65,
  }
}

export function PriceDefinitionWizard({
  title,
  submitLabel,
  submittingLabel,
  initialValue,
  onCancel,
  onSubmit,
}: Props) {
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [overlapErrors, setOverlapErrors] = useState<string[]>([])
  const [gapWarnings, setGapWarnings] = useState<string[]>([])

  const form = useForm<WizardFormValues>({
    resolver: zodResolver(formSchema),
    mode: "onBlur",
    defaultValues: initialValue
      ? {
          id: initialValue.id,
          name: initialValue.name,
          code: initialValue.code,
          type: initialValue.type,
          isDefault: initialValue.isDefault,
          validFrom: initialValue.validFrom,
          validTo: initialValue.validTo,
          status: initialValue.status,
          rules: initialValue.rules,
          surcharges: initialValue.surcharges,
        }
      : {
          id: undefined,
          name: "",
          code: "",
          type: "b2c",
          isDefault: false,
          validFrom: "",
          validTo: "",
          status: "active",
          rules: [createDefaultRule(0)],
          surcharges: createDefaultSurcharges(),
        },
  })

  const rules = form.watch("rules")
  const surcharges = form.watch("surcharges")

  const setRuleField = <K extends keyof PriceRuleRow>(index: number, key: K, value: PriceRuleRow[K]) => {
    const nextRules = [...rules]
    nextRules[index] = {
      ...nextRules[index],
      [key]: value,
      sortOrder: index + 1,
    }
    form.setValue("rules", nextRules, { shouldDirty: true, shouldValidate: true })
  }

  const addRule = () => {
    form.setValue("rules", [...rules, createDefaultRule(rules.length)], {
      shouldDirty: true,
      shouldValidate: true,
    })
  }

  const duplicateRule = (index: number) => {
    const source = rules[index]
    const next = {
      ...source,
      id: `rule-${Date.now()}-${index}`,
      sortOrder: rules.length + 1,
    }
    form.setValue("rules", [...rules, next], { shouldDirty: true, shouldValidate: true })
  }

  const removeRule = (index: number) => {
    if (rules.length <= 1) {
      return
    }
    const next = rules.filter((_, rowIndex) => rowIndex !== index).map((row, rowIndex) => ({
      ...row,
      sortOrder: rowIndex + 1,
    }))
    form.setValue("rules", next, { shouldDirty: true, shouldValidate: true })
  }

  const nextStep = async () => {
    if (step === 1) {
      const valid = await form.trigger(["name", "code", "type", "validFrom", "validTo", "status"])
      if (!valid) {
        return
      }
      setStep(2)
      return
    }

    if (step === 2) {
      const valid = await form.trigger("rules")
      if (!valid) {
        return
      }
      setStep(3)
    }
  }

  const prevStep = () => {
    if (step === 2) {
      setStep(1)
      return
    }
    if (step === 3) {
      setStep(2)
    }
  }

  const submitHandler = form.handleSubmit(async (values) => {
    const validation = await validatePricingRules(values.rules)
    setOverlapErrors(validation.overlapErrors)
    setGapWarnings(validation.gapWarnings)

    if (validation.overlapErrors.length > 0) {
      setStep(2)
      return
    }

    setIsSubmitting(true)
    try {
      await onSubmit({
        id: values.id,
        code: values.code.trim(),
        name: values.name.trim(),
        type: values.type,
        isDefault: values.isDefault,
        validFrom: values.validFrom,
        validTo: values.validTo,
        status: values.status,
        rules: values.rules,
        surcharges: values.surcharges,
      })
    } finally {
      setIsSubmitting(false)
    }
  })

  return (
    <Form {...form}>
      <form className="space-y-6" onSubmit={submitHandler}>
        <div className="space-y-1">
          <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
          <p className="text-xs text-slate-500">Adım {step}/3</p>
        </div>

        <div className="grid grid-cols-3 gap-2 rounded-xl border border-slate-200 bg-slate-50 p-1 text-xs">
          <button type="button" className={`rounded-lg px-2 py-1 ${step === 1 ? "bg-white font-medium text-slate-900 shadow-sm" : "text-slate-500"}`} onClick={() => setStep(1)}>
            1. Tarife Kimliği
          </button>
          <button type="button" className={`rounded-lg px-2 py-1 ${step === 2 ? "bg-white font-medium text-slate-900 shadow-sm" : "text-slate-500"}`} onClick={() => setStep(2)}>
            2. Fiyat Matrisi
          </button>
          <button type="button" className={`rounded-lg px-2 py-1 ${step === 3 ? "bg-white font-medium text-slate-900 shadow-sm" : "text-slate-500"}`} onClick={() => setStep(3)}>
            3. Ek Hizmetler
          </button>
        </div>

        {step === 1 && (
          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tarife Adı</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Örn: E-Ticaret Standart 2026" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tarife Kodu</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Örn: TRF-ECOM-26" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tarife Tipi</FormLabel>
                  <Select value={field.value} onValueChange={(value: PriceDefinitionType) => field.onChange(value)}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="b2b">B2B Kurumsal</SelectItem>
                      <SelectItem value="b2c">B2C Bireysel</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Durum</FormLabel>
                  <Select value={field.value} onValueChange={(value: PriceDefinitionStatus) => field.onChange(value)}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="active">Aktif</SelectItem>
                      <SelectItem value="passive">Pasif</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="validFrom"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Geçerlilik Başlangıç</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="validTo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Geçerlilik Bitiş</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isDefault"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <div className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3">
                    <div>
                      <Label className="text-sm font-medium">Varsayılan Yap</Label>
                      <p className="text-xs text-slate-500">Bu tarife sistemde varsayılan fiyat kaynağı olarak işaretlenir.</p>
                    </div>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </div>
                </FormItem>
              )}
            />
          </div>
        )}

        {step === 2 && (
          <div className="space-y-3">
            {overlapErrors.length > 0 && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                <p className="font-medium">Kesişen barem var:</p>
                <ul className="mt-1 list-disc pl-5">
                  {overlapErrors.map((error) => (
                    <li key={error}>{error}</li>
                  ))}
                </ul>
              </div>
            )}

            {gapWarnings.length > 0 && (
              <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-700">
                <p className="font-medium">Barem boşluğu uyarısı:</p>
                <ul className="mt-1 list-disc pl-5">
                  {gapWarnings.map((warning) => (
                    <li key={warning}>{warning}</li>
                  ))}
                </ul>
              </div>
            )}

            <RulesMatrixEditor rows={rules} onAdd={addRule} onDuplicate={duplicateRule} onRemove={removeRule} onChange={setRuleField} />
            <FormMessage>{form.formState.errors.rules?.message}</FormMessage>
          </div>
        )}

        {step === 3 && (
          <SurchargeEditor
            value={surcharges}
            onChange={(key, val) => {
              const updated = { ...form.getValues("surcharges"), [key]: val }
              form.setValue("surcharges", updated, { shouldDirty: true, shouldValidate: true })
            }}
          />
        )}

        <div className="flex items-center justify-between">
          <Button type="button" variant="outline" onClick={onCancel}>
            Vazgeç
          </Button>

          <div className="flex items-center gap-2">
            {step > 1 && (
              <Button type="button" variant="outline" onClick={prevStep}>
                Geri
              </Button>
            )}
            {step < 3 ? (
              <Button type="button" onClick={nextStep}>
                İleri
              </Button>
            ) : (
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? submittingLabel : submitLabel}
              </Button>
            )}
          </div>
        </div>
      </form>
    </Form>
  )
}
