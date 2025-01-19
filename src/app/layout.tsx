import '@/styles/globals.css'
import { Inter } from 'next/font/google'
import type { Metadata } from 'next'
import dynamic from 'next/dynamic'

const Header = dynamic(() => import('@/components/Header'), { ssr: true })

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'App-Nest - Web Development Excellence',
  description: 'Crafting Digital Experiences with Modern Web Development',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} min-h-screen bg-[var(--primary)] text-[var(--text-primary)]`}>
        <Header />
        {children}
      </body>
    </html>
  )
}
