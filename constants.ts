
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
export const LEVEL_3_WIDTH = 5500;  // Level 3 Length
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
  { position: { x: 3650, y: 360 }, size: { width: 120, height: 20 }, type: 'leaf', color: '#22c55e' },
  { position: { x: 3800, y: 320 }, size: { width: 100, height: 20 }, type: 'crumbly', color: '#fde047', fallTimer: 60, maxFallTimer: 60, respawnTimer: 0 },
  { position: { x: 3950, y: 400 }, size: { width: 120, height: 20 }, type: 'leaf', color: '#22c55e' },
  { position: { x: 4200, y: 600 }, size: { width: 1000, height: 200 }, type: 'ground', color: '#86efac' },
  { position: { x: 5250, y: 550 }, size: { width: 150, height: 20 }, type: 'leaf', color: '#22c55e' },
  { position: { x: 5500, y: 500 }, size: { width: 200, height: 20 }, type: 'leaf', color: '#22c55e' },
  { position: { x: 6000, y: 600 }, size: { width: 1500, height: 200 }, type: 'ground', color: '#86efac' },
  { position: { x: 7500, y: 550 }, size: { width: 500, height: 200 }, type: 'ground', color: '#86efac' },
  
  // --- ACT 2 EXTENSION: THE HIVE CLIMB ---
  { position: { x: 8050, y: 500 }, size: { width: 120, height: 20 }, type: 'leaf', color: '#22c55e' },
  { position: { x: 8200, y: 450 }, size: { width: 100, height: 80 }, type: 'mushroom', color: '#fca5a5', deformation: 0 },
  { position: { x: 8350, y: 370 }, size: { width: 120, height: 20 }, type: 'leaf', color: '#22c55e' },
  { position: { x: 8500, y: 300 }, size: { width: 100, height: 80 }, type: 'mushroom', color: '#fca5a5', deformation: 0 },
  { position: { x: 8650, y: 220 }, size: { width: 120, height: 20 }, type: 'leaf', color: '#22c55e' },
  { position: { x: 8800, y: 150 }, size: { width: 300, height: 20 }, type: 'leaf', color: '#22c55e' },

  // High Hive Platform
  { position: { x: 9100, y: 230 }, size: { width: 120, height: 20 }, type: 'cloud', color: '#e0f2fe' },
  { position: { x: 9200, y: 150 }, size: { width: 100, height: 20 }, type: 'block', color: '#eab308' },
  { position: { x: 9300, y: 150 }, size: { width: 100, height: 20 }, type: 'block', color: '#eab308' },
  { position: { x: 9500, y: 300 }, size: { width: 100, height: 20 }, type: 'block', color: '#eab308' },
  { position: { x: 9650, y: 450 }, size: { width: 120, height: 20 }, type: 'leaf', color: '#22c55e' },
  
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
// No enemies, lots of bouncing, special fruits - FAST & FUN!
export const getFruitParadisePlatforms = (): Platform[] => [
    // Starting Fruit Garden
    { position: { x: -200, y: 600 }, size: { width: 800, height: 200 }, type: 'ground', color: '#fbcfe8' },

    // Cloud Hopping Trail - Easy continuous jumps
    { position: { x: 700, y: 550 }, size: { width: 120, height: 40 }, type: 'cloud', color: '#fff' },
    { position: { x: 900, y: 500 }, size: { width: 120, height: 40 }, type: 'cloud', color: '#fff' },
    { position: { x: 1100, y: 450 }, size: { width: 120, height: 40 }, type: 'cloud', color: '#fff' },
    { position: { x: 1300, y: 500 }, size: { width: 120, height: 40 }, type: 'cloud', color: '#fff' },
    { position: { x: 1500, y: 550 }, size: { width: 120, height: 40 }, type: 'cloud', color: '#fff' },

    // Super Bounce Zone 1
    { position: { x: 1750, y: 600 }, size: { width: 150, height: 60 }, type: 'mushroom', color: '#fca5a5', deformation: 0 },
    { position: { x: 2000, y: 600 }, size: { width: 150, height: 60 }, type: 'mushroom', color: '#fca5a5', deformation: 0 },
    { position: { x: 2250, y: 600 }, size: { width: 150, height: 60 }, type: 'mushroom', color: '#fca5a5', deformation: 0 },

    // Fruit Orchard Ground
    { position: { x: 2500, y: 650 }, size: { width: 900, height: 150 }, type: 'ground', color: '#fbcfe8' },

    // Mid-Level Mushroom Platforms
    { position: { x: 2700, y: 550 }, size: { width: 100, height: 50 }, type: 'mushroom', color: '#fca5a5', deformation: 0 },
    { position: { x: 3100, y: 550 }, size: { width: 100, height: 50 }, type: 'mushroom', color: '#fca5a5', deformation: 0 },

    // Sky High Section with alternating platforms
    { position: { x: 3500, y: 500 }, size: { width: 120, height: 40 }, type: 'cloud', color: '#fff' },
    { position: { x: 3700, y: 400 }, size: { width: 120, height: 40 }, type: 'cloud', color: '#fff' },
    { position: { x: 3900, y: 350 }, size: { width: 100, height: 50 }, type: 'mushroom', color: '#fca5a5', deformation: 0 },
    { position: { x: 4100, y: 400 }, size: { width: 120, height: 40 }, type: 'cloud', color: '#fff' },
    { position: { x: 4300, y: 500 }, size: { width: 120, height: 40 }, type: 'cloud', color: '#fff' },

    // Giant Bounce Platform
    { position: { x: 4550, y: 600 }, size: { width: 300, height: 60 }, type: 'mushroom', color: '#fca5a5', deformation: 0 },

    // Leaf Platforms
    { position: { x: 4300, y: 350 }, size: { width: 100, height: 15 }, type: 'leaf', color: '#86efac' },
    { position: { x: 4500, y: 300 }, size: { width: 100, height: 15 }, type: 'leaf', color: '#86efac' },

    // Final Celebration Ground
    { position: { x: 4900, y: 650 }, size: { width: 800, height: 150 }, type: 'ground', color: '#fbcfe8' },
    { position: { x: 5600, y: -200 }, size: { width: 100, height: 1000 }, type: 'ground', color: '#fbcfe8' }, // Wall

    // The Final Portal
    { position: { x: 5300, y: 500 }, size: { width: 150, height: 150 }, type: 'aurora', color: 'transparent', requiresCoop: true },
];

