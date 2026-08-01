import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { soundManager } from '../utils/sound';
import { subscribeTreasureHuntState, saveTreasureHuntStateToCloud } from '../lib/firestoreSync';
import {
  Sparkles,
  Heart,
  Key,
  Lock,
  Unlock,
  Compass,
  Gift,
  Crown,
  HelpCircle,
  CheckCircle2,
  PartyPopper,
  Music,
  RotateCcw,
  Edit3,
  Volume2,
  VolumeX,
  ChevronRight,
  Award,
  Flame,
  Star,
  Printer,
  X,
  Check,
  Globe,
  Link as LinkIcon
} from 'lucide-react';

interface TreasureHuntProps {
  currentProfile: UserProfile;
  speechEnabled?: boolean;
}

interface StageData {
  id: number;
  title: string;
  subtitle: string;
  riddle: string;
  hint: string;
  expectedAnswer: string; // converted to lowercase
  unlocked: boolean;
}

const DEFAULT_STAGES: StageData[] = [
  {
    id: 1,
    title: '📜 O Início de Tudo',
    subtitle: 'Primeiro Enigma do Coração',
    riddle: 'Qual é a palavra mágica que resume o sentimento mais puro entre Dhyon e Mooniy?',
    hint: 'Dica: Começa com a letra "A" e significa o sentimento mais lindo do mundo! (Ex: amor)',
    expectedAnswer: 'amor',
    unlocked: true
  },
  {
    id: 2,
    title: '🧩 O Quebra-Cabeça das Nossas Memórias',
    subtitle: 'Desafio das Cores e Pares',
    riddle: 'Encontre os 4 pares de cartas românticas para desbloquear a chave da próxima etapa!',
    hint: 'Clique nas cartas para virá-las e encontrar os pares iguais de carinho.',
    expectedAnswer: 'completed_game',
    unlocked: false
  },
  {
    id: 3,
    title: '🎵 A Melodia do Nosso Amor',
    subtitle: 'O Ritmo do Coração',
    riddle: 'Qual é a sensação de ouvir a sua voz e ver o seu sorriso todos os dias?',
    hint: 'Dica: É como ouvir a música mais linda do universo (Ex: paz, alegria, felicidade ou musica)',
    expectedAnswer: 'paz',
    unlocked: false
  },
  {
    id: 4,
    title: '🔑 O Cofre do Destino',
    subtitle: 'Código de Acesso Secreto',
    riddle: 'Qual é o número ou ano abençoado do nosso amor eterno? (Ou digite o código 2026)',
    hint: 'Dica: Digite 2026 para abrir o cofre!',
    expectedAnswer: '2026',
    unlocked: false
  },
  {
    id: 5,
    title: '📜 O Baú das Promessas Eternas',
    subtitle: 'Cartas Secretas de Amor',
    riddle: 'Abra as 3 cartas do baú para descobrir tudo o que Dhyon guarda no coração para você...',
    hint: 'Clique nas 3 cartas para ler e liberar a chave final do Grande Tesouro.',
    expectedAnswer: 'completed_chests',
    unlocked: false
  },
  {
    id: 6,
    title: '🎮 O PORTAL DO NOSSO JOGO SECRETO 💎',
    subtitle: 'O Marco Especial',
    riddle: 'Você chegou ao fim da caça ao tesouro... Abra o portal para o nosso local no jogo!',
    hint: 'Clique no portal para liberar o link do nosso ponto de encontro no jogo.',
    expectedAnswer: 'opened_game_portal',
    unlocked: false
  }
];

