
import { Platform, Player, Coin, Enemy, Checkpoint } from "./types";

export const GRAVITY = 0.75;
export const TERMINAL_VELOCITY = 16;
export const FRICTION = 0.82;
export const ICE_FRICTION = 0.96;
export const WIND_FORCE = -0.12;
export const CANVAS_WIDTH = 1280;
export const CANVAS_HEIGHT = 720;
export const HOT_CHOCOLATE_DURATION = 480;

export const COYOTE_TIME = 8;
export const JUMP_BUFFER = 8;

export const WALL_SLIDE_SPEED = 2;
export const WALL_JUMP_FORCE_X = 12;
export const WALL_JUMP_FORCE_Y = -14;
export const WALL_JUMP_COOLDOWN = 15;

export const DASH_SPEED = 15;
export const DASH_DURATION = 12;
export const DASH_COOLDOWN = 90;

export const GROUND_POUND_SPEED = 20;
export const GROUND_POUND_COOLDOWN = 30;

export const LEDGE_GRAB_RANGE = 15;

export const COMBO_TIMEOUT = 120;
export const MAX_COMBO_MULTIPLIER = 5;

export const REVIVE_TIME = 180;

export const LEVEL_1_WIDTH = 16000;
export const LEVEL_2_WIDTH = 17000;
export const LEVEL_3_WIDTH = 7500;
export const LEVEL_4_WIDTH = 10000;
export const LEVEL_5_WIDTH = 18000;
export const LEVEL_6_WIDTH = 20000;
export const LEVEL_7_WIDTH = 15000;

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
    color: '#FF69B4',
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
    deathProtection: false,
    iceThrowCooldown: 0,
    coyoteTimer: 0,
    jumpBufferTimer: 0,
    mushroomCooldown: 0,
    standingOn: null,
    isWallSliding: false,
    wallSlideDirection: null,
    wallJumpCooldown: 0,
    canWallJump: false,
    isDashing: false,
    dashCooldown: 0,
    dashTimer: 0,
    dashDirection: { x: 0, y: 0 },
    isGroundPounding: false,
    groundPoundCooldown: 0,
    isLedgeGrabbing: false,
    ledgeGrabPlatform: null,
    comboCount: 0,
    comboTimer: 0,
    reviveTimer: 0,
    canBeRevived: false
  },
  {
    id: 'baba',
    name: 'Baba',
    position: { x: 50, y: 500 },
    velocity: { x: 0, y: 0 },
    size: { width: 45, height: 65 },
    baseSize: { width: 45, height: 65 },
    scale: { x: 1, y: 1 },
    color: '#1E90FF',
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
    deathProtection: false,
    iceThrowCooldown: 0,
    coyoteTimer: 0,
    jumpBufferTimer: 0,
    mushroomCooldown: 0,
    standingOn: null,
    isWallSliding: false,
    wallSlideDirection: null,
    wallJumpCooldown: 0,
    canWallJump: false,
    isDashing: false,
    dashCooldown: 0,
    dashTimer: 0,
    dashDirection: { x: 0, y: 0 },
    isGroundPounding: false,
    groundPoundCooldown: 0,
    isLedgeGrabbing: false,
    ledgeGrabPlatform: null,
    comboCount: 0,
    comboTimer: 0,
    reviveTimer: 0,
    canBeRevived: false
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
  { id: 99, position: { x: 3450, y: -50 }, size: { width: 40, height: 250 }, type: 'door', color: '#334155', isOpen: false },
  { id: 100, linkId: 99, position: { x: 2700, y: 640 }, size: { width: 40, height: 10 }, type: 'plate', color: '#facc15', isPressed: false },
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
  { position: { x: 12600, y: 150 }, size: { width: 500, height: 600 }, type: 'ground', color: '#e2e8f0' },

  // NEW AREA: Ice Cave with Moving Platforms (x: 13100-14500)
  { position: { x: 13100, y: 400 }, size: { width: 100, height: 20 }, type: 'moving', color: '#60a5fa', moveDirection: 'vertical', moveDistance: 150 },
  { position: { x: 13350, y: 300 }, size: { width: 100, height: 20 }, type: 'moving', color: '#60a5fa', moveDirection: 'horizontal', moveDistance: 100 },
  { position: { x: 13600, y: 250 }, size: { width: 100, height: 20 }, type: 'moving', color: '#60a5fa', moveDirection: 'vertical', moveDistance: 120 },
  { position: { x: 13850, y: 200 }, size: { width: 150, height: 20 }, type: 'ground', color: '#e2e8f0' },

  // Spike Trap Challenge
  { position: { x: 14050, y: 400 }, size: { width: 80, height: 20 }, type: 'spike', color: '#ef4444', spikeMaxTimer: 90, spikeActive: false },
  { position: { x: 14150, y: 400 }, size: { width: 80, height: 20 }, type: 'spike', color: '#ef4444', spikeMaxTimer: 90, spikeActive: true },
  { position: { x: 14250, y: 400 }, size: { width: 80, height: 20 }, type: 'spike', color: '#ef4444', spikeMaxTimer: 90, spikeActive: false },
  { position: { x: 14000, y: 420 }, size: { width: 400, height: 30 }, type: 'ice', color: '#bae6fd' },
  { position: { x: 14400, y: 350 }, size: { width: 100, height: 20 }, type: 'ground', color: '#e2e8f0' },

  // Timed Button Puzzle (x: 14500-15000)
  { id: 201, position: { x: 14600, y: 500 }, size: { width: 60, height: 15 }, type: 'timed_button', color: '#fbbf24', isPressed: false, buttonMaxTimer: 180, linkId: 202 },
  { id: 202, position: { x: 14900, y: 300 }, size: { width: 40, height: 100 }, type: 'door', color: '#334155', isOpen: false },
  { position: { x: 14500, y: 520 }, size: { width: 200, height: 30 }, type: 'ground', color: '#e2e8f0' },
  { position: { x: 14750, y: 450 }, size: { width: 80, height: 20 }, type: 'ice', color: '#bae6fd' },
  { position: { x: 14850, y: 380 }, size: { width: 80, height: 20 }, type: 'ice', color: '#bae6fd' },
  { position: { x: 14940, y: 300 }, size: { width: 200, height: 100 }, type: 'ground', color: '#e2e8f0' },

  // Final Stretch (x: 15000-15500)
  { position: { x: 15100, y: 400 }, size: { width: 80, height: 60 }, type: 'mushroom', color: '#67e8f9', deformation: 0 },
  { position: { x: 15250, y: 250 }, size: { width: 300, height: 500 }, type: 'ground', color: '#e2e8f0' },

  // End Wall and Portal
  { position: { x: 15500, y: -200 }, size: { width: 100, height: 1000 }, type: 'ground', color: '#e2e8f0' },
  { position: { x: 15300, y: 100 }, size: { width: 150, height: 150 }, type: 'aurora', color: 'transparent', requiresCoop: true },
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
    // New Area Coins
    { id: 94, position: { x: 13150, y: 350 }, size: 14, collected: false, baseY: 350, type: 'gold' },
    { id: 95, position: { x: 13400, y: 250 }, size: 14, collected: false, baseY: 250, type: 'gold' },
    { id: 96, position: { x: 13650, y: 200 }, size: 14, collected: false, baseY: 200, type: 'gold' },
    { id: 97, position: { x: 14200, y: 350 }, size: 14, collected: false, baseY: 350, type: 'hot-chocolate' },
    { id: 98, position: { x: 14550, y: 450 }, size: 14, collected: false, baseY: 450, type: 'kanelbulle' },
    { id: 99, position: { x: 15000, y: 250 }, size: 14, collected: false, baseY: 250, type: 'kanelbulle' },
    { id: 100, position: { x: 15350, y: 200 }, size: 14, collected: false, baseY: 200, type: 'hot-chocolate' },
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
    // New Area Enemies
    { id: 13, position: { x: 13200, y: 350 }, size: { width: 40, height: 30 }, type: 'bird', color: '#1e293b', originalX: 13200, originalY: 350, patrolDistance: 200, speed: 2.5, direction: 1 },
    { id: 14, position: { x: 13900, y: 150 }, size: { width: 45, height: 45 }, type: 'shooter', color: '#dc2626', originalX: 13900, shootMaxCooldown: 120, direction: -1 },
    { id: 15, position: { x: 14100, y: 370 }, size: { width: 35, height: 35 }, type: 'jumper', color: '#22c55e', originalX: 14100, originalY: 370, patrolDistance: 80, jumpMaxTimer: 90, speed: 1.5, direction: 1 },
    { id: 16, position: { x: 14700, y: 470 }, size: { width: 40, height: 40 }, type: 'chaser', color: '#f97316', originalX: 14700, patrolDistance: 100, chaseRange: 200, speed: 2, direction: 1 },
    { id: 17, position: { x: 15100, y: 350 }, size: { width: 40, height: 50 }, type: 'snowman', color: '#fff', originalX: 15100, patrolDistance: 100, speed: 2, direction: 1 },
];

