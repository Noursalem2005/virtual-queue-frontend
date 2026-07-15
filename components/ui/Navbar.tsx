'use client'
import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useLang } from '../providers/LangProvider'

export function Navbar() {
  const { lang, setLang, dir } = useLang()
  const isArabic = lang === 'ar'
  const [showMobileMenu, setShowMobileMenu] = useState(false)

  const nav = isArabic
    ? {
        home: 'الرئيسية',
        discover: 'استكشاف',
        business: 'للأعمال',
        language: 'EN',
      }
    : {
        home: 'Home',
        discover: 'Discover',
        business: 'Business',
        language: 'العربية',
      }

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
        background: 'linear-gradient(180deg, var(--bg) 0%, rgba(15,20,25,0.8) 100%)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border)',
      }}
    >
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
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
          <span style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-1)' }}>Queue</span>
        </Link>

        {/* Desktop Navigation */}
        <div
          style={{
            display: 'flex',
            gap: '28px',
            alignItems: 'center',
          }}
        >
          <Link href="/" style={linkStyle as any} onMouseEnter={(e: any) => (e.currentTarget.style.color = 'var(--accent)')} onMouseLeave={(e: any) => (e.currentTarget.style.color = 'var(--text-2)')}>
            {nav.home}
          </Link>
          <Link href="/discover" style={linkStyle as any} onMouseEnter={(e: any) => (e.currentTarget.style.color = 'var(--accent)')} onMouseLeave={(e: any) => (e.currentTarget.style.color = 'var(--text-2)')}>
            {nav.discover}
          </Link>
        </div>

        {/* Right Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
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
            {nav.language}
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
              {nav.business}
            </Link>
          </motion.div>
        </div>
      </div>
    </motion.nav>
  )
}
