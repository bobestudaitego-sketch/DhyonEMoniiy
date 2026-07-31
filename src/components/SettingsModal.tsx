import React, { useState } from 'react';
import { AppSettings, SensoryTheme, FontSizeOption } from '../types';
import { X, Eye, Sun, Moon, Volume2, Type, RefreshCw, Sparkles, Check, Bell, ShieldCheck } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
  onResetData: () => void;
  onClearAllPosts?: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onResetData,
  onClearAllPosts
}) => {
  const [permissionState, setPermissionState] = useState<NotificationPermission>(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      return Notification.permission;
    }
    return 'denied';
  });

  const handleRequestPermission = async () => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      alert('Notificações nativas não são suportadas neste navegador.');
      return;
    }

    try {
      const perm = await Notification.requestPermission();
      setPermissionState(perm);
      if (perm === 'granted') {
        onUpdateSettings({ notificationsEnabled: true });
        new Notification('🔔 Notificações Ativas!', {
          body: 'Configuração concluída com sucesso no Meu Dia Seguro.',
          icon: '/favicon.ico'
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              Acessibilidade & Ajustes
              <Sparkles className="w-5 h-5 text-indigo-500" />
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Personalize o visual e sons para seu conforto sensorial
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Sensory Theme Picker */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            Modo de Cores Calmas / Tema
          </label>
          <div className="grid grid-cols-2 gap-2.5">
            
            <button
              onClick={() => onUpdateSettings({ sensoryTheme: 'soft-light' })}
              className={`p-3 rounded-2xl border text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                settings.sensoryTheme === 'soft-light'
                  ? 'bg-amber-100/80 border-amber-400 text-amber-950 ring-2 ring-amber-500/30'
                  : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200'
              }`}
            >
              <span className="flex items-center gap-2">
                <Sun className="w-4 h-4 text-amber-500" /> Pastel Creme
              </span>
              {settings.sensoryTheme === 'soft-light' && <Check className="w-4 h-4 text-amber-600" />}
            </button>

            <button
              onClick={() => onUpdateSettings({ sensoryTheme: 'soft-rose' })}
              className={`p-3 rounded-2xl border text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                settings.sensoryTheme === 'soft-rose'
                  ? 'bg-rose-100/80 border-rose-400 text-rose-950 ring-2 ring-rose-500/30'
                  : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200'
              }`}
            >
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-rose-500" /> Pastel Rosa
              </span>
              {settings.sensoryTheme === 'soft-rose' && <Check className="w-4 h-4 text-rose-600" />}
            </button>

            <button
              onClick={() => onUpdateSettings({ sensoryTheme: 'soft-blue' })}
              className={`p-3 rounded-2xl border text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                settings.sensoryTheme === 'soft-blue'
                  ? 'bg-blue-100/80 border-blue-400 text-blue-950 ring-2 ring-blue-500/30'
                  : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200'
              }`}
            >
              <span className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-blue-500" /> Pastel Céu
              </span>
              {settings.sensoryTheme === 'soft-blue' && <Check className="w-4 h-4 text-blue-600" />}
            </button>

            <button
              onClick={() => onUpdateSettings({ sensoryTheme: 'calm-dark' })}
              className={`p-3 rounded-2xl border text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                settings.sensoryTheme === 'calm-dark'
                  ? 'bg-purple-900 border-purple-500 text-white ring-2 ring-purple-500/30'
                  : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200'
              }`}
            >
              <span className="flex items-center gap-2">
                <Moon className="w-4 h-4 text-purple-400" /> Escuro Relaxante
              </span>
              {settings.sensoryTheme === 'calm-dark' && <Check className="w-4 h-4 text-purple-300" />}
            </button>

          </div>
        </div>

        {/* Font Size Selector */}
        <div className="space-y-2 pt-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            Tamanho da Letra / Texto
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(['normal', 'large', 'extra-large'] as FontSizeOption[]).map(size => (
              <button
                key={size}
                onClick={() => onUpdateSettings({ fontSize: size })}
                className={`py-2.5 px-3 rounded-2xl border text-xs font-bold capitalize transition-all ${
                  settings.fontSize === size
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                {size === 'normal' ? 'Normal (A)' : size === 'large' ? 'Grande (A+)' : 'Muitíssimo Grande (A++)'}
              </button>
            ))}
          </div>
        </div>

        {/* Audio & Speech Toggles */}
        <div className="space-y-3 pt-2">
          <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 cursor-pointer">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-indigo-500" />
              Sons de Confirmação & Alertas
            </span>
            <input
              type="checkbox"
              checked={settings.soundEnabled}
              onChange={e => onUpdateSettings({ soundEnabled: e.target.checked })}
              className="w-4 h-4 rounded-md text-indigo-600"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 cursor-pointer">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <Type className="w-4 h-4 text-emerald-500" />
              Leitura em Voz Alta (Síntese de Voz Português)
            </span>
            <input
              type="checkbox"
              checked={settings.speechEnabled}
              onChange={e => onUpdateSettings({ speechEnabled: e.target.checked })}
              className="w-4 h-4 rounded-md text-indigo-600"
            />
          </label>

          {/* Browser Desktop Notification Settings */}
          <div className="p-3.5 rounded-2xl bg-indigo-50/70 dark:bg-slate-800/80 border border-indigo-200 dark:border-indigo-900/50 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Bell className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                Notificações de Área de Trabalho (Browser API)
              </span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                permissionState === 'granted'
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                  : permissionState === 'denied'
                  ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                  : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
              }`}>
                {permissionState === 'granted' ? 'Ativo' : permissionState === 'denied' ? 'Bloqueado' : 'Pendente'}
              </span>
            </div>

            <p className="text-[11px] text-slate-600 dark:text-slate-400">
              Permite que o navegador exiba pop-ups nativos quando uma tarefa ou remédio estiver no horário.
            </p>

            {permissionState !== 'granted' ? (
              <button
                type="button"
                onClick={handleRequestPermission}
                className="w-full py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4" />
                Solicitar / Ativar Notificações do Navegador
              </button>
            ) : (
              <label className="flex items-center justify-between pt-1 cursor-pointer">
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  Emitir Alertas do Navegador
                </span>
                <input
                  type="checkbox"
                  checked={settings.notificationsEnabled !== false}
                  onChange={e => onUpdateSettings({ notificationsEnabled: e.target.checked })}
                  className="w-4 h-4 rounded-md text-indigo-600"
                />
              </label>
            )}
          </div>
        </div>

        {/* Reset / Clear Data */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            {onClearAllPosts && (
              <button
                onClick={() => {
                  if (confirm('Tem certeza que deseja apagar todas as postagens para começar do zero?')) {
                    onClearAllPosts();
                    onClose();
                  }
                }}
                className="px-3.5 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Zerar Postagens
              </button>
            )}

            <button
              onClick={onResetData}
              className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center gap-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            >
              Exemplo
            </button>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-2xl bg-indigo-600 text-white font-bold text-xs shadow-md cursor-pointer hover:bg-indigo-700 transition-colors"
          >
            Pronto
          </button>
        </div>

      </div>
    </div>
  );
};
