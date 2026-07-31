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

export type SensoryTheme = 'soft-light' | 'soft-rose' | 'high-contrast' | 'calm-dark' | 'soft-blue';

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

export type LetterPaperStyle = 'classic_envelope' | 'parchment' | 'teddy_bear' | 'heart_seal';
export type LetterFontFamily = 'dancing' | 'caveat' | 'playfair' | 'pacifico' | 'sans';
export type LetterThemeColor = 'rose' | 'crimson' | 'lavender' | 'golden' | 'emerald';
export type LetterFontColor = 'white' | 'black' | 'crimson' | 'sepia' | 'purple' | 'gold' | 'midnight' | 'rose' | 'charcoal' | 'emerald' | 'navy';
export type LetterBgColor = 'vintage_parchment' | 'white' | 'dark_black' | 'rose_pink' | 'romantic_red' | 'lavender_purple' | 'golden_amber' | 'emerald_green' | 'midnight_blue' | 'sweet_peach';

export interface LoveLetter {
  id: string;
  senderName: string;
  senderRole: UserRole;
  recipientName: string;
  recipientRole: UserRole;
  title: string;
  message: string;
  paperStyle: LetterPaperStyle;
  fontFamily: LetterFontFamily;
  themeColor: LetterThemeColor;
  fontColor?: LetterFontColor;
  bgColor?: LetterBgColor;
  moodEmoji?: string;
  photoUrl?: string;
  videoUrl?: string;
  audioUrl?: string; // Voice recording or link
  createdAt: string;
  date: string;
  read: boolean;
  sealIcon?: 'heart' | 'bear' | 'sparkle' | 'rose' | 'ring' | 'crown' | 'kiss' | 'scroll';
}

export interface PrivateNote {
  id: string;
  ownerProfileId: string; // Profile ID of owner (e.g. 'user-dhyon' or 'caregiver-mooni')
  title: string;
  content: string;
  date: string;       // YYYY-MM-DD
  time: string;       // HH:MM
  category?: 'agenda' | 'todo' | 'secret' | 'reminder';
  completed?: boolean;
  colorTag?: string;  // Hex or Tailwind color name
  createdAt: string;
}
