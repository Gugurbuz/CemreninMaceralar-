
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
export const COYOTE_TIME = 8; // Frames allowed to jump after falling off ledge
export const JUMP_BUFFER = 8; // Frames to remember jump press before hitting ground

// Level Boundaries for Camera Clamping (Extended)
export const LEVEL_1_WIDTH = 14000;
export const LEVEL_2_WIDTH = 15000; // Extended Level 2
export const LEVEL_3_WIDTH = 8000;  // Level 3 Length
export const LEVEL_4_WIDTH = 10000; // Level 4 Length (Boss Level)

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
    activePowerUps: [],
    hasDoubleJump: false,
    coyoteTimer: 0,
    jumpBufferTimer: 0,
    mushroomCooldown: 0,
    standingOn: null
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
    activePowerUps: [],
    hasDoubleJump: false,
    coyoteTimer: 0,
    jumpBufferTimer: 0,
    mushroomCooldown: 0,
    standingOn: null
  },
];

// --- LEVEL 1: WINTER JOURNEY ---
export const getWinterPlatforms = (): Platform[] => [
  { position: { x: -200, y: 600 }, size: { width: 1000, height: 200 }, type: 'ground', color: '#e2e8f0' },
  { position: { x: 800, y: 650 }, size: { width: 1200, height: 100 }, type: 'ice', color: '#bae6fd' },
  { position: { x: 900, y: 500 }, size: { width: 150, height: 20 }, type: 'ice', color: '#bae6fd' },
  { position: { x: 1200, y: 400 }, size: { width: 150, height: 20 }, type: 'ice', color: '#bae6fd' },
  { position: { x: 1500, y: 500 }, size: { width: 150, height: 20 }, type: 'ice', color: '#bae6fd' },
  { position: { x: 2000, y: 600 }, size: { width: 500, height: 200 }, type: 'ground', color: '#e2e8f0' },
  { position: { x: 2120, y: 560 }, size: { width: 140, height: 40 }, type: 'mushroom', color: '#67e8f9', deformation: 0 },
  { position: { x: 2250, y: 550 }, size: { width: 100, height: 20 }, type: 'ground', color: '#e2e8f0' }, 
  { position: { x: 2300, y: 500 }, size: { width: 40, height: 100 }, type: 'totem', color: '#64748b', isActive: true },
  { position: { x: 2600, y: 500 }, size: { width: 100, height: 20 }, type: 'crumbly', color: '#bae6fd', fallTimer: 60, maxFallTimer: 60, respawnTimer: 0 },
  { position: { x: 2800, y: 400 }, size: { width: 100, height: 20 }, type: 'crumbly', color: '#bae6fd', fallTimer: 60, maxFallTimer: 60, respawnTimer: 0 },
  { position: { x: 3000, y: 300 }, size: { width: 100, height: 20 }, type: 'crumbly', color: '#bae6fd', fallTimer: 60, maxFallTimer: 60, respawnTimer: 0 },
  { position: { x: 2500, y: 650 }, size: { width: 1000, height: 100 }, type: 'ground', color: '#cbd5e1' }, 
  { position: { x: 3400, y: 570 }, size: { width: 80, height: 80 }, type: 'mushroom', color: '#fde047', deformation: 0 },
  { position: { x: 3200, y: 200 }, size: { width: 300, height: 20 }, type: 'ground', color: '#e2e8f0' }, 
  { id: 99, position: { x: 3450, y: 50 }, size: { width: 40, height: 150 }, type: 'door', color: '#334155', isOpen: false },
  { id: 100, linkId: 99, position: { x: 3300, y: 190 }, size: { width: 40, height: 10 }, type: 'plate', color: '#facc15', isPressed: false },
  { position: { x: 3500, y: 200 }, size: { width: 150, height: 400 }, type: 'ice', color: '#bae6fd' }, 
  { position: { x: 3650, y: 300 }, size: { width: 150, height: 300 }, type: 'ice', color: '#bae6fd' }, 
  { position: { x: 3800, y: 400 }, size: { width: 150, height: 200 }, type: 'ice', color: '#bae6fd' }, 
  { position: { x: 3950, y: 500 }, size: { width: 150, height: 100 }, type: 'ice', color: '#bae6fd' }, 
  { position: { x: 4100, y: 600 }, size: { width: 1500, height: 200 }, type: 'ground', color: '#475569' },
  { position: { x: 5600, y: 550 }, size: { width: 100, height: 20 }, type: 'ground', color: '#e2e8f0' },
  { position: { x: 5700, y: 600 }, size: { width: 100, height: 200 }, type: 'ground', color: '#e2e8f0' },
  { position: { x: 5900, y: 500 }, size: { width: 80, height: 20 }, type: 'ice', color: '#bae6fd' },
  { position: { x: 6100, y: 400 }, size: { width: 80, height: 20 }, type: 'ice', color: '#bae6fd' },
  { position: { x: 6300, y: 300 }, size: { width: 80, height: 20 }, type: 'ice', color: '#bae6fd' },
  { position: { x: 6500, y: 400 }, size: { width: 80, height: 20 }, type: 'ice', color: '#bae6fd' },
  { position: { x: 6700, y: 500 }, size: { width: 80, height: 20 }, type: 'ice', color: '#bae6fd' },
  { position: { x: 6900, y: 550 }, size: { width: 500, height: 200 }, type: 'ground', color: '#e2e8f0' },
  { position: { x: 7350, y: 420 }, size: { width: 80, height: 80 }, type: 'mushroom', color: '#fde047', deformation: 0 },
  { position: { x: 7500, y: 500 }, size: { width: 400, height: 300 }, type: 'ground', color: '#334155' }, 
  { position: { x: 8000, y: 450 }, size: { width: 150, height: 20 }, type: 'ice', color: '#bae6fd' },
  { position: { x: 8250, y: 350 }, size: { width: 150, height: 20 }, type: 'ice', color: '#bae6fd' },
  { position: { x: 8000, y: 250 }, size: { width: 150, height: 20 }, type: 'ice', color: '#bae6fd' },
  { position: { x: 8300, y: 150 }, size: { width: 150, height: 20 }, type: 'ice', color: '#bae6fd' },
  { position: { x: 8600, y: 200 }, size: { width: 300, height: 20 }, type: 'ground', color: '#e2e8f0' },
  { position: { x: 9100, y: 200 }, size: { width: 100, height: 20 }, type: 'crumbly', color: '#bae6fd', fallTimer: 40, maxFallTimer: 60, respawnTimer: 0 },
  { position: { x: 9300, y: 200 }, size: { width: 100, height: 20 }, type: 'crumbly', color: '#bae6fd', fallTimer: 40, maxFallTimer: 60, respawnTimer: 0 },
  { position: { x: 9500, y: 200 }, size: { width: 100, height: 20 }, type: 'crumbly', color: '#bae6fd', fallTimer: 40, maxFallTimer: 60, respawnTimer: 0 },
  { position: { x: 9800, y: 300 }, size: { width: 400, height: 20 }, type: 'ground', color: '#e2e8f0' },
  { position: { x: 10300, y: 300 }, size: { width: 100, height: 60 }, type: 'mushroom', color: '#67e8f9', deformation: 0 },
  { position: { x: 10500, y: 150 }, size: { width: 2000, height: 20 }, type: 'ice', color: '#a5f3fc' }, 
  { position: { x: 12600, y: 150 }, size: { width: 700, height: 600 }, type: 'ground', color: '#e2e8f0' },
  { position: { x: 13200, y: -200 }, size: { width: 100, height: 1000 }, type: 'ground', color: '#e2e8f0' },
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
    { id: 70, position: { x: 8050, y: 400 }, size: 14, collected: false, baseY: 400, type: 'gold' },
    { id: 71, position: { x: 8300, y: 300 }, size: 14, collected: false, baseY: 300, type: 'gold' },
    { id: 72, position: { x: 8050, y: 200 }, size: 14, collected: false, baseY: 200, type: 'gold' },
    { id: 73, position: { x: 8350, y: 100 }, size: 14, collected: false, baseY: 100, type: 'hot-chocolate' },
    { id: 80, position: { x: 9200, y: 150 }, size: 14, collected: false, baseY: 150, type: 'gold' },
    { id: 81, position: { x: 9400, y: 150 }, size: 14, collected: false, baseY: 150, type: 'gold' },
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
    { id: 10, position: { x: 7700, y: 450 }, size: { width: 60, height: 70 }, type: 'yeti', color: '#e2e8f0', originalX: 7700, patrolDistance: 200, speed: 2, direction: 1 }, 
    { id: 11, position: { x: 8700, y: 150 }, size: { width: 40, height: 50 }, type: 'snowman', color: '#fff', originalX: 8700, patrolDistance: 200, speed: 2, direction: 1 }, 
    { id: 12, position: { x: 9300, y: 100 }, size: { width: 40, height: 30 }, type: 'bird', color: '#1e293b', originalX: 9300, originalY: 100, patrolDistance: 300, speed: 3, direction: 1 }, 
];

