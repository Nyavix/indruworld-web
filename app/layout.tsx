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
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${delaGothic.variable} ${outfit.variable}`}>{children}</body>
    </html>
  )
}
