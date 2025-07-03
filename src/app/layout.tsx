import './globals.css'
import { Inter } from 'next/font/google'

import ErrorBoundary from '../components/ErrorBoundary'
import { Providers } from '../lib/providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'RepOrder Dashboard',
  description: 'RepOrder - Professional sales rep and inventory management platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ErrorBoundary>
          <Providers>{children}</Providers>
        </ErrorBoundary>
      </body>
    </html>
  )
} 