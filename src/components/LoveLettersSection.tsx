import React, { useState } from 'react';
import { Heart, Mail, Plus, Sparkles, Volume2, Camera, Video, Trash2, CheckCircle, Clock } from 'lucide-react';
import { LoveLetter, UserProfile } from '../types';
import { LoveLetterModal } from './LoveLetterModal';
import { NewLoveLetterModal } from './NewLoveLetterModal';
import { soundManager } from '../utils/sound';

interface LoveLettersSectionProps {
  letters: LoveLetter[];
  currentProfile: UserProfile;
  onSendLetter: (letter: Omit<LoveLetter, 'id' | 'createdAt' | 'read'>) => void;
  onMarkRead: (letterId: string) => void;
  onDeleteLetter: (letterId: string) => void;
  speechEnabled: boolean;
}

export const LoveLettersSection: React.FC<LoveLettersSectionProps> = ({
  letters,
  currentProfile,
  onSendLetter,
  onMarkRead,
  onDeleteLetter,
  speechEnabled
}) => {
  const [filter, setFilter] = useState<'all' | 'received' | 'sent'>('all');
  const [selectedLetter, setSelectedLetter] = useState<LoveLetter | null>(null);
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [replyToLetter, setReplyToLetter] = useState<LoveLetter | null>(null);

  const isDhyon = currentProfile.name.toLowerCase().includes('dhyon');
  const myName = isDhyon ? 'Dhyon' : 'Mooniy';

  const filteredLetters = letters.filter(letter => {
    if (filter === 'received') return letter.recipientName === myName;
    if (filter === 'sent') return letter.senderName === myName;
    return true;
  });

  const unreadCount = letters.filter(l => l.recipientName === myName && !l.read).length;

  const handleOpenLetter = (letter: LoveLetter) => {
    soundManager.playPop();
    setSelectedLetter(letter);
  };

  const handleReply = (letter: LoveLetter) => {
    setReplyToLetter(letter);
    setIsComposerOpen(true);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Top Romantic Banner */}
      <div className="relative rounded-3xl bg-linear-to-r from-rose-500 via-pink-500 to-amber-500 text-white p-6 sm:p-8 shadow-xl overflow-hidden">
        <div className="absolute top-0 right-0 transform translate-x-8 -translate-y-8 opacity-20 pointer-events-none">
          <Heart className="w-64 h-64 fill-white" />
        </div>

        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <span className="px-3.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold inline-flex items-center gap-1.5 border border-white/30">
              <Sparkles className="w-3.5 h-3.5 text-amber-200" />
              Espaço do Amor Dhyon & Mooniy
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
              Cartas do Coração 💌
            </h1>
            <p className="text-xs sm:text-sm text-rose-100 max-w-xl">
              Escreva e receba mensagens especiais com gravações de voz, papéis customizados, fotos e ursinhos fofos.
            </p>
          </div>

          <button
            onClick={() => {
              setReplyToLetter(null);
              setIsComposerOpen(true);
            }}
            className="px-5 py-3.5 rounded-2xl bg-white text-rose-600 hover:bg-rose-50 font-black text-sm flex items-center gap-2 shadow-lg hover:scale-[1.03] transition-all cursor-pointer shrink-0"
          >
            <Plus className="w-5 h-5 text-rose-500" />
            Escrever Nova Carta ✉️
          </button>
        </div>
      </div>

      {/* Filter Tabs & Unread Counter */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-2">
          {[
            { id: 'all', label: 'Todas as Cartas' },
            { id: 'received', label: `Recebidas (${letters.filter(l => l.recipientName === myName).length})` },
            { id: 'sent', label: `Enviadas (${letters.filter(l => l.senderName === myName).length})` },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id as 'all' | 'received' | 'sent')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                filter === tab.id
                  ? 'bg-rose-500 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {unreadCount > 0 && (
          <div className="px-3 py-1.5 rounded-xl bg-amber-400/20 text-amber-950 dark:text-amber-300 border border-amber-400/30 text-xs font-bold flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping" />
            Você tem {unreadCount} carta(s) não lida(s)!
          </div>
        )}
      </div>

      {/* Letters Grid */}
      {filteredLetters.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-3">
          <div className="w-16 h-16 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-500 flex items-center justify-center mx-auto">
            <Mail className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">
            Nenhuma carta encontrada
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Que tal surpreender com uma linda declaração de carinho agora mesmo?
          </p>
          <button
            onClick={() => setIsComposerOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-rose-500 text-white font-bold text-xs hover:bg-rose-600 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Heart className="w-4 h-4 fill-white" />
            Criar Carta
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredLetters.map(letter => {
            const isUnread = letter.recipientName === myName && !letter.read;

            return (
              <div
                key={letter.id}
                onClick={() => handleOpenLetter(letter)}
                className={`relative group rounded-3xl p-5 border transition-all duration-300 cursor-pointer flex flex-col justify-between space-y-4 hover:-translate-y-1 ${
                  isUnread
                    ? 'bg-linear-to-b from-rose-50/90 to-amber-50/60 dark:from-rose-950/40 dark:to-slate-900 border-rose-400 dark:border-rose-600 ring-2 ring-rose-400/40 shadow-lg'
                    : 'bg-white dark:bg-slate-900 border-slate-200/90 dark:border-slate-800 hover:border-rose-300 shadow-md'
                }`}
              >
                {/* Top Badge */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-10 h-10 rounded-2xl bg-rose-500 text-white flex items-center justify-center font-bold text-lg shadow-sm shrink-0">
                      {letter.sealIcon === 'bear' ? '🧸' : letter.sealIcon === 'rose' ? '🌹' : letter.sealIcon === 'ring' ? '💍' : letter.sealIcon === 'crown' ? '👑' : letter.sealIcon === 'kiss' ? '💋' : letter.sealIcon === 'scroll' ? '📜' : '💖'}
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1">
                        De: {letter.senderName}
                        {letter.moodEmoji && <span>{letter.moodEmoji}</span>}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        Para: {letter.recipientName}
                      </p>
                    </div>
                  </div>

                  {isUnread ? (
                    <span className="px-2.5 py-1 rounded-full bg-rose-500 text-white text-[10px] font-black uppercase tracking-wider animate-pulse shadow-xs">
                      Nova Carta!
                    </span>
                  ) : (
                    <span className="text-[11px] text-slate-400 font-medium">
                      {letter.date}
                    </span>
                  )}
                </div>

                {/* Card Title & Snippet */}
                <div className="space-y-1">
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors line-clamp-1">
                    {letter.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                    {letter.message}
                  </p>
                </div>

                {/* Attachments Indicator Badges */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
                  <div className="flex items-center gap-2">
                    {letter.audioUrl && (
                      <span className="px-2 py-0.5 rounded-md bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-bold flex items-center gap-1">
                        <Volume2 className="w-3 h-3 text-purple-500" /> Voice
                      </span>
                    )}
                    {letter.photoUrl && (
                      <span className="px-2 py-0.5 rounded-md bg-pink-100 dark:bg-pink-950 text-pink-700 dark:text-pink-300 font-bold flex items-center gap-1">
                        <Camera className="w-3 h-3 text-pink-500" /> Foto
                      </span>
                    )}
                    {letter.videoUrl && (
                      <span className="px-2 py-0.5 rounded-md bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 font-bold flex items-center gap-1">
                        <Video className="w-3 h-3 text-rose-500" /> Vídeo
                      </span>
                    )}
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm('Deseja apagar esta carta?')) {
                        onDeleteLetter(letter.id);
                      }
                    }}
                    className="p-1.5 rounded-lg hover:bg-rose-100 dark:hover:bg-rose-950 text-slate-400 hover:text-rose-600 transition-colors"
                    title="Excluir carta"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Selected Letter View Modal */}
      {selectedLetter && (
        <LoveLetterModal
          letter={selectedLetter}
          onClose={() => setSelectedLetter(null)}
          onMarkRead={onMarkRead}
          onOpenReply={handleReply}
          speechEnabled={speechEnabled}
        />
      )}

      {/* Composer Modal */}
      {isComposerOpen && (
        <NewLoveLetterModal
          currentProfile={currentProfile}
          onClose={() => {
            setIsComposerOpen(false);
            setReplyToLetter(null);
          }}
          onSendLetter={onSendLetter}
          replyToLetter={replyToLetter}
        />
      )}

    </div>
  );
};
