"use client"

import { useMemo, useState } from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@hascanb/arf-ui-kit/datatable-kit"
import { ChevronDown, ChevronRight } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { ModuleCategory, PermissionDefinition, RolePermissions } from "../_types"

interface Props {
  categories: ModuleCategory[]
  definitions: PermissionDefinition[]
  value: RolePermissions
  onChange: (next: RolePermissions) => void
  readOnly?: boolean
}

interface GroupedModule {
  moduleCode: string
  moduleName: string
  permissions: PermissionDefinition[]
}

interface MatrixRow {
  moduleCode: string
  moduleName: string
  permissions: PermissionDefinition[]
}

export function PermissionMatrixEditor({
  categories,
  definitions,
  value,
  onChange,
  readOnly = false,
}: Props) {
  const grouped = useMemo(() => {
    const byCategory = new Map<string, GroupedModule[]>()

    categories.forEach((category) => {
      const rows = definitions.filter((d) => d.moduleCategoryId === category.id)
      const groupedModules = new Map<string, GroupedModule>()

      rows.forEach((permission) => {
        const existing = groupedModules.get(permission.moduleCode)
        if (existing) {
          existing.permissions.push(permission)
        } else {
          groupedModules.set(permission.moduleCode, {
            moduleCode: permission.moduleCode,
            moduleName: permission.moduleName,
            permissions: [permission],
          })
        }
      })

      byCategory.set(category.id, [...groupedModules.values()])
    })

    return byCategory
  }, [categories, definitions])

  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>(
    Object.fromEntries(categories.map((category) => [category.id, true])),
  )

  function togglePermission(permissionId: string, nextValue: boolean) {
    onChange({ ...value, [permissionId]: nextValue })
  }

  function toggleModuleStandardPermissions(modulePermissions: PermissionDefinition[], nextValue: boolean) {
    const next = { ...value }
    modulePermissions
      .filter((permission) => permission.permissionType !== "special")
      .forEach((permission) => {
        next[permission.id] = nextValue
      })
    onChange(next)
  }

  const columns = useMemo<ColumnDef<MatrixRow>[]>(
    () => [
      {
        id: "module",
        header: () => <span>Modul / Yetki</span>,
        cell: ({ row }) => {
          const standard = row.original.permissions.filter((item) => item.permissionType !== "special")
          const allStandardChecked =
            standard.length > 0 && standard.every((permission) => value[permission.id] === true)

          return (
            <div className="space-y-2">
              <p className="font-medium text-slate-800">{row.original.moduleName}</p>
              <label className="inline-flex items-center gap-2 text-xs text-slate-600">
                <Checkbox
                  disabled={readOnly}
                  checked={allStandardChecked}
                  onCheckedChange={(checked: boolean | "indeterminate") =>
                    toggleModuleStandardPermissions(standard, checked === true)
                  }
                />
                Tum standart yetkileri sec
              </label>
            </div>
          )
        },
      },
      {
        id: "read",
        header: () => <span>Listele</span>,
        cell: ({ row }) => {
          const permission = row.original.permissions.find((item) => item.permissionType === "read")
          if (!permission) return <span className="text-slate-300">-</span>

          return (
            <Checkbox
              disabled={readOnly}
              checked={value[permission.id] === true}
              onCheckedChange={(checked: boolean | "indeterminate") =>
                togglePermission(permission.id, checked === true)
              }
            />
          )
        },
      },
      {
        id: "create",
        header: () => <span>Olustur</span>,
        cell: ({ row }) => {
          const permission = row.original.permissions.find((item) => item.permissionType === "create")
          if (!permission) return <span className="text-slate-300">-</span>

          return (
            <Checkbox
              disabled={readOnly}
              checked={value[permission.id] === true}
              onCheckedChange={(checked: boolean | "indeterminate") =>
                togglePermission(permission.id, checked === true)
              }
            />
          )
        },
      },
      {
        id: "update",
        header: () => <span>Guncelle</span>,
        cell: ({ row }) => {
          const permission = row.original.permissions.find((item) => item.permissionType === "update")
          if (!permission) return <span className="text-slate-300">-</span>

          return (
            <Checkbox
              disabled={readOnly}
              checked={value[permission.id] === true}
              onCheckedChange={(checked: boolean | "indeterminate") =>
                togglePermission(permission.id, checked === true)
              }
            />
          )
        },
      },
      {
        id: "delete",
        header: () => <span>Sil</span>,
        cell: ({ row }) => {
          const permission = row.original.permissions.find((item) => item.permissionType === "delete")
          if (!permission) return <span className="text-slate-300">-</span>

          return (
            <Checkbox
              disabled={readOnly}
              checked={value[permission.id] === true}
              onCheckedChange={(checked: boolean | "indeterminate") =>
                togglePermission(permission.id, checked === true)
              }
            />
          )
        },
      },
      {
        id: "special",
        header: () => <span>Ozel Yetkiler</span>,
        cell: ({ row }) => {
          const specials = row.original.permissions.filter((item) => item.permissionType === "special")
          if (specials.length === 0) return <span className="text-slate-300">-</span>

          return (
            <div className="space-y-2">
              {specials.map((permission) => (
                <label key={permission.id} className="flex items-center gap-2 text-xs text-slate-700">
                  <Checkbox
                    disabled={readOnly}
                    checked={value[permission.id] === true}
                    onCheckedChange={(checked: boolean | "indeterminate") =>
                      togglePermission(permission.id, checked === true)
                    }
                  />
                  {permission.label}
                </label>
              ))}
            </div>
          )
        },
      },
    ],
    [readOnly, value],
  )

  return (
    <ScrollArea className="h-[52vh] rounded-xl border border-slate-200">
      <div className="min-w-[980px] p-3">
        {categories.map((category) => {
          const isOpen = openCategories[category.id] ?? true
          const modules = grouped.get(category.id) ?? []
          return (
            <div key={category.id} className="mb-4 rounded-xl border border-slate-200">
              <button
                type="button"
                className="flex w-full items-center justify-between bg-slate-50 px-3 py-2 text-left text-sm font-semibold text-slate-800"
                onClick={() => setOpenCategories((prev) => ({ ...prev, [category.id]: !isOpen }))}
              >
                <span>{category.name}</span>
                {isOpen ? <ChevronDown className="size-4" /> : <ChevronRight className="size-4" />}
              </button>

              {isOpen && (
                <div className="p-3">
                  <DataTable
                    data={modules as MatrixRow[]}
                    columns={columns}
                    showToolbar={false}
                    enablePagination={false}
                    enableSorting={false}
                    className="rounded-xl border border-slate-200"
                  />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </ScrollArea>
  )
}
