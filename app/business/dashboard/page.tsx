'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import QRCode from 'react-qr-code'
import { useQueue } from '../../../hooks/useQueue'
import { api } from '../../../lib/api'
import { Button } from '../../../components/ui/Button'
import { Sparkline } from '../../../components/ui/Sparkline'
import { useLang } from '../../../components/providers/LangProvider'
import {
  ActionGroup,
  AppointmentRow,
  DashboardPanel,
  EmptyState,
  LoadQueueForm,
  MetricTile,
  QueueTicketRow,
  SearchField,
} from '../../../components/dashboard/DashboardComponents'
import type { Appointment, QueueState, Ticket } from '../../../shared/types'
import DashboardSidebar from '../../../components/dashboard/DashboardSidebar'
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
  overview: 'Home',
  live: 'Live',
  appointments: 'Appt',
  customers: 'Users',
  analytics: 'Data',
  billing: 'Bill',
  screen: 'TV',
}

const previewQueueState: QueueState = {
  queueId: 'main-branch',
  waitingCount: 4,
  averageWaitSeconds: 520,
  estimatedWaitForNext: 180,
  currentlyServing: {
    id: 'preview-ticket-41',
    queue_id: 'main-branch',
    customer_name: 'Maya Hassan',
    customer_phone: '+20 100 555 0141',
    ticket_number: 41,
    status: 'called',
    priority: false,
    joined_at: new Date(),
    updated_at: new Date(),
  },
  tickets: [
    { id: 'preview-ticket-42', queue_id: 'main-branch', customer_name: 'Omar Nabil', customer_phone: '+20 100 555 0142', ticket_number: 42, status: 'waiting', priority: false, joined_at: new Date(), updated_at: new Date() },
    { id: 'preview-ticket-43', queue_id: 'main-branch', customer_name: 'Lina Adel', customer_phone: '+20 100 555 0143', ticket_number: 43, status: 'waiting', priority: true, priority_reason: 'Accessibility support', joined_at: new Date(), updated_at: new Date() },
    { id: 'preview-ticket-44', queue_id: 'main-branch', customer_name: 'Guest visitor', customer_phone: '+20 100 555 0144', ticket_number: 44, status: 'waiting', priority: false, joined_at: new Date(), updated_at: new Date() },
    { id: 'preview-ticket-45', queue_id: 'main-branch', customer_name: 'Nada Samir', customer_phone: '+20 100 555 0145', ticket_number: 45, status: 'waiting', priority: false, joined_at: new Date(), updated_at: new Date() },
  ],
  appointments: [],
}

const previewAppointments: Appointment[] = [
  { id: 'preview-appointment-1', queueId: 'main-branch', customerName: 'Nada Samir', customerPhone: '+20 100 555 0145', scheduledAt: new Date(), durationMinutes: 20, status: 'arrived', ticketNumber: 45 },
  { id: 'preview-appointment-2', queueId: 'main-branch', customerName: 'Karim Fouad', customerPhone: '+20 100 555 0146', scheduledAt: new Date(Date.now() + 45 * 60 * 1000), durationMinutes: 15, status: 'scheduled', ticketNumber: 46 },
  { id: 'preview-appointment-3', queueId: 'main-branch', customerName: 'Salma Ali', customerPhone: '+20 100 555 0147', scheduledAt: new Date(Date.now() + 90 * 60 * 1000), durationMinutes: 15, status: 'scheduled', ticketNumber: 47 },
]

