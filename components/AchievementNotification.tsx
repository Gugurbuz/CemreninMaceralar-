import React, { useEffect, useState } from 'react';
import { AchievementDefinition } from '../lib/achievements';

interface Props {
  achievement: AchievementDefinition | null;
  onDismiss: () => void;
}

export const AchievementNotification: React.FC<Props> = ({ achievement, onDismiss }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (achievement) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onDismiss, 300);
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [achievement, onDismiss]);

  if (!achievement) return null;

  return (
    <div
      className={`fixed top-20 right-4 z-50 transform transition-all duration-300 ${
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}
    >
      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-4 rounded-xl shadow-2xl border-4 border-yellow-200 min-w-[300px] animate-bounce">
        <div className="flex items-center gap-4">
          <div className="text-5xl">{achievement.icon}</div>
          <div className="flex-1">
            <div className="font-black text-lg uppercase tracking-wide mb-1">
              Başarım Açıldı!
            </div>
            <div className="font-bold text-xl">{achievement.name}</div>
            <div className="text-sm opacity-90 mt-1">{achievement.description}</div>
          </div>
        </div>
        <div className="mt-3 h-1 bg-white/30 rounded-full overflow-hidden">
          <div
            className="h-full bg-white rounded-full animate-pulse"
            style={{ animation: 'shrink 4s linear' }}
          />
        </div>
      </div>
      <style>{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
};
