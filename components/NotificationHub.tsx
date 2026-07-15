/**
 * NOTIFICATION HUB - Floating panel that shows recent events
 * Click to expand into full command history/notification timeline
 * Not a typical toast corner - persistent, expandable, searchable
 */

'use client';

import React, { useState } from 'react';
import { useAtom } from 'jotai';
import { notificationHubAtom, eventStoreAtom } from '@/lib/atoms';
import { motion, AnimatePresence } from 'framer-motion';
import { useLang } from '@/components/providers/LangProvider';

export const NotificationHub: React.FC = () => {
  const [notifications, setNotifications] = useAtom(notificationHubAtom);
  const [eventStore] = useAtom(eventStoreAtom);
  const [isExpanded, setIsExpanded] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'success' | 'error' | 'command'>('all');
  const { t, dir } = useLang();

  const unreadCount = notifications.length;
  const filteredEvents = eventStore.filter((e) =>
    filterType === 'all' ? true : notifications.some((n) => n.id === e.id)
  );

  const clearNotifications = () => {
    setNotifications([]);
  };

  return (
    <>
      {/* FLOATING PILL BUTTON (bottom-right) */}
      <motion.button
        onClick={() => setIsExpanded(!isExpanded)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:shadow-xl transition"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <span className="text-lg">🔔</span>
        {unreadCount > 0 && (
          <span className="relative">
            <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold bg-red-500 rounded-full">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          </span>
        )}
        <span className="text-sm font-medium">
          {isExpanded ? t({ en: 'Close', ar: 'إغلاق' }) : t({ en: 'Events', ar: 'الأحداث' })}
        </span>
      </motion.button>

      {/* EXPANDED NOTIFICATION PANEL */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            className="fixed bottom-24 right-6 z-40 w-96 max-h-96 rounded-xl bg-gradient-to-b from-neutral-900 to-neutral-950 border border-neutral-700 shadow-2xl overflow-hidden flex flex-col"
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', damping: 20 }}
          >
            {/* HEADER */}
            <div className="border-b border-neutral-700 p-4 flex items-center justify-between">
              <h3 className="font-semibold text-white">
                {t({ en: 'Event Timeline', ar: 'المخطط الزمني' })}
              </h3>
              <button
                onClick={clearNotifications}
                className="text-xs text-neutral-400 hover:text-white transition"
              >
                {t({ en: 'Clear All', ar: 'مسح الكل' })}
              </button>
            </div>

            {/* FILTER TABS */}
            <div className="flex gap-2 px-4 pt-3 border-b border-neutral-700">
              {(['all', 'success', 'error', 'command'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`px-3 py-1 text-xs rounded-lg transition ${
                    filterType === type
                      ? 'bg-blue-600 text-white'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  {type === 'all' && t({ en: 'All', ar: 'الكل' })}
                  {type === 'success' && '✓ Success'}
                  {type === 'error' && '✕ Error'}
                  {type === 'command' && '⚡ Commands'}
                </button>
              ))}
            </div>

            {/* NOTIFICATIONS LIST */}
            <div className="flex-1 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-neutral-400 text-sm">
                  {t({ en: 'No notifications yet', ar: 'لا توجد إخطارات حتى الآن' })}
                </div>
              ) : (
                notifications.map((notif) => (
                  <motion.div
                    key={notif.id}
                    className={`px-4 py-3 border-b border-neutral-800 hover:bg-neutral-800/50 transition cursor-pointer`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                  >
                    <div className="flex items-start gap-3">
                      {/* ICON BY TYPE */}
                      <span className="text-lg pt-0.5">
                        {notif.type === 'success' && '✓'}
                        {notif.type === 'error' && '✕'}
                        {notif.type === 'command' && '⚡'}
                        {notif.type === 'info' && 'ℹ'}
                      </span>
                      <div className="flex-1">
                        <div className="font-medium text-white text-sm">{notif.title}</div>
                        <div className="text-xs text-neutral-400 mt-1">{notif.message}</div>
                        {notif.action && (
                          <button className="text-xs text-blue-400 hover:text-blue-300 mt-2">
                            {notif.action.label} →
                          </button>
                        )}
                        <div className="text-xs text-neutral-500 mt-2">
                          {notif.timestamp.toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

/**
 * HELPER: Add notification to hub
 * Usage: addNotification({type: 'success', title: 'Ticket served', message: 'Customer #5'})
 */
export const addNotificationToHub = (
  notification: {
    type: 'info' | 'success' | 'error' | 'command';
    title: string;
    message: string;
    actionable?: boolean;
    action?: { label: string; command: unknown };
  }
) => {
  void notification;
  // This is used in components via useAtom hook
  // Example: const [, setNotifications] = useAtom(notificationHubAtom);
  // setNotifications(prev => [...prev, {
  //   id: `${Date.now()}`, ...notification, timestamp: new Date()
  // }])
};
