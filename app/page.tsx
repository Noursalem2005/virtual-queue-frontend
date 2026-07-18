'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useTheme } from 'next-themes'
import { gsap } from 'gsap'
import Link from 'next/link'
import { Button } from '../components/ui/Button'
import { Sparkline } from '../components/ui/Sparkline'
import { useLang } from '../components/providers/LangProvider'

const previewAccount = {
  queueId: 'main-branch',
}


const floatingTickets = [
  { number: 12, x: '3%', y: '28%', delay: 0, color: 'var(--accent)' },
  { number: 28, x: '90%', y: '30%', delay: .4, color: 'var(--green)' },
  { number: 41, x: '4%', y: '82%', delay: .8, color: 'var(--accent-2)' },
  { number: 56, x: '92%', y: '78%', delay: 1.2, color: 'var(--accent)' },
  { number: 73, x: '50%', y: '6%', delay: .6, color: 'var(--green)' },
  { number: 91, x: '62%', y: '90%', delay: 1.0, color: 'var(--accent-2)' },
]

const featureCards = [
  { label: 'Live queue', value: '42 waiting', detail: 'Call, serve, pause, resume, no-show, and priority tickets.' },
  { label: 'Customer join', value: 'QR ready', detail: 'Visitors join from their phone and receive a real ticket view.' },
  { label: 'Appointments', value: '12 today', detail: 'Scheduled visits connect directly to queue operations.' },
  { label: 'Analytics', value: '73% faster', detail: 'Weekly traffic, wait time, ratings, and service performance.' },
]

const workflow = [
  { step: '01', title: 'Customer joins', text: 'Scan QR, choose service, receive ticket number.' },
  { step: '02', title: 'Staff controls', text: 'Dashboard updates the queue and current serving ticket.' },
  { step: '03', title: 'Screen updates', text: 'Reception display and notifications keep visitors informed.' },
]

const seedPreview = () => {
  localStorage.setItem('token', 'preview-token')
  localStorage.setItem('preview:enabled', 'true')
  localStorage.setItem('workspace:last-queue-id', previewAccount.queueId)
  localStorage.setItem('workspace:recent-queues', JSON.stringify([previewAccount.queueId, 'clinic-east', 'branch-02']))
  localStorage.setItem('workspace:preferences', JSON.stringify({
    setup: {
      serviceModel: 'Hybrid walk-ins and appointments',
      dailyVolume: '120-180 visitors',
      notifyChannel: 'SMS + email',
      primaryGoal: 'Reduce waiting time',
    },
    modules: {
      overview: true,
      live: true,
      appointments: true,
      customers: true,
      analytics: true,
      billing: true,
      screen: true,
    },
  }))
}

