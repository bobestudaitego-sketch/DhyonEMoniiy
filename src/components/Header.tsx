import React, { useState, useEffect } from 'react';
import { Clock, Sun, Moon, Eye, Volume2, VolumeX, User, ShieldCheck, Settings, Sparkles, Type, LogOut, Heart, HeartHandshake } from 'lucide-react';
import { UserProfile, AppSettings, SensoryTheme, FontSizeOption } from '../types';
import { getCurrentTimeString, formatPortugueseDate } from '../utils/date';
import { ProfileAvatar } from './ProfileAvatar';

interface HeaderProps {
  currentProfile: UserProfile;
  allProfiles: UserProfile[];
  onSwitchProfile: (profileId: string) => void;
  settings: AppSettings;
  onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
  onOpenSettingsModal: () => void;
  onOpenProfileModal: () => void;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentProfile,
  settings,
  onUpdateSettings,
  onOpenSettingsModal,
  onOpenProfileModal,
  onLogout
}) => {
  const [timeStr, setTimeStr] = useState(getCurrentTimeString(new Date(), true));
  const todayDateStr = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeStr(getCurrentTimeString(new Date(), true));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const cycleTheme = () => {
    const themes: SensoryTheme[] = ['soft-light', 'soft-rose', 'soft-blue', 'calm-dark', 'high-contrast'];
    const currentIndex = themes.indexOf(settings.sensoryTheme);
    const nextTheme = themes[(currentIndex + 1) % themes.length];
    onUpdateSettings({ sensoryTheme: nextTheme });
  };

  const cycleFontSize = () => {
    const sizes: FontSizeOption[] = ['normal', 'large', 'extra-large'];
    const currentIndex = sizes.indexOf(settings.fontSize);
    const nextSize = sizes[(currentIndex + 1) % sizes.length];
    onUpdateSettings({ fontSize: nextSize });
  };

  const themeLabelMap: Record<SensoryTheme, string> = {
    'soft-light': 'Pastel Creme',
    'soft-rose': 'Pastel Rosa',
    'soft-blue': 'Pastel Azul',
    'calm-dark': 'Escuro Relaxante',
    'high-contrast': 'Alto Contraste'
  };

  return (
    <header className="w-full border-b transition-colors duration-300 bg-white/80 dark:bg-slate-900/90 backdrop-blur-md border-slate-200 dark:border-slate-800 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
          
          {/* Title & Date */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
            <div className="flex items-center gap-3">
              <div className="relative p-2.5 rounded-2xl bg-gradient-to-tr from-rose-500 via-pink-500 to-amber-400 text-white flex items-center justify-center shadow-md shadow-rose-500/20 group hover:scale-105 transition-transform">
                <Heart className="w-6 h-6 fill-white text-white animate-pulse" />
                <Sparkles className="w-3.5 h-3.5 text-amber-200 absolute -top-1 -right-1 animate-spin" style={{ animationDuration: '4s' }} />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                  <span>Dhyon</span>
                  <Heart className="w-4 h-4 fill-rose-500 text-rose-500 animate-pulse" />
                  <span>Mooniy</span>
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-gradient-to-r from-rose-500/15 via-pink-500/15 to-amber-500/15 text-rose-700 dark:text-rose-300 border border-rose-300/40 dark:border-rose-700/50 flex items-center gap-1 shadow-2xs">
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    Meu Dia Seguro
                  </span>
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 capitalize font-medium flex items-center gap-1.5">
                  <span>{formatPortugueseDate(todayDateStr)}</span>
                  <span className="text-rose-400 font-bold">• Amor & Cuidado 💕</span>
                </p>
              </div>
            </div>

            {/* Mobile Clock */}
            <div className="sm:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-mono text-sm font-bold border border-slate-200 dark:border-slate-700">
              <Clock className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              {timeStr}
            </div>
          </div>

          {/* Center Clock (Desktop) */}
          <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-2xl bg-indigo-50/80 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 border border-indigo-100 dark:border-slate-700 shadow-2xs">
            <Clock className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <span className="font-mono text-lg font-bold tracking-wider">{timeStr}</span>
            <span className="text-xs font-sans text-slate-500 dark:text-slate-400 ml-1">Horário Local</span>
          </div>

          {/* Controls & Profile Badge */}
          <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto">
            
            {/* Quick Sensory Controls */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
              
              {/* Theme Cycle Button */}
              <button
                onClick={cycleTheme}
                title={`Tema atual: ${themeLabelMap[settings.sensoryTheme]}`}
                className="p-2 rounded-lg text-slate-700 hover:bg-white dark:text-slate-300 dark:hover:bg-slate-700 transition-all flex items-center gap-1 text-xs font-medium"
              >
                {settings.sensoryTheme === 'calm-dark' ? (
                  <Moon className="w-4 h-4 text-purple-400" />
                ) : settings.sensoryTheme === 'high-contrast' ? (
                  <Eye className="w-4 h-4 text-yellow-500" />
                ) : (
                  <Sun className="w-4 h-4 text-amber-500" />
                )}
                <span className="hidden md:inline">{themeLabelMap[settings.sensoryTheme]}</span>
              </button>

              {/* Text Size Button */}
              <button
                onClick={cycleFontSize}
                title="Aumentar / Diminuir tamanho do texto"
                className="p-2 rounded-lg text-slate-700 hover:bg-white dark:text-slate-300 dark:hover:bg-slate-700 transition-all flex items-center gap-1 text-xs font-medium"
              >
                <Type className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span className="uppercase text-xs font-bold">{settings.fontSize === 'normal' ? 'A' : settings.fontSize === 'large' ? 'A+' : 'A++'}</span>
              </button>

              {/* Sound Toggle */}
              <button
                onClick={() => onUpdateSettings({ soundEnabled: !settings.soundEnabled })}
                title={settings.soundEnabled ? 'Sons ativados' : 'Sons desativados'}
                className="p-2 rounded-lg text-slate-700 hover:bg-white dark:text-slate-300 dark:hover:bg-slate-700 transition-all"
              >
                {settings.soundEnabled ? (
                  <Volume2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <VolumeX className="w-4 h-4 text-slate-400" />
                )}
              </button>

              {/* Settings modal button */}
              <button
                onClick={onOpenSettingsModal}
                title="Configurações de acessibilidade"
                className="p-2 rounded-lg text-slate-700 hover:bg-white dark:text-slate-300 dark:hover:bg-slate-700 transition-all"
              >
                <Settings className="w-4 h-4 text-slate-600 dark:text-slate-400" />
              </button>
            </div>

            {/* Profile Button */}
            <button
              onClick={onOpenProfileModal}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-2xl border transition-all text-sm font-semibold shadow-2xs ${
                currentProfile.role === 'helper'
                  ? 'bg-amber-50 border-amber-200 text-amber-900 dark:bg-amber-950/80 dark:border-amber-800 dark:text-amber-200 hover:bg-amber-100'
                  : 'bg-indigo-50 border-indigo-200 text-indigo-900 dark:bg-indigo-950/80 dark:border-indigo-800 dark:text-indigo-200 hover:bg-indigo-100'
              }`}
            >
              <ProfileAvatar avatar={currentProfile.avatar} name={currentProfile.name} size="sm" />
              <div className="text-left hidden xs:block">
                <div className="text-xs font-bold leading-none flex items-center gap-1">
                  {currentProfile.name}
                  {currentProfile.role === 'helper' && <ShieldCheck className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />}
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 font-normal mt-0.5">
                  {currentProfile.role === 'helper' ? 'Modo Apoiador' : 'Usuário'} (Mudar)
                </div>
              </div>
              <User className="w-4 h-4 xs:hidden" />
            </button>

            {/* Logout / Lock Button */}
            {onLogout && (
              <button
                onClick={onLogout}
                title="Sair / Bloquear Tela de Login"
                className="p-2.5 rounded-2xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/60 dark:hover:bg-rose-900 text-rose-600 dark:text-rose-300 border border-rose-200 dark:border-rose-900 transition-all cursor-pointer shadow-2xs flex items-center gap-1.5"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-xs font-bold hidden md:inline">Sair</span>
              </button>
            )}

          </div>

        </div>
      </div>
    </header>
  );
};
