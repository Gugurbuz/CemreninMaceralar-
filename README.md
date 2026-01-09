# 🎮 Cemre'nin Maceraları

A delightful 2D platform adventure game featuring Cemre and her father on a journey through winter, spring, and sky, following the Aurora!

## ✨ Features

### Core Gameplay
- 🏔️ **4 Complete Levels**: Winter Forest, Butterfly Valley, Fruit Paradise, Aurora Temple
- 👥 **Co-op Mode**: Play with 2 characters or switch between them in solo mode
- 🎯 **12+ Platform Types**: Ice, mushroom trampolines, crumbly platforms, clouds, and more
- 🌪️ **Wind Mechanics**: Activate totems to glide through the air
- 👾 **Enemies & Boss**: Multiple enemy types and a 3-phase boss battle
- 💎 **Power-ups**: Shield, Speed, Double Jump, Magnet, Star

### New Features
- 🏆 **16 Achievements**: Unlock achievements for various accomplishments
- 📊 **Global Leaderboards**: Compete with players worldwide
- 💯 **100% Completion**: Special ending for collecting everything
- 💾 **Persistent Progress**: Your stats and achievements are saved
- 📱 **Mobile Support**: Touch controls for mobile devices

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- Supabase account (for database features)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd project
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**

   Create a `.env` file with your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your-supabase-project-url
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

4. **Run the game**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

## 🎮 How to Play

### Controls

**Keyboard (Solo Mode)**
- Arrow Keys or WASD: Move
- Up/W: Jump
- T: Teleport (when available)
- ESC: Pause
- M: Mute
- F: Fullscreen

**Keyboard (Co-op Mode)**
- **Cemre**: Arrow Keys
- **Baba**: WASD
- T: Teleport
- ESC: Pause

**Mobile**
- Touch controls appear on screen
- Virtual joystick for movement
- Tap buttons to jump

### Game Modes
- **Solo**: Play as one character and switch levels
- **Co-op**: Control both characters together

### Lives Options
- 3 Lives (Hard)
- 5 Lives (Normal)
- 10 Lives (Easy)
- ∞ Lives (Practice)

## 📚 Documentation

- [**FEATURES.md**](./FEATURES.md) - Complete list of all features
- [**DATABASE_GUIDE.md**](./DATABASE_GUIDE.md) - Database schema and integration guide
- [**GDD - Game Design Document**](./LEVEL4_REDESIGN.md) - Original game design

## 🏗️ Tech Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Supabase** - Database and backend
- **HTML Canvas** - Game rendering

## 🗄️ Database

The game uses Supabase for:
- Player profiles
- Achievement tracking
- High score leaderboards
- Progress saving

See [DATABASE_GUIDE.md](./DATABASE_GUIDE.md) for detailed information.

## 🎯 Achievements

Unlock 16 unique achievements including:
- Complete all levels
- Collect 100 coins
- Defeat 20 enemies
- Perfect runs (no deaths)
- Speed runs
- Mode-specific challenges

## 🏆 Leaderboards

Compete globally with:
- Overall high scores
- Per-level rankings
- Detailed stats (coins, enemies, time, deaths)
- Filter by level

## 💯 100% Completion

Collect all coins and defeat all enemies in every level to unlock the special "MÜKEMMEL!" ending!

**Level Collectibles:**
- Level 1: 17 coins, 12 enemies
- Level 2: 16 coins, 6 enemies
- Level 3: 85 items (fruits), 0 enemies
- Level 4: 15 coins, 1 boss

## 🎨 Game Design

Based on the comprehensive GDD that emphasizes:
- **Atmosfer**: Soft, intimate, exploration-focused
- **Co-op Puzzle**: Thoughtful two-character mechanics
- **Vertical Traversal**: Climbing and gliding
- **Environmental Storytelling**: Show, don't tell

## 📁 Project Structure

```
project/
├── components/          # React components
│   ├── GameCanvas.tsx   # Main game component
│   ├── MobileControls.tsx
│   ├── AchievementNotification.tsx
│   └── Leaderboard.tsx
├── hooks/               # Custom React hooks
│   ├── useGameInput.ts
│   ├── useGamePhysics.ts
│   ├── useGameRenderer.ts
│   └── useCompletionTracking.ts
├── lib/                 # Core game logic
│   ├── achievements.ts
│   ├── bossAI.ts
│   ├── database.ts
│   └── supabase.ts
├── utils/               # Utilities
│   └── SoundManager.ts
├── constants.ts         # Game constants
├── types.ts            # TypeScript types
└── supabase/           # Database migrations
    └── migrations/
```

## 🎵 Credits

**Game Design & Development**
- Based on the GDD "Cemre'nin Maceraları"
- All features implemented according to spec

**Technologies**
- React & TypeScript
- Supabase for backend
- Vite for blazing fast builds

## 📝 License

This is a personal project. All rights reserved.

## 🎉 Have Fun!

Enjoy the adventure through winter, spring, and sky as you follow the Aurora!

Can you achieve 100% completion and unlock all achievements? 🏆
