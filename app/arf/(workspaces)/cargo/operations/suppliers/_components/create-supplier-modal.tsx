"use client"

import { useState, type ChangeEvent } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Building2, Plus } from "lucide-react"
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
import { createSupplier } from "../_api/suppliers-list-api"
import type { SupplierRecord } from "../_types"

const createSupplierSchema = z.object({
  supplierType: z.enum(["logistics", "truck_owner", "warehouse"], {
    required_error: "Tedarikçi tipi seçiniz",
  }),
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
  contractType: z.enum(["fixed_salary", "per_trip", "per_desi", "commission"], {
    required_error: "Sözleşme tipi seçiniz",
  }),
  pricePerTrip: z.number().positive().optional(),
  pricePerDesi: z.number().positive().optional(),
  paymentTermDays: z.number().int().positive().optional(),
})

type FormValues = z.infer<typeof createSupplierSchema>

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreated: (supplier: SupplierRecord) => void
}

export function CreateSupplierModal({ open, onOpenChange, onCreated }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(createSupplierSchema),
    defaultValues: {
      supplierType: undefined,
      name: "",
      city: "",
      officialAddress: "",
      taxOffice: "",
      taxNumber: "",
      contactPerson: "",
      contactPersonTitle: "",
      contactPhone: "",
      contactEmail: "",
      contractType: undefined,
      paymentTermDays: undefined,
    },
  })

  const contractType = form.watch("contractType")

  async function onSubmit(values: FormValues) {
    setIsSubmitting(true)
    try {
      const newSupplier = await createSupplier({
        ...values,
        supplierType: values.supplierType,
        name: values.name,
        status: "active",
        contractType: values.contractType,
        contactPerson: values.contactPerson || undefined,
        contactPhone: values.contactPhone || undefined,
        city: values.city || undefined,
        createdBy: "Kullanıcı",
      })
      form.reset()
      onCreated(newSupplier)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="size-5 text-primary" />
            Yeni Tedarikçi Oluştur
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Bölüm 1: Temel Kimlik */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-slate-700">Temel Kimlik</h3>
              <div className="grid grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="supplierType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tedarikçi Tipi *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seçiniz..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="logistics">Lojistik</SelectItem>
                          <SelectItem value="truck_owner">Kamyon Sahibi</SelectItem>
                          <SelectItem value="warehouse">Ambar</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tedarikçi Adı *</FormLabel>
                      <FormControl>
                        <Input placeholder="Örn: Kuzey Lojistik A.Ş." {...field} />
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
                        <Input placeholder="Örn: İstanbul" {...field} />
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
                      <Textarea placeholder="Açık adres..." rows={2} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Bölüm 2: Yasal Bilgiler */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-slate-700">Yasal Bilgiler</h3>
              <div className="grid grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="taxOffice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vergi Dairesi</FormLabel>
                      <FormControl>
                        <Input placeholder="Örn: Kadıköy V.D." {...field} />
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
                        <Input placeholder="10 veya 11 hane" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Bölüm 3: İletişim Yetkilisi */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-slate-700">İletişim Yetkilisi</h3>
              <div className="grid grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="contactPerson"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Yetkili Adı</FormLabel>
                      <FormControl>
                        <Input placeholder="Ad Soyad" {...field} />
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
                        <Input placeholder="Örn: Operasyon Müdürü" {...field} />
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
                        <Input placeholder="+90 5XX XXX XXXX" {...field} />
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
                        <Input type="email" placeholder="ornek@firma.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Bölüm 4: Anlaşma Detayları */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-slate-700">Anlaşma Detayları</h3>
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
                            <SelectValue placeholder="Seçiniz..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="fixed_salary">Sabit Maaşlı</SelectItem>
                          <SelectItem value="per_trip">Sefer Başı Ücretli</SelectItem>
                          <SelectItem value="per_desi">Desi Başı Ücretli</SelectItem>
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
                          placeholder="Örn: 30"
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
                            placeholder="Örn: 1500"
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
                            placeholder="Örn: 2.5"
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

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                İptal
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                <Plus className="mr-1.5 size-4" />
                {isSubmitting ? "Oluşturuluyor..." : "Tedarikçi Oluştur"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
