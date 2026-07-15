'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useTheme } from 'next-themes'
import { useLang } from '../providers/LangProvider'

export function Navbar() {
  const { lang, setLang, dir, t } = useLang()
  const { resolvedTheme, theme, setTheme } = useTheme()
  const isArabic = lang === 'ar'
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [mounted, setMounted] = useState(false)

  const currentTheme = mounted ? (resolvedTheme || theme || 'dark') : 'dark'

  const toggleTheme = () => {
    setTheme(currentTheme === 'dark' ? 'light' : 'dark')
  }

  const nav = t.nav || {
    home: isArabic ? 'الرئيسية' : 'Home',
    join: isArabic ? 'انضم لطابور' : 'Join a Queue',
    discover: isArabic ? 'استكشاف' : 'Discover',
    register: isArabic ? 'تسجيل الأعمال' : 'Business Register',
    login: isArabic ? 'دخول الأعمال' : 'Business Login',
    developers: isArabic ? 'المطورين' : 'Developers',
    dashboard: isArabic ? 'لوحة التحكم' : 'Dashboard',
    themeLight: isArabic ? 'الوضع الفاتح' : 'Light mode',
    themeDark: isArabic ? 'الوضع الداكن' : 'Dark mode',
  }

  useEffect(() => {
    setMounted(true)
  }, [])

  const languageLabel = isArabic ? 'EN' : 'العربية'

  const linkStyle = {
    color: 'var(--text-2)',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'color 0.3s ease',
    cursor: 'pointer',
  }

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      dir={dir}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        background: 'var(--nav-bg)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border)',
      }}
    >
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
        {/* Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, var(--accent), var(--accent-2))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '800',
              fontSize: '18px',
              color: 'white',
              boxShadow: '0 8px 24px var(--accent-glow)',
            }}
          >
            Q
          </div>
              <span style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-1)' }}>Queuely</span>
        </Link>

        {/* Desktop Navigation */}
        <div
          style={{
            display: 'flex',
            gap: '28px',
            alignItems: 'center',
          }}
          className="nav-desktop-links"
        >
          <Link href="/" style={linkStyle as any} onMouseEnter={(e: any) => (e.currentTarget.style.color = 'var(--accent)')} onMouseLeave={(e: any) => (e.currentTarget.style.color = 'var(--text-2)')}>
            {nav.home}
          </Link>
          <Link href="/join" style={linkStyle as any} onMouseEnter={(e: any) => (e.currentTarget.style.color = 'var(--accent)')} onMouseLeave={(e: any) => (e.currentTarget.style.color = 'var(--text-2)')}>
            {nav.join}
          </Link>
          <Link href="/discover" style={linkStyle as any} onMouseEnter={(e: any) => (e.currentTarget.style.color = 'var(--accent)')} onMouseLeave={(e: any) => (e.currentTarget.style.color = 'var(--text-2)')}>
            {nav.discover}
          </Link>
          <Link href="/developers" style={linkStyle as any} onMouseEnter={(e: any) => (e.currentTarget.style.color = 'var(--accent)')} onMouseLeave={(e: any) => (e.currentTarget.style.color = 'var(--text-2)')}>
            {nav.developers}
          </Link>
        </div>

        {/* Right Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <motion.button
            type="button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleTheme}
            aria-label={currentTheme === 'dark' ? nav.themeLight : nav.themeDark}
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: '9px',
              padding: '7px 11px',
              color: 'var(--text-1)',
              fontSize: '12px',
              fontWeight: '700',
              cursor: 'pointer',
            }}
          >
            {currentTheme === 'dark' ? '☾' : '☀'}
          </motion.button>

          {/* Language Toggle */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
            style={{
              background: 'rgba(91,109,255,0.1)',
              border: '1px solid var(--border)',
              borderRadius: '9px',
              padding: '7px 13px',
              color: 'var(--accent)',
              fontSize: '12px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s',
            }}
            onMouseEnter={(e: any) => {
              e.currentTarget.style.background = 'rgba(91,109,255,0.2)'
              e.currentTarget.style.borderColor = 'var(--accent)'
            }}
            onMouseLeave={(e: any) => {
              e.currentTarget.style.background = 'rgba(91,109,255,0.1)'
              e.currentTarget.style.borderColor = 'var(--border)'
            }}
          >
            {languageLabel}
          </motion.button>

          {/* Business CTA */}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              href="/business/login"
              style={{
                background: 'linear-gradient(135deg, var(--accent), var(--accent-2))',
                color: 'white',
                padding: '9px 18px',
                borderRadius: '9px',
                textDecoration: 'none',
                fontSize: '12px',
                fontWeight: '600',
                display: 'inline-block',
                transition: 'all 0.3s',
              } as any}
              onMouseEnter={(e: any) => {
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 12px 24px var(--accent-glow)'
              }}
              onMouseLeave={(e: any) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              {nav.login}
            </Link>
          </motion.div>

          <motion.button
            type="button"
            onClick={() => setShowMobileMenu((value) => !value)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              display: 'none',
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: '10px',
              padding: '9px 12px',
              color: 'var(--text-1)',
              fontSize: '14px',
              fontWeight: '700',
            }}
            className="nav-mobile-toggle"
          >
            ☰
          </motion.button>
        </div>
      </div>

      {showMobileMenu && (
        <div className="nav-mobile-panel" style={{ display: 'block', borderTop: '1px solid var(--border)', background: 'var(--nav-bg)', backdropFilter: 'blur(12px)' }}>
          <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '14px 24px 18px', display: 'grid', gap: '12px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '10px' }}>
              <Link href="/" style={{ textDecoration: 'none', color: 'var(--text-1)', border: '1px solid var(--border)', borderRadius: '12px', padding: '12px 14px', background: 'var(--surface)' }}>{nav.home}</Link>
              <Link href="/join" style={{ textDecoration: 'none', color: 'var(--text-1)', border: '1px solid var(--border)', borderRadius: '12px', padding: '12px 14px', background: 'var(--surface)' }}>{nav.join}</Link>
              <Link href="/discover" style={{ textDecoration: 'none', color: 'var(--text-1)', border: '1px solid var(--border)', borderRadius: '12px', padding: '12px 14px', background: 'var(--surface)' }}>{nav.discover}</Link>
              <Link href="/developers" style={{ textDecoration: 'none', color: 'var(--text-1)', border: '1px solid var(--border)', borderRadius: '12px', padding: '12px 14px', background: 'var(--surface)' }}>{nav.developers}</Link>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              <Link href="/business/login" style={{ textDecoration: 'none', color: 'white', borderRadius: '999px', padding: '10px 14px', background: 'linear-gradient(135deg, var(--accent), var(--accent-2))' }}>{nav.login}</Link>
              <Link href="/business/dashboard" style={{ textDecoration: 'none', color: 'var(--text-1)', border: '1px solid var(--border)', borderRadius: '999px', padding: '10px 14px', background: 'var(--surface)' }}>{nav.dashboard}</Link>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={toggleTheme} style={{ flex: 1, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '12px 14px', color: 'var(--text-1)', fontWeight: 700 }}>
                {currentTheme === 'dark' ? nav.themeLight : nav.themeDark}
              </button>
              <button onClick={() => setLang(lang === 'en' ? 'ar' : 'en')} style={{ flex: 1, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '12px 14px', color: 'var(--text-1)', fontWeight: 700 }}>
                {languageLabel}
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.nav>
  )
}
