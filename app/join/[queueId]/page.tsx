'use client'
import { useEffect, useMemo, useState, type CSSProperties } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useParams } from 'next/navigation'
import { api } from '../../../lib/api'
import { TicketCard } from '../../../components/ui/TicketCard'
import { Button } from '../../../components/ui/Button'
import { useLang } from '../../../components/providers/LangProvider'
import type { Ticket, Queue } from '../../../../shared/types'
import { PRIORITY_REASONS } from '../../../shared/constants'

export default function JoinQueue() {
  const { queueId } = useParams<{ queueId: string }>()
  const { lang, dir, t } = useLang()
  const isArabic = lang === 'ar'

  const [queue, setQueue] = useState<Queue | null>(null)
  const [ticket, setTicket] = useState<Ticket | null>(null)
  const [position, setPosition] = useState(0)
  const [avgWait, setAvgWait] = useState(0)
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState<'info' | 'form' | 'ticket'>('info')
  const [form, setForm] = useState({ name: '', phone: '', priority: false, priorityReason: '' })
  const [isPriority, setIsPriority] = useState(false)

  const copy = useMemo(() => ({
    stepInfo: isArabic ? 'معلومات الطابور' : 'Queue details',
    stepForm: isArabic ? 'بياناتك' : 'Your details',
    stepTicket: isArabic ? 'التذكرة' : 'Your ticket',
    back: isArabic ? 'رجوع' : 'Back',
    priorityTitle: isArabic ? 'أولوية دخول' : 'Priority access',
    priorityText: isArabic ? 'كبار السن، الحمل، الإعاقة، أو الحالات الطارئة' : 'Elderly, pregnant, disability, or emergency',
    join: isArabic ? 'انضم للطابور' : 'Join Queue',
    loading: isArabic ? '...جاري الانضمام' : 'Joining...',
    queueEmpty: isArabic ? 'لم يتم العثور على بيانات الطابور' : 'Queue details not loaded yet',
    queuePosition: isArabic ? 'ترتيبك' : 'Your position',
    avgWait: isArabic ? 'متوسط الانتظار' : 'Avg wait',
    phone: isArabic ? 'رقم الهاتف (لـ WhatsApp)' : 'Phone number (for WhatsApp)',
    name: isArabic ? 'اسمك' : 'Your name',
    anonymous: isArabic ? 'مجهول' : 'Anonymous',
    waitingNotice: isArabic ? 'سنرسل رسالة WhatsApp عندما يقترب دورك' : 'We will send a WhatsApp message when your turn is near',
    chooseReason: isArabic ? 'اختر سبب الأولوية' : 'Choose a priority reason',
    priority: isArabic ? 'أولوية' : 'Priority',
    live: isArabic ? 'مباشر' : 'Live',
    eta: isArabic ? 'متوقع' : 'ETA',
    peopleAhead: isArabic ? 'قبلك' : 'Ahead of you',
  }), [isArabic])

  useEffect(() => {
    const fetchQueue = async () => {
      const data = await api.get(`/queues/${queueId}`)
      setQueue(data)
    }
    if (queueId) void fetchQueue()
  }, [queueId])

  const handleJoin = async () => {
    setLoading(true)
    try {
      const data = await api.post(`/queues/${queueId}/join`, {
        customerName: form.name,
        customerPhone: form.phone,
        priority: isPriority,
        priorityReason: form.priorityReason,
      })
      setTicket(data)

      const state = await api.get(`/queues/${queueId}/state`)
      const pos = state.tickets.findIndex((current: Ticket) => current.id === data.id) + 1
      setPosition(pos)
      setAvgWait(state.averageWaitSeconds)
      setStep('ticket')
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const pageStyle: CSSProperties = {
    minHeight: '100vh',
    padding: '88px 20px 32px',
  }

  const panelStyle: CSSProperties = {
    background: 'var(--bg-2)',
    border: '1px solid var(--border)',
    borderRadius: '28px',
    boxShadow: '0 24px 80px rgba(0,0,0,0.16)',
  }

  const queueMeta = [
    { label: copy.live, value: queue ? 'Open' : '—' },
    { label: copy.queuePosition, value: position || '—' },
    { label: copy.eta, value: `${Math.max(1, Math.round(avgWait / 60))}m` },
  ]

  return (
    <main dir={dir} className="customer-page" style={pageStyle}>
      <div style={{ maxWidth: '1140px', margin: '0 auto' }}>
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            ...panelStyle,
            padding: '30px',
            marginBottom: '18px',
            background: 'linear-gradient(135deg, rgba(124,109,250,0.12), rgba(245,158,11,0.08)), var(--bg-2)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '20px', flexWrap: 'wrap' }}>
            <div style={{ maxWidth: '720px' }}>
              <p style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.14em', color: 'var(--accent)', marginBottom: '12px' }}>{copy.stepInfo}</p>
              <h1 style={{ fontFamily: 'Syne,sans-serif', fontSize: 'clamp(30px, 4.6vw, 54px)', lineHeight: 0.98, letterSpacing: '-0.05em', color: 'var(--text-1)', marginBottom: '14px' }}>
                {queue?.name || t.join.title}
              </h1>
              <p style={{ color: 'var(--text-2)', fontSize: '16px', lineHeight: 1.8, maxWidth: '680px' }}>{queue?.description || t.join.subtitle}</p>
            </div>
            <div style={{ minWidth: '220px', display: 'flex', justifyContent: 'flex-end' }}>
              <div style={{ padding: '14px 16px', borderRadius: '18px', border: '1px solid var(--border)', background: 'rgba(255,255,255,0.04)', minWidth: '220px' }}>
                <p style={{ fontSize: '11px', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px' }}>{copy.priorityTitle}</p>
                <p style={{ color: 'var(--text-1)', fontSize: '13px', lineHeight: 1.7 }}>{copy.priorityText}</p>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '12px', marginTop: '18px' }}>
            {queueMeta.map((item) => (
              <div key={item.label} style={{ padding: '16px', borderRadius: '18px', border: '1px solid var(--border)', background: 'rgba(255,255,255,0.03)' }}>
                <p style={{ fontSize: '11px', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{item.label}</p>
                <p style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-1)', marginTop: '8px' }}>{item.value}</p>
              </div>
            ))}
          </div>
        </motion.section>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 0.92fr) minmax(0, 1.08fr)', gap: '18px', alignItems: 'start' }}>
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.06 }}
            style={{ ...panelStyle, padding: '28px' }}
          >
            <p style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--text-3)', marginBottom: '10px' }}>{copy.stepInfo}</p>
            <h2 style={{ fontFamily: 'Syne,sans-serif', fontSize: '26px', fontWeight: 800, color: 'var(--text-1)', marginBottom: '12px' }}>{queue?.name || t.join.title}</h2>
            <div style={{ display: 'grid', gap: '10px', marginBottom: '18px' }}>
              <div style={{ padding: '14px 16px', borderRadius: '16px', border: '1px solid var(--border)', background: 'rgba(255,255,255,0.03)' }}>
                <p style={{ color: 'var(--text-3)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>{copy.live}</p>
                <p style={{ color: 'var(--text-1)', fontSize: '14px', lineHeight: 1.7 }}>{queue?.serviceType || copy.queueEmpty}</p>
              </div>
              <div style={{ padding: '14px 16px', borderRadius: '16px', border: '1px solid var(--border)', background: 'rgba(255,255,255,0.03)' }}>
                <p style={{ color: 'var(--text-3)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>{copy.avgWait}</p>
                <p style={{ color: 'var(--text-1)', fontSize: '14px', lineHeight: 1.7 }}>{Math.max(1, Math.round(avgWait / 60))} {isArabic ? 'دقيقة' : 'minutes'}</p>
              </div>
            </div>
            <div style={{ padding: '16px', borderRadius: '18px', border: '1px solid var(--border)', background: 'rgba(255,255,255,0.03)', marginBottom: '18px' }}>
              <p style={{ color: 'var(--text-3)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>{copy.priorityTitle}</p>
              <p style={{ color: 'var(--text-1)', lineHeight: 1.7 }}>{copy.priorityText}</p>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              <Button onClick={() => setStep('form')}>{t.join.button}</Button>
              <Button variant="ghost" onClick={() => setStep('info')}>{copy.back}</Button>
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            style={{ ...panelStyle, padding: '28px' }}
          >
            <AnimatePresence mode="wait">
              {step === 'info' && (
                <motion.div key="info" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <p style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--text-3)', marginBottom: '10px' }}>{copy.stepForm}</p>
                  <h2 style={{ fontFamily: 'Syne,sans-serif', fontSize: '28px', fontWeight: 800, color: 'var(--text-1)', marginBottom: '12px' }}>{t.join.title}</h2>
                  <p style={{ color: 'var(--text-2)', fontSize: '14px', lineHeight: 1.7, marginBottom: '20px' }}>{t.join.subtitle}</p>

                  <div style={{ display: 'grid', gap: '12px' }}>
                    <div style={{ padding: '16px', borderRadius: '18px', border: '1px solid var(--border)', background: 'rgba(255,255,255,0.03)' }}>
                      <p style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-3)', marginBottom: '6px' }}>{copy.peopleAhead}</p>
                      <p style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-1)' }}>{position > 0 ? position - 1 : '—'}</p>
                    </div>
                    <div style={{ padding: '16px', borderRadius: '18px', border: '1px solid var(--border)', background: 'rgba(255,255,255,0.03)' }}>
                      <p style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-3)', marginBottom: '6px' }}>{copy.waitingNotice}</p>
                      <p style={{ color: 'var(--text-1)', lineHeight: 1.7 }}>{copy.waitingNotice}</p>
                    </div>
                  </div>

                  <div style={{ marginTop: '18px' }}>
                    <Button onClick={() => setStep('form')} fullWidth size="lg">{t.join.button}</Button>
                  </div>
                </motion.div>
              )}

              {step === 'form' && (
                <motion.div key="form" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <p style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--text-3)', marginBottom: '10px' }}>{copy.stepForm}</p>
                  <h2 style={{ fontFamily: 'Syne,sans-serif', fontSize: '28px', fontWeight: 800, color: 'var(--text-1)', marginBottom: '10px' }}>{t.join.title}</h2>
                  <p style={{ color: 'var(--text-2)', fontSize: '14px', lineHeight: 1.7, marginBottom: '20px' }}>{t.join.subtitle}</p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '18px' }}>
                    <input
                      placeholder={copy.name}
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '14px', padding: '14px 16px', color: 'var(--text-1)', outline: 'none' }}
                    />
                    <input
                      placeholder={copy.phone}
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '14px', padding: '14px 16px', color: 'var(--text-1)', outline: 'none' }}
                    />
                  </div>

                  <button
                    onClick={() => setIsPriority(!isPriority)}
                    style={{ width: '100%', background: isPriority ? 'rgba(245,158,11,0.10)' : 'rgba(255,255,255,0.03)', border: `1px solid ${isPriority ? 'rgba(245,158,11,0.25)' : 'var(--border)'}`, borderRadius: '18px', padding: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '18px', color: 'var(--text-1)', textAlign: 'left' }}
                  >
                    <span style={{ fontSize: '20px' }}>⭐</span>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: '14px', fontWeight: 700, color: isPriority ? '#f59e0b' : 'var(--text-1)' }}>{copy.priority}</p>
                      <p style={{ fontSize: '12px', color: 'var(--text-3)', marginTop: '4px' }}>{copy.priorityText}</p>
                    </div>
                    <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: '2px solid', borderColor: isPriority ? '#f59e0b' : 'var(--text-3)', background: isPriority ? '#f59e0b' : 'transparent', display: 'grid', placeItems: 'center', color: 'white', fontSize: '12px' }}>
                      {isPriority && '✓'}
                    </div>
                  </button>

                  <AnimatePresence>
                    {isPriority && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ marginBottom: '18px' }}>
                        <p style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-3)', marginBottom: '10px' }}>{copy.chooseReason}</p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                          {PRIORITY_REASONS.map((reason) => (
                            <motion.button
                              key={reason}
                              onClick={() => setForm({ ...form, priorityReason: reason })}
                              whileTap={{ scale: 0.96 }}
                              style={{ background: form.priorityReason === reason ? 'rgba(245,158,11,0.18)' : 'rgba(255,255,255,0.03)', border: `1px solid ${form.priorityReason === reason ? 'rgba(245,158,11,0.35)' : 'var(--border)'}`, borderRadius: '999px', padding: '8px 14px', color: form.priorityReason === reason ? '#f59e0b' : 'var(--text-2)', fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit' }}
                            >
                              {reason}
                            </motion.button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div style={{ display: 'flex', gap: '10px' }}>
                    <Button variant="ghost" onClick={() => setStep('info')}>{copy.back}</Button>
                    <Button onClick={handleJoin} disabled={loading || !form.name} fullWidth>{loading ? copy.loading : copy.join}</Button>
                  </div>
                </motion.div>
              )}

              {step === 'ticket' && ticket && (
                <motion.div key="ticket" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}>
                  <p style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--text-3)', marginBottom: '12px' }}>{copy.stepTicket}</p>
                  <TicketCard ticketNumber={ticket.ticket_number} position={position} avgWaitSeconds={avgWait} called={false} />
                  <div style={{ marginTop: '20px', padding: '16px', borderRadius: '18px', border: '1px solid var(--border)', background: 'rgba(255,255,255,0.03)' }}>
                    <p style={{ color: 'var(--text-2)', fontSize: '14px', lineHeight: 1.7 }}>{copy.waitingNotice}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.section>
        </div>
      </div>
    </main>
  )
}
