import { AppHeader } from '@hascanb/arf-ui-kit/layout-kit'
import { Images } from 'lucide-react'

export default function CargoGalleryPage() {
  return (
    <>
      <AppHeader
        breadcrumbs={[
          { label: 'Ana Sayfa', href: '/' },
          { label: 'Galeri' },
        ]}
      />
      <div className='flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center'>
        <div className='flex size-16 items-center justify-center rounded-2xl border bg-muted/40'>
          <Images className='size-8 text-muted-foreground' />
        </div>
        <div>
          <h1 className='text-2xl font-bold tracking-tight'>Medya Galerisi</h1>
          <p className='mt-1 text-muted-foreground'>Bu bölüm geliştirme aşamasındadır.</p>
        </div>
      </div>
    </>
  )
}