export const getFruitParadiseCoins = (): Coin[] => [
    // Starting Garden - Ground Level Fruits (10 fruits)
    { id: 301, position: { x: 100, y: 550 }, size: 16, collected: false, baseY: 550, type: 'apple' },
    { id: 302, position: { x: 200, y: 550 }, size: 16, collected: false, baseY: 550, type: 'banana' },
    { id: 303, position: { x: 300, y: 550 }, size: 14, collected: false, baseY: 550, type: 'cherry' },
    { id: 304, position: { x: 400, y: 550 }, size: 16, collected: false, baseY: 550, type: 'apple' },
    { id: 305, position: { x: 150, y: 500 }, size: 16, collected: false, baseY: 500, type: 'banana' },
    { id: 306, position: { x: 250, y: 500 }, size: 14, collected: false, baseY: 500, type: 'cherry' },
    { id: 307, position: { x: 350, y: 500 }, size: 16, collected: false, baseY: 500, type: 'apple' },
    { id: 308, position: { x: 450, y: 500 }, size: 16, collected: false, baseY: 500, type: 'banana' },
    { id: 309, position: { x: 200, y: 450 }, size: 14, collected: false, baseY: 450, type: 'cherry' },
    { id: 310, position: { x: 300, y: 450 }, size: 16, collected: false, baseY: 450, type: 'apple' },

    // Cloud Trail Fruits (10 fruits)
    { id: 311, position: { x: 750, y: 500 }, size: 16, collected: false, baseY: 500, type: 'apple' },
    { id: 312, position: { x: 800, y: 450 }, size: 16, collected: false, baseY: 450, type: 'banana' },
    { id: 313, position: { x: 950, y: 450 }, size: 14, collected: false, baseY: 450, type: 'cherry' },
    { id: 314, position: { x: 1000, y: 400 }, size: 16, collected: false, baseY: 400, type: 'apple' },
    { id: 315, position: { x: 1150, y: 400 }, size: 16, collected: false, baseY: 400, type: 'banana' },
    { id: 316, position: { x: 1200, y: 350 }, size: 14, collected: false, baseY: 350, type: 'cherry' },
    { id: 317, position: { x: 1350, y: 450 }, size: 16, collected: false, baseY: 450, type: 'apple' },
    { id: 318, position: { x: 1400, y: 400 }, size: 16, collected: false, baseY: 400, type: 'banana' },
    { id: 319, position: { x: 1550, y: 500 }, size: 14, collected: false, baseY: 500, type: 'cherry' },
    { id: 320, position: { x: 1600, y: 450 }, size: 16, collected: false, baseY: 450, type: 'apple' },

    // Bounce Zone Arc Fruits (12 fruits)
    { id: 321, position: { x: 1800, y: 450 }, size: 16, collected: false, baseY: 450, type: 'banana' },
    { id: 322, position: { x: 1850, y: 350 }, size: 14, collected: false, baseY: 350, type: 'cherry' },
    { id: 323, position: { x: 1900, y: 250 }, size: 16, collected: false, baseY: 250, type: 'apple' },
    { id: 324, position: { x: 1950, y: 200 }, size: 16, collected: false, baseY: 200, type: 'banana' },
    { id: 325, position: { x: 2050, y: 450 }, size: 16, collected: false, baseY: 450, type: 'apple' },
    { id: 326, position: { x: 2100, y: 350 }, size: 14, collected: false, baseY: 350, type: 'cherry' },
    { id: 327, position: { x: 2150, y: 250 }, size: 16, collected: false, baseY: 250, type: 'banana' },
    { id: 328, position: { x: 2200, y: 200 }, size: 16, collected: false, baseY: 200, type: 'apple' },
    { id: 329, position: { x: 2300, y: 450 }, size: 14, collected: false, baseY: 450, type: 'cherry' },
    { id: 330, position: { x: 2350, y: 350 }, size: 16, collected: false, baseY: 350, type: 'banana' },
    { id: 331, position: { x: 2400, y: 250 }, size: 16, collected: false, baseY: 250, type: 'apple' },
    { id: 332, position: { x: 2450, y: 200 }, size: 14, collected: false, baseY: 200, type: 'cherry' },

    // Fruit Orchard - Dense Cluster (18 fruits)
    { id: 333, position: { x: 2550, y: 600 }, size: 16, collected: false, baseY: 600, type: 'apple' },
    { id: 334, position: { x: 2650, y: 600 }, size: 16, collected: false, baseY: 600, type: 'banana' },
    { id: 335, position: { x: 2750, y: 600 }, size: 14, collected: false, baseY: 600, type: 'cherry' },
    { id: 336, position: { x: 2850, y: 600 }, size: 16, collected: false, baseY: 600, type: 'apple' },
    { id: 337, position: { x: 2950, y: 600 }, size: 16, collected: false, baseY: 600, type: 'banana' },
    { id: 338, position: { x: 3050, y: 600 }, size: 14, collected: false, baseY: 600, type: 'cherry' },
    { id: 339, position: { x: 3150, y: 600 }, size: 16, collected: false, baseY: 600, type: 'apple' },
    { id: 340, position: { x: 3250, y: 600 }, size: 16, collected: false, baseY: 600, type: 'banana' },
    { id: 341, position: { x: 3350, y: 600 }, size: 14, collected: false, baseY: 600, type: 'cherry' },
    { id: 342, position: { x: 2600, y: 550 }, size: 16, collected: false, baseY: 550, type: 'apple' },
    { id: 343, position: { x: 2700, y: 550 }, size: 16, collected: false, baseY: 550, type: 'banana' },
    { id: 344, position: { x: 2800, y: 550 }, size: 14, collected: false, baseY: 550, type: 'cherry' },
    { id: 345, position: { x: 2900, y: 550 }, size: 16, collected: false, baseY: 550, type: 'apple' },
    { id: 346, position: { x: 3000, y: 550 }, size: 16, collected: false, baseY: 550, type: 'banana' },
    { id: 347, position: { x: 3100, y: 550 }, size: 14, collected: false, baseY: 550, type: 'cherry' },
    { id: 348, position: { x: 3200, y: 550 }, size: 16, collected: false, baseY: 550, type: 'apple' },
    { id: 349, position: { x: 3300, y: 550 }, size: 16, collected: false, baseY: 550, type: 'banana' },
    { id: 350, position: { x: 2900, y: 500 }, size: 20, collected: false, baseY: 500, type: 'hot-chocolate' },

    // Sky High Section (12 fruits)
    { id: 351, position: { x: 3550, y: 450 }, size: 16, collected: false, baseY: 450, type: 'apple' },
    { id: 352, position: { x: 3600, y: 400 }, size: 16, collected: false, baseY: 400, type: 'banana' },
    { id: 353, position: { x: 3750, y: 350 }, size: 14, collected: false, baseY: 350, type: 'cherry' },
    { id: 354, position: { x: 3800, y: 300 }, size: 16, collected: false, baseY: 300, type: 'apple' },
    { id: 355, position: { x: 3950, y: 250 }, size: 16, collected: false, baseY: 250, type: 'banana' },
    { id: 356, position: { x: 4000, y: 200 }, size: 14, collected: false, baseY: 200, type: 'cherry' },
    { id: 357, position: { x: 4150, y: 350 }, size: 16, collected: false, baseY: 350, type: 'apple' },
    { id: 358, position: { x: 4200, y: 300 }, size: 16, collected: false, baseY: 300, type: 'banana' },
    { id: 359, position: { x: 4350, y: 450 }, size: 14, collected: false, baseY: 450, type: 'cherry' },
    { id: 360, position: { x: 4400, y: 400 }, size: 16, collected: false, baseY: 400, type: 'apple' },
    { id: 361, position: { x: 4350, y: 300 }, size: 16, collected: false, baseY: 300, type: 'banana' },
    { id: 362, position: { x: 4550, y: 250 }, size: 14, collected: false, baseY: 250, type: 'cherry' },

    // Giant Bounce Fruits (8 fruits)
    { id: 363, position: { x: 4600, y: 450 }, size: 16, collected: false, baseY: 450, type: 'apple' },
    { id: 364, position: { x: 4650, y: 350 }, size: 16, collected: false, baseY: 350, type: 'banana' },
    { id: 365, position: { x: 4700, y: 250 }, size: 14, collected: false, baseY: 250, type: 'cherry' },
    { id: 366, position: { x: 4750, y: 150 }, size: 16, collected: false, baseY: 150, type: 'apple' },
    { id: 367, position: { x: 4800, y: 100 }, size: 16, collected: false, baseY: 100, type: 'banana' },
    { id: 368, position: { x: 4700, y: 450 }, size: 14, collected: false, baseY: 450, type: 'cherry' },
    { id: 369, position: { x: 4750, y: 350 }, size: 16, collected: false, baseY: 350, type: 'apple' },
    { id: 370, position: { x: 4800, y: 250 }, size: 16, collected: false, baseY: 250, type: 'banana' },

    // Final Celebration (12 fruits + bonuses)
    { id: 371, position: { x: 4950, y: 600 }, size: 16, collected: false, baseY: 600, type: 'apple' },
    { id: 372, position: { x: 5000, y: 600 }, size: 16, collected: false, baseY: 600, type: 'banana' },
    { id: 373, position: { x: 5050, y: 600 }, size: 14, collected: false, baseY: 600, type: 'cherry' },
    { id: 374, position: { x: 5100, y: 600 }, size: 16, collected: false, baseY: 600, type: 'apple' },
    { id: 375, position: { x: 5150, y: 600 }, size: 16, collected: false, baseY: 600, type: 'banana' },
    { id: 376, position: { x: 5200, y: 600 }, size: 14, collected: false, baseY: 600, type: 'cherry' },
    { id: 377, position: { x: 5250, y: 600 }, size: 16, collected: false, baseY: 600, type: 'apple' },
    { id: 378, position: { x: 5300, y: 600 }, size: 16, collected: false, baseY: 600, type: 'banana' },
    { id: 379, position: { x: 5350, y: 600 }, size: 14, collected: false, baseY: 600, type: 'cherry' },
    { id: 380, position: { x: 5400, y: 600 }, size: 16, collected: false, baseY: 600, type: 'apple' },
    { id: 381, position: { x: 5050, y: 550 }, size: 20, collected: false, baseY: 550, type: 'kanelbulle' },
    { id: 382, position: { x: 5200, y: 550 }, size: 20, collected: false, baseY: 550, type: 'kanelbulle' },
    { id: 383, position: { x: 5350, y: 550 }, size: 20, collected: false, baseY: 550, type: 'hot-chocolate' },
    { id: 384, position: { x: 5100, y: 500 }, size: 20, collected: false, baseY: 500, type: 'kanelbulle' },
    { id: 385, position: { x: 5300, y: 500 }, size: 20, collected: false, baseY: 500, type: 'hot-chocolate' },
];