export const TreasureHuntSection: React.FC<TreasureHuntProps> = ({
  currentProfile,
  speechEnabled = true
}) => {
  const STORAGE_TREASURE_KEY = 'meu_dia_seguro_treasure_progress_v1';
  const STORAGE_PORTAL_OPENED_KEY = 'meu_dia_seguro_portal_opened_v1';
  const STORAGE_CUSTOM_GAME_TEXT_KEY = 'meu_dia_seguro_game_text_v1';
  const STORAGE_CUSTOM_GAME_URL_KEY = 'meu_dia_seguro_game_url_v1';
  const STORAGE_HUNT_ENABLED_KEY = 'meu_dia_seguro_hunt_enabled_v1';

  const isDhyon = currentProfile.name.toLowerCase().includes('dhyon') || currentProfile.role === 'user';

  // Hunt Enabled State (Controlled by Dhyon)
  const [isHuntEnabled, setIsHuntEnabled] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_HUNT_ENABLED_KEY);
      return saved !== null ? saved === 'true' : true;
    } catch {
      return true;
    }
  });

  // Load current stage
  const [currentStageIndex, setCurrentStageIndex] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_TREASURE_KEY);
      return saved ? parseInt(saved, 10) : 0;
    } catch {
      return 0;
    }
  });

  // Load portal opened state
  const [isProposalAccepted, setIsProposalAccepted] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_PORTAL_OPENED_KEY) === 'true';
    } catch {
      return false;
    }
  });

  // Custom Game Message Text
  const [proposalMessage, setProposalMessage] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_CUSTOM_GAME_TEXT_KEY);
      if (saved) return saved;
    } catch {}
    return `Mooniy, minha vida! ❤️\n\nVocê superou cada etapa desta caça ao tesouro com todo o seu carinho e inteligência! Cada resposta, cada enigma e cada memória nos trouxeram até este momento especial.\n\nAgora, o nosso próximo destino nos espera no Second Life. Preparei um local muito especial no mapa do jogo só para nós dois!\n\nClique no botão abaixo para viajar diretamente para o nosso ponto de encontro no Second Life! 🚀✨`;
  });

  // Game URL Link
  const [gameUrl, setGameUrl] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_CUSTOM_GAME_URL_KEY);
      if (saved && saved !== 'https://www.roblox.com') return saved;
    } catch {}
    return 'https://maps.secondlife.com/secondlife/Morris/218/141/922';
  });

  // Input states for Stage 1, 3, 4
  const [answerInput, setAnswerInput] = useState('');
  const [feedbackMsg, setFeedbackMsg] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [showHint, setShowHint] = useState(false);

  // Stage 2: Memory Card Game
  const [cards, setCards] = useState<Array<{ id: number; icon: string; label: string; flipped: boolean; matched: boolean }>>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);

  // Stage 5: Opened Chests state
  const [openedChests, setOpenedChests] = useState<boolean[]>([false, false, false]);

  // Stage 6: Ring Box open state
  const [isRingBoxOpen, setIsRingBoxOpen] = useState(false);
  const [showCelebrationModal, setShowCelebrationModal] = useState(false);

  // Edit Proposal Modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editProposalInput, setEditProposalInput] = useState(proposalMessage);
  const [editGameUrlInput, setEditGameUrlInput] = useState(gameUrl);

  // Ambient Music Toggle
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);

  // Realtime Firestore Subscription for Treasure Hunt state
  useEffect(() => {
    const unsubscribe = subscribeTreasureHuntState(
      (cloudState) => {
        if (cloudState.currentStageIndex !== undefined) setCurrentStageIndex(cloudState.currentStageIndex);
        if (cloudState.isProposalAccepted !== undefined) setIsProposalAccepted(cloudState.isProposalAccepted);
        if (cloudState.isHuntEnabled !== undefined) setIsHuntEnabled(cloudState.isHuntEnabled);
        if (cloudState.proposalMessage) {
          setProposalMessage(cloudState.proposalMessage);
          setEditProposalInput(cloudState.proposalMessage);
        }
        if (cloudState.gameUrl) {
          setGameUrl(cloudState.gameUrl);
          setEditGameUrlInput(cloudState.gameUrl);
        }
        if (cloudState.openedChests) setOpenedChests(cloudState.openedChests);
      },
      {
        currentStageIndex,
        isProposalAccepted,
        proposalMessage,
        gameUrl,
        openedChests: [false, false, false],
        isHuntEnabled
      }
    );
    return () => unsubscribe();
  }, []);

  // Toggle Hunt Enabled (Only Dhyon)
  const handleToggleHuntEnabled = () => {
    const newStatus = !isHuntEnabled;
    setIsHuntEnabled(newStatus);
    try {
      localStorage.setItem(STORAGE_HUNT_ENABLED_KEY, newStatus.toString());
    } catch {}
    saveTreasureHuntStateToCloud({ isHuntEnabled: newStatus });
    setFeedbackMsg({
      text: newStatus
        ? 'Caça ao Tesouro HABILITADA para Mooniy! 🎉'
        : 'Caça ao Tesouro DESATIVADA para Mooniy (Modo de Preparação)! 🔒',
      type: 'info'
    });
    setTimeout(() => setFeedbackMsg(null), 3000);
  };

  // Save progress to cloud and localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_TREASURE_KEY, currentStageIndex.toString());
    } catch {}
    saveTreasureHuntStateToCloud({ currentStageIndex });
  }, [currentStageIndex]);

  // Save portal accepted state
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_PORTAL_OPENED_KEY, isProposalAccepted.toString());
    } catch {}
    saveTreasureHuntStateToCloud({ isProposalAccepted });
  }, [isProposalAccepted]);

  // Initialize Stage 2 Cards when entering Stage 2
  useEffect(() => {
    if (currentStageIndex === 1 && cards.length === 0) {
      const initialPairs = [
        { icon: '🌹', label: 'Amor Eterno' },
        { icon: '☕', label: 'Café & Carinho' },
        { icon: '💌', label: 'Cartas Secretas' },
        { icon: '💍', label: 'Nosso Futuro' }
      ];
      const duplicated = [...initialPairs, ...initialPairs].map((item, idx) => ({
        id: idx,
        icon: item.icon,
        label: item.label,
        flipped: false,
        matched: false
      }));
      // Shuffle
      const shuffled = duplicated.sort(() => Math.random() - 0.5);
      setCards(shuffled);
    }
  }, [currentStageIndex, cards.length]);

  // Handle Stage 1 & 3 & 4 Riddle Check
  const handleSubmitAnswer = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanAnswer = answerInput.trim().toLowerCase();
    
    if (!cleanAnswer) {
      setFeedbackMsg({ text: 'Por favor, digite uma resposta para a pista!', type: 'info' });
      return;
    }

    const currentStage = DEFAULT_STAGES[currentStageIndex];

    // Accept expected answer OR common sweet words if stuck!
    const isCorrect =
      cleanAnswer.includes(currentStage.expectedAnswer.toLowerCase()) ||
      cleanAnswer.includes('amor') ||
      cleanAnswer.includes('paz') ||
      cleanAnswer.includes('2026') ||
      cleanAnswer.includes('dhyon') ||
      cleanAnswer.includes('mooni') ||
      cleanAnswer.includes('sim');

    if (isCorrect) {
      soundManager.playSuccessChime();
      setFeedbackMsg({ text: '🎉 Pista Correta! Você desbloqueou a próxima etapa do tesouro!', type: 'success' });
      setAnswerInput('');
      setShowHint(false);

      setTimeout(() => {
        setFeedbackMsg(null);
        if (currentStageIndex < DEFAULT_STAGES.length - 1) {
          setCurrentStageIndex(prev => prev + 1);
        }
      }, 1200);
    } else {
      soundManager.playPop();
      setFeedbackMsg({
        text: 'Hum... Quase lá! Tente pensar em um sentimento bem bonito ou clique em "Ver Dica"!',
        type: 'error'
      });
    }
  };

  // Memory Card Click Handler for Stage 2
  const handleCardClick = (index: number) => {
    if (flippedIndices.length === 2 || cards[index].flipped || cards[index].matched) return;

    soundManager.playPop();
    const newCards = [...cards];
    newCards[index].flipped = true;
    setCards(newCards);

    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      const [firstIdx, secondIdx] = newFlipped;
      if (cards[firstIdx].label === cards[secondIdx].label) {
        // Match!
        soundManager.playSuccessChime();
        setTimeout(() => {
          setCards(prev =>
            prev.map((card, i) =>
              i === firstIdx || i === secondIdx ? { ...card, matched: true } : card
            )
          );
          setFlippedIndices([]);

          // Check if all matched
          const remainingUnmatched = cards.filter((c, i) => i !== firstIdx && i !== secondIdx && !c.matched);
          if (remainingUnmatched.length === 0) {
            setFeedbackMsg({ text: '✨ Incrível! Você encontrou todos os pares de carinho!', type: 'success' });
            setTimeout(() => {
              setFeedbackMsg(null);
              setCurrentStageIndex(2);
            }, 1500);
          }
        }, 600);
      } else {
        // No match
        setTimeout(() => {
          setCards(prev =>
            prev.map((card, i) =>
              i === firstIdx || i === secondIdx ? { ...card, flipped: false } : card
            )
          );
          setFlippedIndices([]);
        }, 1000);
      }
    }
  };

  // Open Chest Handler for Stage 5
  const handleOpenChest = (index: number) => {
    soundManager.playRomanticHarp();
    const newOpened = [...openedChests];
    newOpened[index] = true;
    setOpenedChests(newOpened);

    if (newOpened.every(val => val === true)) {
      setFeedbackMsg({ text: '🗝️ Todas as promessas foram reveladas! A porta do Tesouro Supremo está aberta!', type: 'success' });
      setTimeout(() => {
        setFeedbackMsg(null);
        setCurrentStageIndex(5); // Final Stage
      }, 2000);
    }
  };

  // Proposal Accept Handler
  const handleAcceptProposal = () => {
    soundManager.playWeddingChimes();
    setIsProposalAccepted(true);
    setShowCelebrationModal(true);
  };

  // Reset Treasure Progress
  const handleResetProgress = () => {
    if (window.confirm('Tem certeza que deseja reiniciar a Caça ao Tesouro do início?')) {
      setCurrentStageIndex(0);
      setIsProposalAccepted(false);
      setIsRingBoxOpen(false);
      setOpenedChests([false, false, false]);
      setCards([]);
      saveTreasureHuntStateToCloud({
        currentStageIndex: 0,
        isProposalAccepted: false,
        openedChests: [false, false, false]
      });
      setFeedbackMsg({ text: 'Caça ao Tesouro reiniciada com sucesso!', type: 'info' });
      setTimeout(() => setFeedbackMsg(null), 2000);
    }
  };

  // Save Custom Proposal Message & Game Link
  const handleSaveProposalEdit = () => {
    setProposalMessage(editProposalInput);
    setGameUrl(editGameUrlInput);
    try {
      localStorage.setItem(STORAGE_CUSTOM_GAME_TEXT_KEY, editProposalInput);
      localStorage.setItem(STORAGE_CUSTOM_GAME_URL_KEY, editGameUrlInput);
    } catch {}
    saveTreasureHuntStateToCloud({
      proposalMessage: editProposalInput,
      gameUrl: editGameUrlInput
    });
    setIsEditModalOpen(false);
    soundManager.playSuccessChime();
  };

  const currentStage = DEFAULT_STAGES[currentStageIndex];
  const progressPercent = Math.round(((currentStageIndex + 1) / DEFAULT_STAGES.length) * 100);

  // If Treasure Hunt is disabled and current user is Mooniy (not Dhyon), show locked preparation screen
  if (!isHuntEnabled && !isDhyon) {
    return (
      <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-950 text-white border-2 border-amber-400/60 shadow-2xl text-center space-y-6 max-w-2xl mx-auto my-8 animate-fade-in relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-60 h-60 bg-amber-500/20 rounded-full blur-3xl pointer-events-none animate-pulse" />
        
        <div className="w-24 h-24 mx-auto rounded-full bg-amber-400/20 border-2 border-amber-400 flex items-center justify-center text-5xl shadow-2xl animate-pulse">
          🔒
        </div>

        <div className="space-y-3">
          <span className="px-3.5 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40 text-xs font-black uppercase tracking-wider">
            Aguardando Liberação de Dhyon 🗝️
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-amber-300">
            Caça ao Tesouro Secreta ✨
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-md mx-auto">
            Dhyon está organizando as pistas, os enigmas e preparando o nosso local secreto no jogo do Second Life! 🎮❤️
          </p>
          <p className="text-xs text-rose-300 font-bold italic">
            Assim que ele concluir e habilitar no painel dele, a caça ao tesouro estará totalmente disponível para você jogar!
          </p>
        </div>

        <div className="pt-2 flex justify-center gap-3">
          <button
            type="button"
            onClick={() => {
              soundManager.playSuccessChime();
              setFeedbackMsg({ text: 'Verificando se Dhyon já liberou a Caça ao Tesouro...', type: 'info' });
              setTimeout(() => setFeedbackMsg(null), 2500);
            }}
            className="px-6 py-3 rounded-2xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs sm:text-sm shadow-xl cursor-pointer hover:scale-105 transition-all flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-slate-950" />
            Verificar Status em Tempo Real 🔄
          </button>
        </div>

        {feedbackMsg && (
          <div className="p-3 rounded-xl bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-400/30 animate-fade-in">
            {feedbackMsg.text}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in relative">
      {/* Banner for Dhyon when Caça ao Tesouro is disabled */}
      {!isHuntEnabled && isDhyon && (
        <div className="p-4 rounded-2xl bg-amber-500/20 border-2 border-amber-400 text-amber-200 text-xs font-bold flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg animate-fade-in">
          <div className="flex items-center gap-2 text-center sm:text-left">
            <Lock className="w-5 h-5 text-amber-400 shrink-0" />
            <span>
              <strong>Modo de Preparação Ativo (Dhyon):</strong> A Caça ao Tesouro está atualmente bloqueada para Mooniy. Você pode testar e editar as pistas e, quando estiver pronto, clique no botão para habilitar!
            </span>
          </div>
          <button
            type="button"
            onClick={handleToggleHuntEnabled}
            className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs shrink-0 cursor-pointer shadow-md hover:scale-105 transition-transform flex items-center gap-1.5"
          >
            <Unlock className="w-4 h-4 text-slate-950" />
            🚀 Liberar Caça ao Tesouro para Mooniy Agora!
          </button>
        </div>
      )}

      {/* Sub-Site Enchaned Portal Banner Header */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-slate-950 via-purple-950 to-rose-950 text-white p-6 sm:p-10 border-2 border-amber-400/50 shadow-2xl">
        
        {/* Ambient Glows */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-rose-500/20 rounded-full blur-3xl pointer-events-none animate-pulse" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40 text-xs font-black uppercase tracking-wider backdrop-blur-md">
              <Crown className="w-4 h-4 text-amber-400 animate-bounce" />
              Portal Secreto • Reino do Amor
            </div>
            
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-rose-200 to-pink-100 flex items-center justify-center md:justify-start gap-3 flex-wrap">
              <span>Caça ao Tesouro Dhyon & Mooniy</span>
              <Sparkles className="w-7 h-7 text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
            </h2>

            <p className="text-xs sm:text-sm text-rose-200 max-w-xl font-medium">
              Uma jornada romântica repleta de enigmas, memórias e carinho. Siga cada pista para desbloquear o maior tesouro de nossas vidas!
            </p>
          </div>

          {/* Progress Badge & Ambient Controls */}
          <div className="flex flex-col items-center md:items-end gap-3 shrink-0 w-full md:w-auto">
            
            <div className="flex items-center gap-2 bg-slate-900/80 p-2 rounded-2xl border border-amber-400/30 backdrop-blur-md w-full sm:w-auto justify-center">
              
              {/* Music Ambient Toggle */}
              <button
                type="button"
                onClick={() => {
                  const playing = soundManager.toggleAmbientSound();
                  setIsMusicPlaying(playing);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer ${
                  isMusicPlaying
                    ? 'bg-amber-400 text-slate-950 shadow-md animate-pulse'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {isMusicPlaying ? <Volume2 className="w-4 h-4 text-slate-950" /> : <VolumeX className="w-4 h-4 text-amber-400" />}
                {isMusicPlaying ? 'Música Romântica Ativada 🎶' : 'Tocar Música Romântica'}
              </button>

              {/* Reset Button */}
              <button
                type="button"
                onClick={handleResetProgress}
                title="Reiniciar a Caça ao Tesouro"
                className="p-2 rounded-xl bg-slate-800 hover:bg-rose-950 text-slate-300 hover:text-rose-300 border border-slate-700 transition-all cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              {/* Creator Edit Mode */}
              <button
                type="button"
                onClick={() => setIsEditModalOpen(true)}
                title="Personalizar mensagem e link do jogo"
                className="p-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/40 text-amber-300 border border-amber-400/30 transition-all cursor-pointer"
              >
                <Edit3 className="w-4 h-4" />
              </button>

              {/* Dhyon Enable / Disable Status Toggle */}
              {isDhyon && (
                <button
                  type="button"
                  onClick={handleToggleHuntEnabled}
                  title={isHuntEnabled ? 'Caça ao Tesouro está Liberada para Mooniy (Clique para bloquear)' : 'Caça ao Tesouro está Bloqueada para Mooniy (Clique para liberar)'}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer border ${
                    isHuntEnabled
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40 hover:bg-emerald-500/30'
                      : 'bg-amber-500/30 text-amber-300 border-amber-400 animate-pulse hover:bg-amber-500/40'
                  }`}
                >
                  {isHuntEnabled ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Lock className="w-4 h-4 text-amber-400" />}
                  <span>{isHuntEnabled ? 'Liberado ✅' : 'Bloqueado 🔒'}</span>
                </button>
              )}
            </div>

            {/* Stage Counter */}
            <div className="flex items-center gap-2 text-xs font-black text-amber-300 bg-amber-400/10 px-4 py-2 rounded-2xl border border-amber-400/30">
              <Compass className="w-4 h-4 text-amber-400 animate-spin" style={{ animationDuration: '10s' }} />
              Progresso do Tesouro: {progressPercent}% (Etapa {currentStageIndex + 1} de {DEFAULT_STAGES.length})
            </div>
          </div>
        </div>

        {/* Interactive Progress Bar */}
        <div className="mt-6 w-full bg-slate-900/80 rounded-full h-3 border border-amber-400/30 p-0.5 overflow-hidden">
          <div
            className="bg-gradient-to-r from-amber-400 via-rose-500 to-pink-400 h-full rounded-full transition-all duration-700 shadow-md shadow-amber-400/40"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Map Nodes Stage Stepper */}
      <div className="bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-x-auto">
        <div className="flex items-center justify-between min-w-[650px] gap-2 relative">
          
          {/* Background Connecting Line */}
          <div className="absolute top-1/2 left-8 right-8 -translate-y-1/2 h-1 bg-slate-200 dark:bg-slate-800 z-0" />
          <div
            className="absolute top-1/2 left-8 h-1 bg-gradient-to-r from-amber-400 to-rose-500 z-0 transition-all duration-500"
            style={{ width: `${(currentStageIndex / (DEFAULT_STAGES.length - 1)) * 90}%` }}
          />

          {DEFAULT_STAGES.map((st, index) => {
            const isCompleted = index < currentStageIndex;
            const isCurrent = index === currentStageIndex;
            const isLocked = index > currentStageIndex;

            return (
              <button
                key={`stage-node-${st.id}`}
                onClick={() => {
                  if (!isLocked) {
                    setCurrentStageIndex(index);
                    soundManager.playPop();
                  }
                }}
                disabled={isLocked}
                className={`relative z-10 flex flex-col items-center gap-1.5 group transition-all ${
                  isLocked ? 'cursor-not-allowed opacity-60' : 'cursor-pointer hover:scale-105'
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center font-extrabold text-sm border-2 transition-all shadow-md ${
                    isCompleted
                      ? 'bg-emerald-600 text-white border-emerald-400'
                      : isCurrent
                        ? 'bg-amber-400 text-slate-950 border-amber-200 scale-110 ring-4 ring-amber-400/30 animate-pulse'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border-slate-300 dark:border-slate-700'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-6 h-6 text-white" />
                  ) : isCurrent ? (
                    <Sparkles className="w-6 h-6 text-slate-950 animate-spin" style={{ animationDuration: '4s' }} />
                  ) : (
                    <Lock className="w-5 h-5 text-slate-400" />
                  )}
                </div>

                <div className="text-center">
                  <span className={`text-[11px] font-extrabold block whitespace-nowrap ${
                    isCurrent ? 'text-amber-600 dark:text-amber-400' : 'text-slate-700 dark:text-slate-300'
                  }`}>
                    Pista {st.id}
                  </span>
                  <span className="text-[9px] font-semibold text-slate-500 dark:text-slate-400 hidden sm:block max-w-[90px] truncate">
                    {st.title.replace(/^[^\w\s]+/, '').trim()}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Feedback Toast Banner */}
      {feedbackMsg && (
        <div className={`p-4 rounded-2xl font-bold text-xs sm:text-sm text-center animate-fade-in shadow-md flex items-center justify-center gap-2 ${
          feedbackMsg.type === 'success'
            ? 'bg-emerald-500 text-white border-2 border-emerald-300'
            : feedbackMsg.type === 'error'
              ? 'bg-rose-500 text-white border-2 border-rose-300'
              : 'bg-indigo-600 text-white border-2 border-indigo-300'
        }`}>
          <span>{feedbackMsg.text}</span>
        </div>
      )}

      {/* Main Stage Interactive Content Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border-2 border-amber-300 dark:border-amber-800/80 p-6 sm:p-10 shadow-xl space-y-6 relative overflow-hidden">
        
        {/* Stage Title */}
        <div className="border-b border-slate-100 dark:border-slate-800 pb-4 flex items-center justify-between flex-wrap gap-3">
          <div>
            <span className="text-xs font-black text-amber-600 dark:text-amber-400 uppercase tracking-widest flex items-center gap-1.5">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              Etapa {currentStageIndex + 1}: {currentStage.subtitle}
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1 flex items-center gap-2">
              {currentStage.title}
            </h3>
          </div>

          <button
            type="button"
            onClick={() => setShowHint(!showHint)}
            className="px-3.5 py-2 rounded-xl bg-amber-50 dark:bg-amber-950/80 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200 text-xs font-bold hover:bg-amber-100 flex items-center gap-1.5 cursor-pointer transition-all"
          >
            <HelpCircle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            {showHint ? 'Ocultar Dica' : 'Ver Dica do Amor'}
          </button>
        </div>

        {/* Hint Box */}
        {showHint && (
          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/50 border border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-200 text-xs font-bold animate-fade-in flex items-start gap-2.5">
            <Sparkles className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-extrabold text-amber-800 dark:text-amber-300">💡 Dica Especial:</p>
              <p className="mt-0.5">{currentStage.hint}</p>
            </div>
          </div>
        )}

        {/* STAGE 1, 3, 4: Riddle & Input */}
        {(currentStageIndex === 0 || currentStageIndex === 2 || currentStageIndex === 3) && (
          <div className="space-y-6 max-w-2xl mx-auto py-4">
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-3 text-center">
              <p className="text-sm sm:text-base font-extrabold text-slate-800 dark:text-slate-100 leading-relaxed italic">
                "{currentStage.riddle}"
              </p>
            </div>

            <form onSubmit={handleSubmitAnswer} className="space-y-4">
              <div className="relative">
                <input
                  type="text"
                  value={answerInput}
                  onChange={e => setAnswerInput(e.target.value)}
                  placeholder="Digite aqui a sua resposta para abrir o próximo cadeado..."
                  className="w-full pl-4 pr-12 py-3.5 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white font-bold text-sm sm:text-base focus:outline-none focus:border-amber-500 transition-all shadow-inner"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs shadow-md cursor-pointer transition-all flex items-center gap-1"
                >
                  <Unlock className="w-4 h-4" />
                  Abrir
                </button>
              </div>

              <div className="flex justify-between items-center text-xs font-semibold text-slate-500">
                <span>Respostas carinhosas ou a palavra principal desbloqueiam a pista!</span>
                <button
                  type="button"
                  onClick={() => {
                    setAnswerInput(currentStage.expectedAnswer);
                  }}
                  className="text-amber-600 dark:text-amber-400 hover:underline cursor-pointer font-bold"
                >
                  Preencher Resposta Dica
                </button>
              </div>
            </form>
          </div>
        )}

        {/* STAGE 2: Interactive Memory Matching Game */}
        {currentStageIndex === 1 && (
          <div className="space-y-6 max-w-xl mx-auto py-2">
            <p className="text-sm font-extrabold text-slate-700 dark:text-slate-200 text-center">
              Clique nos quadros para encontrar os 4 pares iguais de amor:
            </p>

            <div className="grid grid-cols-4 gap-3">
              {cards.map((card, index) => (
                <button
                  key={`card-${card.id}`}
                  type="button"
                  onClick={() => handleCardClick(index)}
                  disabled={card.matched}
                  className={`h-24 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center justify-center p-2 cursor-pointer shadow-md ${
                    card.matched
                      ? 'bg-emerald-500 text-white border-emerald-300 opacity-90'
                      : card.flipped
                        ? 'bg-amber-400 text-slate-950 border-amber-200 scale-105'
                        : 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 hover:border-amber-400 hover:scale-102'
                  }`}
                >
                  {card.flipped || card.matched ? (
                    <>
                      <span className="text-2xl animate-bounce">{card.icon}</span>
                      <span className="text-[10px] font-black text-center mt-1 leading-none">{card.label}</span>
                    </>
                  ) : (
                    <Heart className="w-8 h-8 text-rose-400 fill-rose-300 opacity-60" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STAGE 5: Interactive Chests */}
        {currentStageIndex === 4 && (
          <div className="space-y-6 max-w-3xl mx-auto py-2">
            <p className="text-sm font-extrabold text-slate-700 dark:text-slate-200 text-center">
              Clique nos 3 baús para abrir e ler cada promessa eterna de Dhyon para Mooniy:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Chest 1 */}
              <div className={`p-5 rounded-2xl border-2 transition-all space-y-3 text-center ${
                openedChests[0]
                  ? 'bg-amber-50 dark:bg-amber-950/60 border-amber-400 shadow-md'
                  : 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700'
              }`}>
                <div className="p-3 rounded-2xl bg-amber-400 text-slate-950 font-extrabold w-12 h-12 mx-auto flex items-center justify-center text-xl shadow-sm">
                  {openedChests[0] ? '📜' : '🔒'}
                </div>
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                  1. Por Que Eu Te Amo?
                </h4>

                {openedChests[0] ? (
                  <p className="text-xs text-slate-700 dark:text-slate-200 font-medium italic animate-fade-in bg-white dark:bg-slate-900 p-3 rounded-xl border border-amber-200">
                    "Porque você traz leveza, sorrisos sinceros e um carinho que aquece até os dias mais difíceis."
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleOpenChest(0)}
                    className="w-full py-2 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-extrabold text-xs cursor-pointer shadow-xs"
                  >
                    Abrir Baú 1
                  </button>
                )}
              </div>

              {/* Chest 2 */}
              <div className={`p-5 rounded-2xl border-2 transition-all space-y-3 text-center ${
                openedChests[1]
                  ? 'bg-rose-50 dark:bg-rose-950/60 border-rose-400 shadow-md'
                  : 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700'
              }`}>
                <div className="p-3 rounded-2xl bg-rose-500 text-white font-extrabold w-12 h-12 mx-auto flex items-center justify-center text-xl shadow-sm">
                  {openedChests[1] ? '🌹' : '🔒'}
                </div>
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                  2. Minha Promessa
                </h4>

                {openedChests[1] ? (
                  <p className="text-xs text-slate-700 dark:text-slate-200 font-medium italic animate-fade-in bg-white dark:bg-slate-900 p-3 rounded-xl border border-rose-200">
                    "Prometo te cuidar, te ouvir, te respeitar e estar ao seu lado em todos os momentos da nossa vida."
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleOpenChest(1)}
                    className="w-full py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-extrabold text-xs cursor-pointer shadow-xs"
                  >
                    Abrir Baú 2
                  </button>
                )}
              </div>

              {/* Chest 3 */}
              <div className={`p-5 rounded-2xl border-2 transition-all space-y-3 text-center ${
                openedChests[2]
                  ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-400 shadow-md'
                  : 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700'
              }`}>
                <div className="p-3 rounded-2xl bg-indigo-600 text-white font-extrabold w-12 h-12 mx-auto flex items-center justify-center text-xl shadow-sm">
                  {openedChests[2] ? '💎' : '🔒'}
                </div>
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                  3. Nosso Maior Sonho
                </h4>

                {openedChests[2] ? (
                  <p className="text-xs text-slate-700 dark:text-slate-200 font-medium italic animate-fade-in bg-white dark:bg-slate-900 p-3 rounded-xl border border-indigo-200">
                    "Construir uma família feliz, cheia de paz e amor eterno. A chave final está liberada!"
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleOpenChest(2)}
                    className="w-full py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs cursor-pointer shadow-xs"
                  >
                    Abrir Baú 3
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* STAGE 6: THE GRAND FINALE - GAME MILESTONE PORTAL! 🎮 */}
        {currentStageIndex === 5 && (
          <div className="space-y-8 max-w-3xl mx-auto py-4 text-center">
            
            {/* Game Portal Container */}
            <div className="relative p-8 sm:p-12 rounded-3xl bg-linear-to-b from-indigo-950 via-slate-950 to-purple-950 border-4 border-amber-400 shadow-2xl space-y-6 overflow-hidden">
              
              <div className="absolute top-2 right-2 text-amber-300/40 text-xs font-mono font-bold">
                🎮 PORTAL SECRETO DO JOGO
              </div>

              {!isRingBoxOpen ? (
                <div className="space-y-6 py-6 animate-pulse">
                  <div className="p-6 rounded-full bg-amber-400/20 border-2 border-amber-400 text-amber-300 w-28 h-28 mx-auto flex items-center justify-center text-5xl shadow-2xl cursor-pointer hover:scale-110 transition-transform">
                    🔮
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl sm:text-3xl font-black text-amber-300">
                      Você Desbloqueou o Portal do Nosso Jogo!
                    </h3>
                    <p className="text-xs sm:text-sm text-amber-200 font-bold max-w-md mx-auto">
                      Clique no botão para abrir a mensagem secreta de Dhyon e acessar o nosso local especial dentro do jogo!
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      soundManager.playSuccessChime();
                      setIsRingBoxOpen(true);
                    }}
                    className="px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-400 via-rose-500 to-pink-500 text-slate-950 font-black text-base shadow-xl hover:scale-105 transition-transform cursor-pointer border-2 border-white"
                  >
                    ✨ REVELAR PORTAL DO JOGO 🎮
                  </button>
                </div>
              ) : (
                <div className="space-y-6 animate-fade-in text-left">
                  
                  {/* Glowing Portal Graphic */}
                  <div className="text-center space-y-2">
                    <div className="inline-p-4 p-4 rounded-full bg-amber-400/20 border-2 border-amber-300 text-amber-300 text-6xl mx-auto animate-bounce shadow-2xl">
                      🚀
                    </div>
                    <div className="inline-block px-4 py-1 rounded-full bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-widest">
                      Marco Especial • Ponto de Encontro no Jogo
                    </div>
                  </div>

                  {/* Romantic Letter Text */}
                  <div className="p-6 sm:p-8 rounded-2xl bg-white/95 dark:bg-slate-900/95 text-slate-900 dark:text-white border-2 border-amber-400 shadow-2xl space-y-4 font-serif leading-relaxed">
                    <p className="text-sm sm:text-base whitespace-pre-line font-medium text-slate-800 dark:text-slate-100">
                      {proposalMessage}
                    </p>
                  </div>

                  {/* Direct Game Access Button */}
                  <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                    <a
                      href={gameUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => {
                        soundManager.playWeddingChimes();
                        setIsProposalAccepted(true);
                      }}
                      className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 text-white font-black text-base sm:text-lg shadow-xl hover:scale-105 transition-transform cursor-pointer border-2 border-emerald-200 flex items-center justify-center gap-2 text-center"
                    >
                      <Globe className="w-6 h-6 animate-spin" style={{ animationDuration: '6s' }} />
                      🎮 IR PARA O NOSSO LOCAL SECRETO NO JOGO 🚀
                    </a>

                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(gameUrl);
                        setFeedbackMsg({ text: 'Link do jogo copiado com sucesso!', type: 'success' });
                        setTimeout(() => setFeedbackMsg(null), 2000);
                      }}
                      className="w-full sm:w-auto px-5 py-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-extrabold text-xs sm:text-sm border border-amber-400/30 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <LinkIcon className="w-4 h-4" />
                      Copiar Link do Jogo
                    </button>
                  </div>

                </div>
              )}

            </div>

          </div>
        )}

      </div>

      {/* Edit Game Link & Message Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border-2 border-amber-400 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-amber-500" />
                Configurar Mensagem e Link do Jogo
              </h3>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                🌐 Link (URL) do Local no Jogo:
              </label>
              <input
                type="url"
                value={editGameUrlInput}
                onChange={e => setEditGameUrlInput(e.target.value)}
                placeholder="Ex: https://www.roblox.com/games/... ou link do seu servidor"
                className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs font-mono"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                📜 Mensagem do Marco Especial:
              </label>
              <textarea
                rows={6}
                value={editProposalInput}
                onChange={e => setEditProposalInput(e.target.value)}
                className="w-full p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs font-serif leading-relaxed"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSaveProposalEdit}
                className="px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 text-xs font-black cursor-pointer shadow-md"
              >
                Salvar Configurações
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
