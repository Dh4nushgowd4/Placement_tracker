import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'Placement Tracker Pro | Dhanush Gowda G',
  description: 'Track your job applications, monitor your placement journey, and analyze your success rate with Placement Tracker Pro — built for Dhanush Gowda G.',
  keywords: ['placement tracker', 'job application tracker', 'career tracker', 'job hunt', 'interview tracker'],
  authors: [{ name: 'Dhanush Gowda G', url: 'mailto:dh4nushgowd4@gmail.com' }],
  openGraph: {
    title: 'Placement Tracker Pro',
    description: 'Track your entire placement journey in one place.',
    type: 'website',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#6366f1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`dark ${inter.variable}`}>
      <body className="min-h-screen antialiased font-sans">
        <div className="mesh-bg" />
        {children}
      </body>
    </html>
  )
}
