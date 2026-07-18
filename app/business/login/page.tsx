'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { api } from '../../../lib/api'
import { useLang } from '../../../components/providers/LangProvider'
import Link from 'next/link'

export default function BusinessLogin() {
  const { lang, dir } = useLang()
  const isArabic = lang === 'ar'
  const copy = isArabic
    ? {
        badge: '🔐 دخول الأعمال',
        title: 'مرحباً في لوحة التحكم',
        subtitle: 'إدارة طوابيرك من مكان واحد - تحليلات فورية وتحكم كامل',
        email: 'البريد الإلكتروني',
        emailPlaceholder: 'work@company.com',
        password: 'كلمة المرور',
        passwordPlaceholder: '••••••••',
        button: 'دخول الآن',
        loading: '...جاري التحقق',
        create: 'حساب جديد؟',
        createLink: 'أنشئ حساباً',
        forgotPassword: 'نسيت كلمة المرور؟',
        remember: 'تذكرني',
        features: [
          { icon: '📊', title: 'تحليلات ذكية', desc: 'بيانات فورية عن طابورك' },
          { icon: '⚡', title: 'إدارة فورية', desc: 'تحكم كامل من لوحة التحكم' },
          { icon: '📱', title: 'عروض حية', desc: 'اعرض الطابور على الشاشات' },
        ],
      }
    : {
        badge: '🔐 Business Login',
        title: 'Welcome to Command Center',
        subtitle: 'Manage your queues from one place – instant analytics and full control',
        email: 'Email address',
        emailPlaceholder: 'work@company.com',
        password: 'Password',
        passwordPlaceholder: '••••••••',
        button: 'Sign In Now',
        loading: 'Verifying...',
        create: "New account?",
        createLink: 'Create one',
        forgotPassword: 'Forgot password?',
        remember: 'Remember me',
        features: [
          { icon: '📊', title: 'Smart Analytics', desc: 'Real-time queue insights' },
          { icon: '⚡', title: 'Live Control', desc: 'Full control from dashboard' },
          { icon: '📱', title: 'Live Display', desc: 'Show queues on screens' },
        ],
      }

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const previewEmail = 'operations@queuely.app'
  const previewPassword = 'QueueAccess2026'

  const startPreview = () => {
    setEmail(previewEmail)
    setPassword(previewPassword)
    localStorage.setItem('token', 'preview-token')
    localStorage.setItem('preview:enabled', 'true')
    localStorage.setItem('workspace:last-queue-id', 'main-branch')
    localStorage.setItem('workspace:recent-queues', JSON.stringify(['main-branch', 'clinic-east', 'branch-02']))
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
    router.push('/business/dashboard')
  }

  const handleLogin = async () => {
    if (!email || !password) {
      setError(isArabic ? 'يرجى ملء جميع الحقول' : 'Please fill in all fields')
      return
    }
    setLoading(true)
    setError('')
    if (email === previewEmail && password === previewPassword) {
      startPreview()
      setLoading(false)
      return
    }
    try {
      const res = await api.post('/auth/login', { email, password })
      if ((res as any).ok && (res as any).data?.token) {
        localStorage.setItem('token', (res as any).data.token)
        if (remember) localStorage.setItem('rememberMe', 'true')
        router.push('/business/dashboard')
      } else {
        setError(isArabic ? 'البريد أو كلمة المرور غير صحيحة' : 'Invalid email or password')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : (isArabic ? 'خطأ غير متوقع' : 'An unexpected error occurred'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <main
      className="auth-page"
      dir={dir}
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, var(--bg) 0%, var(--bg-2) 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        marginTop: '60px',
      }}
    >
      <div className="auth-shell" style={{ maxWidth: '1000px', width: '100%', display: 'grid', gridTemplateColumns: 'clamp(0px, 1fr, 500px) clamp(0px, 1fr, 420px)', gap: '60px', alignItems: 'center' }}>
        {/* Left - Hero Section */}
        <motion.div className="auth-copy" initial={{ opacity: 0, x: -18 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.35 }}>
          <div style={{ marginBottom: '40px' }}>
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              style={{
                display: 'inline-block',
                padding: '10px 16px',
                background: 'linear-gradient(135deg, rgba(91,109,255,0.2), rgba(29,209,161,0.1))',
                border: '1px solid rgba(91,109,255,0.3)',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: '700',
                color: 'var(--accent)',
                marginBottom: '20px',
                backdropFilter: 'blur(10px)',
              }}
            >
              {copy.badge}
            </motion.div>

            <h1
              style={{
                fontSize: 'clamp(32px, 6vw, 48px)',
                fontWeight: '900',
                lineHeight: 1.15,
                color: 'var(--text-1)',
                marginBottom: '16px',
                letterSpacing: '-0.5px',
              }}
            >
              {copy.title}
            </h1>
            <p
              style={{
                fontSize: '16px',
                lineHeight: 1.8,
                color: 'var(--text-2)',
                marginBottom: '40px',
                fontWeight: '500',
              }}
            >
              {copy.subtitle}
            </p>
          </div>

          {/* Features Cards */}
          <div className="auth-feature-list" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
            {copy.features.map((feature, idx) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.12 + idx * 0.04 }}
                style={{
                  padding: '18px',
                  borderRadius: '12px',
                  border: '1px solid var(--border)',
                  background: 'linear-gradient(135deg, rgba(91,109,255,0.06), rgba(29,209,161,0.02))',
                  display: 'flex',
                  gap: '14px',
                  alignItems: 'flex-start',
                }}
              >
                <span style={{ fontSize: '24px', flexShrink: 0 }}>{feature.icon}</span>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-1)', marginBottom: '4px' }}>{feature.title}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-2)' }}>{feature.desc}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Right - Login Form */}
        <motion.div
          className="auth-card"
          initial={{ opacity: 0, x: 18 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.35, delay: 0.05 }}
          style={{
            padding: '48px',
            borderRadius: '20px',
            border: '1px solid var(--border)',
            background: 'linear-gradient(135deg, rgba(91,109,255,0.08), rgba(29,209,161,0.03))',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          }}
        >
          <div style={{ marginBottom: '32px' }}>
            <h2
              style={{
                fontSize: '28px',
                fontWeight: '800',
                color: 'var(--text-1)',
                marginBottom: '6px',
              }}
            >
              {isArabic ? 'تسجيل الدخول' : 'Sign In'}
            </h2>
            <p
              style={{
                fontSize: '14px',
                color: 'var(--text-2)',
                fontWeight: '500',
              }}
            >
              {copy.create}{' '}
              <Link
                href="/business/register"
                style={{
                  color: 'var(--accent)',
                  textDecoration: 'none',
                  fontWeight: '700',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                {copy.createLink} →
              </Link>
            </p>
          </div>

          <div
            style={{
              marginBottom: '22px',
              padding: '14px',
              borderRadius: '12px',
              border: '1px solid var(--border)',
              background: 'var(--surface)',
            }}
          >
            <p style={{ color: 'var(--text-1)', fontSize: '13px', fontWeight: 800, marginBottom: '8px' }}>
              Quick access
            </p>
            <p style={{ color: 'var(--text-2)', fontSize: '12px', lineHeight: 1.6, marginBottom: '12px' }}>
              Email: {previewEmail} | Password: {previewPassword}
            </p>
            <button
              onClick={startPreview}
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: '10px',
                background: 'rgba(29,209,161,0.12)',
                color: 'var(--green)',
                border: '1px solid rgba(29,209,161,0.28)',
                fontWeight: 800,
              }}
            >
              Enter dashboard
            </button>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                padding: '14px 16px',
                background: 'linear-gradient(135deg, rgba(255,107,107,0.12), rgba(255,107,107,0.06))',
                border: '1px solid rgba(255,107,107,0.4)',
                borderRadius: '12px',
                color: '#ff6b6b',
                fontSize: '13px',
                marginBottom: '20px',
                fontWeight: '600',
              }}
            >
              ⚠️ {error}
            </motion.div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '28px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: 'var(--text-1)', marginBottom: '8px' }}>{copy.email}</label>
              <input
                type="email"
                placeholder={copy.emailPlaceholder}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  background: 'var(--bg-3)',
                  border: '1.5px solid var(--border)',
                  borderRadius: '12px',
                  color: 'var(--text-1)',
                  fontSize: '14px',
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
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <label style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-1)' }}>{copy.password}</label>
                <Link
                  href="#"
                  style={{
                    fontSize: '12px',
                    color: 'var(--accent)',
                    textDecoration: 'none',
                    fontWeight: '700',
                  }}
                >
                  {copy.forgotPassword}
                </Link>
              </div>
              <input
                type="password"
                placeholder={copy.passwordPlaceholder}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  background: 'var(--bg-3)',
                  border: '1.5px solid var(--border)',
                  borderRadius: '12px',
                  color: 'var(--text-1)',
                  fontSize: '14px',
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
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '28px', padding: '12px', background: 'rgba(91,109,255,0.03)', borderRadius: '10px' }}>
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              style={{
                width: '18px',
                height: '18px',
                cursor: 'pointer',
                accentColor: 'var(--accent)',
              }}
            />
            <label
              style={{
                fontSize: '13px',
                fontWeight: '600',
                color: 'var(--text-2)',
                cursor: 'pointer',
                userSelect: 'none',
              }}
            >
              {copy.remember}
            </label>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLogin}
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px 20px',
              background: loading ? 'rgba(91,109,255,0.4)' : 'linear-gradient(135deg, var(--accent) 0%, #4a5cff 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '15px',
              fontWeight: '800',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s',
              letterSpacing: '0.5px',
            }}
          >
            {loading ? copy.loading : copy.button}
          </motion.button>
        </motion.div>
      </div>
    </main>
  )
}
