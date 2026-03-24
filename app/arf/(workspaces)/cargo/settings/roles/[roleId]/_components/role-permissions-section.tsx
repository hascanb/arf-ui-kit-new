"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui"
import { updateRole } from "../../_api/roles-api"
import type { ModuleCategory, PermissionDefinition, RoleDetail } from "../../_types"
import { PermissionMatrixEditor } from "../../_components/permission-matrix-editor"

interface Props {
  role: RoleDetail
  categories: ModuleCategory[]
  definitions: PermissionDefinition[]
}

export function RolePermissionsSection({ role, categories, definitions }: Props) {
  const [permissions, setPermissions] = useState(role.permissions)
  const [draftPermissions, setDraftPermissions] = useState(role.permissions)
  const [editOpen, setEditOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  function openEditDrawer() {
    setDraftPermissions({ ...permissions })
    setEditOpen(true)
  }

  async function saveDrawerChanges() {
    if (role.roleType === "system") return
    setIsSaving(true)
    try {
      const updated = await updateRole(role.id, { permissions: draftPermissions })
      if (!updated) {
        window.alert("Yetkiler kaydedilemedi.")
        return
      }
      setPermissions(updated.permissions)
      setEditOpen(false)
      window.alert("Yetkiler guncellendi.")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Card className="rounded-2xl border-slate-200 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between gap-3">
        <CardTitle>Detayli Yetki Matrisi</CardTitle>
        {role.roleType === "custom" ? (
          <Button type="button" onClick={openEditDrawer}>
            Duzenleme Modu
          </Button>
        ) : (
          <p className="text-xs text-slate-500">Sistem rolleri sadece goruntulenebilir.</p>
        )}
      </CardHeader>
      <CardContent>
        <PermissionMatrixEditor
          categories={categories}
          definitions={definitions}
          value={permissions}
          onChange={setPermissions}
          readOnly
        />
      </CardContent>

      <Drawer open={editOpen} onOpenChange={setEditOpen} direction="right">
        <DrawerContent className="w-full max-w-4xl">
          <DrawerHeader>
            <DrawerTitle>Rol Yetkilerini Duzenle</DrawerTitle>
            <DrawerDescription>
              Degisiklikler sadece kaydettiginizde uygulanir.
            </DrawerDescription>
          </DrawerHeader>

          <div className="px-4 pb-2">
            <PermissionMatrixEditor
              categories={categories}
              definitions={definitions}
              value={draftPermissions}
              onChange={setDraftPermissions}
            />
          </div>

          <DrawerFooter className="sm:flex-row sm:justify-end">
            <Button type="button" variant="outline" onClick={() => setEditOpen(false)}>
              Iptal
            </Button>
            <Button type="button" onClick={() => void saveDrawerChanges()} disabled={isSaving}>
              Degisiklikleri Kaydet
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </Card>
  )
}
