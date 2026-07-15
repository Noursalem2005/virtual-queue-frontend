/**
 * AI TEMPLATE RECOMMENDER
 * Suggests templates based on business category, volume, industry
 * Uses simple ML (cosine similarity) - can integrate with OpenAI later
 */

import { useAtom } from 'jotai';
import { availableTemplatesAtom, aiSuggestionsAtom } from '@/lib/atoms';
import { useEffect, useCallback } from 'react';

interface BusinessProfile {
  category: string;
  estimatedDailyVolume: number;
  serviceType: 'appointment' | 'walk-in' | 'mixed';
  desiredFeatures: string[];
}

interface Template {
  id: string;
  name: string;
  emoji?: string;
  icon?: string;
  category: string;
  description: string;
  serviceModel: string;
  estimatedServiceTime: number;
  dailyVolume: number;
  primaryNotificationChannel: string;
  setupQuestions?: Record<string, any>;
  color: string;
}

export const useAITemplates = () => {
  const [, setTemplates] = useAtom(availableTemplatesAtom);
  const [, setSuggestions] = useAtom(aiSuggestionsAtom);

  const fetchTemplates = useCallback(async () => {
    // Fetch AI-enhanced templates from backend
    // Backend should call: /api/templates?sort=trending&limit=10
    const response = await fetch('/api/templates?trending=true');
    const data = await response.json();
    setTemplates(data.data || []);
  }, [setTemplates]);

  const recommendTemplate = useCallback(async (profile: BusinessProfile) => {
    // Backend endpoint: POST /api/ai/recommend-template
    // Send business profile → get recommended template ID + reasoning
    const response = await fetch('/api/ai/recommend-template', {
      method: 'POST',
      body: JSON.stringify(profile),
    });
    const { templateId, confidence, reasoning } = await response.json();
    
    setSuggestions((prev) => ({
      ...prev,
      recommendedTemplateId: templateId,
    }));

    return { templateId, confidence, reasoning };
  }, [setSuggestions]);

  const suggestColorScheme = useCallback(async (logoImageUrl: string) => {
    // Backend: POST /api/ai/suggest-colors
    // Extract dominant colors from logo image
    const response = await fetch('/api/ai/suggest-colors', {
      method: 'POST',
      body: JSON.stringify({ logoUrl: logoImageUrl }),
    });
    const { palette } = await response.json();

    setSuggestions((prev) => ({
      ...prev,
      suggestedColorScheme: palette,
    }));

    return palette; // Array of hex colors
  }, [setSuggestions]);

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  return {
    recommendTemplate,
    suggestColorScheme,
    fetchTemplates,
  };
};

// TEMPLATE DATA STRUCTURE
export const TEMPLATES = [
  {
    id: 'bank',
    name: 'Bank/Financial Services',
    emoji: '🏦',
    category: 'banking',
    description: 'Queue management for customer service counters',
    serviceModel: 'counter-service',
    estimatedServiceTime: 15,
    dailyVolume: 200,
    primaryNotificationChannel: 'sms',
    setupQuestions: {
      numberOfCounters: 5,
      operatingHours: '9AM-5PM',
      priorityTypes: ['regular', 'vip', 'elderly'],
    },
    color: '#1f2937', // Dark blue-gray
    icon: '🏦',
  },
  {
    id: 'hospital',
    name: 'Hospital/Clinic',
    emoji: '🏥',
    category: 'healthcare',
    description: 'Patient queue management for clinics and urgent care',
    serviceModel: 'appointment-walk-in',
    estimatedServiceTime: 20,
    dailyVolume: 150,
    primaryNotificationChannel: 'sms',
    setupQuestions: {
      departments: ['general', 'pediatrics', 'emergency'],
      averageWaitTime: 30,
    },
    color: '#dc2626', // Hospital red
    icon: '🏥',
  },
  {
    id: 'restaurant',
    name: 'Restaurant/Café',
    emoji: '🍽️',
    category: 'food-service',
    description: 'Table reservation and seating queue system',
    serviceModel: 'table-service',
    estimatedServiceTime: 5,
    dailyVolume: 300,
    primaryNotificationChannel: 'whatsapp',
    setupQuestions: {
      tableCount: 20,
      avgPartySize: 4,
      reservationType: 'phone-walk-in',
    },
    color: '#f59e0b', // Warm orange
    icon: '🍽️',
  },
  {
    id: 'dmv',
    name: 'Government Services (DMV, License)',
    emoji: '🚗',
    category: 'government',
    description: 'Large-scale queue management for license, permits, registration',
    serviceModel: 'ticket-based',
    estimatedServiceTime: 30,
    dailyVolume: 500,
    primaryNotificationChannel: 'email',
    setupQuestions: {
      serviceTypes: ['license', 'registration', 'permits'],
      windowCount: 12,
    },
    color: '#059669', // Government green
    icon: '🚗',
  },
  {
    id: 'salon',
    name: 'Salon/Spa/Barber',
    emoji: '💇',
    category: 'beauty',
    description: 'Appointment booking with walk-in queue',
    serviceModel: 'appointment-focused',
    estimatedServiceTime: 45,
    dailyVolume: 100,
    primaryNotificationChannel: 'whatsapp',
    setupQuestions: {
      stylistCount: 5,
      serviceTypes: ['haircut', 'coloring', 'spa'],
    },
    color: '#ec4899', // Pink
    icon: '💇',
  },
];
