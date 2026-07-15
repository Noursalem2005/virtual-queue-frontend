/**
 * SECURITY SETTINGS PAGE
 * - Password change with validation
 * - 2FA setup (email, SMS, TOTP)
 * - Login history view
 * - Active sessions management
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useAtom } from 'jotai';
import { twoFactorEnabledAtom, twoFactorMethodAtom, loginHistoryAtom } from '@/lib/atoms';
import { useCommandBus } from '@/hooks/useCommandBus';
import { motion } from 'framer-motion';
import { useLang } from '@/components/providers/LangProvider';

export const SecuritySettings: React.FC = () => {
  const [twoFactorEnabled, setTwoFactorEnabled] = useAtom(twoFactorEnabledAtom);
  const [twoFactorMethod, setTwoFactorMethod] = useAtom(twoFactorMethodAtom);
  const [loginHistory, setLoginHistory] = useAtom(loginHistoryAtom);
  const [passwordForm, setPasswordForm] = useState({ current: '', new: '', confirm: '' });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [setup2FAStep, setSetup2FAStep] = useState<'inactive' | 'choose' | 'verify'>('inactive');
  const [verificationCode, setVerificationCode] = useState('');
  const { execute } = useCommandBus();
  const { t, lang, dir } = useLang();

  // FETCH LOGIN HISTORY
  useEffect(() => {
    const fetchLoginHistory = async () => {
      try {
        const response = await fetch('/api/auth/login-history');
        const data = await response.json();
        if (data.ok) {
          setLoginHistory(data.data || []);
        }
      } catch (err) {
        console.error('Failed to fetch login history:', err);
      }
    };

    fetchLoginHistory();
  }, [setLoginHistory]);

  // CHANGE PASSWORD
  const handleChangePassword = async () => {
    setPasswordError('');
    setPasswordSuccess('');

    // VALIDATION
    if (!passwordForm.current) {
      setPasswordError(t({ en: 'Current password is required', ar: 'كلمة المرور الحالية مطلوبة' }));
      return;
    }
    if (passwordForm.new.length < 8) {
      setPasswordError(
        t({ en: 'New password must be at least 8 characters', ar: 'كلمة المرور الجديدة يجب أن تكون 8 أحرف على الأقل' })
      );
      return;
    }
    if (passwordForm.new !== passwordForm.confirm) {
      setPasswordError(t({ en: 'Passwords do not match', ar: 'كلمات المرور غير متطابقة' }));
      return;
    }

    setIsChangingPassword(true);

    try {
      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: passwordForm.current,
          newPassword: passwordForm.new,
        }),
      });

      const data = await response.json();

      if (data.ok) {
        setPasswordSuccess(t({ en: 'Password changed successfully', ar: 'تم تغيير كلمة المرور بنجاح' }));
        setPasswordForm({ current: '', new: '', confirm: '' });

        execute({
          type: 'CHANGE_PASSWORD',
          oldPassword: passwordForm.current,
          newPassword: passwordForm.new,
        });
      } else {
        setPasswordError(data.error || t({ en: 'Failed to change password', ar: 'فشل تغيير كلمة المرور' }));
      }
    } catch (err) {
      setPasswordError(t({ en: 'An error occurred', ar: 'حدث خطأ' }));
    } finally {
      setIsChangingPassword(false);
    }
  };

  // SETUP 2FA
  const handleSetup2FA = async (method: 'email' | 'sms' | 'totp') => {
    setTwoFactorMethod(method);
    setSetup2FAStep('verify');

    try {
      const response = await fetch('/api/auth/2fa/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ method }),
      });

      const data = await response.json();

      if (!data.ok) {
        alert(data.error);
      }
    } catch (err) {
      console.error('Failed to setup 2FA:', err);
    }
  };

  // VERIFY 2FA
  const handleVerify2FA = async () => {
    try {
      const response = await fetch('/api/auth/2fa/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ method: twoFactorMethod, code: verificationCode }),
      });

      const data = await response.json();

      if (data.ok) {
        setTwoFactorEnabled(true);
        setSetup2FAStep('inactive');
        setVerificationCode('');

        execute({
          type: 'ENABLE_2FA',
          method: twoFactorMethod,
        });
      } else {
        alert(data.error || 'Verification failed');
      }
    } catch (err) {
      console.error('Failed to verify 2FA:', err);
    }
  };

  // DISABLE 2FA
  const handleDisable2FA = async () => {
    if (!confirm(t({ en: 'Are you sure? This will reduce account security.', ar: 'هل أنت متأكد؟' }))) {
      return;
    }

    try {
      const response = await fetch('/api/auth/2fa/disable', {
        method: 'POST',
      });

      const data = await response.json();

      if (data.ok) {
        setTwoFactorEnabled(false);
      }
    } catch (err) {
      console.error('Failed to disable 2FA:', err);
    }
  };

  return (
    <div className="space-y-6 p-6 bg-gradient-to-b from-neutral-900 to-neutral-950 rounded-xl border border-neutral-700">
      <h2 className="text-2xl font-bold text-white">
        {t({ en: '🔐 Security Settings', ar: '🔐 إعدادات الأمان' })}
      </h2>

      {/* CHANGE PASSWORD */}
      <motion.div
        className="space-y-4 p-4 bg-neutral-800/50 rounded-lg border border-neutral-700"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h3 className="text-lg font-semibold text-white">
          {t({ en: 'Change Password', ar: 'تغيير كلمة المرور' })}
        </h3>

        <div className="space-y-3">
          <input
            type="password"
            placeholder={t({ en: 'Current Password', ar: 'كلمة المرور الحالية' })}
            value={passwordForm.current}
            onChange={(e) => setPasswordForm({ ...passwordForm, current: e.target.value })}
            className="w-full px-4 py-2 bg-neutral-900 border border-neutral-600 rounded-lg text-white placeholder-neutral-500 focus:border-blue-500 focus:outline-none transition"
          />
          <input
            type="password"
            placeholder={t({ en: 'New Password (min 8 chars)', ar: 'كلمة المرور الجديدة' })}
            value={passwordForm.new}
            onChange={(e) => setPasswordForm({ ...passwordForm, new: e.target.value })}
            className="w-full px-4 py-2 bg-neutral-900 border border-neutral-600 rounded-lg text-white placeholder-neutral-500 focus:border-blue-500 focus:outline-none transition"
          />
          <input
            type="password"
            placeholder={t({ en: 'Confirm New Password', ar: 'تأكيد كلمة المرور الجديدة' })}
            value={passwordForm.confirm}
            onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
            className="w-full px-4 py-2 bg-neutral-900 border border-neutral-600 rounded-lg text-white placeholder-neutral-500 focus:border-blue-500 focus:outline-none transition"
          />
        </div>

        {passwordError && (
          <div className="text-red-400 text-sm">{passwordError}</div>
        )}
        {passwordSuccess && (
          <div className="text-green-400 text-sm">{passwordSuccess}</div>
        )}

        <button
          onClick={handleChangePassword}
          disabled={isChangingPassword}
          className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition disabled:opacity-50"
        >
          {isChangingPassword ? 'Changing...' : t({ en: 'Change Password', ar: 'تغيير كلمة المرور' })}
        </button>
      </motion.div>

      {/* 2FA SETUP */}
      <motion.div
        className="space-y-4 p-4 bg-neutral-800/50 rounded-lg border border-neutral-700"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">
            {t({ en: 'Two-Factor Authentication', ar: 'المصادقة الثنائية' })}
          </h3>
          <span className={`text-sm font-medium ${twoFactorEnabled ? 'text-green-400' : 'text-neutral-400'}`}>
            {twoFactorEnabled ? '✓ Enabled' : 'Disabled'}
          </span>
        </div>

        {twoFactorEnabled ? (
          <div className="space-y-3">
            <p className="text-sm text-neutral-400">
              {t({
                en: `2FA is enabled via ${twoFactorMethod.toUpperCase()}. Your account is secure.`,
                ar: `المصادقة الثنائية مفعلة. حسابك آمن.`,
              })}
            </p>
            <button
              onClick={handleDisable2FA}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition"
            >
              {t({ en: 'Disable 2FA', ar: 'تعطيل المصادقة الثنائية' })}
            </button>
          </div>
        ) : (
          <>
            {setup2FAStep === 'inactive' && (
              <div className="space-y-3">
                <p className="text-sm text-neutral-400">
                  {t({
                    en: 'Add an extra layer of security to your account',
                    ar: 'أضف طبقة حماية إضافية لحسابك',
                  })}
                </p>
                <button
                  onClick={() => setSetup2FAStep('choose')}
                  className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition"
                >
                  {t({ en: 'Enable 2FA', ar: 'تفعيل المصادقة الثنائية' })}
                </button>
              </div>
            )}

            {setup2FAStep === 'choose' && (
              <div className="grid grid-cols-3 gap-2">
                {(['email', 'sms', 'totp'] as const).map((method) => (
                  <button
                    key={method}
                    onClick={() => handleSetup2FA(method)}
                    className="px-3 py-2 bg-neutral-700 hover:bg-neutral-600 text-white rounded-lg text-sm transition"
                  >
                    {method === 'email' && '📧 Email'}
                    {method === 'sms' && '📱 SMS'}
                    {method === 'totp' && '🔐 TOTP'}
                  </button>
                ))}
              </div>
            )}

            {setup2FAStep === 'verify' && (
              <div className="space-y-3">
                <p className="text-sm text-neutral-400">
                  {t({
                    en: `Enter the verification code sent to your ${twoFactorMethod}`,
                    ar: 'أدخل رمز التحقق',
                  })}
                </p>
                <input
                  type="text"
                  placeholder="000000"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  maxLength={6}
                  className="w-full px-4 py-2 bg-neutral-900 border border-neutral-600 rounded-lg text-white text-center font-mono text-2xl tracking-widest"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => setSetup2FAStep('choose')}
                    className="flex-1 px-4 py-2 bg-neutral-700 hover:bg-neutral-600 text-white rounded-lg transition"
                  >
                    {t({ en: 'Back', ar: 'رجوع' })}
                  </button>
                  <button
                    onClick={handleVerify2FA}
                    className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition"
                  >
                    {t({ en: 'Verify', ar: 'تحقق' })}
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </motion.div>

      {/* LOGIN HISTORY */}
      <motion.div
        className="space-y-4 p-4 bg-neutral-800/50 rounded-lg border border-neutral-700"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h3 className="text-lg font-semibold text-white">
          {t({ en: 'Login History', ar: 'سجل تسجيل الدخول' })}
        </h3>

        {loginHistory.length === 0 ? (
          <p className="text-sm text-neutral-400">
            {t({ en: 'No login history yet', ar: 'لا يوجد سجل تسجيل دخول حتى الآن' })}
          </p>
        ) : (
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {loginHistory.map((login, idx) => (
              <div key={idx} className="p-3 bg-neutral-900 rounded-lg border border-neutral-700 flex items-center justify-between text-sm">
                <div>
                  <div className="text-white font-medium">{login.device}</div>
                  <div className="text-xs text-neutral-400">{login.location}</div>
                </div>
                <div className="text-right">
                  <div className={`text-xs font-medium ${login.status === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                    {login.status === 'success' ? '✓' : '✕'} {login.status}
                  </div>
                  <div className="text-xs text-neutral-500">
                    {new Date(login.timestamp).toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};
