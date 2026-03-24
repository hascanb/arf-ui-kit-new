import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { RoleDetail } from "../../_types"

interface Props {
  role: RoleDetail
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString("tr-TR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export function RoleProfileSection({ role }: Props) {
  return (
    <Card className="rounded-2xl border-slate-200 shadow-sm">
      <CardHeader>
        <CardTitle>Rol Profili</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-slate-200 p-3">
          <p className="text-xs text-slate-500">Rol Adi</p>
          <p className="mt-1 font-semibold text-slate-800">{role.name}</p>
        </div>
        <div className="rounded-xl border border-slate-200 p-3">
          <p className="text-xs text-slate-500">Rol Tipi</p>
          <p className="mt-1 font-semibold text-slate-800">{role.roleType === "system" ? "Sistem" : "Ozel"}</p>
        </div>
        <div className="rounded-xl border border-slate-200 p-3">
          <p className="text-xs text-slate-500">Durum</p>
          <p className="mt-1 font-semibold text-slate-800">{role.status === "active" ? "Aktif" : "Pasif"}</p>
        </div>
        <div className="rounded-xl border border-slate-200 p-3">
          <p className="text-xs text-slate-500">Kullanici Sayisi</p>
          <p className="mt-1 font-semibold text-slate-800">{role.userCount}</p>
        </div>

        <div className="rounded-xl border border-slate-200 p-3 md:col-span-2 xl:col-span-2">
          <p className="text-xs text-slate-500">Aciklama</p>
          <p className="mt-1 text-sm text-slate-700">{role.description || "-"}</p>
        </div>
        <div className="rounded-xl border border-slate-200 p-3">
          <p className="text-xs text-slate-500">Olusturulma</p>
          <p className="mt-1 text-sm text-slate-700">{formatDate(role.createdAt)}</p>
        </div>
        <div className="rounded-xl border border-slate-200 p-3">
          <p className="text-xs text-slate-500">Son Guncelleme</p>
          <p className="mt-1 text-sm text-slate-700">{formatDate(role.updatedAt)}</p>
          <p className="text-xs text-slate-500">{role.updatedBy}</p>
        </div>
      </CardContent>
    </Card>
  )
}
