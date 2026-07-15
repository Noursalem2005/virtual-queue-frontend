'use client'
import { motion } from 'framer-motion'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { Sparkline } from './Sparkline'

export const StatCard = ({
  label,
  value,
  unit = '',
  delay = 0,
  accent = false,
  trend,
  sparkData,
  color
}: {
  label: string
  value: number
  unit?: string
  delay?: number
  accent?: boolean
  trend?: 'up' | 'down' | 'neutral'
  sparkData?: number[]
  color?: string
}) => {
  const numRef = useRef<HTMLSpanElement>(null)
  const prevValue = useRef(0)

  useEffect(() => {
    if (!numRef.current) return
    const counter = { val: prevValue.current }
    gsap.fromTo(counter, {
      val: prevValue.current,
    }, {
      val: value,
      duration: 0.8,
      ease: 'power2.out',
      onUpdate: () => {
        if (numRef.current) {
          numRef.current.textContent = Math.round(counter.val).toString()
        }
      }
    })
    prevValue.current = value
  }, [value])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="glass glass-hover"
      style={{
        background: accent ? 'rgba(124,109,250,0.05)' : 'rgba(255,255,255,0.02)',
        border: `1px solid ${accent ? 'rgba(124,109,250,0.2)' : 'var(--border)'}`,
        borderRadius: '16px',
        padding: '20px',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <p style={{ color: 'var(--text-3)', fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '10px' }}>
        {label}
      </p>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <p style={{ fontSize: '40px', fontWeight: 800, letterSpacing: '-2px', color: accent ? 'var(--accent-2)' : 'var(--text-1)', lineHeight: 1, fontFamily: 'Syne,sans-serif' }}>
          <span ref={numRef}>{value}</span>
          {unit && <span style={{ fontSize: '16px', color: 'var(--text-2)', marginLeft: '3px' }}>{unit}</span>}
        </p>
        {sparkData && <Sparkline data={sparkData} color={color || (accent ? '#7c6dfa' : '#8888aa')} />}
      </div>

      {trend && (
        <p style={{ fontSize: '11px', color: trend === 'up' ? '#22d3a0' : trend === 'down' ? '#f87171' : 'var(--text-3)', marginTop: '8px' }}>
          {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'} vs yesterday
        </p>
      )}
    </motion.div>
  )
}