export const getWinterCheckpoints = (): Checkpoint[] => [
    { id: 1, position: { x: 2100, y: 540 }, size: { width: 40, height: 60 }, triggered: false },
    { id: 2, position: { x: 4300, y: 540 }, size: { width: 40, height: 60 }, triggered: false },
    { id: 3, position: { x: 5750, y: 540 }, size: { width: 40, height: 60 }, triggered: false },
    { id: 4, position: { x: 7000, y: 490 }, size: { width: 40, height: 60 }, triggered: false },
    { id: 5, position: { x: 8700, y: 140 }, size: { width: 40, height: 60 }, triggered: false },
    { id: 6, position: { x: 9900, y: 240 }, size: { width: 40, height: 60 }, triggered: false },
    { id: 7, position: { x: 12700, y: 90 }, size: { width: 40, height: 60 }, triggered: false },
    { id: 8, position: { x: 14450, y: 290 }, size: { width: 40, height: 60 }, triggered: false },
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
  // A series of slippery platforms (using slippery for slide physics) colored like water or mossy rocks
  { position: { x: 10800, y: 500 }, size: { width: 200, height: 20 }, type: 'slippery', color: '#86efac' },
  { position: { x: 11000, y: 550 }, size: { width: 200, height: 20 }, type: 'slippery', color: '#86efac' },
  { position: { x: 11200, y: 600 }, size: { width: 200, height: 20 }, type: 'slippery', color: '#86efac' },
  
  // Final Run
  { position: { x: 11500, y: 650 }, size: { width: 1200, height: 200 }, type: 'ground', color: '#86efac' },

  // NEW AREA: Flower Labyrinth (x: 12700-14500)
  { position: { x: 12700, y: 550 }, size: { width: 100, height: 20 }, type: 'moving', color: '#60a5fa', moveDirection: 'vertical', moveDistance: 100 },
  { position: { x: 12900, y: 450 }, size: { width: 150, height: 20 }, type: 'leaf', color: '#22c55e' },
  { position: { x: 13100, y: 350 }, size: { width: 100, height: 20 }, type: 'moving', color: '#60a5fa', moveDirection: 'horizontal', moveDistance: 80 },
  { position: { x: 13300, y: 280 }, size: { width: 150, height: 20 }, type: 'leaf', color: '#22c55e' },
  { position: { x: 13500, y: 380 }, size: { width: 100, height: 80 }, type: 'mushroom', color: '#fca5a5', deformation: 0 },

  // Conveyor Challenge
  { position: { x: 13700, y: 500 }, size: { width: 200, height: 20 }, type: 'conveyor', color: '#475569', conveyorSpeed: 4 },
  { position: { x: 13900, y: 500 }, size: { width: 200, height: 20 }, type: 'conveyor', color: '#475569', conveyorSpeed: -4 },
  { position: { x: 14100, y: 450 }, size: { width: 150, height: 20 }, type: 'leaf', color: '#22c55e' },

  // Two-Button Puzzle
  { id: 301, position: { x: 14300, y: 500 }, size: { width: 50, height: 15 }, type: 'timed_button', color: '#fbbf24', isPressed: false, buttonMaxTimer: 240, linkedPlatformIds: [303] },
  { id: 302, position: { x: 14600, y: 350 }, size: { width: 50, height: 15 }, type: 'timed_button', color: '#fbbf24', isPressed: false, buttonMaxTimer: 240, linkedPlatformIds: [303] },
  { id: 303, position: { x: 14900, y: 200 }, size: { width: 120, height: 20 }, type: 'toggle_platform', color: '#a855f7', isVisible: false },
  { position: { x: 14250, y: 520 }, size: { width: 150, height: 30 }, type: 'ground', color: '#86efac' },
  { position: { x: 14550, y: 370 }, size: { width: 150, height: 30 }, type: 'ground', color: '#86efac' },
  { position: { x: 14850, y: 250 }, size: { width: 100, height: 20 }, type: 'leaf', color: '#22c55e' },

  // Spike Gauntlet
  { position: { x: 15050, y: 300 }, size: { width: 60, height: 20 }, type: 'spike', color: '#ef4444', spikeMaxTimer: 60, spikeActive: false },
  { position: { x: 15120, y: 300 }, size: { width: 60, height: 20 }, type: 'spike', color: '#ef4444', spikeMaxTimer: 60, spikeActive: true },
  { position: { x: 15000, y: 320 }, size: { width: 250, height: 30 }, type: 'ground', color: '#86efac' },
  { position: { x: 15300, y: 400 }, size: { width: 100, height: 80 }, type: 'mushroom', color: '#fca5a5', deformation: 0 },

  // Final Platform and Portal
  { position: { x: 15500, y: 600 }, size: { width: 1400, height: 200 }, type: 'ground', color: '#86efac' },
  { position: { x: 16800, y: -200 }, size: { width: 100, height: 1000 }, type: 'ground', color: '#86efac' },
  { position: { x: 16400, y: 450 }, size: { width: 150, height: 150 }, type: 'aurora', color: 'transparent', requiresCoop: true },
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
    { id: 214, position: { x: 11100, y: 450 }, size: 14, collected: false, baseY: 450, type: 'gold' },
    { id: 215, position: { x: 11300, y: 500 }, size: 14, collected: false, baseY: 500, type: 'gold' },
    { id: 216, position: { x: 12500, y: 550 }, size: 14, collected: false, baseY: 550, type: 'kanelbulle' },
    // New Area Coins
    { id: 217, position: { x: 12750, y: 500 }, size: 14, collected: false, baseY: 500, type: 'gold' },
    { id: 218, position: { x: 13150, y: 300 }, size: 14, collected: false, baseY: 300, type: 'gold' },
    { id: 219, position: { x: 13350, y: 230 }, size: 14, collected: false, baseY: 230, type: 'hot-chocolate' },
    { id: 220, position: { x: 13800, y: 450 }, size: 14, collected: false, baseY: 450, type: 'gold' },
    { id: 221, position: { x: 14000, y: 450 }, size: 14, collected: false, baseY: 450, type: 'gold' },
    { id: 222, position: { x: 14950, y: 150 }, size: 14, collected: false, baseY: 150, type: 'hot-chocolate' },
    { id: 223, position: { x: 15350, y: 300 }, size: 14, collected: false, baseY: 300, type: 'kanelbulle' },
    { id: 224, position: { x: 16000, y: 550 }, size: 14, collected: false, baseY: 550, type: 'kanelbulle' },
    { id: 225, position: { x: 16300, y: 550 }, size: 14, collected: false, baseY: 550, type: 'hot-chocolate' },
];

export const getButterflyEnemies = (): Enemy[] => [
    { id: 201, position: { x: 1900, y: 570 }, size: { width: 40, height: 30 }, type: 'slime', color: '#16a34a', originalX: 1900, patrolDistance: 200, speed: 2, direction: 1 },
    { id: 202, position: { x: 3400, y: 370 }, size: { width: 40, height: 30 }, type: 'bird', color: '#ef4444', originalX: 3400, originalY: 370, patrolDistance: 150, speed: 3, direction: 1 },
    { id: 203, position: { x: 4700, y: 570 }, size: { width: 60, height: 50 }, type: 'slime', color: '#16a34a', originalX: 4700, patrolDistance: 300, speed: 1.5, direction: -1 },
    { id: 204, position: { x: 8800, y: 130 }, size: { width: 40, height: 30 }, type: 'bird', color: '#ef4444', originalX: 8800, originalY: 130, patrolDistance: 200, speed: 3.5, direction: 1 },
    { id: 205, position: { x: 9900, y: 570 }, size: { width: 60, height: 50 }, type: 'slime', color: '#16a34a', originalX: 9900, patrolDistance: 400, speed: 2, direction: 1 },
    { id: 206, position: { x: 12000, y: 620 }, size: { width: 60, height: 50 }, type: 'slime', color: '#16a34a', originalX: 12000, patrolDistance: 500, speed: 1, direction: 1 },
    // New Area Enemies
    { id: 207, position: { x: 12950, y: 400 }, size: { width: 40, height: 40 }, type: 'chaser', color: '#f97316', originalX: 12950, patrolDistance: 150, chaseRange: 200, speed: 2.5, direction: 1 },
    { id: 208, position: { x: 13600, y: 300 }, size: { width: 40, height: 30 }, type: 'bird', color: '#ef4444', originalX: 13600, originalY: 300, patrolDistance: 150, speed: 3, direction: -1 },
    { id: 209, position: { x: 14150, y: 400 }, size: { width: 35, height: 35 }, type: 'jumper', color: '#22c55e', originalX: 14150, originalY: 400, patrolDistance: 100, jumpMaxTimer: 75, speed: 1.5, direction: 1 },
    { id: 210, position: { x: 15100, y: 270 }, size: { width: 45, height: 45 }, type: 'shooter', color: '#dc2626', originalX: 15100, shootMaxCooldown: 100, direction: -1 },
    { id: 211, position: { x: 15800, y: 570 }, size: { width: 60, height: 50 }, type: 'slime', color: '#16a34a', originalX: 15800, patrolDistance: 300, speed: 2, direction: 1 },
];

export const getButterflyCheckpoints = (): Checkpoint[] => [
    { id: 201, position: { x: 1800, y: 540 }, size: { width: 40, height: 60 }, triggered: false },
    { id: 202, position: { x: 4400, y: 540 }, size: { width: 40, height: 60 }, triggered: false },
    { id: 203, position: { x: 7600, y: 490 }, size: { width: 40, height: 60 }, triggered: false },
    { id: 204, position: { x: 9900, y: 540 }, size: { width: 40, height: 60 }, triggered: false },
    { id: 205, position: { x: 11600, y: 590 }, size: { width: 40, height: 60 }, triggered: false },
    { id: 206, position: { x: 14300, y: 460 }, size: { width: 40, height: 60 }, triggered: false },
    { id: 207, position: { x: 15700, y: 540 }, size: { width: 40, height: 60 }, triggered: false },
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
    { position: { x: 4900, y: 650 }, size: { width: 600, height: 150 }, type: 'ground', color: '#fbcfe8' },

    // NEW AREA: Rainbow Bridge (x: 5500-6500)
    { position: { x: 5500, y: 550 }, size: { width: 100, height: 20 }, type: 'moving', color: '#ef4444', moveDirection: 'vertical', moveDistance: 80 },
    { position: { x: 5700, y: 450 }, size: { width: 100, height: 20 }, type: 'moving', color: '#f97316', moveDirection: 'horizontal', moveDistance: 60 },
    { position: { x: 5900, y: 350 }, size: { width: 100, height: 20 }, type: 'moving', color: '#fbbf24', moveDirection: 'vertical', moveDistance: 80 },
    { position: { x: 6100, y: 280 }, size: { width: 100, height: 20 }, type: 'moving', color: '#22c55e', moveDirection: 'horizontal', moveDistance: 60 },
    { position: { x: 6300, y: 350 }, size: { width: 100, height: 20 }, type: 'moving', color: '#60a5fa', moveDirection: 'vertical', moveDistance: 80 },

    // Bounce Finale
    { position: { x: 6500, y: 500 }, size: { width: 150, height: 60 }, type: 'mushroom', color: '#fca5a5', deformation: 0 },
    { position: { x: 6750, y: 400 }, size: { width: 150, height: 60 }, type: 'mushroom', color: '#fca5a5', deformation: 0 },

    // Final Ground and Portal
    { position: { x: 6950, y: 600 }, size: { width: 600, height: 200 }, type: 'ground', color: '#fbcfe8' },
    { position: { x: 7400, y: -200 }, size: { width: 100, height: 1000 }, type: 'ground', color: '#fbcfe8' },
    { position: { x: 7100, y: 450 }, size: { width: 150, height: 150 }, type: 'aurora', color: 'transparent', requiresCoop: true },
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
    // Rainbow Bridge Coins
    { id: 386, position: { x: 5550, y: 500 }, size: 16, collected: false, baseY: 500, type: 'apple' },
    { id: 387, position: { x: 5750, y: 400 }, size: 16, collected: false, baseY: 400, type: 'banana' },
    { id: 388, position: { x: 5950, y: 300 }, size: 16, collected: false, baseY: 300, type: 'cherry' },
    { id: 389, position: { x: 6150, y: 230 }, size: 16, collected: false, baseY: 230, type: 'apple' },
    { id: 390, position: { x: 6350, y: 300 }, size: 16, collected: false, baseY: 300, type: 'banana' },
    { id: 391, position: { x: 6550, y: 400 }, size: 16, collected: false, baseY: 400, type: 'cherry' },
    { id: 392, position: { x: 6600, y: 300 }, size: 16, collected: false, baseY: 300, type: 'apple' },
    { id: 393, position: { x: 6800, y: 300 }, size: 16, collected: false, baseY: 300, type: 'banana' },
    { id: 394, position: { x: 7000, y: 550 }, size: 20, collected: false, baseY: 550, type: 'kanelbulle' },
    { id: 395, position: { x: 7150, y: 550 }, size: 20, collected: false, baseY: 550, type: 'kanelbulle' },
    { id: 396, position: { x: 7300, y: 550 }, size: 20, collected: false, baseY: 550, type: 'hot-chocolate' },
];

