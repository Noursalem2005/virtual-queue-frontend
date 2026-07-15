/**
 * EXAMPLE: Complete Dashboard Integration with All New Features
 * Shows how to use CommandBus, Gestures, CommandPalette, NotificationHub, etc.
 */

'use client';

import React, { useEffect } from 'react';
import { useAtom } from 'jotai';
import { activeViewAtom } from '@/lib/atoms';
import { useDashboardIntegration, emitQueueEvent } from '@/hooks/useDashboardIntegration';
import { useLang } from '@/components/providers/LangProvider';

// COMPONENTS
import { CommandPalette } from '@/components/CommandPalette';
import { NotificationHub } from '@/components/NotificationHub';
import { ResponsiveLayout, MobileBottomNav } from '@/components/ResponsiveLayout';
import { TemplateGallery } from '@/components/TemplateGallery';
import { BrandingPanel } from '@/components/BrandingPanel';
import { SecuritySettings } from '@/components/SecuritySettings';

/**
 * FULL DASHBOARD EXAMPLE with all new features integrated
 */
export const NewDashboard: React.FC = () => {
  const [activeView, setActiveView] = useAtom(activeViewAtom);
  const { openCommandPalette } = useDashboardIntegration();
  const { t, lang, dir } = useLang();

  // INITIALIZE FEATURES
  useEffect(() => {
    // Show welcome notification
    emitQueueEvent(
      t({ en: '👋 Welcome to Dashboard', ar: '👋 مرحبا بك في لوحة التحكم' }),
      t({ en: 'Press Cmd+K to open command palette', ar: 'اضغط Cmd+K لفتح لوحة الأوامر' }),
      'info'
    );

    // Simulate real-time queue events
    const eventSimulator = setInterval(() => {
      const events = [
        { title: 'New Ticket', message: 'Customer #5 joined queue' },
        { title: 'Ticket Served', message: 'Customer #3 service completed' },
        { title: 'Queue Status', message: '12 customers waiting, avg wait: 5 mins' },
      ];
      const randomEvent = events[Math.floor(Math.random() * events.length)];
      // emitQueueEvent(randomEvent.title, randomEvent.message);
    }, 30000); // Every 30 seconds

    return () => clearInterval(eventSimulator);
  }, [t]);

  // SIDEBAR CONTENT
  const Sidebar = (
    <div className="p-6 space-y-6">
      {/* LOGO & TITLE */}
      <div className="flex items-center gap-3">
        <span className="text-3xl">🎫</span>
        <div>
          <h1 className="text-xl font-bold text-white">Queue Manager</h1>
          <p className="text-xs text-neutral-400">Next-gen admin dashboard</p>
        </div>
      </div>

      {/* QUICK STATS */}
      <div className="space-y-2">
        <div className="p-3 bg-neutral-800/50 rounded-lg">
          <div className="text-xs text-neutral-400">Active Queues</div>
          <div className="text-2xl font-bold text-white">3</div>
        </div>
        <div className="p-3 bg-neutral-800/50 rounded-lg">
          <div className="text-xs text-neutral-400">Customers Waiting</div>
          <div className="text-2xl font-bold text-white">24</div>
        </div>
        <div className="p-3 bg-neutral-800/50 rounded-lg">
          <div className="text-xs text-neutral-400">Avg Wait Time</div>
          <div className="text-2xl font-bold text-white">8m</div>
        </div>
      </div>

      {/* MODULE NAVIGATION */}
      <nav className="space-y-2 border-t border-neutral-700 pt-4">
        {[
          { id: 'templates', icon: '📋', label: 'Templates' },
          { id: 'branding', icon: '🎨', label: 'Branding' },
          { id: 'security', icon: '🔐', label: 'Security' },
        ].map((mod) => (
          <button
            key={mod.id}
            onClick={() => setActiveView(mod.id)}
            className={`w-full text-left px-3 py-2 rounded-lg transition ${
              activeView === mod.id
                ? 'bg-blue-600 text-white'
                : 'text-neutral-300 hover:bg-neutral-800'
            }`}
          >
            {mod.icon} {mod.label}
          </button>
        ))}
      </nav>

      {/* KEYBOARD SHORTCUT HINTS */}
      <div className="text-xs text-neutral-500 space-y-1 border-t border-neutral-700 pt-4">
        <div>
          <kbd className="px-2 py-1 bg-neutral-800 rounded text-xs">Cmd+K</kbd> Commands
        </div>
        <div>
          <kbd className="px-2 py-1 bg-neutral-800 rounded text-xs">S</kbd> Serve
        </div>
        <div>
          <kbd className="px-2 py-1 bg-neutral-800 rounded text-xs">P</kbd> Pause
        </div>
      </div>
    </div>
  );

  // MAIN CONTENT
  const Main = (
    <div className="p-8 space-y-8">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white">
            {activeView === 'templates' && t({ en: 'Service Templates', ar: 'قوالس الخدمات' })}
            {activeView === 'branding' && t({ en: 'Brand Settings', ar: 'إعدادات العلامة التجارية' })}
            {activeView === 'security' && t({ en: 'Security & Account', ar: 'الأمان والحساب' })}
          </h2>
          <p className="text-neutral-400 mt-1">
            {activeView === 'templates' && 'Choose pre-built templates or customize'}
            {activeView === 'branding' && 'Personalize your dashboard appearance'}
            {activeView === 'security' && 'Manage password, 2FA, and login history'}
          </p>
        </div>
        <button
          onClick={() => openCommandPalette()}
          className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg transition"
        >
          {t({ en: '⌘ Open Commands', ar: '⌘ فتح الأوامر' })}
        </button>
      </div>

      {/* CONTENT VIEWS */}
      <div className="space-y-6">
        {activeView === 'templates' && <TemplateGallery />}
        {activeView === 'branding' && <BrandingPanel />}
        {activeView === 'security' && <SecuritySettings />}

        {!['templates', 'branding', 'security'].includes(activeView) && (
          <div className="p-8 bg-neutral-800/50 rounded-xl text-center">
            <p className="text-neutral-400">
              {t({ en: 'Select a module from the sidebar', ar: 'حدد وحدة من الشريط الجانبي' })}
            </p>
          </div>
        )}
      </div>
    </div>
  );

  // MOBILE BOTTOM NAV
  const BottomNav = (
    <MobileBottomNav
      modules={[
        { id: 'templates', icon: '📋', label: 'Templates' },
        { id: 'branding', icon: '🎨', label: 'Branding' },
        { id: 'security', icon: '🔐', label: 'Security' },
      ]}
    />
  );

  return (
    <div>
      {/* COMMAND PALETTE & NOTIFICATION HUB - Global Components */}
      <CommandPalette />
      <NotificationHub />

      {/* RESPONSIVE LAYOUT */}
      <ResponsiveLayout
        sidebar={Sidebar}
        main={Main}
        bottomNav={BottomNav}
      />
    </div>
  );
};

export default NewDashboard;
