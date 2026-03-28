"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui"
import { Checkbox } from "@/components/ui/checkbox"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"
import { findExistingBankAccountByIban, type UpsertBankAccountPayload } from "../_api/bank-accounts-api"
import { resolveBankNameByCode } from "../_mock/turkey-banks-data"
import type { AccountType, Currency, IntegrationStatus } from "../_types"
import { extractBankCode, IbanInput, sanitizeIbanInput, validateTurkishIban } from "./iban-input"
import { Check, ChevronDown } from "lucide-react"

const formSchema = z
  .object({
    id: z.string().optional(),
    iban: z.string().min(1, "IBAN zorunludur.").refine((value) => validateTurkishIban(value).isValid, {
      message: "Geçerli bir TR IBAN girin.",
    }),
    bankName: z.string().min(1, "Banka kodu tanınamadı."),
    branchName: z.string().min(2, "Banka şube adı zorunludur."),
    currency: z.enum(["TRY", "USD", "EUR"]),
    accountHolder: z.string().min(2, "Hesap sahibi zorunludur."),
    label: z.string().min(2, "Etiket zorunludur."),
    accountType: z.enum(["collection", "expense"]),
    isOpenToAllBranches: z.boolean(),
    allowedBranchIds: z.array(z.string()),
    integrationEnabled: z.boolean(),
  })
  .superRefine((value, context) => {
    if (
      value.accountType === "collection" &&
      !value.isOpenToAllBranches &&
      value.allowedBranchIds.length === 0
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["allowedBranchIds"],
        message: "En az bir şube seçmelisiniz.",
      })
    }
  })

type FormValues = z.infer<typeof formSchema>

export interface BranchOption {
  id: string
  name: string
}

export interface BankAccountFormInitialValues {
  id?: string
  iban: string
  bankName: string
  branchName: string
  currency: Currency
  accountHolder: string
  label: string
  accountType: AccountType
  isOpenToAllBranches: boolean
  allowedBranchIds: string[]
  integrationStatus: IntegrationStatus
}

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  submitLabel: string
  submittingLabel: string
  branches: BranchOption[]
  initialValues?: BankAccountFormInitialValues
  onSubmit: (payload: UpsertBankAccountPayload & { id?: string }) => Promise<void>
}

function normalizeForSearch(value: string): string {
  return value
    .toLocaleLowerCase("tr-TR")
    .replace(/ç/g, "c")
    .replace(/ğ/g, "g")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ş/g, "s")
    .replace(/ü/g, "u")
}

const defaultValues: FormValues = {
  id: undefined,
  iban: "",
  bankName: "",
  branchName: "",
  currency: "TRY",
  accountHolder: "",
  label: "",
  accountType: "collection",
  isOpenToAllBranches: true,
  allowedBranchIds: [],
  integrationEnabled: true,
}

