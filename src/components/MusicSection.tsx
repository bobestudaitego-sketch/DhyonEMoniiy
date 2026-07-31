import React, { useState } from 'react';
import { Music, Play, Square, ExternalLink, Plus, Trash2, Volume2, Sparkles, Disc } from 'lucide-react';
import { ScheduleItem, UserProfile } from '../types';
import { soundManager } from '../utils/sound';

interface MusicSectionProps {
  items: ScheduleItem[];
  currentProfile: UserProfile;
  onOpenAddItem: (presetCategory?: string) => void;
  onDeleteItem: (itemId: string) => void;
}

export const MusicSection: React.FC<MusicSectionProps> = ({
  items,
  currentProfile,
  onOpenAddItem,
  onDeleteItem
}) => {
  const [isAmbientActive, setIsAmbientActive] = useState(soundManager.getIsAmbientPlaying());
  const musicItems = items.filter(item => item.category === 'music' || item.musicUrl);

  const toggleAmbient = () => {
    const active = soundManager.toggleAmbientSound();
    setIsAmbientActive(active);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-linear-to-r from-purple-500/10 via-pink-500/10 to-indigo-500/10 border border-purple-200 dark:border-purple-900/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-purple-600 text-white font-bold shrink-0 shadow-md">
            <Music className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              Músicas & Sons Tranquilizantes
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-0.5">
              Playlists para relaxar, ondas harmônicas e links de áudios adicionados pelo seu apoiador.
            </p>
          </div>
        </div>

        <button
          onClick={() => onOpenAddItem('music')}
          className="px-4 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-md shrink-0"
        >
          <Plus className="w-4 h-4" />
          Adicionar Nova Música
        </button>
      </div>

      {/* Built-in Ambient Generator Widget */}
      <div className="p-6 rounded-3xl bg-slate-900 text-white border border-purple-900/40 shadow-lg relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex items-center gap-4 z-10">
          <div className={`p-4 rounded-2xl ${isAmbientActive ? 'bg-purple-500 text-white animate-spin-slow' : 'bg-slate-800 text-slate-400'}`}>
            <Disc className="w-8 h-8" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 mb-1">
              <Sparkles className="w-3 h-3" /> Gerador Integrado de Som Relaxante
            </div>
            <h3 className="text-lg font-bold text-white">Frequência Calmante 432Hz</h3>
            <p className="text-xs text-slate-300 max-w-md mt-0.5">
              Tom suave harmônico sem palavras, projetado para acalmar sobrecarga sensorial e ansiedade.
            </p>
          </div>
        </div>

        <button
          onClick={toggleAmbient}
          className={`px-6 py-3.5 rounded-2xl font-bold text-sm flex items-center gap-2.5 transition-all shadow-md z-10 shrink-0 ${
            isAmbientActive
              ? 'bg-rose-500 hover:bg-rose-400 text-white animate-pulse'
              : 'bg-purple-500 hover:bg-purple-400 text-white hover:scale-105'
          }`}
        >
          {isAmbientActive ? (
            <>
              <Square className="w-5 h-5 fill-current" />
              Pausar Som Calmante
            </>
          ) : (
            <>
              <Play className="w-5 h-5 fill-current" />
              Tocar Som Calmante (432Hz)
            </>
          )}
        </button>
      </div>

      {/* Grid of Music Cards */}
      {musicItems.length === 0 ? (
        <div className="text-center py-12 px-4 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <Music className="w-12 h-12 text-slate-400 mx-auto mb-3 opacity-60" />
          <h3 className="text-base font-semibold text-slate-700 dark:text-slate-300">Nenhuma música cadastrada ainda</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
            Seu apoiador pode adicionar links do YouTube, Spotify, áudios de chuva ou lo-fi relaxante.
          </p>
          <button
            onClick={() => onOpenAddItem('music')}
            className="px-4 py-2 rounded-xl bg-purple-600 text-white text-xs font-bold inline-flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            Adicionar Primeira Música
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {musicItems.map(item => (
            <div
              key={item.id}
              className="group rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 flex flex-col justify-between hover:shadow-lg transition-all duration-300 hover:border-purple-300 dark:hover:border-purple-700 relative overflow-hidden"
            >
              <div>
                {/* Image preview */}
                {item.imageUrl && (
                  <div className="w-full h-36 rounded-2xl overflow-hidden mb-4 bg-slate-100 dark:bg-slate-800 relative">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-purple-300 text-[10px] font-bold flex items-center gap-1">
                      <Music className="w-3 h-3" />
                      Música / Áudio
                    </span>
                  </div>
                )}

                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                    {item.title}
                  </h3>

                  {currentProfile.role === 'helper' && (
                    <button
                      onClick={() => onDeleteItem(item.id)}
                      className="text-slate-400 hover:text-rose-500 p-1 rounded-lg transition-colors"
                      title="Excluir música"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4 line-clamp-3">
                  {item.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  Adicionado por: {item.createdBy}
                </span>

                {item.musicUrl || item.linkUrl ? (
                  <a
                    href={item.musicUrl || item.linkUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-xs transition-all hover:scale-105"
                  >
                    Ouvir Música
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                ) : (
                  <span className="text-xs text-slate-400 italic">Sem Link</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
