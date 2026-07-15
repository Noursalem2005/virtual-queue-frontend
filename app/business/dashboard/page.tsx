'use client'
import { useCallback, useEffect, useState, type CSSProperties } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import QRCode from 'react-qr-code'
import { useQueue } from '../../../hooks/useQueue'
import { api } from '../../../lib/api'
import { StatCard } from '../../../components/ui/StatCard'
import { Button } from '../../../components/ui/Button'
import { Sparkline } from '../../../components/ui/Sparkline'
import { useLang } from '../../../components/providers/LangProvider'
import type { Ticket, Appointment } from '../../../shared/types'

type View = 'overview' | 'live' | 'appointments' | 'customers' | 'analytics' | 'billing' | 'screen'

type WorkspacePreferences = {
  setup?: {
    serviceModel?: string
    dailyVolume?: string
    notifyChannel?: string
    primaryGoal?: string
  }
  modules?: Partial<Record<View, boolean>>
}

const sidebarIcon: Record<View, string> = {
  overview: '⌂',
  live: '⚡',
  appointments: '📅',
  customers: '👥',
  analytics: '📊',
  billing: '💳',
  screen: '📺',
}

export default function BusinessDashboard() {
  const { lang, dir } = useLang()
  const isArabic = lang === 'ar'
  const copy = isArabic
    ? {
        title: 'لوحة تحكم الأعمال',
        subtitle: 'إدارة كاملة للطابور والحجوزات والفوترة من مكان واحد',
        loadQueue: 'تحميل الطابور',
        queuePlaceholder: 'أدخل رقم الطابور',
        searchPlaceholder: 'ابحث في التذاكر أو العملاء أو المواعيد',
        businessInfo: 'معلومات العمل',
        plan: 'الخطة',
        live: 'مباشر',
        appointments: 'المواعيد',
        customers: 'العملاء',
        analytics: 'التحليلات',
        billing: 'الفوترة',
        screen: 'الشاشة',
        overview: 'نظرة عامة',
        queueActive: 'الطابور نشط',
        queueReady: 'حمّل طابورًا لعرض البيانات الحية',
        queueMissing: 'لم يتم تحميل الطابور بعد',
        pause: 'إيقاف',
        resume: 'استئناف',
        reset: 'إعادة الترقيم',
        noshow: 'عدم حضور',
        notify: 'إشعار',
        openScreen: 'فتح الشاشة',
        callNext: 'استدعاء التالي',
        waiting: 'المنتظرون',
        serving: 'يُخدم الآن',
        avgWait: 'متوسط الانتظار',
        rating: 'التقييم',
        queueSize: 'حجم الطابور',
        todaysAppointments: 'مواعيد اليوم',
        last7: 'آخر 7 أيام',
        peak: 'أعلى يوم',
        empty: 'لا توجد بيانات بعد',
        emptyLive: 'لا يوجد عملاء في الطابور الآن',
        emptyAppointments: 'لا توجد مواعيد اليوم',
        emptyCustomers: 'لا يوجد عملاء لعرضهم',
        billingTitle: 'مركز الفوترة',
        billingText: 'هذه الصفحة تجمع الخطة والفاتورة والاستخدام في مكان واحد.',
        currentPlan: 'الخطة الحالية',
        invoice: 'آخر فاتورة',
        usage: 'الاستخدام الحالي',
        support: 'الدعم',
        qrTitle: 'رمز QR للطابور',
        qrText: 'اطبع هذا الرمز وضعه على الباب ليتمكن العملاء من الانضمام فورًا.',
        recentQueues: 'الطوابير الأخيرة',
        workspaceModules: 'وحدات مساحة العمل',
        serviceModel: 'نموذج الخدمة',
        notificationChannel: 'قناة الإشعارات',
        liveQueue: 'قائمة الانتظار',
        servingNow: 'يتم خدمته الآن',
        served: 'تمت الخدمة',
        priority: 'أولوية',
        notAvailable: 'غير متاح',
      }
    : {
        title: 'Business Dashboard',
        subtitle: 'Queue control, appointments, analytics and billing in one admin workspace',
        loadQueue: 'Load Queue',
        queuePlaceholder: 'Enter your queue ID',
        searchPlaceholder: 'Search tickets, customers, or appointments',
        businessInfo: 'Business Info',
        plan: 'Plan',
        live: 'Live',
        appointments: 'Appointments',
        customers: 'Customers',
        analytics: 'Analytics',
        billing: 'Billing',
        screen: 'Screen',
        overview: 'Overview',
        queueActive: 'Queue active',
        queueReady: 'Load a queue to unlock live data',
        queueMissing: 'No queue loaded yet',
        pause: 'Pause',
        resume: 'Resume',
        reset: 'Reset counter',
        noshow: 'No-show',
        notify: 'Notify',
        openScreen: 'Open screen',
        callNext: 'Call Next Customer',
        waiting: 'Waiting',
        serving: 'Now Serving',
        avgWait: 'Avg wait',
        rating: 'Rating',
        queueSize: 'Queue size',
        todaysAppointments: 'Today’s appointments',
        last7: 'Last 7 days',
        peak: 'Peak day',
        empty: 'No data yet',
        emptyLive: 'No customers are waiting right now',
        emptyAppointments: 'No appointments scheduled for today',
        emptyCustomers: 'No customers to display yet',
        billingTitle: 'Billing center',
        billingText: 'Plan, invoices, and usage live together here.',
        currentPlan: 'Current plan',
        invoice: 'Latest invoice',
        usage: 'Usage',
        support: 'Support',
        qrTitle: 'Queue QR code',
        qrText: 'Print this QR and place it on your front desk so customers can join instantly.',
        recentQueues: 'Recent queues',
        workspaceModules: 'Workspace modules',
        serviceModel: 'Service model',
        notificationChannel: 'Notification channel',
        liveQueue: 'Waiting list',
        servingNow: 'Serving now',
        served: 'Served',
        priority: 'Priority',
        notAvailable: 'Not available',
      }

  const [activeQueueId, setActiveQueueId] = useState('')
  const [queueIdInput, setQueueIdInput] = useState('')
  const [view, setView] = useState<View>('overview')
  const [search, setSearch] = useState('')
  const [recentQueues, setRecentQueues] = useState<string[]>([])
  const [owner, setOwner] = useState<{ email?: string; role?: string } | null>(null)
  const [prefs, setPrefs] = useState<WorkspacePreferences>({})
  const [joinUrl, setJoinUrl] = useState('')
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [rating, setRating] = useState<{ avg_rating: string; total_reviews: string } | null>(null)
  const [analytics, setAnalytics] = useState<number[]>([])
  const [loadError, setLoadError] = useState('')
  const { state, loading } = useQueue(activeQueueId)
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') || '' : ''

  const getEnabled = useCallback(
    (module: View) => prefs.modules?.[module] !== false,
    [prefs.modules]
  )

  useEffect(() => {
    if (typeof window === 'undefined') return
    const rawPrefs = localStorage.getItem('workspace:preferences')
    if (rawPrefs) {
      try {
        setPrefs(JSON.parse(rawPrefs) as WorkspacePreferences)
      } catch {
        setPrefs({})
      }
    }

    const storedQueue = localStorage.getItem('workspace:last-queue-id')
    if (storedQueue) {
      setActiveQueueId(storedQueue)
      setQueueIdInput(storedQueue)
    }

    const storedRecent = localStorage.getItem('workspace:recent-queues')
    if (storedRecent) {
      try {
        setRecentQueues(JSON.parse(storedRecent) as string[])
      } catch {
        setRecentQueues([])
      }
    }
  }, [])

  useEffect(() => {
    if (!token) return
    const fetchMe = async () => {
      const me = await api.get('/auth/me', token)
      if (me.ok === false) return
      setOwner({
        email: typeof me.email === 'string' ? me.email : undefined,
        role: typeof me.role === 'string' ? me.role : undefined,
      })
    }
    void fetchMe()
  }, [token])

  const fetchAppointments = useCallback(async () => {
    try {
      const data = await api.get(`/queues/${activeQueueId}/state`, token)
      if (data.ok === false) {
        setLoadError((data.error as string) || 'Could not load appointments')
        return
      }
      setAppointments(Array.isArray(data?.appointments) ? data.appointments : [])
    } catch {
      setAppointments([])
    }
  }, [activeQueueId, token])

  const fetchRating = useCallback(async () => {
    try {
      const data = await api.get(`/queues/${activeQueueId}/rating`, token)
      if (data.ok === false) {
        setLoadError((data.error as string) || 'Could not load rating')
        return
      }
      setRating(data)
    } catch {
      setRating(null)
    }
  }, [activeQueueId, token])

  const fetchQR = useCallback(async () => {
    try {
      const data = await api.get(`/queues/${activeQueueId}/qr`, token)
      if (data.ok === false) {
        setLoadError((data.error as string) || 'Could not load QR code')
        return
      }
      setJoinUrl(data.joinUrl || '')
    } catch {
      setJoinUrl('')
    }
  }, [activeQueueId, token])

  const fetchAnalytics = useCallback(async () => {
    try {
      const data = await api.get(`/queues/${activeQueueId}/weekly-stats`, token)
      if (data.ok === false) {
        setLoadError((data.error as string) || 'Could not load analytics')
        return
      }
      setAnalytics(Array.isArray(data) ? data.map((row: { total: string | number }) => Number(row.total) || 0) : [])
    } catch {
      setAnalytics([])
    }
  }, [activeQueueId, token])

  useEffect(() => {
    if (!activeQueueId) return
    void fetchAppointments()
    void fetchRating()
    void fetchQR()
    void fetchAnalytics()
  }, [activeQueueId, fetchAnalytics, fetchAppointments, fetchQR, fetchRating])

  const refreshQueueData = async () => {
    setLoadError('')
    await Promise.all([fetchAppointments(), fetchRating(), fetchQR(), fetchAnalytics()])
  }

  const setQueueAndPersist = (queueId: string) => {
    const trimmed = queueId.trim()
    if (!trimmed) return
    setLoadError('')
    setActiveQueueId(trimmed)
    setQueueIdInput(trimmed)

    const updatedRecent = [trimmed, ...recentQueues.filter((q) => q !== trimmed)].slice(0, 6)
    setRecentQueues(updatedRecent)
    localStorage.setItem('workspace:last-queue-id', trimmed)
    localStorage.setItem('workspace:recent-queues', JSON.stringify(updatedRecent))
  }

  const toggleModule = (module: View) => {
    const updatedPrefs: WorkspacePreferences = {
      ...prefs,
      modules: {
        ...prefs.modules,
        [module]: prefs.modules?.[module] === false,
      },
    }
    setPrefs(updatedPrefs)
    localStorage.setItem('workspace:preferences', JSON.stringify(updatedPrefs))
  }

  const handlePause = async () => {
    if (!activeQueueId) return
    const data = await api.patch(`/queues/${activeQueueId}/pause`, {}, token)
    if (data.ok === false) {
      setLoadError((data.error as string) || 'Failed to pause queue')
      return
    }
    await refreshQueueData()
  }
  const handleResume = async () => {
    if (!activeQueueId) return
    const data = await api.patch(`/queues/${activeQueueId}/resume`, {}, token)
    if (data.ok === false) {
      setLoadError((data.error as string) || 'Failed to resume queue')
      return
    }
    await refreshQueueData()
  }
  const handleCallNext = async () => {
    if (!activeQueueId) return
    const data = await api.post(`/queues/${activeQueueId}/call-next`, {}, token)
    if (data.ok === false) {
      setLoadError((data.error as string) || 'Failed to call next customer')
      return
    }
    await refreshQueueData()
  }
  const handleServe = async (ticketId: string) => {
    const data = await api.patch(`/queues/tickets/${ticketId}/serve`, {}, token)
    if (data.ok === false) {
      setLoadError((data.error as string) || 'Failed to mark ticket as served')
      return
    }
    await refreshQueueData()
  }
  const handleResetCounter = async () => {
    if (!activeQueueId) return
    const data = await api.post(`/queues/${activeQueueId}/reset-counter`, {}, token)
    if (data.ok === false) {
      setLoadError((data.error as string) || 'Failed to reset queue counter')
      return
    }
    await refreshQueueData()
  }
  const handleMarkNoShow = async () => {
    if (!activeQueueId) return
    const data = await api.post(`/queues/${activeQueueId}/mark-no-show`, {}, token)
    if (data.ok === false) {
      setLoadError((data.error as string) || 'Failed to mark no-show')
      return
    }
    await refreshQueueData()
  }

  const queueTickets = (state?.tickets || [])
  const filteredTickets = queueTickets.filter((ticket) => {
    const haystack = [ticket.ticket_number, ticket.customer_name, ticket.customer_phone, ticket.priority_reason].filter(Boolean).join(' ').toLowerCase()
    return haystack.includes(search.toLowerCase())
  })
  const filteredAppointments = appointments.filter((appointment) => {
    const haystack = [appointment.customerName, appointment.customerPhone, appointment.status, appointment.ticketNumber].filter(Boolean).join(' ').toLowerCase()
    return haystack.includes(search.toLowerCase())
  })
  const weeklySeries = analytics.length ? analytics : [4, 7, 6, 10, 8, 12, 9]

  const sidebarItems: Array<{ id: View; label: string }> = [
    { id: 'overview', label: copy.overview },
    { id: 'live', label: copy.live },
    { id: 'appointments', label: copy.appointments },
    { id: 'customers', label: copy.customers },
    { id: 'analytics', label: copy.analytics },
    { id: 'billing', label: copy.billing },
    { id: 'screen', label: copy.screen },
  ].filter((item) => getEnabled(item.id))

  const panelStyle: CSSProperties = {
    background: 'var(--bg-2)',
    border: '1px solid var(--border)',
    borderRadius: '24px',
    boxShadow: '0 24px 80px rgba(0,0,0,0.18)',
  }

  const sectionStyle: CSSProperties = {
    background: 'var(--bg-2)',
    border: '1px solid var(--border)',
    borderRadius: '24px',
    boxShadow: '0 24px 80px rgba(0,0,0,0.12)',
  }

  return (
    <main dir={dir} style={{ minHeight: '100vh', padding: '88px 20px 28px', background: 'var(--bg)' }}>
      <div style={{ maxWidth: '1600px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '280px minmax(0, 1fr)', gap: '18px', alignItems: 'start' }}>
          <aside style={{ ...panelStyle, position: 'sticky', top: '92px', padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: 'linear-gradient(135deg, var(--accent), var(--accent-2))', display: 'grid', placeItems: 'center', fontSize: '20px' }}>🏢</div>
              <div>
                <p style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--text-3)' }}>{copy.businessInfo}</p>
                <p style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-1)' }}>{activeQueueId ? `${copy.queueActive}` : copy.queueMissing}</p>
                {owner?.email && <p style={{ marginTop: '3px', color: 'var(--text-3)', fontSize: '12px' }}>{owner.email}</p>}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
              <input
                placeholder={copy.queuePlaceholder}
                value={queueIdInput}
                onChange={(e) => setQueueIdInput(e.target.value)}
                style={{ flex: 1, background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '14px', padding: '12px 14px', color: 'var(--text-1)', fontSize: '14px', outline: 'none' }}
              />
              <Button onClick={() => setQueueAndPersist(queueIdInput)}>{copy.loadQueue}</Button>
            </div>

            {recentQueues.length > 0 && (
              <div style={{ marginBottom: '14px' }}>
                <p style={{ marginBottom: '8px', color: 'var(--text-3)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{copy.recentQueues}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {recentQueues.map((queueId) => (
                    <button
                      key={queueId}
                      onClick={() => setQueueAndPersist(queueId)}
                      style={{
                        borderRadius: '999px',
                        border: '1px solid var(--border)',
                        background: activeQueueId === queueId ? 'rgba(124,109,250,0.12)' : 'transparent',
                        color: activeQueueId === queueId ? 'var(--accent-2)' : 'var(--text-2)',
                        padding: '5px 10px',
                        fontSize: '12px',
                        cursor: 'pointer',
                        fontFamily: 'inherit',
                      }}
                    >
                      {queueId}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '18px' }}>
              {sidebarItems.map((item) => (
                <motion.button
                  key={item.id}
                  onClick={() => setView(item.id)}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '12px', width: '100%', textAlign: 'left',
                    padding: '12px 14px', borderRadius: '14px', border: '1px solid',
                    borderColor: view === item.id ? 'rgba(124,109,250,0.35)' : 'var(--border)',
                    background: view === item.id ? 'rgba(124,109,250,0.10)' : 'transparent',
                    color: view === item.id ? 'var(--text-1)' : 'var(--text-2)', cursor: 'pointer',
                    fontSize: '14px', fontWeight: view === item.id ? 700 : 500,
                  }}
                >
                  <span style={{ width: '22px', textAlign: 'center' }}>{sidebarIcon[item.id]}</span>
                  <span>{item.label}</span>
                </motion.button>
              ))}
            </div>

            <div style={{ marginBottom: '16px', border: '1px solid var(--border)', borderRadius: '14px', padding: '12px' }}>
              <p style={{ fontSize: '11px', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-3)' }}>{copy.workspaceModules}</p>
              <div style={{ display: 'grid', gap: '6px' }}>
                {(
                  [
                    { id: 'overview', label: copy.overview },
                    { id: 'live', label: copy.live },
                    { id: 'appointments', label: copy.appointments },
                    { id: 'customers', label: copy.customers },
                    { id: 'analytics', label: copy.analytics },
                    { id: 'billing', label: copy.billing },
                    { id: 'screen', label: copy.screen },
                  ] as Array<{ id: View; label: string }>
                ).map((module) => (
                  <label key={module.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-2)', fontSize: '12px' }}>
                    <input
                      type="checkbox"
                      checked={getEnabled(module.id)}
                      onChange={() => toggleModule(module.id)}
                      style={{ accentColor: 'var(--accent)' }}
                    />
                    <span>{module.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div style={{ padding: '16px', borderRadius: '18px', background: 'linear-gradient(135deg, rgba(124,109,250,0.12), rgba(245,158,11,0.08))', border: '1px solid rgba(124,109,250,0.15)' }}>
              <p style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--text-3)', marginBottom: '8px' }}>{copy.plan}</p>
              <p style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-1)', marginBottom: '6px' }}>Pro Admin</p>
              <p style={{ fontSize: '13px', color: 'var(--text-2)', lineHeight: 1.5 }}>{copy.billingText}</p>
            </div>
          </aside>

          <section style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={sectionStyle}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', padding: '18px 20px', borderBottom: '1px solid var(--border)', flexWrap: 'wrap' }}>
                <div>
                  <p style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--text-3)', marginBottom: '6px' }}>{copy.overview}</p>
                  <h1 style={{ fontFamily: 'Syne,sans-serif', fontSize: 'clamp(28px, 3vw, 42px)', lineHeight: 1.05, color: 'var(--text-1)' }}>{copy.title}</h1>
                  <p style={{ color: 'var(--text-2)', fontSize: '14px', marginTop: '8px' }}>{copy.subtitle}</p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  <input
                    placeholder={copy.searchPlaceholder}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{ minWidth: '280px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '14px', padding: '12px 14px', color: 'var(--text-1)', outline: 'none' }}
                  />
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', borderRadius: '14px', background: 'rgba(124,109,250,0.10)', border: '1px solid rgba(124,109,250,0.18)' }}>
                    <span style={{ fontSize: '18px' }}>🏷️</span>
                    <div>
                      <p style={{ fontSize: '11px', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{copy.businessInfo}</p>
                      <p style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-1)' }}>{activeQueueId || copy.notAvailable}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ padding: '16px 20px', display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                <Button variant="ghost" onClick={handlePause}>{copy.pause}</Button>
                <Button variant="ghost" onClick={handleResume}>{copy.resume}</Button>
                <Button variant="ghost" onClick={handleResetCounter}>{copy.reset}</Button>
                <Button variant="ghost" onClick={handleMarkNoShow}>{copy.noshow}</Button>
                <Button variant="ghost" onClick={() => window.open(`/screen/${activeQueueId}`, '_blank')}>{copy.openScreen}</Button>
              </div>
            </div>

            {!activeQueueId ? (
              <div style={{ ...sectionStyle, minHeight: '360px', display: 'grid', placeItems: 'center', padding: '40px' }}>
                <div style={{ textAlign: 'center', maxWidth: '520px' }}>
                  <p style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--text-3)', marginBottom: '10px' }}>{copy.businessInfo}</p>
                  <h2 style={{ fontFamily: 'Syne,sans-serif', fontSize: '30px', color: 'var(--text-1)', marginBottom: '10px' }}>{copy.queueReady}</h2>
                  <p style={{ color: 'var(--text-2)', lineHeight: 1.7, marginBottom: '22px' }}>{copy.billingText}</p>
                  <Button onClick={() => setView('billing')}>{copy.billing}</Button>
                </div>
              </div>
            ) : (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, minmax(0, 1fr))', gap: '12px' }}>
                  <StatCard label={copy.waiting} value={state?.waitingCount || 0} accent delay={0} sparkData={weeklySeries} />
                  <StatCard label={copy.serving} value={state?.currentlyServing?.ticket_number || 0} delay={0.1} />
                  <StatCard label={copy.avgWait} value={Math.round((state?.averageWaitSeconds || 0) / 60)} unit="m" delay={0.2} />
                  <StatCard label={copy.rating} value={parseFloat(rating?.avg_rating || '0')} delay={0.3} accent />
                  <StatCard label={copy.queueSize} value={state?.tickets.length || 0} delay={0.4} />
                </div>

                <AnimatePresence mode="wait">
                  {view === 'overview' && (
                    <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '16px' }}>
                      <div style={sectionStyle}>
                        <div style={{ padding: '18px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <div>
                            <p style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-3)' }}>{copy.liveQueue}</p>
                            <h3 style={{ fontSize: '20px', color: 'var(--text-1)', marginTop: '6px' }}>{copy.queueActive}</h3>
                          </div>
                          <Sparkline data={weeklySeries} />
                        </div>
                        <div style={{ padding: '18px 20px', display: 'grid', gap: '12px' }}>
                          <Button onClick={handleCallNext} fullWidth size="lg">{copy.callNext}</Button>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '12px' }}>
                            <div style={{ padding: '14px', borderRadius: '16px', border: '1px solid var(--border)', background: 'rgba(255,255,255,0.03)' }}>
                              <p style={{ fontSize: '11px', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{copy.todaysAppointments}</p>
                              <p style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-1)', marginTop: '8px' }}>{appointments.length}</p>
                            </div>
                            <div style={{ padding: '14px', borderRadius: '16px', border: '1px solid var(--border)', background: 'rgba(255,255,255,0.03)' }}>
                              <p style={{ fontSize: '11px', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{copy.last7}</p>
                              <p style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-1)', marginTop: '8px' }}>{Math.max(...weeklySeries)}</p>
                            </div>
                          </div>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '12px' }}>
                            <div style={{ padding: '14px', borderRadius: '16px', border: '1px solid var(--border)', background: 'rgba(255,255,255,0.03)' }}>
                              <p style={{ fontSize: '11px', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{copy.serviceModel}</p>
                              <p style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-1)', marginTop: '8px' }}>{prefs.setup?.serviceModel || copy.notAvailable}</p>
                            </div>
                            <div style={{ padding: '14px', borderRadius: '16px', border: '1px solid var(--border)', background: 'rgba(255,255,255,0.03)' }}>
                              <p style={{ fontSize: '11px', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{copy.notificationChannel}</p>
                              <p style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-1)', marginTop: '8px' }}>{prefs.setup?.notifyChannel || copy.notAvailable}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div style={sectionStyle}>
                        <div style={{ padding: '18px 20px', borderBottom: '1px solid var(--border)' }}>
                          <p style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-3)' }}>{copy.support}</p>
                          <h3 style={{ fontSize: '20px', color: 'var(--text-1)', marginTop: '6px' }}>{copy.billingTitle}</h3>
                        </div>
                        <div style={{ padding: '18px 20px', display: 'grid', gap: '12px' }}>
                          <div style={{ padding: '14px', borderRadius: '16px', border: '1px solid var(--border)', background: 'rgba(124,109,250,0.08)' }}>
                            <p style={{ fontSize: '11px', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{copy.currentPlan}</p>
                            <p style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-1)', marginTop: '6px' }}>Pro Admin</p>
                          </div>
                          <div style={{ padding: '14px', borderRadius: '16px', border: '1px solid var(--border)', background: 'rgba(255,255,255,0.03)' }}>
                            <p style={{ fontSize: '11px', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{copy.invoice}</p>
                            <p style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-1)', marginTop: '6px' }}>{copy.notAvailable}</p>
                          </div>
                          <Button variant="ghost" onClick={() => setView('billing')}>{copy.billing}</Button>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {view === 'live' && (
                    <motion.div key="live" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={sectionStyle}>
                      <div style={{ padding: '18px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <p style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-3)' }}>{copy.liveQueue}</p>
                          <h3 style={{ fontSize: '20px', color: 'var(--text-1)', marginTop: '6px' }}>{copy.queueActive}</h3>
                        </div>
                        <span style={{ color: 'var(--text-3)', fontSize: '13px' }}>{state?.waitingCount || 0} {copy.waiting}</span>
                      </div>
                      <div style={{ padding: '18px 20px', display: 'grid', gap: '12px' }}>
                        <Button onClick={handleCallNext} fullWidth size="lg">{copy.callNext}</Button>
                        {loading && <p style={{ color: 'var(--text-3)', fontSize: '14px' }}>Connecting to queue...</p>}
                        {!filteredTickets.length ? (
                          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-3)' }}>{copy.emptyLive}</div>
                        ) : (
                          filteredTickets.map((ticket: Ticket, index: number) => (
                            <motion.div
                              key={ticket.id}
                              initial={{ opacity: 0, y: 8 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.03 }}
                              style={{ padding: '14px 16px', borderRadius: '16px', border: '1px solid var(--border)', background: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}
                            >
                              <div style={{ minWidth: '58px', fontFamily: 'Syne,sans-serif', fontSize: '18px', fontWeight: 800, color: ticket.priority ? '#f59e0b' : 'var(--text-1)' }}>#{ticket.ticket_number}</div>
                              {ticket.priority && <span style={{ fontSize: '11px', padding: '4px 8px', borderRadius: '100px', background: 'rgba(245,158,11,0.14)', color: '#f59e0b' }}>{copy.priority}: {ticket.priority_reason || copy.notAvailable}</span>}
                              <div style={{ flex: 1, minWidth: '220px', color: 'var(--text-2)', fontSize: '14px' }}>{ticket.customer_name || 'Anonymous'} {ticket.customer_phone ? `· ${ticket.customer_phone}` : ''}</div>
                              <span style={{ fontSize: '12px', color: 'var(--text-3)' }}>{copy.served}: {ticket.status}</span>
                              <Button onClick={() => void handleServe(ticket.id)} variant="ghost">{copy.served}</Button>
                            </motion.div>
                          ))
                        )}
                      </div>
                    </motion.div>
                  )}

                  {view === 'appointments' && (
                    <motion.div key="appointments" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={sectionStyle}>
                      <div style={{ padding: '18px 20px', borderBottom: '1px solid var(--border)' }}>
                        <p style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-3)' }}>{copy.appointments}</p>
                        <h3 style={{ fontSize: '20px', color: 'var(--text-1)', marginTop: '6px' }}>{copy.todaysAppointments}</h3>
                      </div>
                      <div style={{ padding: '18px 20px', display: 'grid', gap: '12px' }}>
                        {!filteredAppointments.length ? (
                          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-3)' }}>{copy.emptyAppointments}</div>
                        ) : (
                          filteredAppointments.map((appointment, index) => (
                            <motion.div key={appointment.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: index * 0.03 }} style={{ padding: '14px 16px', borderRadius: '16px', border: '1px solid var(--border)', background: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                              <span style={{ minWidth: '80px', fontSize: '13px', color: 'var(--accent-2)', fontWeight: 700 }}>{new Date(appointment.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                              <span style={{ flex: 1, minWidth: '220px', color: 'var(--text-1)', fontSize: '14px', fontWeight: 600 }}>{appointment.customerName}</span>
                              <span style={{ color: 'var(--text-3)', fontSize: '13px' }}>{appointment.customerPhone}</span>
                              <span style={{ padding: '4px 10px', borderRadius: '100px', fontSize: '11px', border: '1px solid var(--border)', color: 'var(--text-2)' }}>{appointment.status}</span>
                            </motion.div>
                          ))
                        )}
                      </div>
                    </motion.div>
                  )}

                  {view === 'customers' && (
                    <motion.div key="customers" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={sectionStyle}>
                      <div style={{ padding: '18px 20px', borderBottom: '1px solid var(--border)' }}>
                        <p style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-3)' }}>{copy.customers}</p>
                        <h3 style={{ fontSize: '20px', color: 'var(--text-1)', marginTop: '6px' }}>{copy.businessInfo}</h3>
                      </div>
                      <div style={{ padding: '18px 20px', display: 'grid', gap: '12px' }}>
                        {!queueTickets.length ? (
                          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-3)' }}>{copy.emptyCustomers}</div>
                        ) : (
                          queueTickets.map((ticket) => (
                            <div key={ticket.id} style={{ padding: '14px 16px', borderRadius: '16px', border: '1px solid var(--border)', background: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                              <span style={{ fontFamily: 'Syne,sans-serif', fontSize: '18px', fontWeight: 800, minWidth: '58px' }}>#{ticket.ticket_number}</span>
                              <span style={{ flex: 1, minWidth: '220px', color: 'var(--text-2)' }}>{ticket.customer_name || 'Anonymous'}</span>
                              <span style={{ color: 'var(--text-3)', fontSize: '13px' }}>{ticket.customer_phone || copy.notAvailable}</span>
                              <span style={{ color: 'var(--text-3)', fontSize: '13px' }}>{ticket.priority ? copy.priority : copy.notAvailable}</span>
                            </div>
                          ))
                        )}
                      </div>
                    </motion.div>
                  )}

                  {view === 'analytics' && (
                    <motion.div key="analytics" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={sectionStyle}>
                      <div style={{ padding: '18px 20px', borderBottom: '1px solid var(--border)' }}>
                        <p style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-3)' }}>{copy.analytics}</p>
                        <h3 style={{ fontSize: '20px', color: 'var(--text-1)', marginTop: '6px' }}>{copy.last7}</h3>
                      </div>
                      <div style={{ padding: '18px 20px', display: 'grid', gap: '16px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '12px' }}>
                          <div style={{ padding: '14px', borderRadius: '16px', border: '1px solid var(--border)', background: 'rgba(255,255,255,0.03)' }}>
                            <p style={{ fontSize: '11px', color: 'var(--text-3)', textTransform: 'uppercase' }}>{copy.waiting}</p>
                            <p style={{ fontSize: '24px', fontWeight: 800, marginTop: '8px' }}>{state?.waitingCount || 0}</p>
                          </div>
                          <div style={{ padding: '14px', borderRadius: '16px', border: '1px solid var(--border)', background: 'rgba(255,255,255,0.03)' }}>
                            <p style={{ fontSize: '11px', color: 'var(--text-3)', textTransform: 'uppercase' }}>{copy.peak}</p>
                            <p style={{ fontSize: '24px', fontWeight: 800, marginTop: '8px' }}>{Math.max(...weeklySeries)}</p>
                          </div>
                          <div style={{ padding: '14px', borderRadius: '16px', border: '1px solid var(--border)', background: 'rgba(255,255,255,0.03)' }}>
                            <p style={{ fontSize: '11px', color: 'var(--text-3)', textTransform: 'uppercase' }}>{copy.rating}</p>
                            <p style={{ fontSize: '24px', fontWeight: 800, marginTop: '8px' }}>{rating?.avg_rating || '—'}</p>
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '18px', flexWrap: 'wrap' }}>
                          <Sparkline data={weeklySeries} color="var(--accent)" height={42} />
                          <p style={{ color: 'var(--text-2)', fontSize: '14px', lineHeight: 1.6, maxWidth: '560px' }}>{copy.billingText}</p>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {view === 'billing' && (
                    <motion.div key="billing" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={sectionStyle}>
                      <div style={{ padding: '18px 20px', borderBottom: '1px solid var(--border)' }}>
                        <p style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-3)' }}>{copy.billing}</p>
                        <h3 style={{ fontSize: '20px', color: 'var(--text-1)', marginTop: '6px' }}>{copy.billingTitle}</h3>
                      </div>
                      <div style={{ padding: '18px 20px', display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '12px' }}>
                        <div style={{ padding: '16px', borderRadius: '18px', border: '1px solid var(--border)', background: 'rgba(124,109,250,0.08)' }}>
                          <p style={{ fontSize: '11px', color: 'var(--text-3)', textTransform: 'uppercase' }}>{copy.currentPlan}</p>
                          <p style={{ fontSize: '18px', fontWeight: 800, marginTop: '8px' }}>Pro Admin</p>
                          <p style={{ color: 'var(--text-2)', fontSize: '13px', marginTop: '8px' }}>Unlimited queues, live screen, analytics, and billing controls.</p>
                        </div>
                        <div style={{ padding: '16px', borderRadius: '18px', border: '1px solid var(--border)', background: 'rgba(255,255,255,0.03)' }}>
                          <p style={{ fontSize: '11px', color: 'var(--text-3)', textTransform: 'uppercase' }}>{copy.invoice}</p>
                          <p style={{ fontSize: '18px', fontWeight: 800, marginTop: '8px' }}>{copy.notAvailable}</p>
                          <p style={{ color: 'var(--text-2)', fontSize: '13px', marginTop: '8px' }}>Hook this card to your billing backend later.</p>
                        </div>
                        <div style={{ padding: '16px', borderRadius: '18px', border: '1px solid var(--border)', background: 'rgba(255,255,255,0.03)' }}>
                          <p style={{ fontSize: '11px', color: 'var(--text-3)', textTransform: 'uppercase' }}>{copy.support}</p>
                          <p style={{ fontSize: '18px', fontWeight: 800, marginTop: '8px' }}>24/7</p>
                          <p style={{ color: 'var(--text-2)', fontSize: '13px', marginTop: '8px' }}>Help, onboarding, and account support.</p>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {view === 'screen' && (
                    <motion.div key="screen" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ ...sectionStyle, display: 'grid', gridTemplateColumns: '0.9fr 1.1fr', gap: '16px', padding: '18px 20px' }}>
                      <div>
                        <p style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-3)' }}>{copy.screen}</p>
                        <h3 style={{ fontSize: '20px', color: 'var(--text-1)', marginTop: '6px' }}>{copy.qrTitle}</h3>
                        <p style={{ color: 'var(--text-2)', fontSize: '14px', lineHeight: 1.7, marginTop: '14px' }}>{copy.qrText}</p>
                        <div style={{ display: 'flex', gap: '10px', marginTop: '18px', flexWrap: 'wrap' }}>
                          <Button onClick={() => window.open(`/screen/${activeQueueId}`, '_blank')}>{copy.openScreen}</Button>
                          <Button variant="ghost" onClick={handleCallNext}>{copy.callNext}</Button>
                        </div>
                      </div>
                      <div style={{ display: 'grid', placeItems: 'center' }}>
                        {joinUrl ? (
                          <div style={{ background: 'white', padding: '18px', borderRadius: '18px' }}>
                            <QRCode value={joinUrl} size={200} />
                          </div>
                        ) : (
                          <div style={{ width: '240px', height: '240px', borderRadius: '18px', border: '1px dashed var(--border)', display: 'grid', placeItems: 'center', color: 'var(--text-3)' }}>{copy.notAvailable}</div>
                        )}
                        <p style={{ marginTop: '12px', fontSize: '12px', color: 'var(--text-3)', wordBreak: 'break-all', textAlign: 'center' }}>{joinUrl || copy.notAvailable}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            )}

            {loadError && <p style={{ color: '#f87171', fontSize: '13px' }}>{loadError}</p>}
          </section>
        </div>
      </div>
    </main>
  )
}
