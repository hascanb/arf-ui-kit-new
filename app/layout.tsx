import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import '@/styles/globals.css'

const fontSans = Inter({ 
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontMono = JetBrains_Mono({ 
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: 'Kargo Otomasyon Sistemi',
  description: 'Profesyonel Kargo Yönetim ve Takip Sistemi',
  generator: 'v0.app',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="tr">
      <body className={`${fontSans.variable} ${fontMono.variable} antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
