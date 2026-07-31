import React, { useState } from 'react';
import { JournalEntry, UserProfile, JournalAuthorType } from '../types';
import { formatPortugueseDate } from '../utils/date';
import { soundManager } from '../utils/sound';
import {
  BookOpen,
  HeartHandshake,
  Volume2,
  CheckCircle2,
  Circle,
  Plus,
  Filter,
  Trash2,
  MessageCircle,
  Sparkles,
  Send,
  UserCheck,
  Smile,
  Meh,
  Frown,
  Sun,
  ShieldAlert,
  HelpCircle,
  X,
  User,
  Printer,
  Calendar,
  FileText
} from 'lucide-react';

interface CaregiverJournalProps {
  entries: JournalEntry[];
  currentProfile: UserProfile;
  onAddEntry: (entryData: {
    authorType: JournalAuthorType;
    title: string;
    content: string;
    date: string;
    time: string;
    expectationsTag?: string;
    feelingMood?: 'happy' | 'calm' | 'tired' | 'anxious' | 'excited' | 'neutral';
  }) => void;
  onToggleRead: (entryId: string) => void;
  onAddReply: (entryId: string, replyText: string) => void;
  onDeleteEntry: (entryId: string) => void;
  onDeleteReply?: (entryId: string, replyId: string) => void;
  speechEnabled?: boolean;
}