export const getWinterCheckpoints = (): Checkpoint[] => [
    { id: 1, position: { x: 2100, y: 550 }, size: { width: 40, height: 60 }, triggered: false }, 
    { id: 2, position: { x: 4000, y: 450 }, size: { width: 40, height: 60 }, triggered: false }, 
    { id: 3, position: { x: 5700, y: 550 }, size: { width: 40, height: 60 }, triggered: false }, 
    { id: 4, position: { x: 7300, y: 500 }, size: { width: 40, height: 60 }, triggered: false },
    { id: 5, position: { x: 8700, y: 150 }, size: { width: 40, height: 60 }, triggered: false }, 
    { id: 6, position: { x: 10000, y: 250 }, size: { width: 40, height: 60 }, triggered: false }, 
];

// --- LEVEL 2: BUTTERFLY VALLEY (EXTENDED) ---
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
  { position: { x: 7500, y: 550 }, size: { width: 500, height: 200 }, type: 'ground', color: '#86efac' },
  
  // --- ACT 2 EXTENSION: THE HIVE CLIMB ---
  { position: { x: 8200, y: 450 }, size: { width: 100, height: 80 }, type: 'mushroom', color: '#fca5a5', deformation: 0 },
  { position: { x: 8500, y: 300 }, size: { width: 100, height: 80 }, type: 'mushroom', color: '#fca5a5', deformation: 0 },
  { position: { x: 8800, y: 150 }, size: { width: 300, height: 20 }, type: 'leaf', color: '#22c55e' },
  
  // High Hive Platform
  { position: { x: 9200, y: 150 }, size: { width: 100, height: 20 }, type: 'block', color: '#eab308' }, // Honey block
  { position: { x: 9300, y: 150 }, size: { width: 100, height: 20 }, type: 'block', color: '#eab308' },
  { position: { x: 9500, y: 300 }, size: { width: 100, height: 20 }, type: 'block', color: '#eab308' },
  
  // Long Drop Safe Zone
  { position: { x: 9800, y: 600 }, size: { width: 800, height: 200 }, type: 'ground', color: '#86efac' },

  // --- ACT 3 EXTENSION: THE GREAT SLIDE ---
  // A series of ice platforms (using ice for slide physics) colored like water or mossy rocks
  { position: { x: 10800, y: 500 }, size: { width: 200, height: 20 }, type: 'ice', color: '#86efac' },
  { position: { x: 11000, y: 550 }, size: { width: 200, height: 20 }, type: 'ice', color: '#86efac' },
  { position: { x: 11200, y: 600 }, size: { width: 200, height: 20 }, type: 'ice', color: '#86efac' },
  
  // Final Run
  { position: { x: 11500, y: 650 }, size: { width: 2000, height: 200 }, type: 'ground', color: '#86efac' },
  { position: { x: 13600, y: -200 }, size: { width: 100, height: 1000 }, type: 'ground', color: '#86efac' }, // Wall

  // The Portal to Level 3
  { position: { x: 13200, y: 500 }, size: { width: 150, height: 150 }, type: 'aurora', color: 'transparent', requiresCoop: true },
];

