"use client"

import Link from "next/link"
import { UserPlus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function ArfSignUpPage() {
  return (
    <main className="flex min-h-svh items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-md border-border/70 shadow-sm">
        <CardHeader className="space-y-2">
          <div className="inline-flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <UserPlus className="size-5" />
          </div>
          <CardTitle className="text-2xl">Kayıt Ol</CardTitle>
          <CardDescription>
            ARF çatısı altında yeni kullanıcı oluşturma akışı. Bu ekran temel form iskeletidir.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Ad Soyad</Label>
            <Input id="name" placeholder="Ad Soyad" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">E-posta</Label>
            <Input id="email" type="email" placeholder="ornek@arf.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Şifre</Label>
            <Input id="password" type="password" placeholder="••••••••" />
          </div>

          <Button className="w-full" type="button">
            Hesap Oluştur
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Hesabın var mı?{" "}
            <Link href="/arf/auth/signin" className="font-medium text-primary hover:underline">
              Giriş Yap
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  )
}
