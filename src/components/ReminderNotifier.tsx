import React, { useState, useEffect, useCallback } from 'react';
import { ScheduleItem, AppSettings } from '../types';
import { getTodayDateString, getCurrentTimeString, getMinutesUntil, formatTimeDifference } from '../utils/date';
import { soundManager } from '../utils/sound';
import { Bell, Clock, CheckCircle2, X, AlertTriangle, Sparkles, Volume2, ShieldCheck, CornerDownRight } from 'lucide-react';

interface ReminderNotifierProps {
  items: ScheduleItem[];
  settings: AppSettings;
  onToggleComplete: (itemId: string) => void;
  onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
}

export const ReminderNotifier: React.FC<ReminderNotifierProps> = ({
  items,
  settings,
  onToggleComplete,
  onUpdateSettings
}) => {
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      return Notification.permission;
    }
    return 'denied';
  });

  // Track items notified during this browser session to avoid duplicate sounds/popups
  const [notifiedIds, setNotifiedIds] = useState<Set<string>>(() => new Set());
  
  // Track snoozed items with timestamp until snooze expires
  const [snoozedUntilMap, setSnoozedUntilMap] = useState<Record<string, number>>({});

  // Active items being presented in the visual alert toast on screen
  const [activeAlerts, setActiveAlerts] = useState<ScheduleItem[]>([]);
  
  // Show permission request banner dismissed state
  const [isPermissionBannerDismissed, setIsPermissionBannerDismissed] = useState(false);

  // Request browser Notification API permission
  const requestBrowserPermission = async () => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      alert('Seu navegador não suporta a API de Notificações nativas do sistema.');
      return;
    }

    try {
      const result = await Notification.permission === 'granted'
        ? 'granted'
        : await Notification.requestPermission();
      
      setNotificationPermission(result);
      if (result === 'granted') {
        onUpdateSettings({ notificationsEnabled: true });
        // Test notification
        new Notification('🔔 Notificações Ativadas!', {
          body: 'Você receberá alertas de área de trabalho para seus lembretes e remédios.',
          icon: '/favicon.ico'
        });
        soundManager.playSuccessChime();
      } else if (result === 'denied') {
        alert('A permissão de notificação foi bloqueada no navegador. Você ainda receberá os alertas visuais e sonoros dentro do aplicativo!');
      }
    } catch (err) {
      console.error('Erro ao solicitar permissão de notificação:', err);
    }
  };

  // Main check function for reminders starting soon
  const checkReminders = useCallback(() => {
    const todayStr = getTodayDateString();
    const currentTimeStr = getCurrentTimeString();
    const nowTimestamp = Date.now();

    const upcomingOrStarting = items.filter(item => {
      // Must be scheduled for today and not completed
      if (item.date !== todayStr || item.completed) return false;
      
      // If snoozed, check if snooze window has expired
      if (snoozedUntilMap[item.id] && snoozedUntilMap[item.id] > nowTimestamp) {
        return false;
      }

      // Check time difference in minutes
      const minsUntil = getMinutesUntil(item.startTime, currentTimeStr);

      // Trigger if starting within 5 minutes (0 to 5) or started up to 3 minutes ago (-3 to 0)
      return minsUntil >= -3 && minsUntil <= 5;
    });

    upcomingOrStarting.forEach(item => {
      if (!notifiedIds.has(item.id)) {
        // Mark as notified for this session
        setNotifiedIds(prev => new Set(prev).add(item.id));

        // Add to active visual alerts array if not already present
        setActiveAlerts(prev => {
          if (prev.some(a => a.id === item.id)) return prev;
          return [...prev, item];
        });

        // 1. Play sound chime if enabled
        if (settings.soundEnabled !== false) {
          soundManager.playAlertChime();
        }

        // 2. Play speech reading if enabled
        if (settings.speechEnabled !== false) {
          const mins = getMinutesUntil(item.startTime, currentTimeStr);
          let textMsg = `Atenção! Seu lembrete "${item.title}" `;
          if (mins > 0) {
            textMsg += `começa em ${mins} ${mins === 1 ? 'minuto' : 'minutos'}.`;
          } else {
            textMsg += `está começando agora às ${item.startTime}.`;
          }
          soundManager.speak(textMsg);
        }

        // 3. Trigger Browser Native Desktop Notification API
        if (
          typeof window !== 'undefined' &&
          'Notification' in window &&
          Notification.permission === 'granted' &&
          settings.notificationsEnabled !== false
        ) {
          try {
            const mins = getMinutesUntil(item.startTime, currentTimeStr);
            const timeTag = mins > 0 ? `Em ${mins} min` : 'Agora!';
            
            const notif = new Notification(`⏰ [${timeTag}] Lembrete: ${item.title}`, {
              body: `Horário: ${item.startTime} • ${item.description || 'Está na hora da sua atividade ou remédio!'}`,
              icon: '/favicon.ico',
              tag: `reminder-${item.id}`,
              requireInteraction: true
            });

            notif.onclick = () => {
              window.focus();
            };
          } catch (e) {
            console.error('Erro ao emitir notificação do navegador:', e);
          }
        }
      }
    });
  }, [items, notifiedIds, snoozedUntilMap, settings]);

  // Periodic check interval
  useEffect(() => {
    checkReminders();
    const interval = setInterval(() => {
      checkReminders();
    }, 10000); // Check every 10 seconds

    return () => clearInterval(interval);
  }, [checkReminders]);

  // Handle Snooze (Adiar 5 minutos)
  const handleSnooze = (itemId: string) => {
    const snoozeTimeMs = Date.now() + 5 * 60 * 1000; // 5 minutes
    setSnoozedUntilMap(prev => ({ ...prev, [itemId]: snoozeTimeMs }));
    setNotifiedIds(prev => {
      const next = new Set(prev);
      next.delete(itemId);
      return next;
    });
    setActiveAlerts(prev => prev.filter(a => a.id !== itemId));
    if (settings.soundEnabled !== false) {
      soundManager.playSuccessChime();
    }
  };

  // Dismiss visual alert toast
  const handleDismiss = (itemId: string) => {
    setActiveAlerts(prev => prev.filter(a => a.id !== itemId));
  };

  // Complete item directly from alert toast
  const handleCompleteFromAlert = (itemId: string) => {
    onToggleComplete(itemId);
    setActiveAlerts(prev => prev.filter(a => a.id !== itemId));
    if (settings.soundEnabled !== false) {
      soundManager.playSuccessChime();
    }
  };

  const isBrowserNotificationSupported = typeof window !== 'undefined' && 'Notification' in window;

  return (
    <>
      {/* 1. TOP BANNER: Request Browser Notifications (if permission not decided yet) */}
      {isBrowserNotificationSupported && notificationPermission === 'default' && !isPermissionBannerDismissed && (
        <div className="bg-linear-to-r from-teal-50 via-sky-50 to-indigo-50 dark:from-slate-900 dark:via-indigo-950 dark:to-slate-900 border-b border-teal-200 dark:border-indigo-700/60 text-slate-800 dark:text-white py-3 px-4 sm:px-6 shadow-xs transition-all animate-fade-in">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-teal-100 dark:bg-indigo-800/80 text-teal-800 dark:text-amber-300 border border-teal-200 dark:border-indigo-700 shrink-0">
                <Bell className="w-5 h-5 animate-bounce" />
              </div>
              <div>
                <p className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  Ativar Notificações de Área de Trabalho (Browser API)
                  <Sparkles className="w-4 h-4 text-amber-500 dark:text-amber-300" />
                </p>
                <p className="text-slate-600 dark:text-indigo-200/90 text-xs font-normal">
                  Receba alertas visuais e sonoros no seu computador/celular quando um remédio ou rotina estiver prestes a começar.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
              <button
                onClick={requestBrowserPermission}
                className="px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4" />
                Permitir Notificações
              </button>

              <button
                onClick={() => setIsPermissionBannerDismissed(true)}
                className="p-2 rounded-xl text-slate-500 dark:text-indigo-300 hover:text-slate-900 dark:hover:text-white hover:bg-teal-100/60 dark:hover:bg-indigo-800/50 transition-colors"
                title="Agora não"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. VISUAL POPUP ALERT TOASTS (Floating on viewport for active starting reminders) */}
      {activeAlerts.length > 0 && (
        <div className="fixed bottom-5 right-5 z-50 max-w-md w-full space-y-3 px-4 sm:px-0 pointer-events-auto">
          {activeAlerts.map(item => {
            const currentTimeStr = getCurrentTimeString();
            const minsUntil = getMinutesUntil(item.startTime, currentTimeStr);
            const diffText = formatTimeDifference(minsUntil);

            return (
              <div
                key={item.id}
                className="rounded-3xl bg-slate-900 text-white p-5 border-2 border-amber-400 shadow-2xl ring-4 ring-amber-400/20 space-y-3 animate-slide-up relative overflow-hidden"
              >
                {/* Accent glow bar */}
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-linear-to-r from-amber-400 via-rose-500 to-indigo-500" />

                <div className="flex items-start justify-between gap-3 pt-1">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2.5 rounded-2xl bg-amber-400 text-slate-950 font-bold shrink-0 animate-bounce">
                      <Bell className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-400 text-slate-950 uppercase tracking-wider">
                          {diffText}
                        </span>
                        <span className="text-xs text-amber-300 font-mono font-bold flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {item.startTime}
                        </span>
                      </div>
                      <h4 className="text-base font-extrabold text-white mt-0.5 leading-snug">
                        {item.title}
                      </h4>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDismiss(item.id)}
                    className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                    title="Fechar alerta"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {item.description && (
                  <p className="text-xs text-slate-300 bg-slate-800/80 p-2.5 rounded-xl border border-slate-700 leading-relaxed">
                    {item.description}
                  </p>
                )}

                {item.medicalNote && (
                  <div className="p-2 rounded-xl bg-amber-950/80 border border-amber-800 text-amber-200 text-xs font-semibold flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Nota Médica: {item.medicalNote}</span>
                  </div>
                )}

                {/* Quick Action buttons */}
                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => handleCompleteFromAlert(item.id)}
                    className="flex-1 py-2.5 px-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md transition-all cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Concluir Agora
                  </button>

                  <button
                    onClick={() => handleSnooze(item.id)}
                    className="py-2.5 px-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 font-bold text-xs flex items-center gap-1 transition-all cursor-pointer"
                    title="Adiar por 5 minutos"
                  >
                    <Clock className="w-3.5 h-3.5" />
                    Adiar 5m
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};
