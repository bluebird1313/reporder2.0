import './globals.css'
import { Inter } from 'next/font/google'
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
        <Providers>{children}</Providers>
      </body>
    </html>
  )
} 