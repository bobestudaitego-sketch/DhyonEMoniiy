import React, { useState, useEffect } from 'react';
import { ScheduleItem, UserProfile, AppSettings, SensoryTheme, JournalEntry, JournalAuthorType, LoveLetter } from './types';
import { INITIAL_PROFILES, INITIAL_SCHEDULE_ITEMS, INITIAL_JOURNAL_ENTRIES, INITIAL_LOVE_LETTERS } from './data/initialData';
import { getTodayDateString } from './utils/date';
import { Header } from './components/Header';
import { NowBanner } from './components/NowBanner';
import { ScheduleView } from './components/ScheduleView';
import { MedicationTracker } from './components/MedicationTracker';
import { WebsitesSection } from './components/WebsitesSection';
import { MusicSection } from './components/MusicSection';
import { GallerySection } from './components/GallerySection';
import { CaregiverJournal } from './components/CaregiverJournal';
import { LoveLettersSection } from './components/LoveLettersSection';
import { LoveLetterModal } from './components/LoveLetterModal';
import { AddItemModal } from './components/AddItemModal';
import { LoginModal } from './components/LoginModal';
import { LoginScreen } from './components/LoginScreen';
import { SettingsModal } from './components/SettingsModal';
import { ReminderNotifier } from './components/ReminderNotifier';
import { HeartParticles } from './components/HeartParticles';
import { Calendar, Pill, Globe, Music, Image as ImageIcon, HeartHandshake, ShieldCheck, Sparkles, BookOpen, Heart, Mail } from 'lucide-react';