const copy = {
  en: {
    title: 'Business Dashboard',
    subtitle: 'Queue control, appointments, analytics, screen display, and billing in one admin workspace.',
    loadQueue: 'Load Queue',
    queuePlaceholder: 'Enter queue ID',
    searchPlaceholder: 'Search tickets, customers, or appointments',
    businessInfo: 'Business Info',
    live: 'Live',
    appointments: 'Appointments',
    customers: 'Customers',
    analytics: 'Analytics',
    billing: 'Billing',
    refresh: 'Refresh data',
    screen: 'Screen',
    overview: 'Overview',
    queueActive: 'Queue active',
    queueReady: 'Load a queue to unlock live data',
    queueMissing: 'No queue loaded yet',
    pause: 'Pause',
    resume: 'Resume',
    reset: 'Reset counter',
    noshow: 'No-show',
    openScreen: 'Open screen',
    callNext: 'Call next customer',
    waiting: 'Waiting',
    serving: 'Now serving',
    avgWait: 'Avg wait',
    rating: 'Rating',
    queueSize: 'Queue size',
    todaysAppointments: 'Today’s appointments',
    last7: 'Last 7 days',
    peak: 'Peak day',
    emptyLive: 'No customers are waiting right now',
    emptyAppointments: 'No appointments scheduled for today',
    emptyCustomers: 'No customers to display yet',
    billingTitle: 'Billing center',
    billingText: 'Plan, invoices, and usage are ready to connect to your billing backend.',
    currentPlan: 'Current plan',
    invoice: 'Latest invoice',
    usage: 'Usage',
    support: 'Support',
    qrTitle: 'Queue QR code',
    qrText: 'Print this QR code and place it at reception so customers can join instantly.',
    recentQueues: 'Recent queues',
    workspaceModules: 'Workspace modules',
    serviceModel: 'Service model',
    notificationChannel: 'Notification channel',
    liveQueue: 'Waiting list',
    served: 'Served',
    priority: 'Priority',
    notAvailable: 'Not available',
    anonymous: 'Anonymous',
    connecting: 'Connecting to queue...',
    owner: 'Owner',
  },
  ar: {
    title: 'لوحة تحكم الأعمال',
    subtitle: 'إدارة الطابور والمواعيد والتحليلات وشاشة العرض والفوترة من مساحة واحدة.',
    loadQueue: 'تحميل الطابور',
    queuePlaceholder: 'أدخل رقم الطابور',
    searchPlaceholder: 'ابحث في التذاكر أو العملاء أو المواعيد',
    businessInfo: 'معلومات العمل',
    live: 'مباشر',
    appointments: 'المواعيد',
    customers: 'العملاء',
    analytics: 'التحليلات',
    billing: 'الفوترة',
    refresh: 'تحديث البيانات',
    screen: 'الشاشة',
    overview: 'نظرة عامة',
    queueActive: 'الطابور نشط',
    queueReady: 'حمّل طابورًا لعرض البيانات الحية',
    queueMissing: 'لم يتم تحميل طابور بعد',
    pause: 'إيقاف',
    resume: 'استئناف',
    reset: 'إعادة الترقيم',
    noshow: 'عدم حضور',
    openScreen: 'فتح الشاشة',
    callNext: 'استدعاء العميل التالي',
    waiting: 'المنتظرون',
    serving: 'يُخدم الآن',
    avgWait: 'متوسط الانتظار',
    rating: 'التقييم',
    queueSize: 'حجم الطابور',
    todaysAppointments: 'مواعيد اليوم',
    last7: 'آخر 7 أيام',
    peak: 'أعلى يوم',
    emptyLive: 'لا يوجد عملاء في الطابور الآن',
    emptyAppointments: 'لا توجد مواعيد اليوم',
    emptyCustomers: 'لا يوجد عملاء للعرض بعد',
    billingTitle: 'مركز الفوترة',
    billingText: 'الخطة والفواتير والاستخدام جاهزة للربط بنظام الفوترة.',
    currentPlan: 'الخطة الحالية',
    invoice: 'آخر فاتورة',
    usage: 'الاستخدام',
    support: 'الدعم',
    qrTitle: 'رمز QR للطابور',
    qrText: 'اطبع هذا الرمز وضعه في الاستقبال حتى ينضم العملاء فورًا.',
    recentQueues: 'الطوابير الأخيرة',
    workspaceModules: 'وحدات مساحة العمل',
    serviceModel: 'نموذج الخدمة',
    notificationChannel: 'قناة الإشعارات',
    liveQueue: 'قائمة الانتظار',
    served: 'تمت الخدمة',
    priority: 'أولوية',
    notAvailable: 'غير متاح',
    anonymous: 'بدون اسم',
    connecting: 'جاري الاتصال بالطابور...',
    owner: 'المالك',
  },
}

