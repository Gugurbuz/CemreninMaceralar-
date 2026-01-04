
export interface Vector2 {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface Player {
  id: 'cemre' | 'baba';
  position: Vector2;
  velocity: Vector2;
  size: Size;
  baseSize: Size; // Keep track of original size to fix shrinking bug
  scale: Vector2; // New: For Squash and Stretch animation
  color: string;
  isGrounded: boolean;
  name: string;
  jumpForce: number;
  moveSpeed: number;
  facing: 'left' | 'right';
  animFrame: number; // For walking animation cycle
  lives: number;
  isDead: boolean;
  buff: { type: 'warmth'; timer: number } | null; // Buff state
  invincibleTimer: number; // New: Flashing effect
  activePowerUps: Array<{ type: PowerUp['type']; timer: number }>; // Multiple power-ups
  hasDoubleJump: boolean; // For double jump power-up

  // Game Feel Mechanics
  coyoteTimer: number; // Frames allowing jump after leaving ground
  jumpBufferTimer: number; // Frames remembering jump press before hitting ground
  mushroomCooldown: number; // New: Prevent double bouncing on mushrooms
  standingOn: Platform['type'] | null; // Track what the player is standing on
}

export interface Platform {
  id?: number; // Unique ID for logic linking
  position: Vector2;
  size: Size;
  type: 'ground' | 'block' | 'pipe' | 'finish' | 'ice' | 'crumbly' | 'door' | 'plate' | 'aurora' | 'leaf' | 'mushroom' | 'totem' | 'cloud';
  color: string;
  // State for mechanics
  isPressed?: boolean; // For plates
  isOpen?: boolean;    // For doors
  isFalling?: boolean; // For crumbly platforms
  fallTimer?: number;  // Ticks before falling
  maxFallTimer?: number; // To reset the platform
  respawnTimer?: number; // Ticks before reappearing
  linkId?: number;     // To link Plate -> Door
  requiresCoop?: boolean; // For final portals
  deformation?: number; // For squish animation (0 = normal, negative = squished, positive = stretched)
  isActive?: boolean; // For Totem (Wind On/Off)
}

export interface Coin {
  id: number;
  position: Vector2;
  size: number; // radius
  collected: boolean;
  baseY: number; // for bobbing animation
  type: 'gold' | 'kanelbulle' | 'hot-chocolate' | 'apple' | 'cherry' | 'banana';
  isNectarDrop?: boolean; // For win cinematic
}

export interface PowerUp {
  id: number;
  position: Vector2;
  size: Size;
  type: 'shield' | 'speed' | 'double_jump' | 'magnet' | 'star';
  collected: boolean;
  baseY: number;
  duration: number; // frames
}

export interface Enemy {
  id: number;
  position: Vector2;
  size: Size;
  type: 'slime' | 'snowman' | 'yeti' | 'bird' | 'boss';
  color: string;
  health?: number; // For boss
  maxHealth?: number; // For boss
  phase?: number; // For boss phases
  attackTimer?: number; // For boss attacks
  // Patrol logic
  originalX?: number;
  patrolDistance?: number;
  speed?: number;
  direction?: 1 | -1;
  // Bird logic
  originalY?: number;
}

export interface Checkpoint {
  id: number;
  position: Vector2;
  size: Size;
  triggered: boolean;
}

export interface FloatingText {
  id: number;
  x: number;
  y: number;
  text: string;
  color: string;
  life: number; // frames
  vy: number;
}

export interface Particle {
  x: number;
  y: number;
  size: number;
  speed: number;
  color: string;
  angle: number;
}

export interface EffectParticle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
  type: 'dust' | 'splash';
}

export interface GameConfig {
    mode: 'solo' | 'multi';
    character: 'cemre' | 'baba' | null;
    lives: number;
    level: number;
}

export interface GameState {
  level: number; // 1, 2, 3, or 4
  gameMode: 'solo' | 'multi';
  runConfig: GameConfig; // Store initial config for restarts
  players: Player[];
  platforms: Platform[];
  coins: Coin[];
  powerUps: PowerUp[];
  enemies: Enemy[];
  checkpoints: Checkpoint[];
  floatingTexts: FloatingText[]; // New: Popups
  camera: Vector2;
  status: 'menu' | 'playing' | 'won' | 'gameover' | 'transition' | 'paused';
  score: number;
  globalTime: number;
  activeRespawnPoint: Vector2;
  windActive: boolean;
  canTeleport: boolean;
  screenShake: number; // New: Shake intensity
  coinsCollected: number; // Track total coins
  enemiesDefeated: number; // Track enemies defeated
  deathCount: number; // Track deaths
  perfectJumps: number; // Track perfect jumps
  powerUpsUsed: number; // Track power-ups used

  // Cinematic & Logic
  portalHoldTimer: number; // For co-op win
  cinematicMode: 'none' | 'aurora_suction' | 'nectar_rain';
}

export interface InputState {
  [key: string]: boolean;
}
