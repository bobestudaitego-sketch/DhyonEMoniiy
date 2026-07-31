import React from 'react';
import { Pill, Stethoscope, Clock, CheckCircle2, AlertCircle, Plus, Calendar, MapPin, ExternalLink, ShieldCheck, Volume2, Trash2 } from 'lucide-react';
import { ScheduleItem, UserProfile } from '../types';
import { soundManager } from '../utils/sound';

interface MedicationTrackerProps {
  items: ScheduleItem[];
  currentProfile: UserProfile;
  onToggleComplete: (itemId: string) => void;
  onOpenAddItem: (presetCategory?: string) => void;
  onDeleteItem?: (itemId: string) => void;
  speechEnabled: boolean;
}

export const MedicationTracker: React.FC<MedicationTrackerProps> = ({
  items,
  currentProfile,
  onToggleComplete,
  onOpenAddItem,
  onDeleteItem,
  speechEnabled
}) => {
  const medicalItems = items.filter(item => item.category === 'medication' || item.category === 'medical');

  const medications = medicalItems.filter(item => item.category === 'medication');
  const appointments = medicalItems.filter(item => item.category === 'medical');

  return (
    <div className="space-y-8">
      
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-linear-to-r from-emerald-500/10 via-teal-500/10 to-blue-500/10 border border-emerald-200 dark:border-emerald-900/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-emerald-600 text-white font-bold shrink-0 shadow-md">
            <Pill className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              Controle de Remédios & Consultas Médicas
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-0.5">
              Horários exatos de medicação, orientações de uso e compromissos com médicos.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onOpenAddItem('medication')}
            className="px-3.5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all shadow-md"
          >
            <Plus className="w-4 h-4" />
            + Remédio
          </button>

          <button
            onClick={() => onOpenAddItem('medical')}
            className="px-3.5 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all shadow-md"
          >
            <Plus className="w-4 h-4" />
            + Consulta
          </button>
        </div>
      </div>

      {/* Medication List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Pill className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            Remédios Agendados ({medications.length})
          </h3>
        </div>

        {medications.length === 0 ? (
          <div className="p-6 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 text-center text-xs text-slate-500">
            Nenhum remédio cadastrado na rotina.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {medications.map(item => (
              <div
                key={item.id}
                className={`p-5 rounded-2xl border transition-all ${
                  item.completed
                    ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900 opacity-80'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-xs hover:border-emerald-300'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-md text-xs font-mono font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {item.startTime} {item.endTime ? `às ${item.endTime}` : ''}
                      </span>
                      {item.recurring === 'daily' && (
                        <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-500">Todos os dias</span>
                      )}
                    </div>

                    <h4 className="text-base font-bold text-slate-900 dark:text-white">
                      {item.title}
                    </h4>

                    {item.medicalNote && (
                      <div className="mt-2 p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-amber-900 dark:text-amber-200 text-xs font-medium flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <span><strong>Como Tomar:</strong> {item.medicalNote}</span>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      onToggleComplete(item.id);
                      if (!item.completed) soundManager.playSuccessChime();
                    }}
                    className={`p-2.5 rounded-xl transition-all ${
                      item.completed
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-emerald-100 hover:text-emerald-700'
                    }`}
                    title={item.completed ? 'Tomado! Desmarcar?' : 'Marcar como Tomado'}
                  >
                    <CheckCircle2 className="w-6 h-6" />
                  </button>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    Cadastrado por: {item.createdBy}
                  </span>

                  <div className="flex items-center gap-2">
                    {speechEnabled && (
                      <button
                        onClick={() => soundManager.speak(`Remédio ${item.title} às ${item.startTime}. ${item.medicalNote || item.description}`)}
                        className="p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 cursor-pointer"
                        title="Ouvir instruções"
                      >
                        <Volume2 className="w-4 h-4 text-indigo-500" />
                      </button>
                    )}
                    {onDeleteItem && (
                      <button
                        onClick={() => {
                          soundManager.playPop();
                          onDeleteItem(item.id);
                        }}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
                        title="Excluir remédio"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Doctor Appointments List */}
      <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Stethoscope className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            Consultas & Médicos ({appointments.length})
          </h3>
        </div>

        {appointments.length === 0 ? (
          <div className="p-6 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 text-center text-xs text-slate-500">
            Nenhuma consulta agendada.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {appointments.map(item => (
              <div
                key={item.id}
                className={`p-5 rounded-2xl border transition-all ${
                  item.completed
                    ? 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 opacity-70'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-xs hover:border-blue-300'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2 justify-between">
                    <span className="px-2.5 py-0.5 rounded-md text-xs font-mono font-bold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {item.date} - {item.startTime} até {item.endTime || '15:00'}
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          onToggleComplete(item.id);
                          if (!item.completed) soundManager.playSuccessChime();
                        }}
                        className={`px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer ${
                          item.completed
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-blue-600 text-white hover:bg-blue-500'
                        }`}
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        {item.completed ? 'Realizado' : 'Concluir'}
                      </button>

                      {onDeleteItem && (
                        <button
                          onClick={() => {
                            soundManager.playPop();
                            onDeleteItem(item.id);
                          }}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
                          title="Excluir consulta"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  <h4 className="text-base font-bold text-slate-900 dark:text-white">
                    {item.title}
                  </h4>

                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    {item.description}
                  </p>

                  {item.medicalNote && (
                    <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 text-blue-900 dark:text-blue-200 text-xs font-medium">
                      <strong>Observações Médicas:</strong> {item.medicalNote}
                    </div>
                  )}

                  {item.linkUrl && (
                    <a
                      href={item.linkUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 font-bold hover:underline mt-1"
                    >
                      <MapPin className="w-3.5 h-3.5" /> Ver Localização do Hospital/Clínica
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
