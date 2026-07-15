'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { gsap } from 'gsap'
import Link from 'next/link'
import { Button } from '../components/ui/Button'
import { Sparkline } from '../components/ui/Sparkline'
import { useLang } from '../components/providers/LangProvider'

const previewAccount = {
  queueId: 'main-branch',
}

const floatingTickets = [
  { number: 47, x: '8%', y: '20%', delay: 0 },
  { number: 12, x: '82%', y: '15%', delay: 0.3 },
  { number: 93, x: '75%', y: '65%', delay: 0.6 },
  { number: 28, x: '5%', y: '68%', delay: 0.9 },
]

const featureCards = [
  { label: 'Live queue', value: '42 waiting', detail: 'Call, serve, pause, resume, no-show, and priority tickets.' },
  { label: 'Customer join', value: 'QR ready', detail: 'Visitors join from their phone and receive a real ticket view.' },
  { label: 'Appointments', value: '12 today', detail: 'Scheduled visits connect directly to queue operations.' },
  { label: 'Analytics', value: '73% faster', detail: 'Weekly traffic, wait time, ratings, and service performance.' },
]

const workflow = [
  { step: '01', title: 'Customer joins', text: 'Scan QR, choose service, receive ticket number.' },
  { step: '02', title: 'Staff controls', text: 'Dashboard updates the queue and current serving ticket.' },
  { step: '03', title: 'Screen updates', text: 'Reception display and notifications keep visitors informed.' },
]

const seedPreview = () => {
  localStorage.setItem('token', 'preview-token')
  localStorage.setItem('preview:enabled', 'true')
  localStorage.setItem('workspace:last-queue-id', previewAccount.queueId)
  localStorage.setItem('workspace:recent-queues', JSON.stringify([previewAccount.queueId, 'clinic-east', 'branch-02']))
  localStorage.setItem('workspace:preferences', JSON.stringify({
    setup: {
      serviceModel: 'Hybrid walk-ins and appointments',
      dailyVolume: '120-180 visitors',
      notifyChannel: 'SMS + email',
      primaryGoal: 'Reduce waiting time',
    },
    modules: {
      overview: true,
      live: true,
      appointments: true,
      customers: true,
      analytics: true,
      billing: true,
      screen: true,
    },
  }))
}

