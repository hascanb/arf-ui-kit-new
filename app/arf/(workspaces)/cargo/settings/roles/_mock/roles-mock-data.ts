// TODO: Remove when API is ready

import type { RoleDetail, RolePermissions, RoleRecord, RoleStatus } from "../_types"
import { SYSTEM_ROLE_IDS } from "../_types"
import { mockPermissionDefinitions } from "./permissions-mock-data"

const now = new Date()
const daysAgo = (n: number) => new Date(now.valueOf() - n * 86_400_000).toISOString()

let mockRoles: RoleRecord[] = [
  {
    id: "superadmin",
    name: "Super Admin",
    description: "Tum sistem yetkilerine sahip cekirdek rol",
    roleType: "system",
    status: "active",
    userCount: 3,
    createdAt: daysAgo(300),
    updatedAt: daysAgo(3),
    updatedBy: "Sistem",
  },
  {
    id: "system_admin",
    name: "Sistem Yoneticisi",
    description: "Sistem konfigurasyonlari ve ayarlarin yonetimi",
    roleType: "system",
    status: "active",
    userCount: 7,
    createdAt: daysAgo(260),
    updatedAt: daysAgo(5),
    updatedBy: "Sistem",
  },
  {
    id: "hq_manager",
    name: "Merkez Operasyon Yoneticisi",
    description: "Merkez operasyon ve rapor yonetimi",
    roleType: "system",
    status: "active",
    userCount: 12,
    createdAt: daysAgo(220),
    updatedAt: daysAgo(8),
    updatedBy: "Sistem",
  },
  {
    id: "role_branch_manager",
    name: "Sube Yoneticisi",
    description: "Sube operasyon sorumlusu",
    roleType: "custom",
    status: "active",
    userCount: 45,
    createdAt: daysAgo(120),
    updatedAt: daysAgo(1),
    updatedBy: "Ayse Demir",
  },
  {
    id: "role_courier",
    name: "Kurye",
    description: "Dagitim ve teslimat operasyonlari",
    roleType: "custom",
    status: "passive",
    userCount: 0,
    createdAt: daysAgo(90),
    updatedAt: daysAgo(4),
    updatedBy: "Mert Can",
  },
]

function allGranted(): RolePermissions {
  return Object.fromEntries(mockPermissionDefinitions.map((permission) => [permission.id, true]))
}

function basicGranted(): RolePermissions {
  return Object.fromEntries(
    mockPermissionDefinitions.map((permission) => [
      permission.id,
      permission.permissionType === "read" || permission.permissionType === "create",
    ]),
  )
}

let mockRolePermissions: Record<string, RolePermissions> = {
  superadmin: allGranted(),
  system_admin: allGranted(),
  hq_manager: {
    ...allGranted(),
    "finance.delete": false,
  },
  role_branch_manager: {
    ...basicGranted(),
    "cargo.update": true,
    "route.update": true,
    "users.update": true,
  },
  role_courier: {
    ...basicGranted(),
    "cargo.create": false,
    "cargo.update": false,
    "cargo.delete": false,
    "users.read": false,
    "roles.read": false,
  },
}

export function getStoredRoles(): RoleRecord[] {
  return [...mockRoles].sort((a, b) => b.userCount - a.userCount)
}

export function getStoredRoleById(id: string): RoleDetail | undefined {
  const role = mockRoles.find((item) => item.id === id)
  if (!role) return undefined
  return {
    ...role,
    permissions: { ...(mockRolePermissions[id] ?? {}) },
  }
}

export function insertStoredRole(input: {
  name: string
  description?: string
  updatedBy: string
  sourceRoleId?: string
  permissions?: RolePermissions
}): RoleDetail {
  const ts = new Date().toISOString()
  const id = `role_${Math.random().toString(36).slice(2, 10)}`
  const source = input.sourceRoleId ? mockRolePermissions[input.sourceRoleId] : undefined

  const role: RoleRecord = {
    id,
    name: input.name,
    description: input.description,
    roleType: "custom",
    status: "active",
    userCount: 0,
    createdAt: ts,
    updatedAt: ts,
    updatedBy: input.updatedBy,
  }

  mockRoles = [role, ...mockRoles]
  mockRolePermissions[id] = input.permissions ? { ...input.permissions } : { ...(source ?? basicGranted()) }

  return { ...role, permissions: { ...mockRolePermissions[id] } }
}

export function updateStoredRole(
  roleId: string,
  payload: { name?: string; description?: string; status?: RoleStatus; updatedBy: string },
): RoleRecord | undefined {
  const index = mockRoles.findIndex((item) => item.id === roleId)
  if (index < 0) return undefined

  const current = mockRoles[index]
  const next: RoleRecord = {
    ...current,
    name: payload.name ?? current.name,
    description: payload.description ?? current.description,
    status: payload.status ?? current.status,
    updatedAt: new Date().toISOString(),
    updatedBy: payload.updatedBy,
  }
  mockRoles[index] = next
  return next
}

export function setStoredRolePermissions(roleId: string, permissions: RolePermissions): RoleDetail | undefined {
  const role = mockRoles.find((item) => item.id === roleId)
  if (!role) return undefined
  mockRolePermissions[roleId] = { ...permissions }

  const updated = updateStoredRole(roleId, { updatedBy: "UI Operator" })
  if (!updated) return undefined

  return {
    ...updated,
    permissions: { ...mockRolePermissions[roleId] },
  }
}

export function copyStoredRole(roleId: string, newRoleName: string, updatedBy: string): RoleDetail | undefined {
  const source = getStoredRoleById(roleId)
  if (!source) return undefined

  return insertStoredRole({
    name: newRoleName,
    description: `${source.name} rolunden kopyalandi`,
    updatedBy,
    sourceRoleId: roleId,
  })
}

export function setStoredRoleStatus(roleId: string, status: RoleStatus, updatedBy: string): RoleRecord | undefined {
  return updateStoredRole(roleId, { status, updatedBy })
}

export function deleteStoredRole(roleId: string): { ok: boolean; reason?: string } {
  const role = mockRoles.find((item) => item.id === roleId)
  if (!role) return { ok: false, reason: "Rol bulunamadi." }

  if (SYSTEM_ROLE_IDS.includes(role.id as (typeof SYSTEM_ROLE_IDS)[number])) {
    return { ok: false, reason: "Sistem rolleri silinemez." }
  }

  if (role.userCount > 0 && role.status === "active") {
    return { ok: false, reason: "Bu role atanmis aktif kullanicilar var. Once pasife cekin." }
  }

  if (role.status === "active") {
    return { ok: false, reason: "Aktif rol dogrudan silinemez. Once pasife cekin." }
  }

  mockRoles = mockRoles.filter((item) => item.id !== roleId)
  delete mockRolePermissions[roleId]
  return { ok: true }
}
