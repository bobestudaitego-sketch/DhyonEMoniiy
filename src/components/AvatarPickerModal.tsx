import React from 'react';
import { UserProfile } from '../types';
import { AVATAR_PRESETS } from '../data/avatarPresets';
import { ProfileAvatar } from './ProfileAvatar';
import { X, Sparkles, Check, Image as ImageIcon, Heart } from 'lucide-react';
import { soundManager } from '../utils/sound';

interface AvatarPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onSelectAvatar: (profileId: string, newAvatar: string) => void;
}

export const AvatarPickerModal: React.FC<AvatarPickerModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSelectAvatar
}) => {
  if (!isOpen) return null;

  const defaultPhoto = profile.name.toLowerCase().includes('dhyon')
    ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
    : 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80';

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fade-in overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-rose-200 dark:border-slate-800 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl space-y-6 my-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <ProfileAvatar avatar={profile.avatar} name={profile.name} size="lg" />
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                Escolher Ícone de Perfil
                <Sparkles className="w-5 h-5 text-amber-500" />
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Personalize o avatar de <strong className="text-rose-500">{profile.name}</strong>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Option 1: Standard Real Photo */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
            Foto de Perfil Padrão:
          </label>
          <button
            type="button"
            onClick={() => {
              soundManager.playPop();
              onSelectAvatar(profile.id, defaultPhoto);
              onClose();
            }}
            className={`w-full p-3 rounded-2xl border-2 flex items-center justify-between gap-3 transition-all cursor-pointer ${
              profile.avatar === defaultPhoto
                ? 'border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-950 dark:text-rose-200 font-bold'
                : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center gap-3">
              <img src={defaultPhoto} alt="Default" className="w-10 h-10 rounded-xl object-cover border" />
              <div className="text-left">
                <span className="text-sm font-bold block">Usar Foto de Perfil</span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">Imagem de exibição padrão</span>
              </div>
            </div>
            {profile.avatar === defaultPhoto && <Check className="w-5 h-5 text-rose-500" />}
          </button>
        </div>

        {/* Option 2: 22 Icon & Emoji Presets */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Heart className="w-4 h-4 text-rose-500" />
            Ou Escolha um Ícone de Carinho (Mais de 20 opções!):
          </label>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2.5 max-h-64 overflow-y-auto p-1">
            {AVATAR_PRESETS.map((preset) => {
              const isSelected = profile.avatar === preset.emoji || profile.avatar === preset.id || profile.avatar === `icon:${preset.id}`;

              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => {
                    soundManager.playPop();
                    onSelectAvatar(profile.id, preset.emoji);
                    onClose();
                  }}
                  className={`p-3 rounded-2xl border-2 flex flex-col items-center justify-center gap-1 transition-all cursor-pointer hover:scale-105 active:scale-95 ${
                    preset.bgClass
                  } ${
                    isSelected
                      ? 'ring-3 ring-rose-500 border-rose-500 font-black shadow-md scale-105'
                      : preset.borderClass
                  }`}
                >
                  <span className="text-2xl">{preset.emoji}</span>
                  <span className="text-[10px] font-bold tracking-tight text-center truncate w-full">
                    {preset.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs cursor-pointer"
          >
            Fechar
          </button>
        </div>

      </div>
    </div>
  );
};
