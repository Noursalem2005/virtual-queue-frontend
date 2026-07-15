'use client'
import { motion } from 'framer-motion'

export const Skeleton = ({ width = '100%', height = '20px', rounded = '8px' }: {
  width?: string
  height?: string
  rounded?: string
}) => (
  <motion.div
    animate={{ opacity: [0.4, 0.8, 0.4] }}
    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
    style={{
      width,
      height,
      borderRadius: rounded,
      background: 'rgba(255,255,255,0.06)'
    }}
  />
)

export const StatSkeleton = () => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '12px' }}>
    {[1, 2, 3, 4].map((i) => (
      <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: '16px', padding: '24px' }}>
        <Skeleton height="12px" width="60%" rounded="4px" />
        <div style={{ marginTop: '12px' }}>
          <Skeleton height="40px" width="80%" rounded="6px" />
        </div>
      </div>
    ))}
  </div>
)

export const QueueRowSkeleton = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
    {[1, 2, 3, 4].map((i) => (
      <div key={i} style={{ padding: '16px 20px', borderTop: '1px solid var(--border)', display: 'flex', gap: '16px', alignItems: 'center' }}>
        <Skeleton width="60px" height="20px" rounded="6px" />
        <Skeleton width="120px" height="16px" rounded="4px" />
        <div style={{ flex: 1 }} />
        <Skeleton width="60px" height="24px" rounded="100px" />
      </div>
    ))}
  </div>
)
