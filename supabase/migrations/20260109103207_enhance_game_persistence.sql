/*
  # Enhance Game Persistence System
  
  1. Modifications
    - Add missing columns to existing tables
    - Create new table for detailed game stats
    - Add indexes for better performance
    
  2. New Tables
    - `game_stats` - Detailed statistics per game session
  
  3. Security
    - Maintain RLS on all tables
    - Keep public access for leaderboards
*/

-- Add missing columns to leaderboard table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'leaderboard' AND column_name = 'coins_collected'
  ) THEN
    ALTER TABLE leaderboard ADD COLUMN coins_collected integer DEFAULT 0;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'leaderboard' AND column_name = 'enemies_defeated'
  ) THEN
    ALTER TABLE leaderboard ADD COLUMN enemies_defeated integer DEFAULT 0;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'leaderboard' AND column_name = 'death_count'
  ) THEN
    ALTER TABLE leaderboard ADD COLUMN death_count integer DEFAULT 0;
  END IF;
END $$;

-- Add missing columns to player_progress table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'player_progress' AND column_name = 'total_coins'
  ) THEN
    ALTER TABLE player_progress ADD COLUMN total_coins integer DEFAULT 0;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'player_progress' AND column_name = 'total_enemies'
  ) THEN
    ALTER TABLE player_progress ADD COLUMN total_enemies integer DEFAULT 0;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'player_progress' AND column_name = 'death_count'
  ) THEN
    ALTER TABLE player_progress ADD COLUMN death_count integer DEFAULT 0;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'player_progress' AND column_name = 'perfect_jumps'
  ) THEN
    ALTER TABLE player_progress ADD COLUMN perfect_jumps integer DEFAULT 0;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'player_progress' AND column_name = 'power_ups_used'
  ) THEN
    ALTER TABLE player_progress ADD COLUMN power_ups_used integer DEFAULT 0;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'player_progress' AND column_name = 'completion_percentage'
  ) THEN
    ALTER TABLE player_progress ADD COLUMN completion_percentage integer DEFAULT 0;
  END IF;
END $$;

-- Create game stats table for detailed session tracking
CREATE TABLE IF NOT EXISTS game_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  player_name text NOT NULL,
  level integer NOT NULL,
  score integer DEFAULT 0,
  time_seconds integer DEFAULT 0,
  coins_collected integer DEFAULT 0,
  total_coins_in_level integer DEFAULT 0,
  enemies_defeated integer DEFAULT 0,
  death_count integer DEFAULT 0,
  perfect_jumps integer DEFAULT 0,
  power_ups_used integer DEFAULT 0,
  game_mode text DEFAULT 'multi',
  character text,
  completed boolean DEFAULT false,
  completion_percentage integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE game_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert game stats"
  ON game_stats FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anyone can view game stats"
  ON game_stats FOR SELECT
  TO anon
  USING (true);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_leaderboard_score ON leaderboard(score DESC);
CREATE INDEX IF NOT EXISTS idx_leaderboard_level ON leaderboard(level_reached);
CREATE INDEX IF NOT EXISTS idx_achievements_player ON achievements(player_name);
CREATE INDEX IF NOT EXISTS idx_game_stats_player ON game_stats(player_name);
CREATE INDEX IF NOT EXISTS idx_game_stats_level ON game_stats(level);
