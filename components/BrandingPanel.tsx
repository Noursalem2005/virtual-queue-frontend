/**
 * SMART BRANDING SYSTEM
 * 1. Upload logo → AI extracts color palette
 * 2. Choose mood (professional, playful, minimal, warm) → applies color scheme
 * 3. Custom color picker
 * 4. Real-time CSS variable updates
 */

'use client';

import React, { useState, useRef } from 'react';
import { useAtom } from 'jotai';
import { brandColorAtom, brandLogoAtom, brandMoodAtom } from '@/lib/atoms';
import { useCommandBus } from '@/hooks/useCommandBus';
import { motion } from 'framer-motion';
import { useLang } from '@/components/providers/LangProvider';

type Mood = 'professional' | 'playful' | 'minimal' | 'warm';

const MOOD_PALETTES: Record<Mood, { primary: string; secondary: string; accent: string }> = {
  professional: {
    primary: '#1f2937', // Dark gray
    secondary: '#3b82f6', // Blue
    accent: '#fbbf24', // Amber
  },
  playful: {
    primary: '#ec4899', // Pink
    secondary: '#8b5cf6', // Purple
    accent: '#10b981', // Green
  },
  minimal: {
    primary: '#111827', // Almost black
    secondary: '#6b7280', // Gray
    accent: '#ffffff', // White
  },
  warm: {
    primary: '#92400e', // Brown
    secondary: '#f97316', // Orange
    accent: '#fbbf24', // Amber
  },
};

