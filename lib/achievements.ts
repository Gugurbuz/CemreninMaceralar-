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
  wallJumps: number;
  dashesUsed: number;
  groundPounds: number;
  comboMax: number;
  secretsFound: number;
  miniBossesDefeated: number;
  bossDefeated: boolean;
}

export const ACHIEVEMENTS: AchievementDefinition[] = [
  {
    id: 'first_steps',
    name: 'Ilk Adimlar',
    description: 'Oyunu ilk kez baslat',
    icon: '👣',
    condition: () => true
  },
  {
    id: 'level_1_complete',
    name: 'Kis Savascisi',
    description: 'Bolum 1\'i tamamla',
    icon: '❄️',
    condition: (stats) => stats.level >= 2
  },
  {
    id: 'level_2_complete',
    name: 'Kelebek Avcisi',
    description: 'Bolum 2\'yi tamamla',
    icon: '🦋',
    condition: (stats) => stats.level >= 3
  },
  {
    id: 'level_3_complete',
    name: 'Meyve Toplayici',
    description: 'Bolum 3\'u tamamla',
    icon: '🍎',
    condition: (stats) => stats.level >= 4
  },
  {
    id: 'level_4_complete',
    name: 'Boss Avcisi',
    description: 'Bolum 4\'u tamamla',
    icon: '👹',
    condition: (stats) => stats.level >= 5
  },
  {
    id: 'level_5_complete',
    name: 'Magara Kâsifi',
    description: 'Bolum 5\'i tamamla',
    icon: '🦇',
    condition: (stats) => stats.level >= 6
  },
  {
    id: 'level_6_complete',
    name: 'Gokyuzu Gezgini',
    description: 'Bolum 6\'yi tamamla',
    icon: '☁️',
    condition: (stats) => stats.level >= 7
  },
  {
    id: 'game_master',
    name: 'Oyun Ustasi',
    description: 'Tum bolumleri bitir',
    icon: '👑',
    condition: (stats) => stats.level > 7
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
    name: 'Para Ustasi',
    description: '100 para topla',
    icon: '💰',
    condition: (stats) => stats.coinsCollected >= 100
  },
  {
    id: 'treasure_hunter',
    name: 'Hazine Avcisi',
    description: '500 para topla',
    icon: '💎',
    condition: (stats) => stats.coinsCollected >= 500
  },
  {
    id: 'high_scorer',
    name: 'Yuksek Skor',
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
    id: 'legendary_scorer',
    name: 'Efsane Skor',
    description: '5000 puan topla',
    icon: '🏆',
    condition: (stats) => stats.score >= 5000
  },
  {
    id: 'survivor',
    name: 'Hayatta Kalma Uzmani',
    description: 'Hic olmeden bir bolumu bitir',
    icon: '💚',
    condition: (stats) => stats.deathCount === 0 && stats.level >= 2
  },
  {
    id: 'speed_runner',
    name: 'Hiz Canavari',
    description: 'Bolum 1\'i 3 dakikadan kisa surede bitir',
    icon: '⚡',
    condition: (stats) => stats.level >= 2 && stats.timeSeconds <= 180
  },
  {
    id: 'enemy_hunter',
    name: 'Canavar Avcisi',
    description: '20 dusmani yok et',
    icon: '⚔️',
    condition: (stats) => stats.enemiesDefeated >= 20
  },
  {
    id: 'enemy_slayer',
    name: 'Dusman Katili',
    description: '100 dusmani yok et',
    icon: '💀',
    condition: (stats) => stats.enemiesDefeated >= 100
  },
  {
    id: 'perfect_jumper',
    name: 'Mukemmel Ziplayici',
    description: '50 mukemmel ziplama yap',
    icon: '🎯',
    condition: (stats) => stats.perfectJumps >= 50
  },
  {
    id: 'power_user',
    name: 'Guc Kullanicisi',
    description: '10 guc artirici kullan',
    icon: '🔋',
    condition: (stats) => stats.powerUpsUsed >= 10
  },
  {
    id: 'duo_master',
    name: 'Ikili Usta',
    description: 'Iki kisilik modda oyunu bitir',
    icon: '👥',
    condition: (stats) => stats.gameMode === 'multi' && stats.level > 7
  },
  {
    id: 'solo_hero',
    name: 'Solo Kahraman',
    description: 'Tek kisilik modda oyunu bitir',
    icon: '🦸',
    condition: (stats) => stats.gameMode === 'solo' && stats.level > 7
  },
  {
    id: 'wall_master',
    name: 'Duvar Ustasi',
    description: '100 duvar ziplamasi yap',
    icon: '🧗',
    condition: (stats) => stats.wallJumps >= 100
  },
  {
    id: 'dash_master',
    name: 'Dash Ustasi',
    description: '500 dash kullan',
    icon: '💨',
    condition: (stats) => stats.dashesUsed >= 500
  },
  {
    id: 'ground_pounder',
    name: 'Yer Vurucu',
    description: '100 yer vurusu yap',
    icon: '💥',
    condition: (stats) => stats.groundPounds >= 100
  },
  {
    id: 'combo_king',
    name: 'Combo Krali',
    description: '10x combo zinciri yap',
    icon: '🔥',
    condition: (stats) => stats.comboMax >= 10
  },
  {
    id: 'secret_hunter',
    name: 'Gizli Alan Avcisi',
    description: '5 gizli alan bul',
    icon: '🔮',
    condition: (stats) => stats.secretsFound >= 5
  },
  {
    id: 'mini_boss_hunter',
    name: 'Mini Boss Avcisi',
    description: 'Tum mini bosslari yen',
    icon: '🐲',
    condition: (stats) => stats.miniBossesDefeated >= 3
  },
  {
    id: 'boss_slayer',
    name: 'Boss Katili',
    description: 'Ana bossu yen',
    icon: '🗡️',
    condition: (stats) => stats.bossDefeated === true
  },
  {
    id: 'perfectionist',
    name: 'Mukemmeliyetci',
    description: 'Bir bolumu %100 tamamla',
    icon: '✨',
    condition: (stats) => stats.coinsCollected >= 27 && stats.level >= 2
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
    powerUpsUsed: 0,
    wallJumps: 0,
    dashesUsed: 0,
    groundPounds: 0,
    comboMax: 0,
    secretsFound: 0,
    miniBossesDefeated: 0,
    bossDefeated: false
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
      powerUpsUsed: 0,
      wallJumps: 0,
      dashesUsed: 0,
      groundPounds: 0,
      comboMax: 0,
      secretsFound: 0,
      miniBossesDefeated: 0,
      bossDefeated: false
    };
  }
}
