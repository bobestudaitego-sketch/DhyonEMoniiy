import React, { useState } from 'react';
import { UserProfile } from '../types';
import { User, ShieldCheck, KeyRound, Check, X, Sparkles, Heart } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  profiles: UserProfile[];
  currentProfile: UserProfile;
  onSelectProfile: (profileId: string) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  profiles,
  currentProfile,
  onSelectProfile
}) => {
  if (!isOpen) return null;

  const [selectedProfileId, setSelectedProfileId] = useState<string>(currentProfile.id);
  const [pinInput, setPinInput] = useState<string>('');
  const [pinError, setPinError] = useState<boolean>(false);

  const selectedProfile = profiles.find(p => p.id === selectedProfileId) || currentProfile;

  const handleConfirmSwitch = () => {
    if (selectedProfile.role === 'helper' && selectedProfile.pin) {
      if (pinInput !== selectedProfile.pin && pinInput !== '1234') {
        setPinError(true);
        return;
      }
    }
    
    onSelectProfile(selectedProfile.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              Alternar Perfil de Acesso
              <Sparkles className="w-5 h-5 text-indigo-500" />
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Escolha quem está utilizando o aplicativo agora
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Profile Cards */}
        <div className="space-y-3">
          {profiles.map(profile => {
            const isSelected = profile.id === selectedProfileId;
            const isCurrent = profile.id === currentProfile.id;

            return (
              <div
                key={profile.id}
                onClick={() => {
                  setSelectedProfileId(profile.id);
                  setPinError(false);
                }}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between gap-4 ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 shadow-xs'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <img
                    src={profile.avatar}
                    alt={profile.name}
                    className="w-12 h-12 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                  />
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      {profile.name}
                      {profile.role === 'helper' ? (
                        <ShieldCheck className="w-4 h-4 text-amber-500" />
                      ) : (
                        <Heart className="w-4 h-4 text-indigo-500" />
                      )}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {profile.description}
                    </p>
                  </div>
                </div>

                <div className="shrink-0">
                  {isSelected && (
                    <div className="p-1.5 rounded-full bg-indigo-600 text-white">
                      <Check className="w-4 h-4" />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* PIN input if Helper profile selected */}
        {selectedProfile.role === 'helper' && selectedProfile.pin && (
          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 space-y-2">
            <label className="text-xs font-bold text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
              <KeyRound className="w-4 h-4 text-amber-600" />
              Senha de Apoiador (Padrão: 1234)
            </label>
            <input
              type="password"
              placeholder="Digite a senha..."
              value={pinInput}
              onChange={e => {
                setPinInput(e.target.value);
                setPinError(false);
              }}
              className="w-full px-3.5 py-2.5 rounded-xl border border-amber-300 dark:border-amber-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm font-mono font-bold"
            />
            {pinError && (
              <p className="text-xs font-bold text-rose-600">
                Senha incorreta. Tente 1234.
              </p>
            )}
          </div>
        )}

        {/* Action Button */}
        <div className="pt-2 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs sm:text-sm"
          >
            Cancelar
          </button>

          <button
            onClick={handleConfirmSwitch}
            className="px-6 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md hover:scale-105 transition-all"
          >
            Confirmar e Entrar
          </button>
        </div>

      </div>
    </div>
  );
};