export default function BusinessDashboard() {
  const { lang, dir } = useLang()
  const text = copy[lang]
  const [token, setToken] = useState('')
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
  const [previewMode, setPreviewMode] = useState(false)
  const { state, loading } = useQueue(activeQueueId)

  const getEnabled = useCallback(
    (module: View) => prefs.modules?.[module] !== false,
    [prefs.modules]
  )

  useEffect(() => {
    const storedToken = localStorage.getItem('token') || ''
    const enabledPreview = localStorage.getItem('preview:enabled') === 'true' || storedToken === 'preview-token'
    const storedQueue = localStorage.getItem('workspace:last-queue-id') || (enabledPreview ? 'main-branch' : '')
    const rawPrefs = localStorage.getItem('workspace:preferences')
    const storedRecent = localStorage.getItem('workspace:recent-queues')

    setToken(storedToken)
    setPreviewMode(enabledPreview)
    if (storedQueue) {
      setActiveQueueId(storedQueue)
      setQueueIdInput(storedQueue)
    }
    if (rawPrefs) {
      try {
        setPrefs(JSON.parse(rawPrefs) as WorkspacePreferences)
      } catch {
        setPrefs({})
      }
    }
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
    if (token === 'preview-token') {
      setOwner({ email: 'operations@queuely.app', role: 'business' })
      return
    }

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
    if (!activeQueueId) return
    if (previewMode) {
      setAppointments(previewAppointments)
      return
    }
    const data = await api.get(`/queues/${activeQueueId}/state`, token)
    if (data.ok === false) {
      setLoadError((data.error as string) || 'Could not load appointments')
      return
    }
    setAppointments(Array.isArray(data?.appointments) ? data.appointments : [])
  }, [activeQueueId, previewMode, token])

  const fetchRating = useCallback(async () => {
    if (!activeQueueId) return
    if (previewMode) {
      setRating({ avg_rating: '4.8', total_reviews: '126' })
      return
    }
    const data = await api.get(`/queues/${activeQueueId}/rating`, token)
    if (data.ok === false) {
      setLoadError((data.error as string) || 'Could not load rating')
      return
    }
    setRating(data)
  }, [activeQueueId, previewMode, token])

  const fetchQR = useCallback(async () => {
    if (!activeQueueId) return
    if (previewMode) {
      setJoinUrl(`${window.location.origin}/join/main-branch`)
      return
    }
    const data = await api.get(`/queues/${activeQueueId}/qr`, token)
    if (data.ok === false) {
      setLoadError((data.error as string) || 'Could not load QR code')
      return
    }
    setJoinUrl(data.joinUrl || '')
  }, [activeQueueId, previewMode, token])

  const fetchAnalytics = useCallback(async () => {
    if (!activeQueueId) return
    if (previewMode) {
      setAnalytics([8, 12, 10, 16, 14, 20, 18])
      return
    }
    const data = await api.get(`/queues/${activeQueueId}/weekly-stats`, token)
    if (data.ok === false) {
      setLoadError((data.error as string) || 'Could not load analytics')
      return
    }
    setAnalytics(Array.isArray(data) ? data.map((row: { total: string | number }) => Number(row.total) || 0) : [])
  }, [activeQueueId, previewMode, token])

  useEffect(() => {
    if (!activeQueueId) return
    setLoadError('')
    void Promise.all([fetchAppointments(), fetchRating(), fetchQR(), fetchAnalytics()])
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

  const toggleModule = (module: string) => {
    const viewId = module as View
    const updatedPrefs: WorkspacePreferences = {
      ...prefs,
      modules: {
        ...prefs.modules,
        [viewId]: prefs.modules?.[viewId] === false,
      },
    }
    setPrefs(updatedPrefs)
    localStorage.setItem('workspace:preferences', JSON.stringify(updatedPrefs))
  }

  const queueAction = async (path: string, body = {}) => {
    if (previewMode || !activeQueueId) return
    const data = await api.post(path, body, token)
    if (data.ok === false) {
      setLoadError((data.error as string) || 'Queue action failed')
      return
    }
    await refreshQueueData()
  }

  const patchQueueAction = async (path: string, body = {}) => {
    if (previewMode || !activeQueueId) return
    const data = await api.patch(path, body, token)
    if (data.ok === false) {
      setLoadError((data.error as string) || 'Queue action failed')
      return
    }
    await refreshQueueData()
  }

  const handleServe = async (ticketId: string) => {
    if (previewMode) return
    await patchQueueAction(`/queues/tickets/${ticketId}/serve`)
  }

  const displayState = previewMode ? previewQueueState : state
  const queueTickets = useMemo(() => displayState?.tickets || [], [displayState])
  const weeklySeries = analytics.length ? analytics : [4, 7, 6, 10, 8, 12, 9]
  const averageWaitMinutes = Math.round((displayState?.averageWaitSeconds || 0) / 60)

  const filteredTickets = useMemo(() => {
    const query = search.toLowerCase()
    return queueTickets.filter((ticket) =>
      [ticket.ticket_number, ticket.customer_name, ticket.customer_phone, ticket.priority_reason]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(query)
    )
  }, [queueTickets, search])

  const filteredAppointments = useMemo(() => {
    const query = search.toLowerCase()
    return appointments.filter((appointment) =>
      [appointment.customerName, appointment.customerPhone, appointment.status, appointment.ticketNumber]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(query)
    )
  }, [appointments, search])

  const sidebarItems = [
    { id: 'overview', label: text.overview },
    { id: 'live', label: text.live },
    { id: 'appointments', label: text.appointments },
    { id: 'customers', label: text.customers },
    { id: 'analytics', label: text.analytics },
    { id: 'billing', label: text.billing },
    { id: 'screen', label: text.screen },
  ] satisfies Array<{ id: View; label: string }>

  const enabledSidebarItems = sidebarItems.filter((item) => getEnabled(item.id))
  const modules = sidebarItems.map((item) => ({
    id: item.id,
    label: item.label,
    enabled: getEnabled(item.id),
  }))

  const topActions = [
    { label: text.callNext, onClick: () => void queueAction(`/queues/${activeQueueId}/call-next`), variant: 'primary' as const, disabled: !activeQueueId },
    { label: text.pause, onClick: () => void patchQueueAction(`/queues/${activeQueueId}/pause`), disabled: !activeQueueId },
    { label: text.resume, onClick: () => void patchQueueAction(`/queues/${activeQueueId}/resume`), disabled: !activeQueueId },
    { label: text.reset, onClick: () => void queueAction(`/queues/${activeQueueId}/reset-counter`), variant: 'danger' as const, disabled: !activeQueueId },
    { label: text.noshow, onClick: () => void queueAction(`/queues/${activeQueueId}/mark-no-show`), disabled: !activeQueueId },
  ]

  return (
    <main dir={dir} className="dashboard-page">
      <div className="dashboard-shell">
        <DashboardSidebar
    owner={owner?.email}
    items={enabledSidebarItems}
    activeView={view}
    modules={modules}
    moduleTitle={text.workspaceModules}
    onToggleModule={toggleModule}
    onChangeView={setView}
/>

        <section className="dashboard-main">
          <div className="dashboard-header">
            <div>
              <h1>{text.title}</h1>
              <p>{text.subtitle}</p>
            </div>
            <SearchField value={search} placeholder={text.searchPlaceholder} onChange={setSearch} />
          </div>

          <LoadQueueForm
            queueId={queueIdInput}
            placeholder={text.queuePlaceholder}
            submitLabel={text.loadQueue}
            recentLabel={text.recentQueues}
            recentQueues={recentQueues}
            onChange={setQueueIdInput}
            onSubmit={() => setQueueAndPersist(queueIdInput)}
            onPickRecent={setQueueAndPersist}
          />

          <div className="dashboard-status-strip">
            <p className="dashboard-status-card">
              {activeQueueId ? `${text.queueActive}: ${activeQueueId}` : text.queueMissing}
              {loading && activeQueueId ? ` · ${text.connecting}` : ''}
            </p>
            <ActionGroup actions={topActions} />
          </div>

          <div className="dashboard-grid dashboard-stats-grid">
            <MetricTile label={text.waiting} value={displayState?.waitingCount || 0} tone="accent" />
            <MetricTile label={text.serving} value={displayState?.currentlyServing?.ticket_number ? `#${displayState.currentlyServing.ticket_number}` : text.notAvailable} />
            <MetricTile label={text.avgWait} value={`${averageWaitMinutes}m`} tone="success" />
            <MetricTile label={text.rating} value={rating?.avg_rating || text.notAvailable} detail={rating?.total_reviews ? `${rating.total_reviews} reviews` : undefined} />
          </div>

          {view === 'overview' && (
            <div className="dashboard-grid dashboard-overview-grid">
              <DashboardPanel eyebrow={text.liveQueue} title={activeQueueId ? text.queueActive : text.queueReady}>
                <Button onClick={() => void queueAction(`/queues/${activeQueueId}/call-next`)} disabled={!activeQueueId} fullWidth size="lg">
                  {text.callNext}
                </Button>
                <div className="dashboard-grid dashboard-two-grid">
                  <MetricTile label={text.todaysAppointments} value={appointments.length} />
                  <MetricTile label={text.peak} value={Math.max(...weeklySeries)} />
                  <MetricTile label={text.serviceModel} value={prefs.setup?.serviceModel || text.notAvailable} />
                  <MetricTile label={text.notificationChannel} value={prefs.setup?.notifyChannel || text.notAvailable} />
                </div>
                <Sparkline data={weeklySeries} color="var(--green)" height={48} />
              </DashboardPanel>

              <DashboardPanel eyebrow={text.support} title={text.billingTitle} action={<Button variant="ghost" onClick={() => setView('billing')}>{text.billing}</Button>}>
                <MetricTile label={text.currentPlan} value="Pro Admin" tone="accent" />
                <MetricTile label={text.invoice} value={text.notAvailable} />
                <p style={{ color: 'var(--text-2)', lineHeight: 1.6 }}>{text.billingText}</p>
              </DashboardPanel>
            </div>
          )}

          {view === 'live' && (
            <DashboardPanel eyebrow={text.liveQueue} title={text.queueActive} action={<span className="dashboard-status-card">{displayState?.waitingCount || 0} {text.waiting}</span>}>
              <Button onClick={() => void queueAction(`/queues/${activeQueueId}/call-next`)} disabled={!activeQueueId} fullWidth size="lg">
                {text.callNext}
              </Button>
              {!filteredTickets.length ? (
                <EmptyState message={text.emptyLive} />
              ) : (
                filteredTickets.map((ticket: Ticket) => (
                  <QueueTicketRow
                    key={ticket.id}
                    ticket={ticket}
                    labels={text}
                    onServe={(ticketId) => void handleServe(ticketId)}
                  />
                ))
              )}
            </DashboardPanel>
          )}

          {view === 'appointments' && (
            <DashboardPanel eyebrow={text.appointments} title={text.todaysAppointments}>
              {!filteredAppointments.length ? (
                <EmptyState message={text.emptyAppointments} />
              ) : (
                filteredAppointments.map((appointment) => (
                  <AppointmentRow key={appointment.id} appointment={appointment} />
                ))
              )}
            </DashboardPanel>
          )}

          {view === 'customers' && (
            <DashboardPanel eyebrow={text.customers} title={text.businessInfo}>
              {!queueTickets.length ? (
                <EmptyState message={text.emptyCustomers} />
              ) : (
                queueTickets.map((ticket) => (
                  <QueueTicketRow key={ticket.id} ticket={ticket} labels={text} />
                ))
              )}
            </DashboardPanel>
          )}

          {view === 'analytics' && (
            <DashboardPanel eyebrow={text.analytics} title={text.last7}>
              <div className="dashboard-grid dashboard-three-grid">
                <MetricTile label={text.waiting} value={displayState?.waitingCount || 0} />
                <MetricTile label={text.peak} value={Math.max(...weeklySeries)} tone="warning" />
                <MetricTile label={text.rating} value={rating?.avg_rating || text.notAvailable} />
              </div>
              <Sparkline data={weeklySeries} color="var(--accent)" height={58} />
              <p style={{ color: 'var(--text-2)', lineHeight: 1.6 }}>{text.billingText}</p>
            </DashboardPanel>
          )}

          {view === 'billing' && (
            <DashboardPanel eyebrow={text.billing} title={text.billingTitle}>
              <div className="dashboard-grid dashboard-three-grid">
                <MetricTile label={text.currentPlan} value="Pro Admin" detail="Unlimited queues, live screen, analytics, and billing controls." tone="accent" />
                <MetricTile label={text.invoice} value={text.notAvailable} detail="Connect this card to invoices from the billing backend." />
                <MetricTile label={text.support} value="24/7" detail="Help, onboarding, and account support." tone="success" />
              </div>
            </DashboardPanel>
          )}

          {view === 'screen' && (
            <DashboardPanel eyebrow={text.screen} title={text.qrTitle}>
              <div className="dashboard-grid dashboard-two-grid">
                <div>
                  <p style={{ color: 'var(--text-2)', lineHeight: 1.7 }}>{text.qrText}</p>
                  <div className="dashboard-action-group" style={{ marginTop: 16 }}>
                    <Button onClick={() => window.open(`/screen/${activeQueueId}`, '_blank')} disabled={!activeQueueId}>
                      {text.openScreen}
                    </Button>
                    <Button variant="ghost" onClick={() => void queueAction(`/queues/${activeQueueId}/call-next`)} disabled={!activeQueueId}>
                      {text.callNext}
                    </Button>
                  </div>
                </div>
                <div className="dashboard-qr-box">
                  {joinUrl ? (
                    <div className="dashboard-qr-frame">
                      <QRCode value={joinUrl} size={200} />
                    </div>
                  ) : (
                    <div className="dashboard-qr-placeholder">{text.notAvailable}</div>
                  )}
                  <p style={{ color: 'var(--text-3)', fontSize: 12, overflowWrap: 'anywhere' }}>{joinUrl || text.notAvailable}</p>
                </div>
              </div>
            </DashboardPanel>
          )}

          {loadError && <p className="dashboard-error">{loadError}</p>}
        </section>
      </div>
    </main>
  )
}
