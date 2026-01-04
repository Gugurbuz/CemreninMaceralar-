import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface LeaderboardEntry {
  id: string;
  player_name: string;
  score: number;
  level_reached: number;
  time_seconds: number;
  game_mode: string;
  character: string;
  created_at: string;
}

export interface Achievement {
  id: string;
  player_name: string;
  achievement_id: string;
  achievement_name: string;
  unlocked_at: string;
}

export interface PlayerProgress {
  id: string;
  player_name: string;
  highest_level: number;
  total_score: number;
  games_played: number;
  achievements_unlocked: number;
  updated_at: string;
}
