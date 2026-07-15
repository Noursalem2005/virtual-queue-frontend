'use client'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { ReactNode } from 'react'
import { LangProvider } from './LangProvider'

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  return (
    <NextThemesProvider attribute="class" defaultTheme="dark" enableSystem>
      <LangProvider>
        {children}
      </LangProvider>
    </NextThemesProvider>
  )
}