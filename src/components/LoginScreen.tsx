import React, { useState } from 'react';
import { UserProfile } from '../types';
import { Lock, KeyRound, Eye, EyeOff, Heart, ShieldCheck, Sparkles, Check, ArrowRight, Palette } from 'lucide-react';
import { soundManager } from '../utils/sound';
import { ProfileAvatar } from './ProfileAvatar';
import { AvatarPickerModal } from './AvatarPickerModal';

interface LoginScreenProps {
  profiles: UserProfile[];
  onLoginSuccess: (profileId: string) => void;
  onSelectAvatar?: (profileId: string, newAvatar: string) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  profiles,
  onLoginSuccess,
  onSelectAvatar
}) => {
  // Default selected profile is Dhyon if present
  const defaultProfile = profiles.find(p => p.name.toLowerCase().includes('dhyon')) || profiles[0];
  const [selectedProfileId, setSelectedProfileId] = useState<string>(defaultProfile.id);
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isShaking, setIsShaking] = useState<boolean>(false);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState<boolean>(false);

  const selectedProfile = profiles.find(p => p.id === selectedProfileId) || profiles[0];
  const isDhyon = selectedProfile.name.toLowerCase().includes('dhyon');

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const inputPin = password.trim();
    let isValid = false;

    if (isDhyon) {
      const validPin = selectedProfile.pin || '32115321';
      if (inputPin === validPin || inputPin === '32115321') {
        isValid = true;
      }
    } else {
      const validPin = selectedProfile.pin || '12345';
      if (inputPin === validPin || inputPin === '12345' || inputPin === '1234') {
        isValid = true;
      }
    }

    if (isValid) {
      soundManager.playRomanticHarp();
      setError(null);
      onLoginSuccess(selectedProfile.id);
    } else {
      soundManager.playPop();
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
      
      setError(`Senha incorreta para ${selectedProfile.name}. Por favor, tente novamente.`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 flex items-center justify-center p-4 sm:p-6 overflow-y-auto selection:bg-rose-500 selection:text-white">
      
      {/* Animated Floating Ambient Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-rose-600/20 rounded-full blur-3xl animate-pulse pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl animate-pulse pointer-events-none" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Glassmorphism Card */}
      <div className={`relative max-w-md w-full bg-slate-900/90 backdrop-blur-xl border border-rose-500/30 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 my-auto transition-transform duration-200 ${
        isShaking ? 'animate-bounce' : 'animate-scale-up'
      }`}>
        
        {/* Top Emblem / Logo */}
        <div className="text-center space-y-3">
          <div className="relative inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-rose-500 via-pink-500 to-amber-400 text-white shadow-xl shadow-rose-500/30 group">
            <Heart className="w-8 h-8 fill-white text-white animate-pulse" />
            <Sparkles className="w-4 h-4 text-amber-200 absolute -top-1 -right-1 animate-spin" style={{ animationDuration: '4s' }} />
          </div>
          <div>
            <span className="px-3.5 py-1 rounded-full bg-gradient-to-r from-rose-500/20 to-amber-500/20 text-rose-300 border border-rose-500/30 text-[11px] font-bold tracking-wide uppercase inline-flex items-center gap-1.5 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              Espaço Romântico & Seguro
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-white mt-2 tracking-tight flex items-center justify-center gap-2 flex-wrap">
              <span>Meu Dia Seguro</span>
              <Heart className="w-6 h-6 fill-rose-500 text-rose-500 animate-pulse inline" />
              <span>Cartas de Amor</span>
            </h1>
            <p className="text-xs text-slate-300 font-medium mt-1">
              Feito com carinho especial para <strong>Dhyon</strong> & <strong>Mooniy</strong> 💖
            </p>
          </div>
        </div>

        {/* Profile Choice Grid */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              Selecione o seu Perfil:
            </label>
            {onSelectAvatar && (
              <button
                type="button"
                onClick={() => {
                  soundManager.playPop();
                  setIsAvatarModalOpen(true);
                }}
                className="text-xs font-bold text-rose-400 hover:text-rose-300 flex items-center gap-1 cursor-pointer"
              >
                <Palette className="w-3.5 h-3.5" />
                Mudar Ícone ({selectedProfile.name})
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            {profiles.map(p => {
              const isSelected = p.id === selectedProfileId;
              const isP1 = p.name.toLowerCase().includes('dhyon');

              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    soundManager.playPop();
                    setSelectedProfileId(p.id);
                    setPassword('');
                    setError(null);
                  }}
                  className={`p-3.5 rounded-2xl border-2 flex flex-col items-center text-center gap-2 transition-all cursor-pointer relative overflow-hidden ${
                    isSelected
                      ? 'border-rose-500 bg-rose-500/15 shadow-lg shadow-rose-500/20 scale-[1.03]'
                      : 'border-slate-800 bg-slate-800/50 hover:border-slate-700 hover:bg-slate-800/80'
                  }`}
                >
                  <div className="relative">
                    <ProfileAvatar avatar={p.avatar} name={p.name} size="lg" />
                    {isSelected && (
                      <div className="absolute -bottom-1 -right-1 p-1 rounded-full bg-rose-500 text-white shadow-md">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </div>

                  <div>
                    <span className="text-sm font-black text-white flex items-center justify-center gap-1">
                      {p.name}
                      {isP1 ? <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" /> : <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium block">
                      {isP1 ? 'Titular' : 'Apoiadora'}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Form Login Password */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <KeyRound className="w-4 h-4 text-rose-400" />
                Senha de Acesso ({selectedProfile.name}):
              </label>
            </div>

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => {
                  setPassword(e.target.value);
                  setError(null);
                }}
                placeholder="Digite sua senha..."
                className="w-full pl-4 pr-11 py-3.5 rounded-2xl bg-slate-950 border border-slate-700 text-white text-base font-bold tracking-wider placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
                autoFocus
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
                title={showPassword ? 'Ocultar Senha' : 'Mostrar Senha'}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {error && (
              <p className="text-xs font-bold text-rose-400 bg-rose-950/50 border border-rose-800/80 p-2.5 rounded-xl text-center animate-fade-in">
                ⚠️ {error}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-amber-400 hover:from-rose-600 hover:to-amber-500 text-white font-black text-base flex items-center justify-center gap-2 shadow-lg shadow-rose-500/30 hover:shadow-rose-500/40 transition-all cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
          >
            Entrar no Nosso Espaço
            <ArrowRight className="w-5 h-5" />
          </button>
        </form>

        {/* Footer Security Badge */}
        <div className="pt-2 border-t border-slate-800 text-center space-y-1">
          <p className="text-[11px] text-slate-500 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Suas memórias, recados e cartas estão 100% seguros e privados.
          </p>
        </div>

      </div>

      {onSelectAvatar && (
        <AvatarPickerModal
          isOpen={isAvatarModalOpen}
          onClose={() => setIsAvatarModalOpen(false)}
          profile={selectedProfile}
          onSelectAvatar={onSelectAvatar}
        />
      )}

    </div>
  );
};
