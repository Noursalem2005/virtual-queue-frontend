'use client'
import { motion, AnimatePresence } from 'framer-motion'

export const TicketCard = ({
  ticketNumber,
  position,
  avgWaitSeconds,
  called = false
}: {
  ticketNumber: number
  position: number
  avgWaitSeconds: number
  called?: boolean
}) => {
  const waitMinutes = Math.round((position * avgWaitSeconds) / 60)

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
      style={{
        position: 'relative',
        borderRadius: '24px',
        padding: '48px 40px',
        textAlign: 'center',
        background: called
          ? 'linear-gradient(135deg, rgba(34,211,160,0.1), rgba(34,211,160,0.05))'
          : 'rgba(255,255,255,0.03)',
        border: called
          ? '1px solid rgba(34,211,160,0.3)'
          : '1px solid var(--border)',
        overflow: 'hidden'
      }}
    >
      {/* glow ring when called */}
      <AnimatePresence>
        {called && (
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 2, opacity: 0 }}
            transition={{ duration: 1.5, repeat: Infinity }}
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '24px',
              background: 'radial-gradient(circle, rgba(34,211,160,0.3) 0%, transparent 70%)',
              pointerEvents: 'none'
            }}
          />
        )}
      </AnimatePresence>

      <p style={{ color: 'var(--text-2)', fontSize: '13px', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '16px' }}>
        Your ticket
      </p>

      <motion.h2
        animate={called ? { scale: [1, 1.1, 1] } : {}}
        transition={{ duration: 0.5, repeat: called ? Infinity : 0, repeatDelay: 2 }}
        style={{
          fontSize: '96px',
          fontWeight: 800,
          lineHeight: 1,
          letterSpacing: '-4px',
          background: called
            ? 'linear-gradient(135deg, #22d3a0, #6ee7b7)'
            : 'linear-gradient(135deg, #f0f0ff, #a78bfa)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          marginBottom: '24px'
        }}
      >
        #{ticketNumber}
      </motion.h2>

      {called ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p style={{ color: '#22d3a0', fontSize: '18px', fontWeight: 600 }}>
            It is your turn!
          </p>
          <p style={{ color: 'var(--text-2)', fontSize: '14px', marginTop: '8px' }}>
            Please proceed now
          </p>
        </motion.div>
      ) : (
        <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>
          <div>
            <p style={{ color: 'var(--text-3)', fontSize: '12px', marginBottom: '4px' }}>Position</p>
            <p style={{ color: 'var(--text-1)', fontSize: '24px', fontWeight: 700 }}>{position}</p>
          </div>
          <div style={{ width: '1px', background: 'var(--border)' }} />
          <div>
            <p style={{ color: 'var(--text-3)', fontSize: '12px', marginBottom: '4px' }}>Est. wait</p>
            <p style={{ color: 'var(--text-1)', fontSize: '24px', fontWeight: 700 }}>{waitMinutes}m</p>
          </div>
        </div>
      )}
    </motion.div>
  )
}