export const getButterflyCoins = (): Coin[] => [
    { id: 201, position: { x: 975, y: 450 }, size: 14, collected: false, baseY: 450, type: 'kanelbulle' },
    { id: 202, position: { x: 1275, y: 350 }, size: 14, collected: false, baseY: 350, type: 'gold' },
    { id: 203, position: { x: 2550, y: 450 }, size: 14, collected: false, baseY: 450, type: 'gold' },
    { id: 204, position: { x: 2850, y: 350 }, size: 14, collected: false, baseY: 350, type: 'gold' },
    { id: 205, position: { x: 3400, y: 350 }, size: 14, collected: false, baseY: 350, type: 'hot-chocolate' },
    { id: 206, position: { x: 5600, y: 450 }, size: 14, collected: false, baseY: 450, type: 'gold' },
    // Extension Coins
    { id: 210, position: { x: 8250, y: 350 }, size: 14, collected: false, baseY: 350, type: 'gold' },
    { id: 211, position: { x: 8550, y: 200 }, size: 14, collected: false, baseY: 200, type: 'gold' },
    { id: 212, position: { x: 8900, y: 100 }, size: 14, collected: false, baseY: 100, type: 'hot-chocolate' },
    { id: 213, position: { x: 9250, y: 100 }, size: 14, collected: false, baseY: 100, type: 'kanelbulle' },
    { id: 214, position: { x: 11100, y: 450 }, size: 14, collected: false, baseY: 450, type: 'gold' }, // Slide coin
    { id: 215, position: { x: 11300, y: 500 }, size: 14, collected: false, baseY: 500, type: 'gold' }, // Slide coin
    { id: 216, position: { x: 12500, y: 550 }, size: 14, collected: false, baseY: 550, type: 'kanelbulle' }, // Final stretch
];

