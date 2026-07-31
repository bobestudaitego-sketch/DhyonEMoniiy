import React from 'react';
import { getAvatarPresetByEmojiOrId } from '../data/avatarPresets';

interface ProfileAvatarProps {
  avatar: string;
  name?: string;
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

export const ProfileAvatar: React.FC<ProfileAvatarProps> = ({
  avatar,
  name = '',
  className = '',
  size = 'md'
}) => {
  const preset = getAvatarPresetByEmojiOrId(avatar);

  const sizeClasses = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-lg',
    lg: 'w-14 h-14 text-2xl',
    xl: 'w-20 h-20 text-4xl'
  };

  const selectedSize = sizeClasses[size] || sizeClasses.md;

  if (!preset && (avatar.startsWith('http://') || avatar.startsWith('https://') || avatar.startsWith('data:'))) {
    return (
      <img
        src={avatar}
        alt={name}
        className={`${selectedSize} rounded-2xl object-cover border-2 border-white/40 shadow-sm ${className}`}
      />
    );
  }

  // Preset icon / emoji avatar
  const emoji = preset ? preset.emoji : (avatar || '🧸');
  const bgClass = preset ? preset.bgClass : 'bg-rose-100 text-rose-950 dark:bg-rose-950 dark:text-rose-200';
  const borderClass = preset ? preset.borderClass : 'border-rose-300 dark:border-rose-700';

  return (
    <div
      className={`${selectedSize} rounded-2xl ${bgClass} border-2 ${borderClass} shadow-xs flex items-center justify-center font-bold shrink-0 select-none ${className}`}
      title={preset ? preset.label : name}
    >
      <span>{emoji}</span>
    </div>
  );
};