export default function Home() {
  const orbRef = useRef<HTMLDivElement>(null)
  const { t, dir } = useLang()

  useEffect(() => {
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
      <div ref={orbRef} style={{
        position: 'absolute', top: '12%', left: '50%',
        transform: 'translateX(-50%)',
        width: '640px', height: '640px',
        background: 'radial-gradient(circle, rgba(124,109,250,0.12) 0%, transparent 70%)',
        pointerEvents: 'none', zIndex: 0
      }} />

      {floatingTickets.map((ticket, i) => (
        <motion.div
          key={ticket.number}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1, y: [0, -12, 0] }}
          transition={{
            opacity: { delay: ticket.delay + 0.5, duration: 0.6 },
            scale: { delay: ticket.delay + 0.5, duration: 0.6 },
            y: { delay: ticket.delay, duration: 4, repeat: Infinity, ease: 'easeInOut' }
          }}
          style={{
            position: 'absolute', left: ticket.x, top: ticket.y,
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
          <span style={{ color: 'var(--text-1)', fontSize: '13px', fontWeight: 700 }}>#{ticket.number}</span>
        </motion.div>
      ))}

      <section style={{
        position: 'relative', zIndex: 2,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        minHeight: '100vh', padding: '92px 24px 56px',
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
            maxWidth: '560px', lineHeight: 1.6,
            marginBottom: '40px'
          }}
        >
          Smart queue management for businesses that want shorter waits, cleaner operations, and a smoother customer experience.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}
        >
          <Link href="/business/dashboard" onClick={seedPreview}>
            <Button size="lg">Explore dashboard</Button>
          </Link>
          <Link href="/join">
            <Button size="lg" variant="ghost">{t.hero.cta1}</Button>
          </Link>
          <Link href="/business/login">
            <Button size="lg" variant="ghost">{t.hero.cta2}</Button>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          style={{
            marginTop: '80px',
            display: 'flex', gap: '40px',
            borderTop: '1px solid var(--border)',
            paddingTop: '40px',
            flexWrap: 'wrap',
            justifyContent: 'center'
          }}
        >
          {[
            { label: t.stats.queues, value: '1,240' },
            { label: t.stats.served, value: '48,392' },
            { label: t.stats.wait, value: '73%' },
          ].map((stat) => (
            <div key={stat.label} style={{ textAlign: 'center', minWidth: '120px' }}>
              <p style={{ color: 'var(--text-1)', fontSize: '24px', fontWeight: 700 }}>{stat.value}</p>
              <p style={{ color: 'var(--text-3)', fontSize: '13px', marginTop: '4px' }}>{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </section>

      <section style={{ position: 'relative', zIndex: 2, padding: '24px 24px 100px' }}>
        <div style={{ maxWidth: '1160px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <p style={{ color: 'var(--accent-2)', fontSize: '12px', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 800 }}>Platform features</p>
            <h2 style={{ color: 'var(--text-1)', fontSize: 'clamp(30px, 5vw, 48px)', marginTop: '10px', letterSpacing: '-1px' }}>Everything a queue needs, connected</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
            {featureCards.map((feature, index) => (
              <motion.div
                key={feature.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ delay: index * 0.05 }}
                className="glass glass-hover"
                style={{ borderRadius: '12px', padding: '20px', minHeight: '190px' }}
              >
                <p style={{ color: 'var(--text-3)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{feature.label}</p>
                <h3 style={{ color: 'var(--text-1)', fontSize: '26px', marginTop: '14px' }}>{feature.value}</h3>
                <p style={{ color: 'var(--text-2)', fontSize: '14px', lineHeight: 1.7, marginTop: '14px' }}>{feature.detail}</p>
              </motion.div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '18px', marginTop: '18px' }}>
            <div className="glass" style={{ borderRadius: '12px', padding: '22px' }}>
              <p style={{ color: 'var(--accent-2)', fontSize: '12px', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 800 }}>Live operations</p>
              <div style={{ display: 'grid', gap: '12px', marginTop: '18px' }}>
                {workflow.map((item) => (
                  <div key={item.step} style={{ display: 'grid', gridTemplateColumns: '44px minmax(0, 1fr)', gap: '14px', alignItems: 'start', padding: '14px', border: '1px solid var(--border)', borderRadius: '12px', background: 'rgba(255,255,255,0.03)' }}>
                    <strong style={{ color: 'var(--green)', fontSize: '15px' }}>{item.step}</strong>
                    <div>
                      <h3 style={{ color: 'var(--text-1)', fontSize: '16px' }}>{item.title}</h3>
                      <p style={{ color: 'var(--text-2)', fontSize: '13px', lineHeight: 1.6, marginTop: '4px' }}>{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass" style={{ borderRadius: '12px', padding: '22px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', alignItems: 'flex-start' }}>
                <div>
                  <p style={{ color: 'var(--accent-2)', fontSize: '12px', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 800 }}>Dashboard preview</p>
                  <h3 style={{ color: 'var(--text-1)', fontSize: '28px', marginTop: '8px' }}>Main Branch</h3>
                </div>
                <span style={{ color: 'var(--green)', border: '1px solid rgba(29,209,161,0.28)', background: 'rgba(29,209,161,0.1)', borderRadius: '999px', padding: '7px 11px', fontSize: '12px', fontWeight: 800 }}>Live</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '10px', marginTop: '18px' }}>
                {[
                  ['Waiting', '42'],
                  ['Serving', '41'],
                  ['Avg wait', '8m'],
                ].map(([label, value]) => (
                  <div key={label} style={{ border: '1px solid var(--border)', borderRadius: '12px', padding: '14px', background: 'rgba(255,255,255,0.03)' }}>
                    <p style={{ color: 'var(--text-3)', fontSize: '11px', textTransform: 'uppercase' }}>{label}</p>
                    <p style={{ color: 'var(--text-1)', fontSize: '26px', fontWeight: 800, marginTop: '8px' }}>{value}</p>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '18px', marginTop: '24px', padding: '18px', border: '1px solid var(--border)', borderRadius: '12px', background: 'rgba(29,209,161,0.06)' }}>
                <Sparkline data={[8, 12, 10, 16, 14, 20, 18]} color="var(--green)" height={54} />
                <div style={{ textAlign: 'right' }}>
                  <p style={{ color: 'var(--green)', fontSize: '36px', fontWeight: 900 }}>73%</p>
                  <p style={{ color: 'var(--text-2)', fontSize: '13px' }}>shorter perceived waiting time</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
