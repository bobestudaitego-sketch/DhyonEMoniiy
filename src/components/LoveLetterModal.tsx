import React, { useState, useEffect } from 'react';
import { Heart, X, Sparkles, Volume2, Play, Pause, Video, Camera, Mic, Share2, Mail, CheckCircle2, Lock, Trash2 } from 'lucide-react';
import { LoveLetter, UserProfile } from '../types';
import { soundManager } from '../utils/sound';

interface LoveLetterModalProps {
  letter: LoveLetter;
  onClose: () => void;
  onMarkRead: (letterId: string) => void;
  onOpenReply?: (letter: LoveLetter) => void;
  onDeleteLetter?: (letterId: string) => void;
  speechEnabled: boolean;
  isAutoPopup?: boolean;
}

export const LoveLetterModal: React.FC<LoveLetterModalProps> = ({
  letter,
  onClose,
  onMarkRead,
  onOpenReply,
  onDeleteLetter,
  speechEnabled,
  isAutoPopup = false
}) => {
  const [isOpenAnimation, setIsOpenAnimation] = useState(false);
  const [isOpeningProcess, setIsOpeningProcess] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (letter.audioUrl) {
      const audio = new Audio(letter.audioUrl);
      audio.onended = () => setIsPlayingAudio(false);
      audio.onerror = () => setIsPlayingAudio(false);
      setAudioElement(audio);
      return () => {
        audio.pause();
      };
    }
  }, [letter.audioUrl]);

  const handleOpenEnvelope = () => {
    if (isOpeningProcess) return;
    setIsOpeningProcess(true);
    soundManager.playRomanticHarp();
    onMarkRead(letter.id);

    // Short timeout for opening animation feedback
    setTimeout(() => {
      setIsOpenAnimation(true);
      setIsOpeningProcess(false);
    }, 450);
  };

  const toggleAudio = () => {
    if (!audioElement) return;
    if (isPlayingAudio) {
      audioElement.pause();
      setIsPlayingAudio(false);
    } else {
      soundManager.playPop();
      audioElement.play().catch(() => {});
      setIsPlayingAudio(true);
    }
  };

  // Font color helper style
  const getFontColorStyle = (): React.CSSProperties => {
    switch (letter.fontColor) {
      case 'white': return { color: '#ffffff' };
      case 'black': return { color: '#000000' };
      case 'crimson': return { color: '#9f1239' };
      case 'sepia': return { color: '#582f0e' };
      case 'purple': return { color: '#581c87' };
      case 'gold': return { color: '#854d0e' };
      case 'midnight': return { color: '#0f172a' };
      case 'rose': return { color: '#be123c' };
      case 'charcoal': return { color: '#334155' };
      case 'emerald': return { color: '#065f46' };
      case 'navy': return { color: '#1e3a8a' };
      default: return {};
    }
  };

  // Font color helper class
  const getFontColorClass = () => {
    switch (letter.fontColor) {
      case 'crimson': return 'text-letter-crimson dark:text-rose-300';
      case 'sepia': return 'text-letter-sepia dark:text-amber-200';
      case 'purple': return 'text-letter-purple dark:text-purple-300';
      case 'gold': return 'text-letter-gold dark:text-amber-300';
      case 'midnight': return 'text-letter-midnight dark:text-slate-100';
      case 'rose': return 'text-letter-rose dark:text-pink-300';
      case 'charcoal': return 'text-letter-charcoal dark:text-slate-200';
      case 'white': return 'text-white';
      case 'black': return 'text-slate-950';
      case 'emerald': return 'text-emerald-800 dark:text-emerald-300';
      case 'navy': return 'text-blue-900 dark:text-blue-200';
      default:
        if (letter.paperStyle === 'parchment') return 'text-amber-950 dark:text-amber-100';
        return 'text-slate-900 dark:text-white';
    }
  };

  // Helper styles based on letter paper & background color
  const getPaperStyles = () => {
    if (letter.bgColor) {
      switch (letter.bgColor) {
        case 'white':
          return 'bg-white text-slate-900 border-slate-300 shadow-2xl animate-unfold';
        case 'dark_black':
          return 'bg-slate-950 text-white border-amber-500/80 shadow-2xl animate-unfold';
        case 'rose_pink':
          return 'bg-linear-to-b from-rose-100 via-pink-100 to-rose-200 text-slate-900 border-rose-300 shadow-2xl animate-unfold';
        case 'romantic_red':
          return 'bg-linear-to-b from-rose-900 via-red-900 to-rose-950 text-white border-rose-500 shadow-2xl animate-unfold';
        case 'lavender_purple':
          return 'bg-linear-to-b from-purple-100 via-indigo-100 to-purple-200 text-slate-900 border-purple-300 shadow-2xl animate-unfold';
        case 'golden_amber':
          return 'bg-linear-to-b from-amber-100 via-yellow-100 to-amber-200 text-amber-950 border-amber-400 shadow-2xl animate-unfold';
        case 'emerald_green':
          return 'bg-linear-to-b from-teal-900 via-emerald-900 to-slate-900 text-white border-teal-400 shadow-2xl animate-unfold';
        case 'midnight_blue':
          return 'bg-linear-to-b from-slate-900 via-indigo-950 to-slate-950 text-white border-indigo-400 shadow-2xl animate-unfold';
        case 'sweet_peach':
          return 'bg-linear-to-b from-orange-100 via-amber-100 to-rose-100 text-slate-900 border-orange-300 shadow-2xl animate-unfold';
        case 'vintage_parchment':
        default:
          return 'bg-parchment text-amber-950 border-amber-400/80 dark:border-amber-700 shadow-2xl animate-unroll-parchment';
      }
    }
    switch (letter.paperStyle) {
      case 'parchment':
        return 'bg-parchment text-amber-950 border-amber-400/80 dark:border-amber-700 shadow-2xl animate-unroll-parchment';
      case 'teddy_bear':
        return 'bg-linear-to-b from-pink-100/90 via-rose-50 to-amber-50 text-slate-800 border-pink-300 shadow-2xl animate-unfold';
      case 'heart_seal':
        return 'bg-linear-to-b from-rose-500/10 via-pink-500/5 to-white dark:to-slate-900 text-slate-900 dark:text-white border-rose-400 dark:border-rose-900 shadow-2xl animate-unfold';
      default: // classic_envelope
        return 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white border-rose-300 dark:border-slate-800 shadow-2xl animate-envelope-slide';
    }
  };

  // Font family helper
  const getFontClass = () => {
    switch (letter.fontFamily) {
      case 'dancing': return 'font-dancing text-xl sm:text-2xl leading-relaxed';
      case 'caveat': return 'font-caveat text-2xl sm:text-3xl leading-snug';
      case 'playfair': return 'font-playfair text-lg sm:text-xl leading-relaxed';
      case 'pacifico': return 'font-pacifico text-lg sm:text-xl leading-loose';
      default: return 'font-sans text-base leading-relaxed';
    }
  };

  // Theme accent colors
  const getThemeBadge = () => {
    switch (letter.themeColor) {
      case 'crimson': return 'bg-red-500 text-white';
      case 'lavender': return 'bg-purple-500 text-white';
      case 'golden': return 'bg-amber-500 text-slate-950';
      case 'emerald': return 'bg-teal-600 text-white';
      default: return 'bg-rose-500 text-white';
    }
  };

  // Extract YouTube ID if present
  const getYouTubeEmbedUrl = (url?: string) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}` : null;
  };

  const youtubeEmbed = getYouTubeEmbedUrl(letter.videoUrl);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fade-in">
      
      {!isOpenAnimation ? (
        /* REALISTIC CLOSED ENVELOPE / CLOSED PARCHMENT SCROLL */
        <div className="relative max-w-md sm:max-w-lg w-full flex flex-col items-center justify-center space-y-6 animate-scale-up">
          
          <button
            onClick={onClose}
            className="absolute -top-12 right-0 p-2.5 rounded-full bg-slate-800/90 hover:bg-rose-600 text-white transition-all cursor-pointer shadow-lg border border-slate-700"
            title="Fechar"
          >
            <X className="w-5 h-5" />
          </button>

          {letter.paperStyle === 'parchment' ? (
            /* CLOSED PARCHMENT SCROLL VISUAL */
            <div
              onClick={handleOpenEnvelope}
              className={`relative w-full rounded-3xl bg-parchment p-6 border-4 border-amber-900/40 shadow-2xl cursor-pointer hover:scale-[1.02] transition-all duration-300 group overflow-hidden ${
                isOpeningProcess ? 'scale-95 opacity-80' : ''
              }`}
            >
              {/* Top Wooden Rod Handle */}
              <div className="w-full h-7 bg-gradient-to-r from-amber-950 via-amber-800 to-amber-950 rounded-t-xl border-b border-amber-950 shadow-md flex items-center justify-between px-4">
                <span className="w-3 h-3 rounded-full bg-amber-400/80 shadow-xs" />
                <span className="text-[10px] font-serif font-black tracking-widest text-amber-200">PERGAMINHO DE AMOR</span>
                <span className="w-3 h-3 rounded-full bg-amber-400/80 shadow-xs" />
              </div>

              {/* Rolled Scroll Parchment Body */}
              <div className="py-10 px-6 text-center space-y-4 relative flex flex-col items-center">
                
                {/* Red Silk Ribbon tied around scroll center */}
                <div className="w-full h-8 bg-gradient-to-r from-rose-800 via-rose-600 to-rose-800 border-y-2 border-amber-400 shadow-md flex items-center justify-center relative my-2">
                  <div className="absolute -top-3 w-10 h-10 rounded-full bg-amber-500 border-2 border-amber-200 text-slate-950 flex items-center justify-center text-xl shadow-lg group-hover:rotate-12 transition-transform">
                    {letter.sealIcon === 'bear' ? '🧸' : letter.sealIcon === 'rose' ? '🌹' : letter.sealIcon === 'ring' ? '💍' : letter.sealIcon === 'crown' ? '👑' : letter.sealIcon === 'kiss' ? '💋' : '📜'}
                  </div>
                </div>

                <div className="pt-3 space-y-1">
                  <span className="text-xs font-serif font-bold text-amber-900/80 uppercase tracking-wider block">
                    {letter.date}
                  </span>
                  <h3 className="text-2xl font-serif font-black text-amber-950 flex items-center justify-center gap-2">
                    {letter.title}
                    {letter.moodEmoji && <span>{letter.moodEmoji}</span>}
                  </h3>
                  <p className="text-sm font-serif italic text-amber-900">
                    De: <strong className="text-rose-800">{letter.senderName}</strong> • Para: <strong className="text-rose-800">{letter.recipientName}</strong>
                  </p>
                </div>

                <div className="pt-2">
                  <span className="px-5 py-2.5 rounded-full bg-amber-900 text-amber-100 font-bold text-xs flex items-center gap-2 shadow-md group-hover:bg-rose-800 transition-colors">
                    <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
                    Toque para Desenrolar o Pergaminho 📜
                  </span>
                </div>

              </div>

              {/* Bottom Wooden Rod Handle */}
              <div className="w-full h-7 bg-gradient-to-r from-amber-950 via-amber-800 to-amber-950 rounded-b-xl border-t border-amber-950 shadow-md flex items-center justify-between px-4">
                <span className="w-3 h-3 rounded-full bg-amber-400/80 shadow-xs" />
                <span className="text-[10px] font-serif font-black tracking-widest text-amber-200">SELADO À MÃO</span>
                <span className="w-3 h-3 rounded-full bg-amber-400/80 shadow-xs" />
              </div>
            </div>
          ) : (
            /* REALISTIC PHYSICAL ENVELOPE VISUAL */
            <div
              onClick={handleOpenEnvelope}
              className={`relative w-full rounded-3xl bg-linear-to-b from-rose-100 via-rose-50 to-pink-100 dark:from-slate-900 dark:via-slate-850 dark:to-rose-950 p-6 border-4 border-rose-300/80 dark:border-rose-900/60 shadow-2xl cursor-pointer hover:scale-[1.02] transition-all duration-300 group overflow-hidden perspective-1000 ${
                isOpeningProcess ? 'scale-95 opacity-80' : ''
              }`}
            >
              {/* Triangular Flap Top Accent */}
              <div className={`w-full h-16 bg-linear-to-b from-rose-200 to-rose-300 dark:from-rose-950 dark:to-slate-900 rounded-t-2xl border-b-2 border-rose-400/60 shadow-inner flex items-center justify-center relative ${isOpeningProcess ? 'animate-open-flap' : ''}`}>
                <div className="w-12 h-1 bg-rose-400/50 rounded-full my-auto" />
              </div>

              {/* Envelope Body Content */}
              <div className="p-6 text-center space-y-6">
                
                {/* Stamp & Air Mail Badge */}
                <div className="flex items-center justify-between border-b border-rose-200/80 dark:border-slate-800 pb-3">
                  <span className="px-2.5 py-1 rounded-md bg-rose-500/10 text-rose-600 dark:text-rose-300 text-[10px] font-black uppercase tracking-widest border border-rose-300/40">
                    AIR MAIL • EDICÃO ESPECIAL 💌
                  </span>

                  {/* Postage Stamp */}
                  <div className="w-10 h-12 bg-rose-500 text-white rounded-md border-2 border-dashed border-rose-200 shadow-xs flex flex-col items-center justify-center p-1">
                    <Heart className="w-4 h-4 fill-white" />
                    <span className="text-[8px] font-bold mt-0.5">LOVE</span>
                  </div>
                </div>

                {/* Wax Seal Badge Centerpiece */}
                <div className="relative flex justify-center my-2">
                  <div className="absolute inset-0 rounded-full bg-rose-500/30 blur-xl animate-pulse" />
                  <div className="relative w-20 h-20 rounded-full bg-gradient-to-tr from-rose-700 via-rose-500 to-amber-400 p-1 shadow-xl group-hover:scale-110 transition-transform animate-seal-pulse flex items-center justify-center">
                    <div className="w-full h-full rounded-full bg-rose-800 text-amber-200 flex flex-col items-center justify-center border-2 border-amber-300/70 shadow-inner">
                      {letter.sealIcon === 'bear' ? (
                        <span className="text-3xl">🧸</span>
                      ) : letter.sealIcon === 'rose' ? (
                        <span className="text-3xl">🌹</span>
                      ) : letter.sealIcon === 'ring' ? (
                        <span className="text-3xl">💍</span>
                      ) : letter.sealIcon === 'crown' ? (
                        <span className="text-3xl">👑</span>
                      ) : letter.sealIcon === 'kiss' ? (
                        <span className="text-3xl">💋</span>
                      ) : letter.sealIcon === 'scroll' ? (
                        <span className="text-3xl">📜</span>
                      ) : (
                        <Heart className="w-9 h-9 fill-amber-200" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Postal Addressing Lines */}
                <div className="p-4 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-rose-200/60 dark:border-slate-800 shadow-inner text-left space-y-1">
                  <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    DESTINATÁRIO(A):
                  </div>
                  <div className="text-base sm:text-lg font-black text-rose-700 dark:text-rose-400 flex items-center justify-between">
                    <span>{letter.recipientName}</span>
                    {letter.moodEmoji && <span className="text-xl">{letter.moodEmoji}</span>}
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-400">
                    Remetente: <strong className="text-slate-900 dark:text-white">{letter.senderName}</strong> • {letter.date}
                  </div>
                </div>

                {/* Call to action button */}
                <button
                  type="button"
                  onClick={handleOpenEnvelope}
                  className="w-full py-3.5 rounded-2xl bg-linear-to-r from-rose-500 via-pink-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg hover:shadow-rose-500/25 transition-all cursor-pointer"
                >
                  <Heart className="w-4 h-4 fill-white" />
                  Toque no Lacre para Abrir a Carta 💌
                </button>

              </div>
            </div>
          )}

        </div>
      ) : (
        /* OPENED LETTER DISPLAY */
        <div className={`relative max-w-2xl w-full rounded-3xl border overflow-hidden shadow-2xl transition-all ${getPaperStyles()}`}>
          
          {/* Parchment Top Wood Roller Handle */}
          {letter.paperStyle === 'parchment' && (
            <div className="w-full py-2.5 px-6 bg-gradient-to-r from-amber-950 via-amber-800 to-amber-950 text-amber-100 flex items-center justify-between border-b-2 border-amber-950 shadow-md">
              <span className="text-xs font-serif font-black tracking-widest flex items-center gap-2">
                📜 PERGAMINHO REAL DE AMOR 📜
              </span>
              <span className="text-sm">✨</span>
            </div>
          )}

          {/* Envelope Top Triangular Flap Accent for Classic Envelope */}
          {letter.paperStyle === 'classic_envelope' && (
            <div className="w-full h-4 bg-linear-to-r from-rose-200 via-rose-300 to-pink-200 dark:from-rose-950 dark:via-pink-900 dark:to-slate-900 border-b border-rose-300/40" />
          )}

          <div className="p-6 sm:p-8 space-y-6">

            {/* Top Bar Actions */}
            <div className="flex items-center justify-between gap-2 border-b border-rose-200/50 dark:border-slate-800 pb-4 mb-2">
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-xs ${getThemeBadge()}`}>
                  <Heart className="w-3.5 h-3.5 fill-current" />
                  {letter.paperStyle === 'teddy_bear' ? 'Cartão de Ursinho 🧸' : letter.paperStyle === 'parchment' ? 'Pergaminho Antigo 📜' : 'Carta de Amor 💌'}
                </span>
                {letter.moodEmoji && (
                  <span className="text-base" title="Emoção da Carta">
                    {letter.moodEmoji}
                  </span>
                )}
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  {letter.date}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {speechEnabled && (
                  <button
                    onClick={() => soundManager.speak(`${letter.title}. De ${letter.senderName}. ${letter.message}`)}
                    className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-rose-100 text-slate-700 dark:text-slate-200 hover:text-rose-600 transition-colors cursor-pointer"
                    title="Ouvir carta em voz alta"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-rose-500 text-slate-700 dark:text-slate-200 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Header / Seal emblem */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-500 text-white flex items-center justify-center text-2xl font-bold shadow-md shrink-0">
                {letter.sealIcon === 'bear' ? '🧸' : letter.sealIcon === 'rose' ? '🌹' : letter.sealIcon === 'ring' ? '💍' : letter.sealIcon === 'crown' ? '👑' : letter.sealIcon === 'kiss' ? '💋' : letter.sealIcon === 'scroll' ? '📜' : '💖'}
              </div>
              <div>
                <h2 className={`text-xl sm:text-2xl font-extrabold flex items-center gap-2 ${getFontColorClass()}`}>
                  {letter.title}
                  {letter.moodEmoji && <span>{letter.moodEmoji}</span>}
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium">
                  Com todo amor de <strong className="text-rose-600 dark:text-rose-400">{letter.senderName}</strong> para <strong className="text-rose-600 dark:text-rose-400">{letter.recipientName}</strong>
                </p>
              </div>
            </div>

            {/* Audio Recording Player if present */}
            {letter.audioUrl && (
              <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-300 dark:border-rose-800/60 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <button
                    onClick={toggleAudio}
                    className="w-12 h-12 rounded-full bg-rose-500 hover:bg-rose-600 text-white flex items-center justify-center shadow-md transition-all cursor-pointer shrink-0"
                  >
                    {isPlayingAudio ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                  </button>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1">
                      <Mic className="w-3.5 h-3.5 text-rose-500" />
                      Mensagem de Voz Gravada
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {isPlayingAudio ? 'Reproduzindo áudio do amor...' : 'Toque no play para ouvir a voz'}
                    </p>
                  </div>
                </div>

                {/* Animated wave */}
                <div className="flex items-center gap-1">
                  {[40, 70, 30, 90, 60, 40].map((h, i) => (
                    <span
                      key={i}
                      className={`w-1 rounded-full bg-rose-500 transition-all ${isPlayingAudio ? 'animate-pulse' : 'opacity-40'}`}
                      style={{ height: `${isPlayingAudio ? h / 2 + 10 : 12}px` }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Main Message Content with Font Styling & Selected Color */}
            <div
              className={`p-6 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/50 dark:border-slate-800 shadow-inner ${getFontClass()} ${getFontColorClass()}`}
              style={getFontColorStyle()}
            >
              <p className="whitespace-pre-wrap">{letter.message}</p>
            </div>

            {/* Photo Attachment */}
            {letter.photoUrl && (
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-600 dark:text-slate-400 flex items-center gap-1">
                  <Camera className="w-3.5 h-3.5 text-rose-500" />
                  Foto Especial em Anexo:
                </span>
                <div className="rounded-2xl overflow-hidden border-4 border-white dark:border-slate-800 shadow-lg bg-slate-100 max-h-72 flex items-center justify-center">
                  <img
                    src={letter.photoUrl}
                    alt="Foto da carta"
                    className="w-full h-full object-cover max-h-72"
                  />
                </div>
              </div>
            )}

            {/* Video Attachment */}
            {letter.videoUrl && (
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-600 dark:text-slate-400 flex items-center gap-1">
                  <Video className="w-3.5 h-3.5 text-rose-500" />
                  Vídeo do Casal / Lembrança:
                </span>
                {youtubeEmbed ? (
                  <div className="aspect-video rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-md">
                    <iframe
                      src={youtubeEmbed}
                      title="Vídeo de amor"
                      className="w-full h-full"
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <a
                    href={letter.videoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 text-rose-600 text-xs font-bold flex items-center gap-2 transition-colors border border-rose-200"
                  >
                    <Video className="w-4 h-4" />
                    Assistir ao Vídeo Anexado
                  </a>
                )}
              </div>
            )}

            {/* Footer / Reply actions */}
            <div className="pt-4 border-t border-rose-200/50 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                Guardada com muito amor no aplicativo
              </span>

              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setIsOpenAnimation(false)}
                  className="flex-1 sm:flex-none px-3.5 py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-700/60 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                  title="Guardar de volta no formato fechado"
                >
                  <Lock className="w-3.5 h-3.5" />
                  {letter.paperStyle === 'parchment' ? 'Enrolar Pergaminho 📜' : 'Guardar no Envelope ✉️'}
                </button>

                {onOpenReply && (
                  <button
                    onClick={() => {
                      onClose();
                      onOpenReply(letter);
                    }}
                    className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md cursor-pointer transition-all"
                  >
                    <Mail className="w-4 h-4" />
                    Responder 💌
                  </button>
                )}

                {onDeleteLetter && (
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm('Deseja realmente apagar esta carta de amor?')) {
                        soundManager.playPop();
                        onDeleteLetter(letter.id);
                        onClose();
                      }
                    }}
                    className="flex-1 sm:flex-none px-3 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/60 dark:hover:bg-rose-900 text-rose-700 dark:text-rose-300 font-bold text-xs flex items-center justify-center gap-1.5 border border-rose-200 dark:border-rose-800 cursor-pointer transition-colors"
                    title="Excluir esta carta"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                    Apagar Carta
                  </button>
                )}

                <button
                  onClick={onClose}
                  className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs cursor-pointer hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
                >
                  Fechar
                </button>
              </div>
            </div>

          </div>

          {/* Parchment Bottom Wood Roller Handle */}
          {letter.paperStyle === 'parchment' && (
            <div className="w-full py-2 bg-gradient-to-r from-amber-950 via-amber-800 to-amber-950 text-amber-200 text-[11px] font-serif font-bold text-center border-t-2 border-amber-950 shadow-inner">
              ✨ Selado com Amor e Carinho Eterno ✨
            </div>
          )}

        </div>
      )}

    </div>
  );
};