export const getFruitParadiseEnemies = (): Enemy[] => []; // No enemies!

export const getFruitParadiseCheckpoints = (): Checkpoint[] => [
    { id: 301, position: { x: 1650, y: 550 }, size: { width: 40, height: 60 }, triggered: false }, // After cloud trail
    { id: 302, position: { x: 2600, y: 600 }, size: { width: 40, height: 60 }, triggered: false }, // In fruit orchard
    { id: 303, position: { x: 4200, y: 450 }, size: { width: 40, height: 60 }, triggered: false }, // After sky high section
];

// --- LEVEL 4: AURORA'S GUARDIAN (BOSS LEVEL) ---
export const getBossLevelPlatforms = (): Platform[] => [
    // Temple entrance
    { position: { x: -200, y: 600 }, size: { width: 1000, height: 200 }, type: 'ground', color: '#475569' },

    // Preparation zone platform
    { position: { x: 900, y: 550 }, size: { width: 150, height: 20 }, type: 'block', color: '#94a3b8' },

    // Main arena floor - expanded
    { position: { x: 1200, y: 650 }, size: { width: 3500, height: 150 }, type: 'ground', color: '#64748b' },

    // Left zone - dodging platforms
    { position: { x: 1400, y: 500 }, size: { width: 180, height: 20 }, type: 'block', color: '#94a3b8' },
    { position: { x: 1650, y: 380 }, size: { width: 180, height: 20 }, type: 'block', color: '#94a3b8' },
    { position: { x: 1400, y: 260 }, size: { width: 180, height: 20 }, type: 'crumbly', color: '#94a3b8', isFalling: false, fallTimer: 60, maxFallTimer: 60, respawnTimer: 0 },

    // Center zone - tactical mushrooms
    { position: { x: 2300, y: 570 }, size: { width: 120, height: 80 }, type: 'mushroom', color: '#60a5fa', deformation: 0 },
    { position: { x: 2650, y: 570 }, size: { width: 120, height: 80 }, type: 'mushroom', color: '#60a5fa', deformation: 0 },
    { position: { x: 2475, y: 400 }, size: { width: 150, height: 20 }, type: 'block', color: '#94a3b8' },
    { position: { x: 2475, y: 250 }, size: { width: 150, height: 20 }, type: 'cloud', color: '#e0f2fe' },

    // Right zone - high platforms for crystals
    { position: { x: 3100, y: 500 }, size: { width: 180, height: 20 }, type: 'block', color: '#94a3b8' },
    { position: { x: 3350, y: 350 }, size: { width: 180, height: 20 }, type: 'block', color: '#94a3b8' },
    { position: { x: 3650, y: 480 }, size: { width: 180, height: 20 }, type: 'leaf', color: '#86efac' },
    { position: { x: 4000, y: 350 }, size: { width: 180, height: 20 }, type: 'crumbly', color: '#94a3b8', isFalling: false, fallTimer: 60, maxFallTimer: 60, respawnTimer: 0 },

    // Ice hazard zones
    { position: { x: 1900, y: 600 }, size: { width: 200, height: 50 }, type: 'ice', color: '#93c5fd' },
    { position: { x: 3400, y: 600 }, size: { width: 200, height: 50 }, type: 'ice', color: '#93c5fd' },

    // Safe alcoves in walls
    { position: { x: 1200, y: 500 }, size: { width: 80, height: 150 }, type: 'block', color: '#64748b' },
    { position: { x: 4620, y: 500 }, size: { width: 80, height: 150 }, type: 'block', color: '#64748b' },

    // End platform with victory portal
    { position: { x: 5000, y: 600 }, size: { width: 2000, height: 200 }, type: 'ground', color: '#475569' },
    { position: { x: 5700, y: 450 }, size: { width: 150, height: 150 }, type: 'aurora', color: 'transparent', requiresCoop: true },

    // Arena walls
    { position: { x: 4700, y: -200 }, size: { width: 100, height: 900 }, type: 'ground', color: '#64748b' },
    { position: { x: 7000, y: -200 }, size: { width: 100, height: 1000 }, type: 'ground', color: '#64748b' },
];