export const getFruitParadiseEnemies = (): Enemy[] => []; // No enemies!

export const getFruitParadiseCheckpoints = (): Checkpoint[] => [
    { id: 301, position: { x: 1800, y: 540 }, size: { width: 40, height: 60 }, triggered: false },
    { id: 302, position: { x: 2600, y: 590 }, size: { width: 40, height: 60 }, triggered: false },
    { id: 303, position: { x: 4150, y: 340 }, size: { width: 40, height: 60 }, triggered: false },
    { id: 304, position: { x: 5000, y: 590 }, size: { width: 40, height: 60 }, triggered: false },
    { id: 305, position: { x: 7000, y: 540 }, size: { width: 40, height: 60 }, triggered: false },
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

    // Moving platforms for dodging
    { position: { x: 2100, y: 450 }, size: { width: 100, height: 20 }, type: 'moving', color: '#60a5fa', moveDirection: 'vertical', moveDistance: 120 },
    { position: { x: 3700, y: 420 }, size: { width: 100, height: 20 }, type: 'moving', color: '#60a5fa', moveDirection: 'vertical', moveDistance: 100 },

    // Spike traps in arena (timed hazards)
    { position: { x: 2000, y: 620 }, size: { width: 80, height: 30 }, type: 'spike', color: '#ef4444', spikeMaxTimer: 120, spikeActive: false },
    { position: { x: 3600, y: 620 }, size: { width: 80, height: 30 }, type: 'spike', color: '#ef4444', spikeMaxTimer: 120, spikeActive: true },

    // End platform with victory portal
    { position: { x: 5000, y: 600 }, size: { width: 2000, height: 200 }, type: 'ground', color: '#475569' },
    { position: { x: 5700, y: 450 }, size: { width: 150, height: 150 }, type: 'aurora', color: 'transparent', requiresCoop: true },

    // Arena walls
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
    { id: 401, position: { x: 950, y: 490 }, size: { width: 40, height: 60 }, triggered: false },
    { id: 402, position: { x: 4500, y: 590 }, size: { width: 40, height: 60 }, triggered: false },
];

export const getBossLevelPowerUps = (): import('./types').PowerUp[] => [
    { id: 1, position: { x: 1240, y: 470 }, size: { width: 30, height: 30 }, type: 'shield', collected: false, baseY: 470, duration: 360 },
    { id: 2, position: { x: 4660, y: 470 }, size: { width: 30, height: 30 }, type: 'shield', collected: false, baseY: 470, duration: 360 },
    { id: 3, position: { x: 2475, y: 370 }, size: { width: 30, height: 30 }, type: 'double_jump', collected: false, baseY: 370, duration: 420 },
    { id: 4, position: { x: 2525, y: 220 }, size: { width: 30, height: 30 }, type: 'star', collected: false, baseY: 220, duration: 240 },
    { id: 5, position: { x: 3400, y: 320 }, size: { width: 30, height: 30 }, type: 'speed', collected: false, baseY: 320, duration: 300 },
    { id: 6, position: { x: 3700, y: 400 }, size: { width: 30, height: 30 }, type: 'ice_throw', collected: false, baseY: 400, duration: 600 },
    { id: 7, position: { x: 4200, y: 320 }, size: { width: 30, height: 30 }, type: 'giant', collected: false, baseY: 320, duration: 480 },
];

export const getWinterPowerUps = (): import('./types').PowerUp[] => [
    { id: 101, position: { x: 2300, y: 440 }, size: { width: 30, height: 30 }, type: 'ice_throw', collected: false, baseY: 440, duration: 600 },
    { id: 102, position: { x: 4500, y: 540 }, size: { width: 30, height: 30 }, type: 'shield', collected: false, baseY: 540, duration: 360 },
    { id: 103, position: { x: 6500, y: 440 }, size: { width: 30, height: 30 }, type: 'giant', collected: false, baseY: 440, duration: 480 },
    { id: 104, position: { x: 8300, y: 140 }, size: { width: 30, height: 30 }, type: 'ice_throw', collected: false, baseY: 140, duration: 600 },
    { id: 105, position: { x: 10500, y: 140 }, size: { width: 30, height: 30 }, type: 'star', collected: false, baseY: 140, duration: 300 },
    { id: 106, position: { x: 12000, y: 90 }, size: { width: 30, height: 30 }, type: 'shield', collected: false, baseY: 90, duration: 360 },
    { id: 107, position: { x: 14000, y: 290 }, size: { width: 30, height: 30 }, type: 'giant', collected: false, baseY: 290, duration: 480 },
];

export const getButterflyPowerUps = (): import('./types').PowerUp[] => [
    { id: 201, position: { x: 2200, y: 440 }, size: { width: 30, height: 30 }, type: 'ice_throw', collected: false, baseY: 440, duration: 600 },
    { id: 202, position: { x: 4000, y: 340 }, size: { width: 30, height: 30 }, type: 'double_jump', collected: false, baseY: 340, duration: 420 },
    { id: 203, position: { x: 6500, y: 390 }, size: { width: 30, height: 30 }, type: 'giant', collected: false, baseY: 390, duration: 480 },
    { id: 204, position: { x: 9000, y: 440 }, size: { width: 30, height: 30 }, type: 'shield', collected: false, baseY: 440, duration: 360 },
    { id: 205, position: { x: 11500, y: 490 }, size: { width: 30, height: 30 }, type: 'ice_throw', collected: false, baseY: 490, duration: 600 },
    { id: 206, position: { x: 13500, y: 340 }, size: { width: 30, height: 30 }, type: 'star', collected: false, baseY: 340, duration: 300 },
    { id: 207, position: { x: 15000, y: 440 }, size: { width: 30, height: 30 }, type: 'giant', collected: false, baseY: 440, duration: 480 },
];

export const getFruitParadisePowerUps = (): import('./types').PowerUp[] => [
    { id: 301, position: { x: 2000, y: 540 }, size: { width: 30, height: 30 }, type: 'giant', collected: false, baseY: 540, duration: 600 },
    { id: 302, position: { x: 3500, y: 390 }, size: { width: 30, height: 30 }, type: 'speed', collected: false, baseY: 390, duration: 420 },
    { id: 303, position: { x: 5500, y: 490 }, size: { width: 30, height: 30 }, type: 'double_jump', collected: false, baseY: 490, duration: 480 },
    { id: 304, position: { x: 7200, y: 540 }, size: { width: 30, height: 30 }, type: 'giant', collected: false, baseY: 540, duration: 600 },
];

