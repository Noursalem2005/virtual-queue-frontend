'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useParams } from 'next/navigation'
import { api } from '../../../lib/api'
import { useLang } from '../../../components/providers/LangProvider'

export default function FeedbackPage() {
  const { ticketId } = useParams<{ ticketId: string }>()
  const { t, dir } = useLang()
  const [rating, setRating] = useState(0)
  const [hover, setHover] = useState(0)
  const [comment, setComment] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!rating) return
    setLoading(true)
    try {
      await api.post('/queues/feedback', {
        ticketId,
        queueId: new URLSearchParams(window.location.search).get('queueId'),
        rating,
        comment,
      })
      setSubmitted(true)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main dir={dir} className="customer-page" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <AnimatePresence mode="wait">
        {submitted ? (
          <motion.div key="done" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>🙏</div>
            <h2 style={{ fontFamily: 'Syne,sans-serif', fontSize: '28px', fontWeight: 800, color: 'var(--text1)', marginBottom: '8px' }}>{t.feedback?.thankYou || 'Thank you!'}</h2>
            <p style={{ color: 'var(--text2)', fontSize: '15px' }}>{t.feedback?.helpful || 'Your feedback helps us improve the service.'}</p>
          </motion.div>
        ) : (
          <motion.div key="form" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} style={{ width: '100%', maxWidth: '400px', textAlign: 'center' }}>
            <h2 style={{ fontFamily: 'Syne,sans-serif', fontSize: '28px', fontWeight: 800, color: 'var(--text1)', marginBottom: '8px' }}>{t.feedback?.title || 'How was your experience?'}</h2>
            <p style={{ color: 'var(--text2)', fontSize: '14px', marginBottom: '32px' }}>{t.feedback?.subtitle || 'Rate your visit today'}</p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '28px' }}>
              {[1, 2, 3, 4, 5].map((score) => (
                <motion.button
                  key={score}
                  onMouseEnter={() => setHover(score)}
                  onMouseLeave={() => setHover(0)}
                  onClick={() => setRating(score)}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  style={{ background: 'transparent', border: 'none', fontSize: '40px', cursor: 'pointer', opacity: score <= (hover || rating) ? 1 : 0.25, transition: 'opacity 0.15s' }}
                >
                  ⭐
                </motion.button>
              ))}
            </div>

            <textarea
              placeholder="Any comments? (optional)"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
              style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)', borderRadius: '10px', padding: '14px 16px', color: 'var(--text1)', fontSize: '14px', outline: 'none', resize: 'none', fontFamily: 'inherit', marginBottom: '16px' }}
            />

            <motion.button
              onClick={handleSubmit}
              disabled={!rating || loading}
              whileHover={{ scale: rating ? 1.02 : 1 }}
              whileTap={{ scale: rating ? 0.97 : 1 }}
              style={{ width: '100%', background: rating ? 'linear-gradient(135deg,#7c6dfa,#a78bfa)' : 'rgba(255,255,255,0.05)', color: rating ? '#fff' : 'var(--text3)', border: 'none', borderRadius: '10px', padding: '14px', fontSize: '15px', fontWeight: 500, cursor: rating ? 'pointer' : 'not-allowed', fontFamily: 'inherit', transition: 'all 0.2s' }}
            >
              {loading ? 'Submitting...' : 'Submit Feedback'}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}