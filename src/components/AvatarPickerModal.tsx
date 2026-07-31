import React, { useRef, useState } from 'react';
import { UserProfile } from '../types';
import { AVATAR_PRESETS } from '../data/avatarPresets';
import { ProfileAvatar } from './ProfileAvatar';
import { X, Sparkles, Check, Image as ImageIcon, Heart, Upload, FolderOpen, Link as LinkIcon } from 'lucide-react';
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
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [customUrlInput, setCustomUrlInput] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);

  if (!isOpen) return null;

  const defaultPhoto = profile.name.toLowerCase().includes('dhyon')
    ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
    : 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80';

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione um arquivo de imagem válido (PNG, JPG, JPEG, WEBP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        soundManager.playPop();
        onSelectAvatar(profile.id, dataUrl);
        onClose();
      }
    };
    reader.readAsDataURL(file);
  };

  const handleCustomUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customUrlInput.trim()) return;
    soundManager.playPop();
    onSelectAvatar(profile.id, customUrlInput.trim());
    setCustomUrlInput('');
    onClose();
  };

  const isCustomPhoto = profile.avatar.startsWith('data:image') || (profile.avatar.startsWith('http') && profile.avatar !== defaultPhoto);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fade-in overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-rose-200 dark:border-slate-800 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl space-y-6 my-auto max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <ProfileAvatar avatar={profile.avatar} name={profile.name} size="lg" />
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                Alterar Foto de Perfil
                <Sparkles className="w-5 h-5 text-amber-500" />
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Personalize o perfil de <strong className="text-rose-500">{profile.name}</strong>
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

        {/* Option 1: Upload Photo from Computer (PC) */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Upload className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            Carregar Foto do Seu Computador / Celular:
          </label>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*"
            className="hidden"
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full p-4 rounded-2xl border-2 border-dashed border-indigo-300 dark:border-indigo-800/80 bg-indigo-50/60 dark:bg-indigo-950/30 hover:bg-indigo-100/70 dark:hover:bg-indigo-900/40 text-indigo-950 dark:text-indigo-200 transition-all cursor-pointer flex flex-col sm:flex-row items-center justify-between gap-3 group shadow-xs"
          >
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-indigo-600 text-white shadow-sm group-hover:scale-110 transition-transform">
                <FolderOpen className="w-6 h-6" />
              </div>
              <div className="text-left">
                <span className="text-sm font-extrabold block text-indigo-900 dark:text-indigo-100">
                  📁 Escolher Arquivo no Meu PC
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Selecione qualquer foto ou imagem salva no seu dispositivo
                </span>
              </div>
            </div>

            <span className="px-3 py-1.5 rounded-xl bg-indigo-600 text-white font-bold text-xs shrink-0 shadow-xs group-hover:bg-indigo-700">
              Procurar Arquivos...
            </span>
          </button>
        </div>

        {/* Option 2: Custom URL input toggle */}
        <div className="space-y-2 pt-1">
          <button
            type="button"
            onClick={() => setShowUrlInput(!showUrlInput)}
            className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <LinkIcon className="w-3.5 h-3.5" />
            {showUrlInput ? 'Ocultar campo de Link da Foto' : 'Ou colar Link (URL) de uma foto da internet'}
          </button>

          {showUrlInput && (
            <form onSubmit={handleCustomUrlSubmit} className="flex gap-2">
              <input
                type="url"
                value={customUrlInput}
                onChange={(e) => setCustomUrlInput(e.target.value)}
                placeholder="https://exemplo.com/minha-foto.jpg"
                className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white font-mono"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 cursor-pointer"
              >
                Usar Link
              </button>
            </form>
          )}
        </div>

        {/* Option 3: Standard Real Photo */}
        <div className="space-y-2 pt-1">
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
                <span className="text-sm font-bold block">Usar Foto Original</span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">Foto padrão de exibição</span>
              </div>
            </div>
            {profile.avatar === defaultPhoto && <Check className="w-5 h-5 text-rose-500" />}
          </button>
        </div>

        {/* Option 4: 22 Icon & Emoji Presets */}
        <div className="space-y-3 pt-1">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Heart className="w-4 h-4 text-rose-500" />
            Ou Escolha um Ícone de Carinho (Mais de 20 opções!):
          </label>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2.5 max-h-56 overflow-y-auto p-1">
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