export const getDarkCavesPlatforms = (): Platform[] => [
    { position: { x: -200, y: 600 }, size: { width: 1000, height: 200 }, type: 'ground', color: '#374151' },
    { position: { x: 900, y: 550 }, size: { width: 200, height: 20 }, type: 'ground', color: '#4b5563' },
    { position: { x: 1200, y: 480 }, size: { width: 150, height: 20 }, type: 'crumbly', color: '#6b7280', fallTimer: 45, maxFallTimer: 45, respawnTimer: 0 },
    { position: { x: 1500, y: 400 }, size: { width: 180, height: 20 }, type: 'ground', color: '#4b5563' },
    { position: { x: 1800, y: 320 }, size: { width: 120, height: 20 }, type: 'moving', color: '#60a5fa', moveDirection: 'vertical', moveDistance: 100 },
    { position: { x: 2100, y: 250 }, size: { width: 200, height: 20 }, type: 'ground', color: '#374151' },
    { position: { x: 2400, y: 350 }, size: { width: 150, height: 80 }, type: 'mushroom', color: '#9333ea', deformation: 0 },
    { position: { x: 2700, y: 600 }, size: { width: 800, height: 200 }, type: 'ground', color: '#374151' },
    { position: { x: 3600, y: 550 }, size: { width: 100, height: 20 }, type: 'moving', color: '#60a5fa', moveDirection: 'horizontal', moveDistance: 150 },
    { position: { x: 3900, y: 450 }, size: { width: 200, height: 20 }, type: 'ground', color: '#4b5563' },
    { position: { x: 4200, y: 350 }, size: { width: 100, height: 20 }, type: 'crumbly', color: '#6b7280', fallTimer: 40, maxFallTimer: 40, respawnTimer: 0 },
    { position: { x: 4400, y: 280 }, size: { width: 150, height: 20 }, type: 'ground', color: '#374151' },
    { position: { x: 4700, y: 600 }, size: { width: 1200, height: 200 }, type: 'ground', color: '#374151' },
    { position: { x: 6000, y: 500 }, size: { width: 80, height: 20 }, type: 'spike', color: '#ef4444', spikeMaxTimer: 75, spikeActive: false },
    { position: { x: 6100, y: 500 }, size: { width: 80, height: 20 }, type: 'spike', color: '#ef4444', spikeMaxTimer: 75, spikeActive: true },
    { position: { x: 6200, y: 500 }, size: { width: 80, height: 20 }, type: 'spike', color: '#ef4444', spikeMaxTimer: 75, spikeActive: false },
    { position: { x: 5950, y: 520 }, size: { width: 400, height: 30 }, type: 'ground', color: '#374151' },
    { position: { x: 6400, y: 450 }, size: { width: 120, height: 20 }, type: 'moving', color: '#60a5fa', moveDirection: 'vertical', moveDistance: 120 },
    { position: { x: 6700, y: 350 }, size: { width: 200, height: 20 }, type: 'ground', color: '#4b5563' },
    { position: { x: 7000, y: 600 }, size: { width: 600, height: 200 }, type: 'ground', color: '#374151' },
    { position: { x: 7700, y: 500 }, size: { width: 150, height: 80 }, type: 'mushroom', color: '#9333ea', deformation: 0 },
    { position: { x: 8000, y: 350 }, size: { width: 200, height: 20 }, type: 'ground', color: '#374151' },
    { position: { x: 8300, y: 250 }, size: { width: 150, height: 20 }, type: 'crumbly', color: '#6b7280', fallTimer: 50, maxFallTimer: 50, respawnTimer: 0 },
    { position: { x: 8600, y: 350 }, size: { width: 100, height: 20 }, type: 'moving', color: '#60a5fa', moveDirection: 'horizontal', moveDistance: 100 },
    { position: { x: 8900, y: 450 }, size: { width: 200, height: 20 }, type: 'ground', color: '#4b5563' },
    { position: { x: 9200, y: 600 }, size: { width: 1000, height: 200 }, type: 'ground', color: '#374151' },
    { id: 501, position: { x: 10300, y: 400 }, size: { width: 60, height: 15 }, type: 'timed_button', color: '#fbbf24', isPressed: false, buttonMaxTimer: 200, linkId: 502 },
    { id: 502, position: { x: 10600, y: 250 }, size: { width: 40, height: 150 }, type: 'door', color: '#334155', isOpen: false },
    { position: { x: 10250, y: 420 }, size: { width: 150, height: 30 }, type: 'ground', color: '#374151' },
    { position: { x: 10500, y: 350 }, size: { width: 100, height: 20 }, type: 'ground', color: '#4b5563' },
    { position: { x: 10640, y: 250 }, size: { width: 300, height: 20 }, type: 'ground', color: '#374151' },
    { position: { x: 11000, y: 600 }, size: { width: 800, height: 200 }, type: 'ground', color: '#374151' },
    { position: { x: 11900, y: 500 }, size: { width: 100, height: 20 }, type: 'moving', color: '#60a5fa', moveDirection: 'vertical', moveDistance: 150 },
    { position: { x: 12200, y: 400 }, size: { width: 200, height: 20 }, type: 'ground', color: '#4b5563' },
    { position: { x: 12500, y: 300 }, size: { width: 150, height: 80 }, type: 'mushroom', color: '#9333ea', deformation: 0 },
    { position: { x: 12800, y: 200 }, size: { width: 200, height: 20 }, type: 'ground', color: '#374151' },
    { position: { x: 13100, y: 600 }, size: { width: 1500, height: 200 }, type: 'ground', color: '#374151' },
    { position: { x: 14700, y: 500 }, size: { width: 200, height: 20 }, type: 'ground', color: '#4b5563' },
    { position: { x: 15000, y: 400 }, size: { width: 150, height: 20 }, type: 'crumbly', color: '#6b7280', fallTimer: 45, maxFallTimer: 45, respawnTimer: 0 },
    { position: { x: 15300, y: 300 }, size: { width: 200, height: 20 }, type: 'ground', color: '#374151' },
    { position: { x: 15600, y: 600 }, size: { width: 1000, height: 200 }, type: 'ground', color: '#374151' },
    { position: { x: 16700, y: 500 }, size: { width: 150, height: 20 }, type: 'moving', color: '#60a5fa', moveDirection: 'horizontal', moveDistance: 100 },
    { position: { x: 17000, y: 600 }, size: { width: 1000, height: 200 }, type: 'ground', color: '#374151' },
    { position: { x: 17900, y: -200 }, size: { width: 100, height: 1000 }, type: 'ground', color: '#374151' },
    { position: { x: 17500, y: 450 }, size: { width: 150, height: 150 }, type: 'aurora', color: 'transparent', requiresCoop: true },
];

export const getDarkCavesCoins = (): Coin[] => [
    { id: 501, position: { x: 950, y: 500 }, size: 14, collected: false, baseY: 500, type: 'gold' },
    { id: 502, position: { x: 1250, y: 430 }, size: 14, collected: false, baseY: 430, type: 'gold' },
    { id: 503, position: { x: 1550, y: 350 }, size: 14, collected: false, baseY: 350, type: 'hot-chocolate' },
    { id: 504, position: { x: 2150, y: 200 }, size: 14, collected: false, baseY: 200, type: 'gold' },
    { id: 505, position: { x: 2450, y: 280 }, size: 14, collected: false, baseY: 280, type: 'gold' },
    { id: 506, position: { x: 2900, y: 550 }, size: 14, collected: false, baseY: 550, type: 'kanelbulle' },
    { id: 507, position: { x: 3100, y: 550 }, size: 14, collected: false, baseY: 550, type: 'kanelbulle' },
    { id: 508, position: { x: 3650, y: 500 }, size: 14, collected: false, baseY: 500, type: 'gold' },
    { id: 509, position: { x: 3950, y: 400 }, size: 14, collected: false, baseY: 400, type: 'gold' },
    { id: 510, position: { x: 4450, y: 230 }, size: 14, collected: false, baseY: 230, type: 'hot-chocolate' },
    { id: 511, position: { x: 5000, y: 550 }, size: 14, collected: false, baseY: 550, type: 'gold' },
    { id: 512, position: { x: 5300, y: 550 }, size: 14, collected: false, baseY: 550, type: 'gold' },
    { id: 513, position: { x: 5600, y: 550 }, size: 14, collected: false, baseY: 550, type: 'kanelbulle' },
    { id: 514, position: { x: 6750, y: 300 }, size: 14, collected: false, baseY: 300, type: 'gold' },
    { id: 515, position: { x: 7200, y: 550 }, size: 14, collected: false, baseY: 550, type: 'gold' },
    { id: 516, position: { x: 7750, y: 400 }, size: 14, collected: false, baseY: 400, type: 'gold' },
    { id: 517, position: { x: 8050, y: 300 }, size: 14, collected: false, baseY: 300, type: 'hot-chocolate' },
    { id: 518, position: { x: 8350, y: 200 }, size: 14, collected: false, baseY: 200, type: 'gold' },
    { id: 519, position: { x: 8950, y: 400 }, size: 14, collected: false, baseY: 400, type: 'gold' },
    { id: 520, position: { x: 9500, y: 550 }, size: 14, collected: false, baseY: 550, type: 'kanelbulle' },
    { id: 521, position: { x: 9800, y: 550 }, size: 14, collected: false, baseY: 550, type: 'gold' },
    { id: 522, position: { x: 10550, y: 300 }, size: 14, collected: false, baseY: 300, type: 'gold' },
    { id: 523, position: { x: 10850, y: 200 }, size: 14, collected: false, baseY: 200, type: 'hot-chocolate' },
    { id: 524, position: { x: 12250, y: 350 }, size: 14, collected: false, baseY: 350, type: 'gold' },
    { id: 525, position: { x: 12550, y: 220 }, size: 14, collected: false, baseY: 220, type: 'gold' },
    { id: 526, position: { x: 12850, y: 150 }, size: 14, collected: false, baseY: 150, type: 'gold' },
    { id: 527, position: { x: 13500, y: 550 }, size: 14, collected: false, baseY: 550, type: 'kanelbulle' },
    { id: 528, position: { x: 14000, y: 550 }, size: 14, collected: false, baseY: 550, type: 'gold' },
    { id: 529, position: { x: 15050, y: 350 }, size: 14, collected: false, baseY: 350, type: 'gold' },
    { id: 530, position: { x: 15350, y: 250 }, size: 14, collected: false, baseY: 250, type: 'hot-chocolate' },
    { id: 531, position: { x: 16000, y: 550 }, size: 14, collected: false, baseY: 550, type: 'gold' },
    { id: 532, position: { x: 17200, y: 550 }, size: 14, collected: false, baseY: 550, type: 'kanelbulle' },
    { id: 533, position: { x: 17600, y: 550 }, size: 14, collected: false, baseY: 550, type: 'hot-chocolate' },
];

