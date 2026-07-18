'use client'

import type { ReactNode } from 'react'
import { Button } from '../ui/Button'
import type { Appointment, Ticket } from '../../shared/types'

type Action = {
  label: string
  onClick: () => void
  variant?: 'primary' | 'ghost' | 'danger'
  disabled?: boolean
}

export function DashboardPanel({
  eyebrow,
  title,
  action,
  children,
  className = '',
}: {
  eyebrow?: string
  title: string
  action?: ReactNode
  children: ReactNode
  className?: string
}) {
  return (
    <section className={`dashboard-panel ${className}`}>
      <div className="dashboard-panel-header">
        <div>
          {eyebrow && <p className="dashboard-eyebrow">{eyebrow}</p>}
          <h2>{title}</h2>
        </div>
        {action && <div className="dashboard-panel-action">{action}</div>}
      </div>
      <div className="dashboard-panel-body">{children}</div>
    </section>
  )
}

export function MetricTile({
  label,
  value,
  detail,
  tone = 'neutral',
}: {
  label: string
  value: ReactNode
  detail?: string
  tone?: 'neutral' | 'accent' | 'success' | 'warning'
}) {
  return (
    <div className={`dashboard-metric dashboard-metric-${tone}`}>
      <p>{label}</p>
      <strong>{value}</strong>
      {detail && <span>{detail}</span>}
    </div>
  )
}

export function ActionGroup({ actions }: { actions: Action[] }) {
  return (
    <div className="dashboard-action-group">
      {actions.map((action) => (
        <Button
          key={action.label}
          onClick={action.onClick}
          variant={action.variant || 'ghost'}
          disabled={action.disabled}
        >
          {action.label}
        </Button>
      ))}
    </div>
  )
}

export function LoadQueueForm({
  queueId,
  placeholder,
  submitLabel,
  recentLabel,
  recentQueues,
  onChange,
  onSubmit,
  onPickRecent,
}: {
  queueId: string
  placeholder: string
  submitLabel: string
  recentLabel: string
  recentQueues: string[]
  onChange: (value: string) => void
  onSubmit: () => void
  onPickRecent: (queueId: string) => void
}) {
  return (
    <div className="dashboard-load-card">
      <div className="dashboard-load-row">
        <input
          value={queueId}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={(event) => event.key === 'Enter' && onSubmit()}
          placeholder={placeholder}
          aria-label={placeholder}
        />
        <Button onClick={onSubmit}>{submitLabel}</Button>
      </div>

      {recentQueues.length > 0 && (
        <div className="dashboard-recent-queues" aria-label={recentLabel}>
          <span>{recentLabel}</span>
          {recentQueues.map((queue) => (
            <button key={queue} type="button" onClick={() => onPickRecent(queue)}>
              {queue}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export function SearchField({
  value,
  placeholder,
  onChange,
}: {
  value: string
  placeholder: string
  onChange: (value: string) => void
}) {
  return (
    <input
      className="dashboard-search-input"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      aria-label={placeholder}
    />
  )
}

export function QueueTicketRow({
  ticket,
  labels,
  onServe,
}: {
  ticket: Ticket
  labels: {
    anonymous: string
    priority: string
    notAvailable: string
    served: string
  }
  onServe?: (ticketId: string) => void
}) {
  return (
    <div className="dashboard-list-row">
      <strong className="dashboard-ticket-number">#{ticket.ticket_number}</strong>
      <div className="dashboard-list-main">
        <span>{ticket.customer_name || labels.anonymous}</span>
        <small>{ticket.customer_phone || labels.notAvailable}</small>
        {ticket.priority && (
          <em>
            {labels.priority}: {ticket.priority_reason || labels.notAvailable}
          </em>
        )}
      </div>
      <span className="dashboard-status-pill">{ticket.status}</span>
      {onServe && (
        <Button variant="ghost" onClick={() => onServe(ticket.id)}>
          {labels.served}
        </Button>
      )}
    </div>
  )
}

export function AppointmentRow({ appointment }: { appointment: Appointment }) {
  return (
    <div className="dashboard-list-row">
      <strong className="dashboard-time">
        {new Date(appointment.scheduledAt).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        })}
      </strong>
      <div className="dashboard-list-main">
        <span>{appointment.customerName}</span>
        <small>{appointment.customerPhone}</small>
      </div>
      <span className="dashboard-status-pill">{appointment.status}</span>
    </div>
  )
}

export function EmptyState({ message }: { message: string }) {
  return <div className="dashboard-empty-state">{message}</div>
}

export function ModuleToggleList({
  title,
  modules,
  onToggle,
}: {
  title: string
  modules: Array<{ id: string; label: string; enabled: boolean }>
  onToggle: (id: string) => void
}) {
  return (
    <div className="dashboard-module-list">
      <p className="dashboard-eyebrow">{title}</p>
      {modules.map((module) => (
        <button key={module.id} type="button" onClick={() => onToggle(module.id)}>
          <span>{module.label}</span>
          <span className={module.enabled ? 'is-on' : ''}>{module.enabled ? 'On' : 'Off'}</span>
        </button>
      ))}
    </div>
  )
}
