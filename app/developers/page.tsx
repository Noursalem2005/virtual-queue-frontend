'use client'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { api } from '../../lib/api'
import { useLang } from '../../components/providers/LangProvider'

const codeExample = `// Join a queue via API
const response = await fetch('https://api.queuely.io/v1/queues/{queueId}/join', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ customerId: 'user_123' })
})

const ticket = await response.json()
console.log(ticket.ticketNumber) // 42`

export default function DevelopersPage() {
  const { t, dir } = useLang()
  const [apiKey, setApiKey] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const generateKey = async () => {
    setLoading(true)
    const token = localStorage.getItem('token') || ''
    const data = await api.post('/api-keys/generate', {}, token)
    setApiKey(data.key)
    setLoading(false)
  }

  const copy = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <main dir={dir} style={{ minHeight: '100vh', padding: '80px 24px', maxWidth: '900px', margin: '0 auto' }}>
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>

        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          background: 'rgba(34,211,160,0.1)', border: '1px solid rgba(34,211,160,0.2)',
          borderRadius: '100px', padding: '6px 16px', marginBottom: '32px'
        }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--green)', display: 'inline-block' }} />
          <span style={{ color: 'var(--green)', fontSize: '13px', fontWeight: 500 }}>{t.developers.badge}</span>
        </div>

        <h1 style={{ fontSize: '48px', fontWeight: 900, letterSpacing: '-2px', marginBottom: '16px' }}>
          {t.developers.title1} <span className="gradient-text">{t.developers.title2}</span>
        </h1>
        <p style={{ color: 'var(--text-2)', fontSize: '18px', marginBottom: '48px', maxWidth: '500px', lineHeight: 1.6 }}>
          {t.developers.subtitle}
        </p>

        {/* code block */}
        <div style={{ marginBottom: '32px' }}>
          <Card delay={0.1} className="noise">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ display: 'flex', gap: '6px' }}>
              {['#ff5f57','#febc2e','#28c840'].map(c => (
                <div key={c} style={{ width: '12px', height: '12px', borderRadius: '50%', background: c }} />
              ))}
            </div>
            <button
              onClick={() => copy(codeExample)}
              style={{
                background: 'transparent', border: '1px solid var(--border)',
                color: 'var(--text-2)', borderRadius: '6px',
                padding: '4px 12px', fontSize: '12px', cursor: 'pointer'
              }}
            >
              {copied ? t.developers.copied : t.developers.copy}
            </button>
          </div>
          <pre style={{
            color: 'var(--text-2)', fontSize: '13px',
            lineHeight: 1.7, overflow: 'auto',
            fontFamily: 'monospace'
          }}>
            {codeExample}
          </pre>
          </Card>
        </div>

        {/* API key generator */}
        <Card delay={0.2} glow>
          <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '8px' }}>{t.developers.apiKey}</h2>
          <p style={{ color: 'var(--text-2)', fontSize: '14px', marginBottom: '24px' }}>
            {t.developers.apiKeyDescription}
          </p>

          {apiKey ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                display: 'flex', gap: '12px', alignItems: 'center',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid var(--border)',
                borderRadius: '10px', padding: '14px 16px'
              }}
            >
              <code style={{ color: 'var(--accent-2)', flex: 1, fontSize: '13px', wordBreak: 'break-all' }}>
                {apiKey}
              </code>
              <Button size="sm" variant="ghost" onClick={() => copy(apiKey)}>
                {copied ? t.developers.copied : t.developers.copy}
              </Button>
            </motion.div>
          ) : (
            <Button onClick={generateKey} disabled={loading}>
              {loading ? t.developers.generating : t.developers.generate}
            </Button>
          )}
        </Card>

        {/* endpoints list */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          style={{ marginTop: '32px' }}
        >
          <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '16px' }}>{t.developers.endpoints}</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[
              { method: 'POST', path: '/v1/queues', desc: 'Create a new queue' },
              { method: 'GET',  path: '/v1/queues/:id', desc: 'Get queue state' },
              { method: 'POST', path: '/v1/queues/:id/join', desc: 'Add a customer to queue' },
              { method: 'POST', path: '/v1/queues/:id/call-next', desc: 'Call next customer' },
              { method: 'GET',  path: '/v1/analytics/:id/stats', desc: 'Get queue analytics' },
            ].map((e, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.07 }}
                className="glass glass-hover"
                style={{
                  borderRadius: '10px', padding: '14px 20px',
                  display: 'flex', alignItems: 'center', gap: '16px'
                }}
              >
                <span style={{
                  fontSize: '11px', fontWeight: 700,
                  color: e.method === 'GET' ? 'var(--green)' : 'var(--accent-2)',
                  background: e.method === 'GET' ? 'rgba(34,211,160,0.1)' : 'rgba(124,109,250,0.1)',
                  border: `1px solid ${e.method === 'GET' ? 'rgba(34,211,160,0.2)' : 'rgba(124,109,250,0.2)'}`,
                  borderRadius: '6px', padding: '3px 8px',
                  minWidth: '52px', textAlign: 'center'
                }}>
                  {e.method}
                </span>
                <code style={{ color: 'var(--text-1)', fontSize: '13px', flex: 1 }}>{e.path}</code>
                <span style={{ color: 'var(--text-3)', fontSize: '13px' }}>{e.desc}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </main>
  )
}