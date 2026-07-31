import React, { useMemo } from 'react';
import { Heart } from 'lucide-react';

interface Particle {
  id: number;
  left: number; // percentage 0-100
  size: number; // px 12-28
  duration: number; // seconds 8-20
  delay: number; // seconds 0-10
  opacity: number; // 0.15 - 0.4
  color: string;
}

export const HeartParticles: React.FC = () => {
  const particles = useMemo<Particle[]>(() => {
    const colors = [
      'text-rose-300 dark:text-rose-500/30',
      'text-pink-300 dark:text-pink-500/30',
      'text-amber-300 dark:text-amber-500/30',
      'text-teal-300 dark:text-teal-500/30',
      'text-purple-300 dark:text-purple-500/30',
    ];

    return Array.from({ length: 18 }, (_, i) => ({
      id: i,
      left: Math.floor(Math.random() * 95),
      size: Math.floor(Math.random() * 16) + 12,
      duration: Math.floor(Math.random() * 12) + 10,
      delay: Math.floor(Math.random() * 8),
      opacity: Math.random() * 0.25 + 0.15,
      color: colors[i % colors.length]
    }));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map(particle => (
        <div
          key={particle.id}
          className={`absolute top-0 animate-falling-heart ${particle.color}`}
          style={{
            left: `${particle.left}%`,
            opacity: particle.opacity,
            ['--fall-duration' as string]: `${particle.duration}s`,
            ['--fall-delay' as string]: `${particle.delay}s`,
          }}
        >
          <Heart
            style={{ width: `${particle.size}px`, height: `${particle.size}px` }}
            className="fill-current transform hover:scale-125 transition-transform"
          />
        </div>
      ))}
    </div>
  );
};
