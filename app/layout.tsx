import type { Metadata } from 'next'
import { Dela_Gothic_One, Outfit } from 'next/font/google'
import './globals.css'

const delaGothic = Dela_Gothic_One({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-dela',
})

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
})

export const metadata: Metadata = {
  title: 'DRü — Presave',
  description: 'Presave "Trucks Broke Down" by DRü and get early access to everything.',
  icons: {
    icon: [
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', rel: 'shortcut icon' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180' },
    ],
  },
  appleWebApp: {
    title: 'In DRÜ World',
  },
  manifest: '/site.webmanifest',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${delaGothic.variable} ${outfit.variable}`}>{children}</body>
    </html>
  )
}