export const getButterflyEnemies = (): Enemy[] => [
    { id: 201, position: { x: 1900, y: 570 }, size: { width: 40, height: 30 }, type: 'slime', color: '#16a34a', originalX: 1900, patrolDistance: 200, speed: 2, direction: 1 },
    { id: 202, position: { x: 3400, y: 370 }, size: { width: 40, height: 30 }, type: 'bird', color: '#ef4444', originalX: 3400, originalY: 370, patrolDistance: 150, speed: 3, direction: 1 },
    { id: 203, position: { x: 4700, y: 570 }, size: { width: 60, height: 50 }, type: 'slime', color: '#16a34a', originalX: 4700, patrolDistance: 300, speed: 1.5, direction: -1 },
    // Extension Enemies
    { id: 204, position: { x: 8800, y: 130 }, size: { width: 40, height: 30 }, type: 'bird', color: '#ef4444', originalX: 8800, originalY: 130, patrolDistance: 200, speed: 3.5, direction: 1 }, // Hive Guardian
    { id: 205, position: { x: 9900, y: 570 }, size: { width: 60, height: 50 }, type: 'slime', color: '#16a34a', originalX: 9900, patrolDistance: 400, speed: 2, direction: 1 }, // Drop Zone Patrol
    { id: 206, position: { x: 12000, y: 620 }, size: { width: 60, height: 50 }, type: 'slime', color: '#16a34a', originalX: 12000, patrolDistance: 500, speed: 1, direction: 1 }, // Final Boss Slime
];

export const getButterflyCheckpoints = (): Checkpoint[] => [
    { id: 201, position: { x: 1800, y: 550 }, size: { width: 40, height: 60 }, triggered: false },
    { id: 202, position: { x: 4400, y: 550 }, size: { width: 40, height: 60 }, triggered: false },
    { id: 203, position: { x: 7600, y: 500 }, size: { width: 40, height: 60 }, triggered: false }, // Mid-way check
    { id: 204, position: { x: 9850, y: 550 }, size: { width: 40, height: 60 }, triggered: false }, // After the hive drop
];