export const getBossLevelCoins = (): Coin[] => [
    { id: 401, position: { x: 1450, y: 450 }, size: 14, collected: false, baseY: 450, type: 'hot-chocolate' },
    { id: 402, position: { x: 1700, y: 330 }, size: 14, collected: false, baseY: 330, type: 'hot-chocolate' },
    { id: 403, position: { x: 1450, y: 210 }, size: 14, collected: false, baseY: 210, type: 'gold' },
    { id: 404, position: { x: 2350, y: 470 }, size: 14, collected: false, baseY: 470, type: 'gold' },
    { id: 405, position: { x: 2700, y: 470 }, size: 14, collected: false, baseY: 470, type: 'gold' },
    { id: 406, position: { x: 2525, y: 350 }, size: 14, collected: false, baseY: 350, type: 'hot-chocolate' },
    { id: 407, position: { x: 2525, y: 200 }, size: 14, collected: false, baseY: 200, type: 'gold' },
    { id: 408, position: { x: 3150, y: 450 }, size: 14, collected: false, baseY: 450, type: 'gold' },
    { id: 409, position: { x: 3400, y: 300 }, size: 14, collected: false, baseY: 300, type: 'hot-chocolate' },
    { id: 410, position: { x: 3700, y: 430 }, size: 14, collected: false, baseY: 430, type: 'gold' },
    { id: 411, position: { x: 4050, y: 300 }, size: 14, collected: false, baseY: 300, type: 'gold' },
    { id: 412, position: { x: 5500, y: 500 }, size: 14, collected: false, baseY: 500, type: 'kanelbulle' },
    { id: 413, position: { x: 5700, y: 500 }, size: 14, collected: false, baseY: 500, type: 'kanelbulle' },
    { id: 414, position: { x: 5900, y: 500 }, size: 14, collected: false, baseY: 500, type: 'kanelbulle' },
    { id: 415, position: { x: 6100, y: 500 }, size: 14, collected: false, baseY: 500, type: 'hot-chocolate' },
];

