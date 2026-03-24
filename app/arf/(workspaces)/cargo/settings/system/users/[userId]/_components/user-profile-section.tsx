import { Mail, MapPin, Phone, Shield, User } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { UserDetail } from "../../_types"
import { USER_ROLE_LABELS } from "../../_types"
import type { UserRole } from "../../_types/user"

interface Props {
  user: UserDetail
}

const ROLE_BADGE_CLASSES: Record<UserRole, string> = {
  superadmin: "bg-purple-100 text-purple-700 border-purple-200",
  hq_manager: "bg-blue-100 text-blue-700 border-blue-200",
  tm_manager: "bg-indigo-100 text-indigo-700 border-indigo-200",
  branch_manager: "bg-teal-100 text-teal-700 border-teal-200",
  courier: "bg-amber-100 text-amber-700 border-amber-200",
  operator: "bg-slate-100 text-slate-700 border-slate-200",
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

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("tr-TR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  })
}

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("tr-TR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export function UserProfileSection({ user }: Props) {
  return (
    <div className="space-y-4">
      {/* Kimlik bilgileri */}
      <Card className="rounded-2xl border-slate-200 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm font-semibold text-slate-800">
            <User className="size-4" />
            Kimlik Bilgileri
          </CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
              <dt className="text-xs text-slate-500">Ad Soyad</dt>
              <dd className="text-sm font-medium text-slate-900">
                {user.firstName} {user.lastName}
              </dd>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
              <dt className="text-xs text-slate-500">Durum</dt>
              <dd>
                <Badge
                  variant="outline"
                  className={`text-xs ${STATUS_CLASSES[user.status]}`}
                >
                  {STATUS_LABELS[user.status]}
                </Badge>
              </dd>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
              <dt className="text-xs text-slate-500">Son Giriş</dt>
              <dd className="text-sm font-medium text-slate-900">
                {user.lastLogin ? formatDateTime(user.lastLogin) : "—"}
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      {/* İletişim bilgileri */}
      <Card className="rounded-2xl border-slate-200 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm font-semibold text-slate-800">
            <Mail className="size-4" />
            İletişim Bilgileri
          </CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
              <dt className="flex items-center gap-1 text-xs text-slate-500">
                <Mail className="size-3" /> E-posta
              </dt>
              <dd className="text-sm font-medium text-slate-900">{user.email}</dd>
              {user.isTemporaryPassword && (
                <p className="mt-1 text-xs text-amber-600">Şifre aktivasyonu bekleniyor</p>
              )}
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
              <dt className="flex items-center gap-1 text-xs text-slate-500">
                <Phone className="size-3" /> Telefon
              </dt>
              <dd className="text-sm font-medium text-slate-900">{user.phoneNumber}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      {/* Rol ve birim */}
      <Card className="rounded-2xl border-slate-200 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm font-semibold text-slate-800">
            <Shield className="size-4" />
            Rol ve Birim
          </CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
              <dt className="text-xs text-slate-500">Rol</dt>
              <dd>
                <Badge
                  variant="outline"
                  className={`mt-1 text-xs ${ROLE_BADGE_CLASSES[user.role as UserRole]}`}
                >
                  {USER_ROLE_LABELS[user.role as UserRole]}
                </Badge>
              </dd>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
              <dt className="flex items-center gap-1 text-xs text-slate-500">
                <MapPin className="size-3" /> Bağlı Birim
              </dt>
              <dd className="text-sm font-medium text-slate-900">
                {user.locationName ?? "Genel Merkez / Tüm Sistem"}
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      {/* Meta bilgiler */}
      <Card className="rounded-2xl border-slate-200 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-slate-800">Sistem Bilgileri</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
              <dt className="text-xs text-slate-500">Kayıt Tarihi</dt>
              <dd className="text-sm font-medium text-slate-900">{formatDate(user.createdAt)}</dd>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
              <dt className="text-xs text-slate-500">Kaydeden</dt>
              <dd className="text-sm font-medium text-slate-900">{user.createdByName}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    </div>
  )
}
