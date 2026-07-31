import React, { useState, useEffect } from 'react';
import { ScheduleItem, UserProfile, AppSettings, SensoryTheme, JournalEntry, JournalAuthorType } from './types';
import { INITIAL_PROFILES, INITIAL_SCHEDULE_ITEMS, INITIAL_JOURNAL_ENTRIES } from './data/initialData';
import { getTodayDateString } from './utils/date';
import { Header } from './components/Header';
import { NowBanner } from './components/NowBanner';
import { ScheduleView } from './components/ScheduleView';
import { MedicationTracker } from './components/MedicationTracker';
import { WebsitesSection } from './components/WebsitesSection';
import { MusicSection } from './components/MusicSection';
import { GallerySection } from './components/GallerySection';
import { CaregiverJournal } from './components/CaregiverJournal';
import { AddItemModal } from './components/AddItemModal';
import { LoginModal } from './components/LoginModal';
import { SettingsModal } from './components/SettingsModal';
import { ReminderNotifier } from './components/ReminderNotifier';
import { Calendar, Pill, Globe, Music, Image as ImageIcon, HeartHandshake, ShieldCheck, Sparkles, BookOpen, Heart } from 'lucide-react';

export default function App() {
  // Local storage keys
  const STORAGE_ITEMS_KEY = 'meu_dia_seguro_items_v2';
  const STORAGE_SETTINGS_KEY = 'meu_dia_seguro_settings_v2';
  const STORAGE_PROFILE_KEY = 'meu_dia_seguro_profile_v2';
  const STORAGE_JOURNAL_KEY = 'meu_dia_seguro_journal_v2';

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
  const profiles = INITIAL_PROFILES;
  const [activeProfileId, setActiveProfileId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_PROFILE_KEY);
      return saved || 'user-main';
    } catch {
      return 'user-main';
    }
  });

  // Active view state
  const [selectedDate, setSelectedDate] = useState<string>(getTodayDateString());
  const [activeTab, setActiveTab] = useState<'schedule' | 'medication' | 'websites' | 'music' | 'gallery' | 'journal'>('schedule');

  // Modals state
  const [isAddItemOpen, setIsAddItemOpen] = useState(false);
  const [addItemCategoryPreset, setAddItemCategoryPreset] = useState<string>('routine');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

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
      localStorage.setItem(STORAGE_SETTINGS_KEY, JSON.stringify(settings));
    } catch {}
  }, [settings]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_PROFILE_KEY, activeProfileId);
    } catch {}
  }, [activeProfileId]);

  const currentProfile = profiles.find(p => p.id === activeProfileId) || profiles[0];

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
  };

  const handleDeleteItem = (itemId: string) => {
    setItems(prev => prev.filter(i => i.id !== itemId));
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
  };

  const handleDeleteJournalEntry = (entryId: string) => {
    setJournalEntries(prev => prev.filter(e => e.id !== entryId));
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

  // Theme container classes
  const getThemeClass = () => {
    switch (settings.sensoryTheme) {
      case 'calm-dark': return 'dark bg-slate-950 text-slate-100 min-h-screen';
      case 'high-contrast': return 'dark bg-black text-yellow-300 min-h-screen';
      case 'soft-blue': return 'bg-sky-50/50 text-slate-900 min-h-screen';
      default: return 'bg-slate-50/70 text-slate-900 min-h-screen';
    }
  };

  return (
    <div className={`${getThemeClass()} ${getFontSizeClass()} font-sans transition-colors duration-300 pb-20`}>
      
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
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        
        {/* Real-time Compass / Now Banner */}
        <NowBanner
          items={items}
          onToggleComplete={handleToggleComplete}
          speechEnabled={settings.speechEnabled}
        />

        {/* Primary View Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200/80 dark:border-slate-800 scrollbar-none">
          <button
            onClick={() => setActiveTab('schedule')}
            className={`px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 shrink-0 transition-all ${
              activeTab === 'schedule'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-800 hover:bg-slate-100'
            }`}
          >
            <Calendar className="w-4 h-4" />
            Minha Rotina Diária
          </button>

          <button
            onClick={() => setActiveTab('medication')}
            className={`px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 shrink-0 transition-all ${
              activeTab === 'medication'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-800 hover:bg-slate-100'
            }`}
          >
            <Pill className="w-4 h-4" />
            Remédios & Médicos
          </button>

          <button
            onClick={() => setActiveTab('websites')}
            className={`px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 shrink-0 transition-all ${
              activeTab === 'websites'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-800 hover:bg-slate-100'
            }`}
          >
            <Globe className="w-4 h-4" />
            Sites Recomendados
          </button>

          <button
            onClick={() => setActiveTab('music')}
            className={`px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 shrink-0 transition-all ${
              activeTab === 'music'
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-800 hover:bg-slate-100'
            }`}
          >
            <Music className="w-4 h-4" />
            Músicas & Sons
          </button>

          <button
            onClick={() => setActiveTab('gallery')}
            className={`px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 shrink-0 transition-all ${
              activeTab === 'gallery'
                ? 'bg-rose-500 text-white shadow-md'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-800 hover:bg-slate-100'
            }`}
          >
            <Heart className="w-4 h-4 text-rose-400 fill-rose-400" />
            Álbum de Fotos Dhyon & Mooniy
          </button>

          <button
            onClick={() => setActiveTab('journal')}
            className={`px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 shrink-0 transition-all ${
              activeTab === 'journal'
                ? 'bg-teal-700 text-white shadow-md'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-800 hover:bg-slate-100'
            }`}
          >
            <BookOpen className="w-4 h-4 text-amber-300" />
            Diário da Cuidadora & Recados
            {journalEntries.filter(e => !e.readByOther && e.authorType === 'caregiver_to_user').length > 0 && (
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
            )}
          </button>
        </div>

        {/* Tab View Content */}
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
            speechEnabled={settings.speechEnabled}
          />
        )}

        {activeTab === 'medication' && (
          <MedicationTracker
            items={items}
            currentProfile={currentProfile}
            onToggleComplete={handleToggleComplete}
            onOpenAddItem={handleOpenAddItemWithPreset}
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
      />

      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        onResetData={handleResetData}
      />

    </div>
  );
}
