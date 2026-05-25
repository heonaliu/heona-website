import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/context/ThemeContext'
import { AuthProvider } from '@/context/AuthContext'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import LoadingScreen from '@/components/LoadingScreen'
import CursorGlow from '@/components/CursorGlow'
import ScrollProgress from '@/components/ScrollProgress'
import CommandPalette from '@/components/CommandPalette'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Heona Liu — Developer, Artist, Builder',
    template: '%s | Heona Liu',
  },
  description: 'A minimal digital space showcasing engineering, creativity, and personal growth.',
  keywords: ['developer', 'artist', 'portfolio', 'Next.js', 'React', 'digital art', 'software engineer'],
  authors: [{ name: 'Heona Liu' }],
  creator: 'Heona Liu',
  metadataBase: new URL('https://heonaliu.com'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://heonaliu.com',
    title: 'Heona Liu — Developer, Artist, Builder',
    description: 'A minimal digital space showcasing engineering, creativity, and personal growth.',
    siteName: 'Heona Liu',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Heona Liu — Developer, Artist, Builder',
    description: 'A minimal digital space showcasing engineering, creativity, and personal growth.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${jetbrainsMono.variable} antialiased`}>
        <ThemeProvider>
          <AuthProvider>
            <div className="grain" aria-hidden="true" />
            <LoadingScreen />
            <CursorGlow />
            <ScrollProgress />
            <CommandPalette />
            <Navbar />
            <main className="min-h-screen page-transition">
              {children}
            </main>
            <Footer />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