export default function App() {
  // Local storage keys
  const STORAGE_ITEMS_KEY = 'meu_dia_seguro_items_v4';
  const STORAGE_SETTINGS_KEY = 'meu_dia_seguro_settings_v4';
  const STORAGE_PROFILE_KEY = 'meu_dia_seguro_profile_v4';
  const STORAGE_JOURNAL_KEY = 'meu_dia_seguro_journal_v4';
  const STORAGE_LOVE_LETTERS_KEY = 'meu_dia_seguro_love_letters_v4';
  const STORAGE_AUTH_KEY = 'meu_dia_seguro_auth_v4';

  // Load items
  const [items, setItems] = useState<ScheduleItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_ITEMS_KEY);
      return saved ? JSON.parse(saved) : INITIAL_SCHEDULE_ITEMS;
    } catch {
      return INITIAL_SCHEDULE_ITEMS;
    }
  });

  // Load journal entries
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_JOURNAL_KEY);
      return saved ? JSON.parse(saved) : INITIAL_JOURNAL_ENTRIES;
    } catch {
      return INITIAL_JOURNAL_ENTRIES;
    }
  });

  // Load love letters
  const [loveLetters, setLoveLetters] = useState<LoveLetter[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_LOVE_LETTERS_KEY);
      return saved ? JSON.parse(saved) : INITIAL_LOVE_LETTERS;
    } catch {
      return INITIAL_LOVE_LETTERS;
    }
  });

  // Load settings
  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_SETTINGS_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      sensoryTheme: 'soft-light',
      fontSize: 'normal',
      soundEnabled: true,
      speechEnabled: true,
      activeProfileId: 'user-main'
    };
  });

  // Load profiles
  const STORAGE_PROFILES_LIST_KEY = 'meu_dia_seguro_profiles_list_v4';

  const [profiles, setProfiles] = useState<UserProfile[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_PROFILES_LIST_KEY);
      return saved ? JSON.parse(saved) : INITIAL_PROFILES;
    } catch {
      return INITIAL_PROFILES;
    }
  });

  const handleSelectAvatar = (profileId: string, newAvatar: string) => {
    setProfiles(prev => prev.map(p => p.id === profileId ? { ...p, avatar: newAvatar } : p));
  };

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_PROFILES_LIST_KEY, JSON.stringify(profiles));
    } catch {}
  }, [profiles]);

  const [activeProfileId, setActiveProfileId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_PROFILE_KEY);
      return saved || 'user-main';
    } catch {
      return 'user-main';
    }
  });

  // Authentication Gate State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_AUTH_KEY) === 'true';
    } catch {
      return false;
    }
  });

  const handleLoginSuccess = (profileId: string) => {
    setActiveProfileId(profileId);
    setIsAuthenticated(true);
    try {
      localStorage.setItem(STORAGE_AUTH_KEY, 'true');
    } catch {}
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    try {
      localStorage.removeItem(STORAGE_AUTH_KEY);
    } catch {}
  };

  // Active view state
  const [selectedDate, setSelectedDate] = useState<string>(getTodayDateString());
  const [activeTab, setActiveTab] = useState<'schedule' | 'medication' | 'websites' | 'music' | 'gallery' | 'journal' | 'letters'>('schedule');

  // Modals & Overlay state
  const [isAddItemOpen, setIsAddItemOpen] = useState(false);
  const [addItemCategoryPreset, setAddItemCategoryPreset] = useState<string>('routine');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  // Auto-popup unread letter on load/login
  const [autoPopupLetter, setAutoPopupLetter] = useState<LoveLetter | null>(null);

  // Recent change/update notification state
  const [recentChangeNotice, setRecentChangeNotice] = useState<{
    message: string;
    type: 'letters' | 'journal' | 'schedule';
    author?: string;
  } | null>(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_ITEMS_KEY, JSON.stringify(items));
    } catch {}
  }, [items]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_JOURNAL_KEY, JSON.stringify(journalEntries));
    } catch {}
  }, [journalEntries]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_LOVE_LETTERS_KEY, JSON.stringify(loveLetters));
    } catch {}
  }, [loveLetters]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_SETTINGS_KEY, JSON.stringify(settings));
    } catch {}
  }, [settings]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_PROFILE_KEY, activeProfileId);
    } catch {}
  }, [activeProfileId]);

  const currentProfile = profiles.find(p => p.id === activeProfileId) || profiles[0];

  // Auto trigger letter popup when opening app or switching profile if there's an unread letter for current user
  useEffect(() => {
    const isDhyon = currentProfile.name.toLowerCase().includes('dhyon');
    const myName = isDhyon ? 'Dhyon' : 'Mooniy';
    const unread = loveLetters.find(l => l.recipientName === myName && !l.read);
    if (unread) {
      setAutoPopupLetter(unread);
    }
  }, [activeProfileId, loveLetters]);

  const handleSendLoveLetter = (letterData: Omit<LoveLetter, 'id' | 'createdAt' | 'read'>) => {
    const newLetter: LoveLetter = {
      ...letterData,
      id: `letter-${Date.now()}`,
      createdAt: new Date().toISOString(),
      read: false
    };

    setLoveLetters(prev => [newLetter, ...prev]);
    setRecentChangeNotice({
      message: `Nova carta de amor enviada para ${letterData.recipientName}! 💌`,
      type: 'letters',
      author: currentProfile.name
    });
  };

  const handleMarkLoveLetterRead = (letterId: string) => {
    setLoveLetters(prev => prev.map(l => l.id === letterId ? { ...l, read: true, openedAt: new Date().toISOString() } : l));
  };

  const handleDeleteLoveLetter = (letterId: string) => {
    setLoveLetters(prev => prev.filter(l => l.id !== letterId));
    setRecentChangeNotice({
      message: `Uma carta de amor foi apagada por ${currentProfile.name}. 🗑️`,
      type: 'letters',
      author: currentProfile.name
    });
  };

  const handleUpdateSettings = (newPartial: Partial<AppSettings>) => {
    setSettings(prev => ({ ...prev, ...newPartial }));
  };

  const handleToggleComplete = (itemId: string) => {
    setItems(prev => prev.map(item => {
      if (item.id === itemId) {
        return {
          ...item,
          completed: !item.completed,
          completedAt: !item.completed ? new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : undefined
        };
      }
      return item;
    }));
  };

  const handleAddItem = (newItemData: Omit<ScheduleItem, 'id' | 'createdAt'>) => {
    const newItem: ScheduleItem = {
      ...newItemData,
      id: `item-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setItems(prev => [newItem, ...prev]);
    setRecentChangeNotice({
      message: `Nova tarefa "${newItemData.title}" adicionada à rotina por ${currentProfile.name}! 📅`,
      type: 'schedule',
      author: currentProfile.name
    });
  };

  const handleDeleteItem = (itemId: string) => {
    setItems(prev => prev.filter(i => i.id !== itemId));
    setRecentChangeNotice({
      message: `Uma tarefa foi excluída da rotina por ${currentProfile.name}. 🗑️`,
      type: 'schedule',
      author: currentProfile.name
    });
  };

  // Journal handlers
  const handleAddJournalEntry = (entryData: {
    authorType: JournalAuthorType;
    title: string;
    content: string;
    date: string;
    time: string;
    expectationsTag?: string;
    feelingMood?: 'happy' | 'calm' | 'tired' | 'anxious' | 'excited' | 'neutral';
  }) => {
    const newEntry: JournalEntry = {
      id: `journal-${Date.now()}`,
      authorType: entryData.authorType,
      authorName: currentProfile.name,
      authorRole: currentProfile.role,
      title: entryData.title,
      content: entryData.content,
      date: entryData.date,
      time: entryData.time,
      expectationsTag: entryData.expectationsTag,
      feelingMood: entryData.feelingMood,
      readByOther: false,
      replies: []
    };
    setJournalEntries(prev => [newEntry, ...prev]);
    setRecentChangeNotice({
      message: `Novo registro postado no Diário por ${currentProfile.name}! 📓`,
      type: 'journal',
      author: currentProfile.name
    });
  };

  const handleToggleJournalRead = (entryId: string) => {
    setJournalEntries(prev => prev.map(e => {
      if (e.id === entryId) {
        return { ...e, readByOther: !e.readByOther };
      }
      return e;
    }));
  };

  const handleAddJournalReply = (entryId: string, replyText: string) => {
    const newReply = {
      id: `reply-${Date.now()}`,
      authorName: currentProfile.name,
      authorRole: currentProfile.role,
      text: replyText,
      createdAt: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    };

    setJournalEntries(prev => prev.map(e => {
      if (e.id === entryId) {
        return {
          ...e,
          replies: [...(e.replies || []), newReply]
        };
      }
      return e;
    }));

    setRecentChangeNotice({
      message: `Nova resposta adicionada ao Diário por ${currentProfile.name}! 💬`,
      type: 'journal',
      author: currentProfile.name
    });
  };

  const handleDeleteJournalEntry = (entryId: string) => {
    setJournalEntries(prev => prev.filter(e => e.id !== entryId));
  };

  const handleDeleteJournalReply = (entryId: string, replyId: string) => {
    setJournalEntries(prev => prev.map(e => {
      if (e.id === entryId) {
        return {
          ...e,
          replies: (e.replies || []).filter(r => r.id !== replyId)
        };
      }
      return e;
    }));
  };

  const handleClearAllPosts = () => {
    setItems([]);
    setJournalEntries([]);
    try {
      localStorage.setItem(STORAGE_ITEMS_KEY, JSON.stringify([]));
      localStorage.setItem(STORAGE_JOURNAL_KEY, JSON.stringify([]));
    } catch {}
  };

  const handleResetData = () => {
    if (window.confirm('Deseja restaurar os dados de exemplo do aplicativo?')) {
      setItems(INITIAL_SCHEDULE_ITEMS);
      setJournalEntries(INITIAL_JOURNAL_ENTRIES);
      localStorage.removeItem(STORAGE_ITEMS_KEY);
      localStorage.removeItem(STORAGE_JOURNAL_KEY);
      setIsSettingsModalOpen(false);
    }
  };

  const handleOpenAddItemWithPreset = (presetCategory?: string) => {
    if (presetCategory) setAddItemCategoryPreset(presetCategory);
    else setAddItemCategoryPreset('routine');
    setIsAddItemOpen(true);
  };

  // Font size multiplier class
  const getFontSizeClass = () => {
    switch (settings.fontSize) {
      case 'large': return 'text-[105%]';
      case 'extra-large': return 'text-[115%]';
      default: return 'text-[100%]';
    }
  };

  // Theme container classes (Pastel & High Contrast 100% Legibility)
  const getThemeClass = () => {
    switch (settings.sensoryTheme) {
      case 'calm-dark': return 'dark bg-slate-950 text-slate-100 min-h-screen';
      case 'high-contrast': return 'dark bg-black text-yellow-300 min-h-screen';
      case 'soft-blue': return 'theme-pastel-blue text-slate-900 min-h-screen';
      case 'soft-rose': return 'theme-pastel-rose text-slate-900 min-h-screen';
      default: return 'theme-pastel-light text-slate-900 min-h-screen';
    }
  };

  if (!isAuthenticated) {
    return (
      <LoginScreen
        profiles={profiles}
        onLoginSuccess={handleLoginSuccess}
        onSelectAvatar={handleSelectAvatar}
      />
    );
  }

  return (
    <div className={`${getThemeClass()} ${getFontSizeClass()} font-sans transition-colors duration-300 pb-20 relative min-h-screen overflow-x-hidden`}>
      
      {/* Background Falling Heart Particles */}
      <HeartParticles />

      {/* Reminder Notification Engine (Browser Native Desktop Notifications + Audio + Visual Toast) */}
      <ReminderNotifier
        items={items}
        settings={settings}
        onToggleComplete={handleToggleComplete}
        onUpdateSettings={handleUpdateSettings}
      />

      {/* Top Header */}
      <Header
        currentProfile={currentProfile}
        allProfiles={profiles}
        onSwitchProfile={setActiveProfileId}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        onOpenSettingsModal={() => setIsSettingsModalOpen(true)}
        onOpenProfileModal={() => setIsLoginModalOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6 relative z-10">
        
        {/* Real-time Compass / Now Banner */}
        <NowBanner
          items={items}
          onToggleComplete={handleToggleComplete}
          speechEnabled={settings.speechEnabled}
        />

        {/* Flashing Alert Banner for Changes & Updates */}
        {(() => {
          const isDhyon = currentProfile.name.toLowerCase().includes('dhyon');
          const myName = isDhyon ? 'Dhyon' : 'Mooniy';
          const otherName = isDhyon ? 'Mooniy' : 'Dhyon';
          const unreadLetters = loveLetters.filter(l => l.recipientName === myName && !l.read);
          const unreadJournal = journalEntries.filter(e => !e.readByOther && (isDhyon ? e.authorRole === 'helper' : e.authorRole === 'user'));

          if (unreadLetters.length === 0 && unreadJournal.length === 0 && !recentChangeNotice) {
            return null;
          }

          return (
            <div className="p-4 rounded-3xl bg-linear-to-r from-amber-500/20 via-rose-500/20 to-teal-500/20 border-2 border-amber-400 dark:border-amber-500 shadow-xl flex items-center justify-between flex-wrap gap-3 animate-pulse">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-amber-500 text-slate-950 font-black text-xl shadow-md shrink-0 animate-bounce">
                  ⚡
                </div>
                <div>
                  <h4 className="text-sm sm:text-base font-black text-slate-900 dark:text-white flex items-center gap-2 flex-wrap">
                    <span>Aviso de Novidade & Alteração</span>
                    <span className="px-2 py-0.5 rounded-full bg-rose-600 text-white text-xs font-black animate-ping">
                      NOVO
                    </span>
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-extrabold mt-0.5">
                    {recentChangeNotice ? recentChangeNotice.message : (
                      unreadLetters.length > 0 && unreadJournal.length > 0
                        ? `Você recebeu ${unreadLetters.length} nova(s) carta(s) de amor e há ${unreadJournal.length} novo(s) recado(s) no diário!`
                        : unreadLetters.length > 0
                          ? `Você recebeu ${unreadLetters.length} nova(s) carta(s) de amor de ${otherName}! 💌`
                          : `Há ${unreadJournal.length} novo(s) recado(s) ou resposta(s) no Diário! 📓`
                    )}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {unreadLetters.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('letters');
                      setRecentChangeNotice(null);
                    }}
                    className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs shadow-md transition-all cursor-pointer flex items-center gap-1.5 hover:scale-105"
                  >
                    <Mail className="w-4 h-4 text-rose-200" />
                    Ver Carta ({unreadLetters.length})
                  </button>
                )}
                {unreadJournal.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('journal');
                      setRecentChangeNotice(null);
                    }}
                    className="px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-black text-xs shadow-md transition-all cursor-pointer flex items-center gap-1.5 hover:scale-105"
                  >
                    <BookOpen className="w-4 h-4 text-teal-200" />
                    Ver Diário ({unreadJournal.length})
                  </button>
                )}
                {recentChangeNotice && (
                  <button
                    type="button"
                    onClick={() => setRecentChangeNotice(null)}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-200 text-xs font-bold hover:bg-slate-700 cursor-pointer"
                  >
                    OK
                  </button>
                )}
              </div>
            </div>
          );
        })()}

        {/* Primary View Navigation Tabs */}
        <div className="flex items-center gap-2.5 overflow-x-auto pb-2 border-b border-slate-200/80 dark:border-slate-800 scrollbar-none py-1">
          <button
            onClick={() => setActiveTab('schedule')}
            className={`px-4.5 py-3 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 shrink-0 transition-all duration-200 cursor-pointer ${
              activeTab === 'schedule'
                ? 'bg-indigo-600 text-white shadow-md scale-[1.02]'
                : 'bg-white/90 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200/90 dark:border-slate-800 hover:bg-indigo-50 hover:text-indigo-800 hover:border-indigo-300 dark:hover:bg-indigo-950/60 dark:hover:text-indigo-200 hover:scale-[1.04] active:scale-[0.97] hover:shadow-sm'
            }`}
          >
            <Calendar className="w-4 h-4 text-indigo-500 dark:text-indigo-400 group-hover:scale-110 transition-transform" />
            Minha Rotina Diária
            {items.filter(i => (i.createdByRole === 'helper' || (i.createdBy && i.createdBy.toLowerCase().includes('mooni'))) && !i.completed).length > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-teal-500 text-white text-[10px] font-black animate-pulse shadow-2xs">
                👩‍⚕️ Tarefas
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('medication')}
            className={`px-4.5 py-3 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 shrink-0 transition-all duration-200 cursor-pointer ${
              activeTab === 'medication'
                ? 'bg-emerald-600 text-white shadow-md scale-[1.02]'
                : 'bg-white/90 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200/90 dark:border-slate-800 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-300 dark:hover:bg-emerald-950/60 dark:hover:text-emerald-200 hover:scale-[1.04] active:scale-[0.97] hover:shadow-sm'
            }`}
          >
            <Pill className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
            Remédios & Médicos
          </button>

          <button
            onClick={() => setActiveTab('websites')}
            className={`px-4.5 py-3 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 shrink-0 transition-all duration-200 cursor-pointer ${
              activeTab === 'websites'
                ? 'bg-amber-500 text-slate-950 shadow-md font-black scale-[1.02]'
                : 'bg-white/90 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200/90 dark:border-slate-800 hover:bg-amber-50 hover:text-amber-900 hover:border-amber-300 dark:hover:bg-amber-950/60 dark:hover:text-amber-200 hover:scale-[1.04] active:scale-[0.97] hover:shadow-sm'
            }`}
          >
            <Globe className="w-4 h-4 text-amber-500 dark:text-amber-400" />
            Sites Recomendados
          </button>

          <button
            onClick={() => setActiveTab('music')}
            className={`px-4.5 py-3 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 shrink-0 transition-all duration-200 cursor-pointer ${
              activeTab === 'music'
                ? 'bg-purple-600 text-white shadow-md scale-[1.02]'
                : 'bg-white/90 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200/90 dark:border-slate-800 hover:bg-purple-50 hover:text-purple-900 hover:border-purple-300 dark:hover:bg-purple-950/60 dark:hover:text-purple-200 hover:scale-[1.04] active:scale-[0.97] hover:shadow-sm'
            }`}
          >
            <Music className="w-4 h-4 text-purple-500 dark:text-purple-400" />
            Músicas & Sons
          </button>

          <button
            onClick={() => setActiveTab('gallery')}
            className={`px-4.5 py-3 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 shrink-0 transition-all duration-200 cursor-pointer ${
              activeTab === 'gallery'
                ? 'bg-rose-500 text-white shadow-md scale-[1.02]'
                : 'bg-white/90 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200/90 dark:border-slate-800 hover:bg-rose-50 hover:text-rose-900 hover:border-rose-300 dark:hover:bg-rose-950/60 dark:hover:text-rose-200 hover:scale-[1.04] active:scale-[0.97] hover:shadow-sm'
            }`}
          >
            <Heart className="w-4 h-4 text-rose-500 fill-rose-400 animate-pulse" />
            Álbum de Fotos Dhyon & Mooniy
          </button>

          <button
            onClick={() => setActiveTab('letters')}
            className={`px-4.5 py-3 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 shrink-0 transition-all duration-200 cursor-pointer ${
              activeTab === 'letters'
                ? 'bg-rose-600 text-white shadow-md scale-[1.02]'
                : 'bg-white/90 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200/90 dark:border-slate-800 hover:bg-rose-50 hover:text-rose-900 hover:border-rose-300 dark:hover:bg-rose-950/60 dark:hover:text-rose-200 hover:scale-[1.04] active:scale-[0.97] hover:shadow-sm'
            }`}
          >
            <Mail className="w-4 h-4 text-rose-500 dark:text-rose-400 animate-bounce" />
            Cartas de Amor 💌
            {(() => {
              const isDhyon = currentProfile.name.toLowerCase().includes('dhyon');
              const myName = isDhyon ? 'Dhyon' : 'Mooniy';
              const count = loveLetters.filter(l => l.recipientName === myName && !l.read).length;
              if (count > 0) {
                return (
                  <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-black animate-bounce shadow-2xs">
                    ⚡ {count} NOVA(S)
                  </span>
                );
              }
              return null;
            })()}
          </button>

          <button
            onClick={() => setActiveTab('journal')}
            className={`px-4.5 py-3 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 shrink-0 transition-all duration-200 cursor-pointer ${
              activeTab === 'journal'
                ? 'bg-teal-700 text-white shadow-md scale-[1.02]'
                : 'bg-white/90 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200/90 dark:border-slate-800 hover:bg-teal-50 hover:text-teal-900 hover:border-teal-300 dark:hover:bg-teal-950/60 dark:hover:text-teal-200 hover:scale-[1.04] active:scale-[0.97] hover:shadow-sm'
            }`}
          >
            <BookOpen className="w-4 h-4 text-teal-600 dark:text-teal-300" />
            Diário Dhyon & Mooniy 📓
            {(() => {
              const isDhyon = currentProfile.name.toLowerCase().includes('dhyon');
              const count = journalEntries.filter(e => !e.readByOther && (isDhyon ? e.authorRole === 'helper' : e.authorRole === 'user')).length;
              if (count > 0) {
                return (
                  <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black animate-pulse shadow-2xs">
                    ⚡ {count} RECADOS
                  </span>
                );
              }
              return null;
            })()}
          </button>
        </div>

        {/* Tab View Content */}
        {activeTab === 'letters' && (
          <LoveLettersSection
            letters={loveLetters}
            currentProfile={currentProfile}
            onSendLetter={handleSendLoveLetter}
            onMarkRead={handleMarkLoveLetterRead}
            onDeleteLetter={handleDeleteLoveLetter}
            speechEnabled={settings.speechEnabled}
          />
        )}

        {activeTab === 'schedule' && (
          <ScheduleView
            items={items}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            currentProfile={currentProfile}
            onToggleComplete={handleToggleComplete}
            onOpenAddItem={handleOpenAddItemWithPreset}
            onDeleteItem={handleDeleteItem}
            speechEnabled={settings.speechEnabled}
          />
        )}

        {activeTab === 'journal' && (
          <CaregiverJournal
            entries={journalEntries}
            currentProfile={currentProfile}
            onAddEntry={handleAddJournalEntry}
            onToggleRead={handleToggleJournalRead}
            onAddReply={handleAddJournalReply}
            onDeleteEntry={handleDeleteJournalEntry}
            onDeleteReply={handleDeleteJournalReply}
            speechEnabled={settings.speechEnabled}
          />
        )}

        {activeTab === 'medication' && (
          <MedicationTracker
            items={items}
            currentProfile={currentProfile}
            onToggleComplete={handleToggleComplete}
            onOpenAddItem={handleOpenAddItemWithPreset}
            onDeleteItem={handleDeleteItem}
            speechEnabled={settings.speechEnabled}
          />
        )}

        {activeTab === 'websites' && (
          <WebsitesSection
            items={items}
            currentProfile={currentProfile}
            onOpenAddItem={handleOpenAddItemWithPreset}
            onDeleteItem={handleDeleteItem}
          />
        )}

        {activeTab === 'music' && (
          <MusicSection
            items={items}
            currentProfile={currentProfile}
            onOpenAddItem={handleOpenAddItemWithPreset}
            onDeleteItem={handleDeleteItem}
          />
        )}

        {activeTab === 'gallery' && (
          <GallerySection
            items={items}
            currentProfile={currentProfile}
            onOpenAddItem={handleOpenAddItemWithPreset}
            onDeleteItem={handleDeleteItem}
            speechEnabled={settings.speechEnabled}
          />
        )}

      </main>

      {/* Footer Banner */}
      <footer className="mt-16 border-t border-slate-200 dark:border-slate-800 py-8 bg-white/60 dark:bg-slate-900/60">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-2">
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium flex items-center justify-center gap-1.5">
            <HeartHandshake className="w-4 h-4 text-rose-500" />
            Desenvolvido com carinho para autismo e acessibilidade sensorial.
          </p>
          <p className="text-[11px] text-slate-400 dark:text-slate-500">
            Você está logado como: <strong>{currentProfile.name}</strong> ({currentProfile.role === 'helper' ? 'Apoiador' : 'Usuário Principal'})
          </p>
        </div>
      </footer>

      {/* Modals */}
      <AddItemModal
        isOpen={isAddItemOpen}
        onClose={() => setIsAddItemOpen(false)}
        onAddItem={handleAddItem}
        currentProfile={currentProfile}
        defaultCategory={addItemCategoryPreset}
        selectedDate={selectedDate}
      />

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        profiles={profiles}
        currentProfile={currentProfile}
        onSelectProfile={setActiveProfileId}
        onSelectAvatar={handleSelectAvatar}
      />

      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        onResetData={handleResetData}
        onClearAllPosts={handleClearAllPosts}
      />

      {/* Automatic Love Letter Popup on Opening App */}
      {autoPopupLetter && (
        <LoveLetterModal
          letter={autoPopupLetter}
          onClose={() => setAutoPopupLetter(null)}
          onMarkRead={handleMarkLoveLetterRead}
          onOpenReply={(letter) => {
            setAutoPopupLetter(null);
            setActiveTab('letters');
          }}
          speechEnabled={settings.speechEnabled}
          isAutoPopup={true}
        />
      )}

    </div>
  );
}
