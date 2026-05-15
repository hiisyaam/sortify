import type { Metadata, Viewport } from 'next'
import { Unbounded, Space_Grotesk, Fira_Code } from 'next/font/google'
import { AppProvider } from '@/lib/app-context'
import { NetworkStatus } from '@/components/network-status'
import { InstallPrompt } from '@/components/install-prompt'
import './globals.css'

const unbounded = Unbounded({
  subsets: ["latin"],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-unbounded',
  display: 'swap',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-space-grotesk',
  display: 'swap',
})

const firaCode = Fira_Code({
  subsets: ["latin"],
  variable: '--font-fira-code',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Sortify - Belajar Sorting Algorithm',
  description: 'Game pembelajaran untuk memahami algoritma sorting dengan cara yang menyenangkan',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Sortify',
  },
  icons: {
    icon: [
      { url: '/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-icon.png' }
    ]
  }
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#00917A',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="id" className="bg-[#F5F4ED]">
      <body className={`${unbounded.variable} ${spaceGrotesk.variable} ${firaCode.variable} font-sans antialiased min-h-screen`}>
        <AppProvider>
          <NetworkStatus>
            <main className="max-w-[430px] mx-auto min-h-screen relative">
              {children}
              <InstallPrompt />
            </main>
          </NetworkStatus>
        </AppProvider>
      </body>
    </html>
  )
}
