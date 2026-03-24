"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  createRole,
  fetchRoleDetail,
  fetchRoles,
  updateRole,
} from "../_api/roles-api"
import type { ModuleCategory, PermissionDefinition, RoleDetail, RolePermissions, RoleRecord } from "../_types"
import { PermissionMatrixEditor } from "./permission-matrix-editor"

const schema = z.object({
  name: z.string().min(3, "Rol adi en az 3 karakter olmalidir."),
  description: z.string().max(250, "Aciklama en fazla 250 karakter olabilir.").optional(),
  sourceRoleId: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

interface Props {
  categories: ModuleCategory[]
  definitions: PermissionDefinition[]
  roles: RoleRecord[]
  mode?: "create" | "edit"
  initialRole?: RoleDetail
  onCancel: () => void
  onSaved: () => void
}

export function RoleCreationWizard({
  categories,
  definitions,
  roles,
  mode = "create",
  initialRole,
  onCancel,
  onSaved,
}: Props) {
  const [step, setStep] = useState<1 | 2>(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [permissions, setPermissions] = useState<RolePermissions>(initialRole?.permissions ?? {})

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: initialRole?.name ?? "",
      description: initialRole?.description ?? "",
      sourceRoleId: undefined,
    },
  })

  async function handleStepOneNext() {
    const valid = await form.trigger(["name", "description", "sourceRoleId"])
    if (!valid) return

    const values = form.getValues()
    const existing = await fetchRoles({ q: values.name.trim() })
    const collision = existing.find(
      (role) =>
        role.name.toLocaleLowerCase("tr-TR") === values.name.trim().toLocaleLowerCase("tr-TR") &&
        role.id !== initialRole?.id,
    )

    if (collision) {
      form.setError("name", { message: "Bu isimde bir rol zaten mevcut." })
      return
    }

    if (mode === "create" && values.sourceRoleId) {
      const sourceDetail = await fetchRoleDetail(values.sourceRoleId)
      if (sourceDetail) {
        setPermissions({ ...sourceDetail.permissions })
      }
    }

    setStep(2)
  }

  const permissionCount = useMemo(
    () => Object.values(permissions).filter(Boolean).length,
    [permissions],
  )

  async function handleSubmit() {
    const values = form.getValues()
    setIsSubmitting(true)
    try {
      if (mode === "edit" && initialRole) {
        await updateRole(initialRole.id, {
          name: values.name,
          description: values.description,
          permissions,
        })
      } else {
        await createRole({
          name: values.name,
          description: values.description,
          sourceRoleId: values.sourceRoleId,
          permissions,
        })
      }
      onSaved()
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <div className="mb-6 flex items-center gap-2">
        {[1, 2].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className={`flex size-7 items-center justify-center rounded-full text-xs font-semibold ${
                step === s
                  ? "bg-slate-900 text-white"
                  : step > s
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-slate-100 text-slate-400"
              }`}
            >
              {s}
            </div>
            {s < 2 && <div className="h-px w-8 bg-slate-200" />}
          </div>
        ))}
        <span className="ml-2 text-sm text-slate-500">
          {step === 1 ? "Rol Kimligi" : "Yetki Matrisi"}
        </span>
      </div>

      {step === 1 && (
        <div className="space-y-4">
          <section className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rol Adi *</FormLabel>
                  <FormControl>
                    <Input placeholder="Sube Yoneticisi" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Aciklama</FormLabel>
                  <FormControl>
                    <Textarea rows={3} placeholder="Rolun sorumluluk tanimini giriniz" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {mode === "create" && (
              <FormField
                control={form.control}
                name="sourceRoleId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rol Sablonu (Opsiyonel)</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Mevcut bir rolden kopyala" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {roles.map((role) => (
                          <SelectItem key={role.id} value={role.id}>
                            {role.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </section>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              Iptal
            </Button>
            <Button type="button" onClick={() => void handleStepOneNext()}>
              Ileri {">"}
            </Button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <div className="rounded-xl border border-blue-200 bg-blue-50 px-3 py-2 text-sm text-blue-700">
            Secili yetki sayisi: <strong>{permissionCount}</strong>
          </div>

          <PermissionMatrixEditor
            categories={categories}
            definitions={definitions}
            value={permissions}
            onChange={setPermissions}
          />

          <div className="flex justify-between gap-2">
            <Button type="button" variant="outline" onClick={() => setStep(1)}>
              {"<"} Geri
            </Button>
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={onCancel}>
                Vazgec
              </Button>
              <Button type="button" disabled={isSubmitting} onClick={() => void handleSubmit()}>
                {mode === "edit" ? "Degisiklikleri Kaydet" : "Rolu Olustur"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </Form>
  )
}
