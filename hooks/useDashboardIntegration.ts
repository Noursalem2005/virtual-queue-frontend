/**
 * INTEGRATION HOOK - Ties all hotkeys, gestures, and commands together
 * Use in main dashboard layout to activate full system
 */

import { useEffect, useCallback } from 'react';
import { useAtom } from 'jotai';
import { commandPaletteOpenAtom, notificationHubAtom } from '@/lib/atoms';
import { useCommandBus, Command } from './useCommandBus';
import { useGestures } from './useGestures';

export const useDashboardIntegration = (activeQueueId?: string) => {
  const [, setCommandPaletteOpen] = useAtom(commandPaletteOpenAtom);
  const [, setNotifications] = useAtom(notificationHubAtom);
  const { execute } = useCommandBus();

  // HOTKEY CONFIGURATION
  const gestureConfig: any = {
    hotkeys: {
      's': { type: 'SERVE_TICKET', queueId: activeQueueId || '', ticketId: '' } as Command,
      'n': { type: 'SERVE_TICKET', queueId: activeQueueId || '', ticketId: '' } as Command,
      'p': { type: 'PAUSE_QUEUE', queueId: activeQueueId || '', reason: 'Manual pause' } as Command,
      'r': { type: 'PRIORITY_TICKET', ticketId: '', priority: 1 } as Command,
    },
    swipeActions: {
      left: { type: 'NAVIGATE_VIEW', view: 'next' } as Command,
      right: { type: 'NAVIGATE_VIEW', view: 'previous' } as Command,
      up: { type: 'NAVIGATE_VIEW', view: 'up' } as Command,
      down: { type: 'NAVIGATE_VIEW', view: 'down' } as Command,
    },
  };

  // ACTIVATE GESTURE SYSTEM
  useGestures(gestureConfig);

  // LISTEN FOR CUSTOM EVENTS
  useEffect(() => {
    const handleToggleCommandPalette = () => {
      setCommandPaletteOpen((prev) => !prev);
    };

    const handleNewEvent = (e: CustomEvent<any>) => {
      // Add to notification hub when events occur
      const event = e.detail;
      setNotifications((prev) => [
        ...prev,
        {
          id: `${Date.now()}-${Math.random()}`,
          type: 'info',
          title: event.title,
          message: event.message,
          timestamp: new Date(),
        },
      ]);
    };

    window.addEventListener('TOGGLE_COMMAND_PALETTE', handleToggleCommandPalette as EventListener);
    window.addEventListener('NEW_QUEUE_EVENT', handleNewEvent as EventListener);

    return () => {
      window.removeEventListener('TOGGLE_COMMAND_PALETTE', handleToggleCommandPalette as EventListener);
      window.removeEventListener('NEW_QUEUE_EVENT', handleNewEvent as EventListener);
    };
  }, [setCommandPaletteOpen, setNotifications]);

  // EXPOSE HELPER METHODS
  return {
    openCommandPalette: () => setCommandPaletteOpen(true),
    executeCommand: execute,
  };
};

/**
 * HELPER: Emit queue event to notification hub
 */
export const emitQueueEvent = (title: string, message: string, eventType: 'success' | 'info' | 'error' = 'info') => {
  window.dispatchEvent(
    new CustomEvent('NEW_QUEUE_EVENT', {
      detail: { title, message, type: eventType },
    })
  );
};