// --- LEVEL 3: FRUIT PARADISE (BONUS LEVEL) ---
// No enemies, lots of bouncing, special fruits
export const getFruitParadisePlatforms = (): Platform[] => [
    { position: { x: -200, y: 600 }, size: { width: 1000, height: 200 }, type: 'ground', color: '#fbcfe8' }, // Pink clouds ground
    
    // Bouncy Cloud Run
    { position: { x: 1000, y: 500 }, size: { width: 150, height: 50 }, type: 'cloud', color: '#fff' },
    { position: { x: 1300, y: 400 }, size: { width: 150, height: 50 }, type: 'cloud', color: '#fff' },
    { position: { x: 1600, y: 300 }, size: { width: 150, height: 50 }, type: 'cloud', color: '#fff' },
    
    { position: { x: 2000, y: 500 }, size: { width: 500, height: 50 }, type: 'mushroom', color: '#fca5a5', deformation: 0 }, // Giant trampoline
    
    { position: { x: 2800, y: 400 }, size: { width: 150, height: 20 }, type: 'leaf', color: '#86efac' },
    { position: { x: 3100, y: 350 }, size: { width: 150, height: 20 }, type: 'leaf', color: '#86efac' },
    
    // Fruit Tree Layout
    { position: { x: 3500, y: 600 }, size: { width: 1000, height: 200 }, type: 'ground', color: '#fbcfe8' },
    
    // Sky High
    { position: { x: 4800, y: 500 }, size: { width: 200, height: 50 }, type: 'cloud', color: '#fff' },
    { position: { x: 5200, y: 400 }, size: { width: 200, height: 50 }, type: 'cloud', color: '#fff' },
    { position: { x: 5600, y: 300 }, size: { width: 200, height: 50 }, type: 'cloud', color: '#fff' },
    
    // Final Safe Platform
    { position: { x: 6000, y: 500 }, size: { width: 2000, height: 200 }, type: 'ground', color: '#fbcfe8' },
    { position: { x: 7500, y: -200 }, size: { width: 100, height: 1000 }, type: 'ground', color: '#fbcfe8' }, // Wall

    // The Final Portal
    { position: { x: 7000, y: 350 }, size: { width: 150, height: 150 }, type: 'aurora', color: 'transparent', requiresCoop: true },
];

export const getFruitParadiseCoins = (): Coin[] => [
    // Apples (Red)
    { id: 301, position: { x: 1075, y: 400 }, size: 16, collected: false, baseY: 400, type: 'apple' },
    { id: 302, position: { x: 1375, y: 300 }, size: 16, collected: false, baseY: 300, type: 'apple' },
    
    // Bananas (Yellow - Curves)
    { id: 310, position: { x: 2100, y: 300 }, size: 16, collected: false, baseY: 300, type: 'banana' },
    { id: 311, position: { x: 2250, y: 250 }, size: 16, collected: false, baseY: 250, type: 'banana' },
    { id: 312, position: { x: 2400, y: 300 }, size: 16, collected: false, baseY: 300, type: 'banana' },

    // Cherries (Pairs)
    { id: 320, position: { x: 3700, y: 500 }, size: 14, collected: false, baseY: 500, type: 'cherry' },
    { id: 321, position: { x: 3900, y: 500 }, size: 14, collected: false, baseY: 500, type: 'cherry' },
    { id: 322, position: { x: 4100, y: 500 }, size: 14, collected: false, baseY: 500, type: 'cherry' },

    // Big Mix
    { id: 330, position: { x: 4900, y: 400 }, size: 16, collected: false, baseY: 400, type: 'apple' },
    { id: 331, position: { x: 5300, y: 300 }, size: 16, collected: false, baseY: 300, type: 'banana' },
    { id: 332, position: { x: 5700, y: 200 }, size: 16, collected: false, baseY: 200, type: 'cherry' },
    
    // Bonus End
    { id: 340, position: { x: 6500, y: 400 }, size: 20, collected: false, baseY: 400, type: 'kanelbulle' },
    { id: 341, position: { x: 6700, y: 400 }, size: 20, collected: false, baseY: 400, type: 'hot-chocolate' },
];

export const getFruitParadiseEnemies = (): Enemy[] => []; // No enemies!

export const getFruitParadiseCheckpoints = (): Checkpoint[] => [
    { id: 301, position: { x: 3000, y: 400 }, size: { width: 40, height: 60 }, triggered: false },
];

