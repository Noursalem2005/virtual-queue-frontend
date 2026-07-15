'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { api } from '../../../lib/api'
import { useLang } from '../../../components/providers/LangProvider'

type View = 'overview' | 'live' | 'settings'

interface QueueStats {
  current_wait: number
  people_waiting: number
  today_served: number
  avg_rating: number
  online_status: boolean
}

export default function BusinessDashboard() {
  const { lang, dir } = useLang()
  const isArabic = lang === 'ar'
  const router = useRouter()

  const copy = isArabic
    ? {
        welcome: 'مرحباً بك',
        subtitle: 'إدارة طابورك بكفاءة وسهولة',
        overview: '📊 نظرة عامة',
        live: '⚡ مباشر',
        settings: '⚙️ الإعدادات',
        currentWait: 'الانتظار الحالي',
        minutes: 'دقيقة',
        peopleWaiting: 'ينتظرون الآن',
        served: 'تم تقديمهم اليوم',
        rating: 'التقييم',
        status: 'الحالة',
        online: 'متصل',
        offline: 'غير متصل',
        noQueue: 'لم تقم بإنشاء طابور حتى الآن',
        createQueue: 'إنشاء طابور جديد',
        signOut: 'تسجيل الخروج',
      }
    : {
        welcome: 'Welcome back',
        subtitle: 'Manage your queue efficiently',
        overview: '📊 Overview',
        live: '⚡ Live',
        settings: '⚙️ Settings',
        currentWait: 'Current Wait',
        minutes: 'min',
        peopleWaiting: 'People Waiting',
        served: 'Served Today',
        rating: 'Rating',
        status: 'Status',
        online: 'Online',
        offline: 'Offline',
        noQueue: 'You haven\'t created a queue yet',
        createQueue: 'Create New Queue',
        signOut: 'Sign Out',
      }

  const [view, setView] = useState<View>('overview')
  const [stats, setStats] = useState<QueueStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [queueName, setQueueName] = useState('')
  const [hasQueue, setHasQueue] = useState(false)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          router.push('/business/login')
          return
        }
        const response = await api.get('/queues/stats')
        if ((response as any).ok && (response as any).data) {
          setStats((response as any).data)
          setHasQueue(true)
          setQueueName((response as any).data.name || 'My Queue')
        }
      } catch (err) {
        console.error('Failed to fetch stats:', err)
      }
      setLoading(false)
    }
    void fetchStats()
  }, [router])

  const handleSignOut = () => {
    localStorage.removeItem('token')
    router.push('/business/login')
  }

  return (
    <main
      dir={dir}
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, var(--bg) 0%, var(--bg-2) 100%)',
        display: 'grid',
        gridTemplateColumns: '280px 1fr',
        gap: 0,
      }}
    >
      {/* Sidebar */}
      <motion.div
        initial={{ x: -280 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.4 }}
        style={{
          padding: '32px 20px',
          borderRight: '1px solid var(--border)',
          display: 'flex',
          flexDirection: 'column',
          gap: '32px',
          position: 'fixed',
          height: '100vh',
          width: '280px',
          background: 'linear-gradient(180deg, rgba(15,20,25,0.8) 0%, rgba(26,31,46,0.6) 100%)',
          backdropFilter: 'blur(20px)',
          overflowY: 'auto',
        }}
      >
        {/* Logo */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          style={{
            fontSize: '28px',
            fontWeight: '900',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: 'var(--accent)',
          }}
        >
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, var(--accent), #4a5cff)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '20px',
            }}
          >
            Q
          </div>
          <span>Queue</span>
        </motion.div>

        {/* Navigation */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {(['overview', 'live', 'settings'] as const).map((v, idx) => (
            <motion.button
              key={v}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + idx * 0.1 }}
              onClick={() => setView(v)}
              style={{
                padding: '14px 16px',
                borderRadius: '12px',
                border: view === v ? '1px solid var(--accent)' : '1px solid transparent',
                background: view === v ? 'linear-gradient(135deg, rgba(91,109,255,0.15), rgba(91,109,255,0.05))' : 'transparent',
                color: view === v ? 'var(--accent)' : 'var(--text-2)',
                fontSize: '14px',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.3s',
                textAlign: 'left',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              {v === 'overview' && '📊'}
              {v === 'live' && '⚡'}
              {v === 'settings' && '⚙️'}
              <span>
                {isArabic
                  ? v === 'overview'
                    ? 'نظرة عامة'
                    : v === 'live'
                      ? 'مباشر'
                      : 'الإعدادات'
                  : v === 'overview'
                    ? 'Overview'
                    : v === 'live'
                      ? 'Live'
                      : 'Settings'}
              </span>
            </motion.button>
          ))}
        </div>

        <div style={{ flex: 1 }} />

        {/* Logout Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSignOut}
          style={{
            padding: '12px 16px',
            borderRadius: '10px',
            background: 'rgba(255,107,107,0.1)',
            border: '1px solid rgba(255,107,107,0.3)',
            color: '#ff6b6b',
            fontSize: '14px',
            fontWeight: '700',
            cursor: 'pointer',
            transition: 'all 0.3s',
          }}
        >
          {copy.signOut}
        </motion.button>
      </motion.div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        style={{
          marginLeft: '280px',
          padding: '40px 40px',
          overflowY: 'auto',
          minHeight: '100vh',
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: '40px' }}>
          <h1
            style={{
              fontSize: '32px',
              fontWeight: '900',
              color: 'var(--text-1)',
              marginBottom: '8px',
            }}
          >
            {copy.welcome}
          </h1>
          <p
            style={{
              fontSize: '15px',
              color: 'var(--text-2)',
              fontWeight: '500',
            }}
          >
            {copy.subtitle}
          </p>
        </div>

        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '20px',
              }}
            >
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  style={{
                    height: '140px',
                    background: 'var(--bg-3)',
                    borderRadius: '16px',
                    animation: 'pulse 2s infinite',
                  }}
                />
              ))}
            </motion.div>
          ) : !hasQueue ? (
            <motion.div
              key="no-queue"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              style={{
                padding: '60px 40px',
                textAlign: 'center',
                background: 'linear-gradient(135deg, rgba(91,109,255,0.08), rgba(29,209,161,0.03))',
                borderRadius: '20px',
                border: '1px solid var(--border)',
              }}
            >
              <div style={{ fontSize: '64px', marginBottom: '20px' }}>📭</div>
              <h2
                style={{
                  fontSize: '24px',
                  fontWeight: '800',
                  color: 'var(--text-1)',
                  marginBottom: '12px',
                }}
              >
                {copy.noQueue}
              </h2>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  marginTop: '24px',
                  padding: '14px 28px',
                  background: 'linear-gradient(135deg, var(--accent) 0%, #4a5cff 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '15px',
                  fontWeight: '800',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                }}
              >
                {copy.createQueue}
              </motion.button>
            </motion.div>
          ) : (
            <motion.div
              key={view}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {view === 'overview' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                  {stats && [
                    {
                      label: copy.currentWait,
                      value: `${stats.current_wait} ${copy.minutes}`,
                      icon: '⏱️',
                      color: 'var(--accent)',
                    },
                    {
                      label: copy.peopleWaiting,
                      value: `${stats.people_waiting}`,
                      icon: '👥',
                      color: '#ff6b6b',
                    },
                    {
                      label: copy.served,
                      value: `${stats.today_served}`,
                      icon: '✅',
                      color: '#1dd1a1',
                    },
                    {
                      label: copy.rating,
                      value: `${stats.avg_rating.toFixed(1)}/5`,
                      icon: '⭐',
                      color: '#ffd93d',
                    },
                  ].map((stat, idx) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      style={{
                        padding: '28px',
                        borderRadius: '16px',
                        border: '1px solid var(--border)',
                        background: 'linear-gradient(135deg, rgba(91,109,255,0.06), rgba(29,209,161,0.02))',
                        backdropFilter: 'blur(10px)',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          marginBottom: '12px',
                        }}
                      >
                        <div style={{ fontSize: '28px' }}>{stat.icon}</div>
                        <div
                          style={{
                            fontSize: '13px',
                            fontWeight: '700',
                            color: 'var(--text-2)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                          }}
                        >
                          {stat.label}
                        </div>
                      </div>
                      <div
                        style={{
                          fontSize: '32px',
                          fontWeight: '900',
                          color: stat.color,
                        }}
                      >
                        {stat.value}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {view === 'live' && (
                <div
                  style={{
                    padding: '40px',
                    borderRadius: '20px',
                    border: '1px solid var(--border)',
                    background: 'linear-gradient(135deg, rgba(91,109,255,0.08), rgba(29,209,161,0.03))',
                    textAlign: 'center',
                  }}
                >
                  <div style={{ fontSize: '48px', marginBottom: '20px' }}>⚡</div>
                  <h2
                    style={{
                      fontSize: '24px',
                      fontWeight: '800',
                      color: 'var(--text-1)',
                      marginBottom: '8px',
                    }}
                  >
                    {isArabic ? 'عرض مباشر' : 'Live View'}
                  </h2>
                  <p style={{ fontSize: '15px', color: 'var(--text-2)', fontWeight: '500' }}>
                    {isArabic ? 'عرض الطابور على الشاشة الكبيرة' : 'Display queue on a large screen'}
                  </p>
                </div>
              )}

              {view === 'settings' && (
                <div
                  style={{
                    padding: '40px',
                    borderRadius: '20px',
                    border: '1px solid var(--border)',
                    background: 'linear-gradient(135deg, rgba(91,109,255,0.08), rgba(29,209,161,0.03))',
                    textAlign: 'center',
                  }}
                >
                  <div style={{ fontSize: '48px', marginBottom: '20px' }}>⚙️</div>
                  <h2
                    style={{
                      fontSize: '24px',
                      fontWeight: '800',
                      color: 'var(--text-1)',
                      marginBottom: '8px',
                    }}
                  >
                    {isArabic ? 'إعدادات' : 'Settings'}
                  </h2>
                  <p style={{ fontSize: '15px', color: 'var(--text-2)', fontWeight: '500' }}>
                    {isArabic ? 'إدارة إعدادات الطابور الخاص بك' : 'Manage your queue settings'}
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 0.8; }
        }
      `}</style>
    </main>
  )
}
