import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle2, Volume2, ExternalLink, Music, AlertCircle, ArrowRight, Pill, Stethoscope, HeartHandshake, Sparkles } from 'lucide-react';
import { ScheduleItem } from '../types';
import { getCurrentTimeString, getTodayDateString, isItemActiveNow, getMinutesUntil, formatTimeDifference } from '../utils/date';
import { soundManager } from '../utils/sound';

interface NowBannerProps {
  items: ScheduleItem[];
  onToggleComplete: (itemId: string) => void;
  speechEnabled: boolean;
}

export const NowBanner: React.FC<NowBannerProps> = ({ items, onToggleComplete, speechEnabled }) => {
  const [currentTimeStr, setCurrentTimeStr] = useState(getCurrentTimeString());
  const today = getTodayDateString();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTimeStr(getCurrentTimeString());
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Filter today's items
  const todaysItems = items.filter(item => item.date === today && !item.completed);
  
  // Find item active right now
  const activeNowItem = todaysItems.find(item => isItemActiveNow(item.startTime, item.endTime, currentTimeStr));

  // Find next upcoming item today
  const sortedUpcoming = todaysItems
    .filter(item => !isItemActiveNow(item.startTime, item.endTime, currentTimeStr))
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  const nextUpItem = sortedUpcoming[0];

  const handleSpeech = (text: string) => {
    soundManager.speak(text);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'medication': return <Pill className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />;
      case 'medical': return <Stethoscope className="w-6 h-6 text-blue-600 dark:text-blue-400" />;
      case 'music': return <Music className="w-6 h-6 text-purple-600 dark:text-purple-400" />;
      case 'website': return <ExternalLink className="w-6 h-6 text-amber-600 dark:text-amber-400" />;
      default: return <Clock className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />;
    }
  };

  if (activeNowItem) {
    return (
      <div className="w-full mb-6 rounded-3xl bg-linear-to-r from-emerald-500 via-teal-600 to-indigo-600 p-1 shadow-lg animate-fade-in text-white">
        <div className="bg-slate-900/90 backdrop-blur-md rounded-[22px] p-5 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 border border-white/10">
          
          <div className="flex items-start gap-4 flex-1">
            <div className="p-3.5 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 shrink-0">
              {getCategoryIcon(activeNowItem.category)}
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500 text-slate-950 flex items-center gap-1.5 animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-slate-950 inline-block"></span>
                  Acontecendo Agora ({activeNowItem.startTime} {activeNowItem.endTime ? `- ${activeNowItem.endTime}` : ''})
                </span>
                {activeNowItem.important && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-rose-500/80 text-white">
                    Importante
                  </span>
                )}
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                {activeNowItem.title}
              </h2>

              <p className="text-sm text-slate-200 leading-relaxed max-w-2xl">
                {activeNowItem.description}
              </p>

              {activeNowItem.medicalNote && (
                <div className="inline-flex items-center gap-2 mt-2 px-3 py-1.5 rounded-xl bg-amber-500/20 border border-amber-400/30 text-amber-200 text-xs font-medium">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>Instrução: {activeNowItem.medicalNote}</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-700/60 justify-end">
            {speechEnabled && (
              <button
                onClick={() => handleSpeech(`Acontecendo agora: ${activeNowItem.title}. ${activeNowItem.description}`)}
                className="px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-2 transition-all border border-slate-700"
              >
                <Volume2 className="w-4 h-4 text-indigo-400" />
                Ouvir
              </button>
            )}

            {activeNowItem.linkUrl && (
              <a
                href={activeNowItem.linkUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-2 transition-all shadow-md"
              >
                <ExternalLink className="w-4 h-4" />
                Abrir Site
              </a>
            )}

            {activeNowItem.musicUrl && (
              <a
                href={activeNowItem.musicUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-xl bg-purple-500 hover:bg-purple-400 text-white text-xs font-bold flex items-center gap-2 transition-all shadow-md"
              >
                <Music className="w-4 h-4" />
                Ouvir Música
              </a>
            )}

            <button
              onClick={() => {
                onToggleComplete(activeNowItem.id);
                soundManager.playSuccessChime();
              }}
              className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm flex items-center gap-2 transition-all shadow-lg hover:scale-105 active:scale-95"
            >
              <CheckCircle2 className="w-5 h-5" />
              Concluir Agora
            </button>
          </div>

        </div>
      </div>
    );
  }

  if (nextUpItem) {
    const minsLeft = getMinutesUntil(nextUpItem.startTime, currentTimeStr);
    const timeDiffText = formatTimeDifference(minsLeft);

    return (
      <div className="w-full mb-6 rounded-3xl bg-linear-to-r from-indigo-500 via-purple-600 to-pink-500 p-0.5 shadow-md">
        <div className="bg-white dark:bg-slate-900 rounded-[23px] p-5 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-indigo-100 dark:border-slate-800">
          
          <div className="flex items-start gap-4 flex-1">
            <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 shrink-0">
              {getCategoryIcon(nextUpItem.category)}
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-900 dark:bg-indigo-950 dark:text-indigo-300 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  Próximo Passo ({nextUpItem.startTime}) - <span className="text-indigo-700 dark:text-indigo-300 font-extrabold">{timeDiffText}</span>
                </span>
                {nextUpItem.important && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300">
                    Importante
                  </span>
                )}
              </div>

              <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                {nextUpItem.title}
              </h2>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 line-clamp-1">
                {nextUpItem.description}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 w-full md:w-auto justify-end pt-2 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-800">
            {speechEnabled && (
              <button
                onClick={() => handleSpeech(`Próximo passo às ${nextUpItem.startTime}: ${nextUpItem.title}`)}
                className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium"
                title="Ouvir lembrete"
              >
                <Volume2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              </button>
            )}

            <button
              onClick={() => {
                onToggleComplete(nextUpItem.id);
                soundManager.playSuccessChime();
              }}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-sm"
            >
              <CheckCircle2 className="w-4 h-4" />
              Marcar como Feito
            </button>
          </div>

        </div>
      </div>
    );
  }

  // If all completed today
  const totalCompleted = items.filter(item => item.date === today && item.completed).length;

  return (
    <div className="w-full mb-6 rounded-3xl bg-linear-to-r from-emerald-50 via-teal-50 to-blue-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900 border border-emerald-200/80 dark:border-emerald-900/50 p-5 sm:p-6 shadow-xs">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
            <HeartHandshake className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              Tudo Tranquilo Por Agora!
              <Sparkles className="w-4 h-4 text-amber-500" />
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-0.5">
              Você já concluiu <strong className="text-emerald-700 dark:text-emerald-400">{totalCompleted} tarefas</strong> hoje. Parabéns pelo excelente acompanhamento!
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-medium text-emerald-800 dark:text-emerald-300 bg-emerald-100/60 dark:bg-emerald-950/60 px-3.5 py-2 rounded-xl">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          Rotina em dia
        </div>
      </div>
    </div>
  );
};
