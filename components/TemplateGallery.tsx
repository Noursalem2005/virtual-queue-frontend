/**
 * SERVICE TEMPLATE GALLERY
 * Visual preview of pre-built templates
 * Click to load and apply template setup questions
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useAtom } from 'jotai';
import { loadedTemplateAtom, availableTemplatesAtom } from '@/lib/atoms';
import { useCommandBus } from '@/hooks/useCommandBus';
import { motion } from 'framer-motion';
import { useLang } from '@/components/providers/LangProvider';
import { TEMPLATES } from '@/hooks/useAITemplates';

export const TemplateGallery: React.FC<{
  onTemplateSelect?: (templateId: string) => void;
  showAIRecommendation?: boolean;
}> = ({ onTemplateSelect, showAIRecommendation = true }) => {
  const [, setLoadedTemplate] = useAtom(loadedTemplateAtom);
  const [templates] = useAtom(availableTemplatesAtom);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const { execute } = useCommandBus();
  const { t, lang, dir } = useLang();

  const displayTemplates = templates.length > 0 ? templates : TEMPLATES;

  const loadTemplate = (templateId: string) => {
    const template = displayTemplates.find((t) => t.id === templateId);
    if (template) {
      setLoadedTemplate(template);
      setSelectedTemplate(templateId);
      localStorage.setItem('workspace:template', JSON.stringify(template));

      execute({
        type: 'LOAD_TEMPLATE',
        templateId,
      });

      onTemplateSelect?.(templateId);
    }
  };

  return (
    <div className="space-y-6 p-6 bg-gradient-to-b from-neutral-900 to-neutral-950 rounded-xl border border-neutral-700">
      <div>
        <h3 className="text-xl font-bold text-white mb-2">
          {t({ en: '📋 Service Templates', ar: '📋 قوالب الخدمات' })}
        </h3>
        <p className="text-sm text-neutral-400">
          {t({
            en: 'Choose a pre-built template to get started instantly',
            ar: 'اختر قالبًا مدمجًا للبدء على الفور',
          })}
        </p>
      </div>

      {/* TEMPLATE CARDS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayTemplates.map((template, idx) => (
          <motion.button
            key={template.id}
            onClick={() => loadTemplate(template.id)}
            className={`p-4 rounded-xl border-2 transition text-left flex flex-col gap-3 ${
              selectedTemplate === template.id
                ? 'border-blue-500 bg-blue-600/20 shadow-lg shadow-blue-500/20'
                : 'border-neutral-700 bg-neutral-800 hover:bg-neutral-700 hover:border-neutral-600'
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05, type: 'spring' }}
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
          >
            {/* TEMPLATE HEADER */}
            <div className="flex items-start justify-between">
              <div>
                <div className="text-3xl mb-2">{template.emoji || template.icon}</div>
                <h4 className="font-semibold text-white text-sm leading-tight">
                  {template.name}
                </h4>
              </div>
              {selectedTemplate === template.id && (
                <span className="text-lg">✓</span>
              )}
            </div>

            {/* DESCRIPTION */}
            <p className="text-xs text-neutral-400 leading-tight">
              {template.description}
            </p>

            {/* STATS */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-neutral-400">Daily Volume:</span>
                <span className="font-mono text-white">{template.dailyVolume}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-neutral-400">Avg Service Time:</span>
                <span className="font-mono text-white">{template.estimatedServiceTime}m</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-neutral-400">Primary Channel:</span>
                <span className="font-mono text-white text-xs uppercase">
                  {template.primaryNotificationChannel}
                </span>
              </div>
            </div>

            {/* COLOR BADGE */}
            <div className="flex items-center gap-2 pt-2 border-t border-neutral-700">
              <div
                className="w-6 h-6 rounded-lg border border-neutral-600"
                style={{ backgroundColor: template.color }}
              />
              <span className="text-xs text-neutral-400">Brand color preview</span>
            </div>

            {/* LOAD BUTTON */}
            {selectedTemplate === template.id ? (
              <motion.div
                className="text-xs font-medium text-blue-400 py-2 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                ✓ {t({ en: 'Loaded', ar: 'تم التحميل' })}
              </motion.div>
            ) : (
              <div className="text-xs text-neutral-400 py-2 text-center hover:text-neutral-200 transition">
                {t({ en: 'Click to load →', ar: 'انقر للتحميل →' })}
              </div>
            )}
          </motion.button>
        ))}
      </div>

      {/* QUICK START CTA */}
      <motion.div
        className="p-4 rounded-lg bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <p className="text-sm text-white font-medium mb-2">
          💡 {t({ en: 'Quick Start Tip', ar: 'نصيحة البدء السريع' })}
        </p>
        <p className="text-xs text-neutral-300">
          {t({
            en: 'Load a template and customize it with your business details. Each template includes pre-configured setup questions.',
            ar: 'حمل قالبًا وخصصه ببيانات عملك. يتضمن كل قالب أسئلة إعداد مُعدة مسبقًا.',
          })}
        </p>
      </motion.div>
    </div>
  );
};