// --- LEVEL 4: AURORA'S GUARDIAN (BOSS LEVEL) ---
export const getBossLevelPlatforms = (): Platform[] => [
    // Starting platform - softer colors
    { position: { x: -200, y: 600 }, size: { width: 1200, height: 200 }, type: 'ground', color: '#475569' },

    // Main arena floor - neutral gray
    { position: { x: 1200, y: 650 }, size: { width: 3000, height: 150 }, type: 'ground', color: '#64748b' },

    // Side platforms for dodging - visible but not harsh
    { position: { x: 1500, y: 450 }, size: { width: 200, height: 20 }, type: 'block', color: '#94a3b8' },
    { position: { x: 2200, y: 350 }, size: { width: 200, height: 20 }, type: 'block', color: '#94a3b8' },
    { position: { x: 2900, y: 450 }, size: { width: 200, height: 20 }, type: 'block', color: '#94a3b8' },
    { position: { x: 3600, y: 350 }, size: { width: 200, height: 20 }, type: 'block', color: '#94a3b8' },

    // Emergency mushroom - calmer color
    { position: { x: 2400, y: 570 }, size: { width: 100, height: 80 }, type: 'mushroom', color: '#60a5fa', deformation: 0 },

    // Ice hazards - softer blue
    { position: { x: 1800, y: 600 }, size: { width: 150, height: 50 }, type: 'ice', color: '#93c5fd' },
    { position: { x: 3200, y: 600 }, size: { width: 150, height: 50 }, type: 'ice', color: '#93c5fd' },

    // End platform with portal
    { position: { x: 4500, y: 600 }, size: { width: 2000, height: 200 }, type: 'ground', color: '#475569' },
    { position: { x: 5200, y: 450 }, size: { width: 150, height: 150 }, type: 'aurora', color: 'transparent', requiresCoop: true },

    // Walls
    { position: { x: 6500, y: -200 }, size: { width: 100, height: 1000 }, type: 'ground', color: '#64748b' },
];

export const getBossLevelCoins = (): Coin[] => [
    { id: 401, position: { x: 1600, y: 400 }, size: 14, collected: false, baseY: 400, type: 'hot-chocolate' },
    { id: 402, position: { x: 2300, y: 300 }, size: 14, collected: false, baseY: 300, type: 'hot-chocolate' },
    { id: 403, position: { x: 3000, y: 400 }, size: 14, collected: false, baseY: 400, type: 'hot-chocolate' },
    { id: 404, position: { x: 3700, y: 300 }, size: 14, collected: false, baseY: 300, type: 'hot-chocolate' },
    { id: 405, position: { x: 2500, y: 470 }, size: 14, collected: false, baseY: 470, type: 'gold' },
    { id: 406, position: { x: 5500, y: 500 }, size: 14, collected: false, baseY: 500, type: 'kanelbulle' },
    { id: 407, position: { x: 5700, y: 500 }, size: 14, collected: false, baseY: 500, type: 'kanelbulle' },
    { id: 408, position: { x: 5900, y: 500 }, size: 14, collected: false, baseY: 500, type: 'kanelbulle' },
];

export const getBossLevelEnemies = (): Enemy[] => [
    // THE BOSS: Aurora Guardian - simplified for better visuals
    {
        id: 999,
        position: { x: 3800, y: 400 },
        size: { width: 150, height: 200 },
        type: 'boss',
        color: '#94a3b8', // Softer slate color
        health: 8, // Reduced health for easier fight
        maxHealth: 8,
        phase: 1,
        attackTimer: 0,
        originalX: 3800,
        patrolDistance: 400, // Smaller patrol area
        speed: 1.2, // Slower movement
        direction: 1
    }
];

export const getBossLevelCheckpoints = (): Checkpoint[] => [
    { id: 401, position: { x: 800, y: 550 }, size: { width: 40, height: 60 }, triggered: false },
    { id: 402, position: { x: 4600, y: 550 }, size: { width: 40, height: 60 }, triggered: false },
];

export const getBossLevelPowerUps = (): import('./types').PowerUp[] => [
    { id: 1, position: { x: 1600, y: 420 }, size: { width: 30, height: 30 }, type: 'shield', collected: false, baseY: 420, duration: 300 },
    { id: 2, position: { x: 2300, y: 320 }, size: { width: 30, height: 30 }, type: 'speed', collected: false, baseY: 320, duration: 240 },
    { id: 3, position: { x: 3000, y: 420 }, size: { width: 30, height: 30 }, type: 'double_jump', collected: false, baseY: 420, duration: 360 },
    { id: 4, position: { x: 3700, y: 320 }, size: { width: 30, height: 30 }, type: 'star', collected: false, baseY: 320, duration: 180 },
];
