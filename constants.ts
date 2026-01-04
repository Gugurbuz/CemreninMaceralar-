
import { Platform, Player, Coin, Enemy, Checkpoint } from "./types";

// Increased Gravity and Speeds for less "floaty/slow" feel
export const GRAVITY = 0.75; 
export const TERMINAL_VELOCITY = 16;
export const FRICTION = 0.82; // More friction for quicker stops
export const ICE_FRICTION = 0.96; 
export const WIND_FORCE = -0.12; 
export const CANVAS_WIDTH = 1280;
export const CANVAS_HEIGHT = 720;
export const HOT_CHOCOLATE_DURATION = 480; 

// Game Feel
export const COYOTE_TIME = 10; // Increased for better responsiveness
export const JUMP_BUFFER = 10; // Increased for better responsiveness

// Level Boundaries for Camera Clamping (Extended significantly)
export const LEVEL_1_WIDTH = 14000; // Extended from 9500 to 14000 for the new finale
export const LEVEL_2_WIDTH = 8500; 

export const INITIAL_RESPAWN_POINT = { x: 100, y: 300 };

export const getInitialPlayers = (startingLives: number = 3): Player[] => [
  {
    id: 'cemre',
    name: 'Cemre',
    position: { x: 150, y: 500 },
    velocity: { x: 0, y: 0 },
    size: { width: 30, height: 45 },
    baseSize: { width: 30, height: 45 },
    scale: { x: 1, y: 1 },
    color: '#FF69B4', // Hot Pink
    isGrounded: false,
    jumpForce: -16.0, 
    moveSpeed: 1.3, 
    facing: 'right',
    animFrame: 0,
    lives: startingLives,
    isDead: false,
    buff: null,
    invincibleTimer: 0,
    coyoteTimer: 0,
    jumpBufferTimer: 0,
    mushroomCooldown: 0
  },
  {
    id: 'baba',
    name: 'Baba',
    position: { x: 50, y: 500 },
    velocity: { x: 0, y: 0 },
    size: { width: 45, height: 65 },
    baseSize: { width: 45, height: 65 },
    scale: { x: 1, y: 1 },
    color: '#1E90FF', // Dodger Blue
    isGrounded: false,
    jumpForce: -15.5, 
    moveSpeed: 1.25,
    facing: 'right',
    animFrame: 0,
    lives: startingLives,
    isDead: false,
    buff: null,
    invincibleTimer: 0,
    coyoteTimer: 0,
    jumpBufferTimer: 0,
    mushroomCooldown: 0
  },
];

// --- LEVEL 1: WINTER JOURNEY (Extended Edition) ---

