'use client'
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Lang, translations, languages } from '../../lib/i18n'

interface LangContext {
  lang: Lang
  t: any
  setLang: (l: Lang) => void
  dir: 'ltr' | 'rtl'
}

const defaultT: any = (input: string | { en: string; ar: string } | ((lang: Lang) => string)) => {
  if (typeof input === 'string') return (translations as any).en?.[input] ?? input
  if (typeof input === 'function') return input('en')
  return input.en ?? ''
}
Object.assign(defaultT, (translations as any).en || {})

const Ctx = createContext<LangContext>({
  lang: 'en',
  t: defaultT,
  setLang: () => {},
  dir: 'ltr'
})

export const LangProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLangState] = useState<Lang>('en')

  const setLang = (l: Lang) => {
    setLangState(l)
    localStorage.setItem('lang', l)
    document.documentElement.lang = l
    document.documentElement.dir = languages[l].dir
  }

  useEffect(() => {
    const saved = localStorage.getItem('lang') as Lang
    if (saved && translations[saved]) setLang(saved)
  }, [])

  const t = (input: string | { en: string; ar: string } | ((lang: Lang) => string)) => {
    if (typeof input === 'string') return (translations as any)[lang]?.[input] ?? input
    if (typeof input === 'function') return input(lang)
    return input[lang] ?? ''
  }
  // expose translation keys as properties on the callable `t` for legacy access (e.g. t.hero.title)
  Object.assign(t as any, (translations as any)[lang] || {})

  return (
    <Ctx.Provider value={{
      lang,
      t,
      setLang,
      dir: languages[lang].dir
    }}>
      {children}
    </Ctx.Provider>
  )
}

export const useLang = () => useContext(Ctx)