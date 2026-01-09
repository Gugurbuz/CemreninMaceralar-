import { supabase } from './supabase';
import { AchievementDefinition } from './achievements';

export interface PlayerProfile {
  player_name: string;
  highest_level: number;
  total_score: number;
  total_coins: number;
  total_enemies: number;
  death_count: number;
  perfect_jumps: number;
  power_ups_used: number;
  completion_percentage: number;
  achievements_unlocked: number;
}

export interface LeaderboardEntry {
  player_name: string;
  score: number;
  level_reached: number;
  time_seconds: number;
  coins_collected: number;
  enemies_defeated: number;
  death_count: number;
  game_mode: string;
  character: string;
  created_at: string;
}

export interface GameStatsEntry {
  player_name: string;
  level: number;
  score: number;
  time_seconds: number;
  coins_collected: number;
  total_coins_in_level: number;
  enemies_defeated: number;
  death_count: number;
  perfect_jumps: number;
  power_ups_used: number;
  game_mode: string;
  character: string;
  completed: boolean;
  completion_percentage: number;
}

export class DatabaseService {
  private playerName: string;

  constructor(playerName: string = 'Player') {
    this.playerName = playerName;
  }

  setPlayerName(name: string) {
    this.playerName = name;
  }

  async getPlayerProgress(): Promise<PlayerProfile | null> {
    try {
      const { data, error } = await supabase
        .from('player_progress')
        .select('*')
        .eq('player_name', this.playerName)
        .maybeSingle();

      if (error) {
        console.error('Error fetching player progress:', error);
        return null;
      }

      return data;
    } catch (err) {
      console.error('Exception fetching player progress:', err);
      return null;
    }
  }

  async updatePlayerProgress(stats: Partial<PlayerProfile>): Promise<boolean> {
    try {
      const existing = await this.getPlayerProgress();

      if (existing) {
        const { error } = await supabase
          .from('player_progress')
          .update({
            ...stats,
            updated_at: new Date().toISOString(),
          })
          .eq('player_name', this.playerName);

        if (error) {
          console.error('Error updating player progress:', error);
          return false;
        }
      } else {
        const { error } = await supabase
          .from('player_progress')
          .insert({
            player_name: this.playerName,
            ...stats,
          });

        if (error) {
          console.error('Error inserting player progress:', error);
          return false;
        }
      }

      return true;
    } catch (err) {
      console.error('Exception updating player progress:', err);
      return false;
    }
  }

  async saveGameStats(stats: GameStatsEntry): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('game_stats')
        .insert(stats);

      if (error) {
        console.error('Error saving game stats:', error);
        return false;
      }

      return true;
    } catch (err) {
      console.error('Exception saving game stats:', err);
      return false;
    }
  }

  async submitScore(score: LeaderboardEntry): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('leaderboard')
        .insert(score);

      if (error) {
        console.error('Error submitting score:', error);
        return false;
      }

      return true;
    } catch (err) {
      console.error('Exception submitting score:', err);
      return false;
    }
  }

  async getTopScores(limit: number = 10, level?: number): Promise<LeaderboardEntry[]> {
    try {
      let query = supabase
        .from('leaderboard')
        .select('*')
        .order('score', { ascending: false })
        .limit(limit);

      if (level) {
        query = query.eq('level_reached', level);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching leaderboard:', error);
        return [];
      }

      return data || [];
    } catch (err) {
      console.error('Exception fetching leaderboard:', err);
      return [];
    }
  }

  async unlockAchievement(achievement: AchievementDefinition): Promise<boolean> {
    try {
      const existing = await supabase
        .from('achievements')
        .select('id')
        .eq('player_name', this.playerName)
        .eq('achievement_id', achievement.id)
        .maybeSingle();

      if (existing.data) {
        return false;
      }

      const { error } = await supabase
        .from('achievements')
        .insert({
          player_name: this.playerName,
          achievement_id: achievement.id,
          achievement_name: achievement.name,
        });

      if (error) {
        console.error('Error unlocking achievement:', error);
        return false;
      }

      await this.updateAchievementCount();
      return true;
    } catch (err) {
      console.error('Exception unlocking achievement:', err);
      return false;
    }
  }

  async getUnlockedAchievements(): Promise<string[]> {
    try {
      const { data, error } = await supabase
        .from('achievements')
        .select('achievement_id')
        .eq('player_name', this.playerName);

      if (error) {
        console.error('Error fetching achievements:', error);
        return [];
      }

      return (data || []).map(a => a.achievement_id);
    } catch (err) {
      console.error('Exception fetching achievements:', err);
      return [];
    }
  }

  private async updateAchievementCount(): Promise<void> {
    try {
      const achievements = await this.getUnlockedAchievements();
      await this.updatePlayerProgress({
        achievements_unlocked: achievements.length,
      });
    } catch (err) {
      console.error('Exception updating achievement count:', err);
    }
  }

  async calculateCompletionPercentage(
    level: number,
    coinsCollected: number,
    totalCoinsInLevel: number,
    enemiesDefeated: number,
    totalEnemiesInLevel: number
  ): Promise<number> {
    const coinPercentage = totalCoinsInLevel > 0 ? (coinsCollected / totalCoinsInLevel) * 50 : 0;
    const enemyPercentage = totalEnemiesInLevel > 0 ? (enemiesDefeated / totalEnemiesInLevel) * 50 : 0;

    return Math.round(coinPercentage + enemyPercentage);
  }
}

export const createDatabaseService = (playerName?: string) => {
  return new DatabaseService(playerName);
};
