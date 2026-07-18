import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ThemeProvider } from '../components/providers/ThemeProvider'
import { LangProvider } from '../components/providers/LangProvider'
import { Navbar } from '../components/ui/Navbar'
import './globals.css'

const inter = Inter({ subsets: ['latin', 'latin-ext'] })

export const metadata: Metadata = {
  title: 'Queuely',
  description: 'Virtual Queue Platform',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <LangProvider>
            <Navbar />
            {children}
          </LangProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
