"use client"

import { useMemo, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui"
import type { ModuleCategory, PermissionDefinition, RoleDetail, RoleRecord } from "../_types"
import { RoleCreationWizard } from "./role-creation-wizard"

interface Props {
  open: boolean
  mode?: "create" | "edit"
  initialRole?: RoleDetail
  categories: ModuleCategory[]
  definitions: PermissionDefinition[]
  roles: RoleRecord[]
  onOpenChange: (open: boolean) => void
  onSaved: () => void
}

export function CreateRoleModal({
  open,
  mode = "create",
  initialRole,
  categories,
  definitions,
  roles,
  onOpenChange,
  onSaved,
}: Props) {
  const [success, setSuccess] = useState(false)

  const title = useMemo(() => (mode === "edit" ? "Rol Duzenle" : "Yeni Rol Olustur"), [mode])

  async function handleSaved() {
    setSuccess(true)
    onSaved()
    setTimeout(() => {
      setSuccess(false)
      onOpenChange(false)
    }, 1200)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="h-[92vh] max-w-[95vw] lg:max-w-6xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Rol kimligini ve yetki matrisini adim adim tanimlayin.
          </DialogDescription>
        </DialogHeader>

        {success ? (
          <div className="flex h-full items-center justify-center">
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-6 py-4 text-emerald-700">
              Rol basariyla kaydedildi.
            </div>
          </div>
        ) : (
          <RoleCreationWizard
            mode={mode}
            initialRole={initialRole}
            categories={categories}
            definitions={definitions}
            roles={roles}
            onCancel={() => onOpenChange(false)}
            onSaved={handleSaved}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}
