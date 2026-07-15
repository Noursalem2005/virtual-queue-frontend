'use client'
import { motion } from 'framer-motion'
import { ReactNode } from 'react'

export const Card = ({
  children,
  className = '',
  hover = false,
  glow = false,
  delay = 0
}: {
  children: ReactNode
  className?: string
  hover?: boolean
  glow?: boolean
  delay?: number
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={hover ? { y: -4, borderColor: 'var(--border-hover)' } : {}}
      className={`glass ${hover ? 'glass-hover' : ''} ${glow ? 'glow-accent' : ''} ${className}`}
      style={{ borderRadius: '16px', padding: '24px' }}
    >
      {children}
    </motion.div>
  )
}