export const getDarkCavesEnemies = (): Enemy[] => [
    { id: 501, position: { x: 1100, y: 500 }, size: { width: 50, height: 40 }, type: 'bat', color: '#1f2937', originalX: 1100, originalY: 500, patrolDistance: 200, speed: 3, direction: 1 },
    { id: 502, position: { x: 2000, y: 200 }, size: { width: 50, height: 40 }, type: 'bat', color: '#1f2937', originalX: 2000, originalY: 200, patrolDistance: 150, speed: 2.5, direction: -1 },
    { id: 503, position: { x: 3000, y: 550 }, size: { width: 60, height: 50 }, type: 'spider', color: '#111827', originalX: 3000, patrolDistance: 250, speed: 2, direction: 1 },
    { id: 504, position: { x: 4100, y: 300 }, size: { width: 50, height: 40 }, type: 'bat', color: '#1f2937', originalX: 4100, originalY: 300, patrolDistance: 180, speed: 3, direction: 1 },
    { id: 505, position: { x: 5200, y: 550 }, size: { width: 60, height: 50 }, type: 'spider', color: '#111827', originalX: 5200, patrolDistance: 300, speed: 1.5, direction: -1 },
    { id: 506, position: { x: 6800, y: 300 }, size: { width: 50, height: 40 }, type: 'bat', color: '#1f2937', originalX: 6800, originalY: 300, patrolDistance: 200, speed: 2.5, direction: 1 },
    { id: 507, position: { x: 7400, y: 550 }, size: { width: 45, height: 45 }, type: 'ghost', color: '#9ca3af', originalX: 7400, patrolDistance: 200, speed: 1.5, direction: 1, isVisible: true, fadeTimer: 0 },
    { id: 508, position: { x: 9500, y: 550 }, size: { width: 60, height: 50 }, type: 'spider', color: '#111827', originalX: 9500, patrolDistance: 350, speed: 2, direction: 1 },
    { id: 509, position: { x: 11500, y: 550 }, size: { width: 80, height: 80 }, type: 'golem', color: '#6b7280', originalX: 11500, patrolDistance: 200, speed: 1, direction: 1, health: 3, maxHealth: 3 },
    { id: 510, position: { x: 12300, y: 350 }, size: { width: 50, height: 40 }, type: 'bat', color: '#1f2937', originalX: 12300, originalY: 350, patrolDistance: 150, speed: 3, direction: -1 },
    { id: 511, position: { x: 13800, y: 550 }, size: { width: 45, height: 45 }, type: 'ghost', color: '#9ca3af', originalX: 13800, patrolDistance: 250, speed: 1.8, direction: 1, isVisible: true, fadeTimer: 0 },
    { id: 512, position: { x: 15800, y: 550 }, size: { width: 60, height: 50 }, type: 'spider', color: '#111827', originalX: 15800, patrolDistance: 200, speed: 2, direction: -1 },
    { id: 513, position: { x: 16300, y: 550 }, size: { width: 80, height: 80 }, type: 'golem', color: '#6b7280', originalX: 16300, patrolDistance: 150, speed: 1.2, direction: 1, health: 3, maxHealth: 3 },
    { id: 599, position: { x: 14000, y: 400 }, size: { width: 100, height: 120 }, type: 'mini_boss', color: '#4c1d95', health: 5, maxHealth: 5, originalX: 14000, patrolDistance: 300, speed: 2, direction: 1, miniBossType: 'cave_monster' },
];

export const getDarkCavesCheckpoints = (): Checkpoint[] => [
    { id: 501, position: { x: 2800, y: 540 }, size: { width: 40, height: 60 }, triggered: false },
    { id: 502, position: { x: 4800, y: 540 }, size: { width: 40, height: 60 }, triggered: false },
    { id: 503, position: { x: 7100, y: 540 }, size: { width: 40, height: 60 }, triggered: false },
    { id: 504, position: { x: 9300, y: 540 }, size: { width: 40, height: 60 }, triggered: false },
    { id: 505, position: { x: 11100, y: 540 }, size: { width: 40, height: 60 }, triggered: false },
    { id: 506, position: { x: 13200, y: 540 }, size: { width: 40, height: 60 }, triggered: false },
    { id: 507, position: { x: 15700, y: 540 }, size: { width: 40, height: 60 }, triggered: false },
    { id: 508, position: { x: 17100, y: 540 }, size: { width: 40, height: 60 }, triggered: false },
];

export const getDarkCavesPowerUps = (): import('./types').PowerUp[] => [
    { id: 501, position: { x: 1600, y: 350 }, size: { width: 30, height: 30 }, type: 'ghost', collected: false, baseY: 350, duration: 480 },
    { id: 502, position: { x: 3200, y: 540 }, size: { width: 30, height: 30 }, type: 'shield', collected: false, baseY: 540, duration: 360 },
    { id: 503, position: { x: 5500, y: 540 }, size: { width: 30, height: 30 }, type: 'giant', collected: false, baseY: 540, duration: 480 },
    { id: 504, position: { x: 8200, y: 300 }, size: { width: 30, height: 30 }, type: 'double_jump', collected: false, baseY: 300, duration: 420 },
    { id: 505, position: { x: 10100, y: 540 }, size: { width: 30, height: 30 }, type: 'ice_throw', collected: false, baseY: 540, duration: 600 },
    { id: 506, position: { x: 12900, y: 150 }, size: { width: 30, height: 30 }, type: 'star', collected: false, baseY: 150, duration: 300 },
    { id: 507, position: { x: 14500, y: 540 }, size: { width: 30, height: 30 }, type: 'bomb', collected: false, baseY: 540, duration: 1 },
    { id: 508, position: { x: 16500, y: 540 }, size: { width: 30, height: 30 }, type: 'speed', collected: false, baseY: 540, duration: 420 },
];

export const getSkyIslandsPlatforms = (): Platform[] => [
    { position: { x: -200, y: 600 }, size: { width: 800, height: 200 }, type: 'ground', color: '#93c5fd' },
    { position: { x: 700, y: 500 }, size: { width: 150, height: 40 }, type: 'cloud', color: '#fff' },
    { position: { x: 950, y: 400 }, size: { width: 150, height: 40 }, type: 'cloud', color: '#fff' },
    { position: { x: 1200, y: 300 }, size: { width: 150, height: 40 }, type: 'cloud', color: '#fff' },
    { position: { x: 1500, y: 200 }, size: { width: 200, height: 20 }, type: 'ground', color: '#93c5fd' },
    { position: { x: 1800, y: 300 }, size: { width: 120, height: 20 }, type: 'moving', color: '#60a5fa', moveDirection: 'vertical', moveDistance: 150 },
    { position: { x: 2100, y: 150 }, size: { width: 250, height: 20 }, type: 'ground', color: '#93c5fd' },
    { position: { x: 2450, y: 250 }, size: { width: 150, height: 40 }, type: 'cloud', color: '#fff' },
    { position: { x: 2700, y: 350 }, size: { width: 150, height: 80 }, type: 'mushroom', color: '#f9a8d4', deformation: 0 },
    { position: { x: 3000, y: 200 }, size: { width: 300, height: 20 }, type: 'ground', color: '#93c5fd' },
    { position: { x: 3400, y: 300 }, size: { width: 100, height: 20 }, type: 'moving', color: '#60a5fa', moveDirection: 'horizontal', moveDistance: 200 },
    { position: { x: 3800, y: 200 }, size: { width: 200, height: 20 }, type: 'ground', color: '#93c5fd' },
    { position: { x: 4100, y: 100 }, size: { width: 150, height: 40 }, type: 'cloud', color: '#fff' },
    { position: { x: 4400, y: 200 }, size: { width: 100, height: 20 }, type: 'crumbly', color: '#bfdbfe', fallTimer: 40, maxFallTimer: 40, respawnTimer: 0 },
    { position: { x: 4700, y: 300 }, size: { width: 200, height: 20 }, type: 'ground', color: '#93c5fd' },
    { position: { x: 5000, y: 400 }, size: { width: 150, height: 80 }, type: 'mushroom', color: '#f9a8d4', deformation: 0 },
    { position: { x: 5300, y: 250 }, size: { width: 250, height: 20 }, type: 'ground', color: '#93c5fd' },
    { position: { x: 5650, y: 350 }, size: { width: 150, height: 40 }, type: 'cloud', color: '#fff' },
    { position: { x: 5900, y: 450 }, size: { width: 150, height: 40 }, type: 'cloud', color: '#fff' },
    { position: { x: 6200, y: 600 }, size: { width: 800, height: 200 }, type: 'ground', color: '#93c5fd' },
    { position: { x: 7100, y: 500 }, size: { width: 100, height: 20 }, type: 'moving', color: '#60a5fa', moveDirection: 'vertical', moveDistance: 200 },
    { position: { x: 7400, y: 300 }, size: { width: 200, height: 20 }, type: 'ground', color: '#93c5fd' },
    { position: { x: 7700, y: 200 }, size: { width: 150, height: 40 }, type: 'cloud', color: '#fff' },
    { position: { x: 8000, y: 100 }, size: { width: 200, height: 20 }, type: 'ground', color: '#93c5fd' },
    { position: { x: 8300, y: 200 }, size: { width: 100, height: 20 }, type: 'moving', color: '#60a5fa', moveDirection: 'horizontal', moveDistance: 150 },
    { position: { x: 8700, y: 300 }, size: { width: 250, height: 20 }, type: 'ground', color: '#93c5fd' },
    { position: { x: 9050, y: 400 }, size: { width: 150, height: 40 }, type: 'cloud', color: '#fff' },
    { position: { x: 9300, y: 500 }, size: { width: 150, height: 80 }, type: 'mushroom', color: '#f9a8d4', deformation: 0 },
    { position: { x: 9600, y: 350 }, size: { width: 200, height: 20 }, type: 'ground', color: '#93c5fd' },
    { position: { x: 9900, y: 250 }, size: { width: 100, height: 20 }, type: 'crumbly', color: '#bfdbfe', fallTimer: 35, maxFallTimer: 35, respawnTimer: 0 },
    { position: { x: 10200, y: 150 }, size: { width: 200, height: 20 }, type: 'ground', color: '#93c5fd' },
    { position: { x: 10500, y: 250 }, size: { width: 150, height: 40 }, type: 'cloud', color: '#fff' },
    { position: { x: 10800, y: 350 }, size: { width: 150, height: 40 }, type: 'cloud', color: '#fff' },
    { position: { x: 11100, y: 450 }, size: { width: 200, height: 20 }, type: 'ground', color: '#93c5fd' },
    { position: { x: 11400, y: 550 }, size: { width: 150, height: 80 }, type: 'mushroom', color: '#f9a8d4', deformation: 0 },
    { position: { x: 11700, y: 400 }, size: { width: 250, height: 20 }, type: 'ground', color: '#93c5fd' },
    { position: { x: 12050, y: 300 }, size: { width: 100, height: 20 }, type: 'moving', color: '#60a5fa', moveDirection: 'vertical', moveDistance: 100 },
    { position: { x: 12350, y: 200 }, size: { width: 200, height: 20 }, type: 'ground', color: '#93c5fd' },
    { position: { x: 12700, y: 300 }, size: { width: 150, height: 40 }, type: 'cloud', color: '#fff' },
    { position: { x: 13000, y: 400 }, size: { width: 150, height: 40 }, type: 'cloud', color: '#fff' },
    { position: { x: 13300, y: 500 }, size: { width: 100, height: 20 }, type: 'crumbly', color: '#bfdbfe', fallTimer: 45, maxFallTimer: 45, respawnTimer: 0 },
    { position: { x: 13600, y: 600 }, size: { width: 1000, height: 200 }, type: 'ground', color: '#93c5fd' },
    { position: { x: 14700, y: 500 }, size: { width: 150, height: 80 }, type: 'mushroom', color: '#f9a8d4', deformation: 0 },
    { position: { x: 15000, y: 350 }, size: { width: 200, height: 20 }, type: 'ground', color: '#93c5fd' },
    { position: { x: 15300, y: 250 }, size: { width: 150, height: 40 }, type: 'cloud', color: '#fff' },
    { position: { x: 15600, y: 150 }, size: { width: 200, height: 20 }, type: 'ground', color: '#93c5fd' },
    { position: { x: 15900, y: 250 }, size: { width: 100, height: 20 }, type: 'moving', color: '#60a5fa', moveDirection: 'horizontal', moveDistance: 180 },
    { position: { x: 16300, y: 350 }, size: { width: 250, height: 20 }, type: 'ground', color: '#93c5fd' },
    { position: { x: 16700, y: 450 }, size: { width: 150, height: 40 }, type: 'cloud', color: '#fff' },
    { position: { x: 17000, y: 550 }, size: { width: 150, height: 40 }, type: 'cloud', color: '#fff' },
    { position: { x: 17300, y: 600 }, size: { width: 800, height: 200 }, type: 'ground', color: '#93c5fd' },
    { position: { x: 18200, y: 500 }, size: { width: 150, height: 80 }, type: 'mushroom', color: '#f9a8d4', deformation: 0 },
    { position: { x: 18500, y: 350 }, size: { width: 200, height: 20 }, type: 'ground', color: '#93c5fd' },
    { position: { x: 18800, y: 250 }, size: { width: 150, height: 40 }, type: 'cloud', color: '#fff' },
    { position: { x: 19100, y: 350 }, size: { width: 200, height: 20 }, type: 'ground', color: '#93c5fd' },
    { position: { x: 19400, y: 600 }, size: { width: 600, height: 200 }, type: 'ground', color: '#93c5fd' },
    { position: { x: 19900, y: -200 }, size: { width: 100, height: 1000 }, type: 'ground', color: '#93c5fd' },
    { position: { x: 19500, y: 450 }, size: { width: 150, height: 150 }, type: 'aurora', color: 'transparent', requiresCoop: true },
];

