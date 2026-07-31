import React, { useState, useRef } from 'react';
import { Heart, X, Sparkles, Mic, Square, Play, Pause, Camera, Video, Type, Palette, FileText, Check, Music, Eye, Smile } from 'lucide-react';
import { LoveLetter, LetterPaperStyle, LetterFontFamily, LetterThemeColor, LetterFontColor, LetterBgColor, UserProfile } from '../types';
import { LoveLetterModal } from './LoveLetterModal';
import { soundManager } from '../utils/sound';

interface NewLoveLetterModalProps {
  currentProfile: UserProfile;
  onClose: () => void;
  onSendLetter: (letter: Omit<LoveLetter, 'id' | 'createdAt' | 'read'>) => void;
  replyToLetter?: LoveLetter | null;
}

export const NewLoveLetterModal: React.FC<NewLoveLetterModalProps> = ({
  currentProfile,
  onClose,
  onSendLetter,
  replyToLetter
}) => {
  // Sender / Recipient logic
  const isDhyon = currentProfile.name.toLowerCase().includes('dhyon');
  const defaultSender = isDhyon ? 'Dhyon' : 'Mooniy';
  const defaultRecipient = isDhyon ? 'Mooniy' : 'Dhyon';

  const [senderName, setSenderName] = useState(defaultSender);
  const [recipientName, setRecipientName] = useState(defaultRecipient);
  const [title, setTitle] = useState(replyToLetter ? `Resposta para: ${replyToLetter.title}` : 'Para o Meu Grande Amor 💖');
  const [message, setMessage] = useState('');
  
  // Customizations
  const [paperStyle, setPaperStyle] = useState<LetterPaperStyle>('parchment');
  const [fontFamily, setFontFamily] = useState<LetterFontFamily>('dancing');
  const [themeColor, setThemeColor] = useState<LetterThemeColor>('rose');
  const [fontColor, setFontColor] = useState<LetterFontColor>('black');
  const [bgColor, setBgColor] = useState<LetterBgColor>('rose_pink');
  const [moodEmoji, setMoodEmoji] = useState<string>('🥰');
  const [sealIcon, setSealIcon] = useState<'heart' | 'bear' | 'sparkle' | 'rose' | 'ring' | 'crown' | 'kiss' | 'scroll'>('scroll');
  
  // Attachments
  const [photoUrl, setPhotoUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [audioUrl, setAudioUrl] = useState('');

  // Preview state
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  // Voice recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlobUrl, setAudioBlobUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const timerRef = useRef<number | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Emoji picker list for love letters
  const LOVE_EMOJIS = ['🥰', '🧸', '💖', '🌹', '👑', '💍', '💋', '💌', '😍', '🥺', '✨', '💐', '🔥', '⭐', '🎶', '🕊️', '📜', '⭐', '❤️‍🔥'];

  const FONT_COLOR_OPTIONS: { id: LetterFontColor; label: string; color: string; border?: string }[] = [
    { id: 'white', label: 'Branco Neve ⚪', color: '#ffffff', border: '#cbd5e1' },
    { id: 'black', label: 'Preto Intenso ⚫', color: '#000000' },
    { id: 'crimson', label: 'Vermelho Carmim 🔴', color: '#9f1239' },
    { id: 'rose', label: 'Rosa Chiclete 💖', color: '#be123c' },
    { id: 'purple', label: 'Roxo Romântico 💜', color: '#581c87' },
    { id: 'gold', label: 'Dourado Reluzente 💛', color: '#854d0e' },
    { id: 'sepia', label: 'Sépia Pergaminho 📜', color: '#582f0e' },
    { id: 'midnight', label: 'Azul Noturno 🌙', color: '#0f172a' },
    { id: 'navy', label: 'Azul Marinho ⚓', color: '#1e3a8a' },
    { id: 'charcoal', label: 'Grafite Nobre ✏️', color: '#334155' },
    { id: 'emerald', label: 'Verde Esmeralda 💚', color: '#065f46' },
  ];

  const BG_COLOR_OPTIONS: { id: LetterBgColor; label: string; colorDot: string; darkText?: boolean }[] = [
    { id: 'rose_pink', label: '💖 Rosa Romântico', colorDot: '#f43f5e', darkText: true },
    { id: 'white', label: '⚪ Branco Neve', colorDot: '#ffffff', darkText: true },
    { id: 'dark_black', label: '⚫ Preto Noturno', colorDot: '#090d16' },
    { id: 'romantic_red', label: '❤️ Vermelho Paixão', colorDot: '#dc2626' },
    { id: 'lavender_purple', label: '💜 Roxo Lavanda', colorDot: '#a855f7', darkText: true },
    { id: 'golden_amber', label: '💛 Dourado Vintage', colorDot: '#f59e0b', darkText: true },
    { id: 'emerald_green', label: '💚 Verde Esmeralda', colorDot: '#10b981' },
    { id: 'midnight_blue', label: '💙 Azul Noturno', colorDot: '#1e293b' },
    { id: 'vintage_parchment', label: '📜 Pergaminho Clássico', colorDot: '#d97706', darkText: true },
    { id: 'sweet_peach', label: '🍑 Pêssego Suave', colorDot: '#fb923c', darkText: true },
  ];

  const insertEmoji = (emoji: string) => {
    soundManager.playPop();
    setMessage(prev => prev + emoji);
  };

  // Start voice recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
          const base64Audio = reader.result as string;
          setAudioBlobUrl(base64Audio);
          setAudioUrl(base64Audio);
        };
        // Stop audio tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      timerRef.current = window.setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch {
      alert('Não foi possível acessar o microfone para gravar a voz.');
    }
  };

  // Stop voice recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      alert('Por favor, escreva uma mensagem com carinho na carta!');
      return;
    }

    soundManager.playRomanticHarp();

    onSendLetter({
      senderName,
      senderRole: senderName === 'Dhyon' ? 'user' : 'helper',
      recipientName,
      recipientRole: recipientName === 'Mooniy' ? 'helper' : 'user',
      title: title.trim() || 'Carta de Amor 💖',
      message: message.trim(),
      paperStyle,
      fontFamily,
      themeColor,
      fontColor,
      bgColor,
      moodEmoji,
      sealIcon,
      photoUrl: photoUrl.trim() || undefined,
      videoUrl: videoUrl.trim() || undefined,
      audioUrl: audioUrl.trim() || undefined,
      date: new Date().toLocaleDateString('pt-BR')
    });

    onClose();
  };

  // Font class helper for preview
  const getFontPreviewClass = (f: LetterFontFamily) => {
    switch (f) {
      case 'dancing': return 'font-dancing';
      case 'caveat': return 'font-caveat';
      case 'playfair': return 'font-playfair';
      case 'pacifico': return 'font-pacifico';
      default: return 'font-sans';
    }
  };

  const getFontColorStyle = (c: LetterFontColor): React.CSSProperties => {
    switch (c) {
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
      default: return { color: '#000000' };
    }
  };

  const getBgColorClass = (bg: LetterBgColor) => {
    switch (bg) {
      case 'white': return 'bg-white border-slate-300 shadow-sm';
      case 'dark_black': return 'bg-slate-950 border-slate-800 text-white shadow-md';
      case 'rose_pink': return 'bg-gradient-to-br from-rose-100 via-pink-100 to-rose-200 border-rose-300 shadow-sm';
      case 'romantic_red': return 'bg-gradient-to-br from-rose-900 via-red-900 to-rose-950 border-rose-500 text-white shadow-md';
      case 'lavender_purple': return 'bg-gradient-to-br from-purple-100 via-indigo-100 to-purple-200 border-purple-300 shadow-sm';
      case 'golden_amber': return 'bg-gradient-to-br from-amber-100 via-yellow-100 to-amber-200 border-amber-400 shadow-sm';
      case 'emerald_green': return 'bg-gradient-to-br from-teal-900 via-emerald-900 to-slate-900 border-teal-500 text-white shadow-md';
      case 'midnight_blue': return 'bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 border-indigo-500 text-white shadow-md';
      case 'sweet_peach': return 'bg-gradient-to-br from-orange-100 via-amber-100 to-rose-100 border-orange-300 shadow-sm';
      case 'vintage_parchment':
      default: return 'bg-parchment border-amber-400 shadow-sm';
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fade-in">
      <div className="relative max-w-3xl w-full bg-white dark:bg-slate-900 rounded-3xl border border-rose-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 my-8 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-rose-100 dark:border-slate-800 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-500 text-white flex items-center justify-center shadow-md">
              <Heart className="w-5 h-5 fill-white" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                Criar Carta ou Pergaminho do Amor
                <Sparkles className="w-4 h-4 text-amber-500" />
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Personalize papéis, pergaminhos, cores da fonte, emojis, fotos, vídeos e gravação de voz
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-rose-500 text-slate-700 dark:text-slate-200 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleFormSubmit} className="space-y-6">
          
          {/* Sender & Recipient Pickers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">De (Remetente):</label>
              <select
                value={senderName}
                onChange={e => {
                  setSenderName(e.target.value);
                  setRecipientName(e.target.value === 'Dhyon' ? 'Mooniy' : 'Dhyon');
                }}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-bold text-slate-900 dark:text-white"
              >
                <option value="Dhyon">Dhyon 💖</option>
                <option value="Mooniy">Mooniy 🧸</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Para (Destinatário):</label>
              <select
                value={recipientName}
                onChange={e => setRecipientName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-bold text-slate-900 dark:text-white"
              >
                <option value="Mooniy">Mooniy 🧸</option>
                <option value="Dhyon">Dhyon 💖</option>
              </select>
            </div>
          </div>

          {/* Style Customizer Tabs */}
          <div className="p-4 rounded-2xl bg-rose-50/50 dark:bg-slate-800/50 border border-rose-200/60 dark:border-slate-700 space-y-5">
            
            {/* 1. Paper Style Choice */}
            <div>
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 mb-2">
                <FileText className="w-4 h-4 text-rose-500" />
                Estilo da Carta / Formato do Pergaminho:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'parchment', label: 'Pergaminho Antigo 📜' },
                  { id: 'classic_envelope', label: 'Envelope Clássico ✉️' },
                  { id: 'teddy_bear', label: 'Ursinho Fofo 🧸' },
                  { id: 'heart_seal', label: 'Super Coração 💖' },
                ].map(item => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setPaperStyle(item.id as LetterPaperStyle)}
                    className={`p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer text-center ${
                      paperStyle === item.id
                        ? 'bg-rose-500 text-white border-rose-600 shadow-sm scale-[1.02]'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-rose-100/50'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Font Choice */}
            <div>
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 mb-2">
                <Type className="w-4 h-4 text-rose-500" />
                Estilo da Fonte da Carta:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {[
                  { id: 'dancing', label: 'Dancing (Romântica)' },
                  { id: 'caveat', label: 'Caveat (Manuscrita)' },
                  { id: 'playfair', label: 'Playfair (Elegante)' },
                  { id: 'pacifico', label: 'Pacifico (Divertida)' },
                  { id: 'sans', label: 'Padrão (Limpa)' },
                ].map(item => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setFontFamily(item.id as LetterFontFamily)}
                    className={`p-2 rounded-xl border text-xs font-bold transition-all cursor-pointer text-center ${getFontPreviewClass(item.id as LetterFontFamily)} ${
                      fontFamily === item.id
                        ? 'bg-indigo-600 text-white border-indigo-700 shadow-sm'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Font Color Choice */}
            <div>
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 mb-2">
                <Palette className="w-4 h-4 text-rose-500" />
                Cor da Fonte da Carta (Texto):
              </label>
              <div className="flex flex-wrap gap-2">
                {FONT_COLOR_OPTIONS.map(item => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setFontColor(item.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all cursor-pointer ${
                      fontColor === item.id
                        ? 'ring-2 ring-rose-500 border-rose-500 bg-white dark:bg-slate-900 font-extrabold shadow-xs scale-105'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-rose-50/50'
                    }`}
                  >
                    <span
                      className="w-4 h-4 rounded-full border border-slate-300 shadow-2xs shrink-0"
                      style={{ backgroundColor: item.color, borderColor: item.border || item.color }}
                    />
                    <span style={{ color: item.id === 'white' ? '#475569' : item.color }}>{item.label}</span>
                    {fontColor === item.id && <Check className="w-3.5 h-3.5 text-rose-500 ml-auto" />}
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Letter Background Color Choice */}
            <div>
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 mb-2">
                <Palette className="w-4 h-4 text-indigo-500" />
                Cor do Fundo da Carta (Papel/Cartão):
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {BG_COLOR_OPTIONS.map(item => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setBgColor(item.id)}
                    className={`p-2 rounded-xl border text-xs font-bold flex items-center justify-between gap-1.5 transition-all cursor-pointer ${
                      bgColor === item.id
                        ? 'ring-2 ring-indigo-500 border-indigo-500 bg-white dark:bg-slate-900 shadow-xs font-black scale-[1.02]'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-indigo-50/50'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 truncate">
                      <span className="w-3.5 h-3.5 rounded-full shrink-0 border border-slate-300 shadow-2xs" style={{ backgroundColor: item.colorDot }} />
                      <span className="truncate">{item.label}</span>
                    </div>
                    {bgColor === item.id && <Check className="w-3.5 h-3.5 text-indigo-600 shrink-0" />}
                  </button>
                ))}
              </div>
            </div>

            {/* 5. Theme Color Choice (Envelope Accent) */}
            <div>
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 mb-2">
                <Sparkles className="w-4 h-4 text-rose-500" />
                Tom de Cor do Envelope/Borda:
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'rose', label: 'Rosa Amor', bg: 'bg-rose-500' },
                  { id: 'crimson', label: 'Vermelho Paixão', bg: 'bg-red-600' },
                  { id: 'lavender', label: 'Lavanda Mágica', bg: 'bg-purple-500' },
                  { id: 'golden', label: 'Dourado Vintage', bg: 'bg-amber-500' },
                  { id: 'emerald', label: 'Verde Carinho', bg: 'bg-teal-600' },
                ].map(item => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setThemeColor(item.id as LetterThemeColor)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all cursor-pointer ${
                      themeColor === item.id
                        ? 'ring-2 ring-rose-500 border-rose-500 text-slate-900 dark:text-white bg-white dark:bg-slate-900 font-extrabold'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <span className={`w-3.5 h-3.5 rounded-full ${item.bg}`} />
                    {item.label}
                    {themeColor === item.id && <Check className="w-3.5 h-3.5 text-rose-500" />}
                  </button>
                ))}
              </div>
            </div>

            {/* 5. Seal Icon Choice */}
            <div>
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 mb-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                Selo de Cera / Emblema Especial:
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'scroll', icon: '📜', label: 'Pergaminho' },
                  { id: 'bear', icon: '🧸', label: 'Ursinho' },
                  { id: 'heart', icon: '💖', label: 'Coração' },
                  { id: 'rose', icon: '🌹', label: 'Rosa' },
                  { id: 'ring', icon: '💍', label: 'Aliança' },
                  { id: 'crown', icon: '👑', label: 'Coroa' },
                  { id: 'kiss', icon: '💋', label: 'Beijo' },
                  { id: 'sparkle', icon: '✨', label: 'Estrela' },
                ].map(item => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSealIcon(item.id as any)}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1 cursor-pointer transition-all ${
                      sealIcon === item.id
                        ? 'bg-amber-400 text-slate-950 border-amber-500 font-extrabold scale-[1.03]'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Letter Title & Mood Emoji */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Título da Carta:</label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Ex: Minha mensagem especial de bom dia..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-sm"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Emoção Principal:</label>
              <select
                value={moodEmoji}
                onChange={e => setMoodEmoji(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-bold text-slate-900 dark:text-white"
              >
                <option value="🥰">🥰 Apaixonado(a)</option>
                <option value="💖">💖 Amor Eterno</option>
                <option value="🧸">🧸 Carinho Fofo</option>
                <option value="🌹">🌹 Romance Puro</option>
                <option value="👑">👑 Rainha / Rei</option>
                <option value="💍">💍 Promessa Eterna</option>
                <option value="✨">✨ Magia & Gratidão</option>
                <option value="💋">💋 Beijo Carinhoso</option>
              </select>
            </div>
          </div>

          {/* Letter Message Area + Emojis Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Smile className="w-4 h-4 text-rose-500" />
                Escreva a Carta / Mensagem do Coração:
              </label>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                Toque nos emojis para inserir rapidamente!
              </span>
            </div>

            {/* Quick Emoji Toolbar */}
            <div className="flex flex-wrap items-center gap-1.5 p-2 rounded-xl bg-rose-50/70 dark:bg-slate-800/70 border border-rose-200/50 dark:border-slate-700">
              {LOVE_EMOJIS.map((emoji, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => insertEmoji(emoji)}
                  className="w-8 h-8 rounded-lg bg-white dark:bg-slate-900 hover:bg-rose-100 dark:hover:bg-rose-950 text-base flex items-center justify-center transition-transform hover:scale-125 cursor-pointer shadow-2xs"
                  title={`Inserir ${emoji}`}
                >
                  {emoji}
                </button>
              ))}
            </div>

            <textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              rows={5}
              placeholder="Escreva aqui tudo o que sente no seu coração..."
              className={`w-full p-4 rounded-xl border text-base focus:ring-2 focus:ring-rose-400 focus:outline-none transition-all ${getFontPreviewClass(fontFamily)} ${getBgColorClass(bgColor)}`}
              style={getFontColorStyle(fontColor)}
              required
            />
          </div>

          {/* Voice Audio Recording Module */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-3">
            <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Mic className="w-4 h-4 text-rose-500" />
              Gravar Mensagem de Voz (Áudio):
            </label>

            <div className="flex flex-wrap items-center gap-3">
              {!isRecording ? (
                <button
                  type="button"
                  onClick={startRecording}
                  className="px-4 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
                >
                  <Mic className="w-4 h-4" />
                  Gravar Voz Pelo Microfone 🎙️
                </button>
              ) : (
                <button
                  type="button"
                  onClick={stopRecording}
                  className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-2 shadow-md animate-pulse cursor-pointer"
                >
                  <Square className="w-4 h-4 fill-white" />
                  Parar Gravação ({recordingTime}s) ⏹️
                </button>
              )}

              {audioBlobUrl && !isRecording && (
                <div className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 px-3 py-1.5 rounded-xl text-xs font-bold border border-emerald-300">
                  <Check className="w-4 h-4 text-emerald-600" />
                  Áudio Gravado com Sucesso!
                </div>
              )}
            </div>

            <div className="pt-2">
              <input
                type="url"
                value={audioUrl.startsWith('data:audio') ? '' : audioUrl}
                onChange={e => {
                  setAudioUrl(e.target.value);
                  setAudioBlobUrl(null);
                }}
                placeholder="Ou cole o link de um áudio/música (opcional)..."
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-200"
              />
            </div>
          </div>

          {/* Attach Photo & Video Links */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <Camera className="w-3.5 h-3.5 text-rose-500" />
                Link de Foto (URL):
              </label>
              <input
                type="url"
                value={photoUrl}
                onChange={e => setPhotoUrl(e.target.value)}
                placeholder="https://exemplo.com/foto.jpg"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <Video className="w-3.5 h-3.5 text-rose-500" />
                Link de Vídeo (YouTube/URL):
              </label>
              <input
                type="url"
                value={videoUrl}
                onChange={e => setVideoUrl(e.target.value)}
                placeholder="https://youtube.com/watch?v=..."
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => {
                soundManager.playRomanticHarp();
                setShowPreviewModal(true);
              }}
              className="px-5 py-3 rounded-2xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs flex items-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              <Eye className="w-4 h-4 text-slate-900" />
              Visualizar Prévia da Carta 👁️
            </button>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-200 cursor-pointer"
              >
                Cancelar
              </button>

              <button
                type="submit"
                className="px-6 py-3 rounded-2xl bg-linear-to-r from-rose-500 via-pink-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white font-black text-sm flex items-center gap-2 shadow-lg hover:shadow-rose-500/30 transition-all cursor-pointer"
              >
                <Heart className="w-4 h-4 fill-white" />
                Enviar Carta de Amor 💌
              </button>
            </div>
          </div>

        </form>

      </div>

      {/* Real-time Preview Modal */}
      {showPreviewModal && (
        <LoveLetterModal
          letter={{
            id: 'preview-draft',
            senderName: senderName || 'Remetente',
            senderRole: senderName === 'Dhyon' ? 'user' : 'helper',
            recipientName: recipientName || 'Destinatário',
            recipientRole: recipientName === 'Mooniy' ? 'helper' : 'user',
            title: title.trim() || 'Prévia da Carta de Amor 💖',
            message: message.trim() || 'Escreva algo para ver como a mensagem ficará formatada com o papel, a fonte e as cores escolhidas!',
            paperStyle,
            fontFamily,
            themeColor,
            fontColor,
            bgColor,
            moodEmoji,
            sealIcon,
            photoUrl: photoUrl.trim() || undefined,
            videoUrl: videoUrl.trim() || undefined,
            audioUrl: audioUrl.trim() || undefined,
            createdAt: new Date().toISOString(),
            date: new Date().toLocaleDateString('pt-BR'),
            read: false
          }}
          onClose={() => setShowPreviewModal(false)}
          onMarkRead={() => {}}
          speechEnabled={true}
          isAutoPopup={false}
        />
      )}

    </div>
  );
};