export const getWinterPlatforms = (): Platform[] => [
  // --- ACT A: The Frozen Lake (Teaching mechanics) ---
  { position: { x: -200, y: 600 }, size: { width: 1000, height: 200 }, type: 'ground', color: '#e2e8f0' },
  
  // The Ice Lake (Safe fall, just slippery)
  { position: { x: 800, y: 650 }, size: { width: 1200, height: 100 }, type: 'ice', color: '#bae6fd' },
  { position: { x: 900, y: 500 }, size: { width: 150, height: 20 }, type: 'ice', color: '#bae6fd' },
  { position: { x: 1200, y: 400 }, size: { width: 150, height: 20 }, type: 'ice', color: '#bae6fd' },
  { position: { x: 1500, y: 500 }, size: { width: 150, height: 20 }, type: 'ice', color: '#bae6fd' },
  
  { position: { x: 2000, y: 600 }, size: { width: 500, height: 200 }, type: 'ground', color: '#e2e8f0' },

  // --- ACT B: The Wind Tunnel (Challenge) ---
  { position: { x: 2120, y: 560 }, size: { width: 140, height: 40 }, type: 'mushroom', color: '#67e8f9', deformation: 0 },
  { position: { x: 2250, y: 550 }, size: { width: 100, height: 20 }, type: 'ground', color: '#e2e8f0' }, 
  { position: { x: 2300, y: 500 }, size: { width: 40, height: 100 }, type: 'totem', color: '#64748b', isActive: true },

  // High Path (Crumbly)
  { position: { x: 2600, y: 500 }, size: { width: 100, height: 20 }, type: 'crumbly', color: '#bae6fd', fallTimer: 60, maxFallTimer: 60, respawnTimer: 0 },
  { position: { x: 2800, y: 400 }, size: { width: 100, height: 20 }, type: 'crumbly', color: '#bae6fd', fallTimer: 60, maxFallTimer: 60, respawnTimer: 0 },
  { position: { x: 3000, y: 300 }, size: { width: 100, height: 20 }, type: 'crumbly', color: '#bae6fd', fallTimer: 60, maxFallTimer: 60, respawnTimer: 0 },
  
  // Low Path (Safety Net)
  { position: { x: 2500, y: 650 }, size: { width: 1000, height: 100 }, type: 'ground', color: '#cbd5e1' }, 
  { position: { x: 3400, y: 570 }, size: { width: 80, height: 80 }, type: 'mushroom', color: '#fde047', deformation: 0 },

  { position: { x: 3200, y: 200 }, size: { width: 300, height: 20 }, type: 'ground', color: '#e2e8f0' }, 

  // Puzzle Gate
  { id: 99, position: { x: 3450, y: 50 }, size: { width: 40, height: 150 }, type: 'door', color: '#334155', isOpen: false },
  { id: 100, linkId: 99, position: { x: 3300, y: 190 }, size: { width: 40, height: 10 }, type: 'plate', color: '#facc15', isPressed: false },

  // Steps Down
  { position: { x: 3500, y: 200 }, size: { width: 150, height: 400 }, type: 'ice', color: '#bae6fd' }, 
  { position: { x: 3650, y: 300 }, size: { width: 150, height: 300 }, type: 'ice', color: '#bae6fd' }, 
  { position: { x: 3800, y: 400 }, size: { width: 150, height: 200 }, type: 'ice', color: '#bae6fd' }, 
  { position: { x: 3950, y: 500 }, size: { width: 150, height: 100 }, type: 'ice', color: '#bae6fd' }, 
  
  // Yeti Cave
  { position: { x: 4100, y: 600 }, size: { width: 1500, height: 200 }, type: 'ground', color: '#475569' },
  
  // --- ACT C: The Ice Pillars ---
  { position: { x: 5600, y: 550 }, size: { width: 100, height: 20 }, type: 'ground', color: '#e2e8f0' },
  { position: { x: 5700, y: 600 }, size: { width: 100, height: 200 }, type: 'ground', color: '#e2e8f0' },
  
  { position: { x: 5900, y: 500 }, size: { width: 80, height: 20 }, type: 'ice', color: '#bae6fd' },
  { position: { x: 6100, y: 400 }, size: { width: 80, height: 20 }, type: 'ice', color: '#bae6fd' },
  { position: { x: 6300, y: 300 }, size: { width: 80, height: 20 }, type: 'ice', color: '#bae6fd' },
  { position: { x: 6500, y: 400 }, size: { width: 80, height: 20 }, type: 'ice', color: '#bae6fd' },
  { position: { x: 6700, y: 500 }, size: { width: 80, height: 20 }, type: 'ice', color: '#bae6fd' },
  
  { position: { x: 6900, y: 550 }, size: { width: 500, height: 200 }, type: 'ground', color: '#e2e8f0' },

  // --- ACT D: THE GREAT CLIMB (NEW) ---
  // This section forces players to go UP into the sky where the Aurora will be visible
  
  // Rescue mushroom for the previous gap
  { position: { x: 7350, y: 420 }, size: { width: 80, height: 80 }, type: 'mushroom', color: '#fde047', deformation: 0 },

  // Base of the mountain
  { position: { x: 7500, y: 500 }, size: { width: 400, height: 300 }, type: 'ground', color: '#334155' }, // Darker rock

  // The Climb Begins - Vertical Zigzag
  { position: { x: 8000, y: 450 }, size: { width: 150, height: 20 }, type: 'ice', color: '#bae6fd' },
  { position: { x: 8250, y: 350 }, size: { width: 150, height: 20 }, type: 'ice', color: '#bae6fd' },
  
  // Moving platforms logic would be cool here, but static hard jumps for now
  { position: { x: 8000, y: 250 }, size: { width: 150, height: 20 }, type: 'ice', color: '#bae6fd' },
  { position: { x: 8300, y: 150 }, size: { width: 150, height: 20 }, type: 'ice', color: '#bae6fd' },
  
  // High Altitude Rest Spot
  { position: { x: 8600, y: 200 }, size: { width: 300, height: 20 }, type: 'ground', color: '#e2e8f0' },

  // The Gap of Faith
  { position: { x: 9100, y: 200 }, size: { width: 100, height: 20 }, type: 'crumbly', color: '#bae6fd', fallTimer: 40, maxFallTimer: 60, respawnTimer: 0 },
  { position: { x: 9300, y: 200 }, size: { width: 100, height: 20 }, type: 'crumbly', color: '#bae6fd', fallTimer: 40, maxFallTimer: 60, respawnTimer: 0 },
  { position: { x: 9500, y: 200 }, size: { width: 100, height: 20 }, type: 'crumbly', color: '#bae6fd', fallTimer: 40, maxFallTimer: 60, respawnTimer: 0 },

  { position: { x: 9800, y: 300 }, size: { width: 400, height: 20 }, type: 'ground', color: '#e2e8f0' },

  // --- ACT E: THE STAR BRIDGE (NEW FINALE) ---
  // A long flat run with visual spectacle
  
  // Helper Mushroom to get up to the bridge
  { position: { x: 10300, y: 300 }, size: { width: 100, height: 60 }, type: 'mushroom', color: '#67e8f9', deformation: 0 },

  // The Bridge
  { position: { x: 10500, y: 150 }, size: { width: 2000, height: 20 }, type: 'ice', color: '#a5f3fc' }, // Very long bridge high up

  // Final Peak
  { position: { x: 12600, y: 150 }, size: { width: 500, height: 600 }, type: 'ground', color: '#e2e8f0' }, 
  
  // The Portal (Moved to end)
  { position: { x: 12800, y: 0 }, size: { width: 150, height: 150 }, type: 'aurora', color: 'transparent', requiresCoop: true },
];

