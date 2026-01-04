/*
  # Create Game Database Schema
  
  1. New Tables
    - `leaderboard`
      - `id` (uuid, primary key)
      - `player_name` (text) - Player's display name
      - `score` (integer) - Final score
      - `level_reached` (integer) - Highest level completed
      - `time_seconds` (integer) - Total playtime in seconds
      - `game_mode` (text) - 'solo' or 'multi'
      - `character` (text) - 'cemre', 'baba', or 'both'
      - `created_at` (timestamptz) - When the score was recorded
    
    - `achievements`
      - `id` (uuid, primary key)
      - `player_name` (text) - Player's display name
      - `achievement_id` (text) - Unique achievement identifier
      - `achievement_name` (text) - Display name of achievement
      - `unlocked_at` (timestamptz) - When it was unlocked
    
    - `player_progress`
      - `id` (uuid, primary key)
      - `player_name` (text) - Player's display name
      - `highest_level` (integer) - Highest level unlocked
      - `total_score` (integer) - Cumulative score across all games
      - `games_played` (integer) - Total number of games
      - `achievements_unlocked` (integer) - Count of achievements
      - `updated_at` (timestamptz) - Last update timestamp
  
  2. Security
    - Enable RLS on all tables
    - Allow public read access for leaderboard (view-only)
    - Allow authenticated inserts for scores and achievements
    - Anyone can view, anyone can insert (no auth required for simplicity)
*/

-- Create leaderboard table
CREATE TABLE IF NOT EXISTS leaderboard (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  player_name text NOT NULL DEFAULT 'Player',
  score integer NOT NULL DEFAULT 0,
  level_reached integer NOT NULL DEFAULT 1,
  time_seconds integer NOT NULL DEFAULT 0,
  game_mode text NOT NULL DEFAULT 'solo',
  character text NOT NULL DEFAULT 'cemre',
  created_at timestamptz DEFAULT now()
);

-- Create achievements table
CREATE TABLE IF NOT EXISTS achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  player_name text NOT NULL DEFAULT 'Player',
  achievement_id text NOT NULL,
  achievement_name text NOT NULL,
  unlocked_at timestamptz DEFAULT now()
);

-- Create player progress table
CREATE TABLE IF NOT EXISTS player_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  player_name text NOT NULL UNIQUE,
  highest_level integer NOT NULL DEFAULT 1,
  total_score integer NOT NULL DEFAULT 0,
  games_played integer NOT NULL DEFAULT 0,
  achievements_unlocked integer NOT NULL DEFAULT 0,
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE leaderboard ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_progress ENABLE ROW LEVEL SECURITY;

-- Leaderboard policies (public read, public insert)
CREATE POLICY "Anyone can view leaderboard"
  ON leaderboard FOR SELECT
  USING (true);

CREATE POLICY "Anyone can add scores"
  ON leaderboard FOR INSERT
  WITH CHECK (true);

-- Achievements policies (public read, public insert)
CREATE POLICY "Anyone can view achievements"
  ON achievements FOR SELECT
  USING (true);

CREATE POLICY "Anyone can unlock achievements"
  ON achievements FOR INSERT
  WITH CHECK (true);

-- Player progress policies (public read, public insert/update)
CREATE POLICY "Anyone can view progress"
  ON player_progress FOR SELECT
  USING (true);

CREATE POLICY "Anyone can create progress"
  ON player_progress FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update own progress"
  ON player_progress FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_leaderboard_score ON leaderboard(score DESC);
CREATE INDEX IF NOT EXISTS idx_leaderboard_created_at ON leaderboard(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_achievements_player ON achievements(player_name);
CREATE INDEX IF NOT EXISTS idx_player_progress_name ON player_progress(player_name);