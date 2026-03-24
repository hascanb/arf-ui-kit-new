// TODO: Remove when API is ready

import type { PermissionDefinition } from "../_types"

export const mockPermissionDefinitions: PermissionDefinition[] = [
  { id: "cargo.read", moduleCategoryId: "operation", moduleName: "Kargo Yonetimi", moduleCode: "cargo", permissionType: "read", label: "Listele" },
  { id: "cargo.create", moduleCategoryId: "operation", moduleName: "Kargo Yonetimi", moduleCode: "cargo", permissionType: "create", label: "Olustur" },
  { id: "cargo.update", moduleCategoryId: "operation", moduleName: "Kargo Yonetimi", moduleCode: "cargo", permissionType: "update", label: "Guncelle" },
  { id: "cargo.delete", moduleCategoryId: "operation", moduleName: "Kargo Yonetimi", moduleCode: "cargo", permissionType: "delete", label: "Sil" },
  { id: "cargo.special.price", moduleCategoryId: "operation", moduleName: "Kargo Yonetimi", moduleCode: "cargo", permissionType: "special", label: "Kargo Fiyatini Degistirebilir" },
  { id: "cargo.special.cancel", moduleCategoryId: "operation", moduleName: "Kargo Yonetimi", moduleCode: "cargo", permissionType: "special", label: "Kargo Iptal Edebilir" },
  { id: "cargo.special.export", moduleCategoryId: "operation", moduleName: "Kargo Yonetimi", moduleCode: "cargo", permissionType: "special", label: "Excel Ciktisi Alabilir" },

  { id: "route.read", moduleCategoryId: "operation", moduleName: "Rota Planlama", moduleCode: "route", permissionType: "read", label: "Listele" },
  { id: "route.create", moduleCategoryId: "operation", moduleName: "Rota Planlama", moduleCode: "route", permissionType: "create", label: "Olustur" },
  { id: "route.update", moduleCategoryId: "operation", moduleName: "Rota Planlama", moduleCode: "route", permissionType: "update", label: "Guncelle" },
  { id: "route.delete", moduleCategoryId: "operation", moduleName: "Rota Planlama", moduleCode: "route", permissionType: "delete", label: "Sil" },
  { id: "route.special.close", moduleCategoryId: "operation", moduleName: "Rota Planlama", moduleCode: "route", permissionType: "special", label: "Sefer Kapatabilir" },

  { id: "finance.read", moduleCategoryId: "finance", moduleName: "Hakedis", moduleCode: "finance", permissionType: "read", label: "Listele" },
  { id: "finance.create", moduleCategoryId: "finance", moduleName: "Hakedis", moduleCode: "finance", permissionType: "create", label: "Olustur" },
  { id: "finance.update", moduleCategoryId: "finance", moduleName: "Hakedis", moduleCode: "finance", permissionType: "update", label: "Guncelle" },
  { id: "finance.delete", moduleCategoryId: "finance", moduleName: "Hakedis", moduleCode: "finance", permissionType: "delete", label: "Sil" },
  { id: "finance.special.approve", moduleCategoryId: "finance", moduleName: "Hakedis", moduleCode: "finance", permissionType: "special", label: "Hakedis Onaylayabilir" },
  { id: "finance.special.match", moduleCategoryId: "finance", moduleName: "Hakedis", moduleCode: "finance", permissionType: "special", label: "Manuel Banka Eslestirmesi Yapabilir" },

  { id: "logistics.read", moduleCategoryId: "logistics", moduleName: "Hat Planlama", moduleCode: "logistics", permissionType: "read", label: "Listele" },
  { id: "logistics.create", moduleCategoryId: "logistics", moduleName: "Hat Planlama", moduleCode: "logistics", permissionType: "create", label: "Olustur" },
  { id: "logistics.update", moduleCategoryId: "logistics", moduleName: "Hat Planlama", moduleCode: "logistics", permissionType: "update", label: "Guncelle" },
  { id: "logistics.delete", moduleCategoryId: "logistics", moduleName: "Hat Planlama", moduleCode: "logistics", permissionType: "delete", label: "Sil" },
  { id: "logistics.special.optimize", moduleCategoryId: "logistics", moduleName: "Hat Planlama", moduleCode: "logistics", permissionType: "special", label: "Rota Optimizasyonu Yapabilir" },

  { id: "reports.read", moduleCategoryId: "reports", moduleName: "Raporlar", moduleCode: "reports", permissionType: "read", label: "Listele" },
  { id: "reports.create", moduleCategoryId: "reports", moduleName: "Raporlar", moduleCode: "reports", permissionType: "create", label: "Olustur" },
  { id: "reports.update", moduleCategoryId: "reports", moduleName: "Raporlar", moduleCode: "reports", permissionType: "update", label: "Guncelle" },
  { id: "reports.delete", moduleCategoryId: "reports", moduleName: "Raporlar", moduleCode: "reports", permissionType: "delete", label: "Sil" },
  { id: "reports.special.finance", moduleCategoryId: "reports", moduleName: "Raporlar", moduleCode: "reports", permissionType: "special", label: "Finansal Raporlari Gorebilir" },
  { id: "reports.special.all", moduleCategoryId: "reports", moduleName: "Raporlar", moduleCode: "reports", permissionType: "special", label: "Tum Sistem Raporlarini Gorebilir" },

  { id: "users.read", moduleCategoryId: "hr", moduleName: "Kullanici Yonetimi", moduleCode: "users", permissionType: "read", label: "Listele" },
  { id: "users.create", moduleCategoryId: "hr", moduleName: "Kullanici Yonetimi", moduleCode: "users", permissionType: "create", label: "Olustur" },
  { id: "users.update", moduleCategoryId: "hr", moduleName: "Kullanici Yonetimi", moduleCode: "users", permissionType: "update", label: "Guncelle" },
  { id: "users.delete", moduleCategoryId: "hr", moduleName: "Kullanici Yonetimi", moduleCode: "users", permissionType: "delete", label: "Sil" },
  { id: "roles.read", moduleCategoryId: "hr", moduleName: "Rol Yonetimi", moduleCode: "roles", permissionType: "read", label: "Listele" },
  { id: "roles.create", moduleCategoryId: "hr", moduleName: "Rol Yonetimi", moduleCode: "roles", permissionType: "create", label: "Olustur" },
  { id: "roles.update", moduleCategoryId: "hr", moduleName: "Rol Yonetimi", moduleCode: "roles", permissionType: "update", label: "Guncelle" },
  { id: "roles.delete", moduleCategoryId: "hr", moduleName: "Rol Yonetimi", moduleCode: "roles", permissionType: "delete", label: "Sil" },
]
