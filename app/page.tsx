'use client'
import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { gsap } from 'gsap'
import Link from 'next/link'
import { Button } from '../components/ui/Button'
import { useLang } from '../components/providers/LangProvider'

const floatingTickets = [
  { number: 47, x: '8%', y: '20%', delay: 0 },
  { number: 12, x: '82%', y: '15%', delay: 0.3 },
  { number: 93, x: '75%', y: '65%', delay: 0.6 },
  { number: 28, x: '5%', y: '68%', delay: 0.9 },
]

export default function Home() {
  const orbRef = useRef<HTMLDivElement>(null)
  const { t, dir } = useLang()

  useEffect(() => {
    // mouse parallax on orb
    const handleMouse = (e: MouseEvent) => {
      if (!orbRef.current) return
      const x = (e.clientX / window.innerWidth - 0.5) * 40
      const y = (e.clientY / window.innerHeight - 0.5) * 40
      gsap.to(orbRef.current, { x, y, duration: 1.5, ease: 'power2.out' })
    }
    window.addEventListener('mousemove', handleMouse)
    return () => window.removeEventListener('mousemove', handleMouse)
  }, [])

  return (
    <main dir={dir} style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden', background: 'var(--bg)' }}>

      {/* ambient orb */}
      <div ref={orbRef} style={{
        position: 'absolute', top: '20%', left: '50%',
        transform: 'translateX(-50%)',
        width: '600px', height: '600px',
        background: 'radial-gradient(circle, rgba(124,109,250,0.12) 0%, transparent 70%)',
        pointerEvents: 'none', zIndex: 0
      }} />

      {/* floating ticket previews */}
      {floatingTickets.map((t, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1, y: [0, -12, 0] }}
          transition={{
            opacity: { delay: t.delay + 0.5, duration: 0.6 },
            scale: { delay: t.delay + 0.5, duration: 0.6 },
            y: { delay: t.delay, duration: 4, repeat: Infinity, ease: 'easeInOut' }
          }}
          style={{
            position: 'absolute', left: t.x, top: t.y,
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid var(--border)',
            borderRadius: '12px', padding: '12px 20px',
            backdropFilter: 'blur(12px)', zIndex: 1,
            display: 'flex', alignItems: 'center', gap: '10px'
          }}
        >
          <div style={{
            width: '8px', height: '8px', borderRadius: '50%',
            background: i % 2 === 0 ? 'var(--accent)' : 'var(--green)',
            boxShadow: i % 2 === 0 ? '0 0 8px var(--accent)' : '0 0 8px var(--green)'
          }} />
          <span style={{ color: 'var(--text-2)', fontSize: '13px' }}>Ticket</span>
          <span style={{ color: 'var(--text-1)', fontSize: '13px', fontWeight: 700 }}>#{t.number}</span>
        </motion.div>
      ))}

      {/* hero content */}
      <div style={{
        position: 'relative', zIndex: 2,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        minHeight: '100vh', padding: '80px 24px',
        textAlign: 'center'
      }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: 'rgba(124,109,250,0.1)',
            border: '1px solid rgba(124,109,250,0.2)',
            borderRadius: '100px', padding: '6px 16px',
            marginBottom: '32px'
          }}
        >
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent)', display: 'inline-block' }} />
          <span style={{ color: 'var(--accent-2)', fontSize: '13px', fontWeight: 500 }}>{t.hero.badge}</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          style={{
            fontSize: 'clamp(48px, 8vw, 96px)',
            fontWeight: 900,
            letterSpacing: '-4px',
            lineHeight: 0.95,
            marginBottom: '24px',
            maxWidth: '800px'
          }}
        >
          <span className="gradient-text">{t.hero.title1}</span>
          <br />
          <span style={{ color: 'var(--text-1)' }}>{t.hero.title2}</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{
            color: 'var(--text-2)', fontSize: '18px',
            maxWidth: '500px', lineHeight: 1.6,
            marginBottom: '40px'
          }}
        >
          {t.hero.subtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}
        >
          <Link href="/join">
            <Button size="lg">{t.hero.cta1}</Button>
          </Link>
          <Link href="/business/login">
            <Button size="lg" variant="ghost">{t.hero.cta2}</Button>
          </Link>
          <Link href="/developers">
            <Button size="lg" variant="ghost">{t.hero.cta3}</Button>
          </Link>
        </motion.div>

        {/* live stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          style={{
            marginTop: '80px',
            display: 'flex', gap: '40px',
            borderTop: '1px solid var(--border)',
            paddingTop: '40px'
          }}
        >
          {[
            { label: t.stats.queues, value: '1,240' },
            { label: t.stats.served, value: '48,392' },
            { label: t.stats.wait, value: '73%' },
          ].map((s, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <p style={{ color: 'var(--text-1)', fontSize: '24px', fontWeight: 700 }}>{s.value}</p>
              <p style={{ color: 'var(--text-3)', fontSize: '13px', marginTop: '4px' }}>{s.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </main>
  )
}