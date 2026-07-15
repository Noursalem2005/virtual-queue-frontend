'use client'
import { useCallback, useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useParams } from 'next/navigation'
import { gsap } from 'gsap'
import { getSocket } from '../../../lib/socket'
import { api } from '../../../lib/api'
import { playDing } from '../../../lib/sounds'
import { QUEUE_EVENTS } from '../../../shared/constants'

interface ScreenState {
  queueName: string
  businessName: string
  currentlyServing: number | null
  upNext: number[]
  isPaused: boolean
  updatedAt: string
}

export default function ScreenPage() {
  const { queueId } = useParams<{ queueId: string }>()
  const [state, setState] = useState<ScreenState | null>(null)
  const prevServingRef = useRef<number | null>(null)
  const numRef = useRef<HTMLDivElement>(null)
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const fetchState = useCallback(async () => {
    const data = await api.get(`/queues/${queueId}/screen`)
    setState(data)
  }, [queueId])

  useEffect(() => {
    if (!queueId) return
    void fetchState()

    const socket = getSocket()
    socket.connect()
    socket.emit('join:queue', queueId)

    socket.on(QUEUE_EVENTS.QUEUE_UPDATED, () => {
      void fetchState()
    })

    socket.on('queue:paused', () => setState((prev) => prev ? { ...prev, isPaused: true } : prev))
    socket.on('queue:resumed', () => setState((prev) => prev ? { ...prev, isPaused: false } : prev))

    return () => {
      socket.off(QUEUE_EVENTS.QUEUE_UPDATED)
      socket.off('queue:paused')
      socket.off('queue:resumed')
    }
  }, [fetchState, queueId])

  useEffect(() => {
    if (!state) return
    const prevServing = prevServingRef.current
    if (state.currentlyServing !== prevServing && prevServing !== null) {
      playDing()
      if (numRef.current) {
        gsap.fromTo(numRef.current, { scale: 0.5, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.6, ease: 'back.out(1.7)' })
      }
    }
    prevServingRef.current = state.currentlyServing
  }, [state])

  if (!state) {
    return (
      <div style={{ minHeight: '100vh', background: '#060608', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 2, repeat: Infinity }}>
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '18px', fontFamily: 'Syne,sans-serif' }}>Connecting...</p>
        </motion.div>
      </div>
    )
  }

  return (
    <main className="screen-page" style={{ minHeight: '100vh', background: state.isPaused ? '#0a0a0a' : '#060608', display: 'flex', flexDirection: 'column', fontFamily: 'Syne, sans-serif', transition: 'background 0.5s' }}>
      <div style={{ padding: '32px 48px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '14px', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '4px' }}>{state.queueName}</p>
          <h1 style={{ color: '#f0f0ff', fontSize: '32px', fontWeight: 800, letterSpacing: '-1px' }}>Queue<span style={{ color: '#7c6dfa' }}>ly</span></h1>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '36px', fontWeight: 700, letterSpacing: '-1px' }}>{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
          <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: '14px' }}>{time.toLocaleDateString([], { weekday: 'long', day: 'numeric', month: 'long' })}</p>
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px' }}>
        <AnimatePresence mode="wait">
          {state.isPaused ? (
            <motion.div key="paused" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ textAlign: 'center' }}>
              <motion.div animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 2, repeat: Infinity }} style={{ fontSize: '80px', marginBottom: '24px' }}>⏸</motion.div>
              <h2 style={{ color: 'rgba(255,255,255,0.4)', fontSize: '48px', fontWeight: 700, letterSpacing: '-2px' }}>Queue Paused</h2>
              <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: '20px', marginTop: '12px' }}>Service will resume shortly</p>
            </motion.div>
          ) : (
            <motion.div key="serving" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center', width: '100%', maxWidth: '800px' }}>
              <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '18px', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '24px' }}>Now Serving</p>
              <div ref={numRef}>
                <motion.div style={{ fontSize: 'clamp(120px, 20vw, 240px)', fontWeight: 900, lineHeight: 1, letterSpacing: '-8px', background: 'linear-gradient(135deg, #f0f0ff 0%, #a78bfa 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', marginBottom: '48px' }}>
                  {state.currentlyServing !== null ? `#${state.currentlyServing}` : '—'}
                </motion.div>
              </div>

              {state.upNext.length > 0 && (
                <div>
                  <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: '16px', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '16px' }}>Up Next</p>
                  <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
                    {state.upNext.map((n, i) => (
                      <motion.div key={n} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1 - (i * 0.25), y: 0 }} transition={{ delay: i * 0.1 }} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '20px 32px', fontSize: '40px', fontWeight: 700, color: `rgba(240,240,255,${1 - i * 0.3})` }}>
                        #{n}
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div style={{ padding: '20px 48px', borderTop: '1px solid rgba(255,255,255,0.04)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <p style={{ color: 'rgba(255,255,255,0.15)', fontSize: '13px' }}>Scan the QR code at the entrance to join the queue</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22d3a0', animation: 'pulse 2s infinite' }} />
          <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: '13px' }}>Live</p>
        </div>
      </div>
    </main>
  )
}
