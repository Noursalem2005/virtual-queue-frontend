'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '../../components/ui/Button'
import { useLang } from '../../components/providers/LangProvider'

type Ticket = {
  ticket_number: string | number
}

export default function JoinQueue() {
  const { t, dir } = useLang()
  const [queueId, setQueueId] = useState('')
  const [ticket, setTicket] = useState<Ticket | null>(null)
  const [loading, setLoading] = useState(false)

  const handleJoin = async () => {
    const trimmed = queueId.trim()
    if (!trimmed) return
    setLoading(true)
    try {
      const token = localStorage.getItem('token') || ''
      const data = await fetch(`/queues/${trimmed}/join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ customerId: 'guest' }),
      })
      const ticketData: Ticket = await data.json()
      setTicket(ticketData)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main dir={dir} className="join-lite-page customer-page">
      <section className="join-lite-card">
        {ticket ? (
          <>
            <p className="dashboard-eyebrow">{t.ticket.your}</p>
            <h1>#{ticket.ticket_number}</h1>
            <p>{t.join.subtitle}</p>
            <Link href={`/join/${queueId}`} style={{ textDecoration: 'none' }}>
              <Button fullWidth>{t.ticket.proceed}</Button>
            </Link>
          </>
        ) : (
          <>
            <p className="dashboard-eyebrow">Queuely</p>
            <h1>{t.join.title}</h1>
            <p>{t.join.subtitle}</p>
            <div className="join-lite-form">
              <input
                placeholder={t.join.placeholder}
                value={queueId}
                onChange={(event) => setQueueId(event.target.value)}
                onKeyDown={(event) => event.key === 'Enter' && void handleJoin()}
              />
              <Button onClick={() => void handleJoin()} disabled={loading || !queueId.trim()} fullWidth>
                {loading ? t.join.joining : t.join.button}
              </Button>
            </div>
          </>
        )}
      </section>
    </main>
  )
}
