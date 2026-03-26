"use client"

import Link from "next/link"
import { AppHeader } from "@hascanb/arf-ui-kit/layout-kit"
import { Button } from "@/components/ui/button"
import type { ModuleCategory, PermissionDefinition, RoleDetail } from "../../_types"
import { RoleProfileSection } from "./role-profile-section"
import { RoleUserCountSection } from "./role-user-count-section"
import { RolePermissionsSection } from "./role-permissions-section"

interface Props {
  role: RoleDetail
  categories: ModuleCategory[]
  definitions: PermissionDefinition[]
}

export function RoleDetailContent({ role, categories, definitions }: Props) {
  return (
    <>
      <AppHeader
        breadcrumbs={[
          { label: "Ana Sayfa", href: "/" },
          { label: "Ayarlar", href: "/arf/cargo/settings" },
          { label: "Roller", href: "/arf/cargo/settings/roles" },
          { label: role.name },
        ]}
      />

      <div className="flex flex-1 flex-col gap-4 bg-slate-50 p-4 pt-0">
        <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div>
            <h1 className="text-xl font-semibold text-slate-900">{role.name}</h1>
            <p className="text-sm text-slate-500">Rol detay ve yetki matrisi</p>
          </div>
          <Button asChild variant="outline">
            <Link href="/arf/cargo/settings/roles">Listeye Don</Link>
          </Button>
        </div>

        <RoleProfileSection role={role} />
        <RoleUserCountSection role={role} />
        <RolePermissionsSection role={role} categories={categories} definitions={definitions} />
      </div>
    </>
  )
}
