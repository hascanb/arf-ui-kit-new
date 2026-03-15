import Link from 'next/link'
import { ArrowRight, FlaskConical, Truck } from 'lucide-react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { resolveEntryVisibilityPolicy } from './_shared/entry-policy'
import { ARF_ROUTES } from './arf/_shared/routes'

export default function EntrySelectionPage() {
  const visibility = resolveEntryVisibilityPolicy()

  return (
    <main className="min-h-svh bg-linear-to-br from-slate-50 via-white to-emerald-50 p-6 md:p-10">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <header className="space-y-3">
          <p className="text-sm font-medium tracking-wide text-emerald-700 uppercase">ARF UI Kit Workspace</p>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
            Çalışma Alanını Seç
          </h1>
          <p className="max-w-3xl text-sm text-slate-600 md:text-base">
            Operasyon odaklı cargo paneline veya test ve dokümantasyon odaklı laboratuvar alanına
            buradan geçiş yapabilirsiniz.
          </p>
        </header>

        <section className="grid gap-5 md:grid-cols-2">
          {visibility.allowCargo && (
            <Card className="border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-900">
                  <Truck className="size-5 text-emerald-600" />
                  V1.0
                </CardTitle>
                <CardDescription>
                  Operasyonel akışlar: kargo, şube, müşteri, rapor ve finans yönetimi.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="list-disc space-y-1 pl-5 text-sm text-slate-600">
                  <li>Gerçek iş akışına uygun panel yapısı</li>
                  <li>Operasyon odaklı navigasyon</li>
                  <li>Kurumsal dashboard deneyimi</li>
                </ul>
                <Button asChild className="w-full justify-between bg-emerald-600 hover:bg-emerald-700">
                  <Link href={ARF_ROUTES.cargo.root}>
                    Cargo alanına gir
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}

          {visibility.allowTestHub && (
            <Card className="border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-900">
                  <FlaskConical className="size-5 text-sky-600" />
                  Test ve Docs Hub
                </CardTitle>
                <CardDescription>
                  Tüm kitler, galeriler, canlı test senaryoları ve dokümantasyon merkezi.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="list-disc space-y-1 pl-5 text-sm text-slate-600">
                  <li>Kit bazlı canlı örnekler</li>
                  <li>Form, datatable, file, auth ve error test ekranları</li>
                  <li>Gelişmiş docs ve doğrulama odaklı kurgu</li>
                </ul>
                <Button asChild variant="outline" className="w-full justify-between border-sky-300 text-sky-700 hover:bg-sky-50">
                  <Link href="/test">
                    Test alanına gir
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </section>
      </div>
    </main>
  )
}
