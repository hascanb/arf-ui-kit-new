"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { User } from "lucide-react"
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
import { Switch } from "@/components/ui/switch"
import { addSupplierDriver } from "../_api/supplier-detail-api"
import type { SupplierDriver } from "../_types"

const schema = z.object({
  fullName: z.string().min(3, "En az 3 karakter giriniz"),
  phone: z.string().min(10, "Geçerli bir telefon giriniz"),
  nationalId: z.string().length(11, "TCKN 11 hane olmalıdır"),
  licenseClass: z.enum(["B", "C", "CE", "D"]),
  licenseExpiry: z.string().min(1, "Ehliyet bitiş tarihi zorunludur"),
  hasSrcCertificate: z.boolean(),
  srcExpiryDate: z.string().optional(),
}).refine(
  (data) => {
    if (data.hasSrcCertificate && !data.srcExpiryDate) return false
    return true
  },
  { message: "SRC belgesi varsa bitiş tarihi zorunludur", path: ["srcExpiryDate"] },
)

type FormValues = z.infer<typeof schema>

interface Props {
  supplierId: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdded: (driver: SupplierDriver) => void
}

export function AddDriverModal({ supplierId, open, onOpenChange, onAdded }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: "",
      phone: "",
      nationalId: "",
      licenseClass: undefined,
      licenseExpiry: "",
      hasSrcCertificate: false,
      srcExpiryDate: "",
    },
  })

  const hasSrc = form.watch("hasSrcCertificate")

  async function onSubmit(values: FormValues) {
    setIsSubmitting(true)
    try {
      const newDriver = await addSupplierDriver(supplierId, {
        ...values,
        status: "available",
        totalTrips: 0,
        srcExpiryDate: values.hasSrcCertificate ? values.srcExpiryDate : undefined,
      })
      form.reset()
      onAdded(newDriver)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="size-5 text-primary" />
            Sürücü Ekle
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Ad Soyad *</FormLabel>
                    <FormControl>
                      <Input placeholder="Ad Soyad" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefon *</FormLabel>
                    <FormControl>
                      <Input placeholder="+90 5XX XXX XXXX" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="nationalId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>TCKN *</FormLabel>
                    <FormControl>
                      <Input placeholder="11 hane" maxLength={11} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="licenseClass"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ehliyet Sınıfı *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seçiniz..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="B">B</SelectItem>
                        <SelectItem value="C">C</SelectItem>
                        <SelectItem value="CE">CE</SelectItem>
                        <SelectItem value="D">D</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="licenseExpiry"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ehliyet Bitiş *</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="hasSrcCertificate"
                render={({ field }) => (
                  <FormItem className="col-span-2 flex items-center gap-3">
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="mt-0!">SRC Belgesi Var</FormLabel>
                  </FormItem>
                )}
              />

              {hasSrc && (
                <FormField
                  control={form.control}
                  name="srcExpiryDate"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>SRC Bitiş Tarihi *</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                İptal
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                <User className="mr-1.5 size-4" />
                {isSubmitting ? "Ekleniyor..." : "Sürücü Ekle"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
