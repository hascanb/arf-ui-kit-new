"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { updateUser } from "../_api/users-api"
import type { LocationOption, UserRecord } from "../_types"
import { USER_ROLE_LABELS, USER_ROLE_REQUIRES_LOCATION } from "../_types"
import type { UserRole } from "../_types/user"

const formSchema = z
  .object({
    firstName: z.string().min(2, "Ad zorunludur."),
    lastName: z.string().min(2, "Soyad zorunludur."),
    phoneNumber: z.string().min(5, "Telefon zorunludur."),
    role: z.enum([
      "superadmin",
      "hq_manager",
      "tm_manager",
      "branch_manager",
      "courier",
      "operator",
    ] as const),
    locationId: z.string().nullable(),
  })
  .superRefine((val, ctx) => {
    if (USER_ROLE_REQUIRES_LOCATION[val.role] && !val.locationId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["locationId"],
        message: "Bu rol için birim seçimi zorunludur.",
      })
    }
  })

type EditFormValues = z.infer<typeof formSchema>

interface Props {
  open: boolean
  user: UserRecord
  locations: LocationOption[]
  onOpenChange: (open: boolean) => void
  onSaved: (updated: UserRecord) => void
}

export function UserEditModal({ open, user, locations, onOpenChange, onSaved }: Props) {
  const form = useForm<EditFormValues>({
    resolver: zodResolver(formSchema),
    mode: "onBlur",
    defaultValues: {
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber,
      role: user.role as EditFormValues["role"],
      locationId: user.locationId,
    },
  })

  // Kullanıcı değiştiğinde formu sıfırla
  useEffect(() => {
    if (open) {
      form.reset({
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber,
        role: user.role as EditFormValues["role"],
        locationId: user.locationId,
      })
    }
  }, [open, user, form])

  const selectedRole = form.watch("role") as UserRole
  const requiresLocation = USER_ROLE_REQUIRES_LOCATION[selectedRole]

  const filteredLocations = requiresLocation
    ? locations.filter((loc) => {
        if (selectedRole === "tm_manager") return loc.type === "tm"
        if (selectedRole === "branch_manager") return loc.type === "branch"
        return loc.type !== "hq"
      })
    : []

  async function handleSubmit(values: EditFormValues) {
    const updated = await updateUser(user.id, {
      firstName: values.firstName,
      lastName: values.lastName,
      phoneNumber: values.phoneNumber,
      role: values.role,
      locationId: values.locationId,
    })
    if (updated) {
      onSaved(updated)
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Kullanıcı Düzenle</DialogTitle>
          <DialogDescription>
            {user.firstName} {user.lastName} — {user.email}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={(e) => void form.handleSubmit(handleSubmit)(e)} className="space-y-4">
            <section className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
              <h3 className="text-sm font-semibold text-slate-800">Kişisel Bilgiler</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ad *</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Soyad *</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem className="sm:col-span-2">
                      <FormLabel>Telefon *</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </section>

            <section className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
              <h3 className="text-sm font-semibold text-slate-800">Rol ve Birim</h3>
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rol *</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={(value: string) => {
                          field.onChange(value)
                          form.setValue("locationId", null)
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {(Object.entries(USER_ROLE_LABELS) as [UserRole, string][]).map(
                            ([key, label]) => (
                              <SelectItem key={key} value={key}>
                                {label}
                              </SelectItem>
                            ),
                          )}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {requiresLocation && (
                <FormField
                  control={form.control}
                  name="locationId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bağlı Birim *</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value ?? ""}
                          onValueChange={(value: string) => field.onChange(value || null)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Birim seçin" />
                          </SelectTrigger>
                          <SelectContent>
                            {filteredLocations.map((loc) => (
                              <SelectItem key={loc.id} value={loc.id}>
                                {loc.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {!requiresLocation && (
                <p className="text-xs text-slate-500">
                  Seçilen rol tüm sisteme erişim sağlar; lokasyon gerekli değildir.
                </p>
              )}
            </section>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                İptal
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Kaydediliyor..." : "Kaydet"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
