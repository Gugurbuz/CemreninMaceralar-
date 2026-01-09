# Database Integration Guide

## Overview

The game uses Supabase for persistent storage of player data, achievements, and leaderboards. All data is stored securely with Row Level Security (RLS) policies.

## Database Schema

### Tables

#### 1. `player_progress`
Stores overall player statistics and progress.

```sql
- id: uuid (primary key)
- player_name: text (unique)
- highest_level: integer
- total_score: integer
- total_coins: integer
- total_enemies: integer
- death_count: integer
- perfect_jumps: integer
- power_ups_used: integer
- completion_percentage: integer
- games_played: integer
- achievements_unlocked: integer
- updated_at: timestamp
```

#### 2. `achievements`
Tracks unlocked achievements per player.

```sql
- id: uuid (primary key)
- player_name: text
- achievement_id: text
- achievement_name: text
- unlocked_at: timestamp
```

#### 3. `leaderboard`
High scores and game completions.

```sql
- id: uuid (primary key)
- player_name: text
- score: integer
- level_reached: integer
- time_seconds: integer
- coins_collected: integer
- enemies_defeated: integer
- death_count: integer
- game_mode: text (solo/multi)
- character: text
- created_at: timestamp
```

#### 4. `game_stats`
Detailed statistics for individual game sessions.

```sql
- id: uuid (primary key)
- player_name: text
- level: integer
- score: integer
- time_seconds: integer
- coins_collected: integer
- total_coins_in_level: integer
- enemies_defeated: integer
- death_count: integer
- perfect_jumps: integer
- power_ups_used: integer
- game_mode: text
- character: text
- completed: boolean
- completion_percentage: integer
- created_at: timestamp
```

## Security

### Row Level Security (RLS)

All tables have RLS enabled with the following policies:

- **Insert**: Anyone can insert their own data (anonymous access)
- **Select**: Anyone can view all data (for leaderboards)
- **Update**: Players can update their own progress

This allows for:
- Public leaderboards
- Private player progress
- No authentication required
- Protection against malicious updates

## Usage in Code

### 1. Initialize Database Service

```typescript
import { createDatabaseService } from './lib/database';

const dbService = createDatabaseService('PlayerName');
```

### 2. Save Player Progress

```typescript
await dbService.updatePlayerProgress({
  highest_level: 4,
  total_score: 1250,
  total_coins: 85,
  completion_percentage: 95
});
```

### 3. Submit Score to Leaderboard

```typescript
await dbService.submitScore({
  player_name: 'PlayerName',
  score: 1250,
  level_reached: 4,
  time_seconds: 450,
  coins_collected: 85,
  enemies_defeated: 20,
  death_count: 3,
  game_mode: 'multi',
  character: 'both',
  created_at: new Date().toISOString()
});
```

### 4. Unlock Achievement

```typescript
await dbService.unlockAchievement({
  id: 'game_master',
  name: 'Oyun Ustası',
  description: 'Tüm bölümleri bitir',
  icon: '👑',
  condition: (stats) => stats.level > 4
});
```

### 5. Get Leaderboard

```typescript
// Get top 10 scores
const scores = await dbService.getTopScores(10);

// Get top 10 for level 1 only
const level1Scores = await dbService.getTopScores(10, 1);
```

### 6. Get Player Achievements

```typescript
const unlockedIds = await dbService.getUnlockedAchievements();
// Returns: ['first_steps', 'level_1_complete', ...]
```

## Data Flow

### On Game Start
1. Load player name from localStorage
2. Initialize database service with player name
3. Load unlocked achievements from database
4. Display in UI

### During Gameplay
1. Track stats in game state (in-memory)
2. Check for achievement unlocks every 5 seconds
3. Show achievement notification when unlocked
4. Save achievement to database immediately

### On Game End (Victory)
1. Calculate final stats
2. Update completion tracking
3. Check for new achievements
4. Save score to leaderboard
5. Update player progress
6. Show victory screen with stats
7. Allow viewing leaderboard

### On Game End (Game Over)
1. Stats are not saved to leaderboard
2. Achievements earned during play are still saved
3. Player can retry or return to menu

## Completion Tracking

### Level Coin Counts
- Level 1 (Winter): 17 coins
- Level 2 (Butterfly): 16 coins
- Level 3 (Fruit Paradise): 85 coins (includes all fruits)
- Level 4 (Boss): 15 coins

### Level Enemy Counts
- Level 1: 12 enemies
- Level 2: 6 enemies
- Level 3: 0 enemies (peaceful level)
- Level 4: 1 boss

### Completion Formula
```
completion = (coins_collected / total_coins * 50) +
             (enemies_defeated / total_enemies * 50)
```

### Perfect Run
A perfect run requires:
- 100% completion on all 4 levels
- All coins collected
- All enemies defeated
- Special ending unlocked

## Performance Considerations

### Indexes
The following indexes are created for optimal query performance:

```sql
- leaderboard(score DESC) -- Fast leaderboard queries
- leaderboard(level_reached) -- Filter by level
- achievements(player_name) -- Fast achievement lookups
- game_stats(player_name) -- Player history
- game_stats(level) -- Level-specific stats
```

### Caching
- Achievements are loaded once on game start
- Player name is stored in localStorage
- Game state is kept in memory during play
- Only final results are written to database

## Error Handling

All database operations have try-catch blocks and:
- Log errors to console
- Return graceful defaults (empty arrays, null)
- Don't block gameplay
- Show user-friendly error messages when needed

## Offline Support

The game works offline:
- All gameplay functions without database
- Achievements are checked but not saved
- Leaderboard shows empty state
- Player name persists in localStorage
- Data syncs when connection is restored (manual retry)

## Development

### Migrations
Database schema is managed through migrations in:
```
supabase/migrations/
```

To apply migrations:
```bash
# Already applied automatically via MCP tools
```

### Testing Database
1. Play the game and complete levels
2. Check Supabase dashboard for data
3. Verify leaderboard shows scores
4. Confirm achievements are saved
5. Test player progress updates

## Production Considerations

### Environment Variables
Required in `.env`:
```
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Rate Limiting
Supabase free tier limits:
- 500 MB database
- 50,000 monthly active users
- 5 GB bandwidth

For this game, these limits are more than sufficient.

### Monitoring
Monitor in Supabase dashboard:
- Table sizes
- Query performance
- API usage
- Error rates

## Future Enhancements

Potential additions:
- [ ] Friend lists
- [ ] Daily challenges
- [ ] Seasonal events
- [ ] Custom levels
- [ ] Replays
- [ ] Social sharing
- [ ] User profiles with avatars
- [ ] Teams/clans
- [ ] Tournament mode
