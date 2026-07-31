export interface AvatarPreset {
  id: string;
  emoji: string;
  label: string;
  bgClass: string;
  borderClass: string;
}

export const AVATAR_PRESETS: AvatarPreset[] = [
  { id: 'bear', emoji: '🧸', label: 'Ursinho Fofo', bgClass: 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200', borderClass: 'border-amber-300 dark:border-amber-700' },
  { id: 'heart', emoji: '💖', label: 'Coração', bgClass: 'bg-rose-100 text-rose-900 dark:bg-rose-950 dark:text-rose-200', borderClass: 'border-rose-300 dark:border-rose-700' },
  { id: 'rose', emoji: '🌹', label: 'Rosa Romântica', bgClass: 'bg-pink-100 text-pink-900 dark:bg-pink-950 dark:text-pink-200', borderClass: 'border-pink-300 dark:border-pink-700' },
  { id: 'crown', emoji: '👑', label: 'Coroa Imperial', bgClass: 'bg-amber-200 text-amber-950 dark:bg-amber-900 dark:text-amber-100', borderClass: 'border-amber-400 dark:border-amber-600' },
  { id: 'ring', emoji: '💍', label: 'Aliança Eterna', bgClass: 'bg-indigo-100 text-indigo-950 dark:bg-indigo-950 dark:text-indigo-200', borderClass: 'border-indigo-300 dark:border-indigo-700' },
  { id: 'sparkle', emoji: '✨', label: 'Estrela Mágica', bgClass: 'bg-yellow-100 text-yellow-950 dark:bg-yellow-950 dark:text-yellow-200', borderClass: 'border-yellow-300 dark:border-yellow-700' },
  { id: 'cat', emoji: '🐱', label: 'Gatinho Fofo', bgClass: 'bg-orange-100 text-orange-950 dark:bg-orange-950 dark:text-orange-200', borderClass: 'border-orange-300 dark:border-orange-700' },
  { id: 'dog', emoji: '🐶', label: 'Cachorrinho', bgClass: 'bg-amber-100 text-amber-950 dark:bg-amber-950 dark:text-amber-200', borderClass: 'border-amber-300 dark:border-amber-700' },
  { id: 'butterfly', emoji: '🦋', label: 'Borboleta', bgClass: 'bg-sky-100 text-sky-950 dark:bg-sky-950 dark:text-sky-200', borderClass: 'border-sky-300 dark:border-sky-700' },
  { id: 'music', emoji: '🎶', label: 'Nota Musical', bgClass: 'bg-purple-100 text-purple-950 dark:bg-purple-950 dark:text-purple-200', borderClass: 'border-purple-300 dark:border-purple-700' },
  { id: 'coffee', emoji: '☕', label: 'Cafezinho', bgClass: 'bg-amber-100 text-amber-950 dark:bg-amber-950 dark:text-amber-200', borderClass: 'border-amber-400 dark:border-amber-700' },
  { id: 'gift', emoji: '🎁', label: 'Presente Especial', bgClass: 'bg-rose-100 text-rose-950 dark:bg-rose-950 dark:text-rose-200', borderClass: 'border-rose-300 dark:border-rose-700' },
  { id: 'rainbow', emoji: '🌈', label: 'Arco-íris', bgClass: 'bg-teal-100 text-teal-950 dark:bg-teal-950 dark:text-teal-200', borderClass: 'border-teal-300 dark:border-teal-700' },
  { id: 'diamond', emoji: '💎', label: 'Diamante Raro', bgClass: 'bg-cyan-100 text-cyan-950 dark:bg-cyan-950 dark:text-cyan-200', borderClass: 'border-cyan-300 dark:border-cyan-700' },
  { id: 'sun', emoji: '☀️', label: 'Sol Iluminado', bgClass: 'bg-amber-100 text-amber-950 dark:bg-amber-950 dark:text-amber-200', borderClass: 'border-amber-400 dark:border-amber-700' },
  { id: 'moon', emoji: '🌙', label: 'Lua Estelar', bgClass: 'bg-slate-800 text-indigo-200 border-slate-700', borderClass: 'border-slate-600' },
  { id: 'flame', emoji: '🔥', label: 'Chama Quente', bgClass: 'bg-rose-100 text-rose-950 dark:bg-rose-950 dark:text-rose-200', borderClass: 'border-rose-400 dark:border-rose-700' },
  { id: 'inlove', emoji: '🥰', label: 'Apaixonado(a)', bgClass: 'bg-pink-100 text-pink-950 dark:bg-pink-950 dark:text-pink-200', borderClass: 'border-pink-300 dark:border-pink-700' },
  { id: 'scroll', emoji: '📜', label: 'Pergaminho', bgClass: 'bg-amber-100 text-amber-950 dark:bg-amber-950 dark:text-amber-200', borderClass: 'border-amber-400 dark:border-amber-700' },
  { id: 'dove', emoji: '🕊️', label: 'Pomba da Paz', bgClass: 'bg-blue-100 text-blue-950 dark:bg-blue-950 dark:text-blue-200', borderClass: 'border-blue-300 dark:border-blue-700' },
  { id: 'clover', emoji: '🍀', label: 'Trevo da Sorte', bgClass: 'bg-emerald-100 text-emerald-950 dark:bg-emerald-950 dark:text-emerald-200', borderClass: 'border-emerald-300 dark:border-emerald-700' },
  { id: 'rocket', emoji: '🚀', label: 'Foguete', bgClass: 'bg-violet-100 text-violet-950 dark:bg-violet-950 dark:text-violet-200', borderClass: 'border-violet-300 dark:border-violet-700' }
];

export function getAvatarPresetByEmojiOrId(avatarStr: string): AvatarPreset | null {
  if (!avatarStr) return null;
  if (avatarStr.startsWith('http')) return null;

  // Search by emoji or id
  const found = AVATAR_PRESETS.find(p => p.emoji === avatarStr || p.id === avatarStr || avatarStr === `icon:${p.id}`);
  if (found) return found;

  // If it's a raw emoji string not in list, fallback preset
  return {
    id: 'custom',
    emoji: avatarStr.replace('icon:', ''),
    label: 'Ícone Especial',
    bgClass: 'bg-rose-100 text-rose-900 dark:bg-rose-950 dark:text-rose-200',
    borderClass: 'border-rose-300 dark:border-rose-700'
  };
}
