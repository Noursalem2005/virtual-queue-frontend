/**
 * COMMAND PALETTE - Cmd+K to open, search commands, execute with preview
 * Similar to VS Code's command palette, but for queue management
 * Shows AI-suggested next actions at the top
 */

'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useAtom } from 'jotai';
import { commandPaletteOpenAtom, commandPaletteSearchAtom, aiSuggestionsAtom } from '@/lib/atoms';
import { useCommandBus } from '@/hooks/useCommandBus';
import { motion, AnimatePresence } from 'framer-motion';
import { useLang } from '@/components/providers/LangProvider';

interface CommandItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: string;
  command: Parameters<ReturnType<typeof useCommandBus>['execute']>[0];
  keywords: string[];
  hotkey?: string;
  suggested?: boolean; // AI-suggested
}

export const CommandPalette: React.FC = () => {
  const [isOpen, setIsOpen] = useAtom(commandPaletteOpenAtom);
  const [search, setSearch] = useAtom(commandPaletteSearchAtom);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [suggestions] = useAtom(aiSuggestionsAtom);
  const { execute } = useCommandBus();
  const { t, lang, dir } = useLang();

  // ALL AVAILABLE COMMANDS
  const allCommands: CommandItem[] = useMemo(() => [
    // AI-SUGGESTED (pinned to top)
    ...(suggestions.nextRecommendedAction
      ? [
          {
            id: 'ai-suggest',
            title: t({ en: 'AI Suggested Action', ar: 'الإجراء المقترح بواسطة AI' }),
            description: suggestions.nextRecommendedAction,
            icon: '🤖',
            category: 'ai',
            command: { type: 'AI_ACTION' },
            keywords: ['ai', 'suggest', 'next'],
            suggested: true,
          },
        ]
      : []),

    // QUEUE OPERATIONS
    {
      id: 'serve-ticket',
      title: t({ en: 'Serve Next Ticket', ar: 'خدمة التذكرة التالية' }),
      description: t({ en: 'Call the next customer in queue', ar: 'استدعاء العميل التالي' }),
      icon: '📞',
      category: 'queue',
      command: { type: 'SERVE_TICKET' },
      keywords: ['serve', 'next', 'call', 'customer'],
      hotkey: 'S',
    },
    {
      id: 'pause-queue',
      title: t({ en: 'Pause Queue', ar: 'إيقاف الطابور' }),
      description: t({ en: 'Temporarily pause this queue', ar: 'إيقاف الطابور مؤقتًا' }),
      icon: '⏸️',
      category: 'queue',
      command: { type: 'PAUSE_QUEUE' },
      keywords: ['pause', 'stop', 'hold'],
      hotkey: 'P',
    },
    {
      id: 'priority-ticket',
      title: t({ en: 'Mark as Priority', ar: 'وضع علامة كأولوية' }),
      description: t({ en: 'Elevate ticket priority', ar: 'رفع أولوية التذكرة' }),
      icon: '⭐',
      category: 'queue',
      command: { type: 'PRIORITY_TICKET' },
      keywords: ['priority', 'vip', 'urgent'],
      hotkey: 'R',
    },
    {
      id: 'no-show',
      title: t({ en: 'Mark No-Show', ar: 'وضع علامة عدم الحضور' }),
      description: t({ en: 'Customer did not arrive', ar: 'العميل لم يصل' }),
      icon: '❌',
      category: 'queue',
      command: { type: 'NO_SHOW' },
      keywords: ['absent', 'no-show', 'skip'],
    },
    {
      id: 'call-customer',
      title: t({ en: 'Contact Customer', ar: 'الاتصال بالعميل' }),
      description: t({ en: 'SMS, WhatsApp, or call customer', ar: 'إرسال رسالة أو اتصال' }),
      icon: '📱',
      category: 'queue',
      command: { type: 'CALL_CUSTOMER' },
      keywords: ['call', 'contact', 'sms', 'whatsapp'],
    },

    // BRANDING & SETTINGS
    {
      id: 'brand-color',
      title: t({ en: 'Change Brand Color', ar: 'تغيير لون العلامة التجارية' }),
      description: t({ en: 'Pick a new color scheme for dashboard', ar: 'اختر لونًا جديدًا' }),
      icon: '🎨',
      category: 'branding',
      command: { type: 'SET_BRAND_COLOR' },
      keywords: ['color', 'theme', 'branding', 'customize'],
    },
    {
      id: 'upload-logo',
      title: t({ en: 'Upload Logo', ar: 'تحميل الشعار' }),
      description: t({ en: 'Upload your business logo', ar: 'تحميل شعار عملك' }),
      icon: '📸',
      category: 'branding',
      command: { type: 'UPLOAD_LOGO' },
      keywords: ['logo', 'image', 'upload', 'brand'],
    },

    // SECURITY
    {
      id: 'change-password',
      title: t({ en: 'Change Password', ar: 'تغيير كلمة المرور' }),
      description: t({ en: 'Update your account password', ar: 'تحديث كلمة المرور' }),
      icon: '🔑',
      category: 'security',
      command: { type: 'CHANGE_PASSWORD' },
      keywords: ['password', 'security', 'account'],
    },
    {
      id: 'enable-2fa',
      title: t({ en: 'Enable 2FA', ar: 'تفعيل المصادقة الثنائية' }),
      description: t({ en: 'Add two-factor authentication', ar: 'أضف حماية ثنائية' }),
      icon: '🔐',
      category: 'security',
      command: { type: 'ENABLE_2FA' },
      keywords: ['2fa', 'security', 'totp', 'authentication'],
    },

    // TEMPLATES
    {
      id: 'load-template',
      title: t({ en: 'Load Service Template', ar: 'تحميل قالب الخدمة' }),
      description: t({ en: 'Quick-start with pre-built templates', ar: 'ابدأ بقالب جاهز' }),
      icon: '📋',
      category: 'templates',
      command: { type: 'LOAD_TEMPLATE' },
      keywords: ['template', 'preset', 'setup', 'quick-start'],
    },

    // NAVIGATION
    {
      id: 'go-overview',
      title: t({ en: 'Go to Overview', ar: 'انتقل إلى النظرة العامة' }),
      description: t({ en: 'View dashboard overview', ar: 'عرض النظرة العامة' }),
      icon: '📊',
      category: 'navigation',
      command: { type: 'NAVIGATE_VIEW', view: 'overview' },
      keywords: ['overview', 'home', 'dashboard'],
    },
    {
      id: 'go-analytics',
      title: t({ en: 'Go to Analytics', ar: 'انتقل إلى التحليلات' }),
      description: t({ en: 'View queue analytics', ar: 'عرض تحليلات الطابور' }),
      icon: '📈',
      category: 'navigation',
      command: { type: 'NAVIGATE_VIEW', view: 'analytics' },
      keywords: ['analytics', 'stats', 'data'],
    },
  ] as CommandItem[], [t, suggestions.nextRecommendedAction]);

  // FILTER & SORT COMMANDS
  const filteredCommands = useMemo(() => {
    const searchLower = search.toLowerCase();
    return allCommands
      .filter(
        (cmd) =>
          cmd.title.toLowerCase().includes(searchLower) ||
          cmd.keywords.some((k) => k.includes(searchLower))
      )
      .sort((a, b) => {
        // AI-suggested first, then by category
        if (a.suggested && !b.suggested) return -1;
        if (!a.suggested && b.suggested) return 1;
        return 0;
      });
  }, [allCommands, search]);

  // KEYBOARD NAVIGATION
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex((prev) => (prev + 1) % filteredCommands.length);
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % filteredCommands.length);
          break;
        case 'Enter':
          e.preventDefault();
          const selected = filteredCommands[selectedIndex];
          if (selected) {
            execute(selected.command);
            setIsOpen(false);
            setSearch('');
          }
          break;
        case 'Escape':
          e.preventDefault();
          setIsOpen(false);
          setSearch('');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, filteredCommands, execute, setIsOpen, setSearch]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 pt-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => {
            setIsOpen(false);
            setSearch('');
          }}
        >
          <motion.div
            className="w-full max-w-2xl rounded-xl bg-gradient-to-b from-neutral-900 to-neutral-950 shadow-2xl border border-neutral-700"
            initial={{ scale: 0.95, y: -20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: -20 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* INPUT */}
            <div className="border-b border-neutral-700 p-4">
              <input
                autoFocus
                type="text"
                placeholder={t({ en: 'Search commands... (Cmd+K)', ar: 'ابحث عن الأوامر...' })}
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setSelectedIndex(0);
                }}
                className="w-full bg-transparent text-lg text-white outline-none placeholder-neutral-500"
              />
            </div>

            {/* RESULTS */}
            <div className="max-h-96 overflow-y-auto">
              {filteredCommands.length === 0 ? (
                <div className="p-8 text-center text-neutral-400">
                  {t({ en: 'No commands found', ar: 'لم يتم العثور على أوامر' })}
                </div>
              ) : (
                filteredCommands.map((cmd, idx) => (
                  <motion.button
                    key={cmd.id}
                    onClick={() => {
                      execute(cmd.command);
                      setIsOpen(false);
                      setSearch('');
                    }}
                    className={`w-full px-4 py-3 text-left flex items-start gap-4 border-b border-neutral-800 hover:bg-neutral-800 transition ${
                      idx === selectedIndex ? 'bg-neutral-800 ring-1 ring-blue-500' : ''
                    } ${cmd.suggested ? 'bg-gradient-to-r from-blue-900/30 to-transparent' : ''}`}
                    whileHover={{ x: 4 }}
                  >
                    <span className="text-2xl pt-1">{cmd.icon}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-white">{cmd.title}</span>
                        {cmd.hotkey && (
                          <span className="text-xs px-2 py-1 rounded bg-neutral-700 text-neutral-300">
                            {cmd.hotkey}
                          </span>
                        )}
                        {cmd.suggested && (
                          <span className="text-xs px-2 py-1 rounded bg-blue-600 text-white">
                            AI
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-neutral-400 mt-1">{cmd.description}</div>
                    </div>
                  </motion.button>
                ))
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
