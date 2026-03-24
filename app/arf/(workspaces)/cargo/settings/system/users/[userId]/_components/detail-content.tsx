"use client"

import { useState } from "react"
import { AppHeader } from "@hascanb/arf-ui-kit/layout-kit"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  deactivateUser,
  reactivateUser,
  suspendUser,
} from "../../_api/users-api"
import type { UserDetail } from "../../_types"
import { USER_ROLE_LABELS } from "../../_types"
import type { UserRole } from "../../_types/user"
import { UserAssetsSection } from "./user-assets-section"
import { UserAuditTrailSection } from "./user-audit-trail-section"
import { UserProfileSection } from "./user-profile-section"

interface Props {
  initialUser: UserDetail
}

const STATUS_LABELS: Record<UserDetail["status"], string> = {
  active: "Aktif",
  passive: "Pasif",
  suspended: "Askıda",
}

const STATUS_CLASSES: Record<UserDetail["status"], string> = {
  active: "bg-emerald-100 text-emerald-700 border-emerald-200",
  passive: "bg-slate-100 text-slate-600 border-slate-200",
  suspended: "bg-red-100 text-red-700 border-red-200",
}

function getInitials(firstName: string, lastName: string) {
  return `${firstName[0] ?? ""}${lastName[0] ?? ""}`.toUpperCase()
}

export function DetailContent({ initialUser }: Props) {
  const [user, setUser] = useState<UserDetail>(initialUser)
  const [isActioning, setIsActioning] = useState(false)

  async function handleSuspend() {
    if (!window.confirm(`${user.firstName} ${user.lastName} adlı kullanıcı askıya alınacak. Onaylıyor musunuz?`)) return
    setIsActioning(true)
    try {
      const updated = await suspendUser(user.id)
      if (updated) setUser({ ...user, ...updated })
    } finally {
      setIsActioning(false)
    }
  }

  async function handleReactivate() {
    if (!window.confirm(`${user.firstName} ${user.lastName} adlı kullanıcı yeniden aktifleştirilecek. Onaylıyor musunuz?`)) return
    setIsActioning(true)
    try {
      const updated = await reactivateUser(user.id)
      if (updated) setUser({ ...user, ...updated })
    } finally {
      setIsActioning(false)
    }
  }

  async function handleDeactivate() {
    if (!window.confirm(`${user.firstName} ${user.lastName} adlı kullanıcı pasife alınacak. Bu işlem geri alınabilir. Onaylıyor musunuz?`)) return
    setIsActioning(true)
    try {
      const updated = await deactivateUser(user.id)
      if (updated) setUser({ ...user, ...updated })
    } finally {
      setIsActioning(false)
    }
  }

  return (
    <>
      <AppHeader
        breadcrumbs={[
          { label: "Ana Sayfa", href: "/" },
          { label: "Ayarlar", href: "/arf/cargo/settings/system" },
          { label: "Kullanıcılar", href: "/arf/cargo/settings/system/users" },
          { label: `${user.firstName} ${user.lastName}` },
        ]}
      />

      <div className="flex flex-1 flex-col gap-4 bg-slate-50 p-4 pt-0">
        {/* Başlık kartı */}
        <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center">
          {/* Avatar */}
          <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-slate-900 text-lg font-semibold text-white">
            {getInitials(user.firstName, user.lastName)}
          </div>

          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-semibold text-slate-900">
                {user.firstName} {user.lastName}
              </h2>
              <Badge
                variant="outline"
                className={`text-xs ${STATUS_CLASSES[user.status]}`}
              >
                {STATUS_LABELS[user.status]}
              </Badge>
              {user.isTemporaryPassword && (
                <Badge variant="outline" className="bg-amber-50 text-xs text-amber-700 border-amber-200">
                  Şifre aktivasyonu bekleniyor
                </Badge>
              )}
            </div>
            <p className="mt-0.5 text-sm text-slate-500">
              {USER_ROLE_LABELS[user.role as UserRole]} •{" "}
              {user.locationName ?? "Genel Merkez"}
            </p>
            <p className="text-xs text-slate-400">{user.email}</p>
          </div>

          {/* Aksiyon butonları */}
          <div className="flex shrink-0 flex-wrap gap-2">
            {user.status === "active" && (
              <>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={isActioning}
                  onClick={() => void handleSuspend()}
                  className="text-amber-700 hover:bg-amber-50 hover:text-amber-800"
                >
                  Askıya Al
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={isActioning}
                  onClick={() => void handleDeactivate()}
                  className="text-slate-600"
                >
                  Pasife Al
                </Button>
              </>
            )}
            {(user.status === "suspended" || user.status === "passive") && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={isActioning}
                onClick={() => void handleReactivate()}
                className="text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800"
              >
                Aktifleştir
              </Button>
            )}
          </div>
        </div>

        {/* Tab'lar */}
        <Tabs defaultValue="profile" className="space-y-4">
          <TabsList className="grid h-10 w-full grid-cols-3 rounded-xl border border-slate-200 bg-slate-100 p-0.5">
            <TabsTrigger value="profile" className="text-xs">
              Profil Bilgileri
            </TabsTrigger>
            <TabsTrigger value="assets" className="text-xs">
              Zimmet
            </TabsTrigger>
            <TabsTrigger value="audit" className="text-xs">
              İşlem Geçmişi
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <UserProfileSection user={user} />
          </TabsContent>

          <TabsContent value="assets">
            <UserAssetsSection user={user} />
          </TabsContent>

          <TabsContent value="audit">
            <UserAuditTrailSection auditLogs={user.auditLogs} />
          </TabsContent>
        </Tabs>
      </div>
    </>
  )
}
