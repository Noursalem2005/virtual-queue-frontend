'use client'

import {
  LayoutDashboard,
  Activity,
  CalendarDays,
  Users,
  BarChart3,
  CreditCard,
  MonitorPlay,
} from 'lucide-react'

export type DashboardView =
  | 'overview'
  | 'live'
  | 'appointments'
  | 'customers'
  | 'analytics'
  | 'billing'
  | 'screen'

type SidebarItem = {
  id: DashboardView
  label: string
}

type Props = {
  items: SidebarItem[]
  activeView: DashboardView
  owner?: string
  modules: Array<{
    id: string
    label: string
    enabled: boolean
  }>
  moduleTitle: string
  onToggleModule: (id: string) => void
  onChangeView: (view: DashboardView) => void
}

const icons: Record<DashboardView, JSX.Element> = {
  overview: <LayoutDashboard size={19} />,
  live: <Activity size={19} />,
  appointments: <CalendarDays size={19} />,
  customers: <Users size={19} />,
  analytics: <BarChart3 size={19} />,
  billing: <CreditCard size={19} />,
  screen: <MonitorPlay size={19} />,
}

export default function DashboardSidebar({
  items,
  activeView,
  owner,
  modules,
  moduleTitle,
  onToggleModule,
  onChangeView,
}: Props) {
  return (
    <aside className="dashboard-sidebar">

      <div className="dashboard-brand">
        <h1>Queuely</h1>
        <p>{owner || 'Business Owner'}</p>
      </div>

      <nav className="dashboard-nav">

        {items.map((item) => (

          <button
            key={item.id}
            type="button"
            onClick={() => onChangeView(item.id)}
            className={activeView === item.id ? 'is-active' : ''}
          >

            <span className="dashboard-nav-icon">
              {icons[item.id]}
            </span>

            <span>{item.label}</span>

          </button>

        ))}

      </nav>

      <div className="dashboard-module-list">

        <p className="dashboard-eyebrow">
          {moduleTitle}
        </p>

        {modules.map((module) => (

          <button
            key={module.id}
            type="button"
            onClick={() => onToggleModule(module.id)}
            className="dashboard-module-toggle"
          >

            <span>{module.label}</span>

            <span
              className={`dashboard-switch ${
                module.enabled ? 'is-on' : ''
              }`}
            >
              <span />
            </span>

          </button>

        ))}

      </div>

    </aside>
  )
}