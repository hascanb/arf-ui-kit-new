/**
 * Feedback-Kit Test ve Dokumantasyon Sayfasi.
 *
 * Bu sayfa, toast bildirim sisteminin temel ve gelismis kullanimlarini
 * tek yerde gosterir. Ornekler, API ozetleri ve erisilebilirlik notlari
 * tamamen test amaclidir.
 *
 * Not: Tum aciklamalar Turkce tutulmustur ve emoji tabanli basliklar
 * kullanilmamistir.
 */

'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { FeedbackProvider, useFeedback } from '@arftech/arfweb-shared-lib/feedback-kit'
import { 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Info,
  Loader2,
  MessageSquare,
  Settings,
  Code,
  Sparkles,
  Upload,
  Download,
  Trash2,
  Save,
  Send,
  RefreshCw,
  Bell
} from 'lucide-react'
import { toast } from 'sonner'

type ToastPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right'

export default function FeedbackKitTest() {
  return (
    <FeedbackProvider renderToaster={false}>
      <FeedbackKitTestContent />
    </FeedbackProvider>
  )
}

function FeedbackKitTestContent() {
  const feedback = useFeedback()
  
  const [customMessage, setCustomMessage] = useState('Ozel toast mesaji')
  const [customDuration, setCustomDuration] = useState('4000')
  const [customPosition, setCustomPosition] = useState<ToastPosition>('bottom-right')

  // Demo functions
  const simulateSuccess = () => {
    feedback.success('Islem basariyla tamamlandi!', 'Degisiklikleriniz kaydedildi.')
  }

  const simulateError = () => {
    feedback.error('Bir hata olustu', 'Lutfen tekrar deneyin veya destek ile iletisime gecin.')
  }

  const simulateWarning = () => {
    feedback.warning('Disk alani azaliyor', 'Kullanilmayan dosyalari silmeyi dusunebilirsiniz.')
  }

  const simulateInfo = () => {
    feedback.info('Yeni guncelleme mevcut', '2.0.0 surumu kuruluma hazir.')
  }

  const simulateLoading = () => {
    const id = toast.loading('Isteginiz isleniyor...')
    
    setTimeout(() => {
      toast.success('Istek islendi!', { id })
    }, 3000)
  }

  const simulatePromise = () => {
    const promise = new Promise((resolve, reject) => {
      setTimeout(() => {
        Math.random() > 0.5 ? resolve('Success!') : reject('Failed!')
      }, 2000)
    })

    toast.promise(promise, {
      loading: 'Dosya yukleniyor...',
      success: (data) => `Dosya yuklendi: ${data}`,
      error: (err) => `Yukleme basarisiz: ${err}`
    })
  }

  const simulateLongDuration = () => {
    feedback.info('Bu mesaj 10 saniye gorunur', 'Onemli bilgilendirmeler icin uygundur')
  }

  const simulateWithAction = () => {
    toast.error('Dosya silinemedi', {
      action: {
        label: 'Geri Al',
        onClick: () => feedback.success('Dosya geri yuklendi!')
      }
    })
  }

  const simulateRichContent = () => {
    toast.custom((t) => (
      <div className="flex items-center gap-3 p-4 bg-linear-to-r from-purple-500 to-pink-500 text-white rounded-lg shadow-lg">
        <Sparkles className="h-5 w-5" />
        <div>
          <p className="font-semibold">Premium Ozellik Acildi!</p>
          <p className="text-sm opacity-90">Artik gelismis analizlere erisebilirsiniz</p>
        </div>
      </div>
    ))
  }

  const showCustomToast = () => {
    const parsedDuration = Number.parseInt(customDuration, 10)
    const duration = Number.isFinite(parsedDuration) && parsedDuration > 0 ? parsedDuration : 4000

    toast.info(customMessage || 'Ozel toast mesaji', {
      description: 'Bu ozel bir toast mesajidir',
      duration,
      position: customPosition,
    })
  }

  // Practical examples
  const examples = [
    {
      title: 'Form Gonderimi',
      icon: Send,
      action: () => {
        const promise = new Promise((resolve) => setTimeout(resolve, 2000))
        toast.promise(promise, {
          loading: 'Form gonderiliyor...',
          success: 'Form basariyla gonderildi!',
          error: 'Gonderim basarisiz oldu'
        })
      }
    },
    {
      title: 'Dosya Yukleme',
      icon: Upload,
      action: () => {
        const id = toast.loading('Dosya yukleniyor...')
        setTimeout(() => {
          toast.success('Dosya basariyla yuklendi!', { id })
        }, 2500)
      }
    },
    {
      title: 'Dosya Indirme',
      icon: Download,
      action: () => {
        feedback.info('Indirme hazirlaniyor...')
        setTimeout(() => {
          feedback.success('Indirme basladi!', 'Indirilenler klasorunu kontrol edin')
        }, 2000)
      }
    },
    {
      title: 'Silme ve Geri Alma',
      icon: Trash2,
      action: () => {
        toast.warning('Oge silindi', {
          action: {
            label: 'Geri Al',
            onClick: () => feedback.success('Oge geri yüklendi!')
          }
        })
      }
    },
    {
      title: 'Otomatik Kaydetme',
      icon: Save,
      action: () => {
        feedback.success('Taslak kaydedildi')
      }
    },
    {
      title: 'Ag Hatasi',
      icon: RefreshCw,
      action: () => {
        toast.error('Baglanti koptu', {
          description: 'Lutfen internet baglantinizi kontrol edin',
          action: {
            label: 'Tekrar Dene',
            onClick: () => feedback.info('Tekrar deneniyor...')
          },
          duration: Infinity
        })
      }
    }
  ]

  const codeExamples = {
    basic: `import { useFeedback } from '@arftech/arfweb-shared-lib/feedback-kit'

function MyComponent() {
  const feedback = useFeedback()
  
  const handleClick = () => {
    feedback.success('Islem basarili!')
    feedback.error('Bir seyler ters gitti')
    feedback.warning('Dikkatli olun!')
    feedback.info('Bilgi: Yeni ozellik kullanima acildi')
  }
  
  return <button onClick={handleClick}>Toast Goster</button>
}`,
    
    withOptions: `// Aciklamali kullanim
feedback.success('Veriler kaydedildi!', 'Degisiklikleriniz yayinda')

// Aksiyon butonuyla kullanim (dogrudan toast)
toast.error('Silme islemi basarisiz', {
  action: {
    label: 'Geri Al',
    onClick: () => restoreItem()
  }
})

// Sure ile kullanim (dogrudan toast)
toast.info('Yeni mesaj', {
  duration: 5000
})`,
    
    promise: `// Otomatik yukleniyor -> basarili/hata gecisi
import { toast } from 'sonner'

const handleSubmit = async () => {
  const promise = submitForm(data)
  
  toast.promise(promise, {
    loading: 'Gonderiliyor...',
    success: (result) => \`ID ile gonderildi: \${result.id}\`,
    error: 'Gonderim basarisiz'
  })
}

// Yukleniyor toast'unu manuel kontrol et
const handleUpload = async () => {
  const toastId = toast.loading('Yukleniyor...')
  
  try {
    await uploadFile()
    toast.success('Yukleme tamamlandi!', { id: toastId })
  } catch (error) {
    toast.error('Yukleme basarisiz', { id: toastId })
  }
}`,
    
    advanced: `// JSX ile zengin icerik
toast.custom(
  <div className="flex items-center gap-3 p-4 bg-linear-to-r from-blue-500 to-purple-500 text-white rounded-lg">
    <Icon className="h-5 w-5" />
    <div>
      <p className="font-bold">Ozel Toast</p>
      <p className="text-sm">Zengin icerikle</p>
    </div>
  </div>
)

// Belirli bir toast'u kapat
const toastId = feedback.info('...')
feedback.dismiss(toastId)

// Tum toast'lari kapat
feedback.dismiss()`
  }

  return (
    <div className="container py-8 space-y-8 max-w-7xl px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 bg-primary/10 rounded-lg">
            <Bell className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Feedback-Kit</h1>
            <p className="text-muted-foreground text-lg">
              Toast ve Bildirim Sistemi
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-3">
          <Badge variant="default">Bildirim Sistemi</Badge>
          <Badge variant="outline">Toast Mesajlari</Badge>
          <Badge variant="outline">Promise Destegi</Badge>
          <Badge variant="outline">Erisilebilir</Badge>
        </div>
      </div>

      <Separator />

      {/* Genel Bakis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Genel Bakis
          </CardTitle>
          <CardDescription>
            Hafif ve esnek toast bildirim sistemi
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground leading-relaxed">
            Feedback-Kit, kullanıcılara işlem sonuçlarını bildirmek için tasarlanmış modern bir
            toast/snackbar sistemidir. Sonner kütüphanesi üzerine kurulmuş olup, TypeScript ile 
            tam tip güvenliği, erişilebilirlik özellikleri ve kolay özelleştirme sunar.
          </p>
          
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Mesaj Tipleri</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  Basari (yesil)
                </li>
                <li className="flex items-center gap-2">
                  <XCircle className="h-4 w-4 text-red-600" />
                  Hata (kirmizi)
                </li>
                <li className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  Uyari (sari)
                </li>
                <li className="flex items-center gap-2">
                  <Info className="h-4 w-4 text-blue-600" />
                  Bilgi (mavi)
                </li>
                <li className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4" />
                  Yukleniyor (spinner)
                </li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Ozellikler</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Ozel sure kontrolu</li>
                <li>• Konum secimi</li>
                <li>• Aksiyon butonlari (geri al, tekrar dene)</li>
                <li>• Promise tabanli bildirimler</li>
                <li>• Zengin JSX icerigi destegi</li>
                <li>• Otomatik kapatma ve manuel kontrol</li>
                <li>• Tema entegrasyonu</li>
                <li>• Tam erisilebilirlik</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Etkilesimli Demolar */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Temel Tipler */}
        <Card>
          <CardHeader>
            <CardTitle>Temel Mesaj Tipleri</CardTitle>
            <CardDescription>
              Standart toast bildirimleri
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button 
              onClick={simulateSuccess} 
              className="w-full justify-start"
              variant="outline"
            >
              <CheckCircle2 className="h-4 w-4 mr-2 text-green-600" />
              Basari Goster
            </Button>
            <Button 
              onClick={simulateError} 
              className="w-full justify-start"
              variant="outline"
            >
              <XCircle className="h-4 w-4 mr-2 text-red-600" />
              Hata Goster
            </Button>
            <Button 
              onClick={simulateWarning} 
              className="w-full justify-start"
              variant="outline"
            >
              <AlertTriangle className="h-4 w-4 mr-2 text-yellow-600" />
              Uyari Goster
            </Button>
            <Button 
              onClick={simulateInfo} 
              className="w-full justify-start"
              variant="outline"
            >
              <Info className="h-4 w-4 mr-2 text-blue-600" />
              Bilgi Goster
            </Button>
          </CardContent>
        </Card>

        {/* Gelismis Tipler */}
        <Card>
          <CardHeader>
            <CardTitle>Gelismis Ozellikler</CardTitle>
            <CardDescription>
              Yukleniyor, promise ve zengin icerik toast'lari
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button 
              onClick={simulateLoading} 
              className="w-full justify-start"
              variant="outline"
            >
              <Loader2 className="h-4 w-4 mr-2" />
              Yukleniyor Toast
            </Button>
            <Button 
              onClick={simulatePromise} 
              className="w-full justify-start"
              variant="outline"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Promise Tabanli Toast
            </Button>
            <Button 
              onClick={simulateRichContent} 
              className="w-full justify-start"
              variant="outline"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Zengin Icerikli Toast
            </Button>
            <Button 
              onClick={simulateWithAction} 
              className="w-full justify-start"
              variant="outline"
            >
              <Settings className="h-4 w-4 mr-2" />
              Aksiyonlu Toast
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Pratik Ornekler */}
      <Card>
        <CardHeader>
          <CardTitle>Pratik Kullanim Senaryolari</CardTitle>
          <CardDescription>
            Gercek dunya senaryolari ve kaliplari
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {examples.map((example) => {
              const Icon = example.icon
              return (
                <Button
                  key={example.title}
                  onClick={example.action}
                  variant="outline"
                  className="justify-start h-auto py-3"
                >
                  <Icon className="h-4 w-4 mr-2 shrink-0" />
                  <span className="text-sm">{example.title}</span>
                </Button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Ozel Toast Olusturucu */}
      <Card>
        <CardHeader>
          <CardTitle>Ozel Toast Olusturucu</CardTitle>
          <CardDescription>
            Ozel toast ayarlari olusturun ve test edin
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="message">Mesaj</Label>
              <Textarea
                id="message"
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                placeholder="Mesajinizi girin"
                rows={3}
              />
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="duration">Sure (ms)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={customDuration}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCustomDuration(e.target.value)}
                  placeholder="4000"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="position">Konum</Label>
                <Select value={customPosition} onValueChange={setCustomPosition}>
                  <SelectTrigger id="position">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="top-left">Ust Sol</SelectItem>
                    <SelectItem value="top-center">Ust Orta</SelectItem>
                    <SelectItem value="top-right">Ust Sag</SelectItem>
                    <SelectItem value="bottom-left">Alt Sol</SelectItem>
                    <SelectItem value="bottom-center">Alt Orta</SelectItem>
                    <SelectItem value="bottom-right">Alt Sag</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <Button onClick={showCustomToast} className="w-full">
            <Bell className="h-4 w-4 mr-2" />
            Ozel Toast Goster
          </Button>
        </CardContent>
      </Card>

      {/* Kod Ornekleri */}
      <Tabs defaultValue="basic" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic">Temel</TabsTrigger>
          <TabsTrigger value="options">Secenekli</TabsTrigger>
          <TabsTrigger value="promise">Promise</TabsTrigger>
          <TabsTrigger value="advanced">Gelismis</TabsTrigger>
        </TabsList>

        <TabsContent value="basic">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                Temel Kullanim
              </CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="p-4 rounded-lg bg-muted text-xs overflow-x-auto">
                <code>{codeExamples.basic}</code>
              </pre>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="options">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                Secenekli Kullanim
              </CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="p-4 rounded-lg bg-muted text-xs overflow-x-auto">
                <code>{codeExamples.withOptions}</code>
              </pre>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="promise">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                Promise Tabanli Bildirimler
              </CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="p-4 rounded-lg bg-muted text-xs overflow-x-auto">
                <code>{codeExamples.promise}</code>
              </pre>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                Gelismis Kaliplar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="p-4 rounded-lg bg-muted text-xs overflow-x-auto">
                <code>{codeExamples.advanced}</code>
              </pre>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* API Referansi */}
      <Card>
        <CardHeader>
          <CardTitle>API Referansi</CardTitle>
          <CardDescription>
            useFeedback hook'u icin tam API ozeti
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted">
                <tr>
                  <th className="text-left p-3 font-semibold">Metot</th>
                  <th className="text-left p-3 font-semibold">Parametreler</th>
                  <th className="text-left p-3 font-semibold">Aciklama</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <tr>
                  <td className="p-3 font-mono text-xs">success()</td>
                  <td className="p-3 font-mono text-xs">mesaj, secenekler?</td>
                  <td className="p-3 text-muted-foreground">Basari toast'i gosterir (yesil)</td>
                </tr>
                <tr>
                  <td className="p-3 font-mono text-xs">error()</td>
                  <td className="p-3 font-mono text-xs">mesaj, secenekler?</td>
                  <td className="p-3 text-muted-foreground">Hata toast'i gosterir (kirmizi)</td>
                </tr>
                <tr>
                  <td className="p-3 font-mono text-xs">warning()</td>
                  <td className="p-3 font-mono text-xs">mesaj, secenekler?</td>
                  <td className="p-3 text-muted-foreground">Uyari toast'i gosterir (sari)</td>
                </tr>
                <tr>
                  <td className="p-3 font-mono text-xs">info()</td>
                  <td className="p-3 font-mono text-xs">mesaj, secenekler?</td>
                  <td className="p-3 text-muted-foreground">Bilgi toast'i gosterir (mavi)</td>
                </tr>
                <tr>
                  <td className="p-3 font-mono text-xs">loading()</td>
                  <td className="p-3 font-mono text-xs">mesaj, secenekler?</td>
                  <td className="p-3 text-muted-foreground">Yukleniyor toast'i gosterir</td>
                </tr>
                <tr>
                  <td className="p-3 font-mono text-xs">promise()</td>
                  <td className="p-3 font-mono text-xs">promise, mesajlar</td>
                  <td className="p-3 text-muted-foreground">Promise durumlarini otomatik yonetir</td>
                </tr>
                <tr>
                  <td className="p-3 font-mono text-xs">dismiss()</td>
                  <td className="p-3 font-mono text-xs">toastId?</td>
                  <td className="p-3 text-muted-foreground">Toast(lar)i kapatir</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* En Iyi Uygulamalar */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-600">
              <CheckCircle2 className="h-5 w-5" />
              En Iyi Uygulamalar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                <span>Mesajlari kisa ve acik tutun (en fazla 2 satir)</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                <span>Dogru mesaj tipini secin (onem derecesine gore)</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                <span>Kritik hatalarda aksiyon butonu ekleyin (Tekrar Dene, Geri Al)</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                <span>Promise tabanli bildirimleri kullanin (asenkron islemler)</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                <span>Sureyi mesajin onemine gore ayarlayin</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <XCircle className="h-5 w-5" />
              Sik Yapilan Hatalar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <XCircle className="h-4 w-4 text-red-600 mt-0.5 shrink-0" />
                <span>Cok uzun mesajlar yazmayin (kaydirma gerektirir)</span>
              </li>
              <li className="flex items-start gap-2">
                <XCircle className="h-4 w-4 text-red-600 mt-0.5 shrink-0" />
                <span>Ayni islem icin birden fazla toast gostermeyin</span>
              </li>
              <li className="flex items-start gap-2">
                <XCircle className="h-4 w-4 text-red-600 mt-0.5 shrink-0" />
                <span>Onemsiz islemler icin toast kullanmayin</span>
              </li>
              <li className="flex items-start gap-2">
                <XCircle className="h-4 w-4 text-red-600 mt-0.5 shrink-0" />
                <span>Kapatilamayan toast'lar olusturmayin</span>
              </li>
              <li className="flex items-start gap-2">
                <XCircle className="h-4 w-4 text-red-600 mt-0.5 shrink-0" />
                <span>Yukleniyor toast'larini zamaninda kapatmayi unutmayin</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Erisilebilirlik Bilgisi */}
      <Card>
        <CardHeader>
          <CardTitle>Erisilebilirlik Ozellikleri</CardTitle>
          <CardDescription>
            Yerlesik erisilebilirlik destegi
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <h4 className="font-semibold text-sm mb-2">Ekran Okuyucu Destegi</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Duyurular icin ARIA live bolgeleri</li>
                <li>• Dogru role ve aria-label nitelikleri</li>
                <li>• Yeni toast'lari otomatik duyurma</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-2">Klavye Destegi</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Escape tusu ile kapatma</li>
                <li>• Tab ile aksiyon butonlarina gecis</li>
                <li>• Odak yonetimi</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
