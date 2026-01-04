export interface AchievementDefinition {
  id: string;
  name: string;
  description: string;
  icon: string;
  condition: (stats: GameStats) => boolean;
}

export interface GameStats {
  score: number;
  level: number;
  coinsCollected: number;
  enemiesDefeated: number;
  timeSeconds: number;
  deathCount: number;
  gameMode: 'solo' | 'multi';
  character: 'cemre' | 'baba' | 'both';
  perfectJumps: number;
  powerUpsUsed: number;
}

export const ACHIEVEMENTS: AchievementDefinition[] = [
  {
    id: 'first_steps',
    name: 'İlk Adımlar',
    description: 'Oyunu ilk kez başlat',
    icon: '👣',
    condition: () => true
  },
  {
    id: 'level_1_complete',
    name: 'Kış Savaşçısı',
    description: 'Bölüm 1\'i tamamla',
    icon: '❄️',
    condition: (stats) => stats.level >= 2
  },
  {
    id: 'level_2_complete',
    name: 'Kelebek Avcısı',
    description: 'Bölüm 2\'yi tamamla',
    icon: '🦋',
    condition: (stats) => stats.level >= 3
  },
  {
    id: 'level_3_complete',
    name: 'Meyve Toplayıcı',
    description: 'Bölüm 3\'ü tamamla',
    icon: '🍎',
    condition: (stats) => stats.level >= 4
  },
  {
    id: 'game_master',
    name: 'Oyun Ustası',
    description: 'Tüm bölümleri bitir',
    icon: '👑',
    condition: (stats) => stats.level > 4
  },
  {
    id: 'coin_collector',
    name: 'Koleksiyoncu',
    description: '50 para topla',
    icon: '🥐',
    condition: (stats) => stats.coinsCollected >= 50
  },
  {
    id: 'coin_master',
    name: 'Para Ustası',
    description: '100 para topla',
    icon: '💰',
    condition: (stats) => stats.coinsCollected >= 100
  },
  {
    id: 'high_scorer',
    name: 'Yüksek Skor',
    description: '500 puan topla',
    icon: '⭐',
    condition: (stats) => stats.score >= 500
  },
  {
    id: 'mega_scorer',
    name: 'Mega Skor',
    description: '1000 puan topla',
    icon: '🌟',
    condition: (stats) => stats.score >= 1000
  },
  {
    id: 'survivor',
    name: 'Hayatta Kalma Uzmanı',
    description: 'Hiç ölmeden bir bölümü bitir',
    icon: '💚',
    condition: (stats) => stats.deathCount === 0 && stats.level >= 2
  },
  {
    id: 'speed_runner',
    name: 'Hız Canavarı',
    description: 'Bölüm 1\'i 3 dakikadan kısa sürede bitir',
    icon: '⚡',
    condition: (stats) => stats.level >= 2 && stats.timeSeconds <= 180
  },
  {
    id: 'enemy_hunter',
    name: 'Canavar Avcısı',
    description: '20 düşmanı yok et',
    icon: '⚔️',
    condition: (stats) => stats.enemiesDefeated >= 20
  },
  {
    id: 'perfect_jumper',
    name: 'Mükemmel Zıplayıcı',
    description: '50 mükemmel zıplama yap',
    icon: '🎯',
    condition: (stats) => stats.perfectJumps >= 50
  },
  {
    id: 'power_user',
    name: 'Güç Kullanıcısı',
    description: '10 güç artırıcı kullan',
    icon: '🔋',
    condition: (stats) => stats.powerUpsUsed >= 10
  },
  {
    id: 'duo_master',
    name: 'İkili Usta',
    description: 'İki kişilik modda oyunu bitir',
    icon: '👥',
    condition: (stats) => stats.gameMode === 'multi' && stats.level > 4
  },
  {
    id: 'solo_hero',
    name: 'Solo Kahraman',
    description: 'Tek kişilik modda oyunu bitir',
    icon: '🦸',
    condition: (stats) => stats.gameMode === 'solo' && stats.level > 4
  }
];

export class AchievementTracker {
  private unlockedAchievements: Set<string> = new Set();
  private stats: GameStats = {
    score: 0,
    level: 1,
    coinsCollected: 0,
    enemiesDefeated: 0,
    timeSeconds: 0,
    deathCount: 0,
    gameMode: 'multi',
    character: 'both',
    perfectJumps: 0,
    powerUpsUsed: 0
  };

  updateStats(newStats: Partial<GameStats>) {
    this.stats = { ...this.stats, ...newStats };
  }

  checkAchievements(): AchievementDefinition[] {
    const newlyUnlocked: AchievementDefinition[] = [];

    for (const achievement of ACHIEVEMENTS) {
      if (!this.unlockedAchievements.has(achievement.id) && achievement.condition(this.stats)) {
        this.unlockedAchievements.add(achievement.id);
        newlyUnlocked.push(achievement);
      }
    }

    return newlyUnlocked;
  }

  getStats(): GameStats {
    return { ...this.stats };
  }

  getUnlockedCount(): number {
    return this.unlockedAchievements.size;
  }

  getUnlockedIds(): string[] {
    return Array.from(this.unlockedAchievements);
  }

  reset() {
    this.stats = {
      score: 0,
      level: 1,
      coinsCollected: 0,
      enemiesDefeated: 0,
      timeSeconds: 0,
      deathCount: 0,
      gameMode: 'multi',
      character: 'both',
      perfectJumps: 0,
      powerUpsUsed: 0
    };
  }
}
