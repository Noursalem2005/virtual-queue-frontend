'use client'
import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { api } from '../../lib/api'
import { useLang } from '../../components/providers/LangProvider'

interface Queue {
  id: string
  name: string
  business_name: string
  category: string
  city: string
  waiting_count: number
  avg_wait_time: number
  rating: number
  description: string
}

const CATEGORIES = isArabic => isArabic
  ? [
      { value: 'all', label: '📌 الكل', emoji: '📌' },
      { value: 'bank', label: '🏦 بنك', emoji: '🏦' },
      { value: 'hospital', label: '🏥 مستشفى', emoji: '🏥' },
      { value: 'clinic', label: '⚕️ عيادة', emoji: '⚕️' },
      { value: 'cafe', label: '☕ مقهى', emoji: '☕' },
      { value: 'restaurant', label: '🍽️ مطعم', emoji: '🍽️' },
      { value: 'pharmacy', label: '💊 صيدلية', emoji: '💊' },
    ]
  : [
      { value: 'all', label: '📌 All', emoji: '📌' },
      { value: 'bank', label: '🏦 Bank', emoji: '🏦' },
      { value: 'hospital', label: '🏥 Hospital', emoji: '🏥' },
      { value: 'clinic', label: '⚕️ Clinic', emoji: '⚕️' },
      { value: 'cafe', label: '☕ Cafe', emoji: '☕' },
      { value: 'restaurant', label: '🍽️ Restaurant', emoji: '🍽️' },
      { value: 'pharmacy', label: '💊 Pharmacy', emoji: '💊' },
    ]

