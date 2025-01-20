import '@/styles/globals.css'
import { Inter } from 'next/font/google'
import type { Metadata } from 'next'
import dynamic from 'next/dynamic'

const Header = dynamic(() => import('@/components/Header'), { ssr: true })

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'App-Nest - Building the Future',
  description: 'App-Nest is a leading software development company specializing in web and mobile applications.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
          crossOrigin="anonymous"
        />
      </head>
      <body className={`${inter.className} min-h-screen bg-[var(--primary)] text-[var(--text-primary)]`}>
        <Header />
        {children}
      </body>
    </html>
  )
}
