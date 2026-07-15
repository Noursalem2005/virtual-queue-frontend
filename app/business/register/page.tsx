'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { api } from '../../../lib/api'
import { useLang } from '../../../components/providers/LangProvider'
import Link from 'next/link'

export default function BusinessRegister() {
  const { lang, dir } = useLang()
  const isArabic = lang === 'ar'
  const router = useRouter()

  const copy = isArabic
    ? {
        badge: '🚀 نمو عملك',
        title: 'ابدأ الآن - إدارة طوابير احترافية',
        subtitle: 'بدون تكاليف إعداد. بدون بطاقة ائتمان. ابدأ مجاناً وقم بالترقية عند الحاجة.',
        email: 'البريد الإلكتروني',
        emailPlaceholder: 'work@company.com',
        password: 'كلمة المرور',
        passwordPlaceholder: '••••••••',
        businessName: 'اسم العمل',
        businessNamePlaceholder: 'مقهى الربوة',
        businessType: 'نوع العمل',
        button: 'أنشئ حساباً',
        loading: '...جاري الإنشاء',
        login: 'لديك حساب بالفعل؟',
        loginLink: 'تسجيل دخول',
      }
    : {
        badge: '🚀 Grow Your Business',
        title: 'Start Now – Professional Queue Management',
        subtitle: 'Zero setup fees. No credit card required. Start free and upgrade when you\'re ready.',
        email: 'Email address',
        emailPlaceholder: 'work@company.com',
        password: 'Password',
        passwordPlaceholder: '••••••••',
        businessName: 'Business name',
        businessNamePlaceholder: 'Cafe Aurora',
        businessType: 'Business type',
        button: 'Create Account',
        loading: 'Creating...',
        login: 'Already have an account?',
        loginLink: 'Sign in',
      }

  const [step, setStep] = useState(1)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [businessName, setBusinessName] = useState('')
  const [businessType, setBusinessType] = useState('cafe')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const businessTypes = isArabic
    ? [
        { value: 'bank', label: '🏦 بنك' },
        { value: 'hospital', label: '🏥 مستشفى' },
        { value: 'clinic', label: '⚕️ عيادة' },
        { value: 'government', label: '🏛️ جهة حكومية' },
        { value: 'telecom', label: '📞 اتصالات' },
        { value: 'cafe', label: '☕ مقهى' },
        { value: 'restaurant', label: '🍽️ مطعم' },
        { value: 'pharmacy', label: '💊 صيدلية' },
        { value: 'other', label: '📌 أخرى' },
      ]
    : [
        { value: 'bank', label: '🏦 Bank' },
        { value: 'hospital', label: '🏥 Hospital' },
        { value: 'clinic', label: '⚕️ Clinic' },
        { value: 'government', label: '🏛️ Government' },
        { value: 'telecom', label: '📞 Telecom' },
        { value: 'cafe', label: '☕ Cafe' },
        { value: 'restaurant', label: '🍽️ Restaurant' },
        { value: 'pharmacy', label: '💊 Pharmacy' },
        { value: 'other', label: '📌 Other' },
      ]

  const handleStep1 = () => {
    if (!email || !password) {
      setError(isArabic ? 'يرجى ملء جميع الحقول' : 'Please fill in all fields')
      return
    }
    if (password.length < 6) {
      setError(isArabic ? 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' : 'Password must be at least 6 characters')
      return
    }
    setError('')
    setStep(2)
  }

  const handleRegister = async () => {
    if (!businessName) {
      setError(isArabic ? 'يرجى إدخال اسم العمل' : 'Please enter business name')
      return
    }

    setLoading(true)
    setError('')
    try {
      const res = await api.post('/auth/register', { email, password })
      if ((res as any).ok) {
        const businessRes = await api.post('/auth/business', { businessName, businessType })
        if ((businessRes as any).ok && (businessRes as any).data?.token) {
          localStorage.setItem('token', (businessRes as any).data.token)
          router.push('/business/dashboard')
        }
      } else {
        setError(isArabic ? 'حدث خطأ في التسجيل' : 'Registration failed')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : (isArabic ? 'خطأ غير متوقع' : 'An unexpected error occurred'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <main
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
      <div style={{ maxWidth: '1100px', width: '100%', display: 'grid', gridTemplateColumns: 'clamp(0px, 1fr, 520px) clamp(0px, 1fr, 440px)', gap: '70px', alignItems: 'center' }}>
        {/* Left - Hero Section */}
        <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>
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

          {/* Benefits Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {[
              { icon: '💚', label: isArabic ? 'مجاني تماماً' : 'Completely Free', desc: isArabic ? 'لا توجد تكاليف' : 'No hidden costs' },
              { icon: '🚫', label: isArabic ? 'لا بطاقة ائتمان' : 'No Credit Card', desc: isArabic ? 'بيانات آمنة' : 'Secure data' },
              { icon: '⚡', label: isArabic ? 'إعداد فوري' : 'Instant Setup', desc: isArabic ? 'تفعيل لحظي' : 'Live in minutes' },
              { icon: '🛡️', label: isArabic ? 'آمن تماماً' : 'Fully Secure', desc: isArabic ? 'بيانات مشفرة' : 'Encrypted data' },
            ].map((benefit, idx) => (
              <motion.div
                key={benefit.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + idx * 0.1 }}
                style={{
                  padding: '20px',
                  borderRadius: '14px',
                  border: '1px solid var(--border)',
                  background: 'linear-gradient(135deg, rgba(91,109,255,0.06), rgba(29,209,161,0.02))',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '32px', marginBottom: '10px' }}>{benefit.icon}</div>
                <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-1)', marginBottom: '4px' }}>{benefit.label}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-2)' }}>{benefit.desc}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Right - Registration Form */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          style={{
            padding: '48px',
            borderRadius: '20px',
            border: '1px solid var(--border)',
            background: 'linear-gradient(135deg, rgba(91,109,255,0.08), rgba(29,209,161,0.03))',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          }}
        >
          {/* Progress Indicator */}
          <div style={{ marginBottom: '32px' }}>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
              {[1, 2].map((s) => (
                <div
                  key={s}
                  style={{
                    height: '4px',
                    flex: 1,
                    borderRadius: '2px',
                    background: step >= s ? 'linear-gradient(135deg, var(--accent), #4a5cff)' : 'var(--border)',
                    transition: 'all 0.3s',
                  }}
                />
              ))}
            </div>

            <h2
              style={{
                fontSize: '28px',
                fontWeight: '800',
                color: 'var(--text-1)',
                marginBottom: '6px',
              }}
            >
              {step === 1 ? (isArabic ? 'حسابك' : 'Your Account') : (isArabic ? 'عملك' : 'Your Business')}
            </h2>
            <p
              style={{
                fontSize: '14px',
                color: 'var(--text-2)',
                fontWeight: '500',
              }}
            >
              {step === 1
                ? (isArabic ? 'خطوة 1 من 2' : 'Step 1 of 2')
                : (isArabic ? 'خطوة 2 من 2' : 'Step 2 of 2')}
            </p>
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

          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
              >
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: 'var(--text-1)', marginBottom: '8px' }}>{copy.email}</label>
                  <input
                    type="email"
                    placeholder={copy.emailPlaceholder}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleStep1()}
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
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: 'var(--text-1)', marginBottom: '8px' }}>{copy.password}</label>
                  <input
                    type="password"
                    placeholder={copy.passwordPlaceholder}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleStep1()}
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
                  <p style={{ fontSize: '11px', color: 'var(--text-2)', marginTop: '6px', fontWeight: '500' }}>
                    {isArabic ? 'يجب أن تكون 6 أحرف على الأقل' : 'Minimum 6 characters'}
                  </p>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleStep1}
                  style={{
                    width: '100%',
                    padding: '14px 20px',
                    background: 'linear-gradient(135deg, var(--accent) 0%, #4a5cff 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    fontSize: '15px',
                    fontWeight: '800',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    marginTop: '8px',
                  }}
                >
                  {isArabic ? 'التالي' : 'Continue'}
                </motion.button>
              </motion.div>
            ) : (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
              >
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: 'var(--text-1)', marginBottom: '8px' }}>{copy.businessName}</label>
                  <input
                    type="text"
                    placeholder={copy.businessNamePlaceholder}
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
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
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: 'var(--text-1)', marginBottom: '8px' }}>{copy.businessType}</label>
                  <select
                    value={businessType}
                    onChange={(e) => setBusinessType(e.target.value)}
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
                      cursor: 'pointer',
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
                  >
                    {businessTypes.map((type) => (
                      <option key={type.value} value={type.value} style={{ background: 'var(--bg-2)', color: 'var(--text-1)' }}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '8px' }}>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setStep(1)}
                    style={{
                      padding: '14px 16px',
                      background: 'rgba(91,109,255,0.1)',
                      color: 'var(--accent)',
                      border: '1.5px solid var(--border)',
                      borderRadius: '12px',
                      fontSize: '15px',
                      fontWeight: '800',
                      cursor: 'pointer',
                      transition: 'all 0.3s',
                    }}
                  >
                    {isArabic ? '← رجوع' : '← Back'}
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleRegister}
                    disabled={loading}
                    style={{
                      padding: '14px 16px',
                      background: loading ? 'rgba(91,109,255,0.4)' : 'linear-gradient(135deg, var(--accent) 0%, #4a5cff 100%)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '12px',
                      fontSize: '15px',
                      fontWeight: '800',
                      cursor: loading ? 'not-allowed' : 'pointer',
                      transition: 'all 0.3s',
                    }}
                  >
                    {loading ? copy.loading : copy.button}
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div
            style={{
              marginTop: '24px',
              paddingTop: '24px',
              borderTop: '1px solid var(--border)',
              textAlign: 'center',
            }}
          >
            <p
              style={{
                fontSize: '14px',
                color: 'var(--text-2)',
                fontWeight: '500',
              }}
            >
              {copy.login}{' '}
              <Link
                href="/business/login"
                style={{
                  color: 'var(--accent)',
                  textDecoration: 'none',
                  fontWeight: '700',
                }}
              >
                {copy.loginLink}
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </main>
  )
}
