import { UserProfile, ScheduleItem, JournalEntry, LoveLetter } from '../types';
import { getTodayDateString } from '../utils/date';

export const INITIAL_PROFILES: UserProfile[] = [
  {
    id: 'user-main',
    name: 'Dhyon',
    role: 'user',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    pin: '32115321',
    description: 'Perfil pessoal de Dhyon.'
  },
  {
    id: 'helper-main',
    name: 'Mooniy (Apoiadora / Cuidadora)',
    role: 'helper',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    pin: '12345',
    description: 'Perfil de Mooniy - Apoiadora autorizada.'
  }
];

const today = getTodayDateString();

export const INITIAL_SCHEDULE_ITEMS: ScheduleItem[] = [];

export const INITIAL_JOURNAL_ENTRIES: JournalEntry[] = [];

export const INITIAL_LOVE_LETTERS: LoveLetter[] = [
  {
    id: 'letter-parchment-demo',
    senderName: 'Mooniy',
    senderRole: 'helper',
    recipientName: 'Dhyon',
    recipientRole: 'user',
    title: 'Pergaminho Sagrado de Amor 📜',
    message: 'Meu amado Dhyon,\n\nEste pergaminho foi selado à mão especialmente para você. Quero te dizer que o meu amor por você não tem fim. Você ilumina todos os meus dias e torna a minha vida completa.\n\nCom todo carinho, abraços quentinhos e todo meu coração! 🌹✨',
    paperStyle: 'parchment',
    fontFamily: 'dancing',
    themeColor: 'golden',
    fontColor: 'sepia',
    moodEmoji: '📜',
    sealIcon: 'scroll',
    photoUrl: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=800&auto=format&fit=crop&q=80',
    createdAt: new Date().toISOString(),
    date: today,
    read: false
  },
  {
    id: 'letter-welcome',
    senderName: 'Mooniy',
    senderRole: 'helper',
    recipientName: 'Dhyon',
    recipientRole: 'user',
    title: 'Minha Carta Especial de Amor pra Você! 💖',
    message: 'Meu querido Dhyon, fiz esta cartinha especial para te lembrar o quanto você é incrível, forte e importante na minha vida. Cada momento ao seu lado é um presente. Lembre-se sempre de sorrir, descansar com calma e saber que estou sempre aqui por você com todo meu carinho e amor! 🧸✨',
    paperStyle: 'teddy_bear',
    fontFamily: 'caveat',
    themeColor: 'rose',
    fontColor: 'crimson',
    moodEmoji: '🥰',
    sealIcon: 'bear',
    photoUrl: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800&auto=format&fit=crop&q=80',
    createdAt: new Date().toISOString(),
    date: today,
    read: true
  }
];