export function BankAccountFormModal({
  open,
  onOpenChange,
  title,
  description,
  submitLabel,
  submittingLabel,
  branches,
  initialValues,
  onSubmit,
}: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [branchesOpen, setBranchesOpen] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: "onBlur",
    defaultValues,
  })

  useEffect(() => {
    form.reset(
      initialValues
        ? {
            id: initialValues.id,
            iban: sanitizeIbanInput(initialValues.iban),
            bankName: initialValues.bankName,
            branchName: initialValues.branchName,
            currency: initialValues.currency,
            accountHolder: initialValues.accountHolder,
            label: initialValues.label,
            accountType: initialValues.accountType,
            isOpenToAllBranches: initialValues.isOpenToAllBranches,
            allowedBranchIds: initialValues.allowedBranchIds,
            integrationEnabled: initialValues.integrationStatus === "active",
          }
        : defaultValues,
    )
  }, [form, initialValues, open])

  const ibanValue = form.watch("iban")
  const isOpenToAllBranches = form.watch("isOpenToAllBranches")
  const accountType = form.watch("accountType")
  const allowedBranchIds = form.watch("allowedBranchIds")

  useEffect(() => {
    const bankCode = extractBankCode(ibanValue)
    const bankName = resolveBankNameByCode(bankCode)
    if (form.getValues("bankName") !== bankName) {
      form.setValue("bankName", bankName, { shouldValidate: true })
    }
  }, [form, ibanValue])

  useEffect(() => {
    if (accountType === "expense") {
      form.setValue("isOpenToAllBranches", false)
      form.setValue("allowedBranchIds", [])
    }
  }, [accountType, form])

  const selectedBranchNames = useMemo(
    () =>
      branches
        .filter((branch) => allowedBranchIds.includes(branch.id))
        .map((branch) => branch.name),
    [allowedBranchIds, branches],
  )

  const submitHandler = form.handleSubmit(async (values) => {
    const normalizedIban = sanitizeIbanInput(values.iban)
    const duplicate = await findExistingBankAccountByIban(normalizedIban)

    if (duplicate && duplicate.id !== values.id) {
      const shouldContinue = window.confirm(
        `Bu IBAN sistemde '${duplicate.label}' etiketi ile zaten kayıtlı. Devam etmek istiyor musunuz?`,
      )
      if (!shouldContinue) {
        return
      }
    }

    setIsSubmitting(true)
    try {
      await onSubmit({
        id: values.id,
        iban: normalizedIban,
        bankName: values.bankName,
        branchName: values.branchName.trim(),
        currency: values.currency,
        accountHolder: values.accountHolder.trim(),
        label: values.label.trim(),
        accountType: values.accountType,
        isOpenToAllBranches: values.accountType === "expense" ? false : values.isOpenToAllBranches,
        allowedBranchIds:
          values.accountType === "expense"
            ? []
            : values.isOpenToAllBranches
              ? branches.map((branch) => branch.id)
              : values.allowedBranchIds,
        integrationStatus: values.integrationEnabled ? "active" : "passive",
      })
      onOpenChange(false)
    } finally {
      setIsSubmitting(false)
    }
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form className="space-y-6" onSubmit={submitHandler}>
            <section className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
              <div>
                <h3 className="text-sm font-semibold text-slate-900">Bölüm A: Temel Finansal Veriler</h3>
                <p className="text-xs text-slate-500">IBAN doğrulama, banka çözümleme ve para birimi bilgileri.</p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="iban"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>IBAN</FormLabel>
                      <FormControl>
                        <IbanInput {...field} value={field.value} onValueChange={field.onChange} placeholder="TR00 0000 0000 0000 0000 0000 00" />
                      </FormControl>
                      <FormDescription>TR ile başlamalı, 26 karakter olmalı ve checksum kontrolünü geçmelidir.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="bankName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Banka Adı</FormLabel>
                      <FormControl>
                        <Input {...field} readOnly disabled placeholder="IBAN'dan otomatik çözümlenir" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="branchName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Banka Şube Adı</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Örn: Kadıköy Şubesi" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="currency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Döviz Cinsi</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Döviz seçin" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="TRY">TRY - Türk Lirası</SelectItem>
                          <SelectItem value="USD">USD - Amerikan Doları</SelectItem>
                          <SelectItem value="EUR">EUR - Euro</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </section>

            <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4">
              <div>
                <h3 className="text-sm font-semibold text-slate-900">Bölüm B: Kurumsal Kimlik</h3>
                <p className="text-xs text-slate-500">Hesabın şirkette hangi amaçla kullanıldığını tanımlayın.</p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="accountHolder"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hesap Sahibi / Unvan</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Şirket unvanı veya kişi adı" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="label"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Etiket</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Örn: Marmara Bölgesi Tahsilatları" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="accountType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hesap Türü</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Hesap türü seçin" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="collection">Tahsilat Hesabı</SelectItem>
                          <SelectItem value="expense">Gider / Ödeme Hesabı</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        {accountType === "expense"
                          ? "Bu hesap yalnızca Genel Merkez kullanımı için işaretlenir."
                          : "Tahsilat hesapları şubelere kontrollü biçimde açılır."}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </section>

            <section className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
              <div>
                <h3 className="text-sm font-semibold text-slate-900">Bölüm C: Operasyonel Kapsam ve Entegrasyon</h3>
                <p className="text-xs text-slate-500">Whitelist görünürlüğü ve hesap entegrasyon davranışı burada belirlenir.</p>
              </div>

              {accountType === "collection" && (
                <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-4">
                  <FormField
                    control={form.control}
                    name="isOpenToAllBranches"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between gap-4 rounded-lg border border-slate-200 px-3 py-2">
                        <div className="space-y-0.5">
                          <FormLabel>Tüm Şubelere Açık</FormLabel>
                          <FormDescription>İşaretlenirse bu hesap tüm aktif şubelerin ekranında görünür.</FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {!isOpenToAllBranches && (
                    <FormField
                      control={form.control}
                      name="allowedBranchIds"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Şube Whitelist</FormLabel>
                          <Popover open={branchesOpen} onOpenChange={setBranchesOpen}>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button variant="outline" role="combobox" className="w-full justify-between font-normal">
                                  {selectedBranchNames.length === 0
                                    ? "Şube seçin"
                                    : selectedBranchNames.length === 1
                                      ? selectedBranchNames[0]
                                      : `${selectedBranchNames.length} şube seçildi`}
                                  <ChevronDown className="ml-2 size-4 opacity-60" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                              <Command filter={(value: string, search: string) => (normalizeForSearch(value).includes(normalizeForSearch(search)) ? 1 : 0)}>
                                <CommandInput placeholder="Şube ara..." />
                                <CommandList className="max-h-72">
                                  <CommandEmpty>Şube bulunamadı.</CommandEmpty>
                                  <CommandGroup>
                                    {branches.map((branch) => {
                                      const checked = field.value.includes(branch.id)
                                      return (
                                        <CommandItem
                                          key={branch.id}
                                          value={branch.name}
                                          onSelect={() => {
                                            field.onChange(
                                              checked
                                                ? field.value.filter((item: string) => item !== branch.id)
                                                : [...field.value, branch.id],
                                            )
                                          }}
                                        >
                                          <Checkbox checked={checked} className="mr-2" />
                                          {branch.name}
                                          <Check className={cn("ml-auto size-4", checked ? "opacity-100" : "opacity-0")} />
                                        </CommandItem>
                                      )
                                    })}
                                  </CommandGroup>
                                </CommandList>
                              </Command>
                            </PopoverContent>
                          </Popover>
                          <FormDescription>Bu IBAN yalnızca seçili şubelerin ödeme ekranında görünür.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>
              )}

              {accountType === "expense" && (
                <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                  Gider / Ödeme hesabı seçildiği için bu kayıt otomatik olarak yalnızca Genel Merkez kullanımında tutulur.
                </div>
              )}

              <FormField
                control={form.control}
                name="integrationEnabled"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white px-4 py-3">
                    <div className="space-y-0.5">
                      <FormLabel>Banka Entegrasyonu Aktif mi?</FormLabel>
                      <FormDescription>
                        Aktif durumda ekstre verisi API veya MT940 akışından sisteme otomatik alınır.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </section>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Vazgeç
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? submittingLabel : submitLabel}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