export const getSkyIslandsCoins = (): Coin[] => [
    { id: 601, position: { x: 750, y: 450 }, size: 14, collected: false, baseY: 450, type: 'gold' },
    { id: 602, position: { x: 1000, y: 350 }, size: 14, collected: false, baseY: 350, type: 'gold' },
    { id: 603, position: { x: 1250, y: 250 }, size: 14, collected: false, baseY: 250, type: 'gold' },
    { id: 604, position: { x: 1550, y: 150 }, size: 14, collected: false, baseY: 150, type: 'hot-chocolate' },
    { id: 605, position: { x: 2150, y: 100 }, size: 14, collected: false, baseY: 100, type: 'gold' },
    { id: 606, position: { x: 2500, y: 200 }, size: 14, collected: false, baseY: 200, type: 'gold' },
    { id: 607, position: { x: 2750, y: 280 }, size: 14, collected: false, baseY: 280, type: 'gold' },
    { id: 608, position: { x: 3100, y: 150 }, size: 14, collected: false, baseY: 150, type: 'kanelbulle' },
    { id: 609, position: { x: 3500, y: 250 }, size: 14, collected: false, baseY: 250, type: 'gold' },
    { id: 610, position: { x: 3850, y: 150 }, size: 14, collected: false, baseY: 150, type: 'gold' },
    { id: 611, position: { x: 4150, y: 50 }, size: 14, collected: false, baseY: 50, type: 'hot-chocolate' },
    { id: 612, position: { x: 4750, y: 250 }, size: 14, collected: false, baseY: 250, type: 'gold' },
    { id: 613, position: { x: 5050, y: 330 }, size: 14, collected: false, baseY: 330, type: 'gold' },
    { id: 614, position: { x: 5400, y: 200 }, size: 14, collected: false, baseY: 200, type: 'gold' },
    { id: 615, position: { x: 5700, y: 300 }, size: 14, collected: false, baseY: 300, type: 'gold' },
    { id: 616, position: { x: 6500, y: 550 }, size: 14, collected: false, baseY: 550, type: 'kanelbulle' },
    { id: 617, position: { x: 7150, y: 400 }, size: 14, collected: false, baseY: 400, type: 'gold' },
    { id: 618, position: { x: 7450, y: 250 }, size: 14, collected: false, baseY: 250, type: 'gold' },
    { id: 619, position: { x: 7750, y: 150 }, size: 14, collected: false, baseY: 150, type: 'gold' },
    { id: 620, position: { x: 8050, y: 50 }, size: 14, collected: false, baseY: 50, type: 'hot-chocolate' },
    { id: 621, position: { x: 8400, y: 150 }, size: 14, collected: false, baseY: 150, type: 'gold' },
    { id: 622, position: { x: 8800, y: 250 }, size: 14, collected: false, baseY: 250, type: 'gold' },
    { id: 623, position: { x: 9350, y: 430 }, size: 14, collected: false, baseY: 430, type: 'gold' },
    { id: 624, position: { x: 9650, y: 300 }, size: 14, collected: false, baseY: 300, type: 'gold' },
    { id: 625, position: { x: 10250, y: 100 }, size: 14, collected: false, baseY: 100, type: 'kanelbulle' },
    { id: 626, position: { x: 10850, y: 300 }, size: 14, collected: false, baseY: 300, type: 'gold' },
    { id: 627, position: { x: 11150, y: 400 }, size: 14, collected: false, baseY: 400, type: 'gold' },
    { id: 628, position: { x: 11450, y: 480 }, size: 14, collected: false, baseY: 480, type: 'gold' },
    { id: 629, position: { x: 11750, y: 350 }, size: 14, collected: false, baseY: 350, type: 'hot-chocolate' },
    { id: 630, position: { x: 12400, y: 150 }, size: 14, collected: false, baseY: 150, type: 'gold' },
    { id: 631, position: { x: 14000, y: 550 }, size: 14, collected: false, baseY: 550, type: 'kanelbulle' },
    { id: 632, position: { x: 14750, y: 430 }, size: 14, collected: false, baseY: 430, type: 'gold' },
    { id: 633, position: { x: 15050, y: 300 }, size: 14, collected: false, baseY: 300, type: 'gold' },
    { id: 634, position: { x: 15650, y: 100 }, size: 14, collected: false, baseY: 100, type: 'hot-chocolate' },
    { id: 635, position: { x: 16400, y: 300 }, size: 14, collected: false, baseY: 300, type: 'gold' },
    { id: 636, position: { x: 17600, y: 550 }, size: 14, collected: false, baseY: 550, type: 'gold' },
    { id: 637, position: { x: 18250, y: 430 }, size: 14, collected: false, baseY: 430, type: 'gold' },
    { id: 638, position: { x: 18550, y: 300 }, size: 14, collected: false, baseY: 300, type: 'gold' },
    { id: 639, position: { x: 19150, y: 300 }, size: 14, collected: false, baseY: 300, type: 'kanelbulle' },
    { id: 640, position: { x: 19600, y: 550 }, size: 14, collected: false, baseY: 550, type: 'hot-chocolate' },
];

export const getSkyIslandsEnemies = (): Enemy[] => [
    { id: 601, position: { x: 1300, y: 250 }, size: { width: 50, height: 40 }, type: 'eagle', color: '#78350f', originalX: 1300, originalY: 250, patrolDistance: 250, speed: 4, direction: 1 },
    { id: 602, position: { x: 2600, y: 200 }, size: { width: 50, height: 40 }, type: 'eagle', color: '#78350f', originalX: 2600, originalY: 200, patrolDistance: 200, speed: 3.5, direction: -1 },
    { id: 603, position: { x: 3200, y: 150 }, size: { width: 60, height: 60 }, type: 'wind_elemental', color: '#bfdbfe', originalX: 3200, originalY: 150, patrolDistance: 300, speed: 2, direction: 1 },
    { id: 604, position: { x: 4200, y: 50 }, size: { width: 50, height: 40 }, type: 'eagle', color: '#78350f', originalX: 4200, originalY: 50, patrolDistance: 180, speed: 4, direction: 1 },
    { id: 605, position: { x: 5100, y: 350 }, size: { width: 50, height: 40 }, type: 'bird', color: '#1e293b', originalX: 5100, originalY: 350, patrolDistance: 200, speed: 3, direction: -1 },
    { id: 606, position: { x: 6500, y: 550 }, size: { width: 40, height: 50 }, type: 'shooter', color: '#dc2626', originalX: 6500, shootMaxCooldown: 100, direction: 1 },
    { id: 607, position: { x: 7500, y: 250 }, size: { width: 50, height: 40 }, type: 'eagle', color: '#78350f', originalX: 7500, originalY: 250, patrolDistance: 200, speed: 3.5, direction: 1 },
    { id: 608, position: { x: 8100, y: 50 }, size: { width: 60, height: 60 }, type: 'wind_elemental', color: '#bfdbfe', originalX: 8100, originalY: 50, patrolDistance: 250, speed: 2.5, direction: -1 },
    { id: 609, position: { x: 9400, y: 450 }, size: { width: 50, height: 40 }, type: 'bird', color: '#1e293b', originalX: 9400, originalY: 450, patrolDistance: 180, speed: 3, direction: 1 },
    { id: 610, position: { x: 11200, y: 400 }, size: { width: 50, height: 40 }, type: 'eagle', color: '#78350f', originalX: 11200, originalY: 400, patrolDistance: 220, speed: 4, direction: -1 },
    { id: 611, position: { x: 12500, y: 250 }, size: { width: 60, height: 60 }, type: 'wind_elemental', color: '#bfdbfe', originalX: 12500, originalY: 250, patrolDistance: 200, speed: 2, direction: 1 },
    { id: 612, position: { x: 14200, y: 550 }, size: { width: 40, height: 50 }, type: 'shooter', color: '#dc2626', originalX: 14200, shootMaxCooldown: 90, direction: -1 },
    { id: 613, position: { x: 16000, y: 300 }, size: { width: 50, height: 40 }, type: 'eagle', color: '#78350f', originalX: 16000, originalY: 300, patrolDistance: 250, speed: 3.5, direction: 1 },
    { id: 614, position: { x: 18300, y: 400 }, size: { width: 50, height: 40 }, type: 'bird', color: '#1e293b', originalX: 18300, originalY: 400, patrolDistance: 200, speed: 3, direction: -1 },
    { id: 699, position: { x: 17000, y: 300 }, size: { width: 120, height: 140 }, type: 'mini_boss', color: '#1e3a8a', health: 6, maxHealth: 6, originalX: 17000, patrolDistance: 400, speed: 2.5, direction: 1, miniBossType: 'storm_lord' },
];