export const CaregiverJournal: React.FC<CaregiverJournalProps> = ({
  entries,
  currentProfile,
  onAddEntry,
  onToggleRead,
  onAddReply,
  onDeleteEntry,
  onDeleteReply,
  speechEnabled = true
}) => {
  const [filter, setFilter] = useState<'all' | 'caregiver' | 'user'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  
  // Form state
  const isHelper = currentProfile.role === 'helper';
  const [authorType, setAuthorType] = useState<JournalAuthorType>(
    isHelper ? 'caregiver_to_user' : 'user_to_caregiver'
  );
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [expectationsTag, setExpectationsTag] = useState('Orientações');
  const [feelingMood, setFeelingMood] = useState<'happy' | 'calm' | 'tired' | 'anxious' | 'excited' | 'neutral'>('calm');

  // Active reply inputs for each entry card
  const [replyInputs, setReplyInputs] = useState<Record<string, string>>({});

  // Get current month entries for print report
  const now = new Date();
  const currentYearMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  
  const currentMonthEntries = entries.filter(item => {
    if (!item.date) return false;
    return item.date.startsWith(currentYearMonth);
  }).sort((a, b) => {
    return `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`);
  });

  // If no entries for current month specifically, fallback to all entries sorted by date
  const printableEntries = currentMonthEntries.length > 0
    ? currentMonthEntries
    : [...entries].sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`));

  const currentMonthName = now.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });

  const handlePrint = () => {
    soundManager.playSuccessChime();
    setTimeout(() => {
      window.print();
    }, 200);
  };

  // Filter logic
  const filteredEntries = entries.filter(item => {
    if (filter === 'caregiver') return item.authorType === 'caregiver_to_user';
    if (filter === 'user') return item.authorType === 'user_to_caregiver';
    return true;
  });

  // Sort newest first
  const sortedEntries = [...filteredEntries].sort((a, b) => {
    const dateTimeA = `${a.date} ${a.time}`;
    const dateTimeB = `${b.date} ${b.time}`;
    return dateTimeB.localeCompare(dateTimeA);
  });

  const handleSpeakText = (textToRead: string) => {
    soundManager.speak(textToRead);
  };

  const handleApplyTemplate = (templateTitle: string, templateContent: string, tag: string, mood: any) => {
    setTitle(templateTitle);
    setContent(templateContent);
    setExpectationsTag(tag);
    setFeelingMood(mood);
  };

  const handleSubmitNewEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

    onAddEntry({
      authorType,
      title: title.trim(),
      content: content.trim(),
      date: dateStr,
      time: timeStr,
      expectationsTag,
      feelingMood
    });

    // Sound effect
    soundManager.playSuccessChime();

    // Reset and close
    setTitle('');
    setContent('');
    setIsModalOpen(false);
  };

  const handleSendReply = (entryId: string) => {
    const text = replyInputs[entryId]?.trim();
    if (!text) return;

    onAddReply(entryId, text);
    setReplyInputs(prev => ({ ...prev, [entryId]: '' }));
    soundManager.playSuccessChime();
  };

  const getMoodBadge = (mood?: string) => {
    switch (mood) {
      case 'happy':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"><Smile className="w-3.5 h-3.5" /> Feliz & Animado</span>;
      case 'calm':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300 border border-teal-200 dark:border-teal-800"><Sun className="w-3.5 h-3.5" /> Calmo & Tranquilo</span>;
      case 'tired':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800"><Meh className="w-3.5 h-3.5" /> Cansado / Preciso de Pausa</span>;
      case 'anxious':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-200 dark:border-amber-800"><Frown className="w-3.5 h-3.5" /> Ansioso / Preciso de Calma</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Hero Header Card */}
      <div className="p-6 rounded-3xl bg-linear-to-r from-teal-50 via-sky-50 to-emerald-50/90 dark:from-slate-900 dark:via-teal-950/40 dark:to-slate-900 text-slate-900 dark:text-white shadow-md border border-teal-200/90 dark:border-teal-800/70 space-y-4 relative overflow-hidden">
        <div className="absolute -right-12 -bottom-12 w-56 h-56 bg-teal-400/15 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-3.5">
            <div className="p-3.5 rounded-2xl bg-teal-100 dark:bg-teal-900/60 border border-teal-200 dark:border-teal-700/60 text-teal-800 dark:text-teal-200 shrink-0 shadow-sm">
              <BookOpen className="w-7 h-7 text-teal-700 dark:text-amber-300" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                Diário de Recados & Orientações da Cuidadora
                <Sparkles className="w-5 h-5 text-amber-500 dark:text-amber-300" />
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-teal-100/90 font-medium max-w-2xl mt-0.5">
                Leia o que sua cuidadora espera de você no dia a dia, e escreva também como está se sentindo ou o que precisa. Uma ponte de carinho e comunicação contínua!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 self-stretch sm:self-auto flex-wrap sm:flex-nowrap justify-end">
            <button
              onClick={() => setIsPrintModalOpen(true)}
              className="px-4 py-3 rounded-2xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs sm:text-sm border border-teal-600 shadow-sm transition-all flex items-center gap-2 shrink-0 cursor-pointer justify-center flex-1 sm:flex-none"
              title="Gerar e imprimir versão em preto e branco do mês atual"
            >
              <Printer className="w-5 h-5 text-amber-300" />
              Imprimir Resumo
            </button>

            <button
              onClick={() => {
                setAuthorType(isHelper ? 'caregiver_to_user' : 'user_to_caregiver');
                setIsModalOpen(true);
              }}
              className="px-5 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2 shrink-0 cursor-pointer justify-center flex-1 sm:flex-none"
            >
              <Plus className="w-5 h-5" />
              Escrever Anotação no Diário
            </button>
          </div>
        </div>

        {/* Info stats */}
        <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-semibold text-teal-200 border-t border-teal-800/60">
          <span className="flex items-center gap-1.5">
            <UserCheck className="w-4 h-4 text-emerald-400" />
            {entries.filter(e => e.authorType === 'caregiver_to_user').length} anotações da Cuidadora
          </span>
          <span className="flex items-center gap-1.5">
            <MessageCircle className="w-4 h-4 text-amber-300" />
            {entries.filter(e => e.authorType === 'user_to_caregiver').length} anotações do Usuário
          </span>
          <span className="flex items-center gap-1.5 ml-auto text-teal-300 font-normal">
            <HeartHandshake className="w-4 h-4 text-rose-400" />
            Clique em "Ouvir Anotação" para escutar o áudio em voz alta!
          </span>
        </div>
      </div>

      {/* Filter Tabs Bar */}
      <div className="flex items-center justify-between gap-3 flex-wrap bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all ${
              filter === 'all'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Filter className="w-3.5 h-3.5" />
            Todos os Recados ({entries.length})
          </button>

          <button
            onClick={() => setFilter('caregiver')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all ${
              filter === 'caregiver'
                ? 'bg-teal-700 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5 text-amber-300" />
            Orientações da Cuidadora ({entries.filter(e => e.authorType === 'caregiver_to_user').length})
          </button>

          <button
            onClick={() => setFilter('user')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all ${
              filter === 'user'
                ? 'bg-amber-500 text-slate-950 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <MessageCircle className="w-3.5 h-3.5" />
            Meu Diário para a Cuidadora ({entries.filter(e => e.authorType === 'user_to_caregiver').length})
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPrintModalOpen(true)}
            className="px-3 py-2 rounded-xl text-xs font-extrabold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 transition-all cursor-pointer"
            title="Visualizar e imprimir relatório do mês em preto e branco"
          >
            <Printer className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            Imprimir Resumo ({printableEntries.length})
          </button>

          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium px-2">
            {sortedEntries.length} {sortedEntries.length === 1 ? 'anotação encontrada' : 'anotações encontradas'}
          </div>
        </div>
      </div>

      {/* Journal Cards List */}
      {sortedEntries.length === 0 ? (
        <div className="text-center py-12 px-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-3">
          <BookOpen className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto" />
          <h3 className="text-base font-bold text-slate-700 dark:text-slate-300">
            Nenhuma anotação neste filtro
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            Clique no botão acima para cadastrar a primeira anotação do diário entre você e a cuidadora.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedEntries.map((item, index) => {
            const isCaregiverNote = item.authorType === 'caregiver_to_user';

            return (
              <div
                key={item.id}
                style={{ animationDelay: `${Math.min(index * 75, 450)}ms` }}
                className={`animate-fade-in rounded-3xl p-5 sm:p-6 border transition-all duration-300 space-y-4 relative overflow-hidden shadow-xs ${
                  isCaregiverNote
                    ? 'bg-linear-to-br from-teal-50/70 via-white to-indigo-50/40 dark:from-teal-950/30 dark:via-slate-900 dark:to-indigo-950/20 border-teal-200 dark:border-teal-800/70'
                    : 'bg-linear-to-br from-amber-50/70 via-white to-rose-50/30 dark:from-amber-950/20 dark:via-slate-900 dark:to-rose-950/20 border-amber-200 dark:border-amber-800/70'
                }`}
              >
                {/* Header info */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-200/70 dark:border-slate-800/80 pb-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-2xl font-bold ${
                      isCaregiverNote
                        ? 'bg-teal-600 text-white'
                        : 'bg-amber-500 text-slate-950'
                    }`}>
                      {isCaregiverNote ? <UserCheck className="w-5 h-5" /> : <User className="w-5 h-5" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                          isCaregiverNote
                            ? 'bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300 border border-teal-300 dark:border-teal-800'
                            : 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
                        }`}>
                          {isCaregiverNote ? '👩‍⚕️ O que a Cuidadora espera de mim' : '💬 Meu Diário para a Cuidadora'}
                        </span>
                        
                        {item.expectationsTag && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                            {item.expectationsTag}
                          </span>
                        )}

                        {getMoodBadge(item.feelingMood)}
                      </div>

                      <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white mt-1">
                        {item.title}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                        Escrito por <strong>{item.authorName}</strong> em {formatPortugueseDate(item.date)} às {item.time}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                    {/* Voice speech button */}
                    {speechEnabled && (
                      <button
                        onClick={() => handleSpeakText(`${item.title}. ${item.content}`)}
                        className="px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                        title="Ouvir em viva voz"
                      >
                        <Volume2 className="w-4 h-4 text-indigo-500 animate-pulse" />
                        Ouvir Anotação
                      </button>
                    )}

                    {/* Mark read button */}
                    <button
                      onClick={() => onToggleRead(item.id)}
                      className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                        item.readByOther
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-emerald-50'
                      }`}
                      title={item.readByOther ? 'Marcar como não lido' : 'Marcar como lido e entendido'}
                    >
                      {item.readByOther ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                          Lido / Entendido
                        </>
                      ) : (
                        <>
                          <Circle className="w-4 h-4 text-slate-400" />
                          Marcar como Lido
                        </>
                      )}
                    </button>

                    {/* Delete button (for all profiles) */}
                    <button
                      onClick={() => {
                        soundManager.playPop();
                        onDeleteEntry(item.id);
                      }}
                      className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors cursor-pointer"
                      title="Excluir anotação"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Content text */}
                <div className="p-4 rounded-2xl bg-white/80 dark:bg-slate-900/90 border border-slate-200/60 dark:border-slate-800 text-slate-800 dark:text-slate-200 text-sm leading-relaxed font-medium">
                  {item.content}
                </div>

                {/* Replies section */}
                <div className="space-y-3 pt-1">
                  {item.replies && item.replies.length > 0 && (
                    <div className="space-y-2 pl-2 sm:pl-4 border-l-2 border-indigo-200 dark:border-indigo-800">
                      <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1">
                        <MessageCircle className="w-3.5 h-3.5" />
                        Respostas & Comentários ({item.replies.length}):
                      </h4>

                      {item.replies.map(rep => (
                        <div
                          key={rep.id}
                          className="p-3 rounded-2xl bg-slate-100/80 dark:bg-slate-800/70 border border-slate-200/60 dark:border-slate-700/60 space-y-1 text-xs"
                        >
                          <div className="flex items-center justify-between text-slate-600 dark:text-slate-400 font-semibold">
                            <span className="flex items-center gap-1.5 text-slate-900 dark:text-white">
                              <strong>{rep.authorName}</strong>
                              <span className="text-[10px] px-2 py-0.2 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                                {rep.authorRole === 'helper' ? 'Cuidadora' : 'Usuário'}
                              </span>
                            </span>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px]">{rep.createdAt}</span>
                              {onDeleteReply && (
                                <button
                                  onClick={() => {
                                    soundManager.playPop();
                                    onDeleteReply(item.id, rep.id);
                                  }}
                                  className="p-0.5 text-slate-400 hover:text-rose-600 rounded-md transition-colors cursor-pointer"
                                  title="Excluir resposta"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </div>
                          <p className="text-slate-800 dark:text-slate-200 font-medium">
                            {rep.text}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add Reply Input */}
                  <div className="flex items-center gap-2 pt-2">
                    <input
                      type="text"
                      placeholder={`Responder a esta anotação como ${currentProfile.name}...`}
                      value={replyInputs[item.id] || ''}
                      onChange={e => setReplyInputs(prev => ({ ...prev, [item.id]: e.target.value }))}
                      onKeyDown={e => {
                        if (e.key === 'Enter') handleSendReply(item.id);
                      }}
                      className="flex-1 px-4 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                    />
                    <button
                      onClick={() => handleSendReply(item.id)}
                      disabled={!replyInputs[item.id]?.trim()}
                      className="px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
                    >
                      <Send className="w-3.5 h-3.5" />
                      Responder
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* CREATE NEW ENTRY MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-5 relative max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-2xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-bold">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    Nova Anotação no Diário
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Escreva para deixar registrado o que se espera ou como está o dia.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitNewEntry} className="space-y-4">
              {/* Type selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Tipo de Anotação:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setAuthorType('caregiver_to_user');
                      setExpectationsTag('Expectativa da Cuidadora');
                    }}
                    className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center gap-1 text-center transition-all ${
                      authorType === 'caregiver_to_user'
                        ? 'bg-teal-50 dark:bg-teal-950/60 border-teal-500 text-teal-800 dark:text-teal-200 ring-2 ring-teal-500/30'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                    }`}
                  >
                    <UserCheck className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                    <span>👩‍⚕️ Orientações da Cuidadora</span>
                    <span className="text-[10px] font-normal text-slate-500">O que a cuidadora espera de mim</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setAuthorType('user_to_caregiver');
                      setExpectationsTag('Sentimentos do Usuário');
                    }}
                    className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center gap-1 text-center transition-all ${
                      authorType === 'user_to_caregiver'
                        ? 'bg-amber-50 dark:bg-amber-950/60 border-amber-500 text-amber-900 dark:text-amber-200 ring-2 ring-amber-500/30'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                    }`}
                  >
                    <MessageCircle className="w-5 h-5 text-amber-500" />
                    <span>💬 Meu Diário de Sentimentos</span>
                    <span className="text-[10px] font-normal text-slate-500">Recado meu para a cuidadora ler</span>
                  </button>
                </div>
              </div>

              {/* Quick Template suggestions */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  Modelos Rápidos (Clique para preencher):
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {authorType === 'caregiver_to_user' ? (
                    <>
                      <button
                        type="button"
                        onClick={() => handleApplyTemplate(
                          'O que espero de você hoje',
                          'Espero que você tome o remédio da manhã no horário, beba 3 copos de água e descanse entre as atividades.',
                          'Expectativa do Dia',
                          'calm'
                        )}
                        className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-semibold hover:bg-teal-100 dark:hover:bg-teal-950 transition-colors"
                      >
                        📌 O que espero de você hoje
                      </button>
                      <button
                        type="button"
                        onClick={() => handleApplyTemplate(
                          'Dica especial para se manter calmo',
                          'Se sentir sobrecarga sensorial com barulhos, use os fones de ouvido e coloque a playlist de Músicas Calmas!',
                          'Dica & Bem-Estar',
                          'calm'
                        )}
                        className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-semibold hover:bg-teal-100 dark:hover:bg-teal-950 transition-colors"
                      >
                        💡 Dica de Bem-Estar
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => handleApplyTemplate(
                          'Como estou me sentindo nesta manhã',
                          'Acordei tranquilo e com boa disposição. Consegui seguir todas as etapas da rotina.',
                          'Sentimentos',
                          'happy'
                        )}
                        className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-semibold hover:bg-amber-100 dark:hover:bg-amber-950 transition-colors"
                      >
                        😊 Como me sinto hoje
                      </button>
                      <button
                        type="button"
                        onClick={() => handleApplyTemplate(
                          'Preciso de ajuda com um remédio ou dúvida',
                          'Tenho uma dúvida sobre o horário do remédio da tarde. Podemos conversar?',
                          'Dúvida',
                          'anxious'
                        )}
                        className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-semibold hover:bg-amber-100 dark:hover:bg-amber-950 transition-colors"
                      >
                        ❓ Tenho uma dúvida
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Title */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Título da Anotação:
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Orientações para a tarde / Como me senti"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Content */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Texto da Anotação / Recado:
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Escreva aqui detalhadamente o que você deseja comunicar ou o que espera do dia..."
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 resize-none"
                />
              </div>

              {/* Mood Feeling Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Sentimento / Tom do Recado:
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: 'happy', label: '😊 Feliz', bg: 'bg-emerald-100 text-emerald-800' },
                    { id: 'calm', label: '😌 Calmo', bg: 'bg-teal-100 text-teal-800' },
                    { id: 'tired', label: '😴 Cansado', bg: 'bg-indigo-100 text-indigo-800' },
                    { id: 'anxious', label: '😟 Ansioso', bg: 'bg-amber-100 text-amber-800' }
                  ].map(m => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setFeelingMood(m.id as any)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        feelingMood === m.id
                          ? `${m.bg} ring-2 ring-indigo-500`
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-2xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  Salvar no Diário
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* PRINT PREVIEW & PAPER SUMMARY MODAL */}
      {isPrintModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-xs animate-fade-in overflow-y-auto">
          <div className="bg-slate-900 rounded-3xl max-w-4xl w-full p-4 sm:p-6 border border-slate-700 shadow-2xl space-y-4 my-auto relative">
            
            {/* Modal Header & Controls (Non-Printable in UI) */}
            <div className="no-print flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4 text-white">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-teal-800 text-teal-200 border border-teal-700 shrink-0">
                  <Printer className="w-6 h-6 text-amber-300" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
                    Imprimir Resumo do Diário da Cuidadora
                  </h3>
                  <p className="text-xs text-slate-300">
                    Versão simplificada em preto e branco otimizada para leitura em papel ({currentMonthName}).
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 self-end sm:self-auto">
                <button
                  onClick={handlePrint}
                  className="px-5 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs sm:text-sm shadow-lg transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  Imprimir Agora (Ctrl + P)
                </button>

                <button
                  onClick={() => setIsPrintModalOpen(false)}
                  className="p-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                  title="Fechar visualização"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* PRINTABLE PAPER CONTAINER (Strict Black & White High-Contrast) */}
            <div className="max-h-[75vh] overflow-y-auto p-2 sm:p-4 bg-slate-800/50 rounded-2xl border border-slate-700/60">
              <div className="print-area bg-white text-black p-6 sm:p-10 rounded-xl space-y-6 shadow-md font-sans border border-slate-300">
                
                {/* Document Title Header */}
                <div className="border-b-2 border-black pb-4 text-center space-y-1">
                  <h1 className="text-xl sm:text-2xl font-black tracking-tight uppercase text-black">
                    MEU DIA SEGURO — DIÁRIO DA CUIDADORA & USUÁRIO
                  </h1>
                  <p className="text-xs font-bold text-black uppercase tracking-wider">
                    RESUMO MENSAL PARA LEITURA E ARQUIVAMENTO EM PAPEL • {currentMonthName.toUpperCase()}
                  </p>
                  <div className="text-[11px] text-black font-mono pt-2 flex items-center justify-between border-t border-slate-400 mt-2">
                    <span>Emissão: {new Date().toLocaleDateString('pt-BR')} às {new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                    <span>Perfil Ativo: {currentProfile.name}</span>
                    <span>Total de Registros: {printableEntries.length}</span>
                  </div>
                </div>

                {/* Printable entries list */}
                {printableEntries.length === 0 ? (
                  <div className="text-center py-8 text-black italic text-sm">
                    Nenhuma anotação registrada para este mês.
                  </div>
                ) : (
                  <div className="space-y-6">
                    {printableEntries.map((item, index) => {
                      const isCaregiver = item.authorType === 'caregiver_to_user';
                      return (
                        <div
                          key={item.id}
                          className="border border-black p-4 rounded-lg space-y-2 text-black text-xs leading-relaxed"
                        >
                          {/* Item meta header */}
                          <div className="flex items-center justify-between border-b border-black pb-1.5 font-bold text-[11px]">
                            <span>
                              #{index + 1} | DATA: {formatPortugueseDate(item.date)} às {item.time}
                            </span>
                            <span>
                              AUTOR: {item.authorName} ({isCaregiver ? 'Cuidadora / Apoiadora' : 'Usuário / PCD'})
                            </span>
                            <span>
                              STATUS: {item.readByOther ? '[ LIDO ]' : '[ PENDENTE ]'}
                            </span>
                          </div>

                          {/* Item Title & Tag */}
                          <div className="font-bold text-sm text-black">
                            {item.title}
                            {item.expectationsTag && (
                              <span className="ml-2 font-normal text-xs text-black italic">
                                ({item.expectationsTag})
                              </span>
                            )}
                          </div>

                          {/* Item Content */}
                          <div className="text-black whitespace-pre-wrap font-medium border-l-2 border-black pl-3 py-1">
                            {item.content}
                          </div>

                          {/* Replies */}
                          {item.replies && item.replies.length > 0 && (
                            <div className="pt-2 border-t border-slate-300 space-y-1">
                              <span className="font-bold text-[11px] block text-black">
                                RESPOSTAS / REGISTROS DE ACOMPANHAMENTO ({item.replies.length}):
                              </span>
                              {item.replies.map(rep => (
                                <div key={rep.id} className="pl-3 text-[11px] text-black border-l border-black">
                                  <strong>• [{rep.createdAt}] {rep.authorName}:</strong> {rep.text}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Printable Signature & Notes Footer */}
                <div className="border-t-2 border-black pt-6 space-y-6">
                  <div className="text-[11px] font-bold text-black uppercase">
                    OBSERVAÇÕES MANUAIS DA CUIDADORA / RESPONSÁVEL:
                  </div>
                  <div className="h-14 border border-dashed border-black rounded-sm" />

                  <div className="grid grid-cols-2 gap-8 pt-4">
                    <div className="text-center space-y-1">
                      <div className="border-b border-black w-3/4 mx-auto" />
                      <p className="text-[11px] font-bold text-black">Assinatura da Cuidadora / Apoiadora</p>
                    </div>

                    <div className="text-center space-y-1">
                      <div className="border-b border-black w-3/4 mx-auto" />
                      <p className="text-[11px] font-bold text-black">Assinatura do Usuário / Familiar</p>
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