export const getWinterCoins = (): Coin[] => [
    { id: 1, position: { x: 975, y: 450 }, size: 14, collected: false, baseY: 450, type: 'kanelbulle' },
    { id: 2, position: { x: 1275, y: 350 }, size: 14, collected: false, baseY: 350, type: 'kanelbulle' },
    { id: 3, position: { x: 2850, y: 350 }, size: 14, collected: false, baseY: 350, type: 'kanelbulle' }, 
    { id: 4, position: { x: 3300, y: 150 }, size: 14, collected: false, baseY: 150, type: 'hot-chocolate' }, 
    { id: 5, position: { x: 4500, y: 550 }, size: 14, collected: false, baseY: 550, type: 'kanelbulle' },
    { id: 6, position: { x: 4800, y: 550 }, size: 14, collected: false, baseY: 550, type: 'kanelbulle' }, 
    { id: 7, position: { x: 5100, y: 550 }, size: 14, collected: false, baseY: 550, type: 'hot-chocolate' }, 
    { id: 8, position: { x: 6100, y: 350 }, size: 14, collected: false, baseY: 350, type: 'gold' }, 
    { id: 9, position: { x: 6300, y: 250 }, size: 14, collected: false, baseY: 250, type: 'gold' }, 
    { id: 10, position: { x: 2900, y: 600 }, size: 14, collected: false, baseY: 600, type: 'kanelbulle' },
    
    // New Coins for Extended Section
    { id: 70, position: { x: 8050, y: 400 }, size: 14, collected: false, baseY: 400, type: 'gold' }, // Climb
    { id: 71, position: { x: 8300, y: 300 }, size: 14, collected: false, baseY: 300, type: 'gold' }, // Climb
    { id: 72, position: { x: 8050, y: 200 }, size: 14, collected: false, baseY: 200, type: 'gold' }, // Climb
    { id: 73, position: { x: 8350, y: 100 }, size: 14, collected: false, baseY: 100, type: 'hot-chocolate' }, // Top of zigzag
    
    { id: 80, position: { x: 9200, y: 150 }, size: 14, collected: false, baseY: 150, type: 'gold' }, // Crumbly jump
    { id: 81, position: { x: 9400, y: 150 }, size: 14, collected: false, baseY: 150, type: 'gold' }, // Crumbly jump

    // Bridge Coins (Run sequence)
    { id: 90, position: { x: 10800, y: 100 }, size: 14, collected: false, baseY: 100, type: 'kanelbulle' },
    { id: 91, position: { x: 11200, y: 100 }, size: 14, collected: false, baseY: 100, type: 'kanelbulle' },
    { id: 92, position: { x: 11600, y: 100 }, size: 14, collected: false, baseY: 100, type: 'kanelbulle' },
    { id: 93, position: { x: 12000, y: 100 }, size: 14, collected: false, baseY: 100, type: 'hot-chocolate' },
];

