export type UserRole = 'user' | 'helper';

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  avatar: string;
  pin?: string;
  description: string;
}

export type ItemCategory = 
  | 'medical'      // Médico / Consulta
  | 'medication'   // Remédios
  | 'routine'      // Rotina diária
  | 'website'      // Site recomendado / Link
  | 'music'        // Música / Som relaxante
  | 'image_note'   // Imagem + Texto informativo
  | 'reminder';    // Lembrete geral

export interface ScheduleItem {
  id: string;
  title: string;
  description: string;
  category: ItemCategory;
  date: string;       // YYYY-MM-DD
  startTime: string;  // HH:MM
  endTime?: string;   // HH:MM
  completed: boolean;
  completedAt?: string;
  imageUrl?: string;
  linkUrl?: string;
  musicUrl?: string;
  createdBy: string;  // Nome de quem adicionou
  createdByRole: UserRole;
  createdAt: string;
  important: boolean;
  recurring?: 'none' | 'daily' | 'weekly';
  colorTag?: string;
  medicalNote?: string; // e.g., "Tomar com água após o almoço"
}

export type SensoryTheme = 'soft-light' | 'high-contrast' | 'calm-dark' | 'soft-blue';

export type FontSizeOption = 'normal' | 'large' | 'extra-large';

export type JournalAuthorType = 'caregiver_to_user' | 'user_to_caregiver';

export interface JournalReply {
  id: string;
  authorName: string;
  authorRole: UserRole;
  text: string;
  createdAt: string;
}

export interface JournalEntry {
  id: string;
  authorType: JournalAuthorType;
  authorName: string;
  authorRole: UserRole;
  title: string;
  content: string;
  date: string;       // YYYY-MM-DD
  time: string;       // HH:MM
  feelingMood?: 'happy' | 'calm' | 'tired' | 'anxious' | 'excited' | 'neutral';
  expectationsTag?: string; // e.g. "Expectativa do Dia", "Sentimentos", "Orientações", "Agradecimento"
  readByOther: boolean;
  replies?: JournalReply[];
}

export interface AppSettings {
  sensoryTheme: SensoryTheme;
  fontSize: FontSizeOption;
  soundEnabled: boolean;
  speechEnabled: boolean;
  notificationsEnabled?: boolean;
  activeProfileId: string;
}
