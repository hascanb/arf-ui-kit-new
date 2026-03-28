"use client"

import { useState, type ChangeEvent } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { updateSupplierDetail } from "../_api/supplier-detail-api"
import type { SupplierDetail } from "../_types"

const schema = z.object({
  name: z.string().min(2, "En az 2 karakter olmalıdır"),
  city: z.string().optional(),
  officialAddress: z.string().optional(),
  taxOffice: z.string().optional(),
  taxNumber: z
    .string()
    .regex(/^\d{10,11}$/, "VKN 10 hane, TCKN 11 hane olmalıdır")
    .optional()
    .or(z.literal("")),
  contactPerson: z.string().optional(),
  contactPersonTitle: z.string().optional(),
  contactPhone: z.string().optional(),
  contactEmail: z.string().email("Geçerli bir e-posta giriniz").optional().or(z.literal("")),
  contractType: z.enum(["fixed_salary", "per_trip", "per_desi", "commission"]),
  pricePerTrip: z.number().positive().optional(),
  pricePerDesi: z.number().positive().optional(),
  paymentTermDays: z.number().int().positive().optional(),
  iban: z.string().optional(),
  accountHolder: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

interface Props {
  supplier: SupplierDetail
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdated: (updated: SupplierDetail) => void
}

export function SupplierEditModal({ supplier, open, onOpenChange, onUpdated }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    values: {
      name: supplier.name,
      city: supplier.city ?? "",
      officialAddress: supplier.officialAddress ?? "",
      taxOffice: supplier.taxOffice ?? "",
      taxNumber: supplier.taxNumber ?? "",
      contactPerson: supplier.contactPerson ?? "",
      contactPersonTitle: supplier.contactPersonTitle ?? "",
      contactPhone: supplier.contactPhone ?? "",
      contactEmail: supplier.contactEmail ?? "",
      contractType: supplier.contractType,
      pricePerTrip: supplier.pricePerTrip,
      pricePerDesi: supplier.pricePerDesi,
      paymentTermDays: supplier.paymentTermDays,
      iban: supplier.iban ?? "",
      accountHolder: supplier.accountHolder ?? "",
    },
  })

  const contractType = form.watch("contractType")

  async function onSubmit(values: FormValues) {
    setIsSubmitting(true)
    try {
      const updated = await updateSupplierDetail(supplier.id, values)
      onUpdated(updated)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Pencil className="size-5 text-primary" />
            Tedarikçi Düzenle
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Firma Bilgileri */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-slate-700">Firma Bilgileri</h3>
              <div className="grid grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tedarikçi Adı *</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Şehir</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="taxOffice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vergi Dairesi</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="taxNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>VKN / TCKN</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="officialAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Resmi Adres</FormLabel>
                    <FormControl>
                      <Textarea rows={2} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* İletişim */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-slate-700">İletişim</h3>
              <div className="grid grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="contactPerson"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Yetkili Adı</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="contactPersonTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Unvan</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="contactPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefon</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="contactEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>E-posta</FormLabel>
                      <FormControl>
                        <Input type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Anlaşma */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-slate-700">Anlaşma</h3>
              <div className="grid grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="contractType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sözleşme Tipi *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="fixed_salary">Sabit Maaşlı</SelectItem>
                          <SelectItem value="per_trip">Sefer Başı</SelectItem>
                          <SelectItem value="per_desi">Desi Başı</SelectItem>
                          <SelectItem value="commission">Komisyon</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="paymentTermDays"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ödeme Vadesi (Gün)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(event: ChangeEvent<HTMLInputElement>) => field.onChange(event.target.value ? Number(event.target.value) : undefined)}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {contractType === "per_trip" && (
                  <FormField
                    control={form.control}
                    name="pricePerTrip"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sefer Başı Ücret (₺)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(event: ChangeEvent<HTMLInputElement>) => field.onChange(event.target.value ? Number(event.target.value) : undefined)}
                            value={field.value ?? ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                {contractType === "per_desi" && (
                  <FormField
                    control={form.control}
                    name="pricePerDesi"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Desi Başı Ücret (₺)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.1"
                            {...field}
                            onChange={(event: ChangeEvent<HTMLInputElement>) => field.onChange(event.target.value ? Number(event.target.value) : undefined)}
                            value={field.value ?? ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>
            </div>

            {/* Banka */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-slate-700">Banka Bilgileri</h3>
              <div className="grid grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="iban"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>IBAN</FormLabel>
                      <FormControl>
                        <Input placeholder="TR00 0000 0000 0000 0000 0000 00" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="accountHolder"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hesap Sahibi</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                İptal
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                <Pencil className="mr-1.5 size-4" />
                {isSubmitting ? "Kaydediliyor..." : "Kaydet"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