export const getSkyIslandsCheckpoints = (): Checkpoint[] => [
    { id: 601, position: { x: 2150, y: 90 }, size: { width: 40, height: 60 }, triggered: false },
    { id: 602, position: { x: 5350, y: 190 }, size: { width: 40, height: 60 }, triggered: false },
    { id: 603, position: { x: 6300, y: 540 }, size: { width: 40, height: 60 }, triggered: false },
    { id: 604, position: { x: 8750, y: 240 }, size: { width: 40, height: 60 }, triggered: false },
    { id: 605, position: { x: 11750, y: 340 }, size: { width: 40, height: 60 }, triggered: false },
    { id: 606, position: { x: 13700, y: 540 }, size: { width: 40, height: 60 }, triggered: false },
    { id: 607, position: { x: 16350, y: 290 }, size: { width: 40, height: 60 }, triggered: false },
    { id: 608, position: { x: 17400, y: 540 }, size: { width: 40, height: 60 }, triggered: false },
    { id: 609, position: { x: 19450, y: 540 }, size: { width: 40, height: 60 }, triggered: false },
];

export const getSkyIslandsPowerUps = (): import('./types').PowerUp[] => [
    { id: 601, position: { x: 1600, y: 150 }, size: { width: 30, height: 30 }, type: 'flight', collected: false, baseY: 150, duration: 300 },
    { id: 602, position: { x: 3050, y: 150 }, size: { width: 30, height: 30 }, type: 'double_jump', collected: false, baseY: 150, duration: 480 },
    { id: 603, position: { x: 4750, y: 250 }, size: { width: 30, height: 30 }, type: 'shield', collected: false, baseY: 250, duration: 360 },
    { id: 604, position: { x: 6600, y: 540 }, size: { width: 30, height: 30 }, type: 'speed', collected: false, baseY: 540, duration: 420 },
    { id: 605, position: { x: 9650, y: 300 }, size: { width: 30, height: 30 }, type: 'ghost', collected: false, baseY: 300, duration: 360 },
    { id: 606, position: { x: 12400, y: 150 }, size: { width: 30, height: 30 }, type: 'star', collected: false, baseY: 150, duration: 300 },
    { id: 607, position: { x: 15100, y: 300 }, size: { width: 30, height: 30 }, type: 'giant', collected: false, baseY: 300, duration: 480 },
    { id: 608, position: { x: 18600, y: 300 }, size: { width: 30, height: 30 }, type: 'flight', collected: false, baseY: 300, duration: 360 },
];

export const getMechanicalFactoryPlatforms = (): Platform[] => [
    { position: { x: -200, y: 600 }, size: { width: 1000, height: 200 }, type: 'ground', color: '#52525b' },
    { position: { x: 900, y: 550 }, size: { width: 200, height: 20 }, type: 'conveyor', color: '#71717a', conveyorSpeed: 3 },
    { position: { x: 1200, y: 480 }, size: { width: 150, height: 20 }, type: 'ground', color: '#52525b' },
    { position: { x: 1450, y: 400 }, size: { width: 200, height: 20 }, type: 'conveyor', color: '#71717a', conveyorSpeed: -3 },
    { position: { x: 1750, y: 320 }, size: { width: 150, height: 20 }, type: 'ground', color: '#52525b' },
    { position: { x: 2000, y: 240 }, size: { width: 100, height: 20 }, type: 'moving', color: '#f59e0b', moveDirection: 'vertical', moveDistance: 120 },
    { position: { x: 2250, y: 160 }, size: { width: 200, height: 20 }, type: 'ground', color: '#52525b' },
    { position: { x: 2550, y: 260 }, size: { width: 150, height: 20 }, type: 'conveyor', color: '#71717a', conveyorSpeed: 4 },
    { position: { x: 2850, y: 360 }, size: { width: 100, height: 20 }, type: 'crumbly', color: '#a1a1aa', fallTimer: 35, maxFallTimer: 35, respawnTimer: 0 },
    { position: { x: 3100, y: 460 }, size: { width: 200, height: 20 }, type: 'ground', color: '#52525b' },
    { position: { x: 3400, y: 600 }, size: { width: 1000, height: 200 }, type: 'ground', color: '#52525b' },
    { position: { x: 4500, y: 520 }, size: { width: 80, height: 20 }, type: 'spike', color: '#ef4444', spikeMaxTimer: 60, spikeActive: false },
    { position: { x: 4600, y: 520 }, size: { width: 80, height: 20 }, type: 'spike', color: '#ef4444', spikeMaxTimer: 60, spikeActive: true },
    { position: { x: 4700, y: 520 }, size: { width: 80, height: 20 }, type: 'spike', color: '#ef4444', spikeMaxTimer: 60, spikeActive: false },
    { position: { x: 4450, y: 540 }, size: { width: 400, height: 30 }, type: 'ground', color: '#52525b' },
    { position: { x: 4950, y: 450 }, size: { width: 120, height: 20 }, type: 'moving', color: '#f59e0b', moveDirection: 'horizontal', moveDistance: 100 },
    { position: { x: 5250, y: 350 }, size: { width: 200, height: 20 }, type: 'ground', color: '#52525b' },
    { position: { x: 5550, y: 260 }, size: { width: 150, height: 20 }, type: 'conveyor', color: '#71717a', conveyorSpeed: -4 },
    { position: { x: 5850, y: 170 }, size: { width: 200, height: 20 }, type: 'ground', color: '#52525b' },
    { position: { x: 6150, y: 270 }, size: { width: 100, height: 20 }, type: 'moving', color: '#f59e0b', moveDirection: 'vertical', moveDistance: 150 },
    { position: { x: 6450, y: 370 }, size: { width: 150, height: 20 }, type: 'ground', color: '#52525b' },
    { position: { x: 6750, y: 480 }, size: { width: 200, height: 20 }, type: 'conveyor', color: '#71717a', conveyorSpeed: 5 },
    { position: { x: 7050, y: 600 }, size: { width: 800, height: 200 }, type: 'ground', color: '#52525b' },
    { id: 701, position: { x: 7950, y: 400 }, size: { width: 60, height: 15 }, type: 'timed_button', color: '#fbbf24', isPressed: false, buttonMaxTimer: 180, linkId: 702 },
    { id: 702, position: { x: 8250, y: 250 }, size: { width: 40, height: 150 }, type: 'door', color: '#334155', isOpen: false },
    { position: { x: 7900, y: 420 }, size: { width: 150, height: 30 }, type: 'ground', color: '#52525b' },
    { position: { x: 8100, y: 340 }, size: { width: 100, height: 20 }, type: 'ground', color: '#52525b' },
    { position: { x: 8290, y: 250 }, size: { width: 200, height: 20 }, type: 'ground', color: '#52525b' },
    { position: { x: 8600, y: 350 }, size: { width: 150, height: 20 }, type: 'conveyor', color: '#71717a', conveyorSpeed: -3 },
    { position: { x: 8900, y: 450 }, size: { width: 200, height: 20 }, type: 'ground', color: '#52525b' },
    { position: { x: 9200, y: 550 }, size: { width: 100, height: 20 }, type: 'crumbly', color: '#a1a1aa', fallTimer: 40, maxFallTimer: 40, respawnTimer: 0 },
    { position: { x: 9500, y: 600 }, size: { width: 1000, height: 200 }, type: 'ground', color: '#52525b' },
    { position: { x: 10600, y: 500 }, size: { width: 120, height: 20 }, type: 'moving', color: '#f59e0b', moveDirection: 'vertical', moveDistance: 180 },
    { position: { x: 10900, y: 350 }, size: { width: 200, height: 20 }, type: 'ground', color: '#52525b' },
    { position: { x: 11200, y: 250 }, size: { width: 150, height: 20 }, type: 'conveyor', color: '#71717a', conveyorSpeed: 4 },
    { position: { x: 11500, y: 150 }, size: { width: 200, height: 20 }, type: 'ground', color: '#52525b' },
    { position: { x: 11800, y: 250 }, size: { width: 100, height: 20 }, type: 'moving', color: '#f59e0b', moveDirection: 'horizontal', moveDistance: 120 },
    { position: { x: 12100, y: 350 }, size: { width: 150, height: 20 }, type: 'ground', color: '#52525b' },
    { position: { x: 12400, y: 450 }, size: { width: 200, height: 20 }, type: 'conveyor', color: '#71717a', conveyorSpeed: -5 },
    { position: { x: 12700, y: 550 }, size: { width: 100, height: 20 }, type: 'crumbly', color: '#a1a1aa', fallTimer: 35, maxFallTimer: 35, respawnTimer: 0 },
    { position: { x: 13000, y: 600 }, size: { width: 800, height: 200 }, type: 'ground', color: '#52525b' },
    { position: { x: 13900, y: 500 }, size: { width: 150, height: 80 }, type: 'mushroom', color: '#f59e0b', deformation: 0 },
    { position: { x: 14200, y: 350 }, size: { width: 200, height: 20 }, type: 'ground', color: '#52525b' },
    { position: { x: 14500, y: 600 }, size: { width: 500, height: 200 }, type: 'ground', color: '#52525b' },
    { position: { x: 14900, y: -200 }, size: { width: 100, height: 1000 }, type: 'ground', color: '#52525b' },
    { position: { x: 14550, y: 450 }, size: { width: 150, height: 150 }, type: 'aurora', color: 'transparent', requiresCoop: true },
];

