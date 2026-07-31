import React, { useState } from 'react';
import { Image as ImageIcon, Plus, Trash2, ShieldCheck, Heart, Maximize2, X, Volume2, Sparkles, Camera, Tag, Calendar } from 'lucide-react';
import { ScheduleItem, UserProfile } from '../types';
import { soundManager } from '../utils/sound';

interface GallerySectionProps {
  items: ScheduleItem[];
  currentProfile: UserProfile;
  onOpenAddItem: (presetCategory?: string) => void;
  onDeleteItem: (itemId: string) => void;
  speechEnabled: boolean;
}

const PRESET_IMAGE_SAMPLES = [
  {
    title: 'Pôr do Sol na Praia',
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80',
    tag: 'Passeios & Viagens'
  },
  {
    title: 'Momento de Café & Sorrisos',
    url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80',
    tag: 'Momentos Especiais'
  },
  {
    title: 'Jardim Florido & Natureza',
    url: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=800&auto=format&fit=crop&q=80',
    tag: 'Carinho & Amor'
  },
  {
    title: 'Céu Estrelado da Noite',
    url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80',
    tag: 'Lembranças'
  }
];

export const GallerySection: React.FC<GallerySectionProps> = ({
  items,
  currentProfile,
  onOpenAddItem,
  onDeleteItem,
  speechEnabled
}) => {
  const [activeImageModal, setActiveImageModal] = useState<ScheduleItem | null>(null);
  const [selectedTag, setSelectedTag] = useState<string>('all');

  // Filter items for photo album
  const albumItems = items.filter(item => item.category === 'image_note' || item.imageUrl);

  const tags = ['all', 'Passeios & Viagens', 'Momentos Especiais', 'Carinho & Amor', 'Lembranças'];

  const filteredItems = albumItems.filter(item => {
    if (selectedTag === 'all') return true;
    return item.description.includes(selectedTag) || item.title.includes(selectedTag);
  });

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-linear-to-r from-rose-50 via-pink-50 to-teal-50 dark:from-slate-900 dark:via-rose-950/40 dark:to-slate-900 border border-rose-200/80 dark:border-rose-900/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm relative overflow-hidden">
        {/* Soft background decor */}
        <div className="absolute -right-8 -top-8 w-40 h-40 bg-rose-300/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -left-8 -bottom-8 w-40 h-40 bg-teal-300/20 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center gap-3.5 relative z-10">
          <div className="p-3.5 rounded-2xl bg-rose-500 text-white font-bold shrink-0 shadow-md">
            <Heart className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              Álbum de Fotos & Memórias
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                Dhyon & Mooniy
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-0.5 max-w-xl">
              Espaço especial onde Mooniy e Dhyon guardam fotos, momentos inesquecíveis, passeios e recadinhos de carinho.
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            soundManager.playPop();
            onOpenAddItem('image_note');
          }}
          className="px-5 py-3 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-black text-xs sm:text-sm flex items-center gap-2 transition-all shadow-md hover:shadow-lg shrink-0 cursor-pointer relative z-10"
        >
          <Camera className="w-5 h-5 text-amber-200" />
          Adicionar Foto ao Álbum
        </button>
      </div>

      {/* Filter Chips & Album Stats */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1 shrink-0 mr-1">
            <Tag className="w-3.5 h-3.5 text-rose-500" />
            Filtros:
          </span>
          {tags.map(tag => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                selectedTag === tag
                  ? 'bg-rose-500 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {tag === 'all' ? 'Todas as Fotos' : tag}
            </button>
          ))}
        </div>

        <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5 shrink-0 self-end sm:self-auto">
          <Camera className="w-4 h-4 text-rose-500" />
          <span>{filteredItems.length} {filteredItems.length === 1 ? 'foto no álbum' : 'fotos no álbum'}</span>
        </div>
      </div>

      {/* Grid of Gallery Cards */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-12 px-4 rounded-3xl border border-dashed border-rose-200 dark:border-slate-800 bg-rose-50/30 dark:bg-slate-900/50 space-y-3">
          <div className="w-16 h-16 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-500 flex items-center justify-center mx-auto shadow-inner">
            <Heart className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">Nenhuma foto encontrada neste filtro</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Mooniy pode guardar momentos lindos do casal, fotos de passeios, sorrisos e lembretes visuais a qualquer momento!
          </p>
          <button
            onClick={() => onOpenAddItem('image_note')}
            className="px-4 py-2.5 rounded-xl bg-rose-500 text-white text-xs font-bold inline-flex items-center gap-2 shadow-md hover:bg-rose-600 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Adicionar Foto para Dhyon & Mooniy
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map(item => (
            <div
              key={item.id}
              className="group rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Image header */}
                {item.imageUrl ? (
                  <div className="relative w-full h-52 bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 cursor-pointer"
                      onClick={() => {
                        soundManager.playPop();
                        setActiveImageModal(item);
                      }}
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-slate-950/60 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity pointer-events-none" />
                    
                    <button
                      onClick={() => {
                        soundManager.playPop();
                        setActiveImageModal(item);
                      }}
                      className="absolute top-3 right-3 p-2 rounded-full bg-slate-950/70 hover:bg-slate-950 text-white backdrop-blur-md transition-all opacity-90 group-hover:opacity-100 cursor-pointer shadow-md"
                      title="Expandir foto"
                    >
                      <Maximize2 className="w-4 h-4" />
                    </button>

                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none text-white text-xs font-bold">
                      <span className="px-2.5 py-1 rounded-full bg-rose-500/80 backdrop-blur-xs flex items-center gap-1 shadow-xs">
                        <Heart className="w-3.5 h-3.5 fill-white" />
                        Álbum Dhyon & Mooniy
                      </span>

                      {item.date && (
                        <span className="px-2 py-0.5 rounded-lg bg-black/60 backdrop-blur-xs text-[11px] font-medium flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-amber-300" />
                          {item.date}
                        </span>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-28 bg-rose-50 dark:bg-rose-950/40 flex items-center justify-center text-rose-400">
                    <ImageIcon className="w-10 h-10" />
                  </div>
                )}

                <div className="p-5 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-base font-extrabold text-slate-900 dark:text-white leading-snug">
                      {item.title}
                    </h3>

                    {currentProfile.role === 'helper' && (
                      <button
                        onClick={() => {
                          if (confirm('Deseja excluir esta foto do álbum?')) {
                            onDeleteItem(item.id);
                          }
                        }}
                        className="text-slate-400 hover:text-rose-500 p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors cursor-pointer"
                        title="Excluir foto do álbum"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                    {item.description}
                  </p>
                </div>
              </div>

              <div className="px-5 py-3.5 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-600 dark:text-slate-400 flex items-center gap-1.5 font-bold">
                  <ShieldCheck className="w-3.5 h-3.5 text-rose-500" />
                  Guardado por: {item.createdBy || 'Mooniy'}
                </span>

                {speechEnabled && (
                  <button
                    onClick={() => soundManager.speak(`${item.title}. Memória: ${item.description}`)}
                    className="p-1.5 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-rose-600 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer shadow-2xs flex items-center gap-1 font-bold"
                    title="Ouvir descrição da foto"
                  >
                    <Volume2 className="w-3.5 h-3.5 text-rose-500" />
                    Ouvir
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
      {activeImageModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fade-in">
          <div className="relative max-w-4xl w-full bg-slate-900 rounded-3xl overflow-hidden border border-slate-700 shadow-2xl">
            <button
              onClick={() => setActiveImageModal(null)}
              className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-slate-800/90 text-white hover:bg-rose-600 transition-all cursor-pointer shadow-md"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="flex flex-col md:flex-row max-h-[85vh]">
              {activeImageModal.imageUrl && (
                <div className="md:w-3/5 bg-black flex items-center justify-center p-2 relative">
                  <img
                    src={activeImageModal.imageUrl}
                    alt={activeImageModal.title}
                    className="max-h-[60vh] md:max-h-[80vh] w-auto object-contain rounded-xl"
                  />
                </div>
              )}

              <div className="md:w-2/5 p-6 flex flex-col justify-between overflow-y-auto space-y-4">
                <div className="space-y-3">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold border border-rose-500/30">
                    <Heart className="w-3.5 h-3.5 fill-rose-300" />
                    Memória Dhyon & Mooniy
                  </div>

                  <h3 className="text-xl font-extrabold text-white">
                    {activeImageModal.title}
                  </h3>

                  <p className="text-sm text-slate-300 leading-relaxed font-normal">
                    {activeImageModal.description}
                  </p>

                  {activeImageModal.date && (
                    <div className="text-xs text-slate-400 font-medium flex items-center gap-1 pt-2">
                      <Calendar className="w-3.5 h-3.5 text-amber-300" />
                      Data da Recordação: {activeImageModal.date}
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-slate-800 flex flex-col gap-3 text-xs text-slate-400">
                  <span className="font-semibold text-slate-300">Guardado por: {activeImageModal.createdBy || 'Mooniy'}</span>
                  {speechEnabled && (
                    <button
                      onClick={() => soundManager.speak(`${activeImageModal.title}. ${activeImageModal.description}`)}
                      className="w-full py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all"
                    >
                      <Volume2 className="w-4 h-4" />
                      Ouvir Memória em Voz Alta
                    </button>
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