export default function Home() {
  const { t, dir, lang } = useLang()
  const { resolvedTheme } = useTheme()
  const orbRef = useRef<HTMLDivElement>(null)
  const nav = t.nav || {}
  const isArabic = lang === 'ar'

  const featureCardsLocalized = isArabic
    ? [
        { label: 'الطابور المباشر', value: '42 منتظر', detail: 'استدعاء، خدمة، إيقاف، استئناف، عدم حضور، وأولوية.' },
        { label: 'الانضمام للعميل', value: 'QR جاهز', detail: 'ينضم الزائر من الهاتف ويستلم تذكرة واضحة فورًا.' },
        { label: 'المواعيد', value: '12 اليوم', detail: 'المواعيد المجدولة ترتبط مباشرة بإدارة الطابور.' },
        { label: 'التحليلات', value: '73% أسرع', detail: 'حركة أسبوعية، أوقات الانتظار، التقييم، والأداء.' },
      ]
    : featureCards

  const workflowLocalized = isArabic
    ? [
        { step: '01', title: 'ينضم العميل', text: 'يمسح QR، يختار الخدمة، ويستلم رقم التذكرة.' },
        { step: '02', title: 'يتحكم الموظف', text: 'لوحة التحكم تحدّث الطابور والتذكرة الحالية.' },
        { step: '03', title: 'تتحدث الشاشة', text: 'شاشة الاستقبال والإشعارات تبقي الزائرين على اطلاع.' },
      ]
    : workflow


  useEffect(() => {
    const move = (e: MouseEvent) => {
      if (!orbRef.current) return
      const x = (e.clientX / window.innerWidth - .5) * 20
      const y = (e.clientY / window.innerHeight - .5) * 20
      gsap.to(orbRef.current,{x,y,duration:1.5,ease:'power2.out'})
    }
    window.addEventListener('mousemove',move)
    return ()=>window.removeEventListener('mousemove',move)
  },[])

  return (
    <main dir={dir} className="home-main" style={{position:'relative',overflow:'hidden'}}
><style>{`@media(max-width:900px){.floating-ticket{display:none}.hero-actions{display:grid!important;grid-template-columns:1fr 1fr;gap:10px!important}.features-grid{grid-template-columns:1fr!important}.preview-grid{grid-template-columns:1fr!important}}@media(max-width:600px){.hero-actions{grid-template-columns:1fr!important}.hero-title{font-size:clamp(40px,14vw,64px)!important}.hero-sub{font-size:16px!important}.hero-section{padding:84px 20px 40px!important}}`}</style>
      <div
        ref={orbRef}
        style={{
          position:'absolute',
          inset:'0',
          pointerEvents:'none',
          zIndex:0,
          display:'flex',
          justifyContent:'center'
        }}
      >
        <div
          style={{
            width:700,
            height:700,
            marginTop:40,
            borderRadius:'50%',
            background: resolvedTheme==='light'
              ? 'radial-gradient(circle, rgba(91,109,255,.12) 0%, rgba(91,109,255,.05) 40%, transparent 72%)'
              : 'radial-gradient(circle, rgba(124,109,250,.16) 0%, rgba(124,109,250,.06) 35%, transparent 72%)'
          }}
        />
      </div>

      {floatingTickets.map(ticket=>(
        <motion.div
          key={ticket.number}
          initial={{opacity:0,scale:.8}}
          animate={{opacity:1,y:[0,-8,0]}}
          transition={{opacity:{duration:.5,delay:ticket.delay},y:{duration:8,repeat:Infinity,ease:'easeInOut'}}}
          className='floating-ticket' style={{
            position:'absolute',
            left:ticket.x,
            top:ticket.y,
            zIndex:1,
            padding:'12px 18px',
            borderRadius:16,
            backdropFilter:'blur(16px)',
            background: resolvedTheme==='light' ? 'rgba(255,255,255,.65)' : 'rgba(255,255,255,.04)',
            border:'1px solid var(--border)',
            boxShadow: resolvedTheme==='light'
              ? '0 12px 40px rgba(0,0,0,.08)'
              : '0 16px 40px rgba(0,0,0,.22)'
          }}
        >
          <div style={{display:'flex',alignItems:'center',gap:10}}>
            <span style={{width:8,height:8,borderRadius:'50%',background:ticket.color,boxShadow:`0 0 12px ${ticket.color}`}}/>
            <div>
              <div style={{fontSize:11,color:'var(--text-2)',textTransform:'uppercase'}}>Ticket</div>
              <div style={{fontWeight:800,color:'var(--text-1)'}}>#{ticket.number}</div>
            </div>
          </div>
        </motion.div>
      ))}
      <section className="hero-section" style={{
        position: 'relative', zIndex: 2,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        minHeight: '100vh', padding: '92px 24px 56px',
        textAlign: 'center'
      }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: 'rgba(124,109,250,0.1)',
            border: '1px solid rgba(124,109,250,0.2)',
            borderRadius: '100px', padding: '6px 16px',
            marginBottom: '32px'
          }}
        >
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent)', display: 'inline-block' }} />
          <span style={{ color: 'var(--accent-2)', fontSize: '13px', fontWeight: 500 }}>{t.hero.badge}</span>
        </motion.div>

        <motion.h1 className="hero-title"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          style={{
            fontSize: 'clamp(48px, 8vw, 96px)',
            fontWeight: 900,
            letterSpacing: '-4px',
            lineHeight: 0.95,
            marginBottom: '24px',
            maxWidth: '800px'
          }}
        >
          <span className="gradient-text">{t.hero.title1}</span>
          <br />
          <span style={{ color: 'var(--text-1)' }}>{t.hero.title2}</span>
        </motion.h1>

        <motion.p className="hero-sub"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{
            color: 'var(--text-2)', fontSize: '18px',
            maxWidth: '560px', lineHeight: 1.6,
            marginBottom: '40px'
          }}
        >
          Smart queue management for businesses that want shorter waits, cleaner operations, and a smoother customer experience.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className='hero-actions' style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}
        >
          <Link href="/join">
            <Button size="lg">{nav.join || 'Join a queue'}</Button>
          </Link>
          <Link href="/business/register">
            <Button size="lg" variant="ghost">{isArabic ? 'ابدأ نشاطك' : 'Start your business'}</Button>
          </Link>
          <Link href="/discover">
            <Button size="lg" variant="ghost">{nav.discover || 'Discover'}</Button>
          </Link>
          <Link href="/business/dashboard" onClick={seedPreview}>
            <Button size="lg" variant="ghost">{isArabic ? 'معاينة اللوحة' : 'Open live preview'}</Button>
          </Link>
          <a href="#how-it-works" style={{ textDecoration: 'none' }}>
            <Button size="lg" variant="ghost">{isArabic ? 'كيف يعمل' : 'How it works'}</Button>
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          style={{
            marginTop: '80px',
            display: 'flex', gap: '40px',
            borderTop: '1px solid var(--border)',
            paddingTop: '40px',
            flexWrap: 'wrap',
            justifyContent: 'center'
          }}
        >
          {[
            { label: t.stats.queues, value: '1,240' },
            { label: t.stats.served, value: '48,392' },
            { label: t.stats.wait, value: '73%' },
          ].map((stat) => (
            <div key={stat.label} style={{ textAlign: 'center', minWidth: '120px' }}>
              <p style={{ color: 'var(--text-1)', fontSize: '24px', fontWeight: 700 }}>{stat.value}</p>
              <p style={{ color: 'var(--text-3)', fontSize: '13px', marginTop: '4px' }}>{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </section>

      <section id="how-it-works" style={{ position: 'relative', zIndex: 2, padding: '24px 24px 100px' }}>
        <div className="app-container-lg">
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <p style={{ color: 'var(--accent-2)', fontSize: '12px', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 800 }}>{isArabic ? 'مزايا المنصة' : 'Platform features'}</p>
            <h2 style={{ color: 'var(--text-1)', fontSize: 'clamp(30px, 5vw, 48px)', marginTop: '10px', letterSpacing: '-1px' }}>{isArabic ? 'كل ما يحتاجه الطابور في مكان واحد' : 'Everything a queue needs, connected'}</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
            {featureCardsLocalized.slice(0,3).map((feature, index) => (
              <motion.div
                key={feature.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ delay: index * 0.05 }}
                className="glass glass-hover"
                style={{ borderRadius: '12px', padding: '20px', minHeight: '190px' }}
              >
                <p style={{ color: 'var(--text-3)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{feature.label}</p>
                <h3 style={{ color: 'var(--text-1)', fontSize: '26px', marginTop: '14px' }}>{feature.value}</h3>
                <p style={{ color: 'var(--text-2)', fontSize: '14px', lineHeight: 1.7, marginTop: '14px' }}>{feature.detail}</p>
              </motion.div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '18px', marginTop: '18px' }}>
            <div className="glass" style={{ borderRadius: '12px', padding: '22px' }}>
              <p style={{ color: 'var(--accent-2)', fontSize: '12px', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 800 }}>{isArabic ? 'العمليات الحية' : 'Live operations'}</p>
              <div style={{ display: 'grid', gap: '12px', marginTop: '18px' }}>
                {workflowLocalized.map((item) => (
                  <div key={item.step} style={{ display: 'grid', gridTemplateColumns: '44px minmax(0, 1fr)', gap: '14px', alignItems: 'start', padding: '14px', border: '1px solid var(--border)', borderRadius: '12px', background: 'rgba(255,255,255,0.03)' }}>
                    <strong style={{ color: 'var(--green)', fontSize: '15px' }}>{item.step}</strong>
                    <div>
                      <h3 style={{ color: 'var(--text-1)', fontSize: '16px' }}>{item.title}</h3>
                      <p style={{ color: 'var(--text-2)', fontSize: '13px', lineHeight: 1.6, marginTop: '4px' }}>{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass" style={{ borderRadius: '12px', padding: '22px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', alignItems: 'flex-start' }}>
                <div>
                  <p style={{ color: 'var(--accent-2)', fontSize: '12px', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 800 }}>{isArabic ? 'معاينة لوحة التحكم' : 'Dashboard preview'}</p>
                  <h3 style={{ color: 'var(--text-1)', fontSize: '28px', marginTop: '8px' }}>Main Branch</h3>
                </div>
                <span style={{ color: 'var(--green)', border: '1px solid rgba(29,209,161,0.28)', background: 'rgba(29,209,161,0.1)', borderRadius: '999px', padding: '7px 11px', fontSize: '12px', fontWeight: 800 }}>Live</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '10px', marginTop: '18px' }}>
                {[
                  ['Waiting', '42'],
                  ['Serving', '41'],
                  ['Avg wait', '8m'],
                ].map(([label, value]) => (
                  <div key={label} style={{ border: '1px solid var(--border)', borderRadius: '12px', padding: '14px', background: 'rgba(255,255,255,0.03)' }}>
                    <p style={{ color: 'var(--text-3)', fontSize: '11px', textTransform: 'uppercase' }}>{label}</p>
                    <p style={{ color: 'var(--text-1)', fontSize: '26px', fontWeight: 800, marginTop: '8px' }}>{value}</p>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '18px', marginTop: '24px', padding: '18px', border: '1px solid var(--border)', borderRadius: '12px', background: 'rgba(29,209,161,0.06)' }}>
                <Sparkline data={[8, 12, 10, 16, 14, 20, 18]} color="var(--green)" height={54} />
                <div style={{ textAlign: 'right' }}>
                  <p style={{ color: 'var(--green)', fontSize: '36px', fontWeight: 900 }}>73%</p>
                  <p style={{ color: 'var(--text-2)', fontSize: '13px' }}>shorter perceived waiting time</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
