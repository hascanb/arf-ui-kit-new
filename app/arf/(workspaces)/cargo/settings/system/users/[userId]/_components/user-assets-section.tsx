import { Package, Smartphone, Truck } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { UserDetail } from "../../_types"
import type { UserRole } from "../../_types/user"

const ASSET_ROLES: UserRole[] = ["courier", "branch_manager", "tm_manager"]

interface Props {
  user: UserDetail
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("tr-TR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  })
}

export function UserAssetsSection({ user }: Props) {
  const hasAssetRole = ASSET_ROLES.includes(user.role as UserRole)

  if (!hasAssetRole) {
    return (
      <Card className="rounded-2xl border-slate-200 shadow-sm">
        <CardContent className="flex items-center justify-center py-10 text-sm text-slate-400">
          <div className="flex flex-col items-center gap-2">
            <Package className="size-8 text-slate-300" />
            Bu rol için zimmet bilgisi bulunmamaktadır.
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!user.asset) {
    return (
      <Card className="rounded-2xl border-slate-200 shadow-sm">
        <CardContent className="flex items-center justify-center py-10 text-sm text-slate-400">
          <div className="flex flex-col items-center gap-2">
            <Package className="size-8 text-slate-300" />
            Henüz zimmet kaydı oluşturulmamış.
          </div>
        </CardContent>
      </Card>
    )
  }

  const { asset } = user

  return (
    <div className="space-y-4">
      {asset.vehiclePlate && (
        <Card className="rounded-2xl border-slate-200 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold text-slate-800">
              <Truck className="size-4" />
              Araç Zimmeti
            </CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                <dt className="text-xs text-slate-500">Plaka</dt>
                <dd className="font-mono text-sm font-semibold text-slate-900">
                  {asset.vehiclePlate}
                </dd>
              </div>
              {asset.assignedTerritory && (
                <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                  <dt className="text-xs text-slate-500">Zimmetli Bölge</dt>
                  <dd className="text-sm font-medium text-slate-900">{asset.assignedTerritory}</dd>
                </div>
              )}
              <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                <dt className="text-xs text-slate-500">Zimmeti Veren</dt>
                <dd className="text-sm font-medium text-slate-900">{asset.assignedByName}</dd>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                <dt className="text-xs text-slate-500">Zimmet Tarihi</dt>
                <dd className="text-sm font-medium text-slate-900">
                  {formatDate(asset.assignedAt)}
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      )}

      {asset.deviceId && (
        <Card className="rounded-2xl border-slate-200 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold text-slate-800">
              <Smartphone className="size-4" />
              Cihaz Zimmeti
            </CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                <dt className="text-xs text-slate-500">Cihaz ID</dt>
                <dd className="font-mono text-sm font-medium text-slate-900">{asset.deviceId}</dd>
              </div>
              {asset.deviceSerialNumber && (
                <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                  <dt className="text-xs text-slate-500">Seri Numarası</dt>
                  <dd className="font-mono text-sm font-medium text-slate-900">
                    {asset.deviceSerialNumber}
                  </dd>
                </div>
              )}
            </dl>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