export const BrandingPanel: React.FC = () => {
  const [brandColor, setBrandColor] = useAtom(brandColorAtom);
  const [brandLogo, setBrandLogo] = useAtom(brandLogoAtom);
  const [brandMood, setBrandMood] = useAtom(brandMoodAtom);
  const [suggestedColors, setSuggestedColors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { execute } = useCommandBus();
  const { t, lang, dir } = useLang();

  // UPLOAD LOGO & EXTRACT COLORS
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);

    // Convert to base64
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const base64 = ev.target?.result as string;
      setBrandLogo(base64);
      localStorage.setItem('brand:logo', base64);

      // Call AI endpoint to extract colors
      try {
        const response = await fetch('/api/ai/suggest-colors', {
          method: 'POST',
          body: JSON.stringify({ logoBase64: base64 }),
        });
        const { palette } = await response.json();
        setSuggestedColors(palette || []);
      } catch (err) {
        console.error('Failed to extract colors:', err);
      } finally {
        setIsLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  // APPLY MOOD-BASED COLORS
  const applyMood = (mood: Mood) => {
    setBrandMood(mood);
    const palette = MOOD_PALETTES[mood];
    applyColorScheme(palette.primary, palette.secondary, palette.accent);
  };

  // APPLY COLOR SCHEME TO CSS
  const applyColorScheme = (
    primary: string,
    secondary: string,
    accent: string
  ) => {
    document.documentElement.style.setProperty('--brand-primary', primary);
    document.documentElement.style.setProperty('--brand-secondary', secondary);
    document.documentElement.style.setProperty('--brand-accent', accent);

    // Save to localStorage
    localStorage.setItem('brand:scheme', JSON.stringify({ primary, secondary, accent }));

    // Execute command for analytics
    execute({
      type: 'SET_BRAND_COLOR',
      color: primary,
      applyToTheme: true,
    });
  };

  // APPLY SUGGESTED COLOR FROM AI
  const applySuggestedColor = (color: string) => {
    setBrandColor(color);
    localStorage.setItem('brand:color', color);
    document.documentElement.style.setProperty('--brand-accent', color);
  };

  return (
    <div className="space-y-6 p-6 bg-gradient-to-b from-neutral-900 to-neutral-950 rounded-xl border border-neutral-700">
      <h3 className="text-xl font-bold text-white">
        {t({ en: '🎨 Branding & Customization', ar: '🎨 العلامة التجارية والتخصيص' })}
      </h3>

      {/* LOGO UPLOAD */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-neutral-300">
          {t({ en: 'Business Logo', ar: 'شعار العمل' })}
        </label>
        {brandLogo && (
          <div className="w-20 h-20 rounded-lg bg-neutral-800 p-2 border border-neutral-600 flex items-center justify-center overflow-hidden">
            <img src={brandLogo} alt="Logo" className="w-full h-full object-contain" />
          </div>
        )}
        <button
          onClick={() => fileInputRef.current?.click()}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
        >
          {isLoading ? 'Extracting colors...' : 'Upload Logo'}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleLogoUpload}
          hidden
        />
      </div>

      {/* MOOD SELECTOR */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-neutral-300">
          {t({ en: 'Brand Mood', ar: 'مزاج العلامة التجارية' })}
        </label>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(MOOD_PALETTES).map(([mood, palette]) => (
            <motion.button
              key={mood}
              onClick={() => applyMood(mood as Mood)}
              className={`p-4 rounded-lg border-2 transition ${
                brandMood === mood
                  ? 'border-blue-500 bg-blue-600/20'
                  : 'border-neutral-600 bg-neutral-800 hover:bg-neutral-700'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-medium capitalize text-white">{mood}</span>
              </div>
              <div className="flex gap-2">
                <div
                  className="w-8 h-8 rounded"
                  style={{ backgroundColor: palette.primary }}
                />
                <div
                  className="w-8 h-8 rounded"
                  style={{ backgroundColor: palette.secondary }}
                />
                <div
                  className="w-8 h-8 rounded"
                  style={{ backgroundColor: palette.accent }}
                />
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* AI-SUGGESTED COLORS */}
      {suggestedColors.length > 0 && (
        <div className="space-y-3">
          <label className="block text-sm font-medium text-neutral-300">
            {t({ en: 'AI Suggested Colors (from logo)', ar: 'الألوان المقترحة من الذكاء الاصطناعي' })}
          </label>
          <div className="flex gap-3">
            {suggestedColors.map((color) => (
              <motion.button
                key={color}
                onClick={() => applySuggestedColor(color)}
                className="w-12 h-12 rounded-lg border-2 border-neutral-600 hover:border-blue-500 transition"
                style={{ backgroundColor: color }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                title={color}
              />
            ))}
          </div>
        </div>
      )}

      {/* CUSTOM COLOR PICKER */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-neutral-300">
          {t({ en: 'Custom Brand Color', ar: 'اللون المخصص للعلامة التجارية' })}
        </label>
        <div className="flex gap-3">
          <input
            type="color"
            value={brandColor}
            onChange={(e) => {
              setBrandColor(e.target.value);
              localStorage.setItem('brand:color', e.target.value);
              document.documentElement.style.setProperty('--brand-accent', e.target.value);
            }}
            className="w-20 h-10 rounded-lg cursor-pointer"
          />
          <div className="flex-1 flex items-center">
            <input
              type="text"
              value={brandColor}
              onChange={(e) => {
                setBrandColor(e.target.value);
                localStorage.setItem('brand:color', e.target.value);
                document.documentElement.style.setProperty('--brand-accent', e.target.value);
              }}
              className="w-full px-3 py-2 bg-neutral-800 border border-neutral-600 rounded-lg text-white font-mono text-sm"
            />
          </div>
        </div>
      </div>

      {/* PREVIEW */}
      <div className="p-4 bg-neutral-800 rounded-lg border border-neutral-600 space-y-3">
        <label className="text-sm font-medium text-neutral-300">
          {t({ en: 'Preview', ar: 'معاينة' })}
        </label>
        <div className="flex gap-3">
          <motion.button
            className="px-4 py-2 rounded-lg text-white font-medium"
            style={{ backgroundColor: brandColor }}
            whileHover={{ scale: 1.05 }}
          >
            {t({ en: 'Primary Button', ar: 'الزر الأساسي' })}
          </motion.button>
          <div
            className="w-12 h-10 rounded-lg border-2 border-neutral-600"
            style={{ backgroundColor: brandColor }}
          />
        </div>
      </div>
    </div>
  );
};
