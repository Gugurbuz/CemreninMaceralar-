
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
  deathProtection: boolean; // Hot chocolate death protection
  iceThrowCooldown: number; // Cooldown for ice throw

  // Game Feel Mechanics
  coyoteTimer: number; // Frames allowing jump after leaving ground
  jumpBufferTimer: number; // Frames remembering jump press before hitting ground
  mushroomCooldown: number; // New: Prevent double bouncing on mushrooms
  standingOn: Platform['type'] | null; // Track what the player is standing on
}

export interface Platform {
  id?: number;
  position: Vector2;
  size: Size;
  type: 'ground' | 'block' | 'pipe' | 'finish' | 'ice' | 'slippery' | 'crumbly' | 'door' | 'plate' | 'aurora' | 'leaf' | 'mushroom' | 'totem' | 'cloud' | 'moving' | 'spike' | 'timed_button' | 'conveyor' | 'toggle_platform';
  color: string;
  isPressed?: boolean;
  isOpen?: boolean;
  isFalling?: boolean;
  fallTimer?: number;
  maxFallTimer?: number;
  respawnTimer?: number;
  linkId?: number;
  requiresCoop?: boolean;
  deformation?: number;
  isActive?: boolean;
  moveSpeed?: number;
  moveDistance?: number;
  moveDirection?: 'horizontal' | 'vertical';
  originalPosition?: Vector2;
  movePhase?: number;
  spikeTimer?: number;
  spikeMaxTimer?: number;
  spikeActive?: boolean;
  buttonTimer?: number;
  buttonMaxTimer?: number;
  conveyorSpeed?: number;
  linkedPlatformIds?: number[];
  isVisible?: boolean;
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
  type: 'shield' | 'speed' | 'double_jump' | 'magnet' | 'star' | 'ice_throw' | 'giant';
  collected: boolean;
  baseY: number;
  duration: number; // frames
}

export interface Enemy {
  id: number;
  position: Vector2;
  size: Size;
  type: 'slime' | 'snowman' | 'yeti' | 'bird' | 'boss' | 'shooter' | 'chaser' | 'jumper';
  color: string;
  health?: number;
  maxHealth?: number;
  phase?: number;
  attackTimer?: number;
  attackCooldown?: number;
  isAttacking?: boolean;
  attackType?: 'slam' | 'dash' | 'projectile' | 'summon';
  isInvincible?: boolean;
  shieldActive?: boolean;
  originalX?: number;
  patrolDistance?: number;
  speed?: number;
  direction?: 1 | -1;
  originalY?: number;
  dashTarget?: Vector2;
  isDashing?: boolean;
  hitFlash?: number;
  shootCooldown?: number;
  shootMaxCooldown?: number;
  chaseRange?: number;
  isChasing?: boolean;
  jumpTimer?: number;
  jumpMaxTimer?: number;
  isJumping?: boolean;
  velocityY?: number;
  frozenTimer?: number;
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

export interface Projectile {
  id: number;
  position: Vector2;
  velocity: Vector2;
  size: number;
  type: 'ice_ball' | 'shockwave' | 'player_ice';
  damage: number;
  life: number;
  fromPlayer?: boolean;
}

export interface AuroraCrystal {
  id: number;
  position: Vector2;
  size: Size;
  collected: boolean;
  glowPhase: number;
}

export interface GameConfig {
    mode: 'solo' | 'multi';
    character: 'cemre' | 'baba' | null;
    lives: number;
    level: number;
}

export interface GameState {
  level: number;
  gameMode: 'solo' | 'multi';
  runConfig: GameConfig;
  players: Player[];
  platforms: Platform[];
  coins: Coin[];
  powerUps: PowerUp[];
  enemies: Enemy[];
  checkpoints: Checkpoint[];
  floatingTexts: FloatingText[];
  projectiles: Projectile[];
  auroraCrystals: AuroraCrystal[];
  camera: Vector2;
  status: 'menu' | 'playing' | 'won' | 'gameover' | 'transition' | 'paused';
  score: number;
  globalTime: number;
  activeRespawnPoint: Vector2;
  windActive: boolean;
  canTeleport: boolean;
  screenShake: number;
  coinsCollected: number;
  enemiesDefeated: number;
  deathCount: number;
  perfectJumps: number;
  powerUpsUsed: number;
  portalHoldTimer: number;
  cinematicMode: 'none' | 'aurora_suction' | 'nectar_rain';
  bossPhaseTransition: boolean;
  crystalsCollected: number;
}

export interface InputState {
  [key: string]: boolean;
}