export const getMechanicalFactoryCoins = (): Coin[] => [
    { id: 701, position: { x: 950, y: 500 }, size: 14, collected: false, baseY: 500, type: 'gold' },
    { id: 702, position: { x: 1250, y: 430 }, size: 14, collected: false, baseY: 430, type: 'gold' },
    { id: 703, position: { x: 1500, y: 350 }, size: 14, collected: false, baseY: 350, type: 'gold' },
    { id: 704, position: { x: 1800, y: 270 }, size: 14, collected: false, baseY: 270, type: 'hot-chocolate' },
    { id: 705, position: { x: 2300, y: 110 }, size: 14, collected: false, baseY: 110, type: 'gold' },
    { id: 706, position: { x: 2600, y: 210 }, size: 14, collected: false, baseY: 210, type: 'gold' },
    { id: 707, position: { x: 2900, y: 310 }, size: 14, collected: false, baseY: 310, type: 'gold' },
    { id: 708, position: { x: 3600, y: 550 }, size: 14, collected: false, baseY: 550, type: 'kanelbulle' },
    { id: 709, position: { x: 3900, y: 550 }, size: 14, collected: false, baseY: 550, type: 'gold' },
    { id: 710, position: { x: 4200, y: 550 }, size: 14, collected: false, baseY: 550, type: 'gold' },
    { id: 711, position: { x: 5000, y: 400 }, size: 14, collected: false, baseY: 400, type: 'gold' },
    { id: 712, position: { x: 5300, y: 300 }, size: 14, collected: false, baseY: 300, type: 'gold' },
    { id: 713, position: { x: 5600, y: 210 }, size: 14, collected: false, baseY: 210, type: 'gold' },
    { id: 714, position: { x: 5900, y: 120 }, size: 14, collected: false, baseY: 120, type: 'hot-chocolate' },
    { id: 715, position: { x: 6500, y: 320 }, size: 14, collected: false, baseY: 320, type: 'gold' },
    { id: 716, position: { x: 6800, y: 430 }, size: 14, collected: false, baseY: 430, type: 'gold' },
    { id: 717, position: { x: 7300, y: 550 }, size: 14, collected: false, baseY: 550, type: 'kanelbulle' },
    { id: 718, position: { x: 7600, y: 550 }, size: 14, collected: false, baseY: 550, type: 'gold' },
    { id: 719, position: { x: 8150, y: 290 }, size: 14, collected: false, baseY: 290, type: 'gold' },
    { id: 720, position: { x: 8400, y: 200 }, size: 14, collected: false, baseY: 200, type: 'hot-chocolate' },
    { id: 721, position: { x: 8650, y: 300 }, size: 14, collected: false, baseY: 300, type: 'gold' },
    { id: 722, position: { x: 8950, y: 400 }, size: 14, collected: false, baseY: 400, type: 'gold' },
    { id: 723, position: { x: 9800, y: 550 }, size: 14, collected: false, baseY: 550, type: 'gold' },
    { id: 724, position: { x: 10100, y: 550 }, size: 14, collected: false, baseY: 550, type: 'kanelbulle' },
    { id: 725, position: { x: 10650, y: 400 }, size: 14, collected: false, baseY: 400, type: 'gold' },
    { id: 726, position: { x: 10950, y: 300 }, size: 14, collected: false, baseY: 300, type: 'gold' },
    { id: 727, position: { x: 11250, y: 200 }, size: 14, collected: false, baseY: 200, type: 'gold' },
    { id: 728, position: { x: 11550, y: 100 }, size: 14, collected: false, baseY: 100, type: 'hot-chocolate' },
    { id: 729, position: { x: 11850, y: 200 }, size: 14, collected: false, baseY: 200, type: 'gold' },
    { id: 730, position: { x: 12150, y: 300 }, size: 14, collected: false, baseY: 300, type: 'gold' },
    { id: 731, position: { x: 12450, y: 400 }, size: 14, collected: false, baseY: 400, type: 'gold' },
    { id: 732, position: { x: 13300, y: 550 }, size: 14, collected: false, baseY: 550, type: 'kanelbulle' },
    { id: 733, position: { x: 13600, y: 550 }, size: 14, collected: false, baseY: 550, type: 'gold' },
    { id: 734, position: { x: 13950, y: 430 }, size: 14, collected: false, baseY: 430, type: 'gold' },
    { id: 735, position: { x: 14250, y: 300 }, size: 14, collected: false, baseY: 300, type: 'hot-chocolate' },
    { id: 736, position: { x: 14650, y: 550 }, size: 14, collected: false, baseY: 550, type: 'kanelbulle' },
];

export const getMechanicalFactoryEnemies = (): Enemy[] => [
    { id: 701, position: { x: 1050, y: 500 }, size: { width: 50, height: 50 }, type: 'robot', color: '#71717a', originalX: 1050, patrolDistance: 150, speed: 2, direction: 1 },
    { id: 702, position: { x: 2100, y: 190 }, size: { width: 40, height: 40 }, type: 'turret', color: '#dc2626', originalX: 2100, shootMaxCooldown: 80, direction: -1, rotationAngle: 0 },
    { id: 703, position: { x: 3600, y: 550 }, size: { width: 50, height: 50 }, type: 'robot', color: '#71717a', originalX: 3600, patrolDistance: 300, speed: 2.5, direction: 1 },
    { id: 704, position: { x: 4000, y: 550 }, size: { width: 50, height: 50 }, type: 'robot', color: '#71717a', originalX: 4000, patrolDistance: 200, speed: 2, direction: -1 },
    { id: 705, position: { x: 5350, y: 300 }, size: { width: 40, height: 40 }, type: 'turret', color: '#dc2626', originalX: 5350, shootMaxCooldown: 70, direction: 1, rotationAngle: 0 },
    { id: 706, position: { x: 6500, y: 320 }, size: { width: 50, height: 50 }, type: 'robot', color: '#71717a', originalX: 6500, patrolDistance: 180, speed: 2, direction: 1 },
    { id: 707, position: { x: 7300, y: 550 }, size: { width: 50, height: 50 }, type: 'robot', color: '#71717a', originalX: 7300, patrolDistance: 250, speed: 2.5, direction: -1 },
    { id: 708, position: { x: 8350, y: 200 }, size: { width: 40, height: 40 }, type: 'turret', color: '#dc2626', originalX: 8350, shootMaxCooldown: 90, direction: -1, rotationAngle: 0 },
    { id: 709, position: { x: 9000, y: 400 }, size: { width: 50, height: 50 }, type: 'robot', color: '#71717a', originalX: 9000, patrolDistance: 200, speed: 2, direction: 1 },
    { id: 710, position: { x: 9800, y: 550 }, size: { width: 50, height: 50 }, type: 'robot', color: '#71717a', originalX: 9800, patrolDistance: 350, speed: 2.5, direction: 1 },
    { id: 711, position: { x: 11000, y: 300 }, size: { width: 40, height: 40 }, type: 'turret', color: '#dc2626', originalX: 11000, shootMaxCooldown: 75, direction: 1, rotationAngle: 0 },
    { id: 712, position: { x: 12150, y: 300 }, size: { width: 50, height: 50 }, type: 'robot', color: '#71717a', originalX: 12150, patrolDistance: 150, speed: 2, direction: -1 },
    { id: 713, position: { x: 13300, y: 550 }, size: { width: 50, height: 50 }, type: 'robot', color: '#71717a', originalX: 13300, patrolDistance: 280, speed: 2.5, direction: 1 },
    { id: 799, position: { x: 14000, y: 400 }, size: { width: 130, height: 160 }, type: 'mini_boss', color: '#3f3f46', health: 7, maxHealth: 7, originalX: 14000, patrolDistance: 200, speed: 1.8, direction: 1, miniBossType: 'giant_robot' },
];

export const getMechanicalFactoryCheckpoints = (): Checkpoint[] => [
    { id: 701, position: { x: 2300, y: 100 }, size: { width: 40, height: 60 }, triggered: false },
    { id: 702, position: { x: 3500, y: 540 }, size: { width: 40, height: 60 }, triggered: false },
    { id: 703, position: { x: 5900, y: 110 }, size: { width: 40, height: 60 }, triggered: false },
    { id: 704, position: { x: 7150, y: 540 }, size: { width: 40, height: 60 }, triggered: false },
    { id: 705, position: { x: 8400, y: 190 }, size: { width: 40, height: 60 }, triggered: false },
    { id: 706, position: { x: 9600, y: 540 }, size: { width: 40, height: 60 }, triggered: false },
    { id: 707, position: { x: 11550, y: 90 }, size: { width: 40, height: 60 }, triggered: false },
    { id: 708, position: { x: 13100, y: 540 }, size: { width: 40, height: 60 }, triggered: false },
];

export const getMechanicalFactoryPowerUps = (): import('./types').PowerUp[] => [
    { id: 701, position: { x: 1800, y: 270 }, size: { width: 30, height: 30 }, type: 'shield', collected: false, baseY: 270, duration: 360 },
    { id: 702, position: { x: 3150, y: 410 }, size: { width: 30, height: 30 }, type: 'speed', collected: false, baseY: 410, duration: 420 },
    { id: 703, position: { x: 5050, y: 400 }, size: { width: 30, height: 30 }, type: 'laser_beam', collected: false, baseY: 400, duration: 480 },
    { id: 704, position: { x: 7100, y: 540 }, size: { width: 30, height: 30 }, type: 'giant', collected: false, baseY: 540, duration: 480 },
    { id: 705, position: { x: 8950, y: 400 }, size: { width: 30, height: 30 }, type: 'double_jump', collected: false, baseY: 400, duration: 420 },
    { id: 706, position: { x: 10100, y: 540 }, size: { width: 30, height: 30 }, type: 'star', collected: false, baseY: 540, duration: 300 },
    { id: 707, position: { x: 12450, y: 400 }, size: { width: 30, height: 30 }, type: 'bomb', collected: false, baseY: 400, duration: 1 },
    { id: 708, position: { x: 13800, y: 540 }, size: { width: 30, height: 30 }, type: 'gravity_boots', collected: false, baseY: 540, duration: 480 },
];