export const getWinterEnemies = (): Enemy[] => [
    { id: 1, position: { x: 900, y: 600 }, size: { width: 40, height: 50 }, type: 'snowman', color: '#fff', originalX: 900, patrolDistance: 150, speed: 1.5, direction: 1 }, 
    { id: 5, position: { x: 2000, y: 300 }, size: { width: 40, height: 30 }, type: 'bird', color: '#1e293b', originalX: 2000, originalY: 300, patrolDistance: 150, speed: 2, direction: 1 },
    { id: 6, position: { x: 3200, y: 200 }, size: { width: 40, height: 50 }, type: 'snowman', color: '#fff', originalX: 3200, patrolDistance: 100, speed: 1, direction: 1 },
    { id: 7, position: { x: 2700, y: 600 }, size: { width: 40, height: 50 }, type: 'snowman', color: '#cbd5e1', originalX: 2700, patrolDistance: 400, speed: 2.5, direction: 1 },
    { id: 2, position: { x: 4300, y: 530 }, size: { width: 60, height: 70 }, type: 'yeti', color: '#e2e8f0', originalX: 4300, patrolDistance: 300, speed: 2.5, direction: 1 },
    { id: 3, position: { x: 4800, y: 530 }, size: { width: 60, height: 70 }, type: 'yeti', color: '#e2e8f0', originalX: 4800, patrolDistance: 300, speed: 3, direction: -1 },
    { id: 4, position: { x: 6000, y: 200 }, size: { width: 40, height: 30 }, type: 'bird', color: '#1e293b', originalX: 6000, originalY: 200, patrolDistance: 200, speed: 3, direction: 1 },
    { id: 8, position: { x: 6400, y: 250 }, size: { width: 40, height: 30 }, type: 'bird', color: '#1e293b', originalX: 6400, originalY: 250, patrolDistance: 200, speed: 3, direction: -1 },

    // New Enemies
    { id: 10, position: { x: 7700, y: 450 }, size: { width: 60, height: 70 }, type: 'yeti', color: '#e2e8f0', originalX: 7700, patrolDistance: 200, speed: 2, direction: 1 }, // Mountain Base Guard
    { id: 11, position: { x: 8700, y: 150 }, size: { width: 40, height: 50 }, type: 'snowman', color: '#fff', originalX: 8700, patrolDistance: 200, speed: 2, direction: 1 }, // High Altitude Snowman
    { id: 12, position: { x: 9300, y: 100 }, size: { width: 40, height: 30 }, type: 'bird', color: '#1e293b', originalX: 9300, originalY: 100, patrolDistance: 300, speed: 3, direction: 1 }, // Gap Bird
];

export const getWinterCheckpoints = (): Checkpoint[] => [
    { id: 1, position: { x: 2100, y: 550 }, size: { width: 40, height: 60 }, triggered: false }, 
    { id: 2, position: { x: 4000, y: 450 }, size: { width: 40, height: 60 }, triggered: false }, 
    { id: 3, position: { x: 5700, y: 550 }, size: { width: 40, height: 60 }, triggered: false }, 
    { id: 4, position: { x: 7300, y: 500 }, size: { width: 40, height: 60 }, triggered: false },
    // New Checkpoints
    { id: 5, position: { x: 8700, y: 150 }, size: { width: 40, height: 60 }, triggered: false }, // Before the gap
    { id: 6, position: { x: 10000, y: 250 }, size: { width: 40, height: 60 }, triggered: false }, // Before the bridge
];

