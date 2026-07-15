/**
 * REACTIVE STATE WITH JOTAI ATOMS
 * Fine-grained reactivity - only components using specific atoms re-render
 * Instead of Context (which causes too many re-renders)
 */

import { atom } from 'jotai';

// COMMAND & EVENT LOGGING
export const eventStoreAtom = atom<any[]>([]);
export const commandHistoryAtom = atom<any[]>([]);

// NOTIFICATION HUB (not traditional toast corner)
export const notificationHubAtom = atom<
  Array<{
    id: string;
    type: 'info' | 'success' | 'error' | 'command';
    title: string;
    message: string;
    timestamp: Date;
    actionable?: boolean;
    action?: { label: string; command: any };
  }>
>([]);

// COMMAND PALETTE STATE
export const commandPaletteOpenAtom = atom(false);
export const commandPaletteSearchAtom = atom('');

// DASHBOARD UI STATE
export const dashboardCompactModeAtom = atom(false); // Mobile-responsive state
export const sidebarCollapsedAtom = atom(false);
export const activeViewAtom = atom('overview');

// BRANDING
export const brandColorAtom = atom(
  typeof window !== 'undefined' ? localStorage.getItem('brand:color') || '#6366f1' : '#6366f1'
);
export const brandLogoAtom = atom(
  typeof window !== 'undefined' ? localStorage.getItem('brand:logo') || '' : ''
);
export const brandMoodAtom = atom('professional'); // 'professional', 'playful', 'minimal', 'warm'

// SERVICE TEMPLATES
export const loadedTemplateAtom = atom<{
  id: string;
  name: string;
  category: string;
  serviceModel: string;
  dailyVolume: number;
  primaryChannel: string;
  goal: string;
} | null>(null);

export const availableTemplatesAtom = atom<any[]>([]);

// 2FA & SECURITY
export const twoFactorEnabledAtom = atom(false);
export const twoFactorMethodAtom = atom<'email' | 'sms' | 'totp'>('email');
export const loginHistoryAtom = atom<
  Array<{
    timestamp: Date;
    device: string;
    location: string;
    ipAddress: string;
    status: 'success' | 'failed';
  }>
>([]);

// AI SUGGESTIONS (for templates, colors, actions)
export const aiSuggestionsAtom = atom<{
  recommendedTemplateId?: string;
  suggestedColorScheme?: string[];
  nextRecommendedAction?: string;
  estimatedServiceTime?: number;
}>({});

// OFFLINE SYNC QUEUE
export const syncQueueAtom = atom<
  Array<{
    id: string;
    command: any;
    retries: number;
    lastAttempt: Date;
  }>
>([]);
