import React, { useEffect, useState } from 'react';
import { DatabaseService, LeaderboardEntry } from '../lib/database';

interface Props {
  onClose: () => void;
  dbService: DatabaseService;
}

export const Leaderboard: React.FC<Props> = ({ onClose, dbService }) => {
  const [scores, setScores] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | number>('all');

  useEffect(() => {
    loadScores();
  }, [filter]);

  const loadScores = async () => {
    setLoading(true);
    const data = await dbService.getTopScores(10, filter === 'all' ? undefined : filter);
    setScores(data);
    setLoading(false);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const getMedalEmoji = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `${rank}.`;
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-b from-slate-800 to-slate-900 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden border-4 border-yellow-500">
        {/* Header */}
        <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-6 text-center">
          <h2 className="text-4xl font-black text-white drop-shadow-lg">
            🏆 SKOR TABLOSU 🏆
          </h2>
          <p className="text-white/90 mt-2">En İyi Oyuncular</p>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 p-4 bg-slate-900/50 border-b-2 border-slate-700 overflow-x-auto">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-bold transition-all whitespace-nowrap ${
              filter === 'all'
                ? 'bg-yellow-500 text-black shadow-lg'
                : 'bg-slate-700 text-white hover:bg-slate-600'
            }`}
          >
            Tümü
          </button>
          {[1, 2, 3, 4].map(level => (
            <button
              key={level}
              onClick={() => setFilter(level)}
              className={`px-4 py-2 rounded-lg font-bold transition-all whitespace-nowrap ${
                filter === level
                  ? 'bg-yellow-500 text-black shadow-lg'
                  : 'bg-slate-700 text-white hover:bg-slate-600'
              }`}
            >
              Bölüm {level}
            </button>
          ))}
        </div>

        {/* Scores List */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {loading ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4 animate-bounce">⏳</div>
              <div className="text-white text-xl">Yükleniyor...</div>
            </div>
          ) : scores.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🎮</div>
              <div className="text-white text-xl">Henüz skor yok!</div>
              <div className="text-gray-400 mt-2">İlk skoru kaydet!</div>
            </div>
          ) : (
            <div className="space-y-3">
              {scores.map((entry, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-4 p-4 rounded-xl transition-all hover:scale-102 ${
                    index < 3
                      ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-2 border-yellow-500/50'
                      : 'bg-slate-800 border-2 border-slate-700'
                  }`}
                >
                  {/* Rank */}
                  <div className="text-3xl font-black w-12 text-center">
                    {getMedalEmoji(index + 1)}
                  </div>

                  {/* Player Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="text-white font-bold text-lg truncate">
                        {entry.player_name}
                      </div>
                      <div className="text-xs bg-slate-700 px-2 py-0.5 rounded text-gray-300">
                        {entry.game_mode === 'multi' ? '👥' : '👤'} {entry.character || 'N/A'}
                      </div>
                    </div>
                    <div className="flex gap-4 text-sm text-gray-300">
                      <span>🥐 {entry.coins_collected}</span>
                      <span>⚔️ {entry.enemies_defeated}</span>
                      <span>💀 {entry.death_count}</span>
                      <span>⏱️ {formatTime(entry.time_seconds)}</span>
                    </div>
                  </div>

                  {/* Score */}
                  <div className="text-right">
                    <div className="text-3xl font-black text-yellow-400">
                      {entry.score.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-400">
                      Bölüm {entry.level_reached}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Close Button */}
        <div className="p-4 bg-slate-900/50 border-t-2 border-slate-700">
          <button
            onClick={onClose}
            className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-colors shadow-lg"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
};