// --- LEVEL 2: BUTTERFLY VALLEY (Spring/Summer) ---

export const getButterflyPlatforms = (): Platform[] => [
  { position: { x: -200, y: 600 }, size: { width: 1000, height: 200 }, type: 'ground', color: '#86efac' }, 
  { position: { x: 900, y: 500 }, size: { width: 150, height: 20 }, type: 'leaf', color: '#22c55e' },
  { position: { x: 1200, y: 400 }, size: { width: 150, height: 20 }, type: 'leaf', color: '#22c55e' },
  { position: { x: 1600, y: 600 }, size: { width: 800, height: 200 }, type: 'ground', color: '#86efac' },
  { position: { x: 2500, y: 550 }, size: { width: 100, height: 80 }, type: 'mushroom', color: '#fca5a5', deformation: 0 },
  { position: { x: 2800, y: 450 }, size: { width: 100, height: 80 }, type: 'mushroom', color: '#fca5a5', deformation: 0 },
  { position: { x: 3200, y: 400 }, size: { width: 400, height: 40 }, type: 'ground', color: '#86efac' },
  { position: { x: 3800, y: 300 }, size: { width: 100, height: 20 }, type: 'crumbly', color: '#fde047', fallTimer: 60, maxFallTimer: 60, respawnTimer: 0 },
  { position: { x: 4200, y: 600 }, size: { width: 1000, height: 200 }, type: 'ground', color: '#86efac' },
  { position: { x: 5500, y: 500 }, size: { width: 200, height: 20 }, type: 'leaf', color: '#22c55e' },
  { position: { x: 6000, y: 600 }, size: { width: 1500, height: 200 }, type: 'ground', color: '#86efac' },
  { position: { x: 7500, y: 450 }, size: { width: 150, height: 150 }, type: 'aurora', color: 'transparent', requiresCoop: true },
];

export const getButterflyCoins = (): Coin[] => [
    { id: 201, position: { x: 975, y: 450 }, size: 14, collected: false, baseY: 450, type: 'kanelbulle' },
    { id: 202, position: { x: 1275, y: 350 }, size: 14, collected: false, baseY: 350, type: 'gold' },
    { id: 203, position: { x: 2550, y: 450 }, size: 14, collected: false, baseY: 450, type: 'gold' },
    { id: 204, position: { x: 2850, y: 350 }, size: 14, collected: false, baseY: 350, type: 'gold' },
    { id: 205, position: { x: 3400, y: 350 }, size: 14, collected: false, baseY: 350, type: 'hot-chocolate' },
    { id: 206, position: { x: 5600, y: 450 }, size: 14, collected: false, baseY: 450, type: 'gold' },
];

export const getButterflyEnemies = (): Enemy[] => [
    { id: 201, position: { x: 1900, y: 570 }, size: { width: 40, height: 30 }, type: 'slime', color: '#16a34a', originalX: 1900, patrolDistance: 200, speed: 2, direction: 1 },
    { id: 202, position: { x: 3400, y: 370 }, size: { width: 40, height: 30 }, type: 'bird', color: '#ef4444', originalX: 3400, originalY: 370, patrolDistance: 150, speed: 3, direction: 1 },
    { id: 203, position: { x: 4700, y: 570 }, size: { width: 60, height: 50 }, type: 'slime', color: '#16a34a', originalX: 4700, patrolDistance: 300, speed: 1.5, direction: -1 },
];

export const getButterflyCheckpoints = (): Checkpoint[] => [
    { id: 201, position: { x: 1800, y: 550 }, size: { width: 40, height: 60 }, triggered: false },
    { id: 202, position: { x: 4400, y: 550 }, size: { width: 40, height: 60 }, triggered: false },
];