export const getBossLevelEnemies = (): Enemy[] => [
    {
        id: 999,
        position: { x: 2800, y: 400 },
        size: { width: 150, height: 200 },
        type: 'boss',
        color: '#94a3b8',
        health: 12,
        maxHealth: 12,
        phase: 1,
        attackTimer: 0,
        attackCooldown: 0,
        isAttacking: false,
        attackType: 'slam',
        isInvincible: false,
        shieldActive: false,
        originalX: 2800,
        patrolDistance: 500,
        speed: 1.5,
        direction: 1,
        isDashing: false,
        hitFlash: 0
    }
];

export const getBossLevelCheckpoints = (): Checkpoint[] => [
    { id: 401, position: { x: 950, y: 500 }, size: { width: 40, height: 60 }, triggered: false },
    { id: 402, position: { x: 4600, y: 550 }, size: { width: 40, height: 60 }, triggered: false },
];

export const getBossLevelPowerUps = (): import('./types').PowerUp[] => [
    { id: 1, position: { x: 1240, y: 470 }, size: { width: 30, height: 30 }, type: 'shield', collected: false, baseY: 470, duration: 360 },
    { id: 2, position: { x: 4660, y: 470 }, size: { width: 30, height: 30 }, type: 'shield', collected: false, baseY: 470, duration: 360 },
    { id: 3, position: { x: 2475, y: 370 }, size: { width: 30, height: 30 }, type: 'double_jump', collected: false, baseY: 370, duration: 420 },
    { id: 4, position: { x: 2525, y: 220 }, size: { width: 30, height: 30 }, type: 'star', collected: false, baseY: 220, duration: 240 },
    { id: 5, position: { x: 3400, y: 320 }, size: { width: 30, height: 30 }, type: 'speed', collected: false, baseY: 320, duration: 300 },
];
