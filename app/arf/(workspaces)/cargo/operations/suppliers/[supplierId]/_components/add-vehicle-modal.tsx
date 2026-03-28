"use client"

import { useState, type ChangeEvent } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Truck } from "lucide-react"
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
import { addSupplierVehicle } from "../_api/supplier-detail-api"
import type { SupplierVehicle } from "../_types"

const schema = z.object({
  plate: z.string().min(5, "Geçerli bir plaka giriniz"),
  brand: z.string().min(1, "Marka zorunludur"),
  model: z.string().min(1, "Model zorunludur"),
  vehicleType: z.enum(["tir", "kamyon", "van", "pickup"]),
  year: z
    .number()
    .int()
    .min(1990, "1990 veya sonrası olmalıdır")
    .max(new Date().getFullYear() + 1),
  capacity: z.number().positive("Kapasite pozitif olmalıdır"),
  nextInspectionDate: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

interface Props {
  supplierId: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdded: (vehicle: SupplierVehicle) => void
}

export function AddVehicleModal({ supplierId, open, onOpenChange, onAdded }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      plate: "",
      brand: "",
      model: "",
      vehicleType: undefined,
      year: new Date().getFullYear(),
      capacity: undefined,
      nextInspectionDate: "",
    },
  })

  async function onSubmit(values: FormValues) {
    setIsSubmitting(true)
    try {
      const newVehicle = await addSupplierVehicle(supplierId, {
        ...values,
        status: "idle",
        nextInspectionDate: values.nextInspectionDate || undefined,
      })
      form.reset()
      onAdded(newVehicle)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Truck className="size-5 text-primary" />
            Araç Ekle
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="plate"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Plaka *</FormLabel>
                    <FormControl>
                      <Input placeholder="Örn: 34 ABC 001" className="uppercase" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="vehicleType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Araç Tipi *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seçiniz..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="tir">TIR</SelectItem>
                        <SelectItem value="kamyon">Kamyon</SelectItem>
                        <SelectItem value="van">Van</SelectItem>
                        <SelectItem value="pickup">Pickup</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="brand"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Marka *</FormLabel>
                    <FormControl>
                      <Input placeholder="Örn: Mercedes" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="model"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Model *</FormLabel>
                    <FormControl>
                      <Input placeholder="Örn: Actros" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Yıl *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(event: ChangeEvent<HTMLInputElement>) => field.onChange(Number(event.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="capacity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kapasite (ton) *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.5"
                        placeholder="Örn: 24"
                        {...field}
                        onChange={(event: ChangeEvent<HTMLInputElement>) => field.onChange(event.target.value ? Number(event.target.value) : undefined)}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="nextInspectionDate"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Muayene Tarihi (Opsiyonel)</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                İptal
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                <Truck className="mr-1.5 size-4" />
                {isSubmitting ? "Ekleniyor..." : "Araç Ekle"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