export default function DiscoverPage() {
  const { lang, dir } = useLang()
  const isArabic = lang === 'ar'
  
  const copy = isArabic
    ? {
        title: 'اكتشف الطوابير',
        subtitle: 'ابحث عن أقرب طابور وانضم فوراً بدون الانتظار في الصف',
        search: 'البحث عن عمل...',
        categories: 'الفئات',
        noQueues: 'لم يتم العثور على طوابير',
        noQueuesDesc: 'جرب البحث بكلمات مختلفة أو تصفح الفئات',
        join: 'انضم الآن',
        waiting: 'ينتظرون',
        avgWait: 'الانتظار المتوقع',
        mins: 'دقيقة',
      }
    : {
        title: 'Discover Queues',
        subtitle: 'Find nearby queues and join instantly without waiting in line',
        search: 'Search for business...',
        categories: 'Categories',
        noQueues: 'No queues found',
        noQueuesDesc: 'Try different search terms or browse categories',
        join: 'Join Now',
        waiting: 'Waiting',
        avgWait: 'Expected Wait',
        mins: 'min',
      }

  const [queues, setQueues] = useState<Queue[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const fetchQueues = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (search) params.append('search', search)
      if (selectedCategory !== 'all') params.append('category', selectedCategory)
      const response = await api.get(`/queues/discover?${params.toString()}`)
      setQueues(Array.isArray((response as any).data) ? (response as any).data : [])
    } catch (err) {
      console.error('Failed to fetch queues:', err)
      setQueues([])
    }
    setLoading(false)
  }, [search, selectedCategory])

  useEffect(() => {
    void fetchQueues()
  }, [fetchQueues])

  const categories = CATEGORIES(isArabic)

  return (
    <main
      dir={dir}
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, var(--bg) 0%, var(--bg-2) 100%)',
        padding: '100px 20px 40px',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ marginBottom: '60px', textAlign: 'center' }}
        >
          <h1
            style={{
              fontSize: 'clamp(36px, 7vw, 52px)',
              fontWeight: '900',
              color: 'var(--text-1)',
              marginBottom: '12px',
              lineHeight: 1.1,
            }}
          >
            {copy.title}
          </h1>
          <p
            style={{
              fontSize: '18px',
              color: 'var(--text-2)',
              maxWidth: '600px',
              margin: '0 auto',
              lineHeight: 1.6,
              fontWeight: '500',
            }}
          >
            {copy.subtitle}
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          style={{ marginBottom: '40px' }}
        >
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              placeholder={copy.search}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: '100%',
                padding: '16px 18px',
                background: 'var(--bg-3)',
                border: '1.5px solid var(--border)',
                borderRadius: '14px',
                fontSize: '16px',
                color: 'var(--text-1)',
                fontWeight: '500',
                transition: 'all 0.3s',
                boxSizing: 'border-box',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = 'var(--accent)'
                e.currentTarget.style.background = 'rgba(91,109,255,0.04)'
                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(91,109,255,0.1)'
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'var(--border)'
                e.currentTarget.style.background = 'var(--bg-3)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            />
            <span style={{ position: 'absolute', right: '18px', top: '50%', transform: 'translateY(-50%)', fontSize: '20px' }}>🔍</span>
          </div>
        </motion.div>

        {/* Categories */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{ marginBottom: '50px' }}
        >
          <h3
            style={{
              fontSize: '14px',
              fontWeight: '800',
              color: 'var(--text-2)',
              marginBottom: '16px',
              textTransform: 'uppercase',
              letterSpacing: '1px',
            }}
          >
            {copy.categories}
          </h3>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
              gap: '10px',
            }}
          >
            {categories.map((cat) => (
              <motion.button
                key={cat.value}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(cat.value)}
                style={{
                  padding: '12px 14px',
                  borderRadius: '12px',
                  border: selectedCategory === cat.value ? '1.5px solid var(--accent)' : '1.5px solid var(--border)',
                  background: selectedCategory === cat.value
                    ? 'linear-gradient(135deg, rgba(91,109,255,0.15), rgba(91,109,255,0.05))'
                    : 'transparent',
                  color: selectedCategory === cat.value ? 'var(--accent)' : 'var(--text-2)',
                  fontSize: '14px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                }}
              >
                <span style={{ fontSize: '18px' }}>{cat.emoji}</span>
                <span>{cat.label.split(' ')[1]}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Queues Grid */}
        <div>
          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
              {[1, 2, 3, 4, 5, 6].map((idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  style={{
                    height: '280px',
                    borderRadius: '16px',
                    background: 'var(--bg-3)',
                    border: '1px solid var(--border)',
                    animation: 'pulse 2s infinite',
                  }}
                />
              ))}
            </div>
          ) : queues.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                textAlign: 'center',
                padding: '60px 20px',
                background: 'linear-gradient(135deg, rgba(91,109,255,0.05), rgba(29,209,161,0.02))',
                borderRadius: '20px',
                border: '1px solid var(--border)',
              }}
            >
              <div style={{ fontSize: '64px', marginBottom: '16px' }}>🔍</div>
              <h3
                style={{
                  fontSize: '24px',
                  fontWeight: '800',
                  color: 'var(--text-1)',
                  marginBottom: '8px',
                }}
              >
                {copy.noQueues}
              </h3>
              <p style={{ fontSize: '15px', color: 'var(--text-2)', fontWeight: '500' }}>
                {copy.noQueuesDesc}
              </p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: '20px',
              }}
            >
              <AnimatePresence>
                {queues.map((queue, idx) => (
                  <motion.div
                    key={queue.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: idx * 0.05 }}
                    whileHover={{ y: -8, boxShadow: '0 20px 40px rgba(91,109,255,0.15)' }}
                    style={{
                      padding: '24px',
                      borderRadius: '16px',
                      border: '1px solid var(--border)',
                      background: 'linear-gradient(135deg, rgba(91,109,255,0.06), rgba(29,209,161,0.02))',
                      backdropFilter: 'blur(10px)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '16px',
                      cursor: 'pointer',
                      transition: 'all 0.3s',
                    }}
                  >
                    {/* Category Badge */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                      <div
                        style={{
                          padding: '8px 12px',
                          background: 'rgba(91,109,255,0.15)',
                          border: '1px solid rgba(91,109,255,0.3)',
                          borderRadius: '8px',
                          fontSize: '12px',
                          fontWeight: '700',
                          color: 'var(--accent)',
                        }}
                      >
                        {queue.category}
                      </div>
                      {queue.rating && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '14px', fontWeight: '700', color: 'var(--accent)' }}>
                          ⭐ {queue.rating.toFixed(1)}
                        </div>
                      )}
                    </div>

                    {/* Queue Info */}
                    <div>
                      <h3
                        style={{
                          fontSize: '18px',
                          fontWeight: '800',
                          color: 'var(--text-1)',
                          marginBottom: '4px',
                        }}
                      >
                        {queue.name}
                      </h3>
                      <p
                        style={{
                          fontSize: '14px',
                          color: 'var(--text-2)',
                          fontWeight: '500',
                        }}
                      >
                        {queue.business_name}
                      </p>
                      <p
                        style={{
                          fontSize: '12px',
                          color: 'var(--text-2)',
                          marginTop: '4px',
                        }}
                      >
                        📍 {queue.city}
                      </p>
                    </div>

                    {/* Stats */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div
                        style={{
                          padding: '12px',
                          borderRadius: '10px',
                          background: 'rgba(91,109,255,0.08)',
                          border: '1px solid rgba(91,109,255,0.2)',
                        }}
                      >
                        <div
                          style={{
                            fontSize: '12px',
                            color: 'var(--text-2)',
                            fontWeight: '600',
                            marginBottom: '4px',
                          }}
                        >
                          {copy.waiting}
                        </div>
                        <div
                          style={{
                            fontSize: '20px',
                            fontWeight: '900',
                            color: 'var(--accent)',
                          }}
                        >
                          {queue.waiting_count}
                        </div>
                      </div>

                      <div
                        style={{
                          padding: '12px',
                          borderRadius: '10px',
                          background: 'rgba(29,209,161,0.08)',
                          border: '1px solid rgba(29,209,161,0.2)',
                        }}
                      >
                        <div
                          style={{
                            fontSize: '12px',
                            color: 'var(--text-2)',
                            fontWeight: '600',
                            marginBottom: '4px',
                          }}
                        >
                          {copy.avgWait}
                        </div>
                        <div
                          style={{
                            fontSize: '20px',
                            fontWeight: '900',
                            color: '#1dd1a1',
                          }}
                        >
                          {queue.avg_wait_time} {copy.mins}
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    {queue.description && (
                      <p
                        style={{
                          fontSize: '13px',
                          color: 'var(--text-2)',
                          lineHeight: 1.5,
                          fontWeight: '500',
                        }}
                      >
                        {queue.description}
                      </p>
                    )}

                    {/* Join Button */}
                    <Link href={`/join/${queue.id}`}>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          background: 'linear-gradient(135deg, var(--accent) 0%, #4a5cff 100%)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '10px',
                          fontSize: '14px',
                          fontWeight: '800',
                          cursor: 'pointer',
                          transition: 'all 0.3s',
                          marginTop: '8px',
                        }}
                      >
                        {copy.join} →
                      </motion.button>
                    </Link>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </div>
    </main>
  )
}
