import React, { useState, useEffect } from 'react';
import { CheckCircle2, Circle, Clock, Pill, Stethoscope, Globe, Music, Image as ImageIcon, Volume2, Plus, Filter, Trash2, Calendar, ExternalLink, AlertCircle, ChevronLeft, ChevronRight, Sparkles, AlertTriangle } from 'lucide-react';
import { ScheduleItem, ItemCategory, UserProfile } from '../types';
import { formatPortugueseDate, getTodayDateString, isItemActiveNow, isItemOverdue, getCurrentTimeString } from '../utils/date';
import { soundManager } from '../utils/sound';

interface ScheduleViewProps {
  items: ScheduleItem[];
  selectedDate: string;
  onSelectDate: (dateStr: string) => void;
  currentProfile: UserProfile;
  onToggleComplete: (itemId: string) => void;
  onOpenAddItem: (presetCategory?: string) => void;
  onDeleteItem: (itemId: string) => void;
  speechEnabled: boolean;
}

export const ScheduleView: React.FC<ScheduleViewProps> = ({
  items,
  selectedDate,
  onSelectDate,
  currentProfile,
  onToggleComplete,
  onOpenAddItem,
  onDeleteItem,
  speechEnabled
}) => {
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [currentTimeStr, setCurrentTimeStr] = useState<string>(getCurrentTimeString());
  const today = getTodayDateString();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTimeStr(getCurrentTimeString());
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  // Date manipulation helpers
  const handlePrevDay = () => {
    const [y, m, d] = selectedDate.split('-').map(Number);
    const date = new Date(y, m - 1, d - 1);
    onSelectDate(date.toISOString().split('T')[0]);
  };

  const handleNextDay = () => {
    const [y, m, d] = selectedDate.split('-').map(Number);
    const date = new Date(y, m - 1, d + 1);
    onSelectDate(date.toISOString().split('T')[0]);
  };

  // Filter items for selected date
  const dayItems = items.filter(item => item.date === selectedDate);

  // Filter by category
  const filteredItems = dayItems.filter(item => {
    if (selectedCategoryFilter === 'all') return true;
    if (selectedCategoryFilter === 'medical_health') return item.category === 'medication' || item.category === 'medical';
    return item.category === selectedCategoryFilter;
  });

  // Sort by start time
  const sortedItems = [...filteredItems].sort((a, b) => a.startTime.localeCompare(b.startTime));

  // Completion calculation for selected date
  const totalCount = dayItems.length;
  const completedCount = dayItems.filter(i => i.completed).length;
  const overdueCount = dayItems.filter(i => !i.completed && isItemOverdue(selectedDate, i.startTime, i.endTime, today, currentTimeStr)).length;
  const pendingCount = totalCount - completedCount;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const getCategoryBadge = (category: ItemCategory) => {
    switch (category) {
      case 'medication':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"><Pill className="w-3.5 h-3.5" /> Remédio</span>;
      case 'medical':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300"><Stethoscope className="w-3.5 h-3.5" /> Consulta</span>;
      case 'website':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"><Globe className="w-3.5 h-3.5" /> Site</span>;
      case 'music':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300"><Music className="w-3.5 h-3.5" /> Música</span>;
      case 'image_note':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"><ImageIcon className="w-3.5 h-3.5" /> Foto / Recado</span>;
      default:
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300"><Clock className="w-3.5 h-3.5" /> Rotina</span>;
    }
  };

  return (
    <div className="space-y-6">

      {/* COMPONENTE: Barra de Progresso do Dia */}
      <div id="day-progress-bar-card" className="p-5 sm:p-6 rounded-3xl bg-linear-to-br from-teal-50/90 via-sky-50 to-indigo-50/80 dark:from-slate-900 dark:via-indigo-950/60 dark:to-slate-900 text-slate-800 dark:text-white shadow-md border border-teal-200/80 dark:border-indigo-900/50 space-y-4 relative overflow-hidden">
        {/* Background glow decorator */}
        <div className="absolute -right-10 -bottom-10 w-44 h-44 bg-teal-400/15 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -left-10 -top-10 w-44 h-44 bg-sky-400/15 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 relative z-10">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-teal-100/80 dark:bg-indigo-900/60 border border-teal-200 dark:border-indigo-700/60 text-teal-800 dark:text-teal-200">
              <Sparkles className="w-5 h-5 text-amber-500 dark:text-amber-300" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                Barra de Progresso do Dia
                {totalCount > 0 && progressPercent === 100 && (
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 text-[11px] font-extrabold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    100% Concluído!
                  </span>
                )}
              </h3>
              <p className="text-xs text-slate-600 dark:text-indigo-200/80 font-medium">
                {selectedDate === today ? 'Tarefas planejadas para hoje' : `Tarefas planejadas para ${formatPortugueseDate(selectedDate)}`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-auto">
            <div className="text-right">
              <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                {progressPercent}%
              </span>
              <span className="block text-[10px] text-teal-700 dark:text-indigo-300 font-bold uppercase tracking-wider">
                Concluído
              </span>
            </div>
          </div>
        </div>

        {/* Visual Progress Bar Bar */}
        <div className="space-y-2 relative z-10">
          <div className="w-full h-4 rounded-full bg-slate-200/80 dark:bg-slate-800/90 p-1 border border-teal-200/90 dark:border-indigo-700/40 overflow-hidden shadow-inner">
            <div
              className={`h-full rounded-full transition-all duration-700 ease-out ${
                progressPercent === 100
                  ? 'bg-linear-to-r from-emerald-400 to-teal-400 shadow-md shadow-emerald-500/20'
                  : progressPercent > 0
                  ? 'bg-linear-to-r from-teal-500 via-sky-400 to-emerald-400'
                  : 'bg-teal-200/40 dark:bg-indigo-900/40'
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Quick Metrics Badges */}
          <div className="flex flex-wrap items-center justify-between text-xs font-semibold gap-2 pt-1 text-slate-700 dark:text-indigo-200">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white/90 dark:bg-indigo-950/80 border border-teal-200 dark:border-indigo-800/60 text-slate-800 dark:text-indigo-200 text-xs font-bold shadow-xs">
                <span className="w-2 h-2 rounded-full bg-teal-500" />
                Total: <strong>{totalCount}</strong>
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-300 text-xs font-bold shadow-xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                Concluídas: <strong>{completedCount}</strong>
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white/90 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold shadow-xs">
                <Circle className="w-3 h-3 text-slate-400" />
                Pendentes: <strong>{pendingCount}</strong>
              </span>
              {overdueCount > 0 && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-rose-50 dark:bg-rose-950/90 border border-rose-200 dark:border-rose-700/80 text-rose-800 dark:text-rose-300 text-xs font-extrabold animate-pulse shadow-xs">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                  Atrasadas: <strong>{overdueCount}</strong>
                </span>
              )}
            </div>
            
            <div className="text-[11px] text-teal-800 dark:text-indigo-300 font-medium ml-auto">
              {totalCount === 0 ? (
                'Nenhuma tarefa planejada'
              ) : (
                `${completedCount} de ${totalCount} tarefas (${progressPercent}%)`
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Date Navigation Bar */}
      <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
        
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Day Navigation */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
            <button
              onClick={handlePrevDay}
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-slate-700 dark:text-slate-300"
              title="Dia anterior"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="text-center px-3 py-1">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white capitalize">
                {formatPortugueseDate(selectedDate)}
              </h2>
              {selectedDate === today && (
                <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400">
                  • HOJE •
                </span>
              )}
            </div>

            <button
              onClick={handleNextDay}
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-slate-700 dark:text-slate-300"
              title="Próximo dia"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Date Shortcuts & Add Button */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            {selectedDate !== today && (
              <button
                onClick={() => onSelectDate(today)}
                className="px-3 py-2 rounded-xl bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 font-bold text-xs hover:bg-indigo-100 transition-colors"
              >
                Ir para Hoje
              </button>
            )}

            <button
              onClick={() => onOpenAddItem()}
              className="px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md transition-all hover:scale-105"
            >
              <Plus className="w-4 h-4" />
              Adicionar Lembrete / Horário
            </button>
          </div>

        </div>

        {/* Overdue Warning Alert */}
        {overdueCount > 0 && (
          <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 flex items-center justify-between text-xs font-bold text-rose-800 dark:text-rose-300">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400 animate-bounce shrink-0" />
              <span>Atenção: Você tem {overdueCount} {overdueCount === 1 ? 'item pendente/atrasado' : 'itens pendentes/atrasados'} nesta data!</span>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-rose-200 dark:bg-rose-900 text-rose-900 dark:text-rose-100 text-[10px] uppercase tracking-wider font-extrabold animate-pulse">
              Atrasado
            </span>
          </div>
        )}

      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setSelectedCategoryFilter('all')}
          className={`px-3.5 py-2 rounded-2xl text-xs font-bold shrink-0 transition-all ${
            selectedCategoryFilter === 'all'
              ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow-xs'
              : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 hover:bg-slate-200'
          }`}
        >
          🌟 Todos ({dayItems.length})
        </button>

        <button
          onClick={() => setSelectedCategoryFilter('medical_health')}
          className={`px-3.5 py-2 rounded-2xl text-xs font-bold shrink-0 transition-all flex items-center gap-1.5 ${
            selectedCategoryFilter === 'medical_health'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 hover:bg-emerald-100'
          }`}
        >
          <Pill className="w-3.5 h-3.5" /> Remédios e Consultas
        </button>

        <button
          onClick={() => setSelectedCategoryFilter('website')}
          className={`px-3.5 py-2 rounded-2xl text-xs font-bold shrink-0 transition-all flex items-center gap-1.5 ${
            selectedCategoryFilter === 'website'
              ? 'bg-amber-500 text-slate-950 shadow-xs'
              : 'bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 hover:bg-amber-100'
          }`}
        >
          <Globe className="w-3.5 h-3.5" /> Sites
        </button>

        <button
          onClick={() => setSelectedCategoryFilter('music')}
          className={`px-3.5 py-2 rounded-2xl text-xs font-bold shrink-0 transition-all flex items-center gap-1.5 ${
            selectedCategoryFilter === 'music'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'bg-purple-50 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 hover:bg-purple-100'
          }`}
        >
          <Music className="w-3.5 h-3.5" /> Músicas
        </button>

        <button
          onClick={() => setSelectedCategoryFilter('image_note')}
          className={`px-3.5 py-2 rounded-2xl text-xs font-bold shrink-0 transition-all flex items-center gap-1.5 ${
            selectedCategoryFilter === 'image_note'
              ? 'bg-rose-600 text-white shadow-xs'
              : 'bg-rose-50 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 hover:bg-rose-100'
          }`}
        >
          <ImageIcon className="w-3.5 h-3.5" /> Fotos & Recados
        </button>
      </div>

      {/* Main Schedule Timeline List */}
      {sortedItems.length === 0 ? (
        <div className="text-center py-16 px-4 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900">
          <Calendar className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">
            Nenhum compromisso neste dia
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-6">
            Você ou seu apoiador podem adicionar remédios, consultas, recados com foto, sites e músicas para esta data.
          </p>
          <button
            onClick={() => onOpenAddItem()}
            className="px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm inline-flex items-center gap-2 shadow-md"
          >
            <Plus className="w-4 h-4" />
            Adicionar Lembrete para {selectedDate}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedItems.map(item => {
            const isActive = selectedDate === today && isItemActiveNow(item.startTime, item.endTime, currentTimeStr);
            const isOverdue = !item.completed && isItemOverdue(selectedDate, item.startTime, item.endTime, today, currentTimeStr);

            return (
              <div
                key={item.id}
                className={`group rounded-3xl p-5 border transition-all duration-300 relative overflow-hidden ${
                  item.completed
                    ? 'bg-slate-50/80 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 opacity-75'
                    : isOverdue
                    ? 'bg-rose-50/60 dark:bg-rose-950/20 border-rose-300 dark:border-rose-800/80 shadow-md ring-2 ring-rose-500/20'
                    : isActive
                    ? 'bg-white dark:bg-slate-900 border-emerald-500 dark:border-emerald-500 shadow-md ring-2 ring-emerald-500/30'
                    : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-indigo-300 dark:hover:border-indigo-700'
                }`}
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  
                  {/* Left: Checkbox + Time Badge + Details */}
                  <div className="flex items-start gap-4 flex-1">
                    
                    {/* Big Easy Check Button */}
                    <button
                      onClick={() => {
                        onToggleComplete(item.id);
                        if (!item.completed) soundManager.playSuccessChime();
                      }}
                      className={`p-2 rounded-2xl transition-all shrink-0 mt-0.5 ${
                        item.completed
                          ? 'bg-emerald-500 text-white'
                          : isOverdue
                          ? 'bg-rose-100 dark:bg-rose-900/60 text-rose-600 dark:text-rose-300 hover:bg-emerald-500 hover:text-white border border-rose-300 dark:border-rose-700 animate-pulse'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:bg-emerald-100 hover:text-emerald-600'
                      }`}
                      title={item.completed ? 'Marcar como não concluído' : 'Marcar como concluído'}
                    >
                      {item.completed ? <CheckCircle2 className="w-7 h-7" /> : <Circle className="w-7 h-7" />}
                    </button>

                    <div className="space-y-1.5 flex-1">
                      
                      <div className="flex items-center gap-2 flex-wrap">
                        {/* Time Badge */}
                        <span className="px-3 py-1 rounded-xl text-xs font-mono font-bold bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-indigo-400 dark:text-indigo-600" />
                          {item.startTime} {item.endTime ? `às ${item.endTime}` : ''}
                        </span>

                        {getCategoryBadge(item.category)}

                        {isActive && (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500 text-slate-950 uppercase tracking-wider animate-pulse">
                            • Agora
                          </span>
                        )}

                        {isOverdue && (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-600 text-white dark:bg-rose-700 dark:text-white uppercase tracking-wider flex items-center gap-1 shadow-xs animate-pulse">
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-300 animate-bounce shrink-0" />
                            Atrasado / Pendente
                          </span>
                        )}

                        {item.important && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300">
                            Importante
                          </span>
                        )}
                      </div>

                      <h3 className={`text-base sm:text-lg font-bold ${
                        item.completed ? 'line-through text-slate-500 dark:text-slate-500' : 'text-slate-900 dark:text-white'
                      }`}>
                        {item.title}
                      </h3>

                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-3xl">
                        {item.description}
                      </p>

                      {isOverdue && (
                        <div className="mt-2 p-2.5 rounded-xl bg-rose-100/90 dark:bg-rose-950/70 border border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-200 text-xs font-semibold flex items-center gap-2 animate-fade-in">
                          <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 animate-bounce" />
                          <span><strong>Atenção:</strong> Horário expirado! Este item ainda não foi concluído.</span>
                        </div>
                      )}

                      {item.medicalNote && (
                        <div className="mt-2 p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-amber-900 dark:text-amber-200 text-xs font-medium inline-flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                          <span><strong>Nota:</strong> {item.medicalNote}</span>
                        </div>
                      )}

                      {/* Image Thumbnail inside card if present */}
                      {item.imageUrl && item.category !== 'image_note' && (
                        <div className="mt-2 w-full max-w-xs h-28 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800">
                          <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                        </div>
                      )}

                    </div>

                  </div>

                  {/* Right Actions */}
                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
                    {speechEnabled && (
                      <button
                        onClick={() => soundManager.speak(`${item.title} às ${item.startTime}. ${item.description}`)}
                        className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
                        title="Ouvir lembrete"
                      >
                        <Volume2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                      </button>
                    )}

                    {item.linkUrl && (
                      <a
                        href={item.linkUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all"
                      >
                        Site <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}

                    {item.musicUrl && (
                      <a
                        href={item.musicUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all"
                      >
                        Música <Music className="w-3.5 h-3.5" />
                      </a>
                    )}

                    <button
                      onClick={() => {
                        soundManager.playPop();
                        onDeleteItem(item.id);
                      }}
                      className="p-2.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                      title="Excluir item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
