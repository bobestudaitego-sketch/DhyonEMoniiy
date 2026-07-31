import React, { useState } from 'react';
import { X, Lock, Plus, Trash2, CheckCircle, Circle, Calendar, Clock, Sparkles, Tag, StickyNote, Search, Shield } from 'lucide-react';
import { PrivateNote, UserProfile } from '../types';
import { soundManager } from '../utils/sound';

interface PrivateAgendaModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentProfile: UserProfile;
  notes: PrivateNote[];
  onAddNote: (note: Omit<PrivateNote, 'id' | 'createdAt' | 'ownerProfileId'>) => void;
  onToggleCompleteNote: (id: string) => void;
  onDeleteNote: (id: string) => void;
}

export const PrivateAgendaModal: React.FC<PrivateAgendaModalProps> = ({
  isOpen,
  onClose,
  currentProfile,
  notes,
  onAddNote,
  onToggleCompleteNote,
  onDeleteNote
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'agenda' | 'todo' | 'secret' | 'reminder'>('all');

  // New Note Form state
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const todayStr = new Date().toISOString().split('T')[0];
  const currentTimeStr = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  const [date, setDate] = useState(todayStr);
  const [time, setTime] = useState(currentTimeStr);
  const [category, setCategory] = useState<'agenda' | 'todo' | 'secret' | 'reminder'>('agenda');
  const [colorTag, setColorTag] = useState<string>('#6366f1'); // default indigo

  if (!isOpen) return null;

  // Filter notes strictly for current logged-in profile ONLY
  const myPrivateNotes = notes.filter(n => n.ownerProfileId === currentProfile.id);

  const filteredNotes = myPrivateNotes.filter(n => {
    const matchesCategory = selectedCategory === 'all' || n.category === selectedCategory;
    const matchesSearch = n.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          n.content.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    soundManager.playPop();
    onAddNote({
      title: title.trim(),
      content: content.trim(),
      date,
      time,
      category,
      completed: false,
      colorTag
    });

    // Reset Form
    setTitle('');
    setContent('');
    setIsAdding(false);
  };

  const COLOR_OPTIONS = [
    { name: 'Índigo', hex: '#6366f1', bgClass: 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-200 dark:border-indigo-800' },
    { name: 'Rosa Paixão', hex: '#f43f5e', bgClass: 'bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-800' },
    { name: 'Esmeralda', hex: '#10b981', bgClass: 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800' },
    { name: 'Âmbar Dourado', hex: '#f59e0b', bgClass: 'bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800' },
    { name: 'Roxo Lavanda', hex: '#a855f7', bgClass: 'bg-purple-50 dark:bg-purple-950/60 border-purple-200 dark:border-purple-800' },
    { name: 'Azul Noturno', hex: '#3b82f6', bgClass: 'bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-800' },
  ];

  const getCategoryBadge = (cat?: string) => {
    switch (cat) {
      case 'todo': return <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">📝 A Fazer</span>;
      case 'secret': return <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300">🔒 Segredo</span>;
      case 'reminder': return <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">📌 Lembrete</span>;
      case 'agenda':
      default: return <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">📅 Agendinha</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-indigo-900 via-slate-900 to-purple-900 text-white flex items-center justify-between border-b border-indigo-800/50">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-indigo-600 text-white shadow-lg animate-bounce">
              <StickyNote className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-black flex items-center gap-2">
                Minha Agendinha Privada
                <span className="px-2.5 py-0.5 rounded-full bg-rose-500/90 text-white text-[11px] font-extrabold flex items-center gap-1 shadow-xs">
                  <Lock className="w-3 h-3" /> Privado de {currentProfile.name}
                </span>
              </h3>
              <p className="text-xs text-indigo-200/90 flex items-center gap-1.5 mt-0.5">
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                Apenas você visualiza estas anotações pessoais. O outro perfil não tem acesso!
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Toolbar & Action Bar */}
        <div className="p-4 bg-slate-50 dark:bg-slate-950/50 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          
          {/* Filter Pills & Search */}
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto scrollbar-none">
            <button
              type="button"
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
              }`}
            >
              🌟 Todas ({myPrivateNotes.length})
            </button>
            <button
              type="button"
              onClick={() => setSelectedCategory('agenda')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedCategory === 'agenda'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
              }`}
            >
              📅 Agendinha
            </button>
            <button
              type="button"
              onClick={() => setSelectedCategory('todo')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedCategory === 'todo'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
              }`}
            >
              📝 A Fazer
            </button>
            <button
              type="button"
              onClick={() => setSelectedCategory('secret')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedCategory === 'secret'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
              }`}
            >
              🔒 Segredo
            </button>
          </div>

          {/* New Note Button */}
          <button
            type="button"
            onClick={() => {
              soundManager.playPop();
              setIsAdding(!isAdding);
            }}
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-extrabold text-xs sm:text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 hover:scale-105 active:scale-95 shrink-0"
          >
            {isAdding ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {isAdding ? 'Cancelar Nova Anotação' : 'Criar Nova Anotação'}
          </button>
        </div>

        {/* Modal Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          
          {/* New Note Form */}
          {isAdding && (
            <form onSubmit={handleSubmit} className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-indigo-50/80 via-purple-50/50 to-pink-50/80 dark:from-indigo-950/60 dark:via-purple-950/40 dark:to-slate-900 border-2 border-indigo-300 dark:border-indigo-700 shadow-xl space-y-4 animate-scale-up">
              <div className="flex items-center justify-between border-b border-indigo-200 dark:border-indigo-800/80 pb-2">
                <h4 className="text-sm font-black text-indigo-950 dark:text-indigo-200 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  Nova Anotação / Lembrete Privado
                </h4>
                <span className="text-xs text-slate-500 font-semibold">Garantia de Privacidade 🔒</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Título da Anotação:
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="Ex: Minhas ideias secretas, Lembrete da semana..."
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm font-bold focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Data:
                    </label>
                    <input
                      type="date"
                      value={date}
                      onChange={e => setDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Horário:
                    </label>
                    <input
                      type="time"
                      value={time}
                      onChange={e => setTime(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-bold"
                    />
                  </div>
                </div>
              </div>

              {/* Category & Color Picker */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Categoria:
                  </label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-bold"
                  >
                    <option value="agenda">📅 Agendinha Pessoal</option>
                    <option value="todo">📝 Lista de A Fazer</option>
                    <option value="secret">🔒 Segredo / Nota Privada</option>
                    <option value="reminder">📌 Lembrete Especial</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Cor do Marcador:
                  </label>
                  <div className="flex items-center gap-2">
                    {COLOR_OPTIONS.map(c => (
                      <button
                        key={c.hex}
                        type="button"
                        onClick={() => setColorTag(c.hex)}
                        className={`w-6 h-6 rounded-full transition-all cursor-pointer border-2 ${
                          colorTag === c.hex ? 'ring-2 ring-offset-2 ring-indigo-500 border-white scale-110' : 'border-transparent opacity-80 hover:opacity-100'
                        }`}
                        style={{ backgroundColor: c.hex }}
                        title={c.name}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Conteúdo / Anotação:
                </label>
                <textarea
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  rows={3}
                  placeholder="Escreva suas anotações, pensamentos ou lista pessoal aqui..."
                  className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs shadow-md transition-all cursor-pointer"
                >
                  Salvar na Minha Agendinha 💾
                </button>
              </div>
            </form>
          )}

          {/* Search bar inside notes */}
          {myPrivateNotes.length > 0 && (
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Buscar em minhas anotações privadas..."
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          )}

          {/* Notes List */}
          {filteredNotes.length === 0 ? (
            <div className="text-center py-12 px-4 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">
              <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-500 text-2xl">
                🔒
              </div>
              <h4 className="text-base font-bold text-slate-800 dark:text-slate-200">
                Nenhuma anotação privada encontrada
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto mt-1">
                {searchTerm
                  ? 'Nenhum resultado para a busca inserida.'
                  : `Você (${currentProfile.name}) ainda não tem anotações salvas em sua agendinha pessoal. Clique no botão acima para criar a primeira!`}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {filteredNotes.map(note => {
                const colorObj = COLOR_OPTIONS.find(c => c.hex === note.colorTag) || COLOR_OPTIONS[0];

                return (
                  <div
                    key={note.id}
                    className={`p-4 rounded-2xl border transition-all shadow-xs relative flex flex-col justify-between ${
                      note.completed ? 'opacity-65 bg-slate-100 dark:bg-slate-900/40 border-slate-300 dark:border-slate-800' : colorObj.bgClass
                    }`}
                  >
                    <div>
                      {/* Note Header */}
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              soundManager.playPop();
                              onToggleCompleteNote(note.id);
                            }}
                            className="text-slate-400 hover:text-indigo-600 transition-colors cursor-pointer"
                          >
                            {note.completed ? (
                              <CheckCircle className="w-5 h-5 text-emerald-500" />
                            ) : (
                              <Circle className="w-5 h-5" />
                            )}
                          </button>
                          <h4 className={`font-black text-sm text-slate-900 dark:text-white ${note.completed ? 'line-through text-slate-500' : ''}`}>
                            {note.title}
                          </h4>
                        </div>
                        {getCategoryBadge(note.category)}
                      </div>

                      {/* Content */}
                      {note.content && (
                        <p className={`text-xs text-slate-700 dark:text-slate-300 whitespace-pre-wrap mb-3 leading-relaxed pl-7 ${note.completed ? 'line-through opacity-70' : ''}`}>
                          {note.content}
                        </p>
                      )}
                    </div>

                    {/* Note Footer */}
                    <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-200/50 dark:border-slate-800/80 mt-2">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1 font-semibold">
                          <Calendar className="w-3 h-3" /> {note.date}
                        </span>
                        <span className="flex items-center gap-1 font-semibold">
                          <Clock className="w-3 h-3" /> {note.time}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          if (confirm('Deseja apagar esta anotação privada?')) {
                            soundManager.playPop();
                            onDeleteNote(note.id);
                          }
                        }}
                        className="p-1 rounded-lg hover:bg-rose-100 dark:hover:bg-rose-950/80 text-rose-500 transition-colors cursor-pointer"
                        title="Excluir anotação"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-3.5 bg-slate-100 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between flex-wrap gap-2">
          <span className="flex items-center gap-1.5 font-bold text-indigo-600 dark:text-indigo-400">
            <Lock className="w-3.5 h-3.5" /> Suas anotações estão salvas somente para o seu perfil.
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-all cursor-pointer"
          >
            Fechar Agendinha
          </button>
        </div>

      </div>
    </div>
  );
};
