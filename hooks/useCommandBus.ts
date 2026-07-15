/**
 * COMMAND BUS HOOK - Central command system (not typical component state)
 * All actions flow through commands → handlers → event store
 * Enables: undo/redo, action replaying, analytics, AI predictions
 */

import { useCallback, useRef } from 'react';
import { useAtom } from 'jotai';
import { eventStoreAtom, commandHistoryAtom } from '@/lib/atoms';

export type Command = 
  | { type: 'SERVE_TICKET'; ticketId: string; staffId: string }
  | { type: 'PAUSE_QUEUE'; queueId: string; reason: string }
  | { type: 'PRIORITY_TICKET'; ticketId: string; priority: 1 | 2 | 3 }
  | { type: 'NO_SHOW'; ticketId: string }
  | { type: 'CALL_CUSTOMER'; ticketId: string; method: 'sms' | 'whatsapp' | 'voice' }
  | { type: 'SET_BRAND_COLOR'; color: string; applyToTheme: boolean }
  | { type: 'CHANGE_PASSWORD'; oldPassword: string; newPassword: string }
  | { type: 'ENABLE_2FA'; method: 'email' | 'sms' | 'totp' }
  | { type: 'LOAD_TEMPLATE'; templateId: string }
  | { type: 'NAVIGATE_VIEW'; view: string };

export const useCommandBus = () => {
  const [eventStore, setEventStore] = useAtom(eventStoreAtom);
  const [history, setHistory] = useAtom(commandHistoryAtom);
  const undoStackRef = useRef<Command[]>([]);

  const execute = useCallback(async (cmd: Command) => {
    // 1. Add to event store (immutable log)
    const event = {
      id: `${Date.now()}-${Math.random()}`,
      type: cmd.type,
      timestamp: new Date(),
      payload: cmd,
    };
    
    setEventStore((prev) => [...prev, event]);
    setHistory((prev) => [...prev, cmd]);
    undoStackRef.current.push(cmd);

    // 2. Execute command handler (fetch API, update atoms, etc.)
    await handleCommand(cmd);

    // 3. Trigger analytics (optional)
    console.log(`[CMD] ${cmd.type}`, cmd);
  }, [setEventStore, setHistory]);

  const undo = useCallback(() => {
    const lastCmd = undoStackRef.current.pop();
    if (lastCmd) {
      console.log(`[UNDO] ${lastCmd.type}`);
      // Implement undo logic per command type
    }
  }, []);

  return { execute, undo, history, eventStore };
};

async function handleCommand(cmd: Command) {
  // Handlers execute actual API calls / state updates
  switch (cmd.type) {
    case 'SERVE_TICKET':
      await fetch(`/api/queues/${cmd.queueId}/serve`, {
        method: 'PATCH',
        body: JSON.stringify({ ticketId: cmd.ticketId, staffId: cmd.staffId }),
      });
      break;
    case 'SET_BRAND_COLOR':
      // Apply to CSS variable
      document.documentElement.style.setProperty('--brand-color', cmd.color);
      localStorage.setItem('brand:color', cmd.color);
      break;
    case 'LOAD_TEMPLATE':
      // Load template from backend + apply setup questions
      const resp = await fetch(`/api/templates/${cmd.templateId}`);
      const template = await resp.json();
      localStorage.setItem('workspace:template', JSON.stringify(template));
      break;
    // ... more handlers
  }
}
