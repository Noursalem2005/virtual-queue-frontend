/**
 * MOBILE-RESPONSIVE DASHBOARD LAYOUT
 * On mobile: bottom-sheet drawer for sidebar
 * On tablet: split-view (sidebar + content side-by-side)
 * On desktop: traditional sidebar + main layout
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useAtom } from 'jotai';
import { sidebarCollapsedAtom, dashboardCompactModeAtom } from '@/lib/atoms';
import { motion, AnimatePresence } from 'framer-motion';
import { useLang } from '@/components/providers/LangProvider';

interface ResponsiveLayoutProps {
  sidebar: React.ReactNode;
  main: React.ReactNode;
  bottomNav?: React.ReactNode; // Mobile-only navigation
}

export const ResponsiveLayout: React.FC<ResponsiveLayoutProps> = ({
  sidebar,
  main,
  bottomNav,
}) => {
  const [isCompact, setIsCompact] = useAtom(dashboardCompactModeAtom);
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const { t, dir } = useLang();

  // RESPONSIVE BREAKPOINT DETECTION
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768); // < md
      setIsTablet(width >= 768 && width < 1024); // md to lg
      setIsCompact(width < 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setIsCompact]);

  // MOBILE LAYOUT: Bottom-sheet drawer for sidebar
  if (isMobile) {
    return (
      <div className="flex flex-col h-screen bg-gradient-to-b from-neutral-900 to-neutral-950">
        {/* MAIN CONTENT */}
        <div className="flex-1 overflow-y-auto pb-20">
          {main}
        </div>

        {/* MOBILE BOTTOM SHEET DRAWER */}
        <motion.div
          className="fixed bottom-0 left-0 right-0 z-30 bg-neutral-900 border-t border-neutral-700 rounded-t-2xl shadow-2xl"
          initial={{ y: '100%' }}
          animate={{ y: showBottomSheet ? 0 : '100%' }}
          transition={{ type: 'spring', damping: 30 }}
        >
          <div className="max-h-96 overflow-y-auto">
            {/* DRAG HANDLE */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-12 h-1 bg-neutral-600 rounded-full" />
            </div>
            {sidebar}
          </div>
        </motion.div>

        {/* BOTTOM NAVIGATION BAR */}
        <div className="fixed bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-neutral-900 to-neutral-800 border-t border-neutral-700 z-20 flex items-center justify-around px-4">
          {/* Hamburger menu button */}
          <motion.button
            onClick={() => setShowBottomSheet(!showBottomSheet)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white font-medium"
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-xl">☰</span>
            Menu
          </motion.button>

          {/* Module shortcuts */}
          {bottomNav && <div className="flex gap-2 flex-1 justify-center">{bottomNav}</div>}
        </div>
      </div>
    );
  }

  // TABLET LAYOUT: Split-view (sidebar + main)
  if (isTablet) {
    return (
      <div className="flex h-screen bg-neutral-900 gap-4 p-4">
        {/* SIDEBAR - Collapsible on tablet */}
        <motion.div
          className="w-64 flex-shrink-0 bg-neutral-950 border border-neutral-700 rounded-xl overflow-y-auto"
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: 'spring', damping: 20 }}
        >
          {sidebar}
        </motion.div>

        {/* MAIN CONTENT */}
        <div className="flex-1 overflow-y-auto">
          {main}
        </div>
      </div>
    );
  }

  // DESKTOP LAYOUT: Traditional sidebar
  return (
    <div className="flex h-screen bg-neutral-900">
      {/* SIDEBAR */}
      <motion.div
        className="w-72 bg-gradient-to-b from-neutral-900 to-neutral-950 border-r border-neutral-700 overflow-y-auto"
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: 'spring', damping: 20 }}
      >
        {sidebar}
      </motion.div>

      {/* MAIN CONTENT */}
      <div className="flex-1 overflow-y-auto">
        {main}
      </div>
    </div>
  );
};

/**
 * BOTTOM NAVIGATION ITEMS - Mobile-only shortcuts
 */
export const MobileBottomNav: React.FC<{ modules: Array<{ id: string; icon: string; label: string }> }> = ({
  modules,
}) => {
  return (
    <div className="flex gap-2 justify-center items-center">
      {modules.map((mod) => (
        <motion.button
          key={mod.id}
          className="flex flex-col items-center gap-1 px-3 py-2 rounded-lg text-xs text-neutral-300 hover:text-white hover:bg-neutral-800 transition"
          whileTap={{ scale: 0.9 }}
        >
          <span className="text-xl">{mod.icon}</span>
          <span>{mod.label}</span>
        </motion.button>
      ))}
    </div>
  );
};
