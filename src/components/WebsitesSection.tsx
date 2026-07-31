import React from 'react';
import { ExternalLink, Globe, Plus, Trash2, Edit3, ShieldCheck, Heart } from 'lucide-react';
import { ScheduleItem, UserProfile } from '../types';

interface WebsitesSectionProps {
  items: ScheduleItem[];
  currentProfile: UserProfile;
  onOpenAddItem: (presetCategory?: string) => void;
  onDeleteItem: (itemId: string) => void;
}

export const WebsitesSection: React.FC<WebsitesSectionProps> = ({
  items,
  currentProfile,
  onOpenAddItem,
  onDeleteItem
}) => {
  const websiteItems = items.filter(item => item.category === 'website' || item.linkUrl);

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-linear-to-r from-amber-500/10 via-orange-500/10 to-yellow-500/10 border border-amber-200 dark:border-amber-900/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-amber-500 text-slate-950 font-bold shrink-0 shadow-md">
            <Globe className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              Sites & Links Recomendados
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-0.5">
              Sites úteis, passatempos e notícias separadas especialmente pelo seu apoiador.
            </p>
          </div>
        </div>

        <button
          onClick={() => onOpenAddItem('website')}
          className="px-4 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-md shrink-0"
        >
          <Plus className="w-4 h-4" />
          Adicionar Novo Site
        </button>
      </div>

      {/* Grid of Website Cards */}
      {websiteItems.length === 0 ? (
        <div className="text-center py-12 px-4 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <Globe className="w-12 h-12 text-slate-400 mx-auto mb-3 opacity-60" />
          <h3 className="text-base font-semibold text-slate-700 dark:text-slate-300">Nenhum site adicionado ainda</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
            Apoiadores podem cadastrar links úteis, sites de notícias calmas, portais de pacientes ou passatempos.
          </p>
          <button
            onClick={() => onOpenAddItem('website')}
            className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 text-xs font-bold inline-flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            Adicionar Primeiro Site
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {websiteItems.map(item => (
            <div
              key={item.id}
              className="group rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 flex flex-col justify-between hover:shadow-lg transition-all duration-300 hover:border-amber-300 dark:hover:border-amber-700 relative overflow-hidden"
            >
              <div>
                {/* Top image preview if available */}
                {item.imageUrl && (
                  <div className="w-full h-36 rounded-2xl overflow-hidden mb-4 bg-slate-100 dark:bg-slate-800 relative">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-amber-300 text-[10px] font-bold flex items-center gap-1">
                      <Globe className="w-3 h-3" />
                      Link Externo
                    </span>
                  </div>
                )}

                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                    {item.title}
                  </h3>

                  {currentProfile.role === 'helper' && (
                    <button
                      onClick={() => onDeleteItem(item.id)}
                      className="text-slate-400 hover:text-rose-500 p-1 rounded-lg transition-colors"
                      title="Excluir site"
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
                <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
                  Por: {item.createdBy}
                </span>

                {item.linkUrl ? (
                  <a
                    href={item.linkUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold inline-flex items-center gap-1.5 shadow-xs transition-all hover:scale-105"
                  >
                    Abrir Site
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                ) : (
                  <span className="text-xs text-slate-400 italic">Sem URL definida</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
