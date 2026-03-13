import Link from "next/link"
import { ArrowRight, Bike, Boxes, Handshake, Package, Truck, Warehouse } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ARF_ROUTES } from "../_shared/routes"

type WorkspaceItem = {
  id: string
  title: string
  description: string
  href?: string
  status: "ready" | "soon"
  icon: React.ElementType
}

const workspaces: WorkspaceItem[] = [
  {
    id: "cargo",
    title: "Kargo",
    description: "Kargo kayıt, sorgulama, operasyon ve finans ekranlarına bu modülden giriş yapın.",
    href: ARF_ROUTES.cargo.root,
    status: "ready",
    icon: Package,
  },
  {
    id: "courier",
    title: "Kurye",
    description: "Şehir içi teslimat akışlarını ve kurye planlamasını yönetin.",
    status: "soon",
    icon: Bike,
  },
  {
    id: "logistics",
    title: "Lojistik",
    description: "Hat, transfer ve dağıtım planlamasını tek merkezden yönetin.",
    status: "soon",
    icon: Truck,
  },
  {
    id: "fleet",
    title: "Filo",
    description: "Araçlarınızı, sürücülerinizi ve operasyon uygunluklarını izleyin.",
    status: "soon",
    icon: Boxes,
  },
  {
    id: "warehouse",
    title: "Depo Yönetimi",
    description: "Depo stok, yerleşim ve sevkiyat hazırlık süreçlerini yönetin.",
    status: "soon",
    icon: Warehouse,
  },
  {
    id: "partner",
    title: "Partner",
    description: "Tedarikçi, bayi ve iş ortaklarıyla uçtan uca entegrasyon sağlayın.",
    status: "soon",
    icon: Handshake,
  },
]

export default function ArfWorkspacesPage() {
  return (
    <main className="min-h-svh bg-background px-6 py-10 md:px-10">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <header className="space-y-2">
          <p className="text-sm font-medium tracking-wide text-muted-foreground uppercase">ARF Platform</p>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">Workspace Seçimi</h1>
          <p className="max-w-3xl text-sm text-muted-foreground md:text-base">
            Kurumsal modülleri tek çatıdan yönetin. Hazır workspace alanlarına hemen geçiş yapabilir,
            yakında açılacak modülleri planlayabilirsiniz.
          </p>
        </header>

        <section className="grid gap-5 lg:grid-cols-3">
          {workspaces.map((workspace) => {
            const Icon = workspace.icon
            const isReady = workspace.status === "ready"

            return (
              <Card
                key={workspace.id}
                className={isReady ? "border-foreground/70 shadow-sm" : "border-border/80 opacity-95"}
              >
                <CardHeader className="space-y-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className={isReady ? "rounded-2xl bg-primary p-4 text-primary-foreground" : "rounded-2xl bg-muted p-4 text-muted-foreground"}>
                      <Icon className="size-6" />
                    </div>
                    <Badge variant={isReady ? "default" : "secondary"} className={isReady ? "bg-black text-white" : ""}>
                      {isReady ? "Hazır" : "Yakında"}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <CardTitle className="text-4xl">{workspace.title}</CardTitle>
                    <CardDescription className="text-base leading-relaxed">
                      {workspace.description}
                    </CardDescription>
                  </div>
                </CardHeader>

                <CardContent>
                  {isReady && workspace.href ? (
                    <Button asChild className="w-full justify-between">
                      <Link href={workspace.href}>
                        Workspace&apos;e Git
                        <ArrowRight className="size-4" />
                      </Link>
                    </Button>
                  ) : (
                    <Button disabled className="w-full" variant="outline">
                      Yakında
                    </Button>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </section>
      </div>
    </main>
  )
}
