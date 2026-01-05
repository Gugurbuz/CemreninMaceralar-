import { Enemy, GameState, Player, Projectile, AuroraCrystal } from '../types';

let nextProjectileId = 1000;
let nextCrystalId = 2000;

export const updateBossAI = (
    boss: Enemy,
    gameState: GameState,
    addFloatingText: (x: number, y: number, text: string, color: string) => void
) => {
    if (!boss || boss.type !== 'boss') return;

    if (boss.hitFlash && boss.hitFlash > 0) {
        boss.hitFlash--;
    }

    if (boss.attackCooldown && boss.attackCooldown > 0) {
        boss.attackCooldown--;
    }

    boss.attackTimer = (boss.attackTimer || 0) + 1;

    const arenaCenter = 2900;
    const arenaLeft = 1400;
    const arenaRight = 4500;

    if (boss.isDashing && boss.dashTarget) {
        const dx = boss.dashTarget.x - boss.position.x;
        const dy = boss.dashTarget.y - boss.position.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 20) {
            boss.isDashing = false;
            boss.isAttacking = false;
            gameState.screenShake = 15;
            addFloatingText(boss.position.x + 75, boss.position.y - 30, "SLAM!", "#ef4444");
        } else {
            const speed = 8;
            boss.position.x += (dx / dist) * speed;
            boss.position.y += (dy / dist) * speed;
        }
        return;
    }

    if (boss.phase === 1) {
        boss.speed = 1.5;

        if (!boss.originalX) boss.originalX = boss.position.x;
        const targetX = boss.originalX + Math.sin(gameState.globalTime * 0.02) * (boss.patrolDistance || 300);
        boss.position.x += (targetX - boss.position.x) * 0.03;

        if (boss.attackTimer > 180 && !boss.attackCooldown) {
            chooseAttack(boss, gameState, addFloatingText, ['slam', 'summon']);
            boss.attackTimer = 0;
            boss.attackCooldown = 120;
        }
    }

    else if (boss.phase === 2) {
        boss.speed = 2.2;

        const livingPlayers = gameState.players.filter(p => !p.isDead);
        if (livingPlayers.length > 0) {
            const target = livingPlayers[Math.floor(Math.random() * livingPlayers.length)];
            const dx = target.position.x - boss.position.x;
            boss.position.x += Math.sign(dx) * boss.speed;
            boss.position.x = Math.max(arenaLeft, Math.min(arenaRight - boss.size.width, boss.position.x));
        }

        if (boss.attackTimer > 120 && !boss.attackCooldown) {
            chooseAttack(boss, gameState, addFloatingText, ['slam', 'dash', 'projectile', 'summon']);
            boss.attackTimer = 0;
            boss.attackCooldown = 100;
        }
    }

    else if (boss.phase === 3) {
        boss.speed = 2.8;

        if (boss.shieldActive) {
            boss.isInvincible = true;
            boss.position.x = arenaCenter - boss.size.width / 2;

            if (gameState.auroraCrystals.length === 0 && gameState.crystalsCollected === 0) {
                spawnAuroraCrystals(gameState);
            }

            if (gameState.crystalsCollected >= 3) {
                boss.shieldActive = false;
                boss.isInvincible = false;
                gameState.crystalsCollected = 0;
                gameState.screenShake = 20;
                addFloatingText(boss.position.x + 75, boss.position.y - 40, "KALKAN KIRILDI!", "#fbbf24");
            }
        } else {
            const livingPlayers = gameState.players.filter(p => !p.isDead);
            if (livingPlayers.length > 0) {
                const target = livingPlayers[Math.floor(Math.random() * livingPlayers.length)];
                const dx = target.position.x - boss.position.x;
                boss.position.x += Math.sign(dx) * boss.speed;
                boss.position.x = Math.max(arenaLeft, Math.min(arenaRight - boss.size.width, boss.position.x));
            }

            if (boss.attackTimer > 90 && !boss.attackCooldown) {
                chooseAttack(boss, gameState, addFloatingText, ['slam', 'dash', 'projectile', 'summon']);
                boss.attackTimer = 0;
                boss.attackCooldown = 80;
            }
        }
    }
};

const chooseAttack = (
    boss: Enemy,
    gameState: GameState,
    addFloatingText: (x: number, y: number, text: string, color: string) => void,
    availableAttacks: string[]
) => {
    const attack = availableAttacks[Math.floor(Math.random() * availableAttacks.length)];

    if (attack === 'slam') {
        performSlam(boss, gameState, addFloatingText);
    } else if (attack === 'dash') {
        performDash(boss, gameState, addFloatingText);
    } else if (attack === 'projectile') {
        performProjectileAttack(boss, gameState, addFloatingText);
    } else if (attack === 'summon') {
        performSummon(boss, gameState, addFloatingText);
    }
};

const performSlam = (
    boss: Enemy,
    gameState: GameState,
    addFloatingText: (x: number, y: number, text: string, color: string) => void
) => {
    boss.isAttacking = true;
    boss.attackType = 'slam';
    addFloatingText(boss.position.x + 75, boss.position.y - 30, "⚠️", "#fbbf24");

    setTimeout(() => {
        if (boss.health && boss.health > 0) {
            gameState.screenShake = 12;
            createShockwave(boss, gameState);
            boss.isAttacking = false;
        }
    }, 800);
};

const performDash = (
    boss: Enemy,
    gameState: GameState,
    addFloatingText: (x: number, y: number, text: string, color: string) => void
) => {
    boss.isAttacking = true;
    boss.attackType = 'dash';
    boss.isDashing = true;

    const livingPlayers = gameState.players.filter(p => !p.isDead);
    if (livingPlayers.length > 0) {
        const target = livingPlayers[Math.floor(Math.random() * livingPlayers.length)];
        boss.dashTarget = { x: target.position.x, y: boss.position.y };
        addFloatingText(boss.position.x + 75, boss.position.y - 30, "돌진!", "#f59e0b");
    }
};

const performProjectileAttack = (
    boss: Enemy,
    gameState: GameState,
    addFloatingText: (x: number, y: number, text: string, color: string) => void
) => {
    boss.isAttacking = true;
    boss.attackType = 'projectile';
    addFloatingText(boss.position.x + 75, boss.position.y - 30, "BUZ!", "#60a5fa");

    const projectileCount = boss.phase === 3 ? 5 : 3;
    for (let i = 0; i < projectileCount; i++) {
        const angle = (Math.PI / 4) + (i * (Math.PI / 2) / (projectileCount - 1));
        const speed = 5;

        gameState.projectiles.push({
            id: nextProjectileId++,
            position: { x: boss.position.x + boss.size.width / 2, y: boss.position.y + boss.size.height / 2 },
            velocity: { x: Math.cos(angle) * speed, y: Math.sin(angle) * speed },
            size: 20,
            type: 'ice_ball',
            damage: 1,
            life: 180
        });
    }

    setTimeout(() => {
        if (boss.health && boss.health > 0) {
            boss.isAttacking = false;
        }
    }, 600);
};

const performSummon = (
    boss: Enemy,
    gameState: GameState,
    addFloatingText: (x: number, y: number, text: string, color: string) => void
) => {
    boss.isAttacking = true;
    boss.attackType = 'summon';
    addFloatingText(boss.position.x + 75, boss.position.y - 30, "ÇAĞIR!", "#a855f7");

    const minionCount = boss.phase === 3 ? 3 : 2;
    for (let i = 0; i < minionCount; i++) {
        const spawnX = boss.position.x + (i - minionCount / 2) * 150;
        gameState.enemies.push({
            id: 9000 + gameState.globalTime + i,
            position: { x: spawnX, y: 400 },
            size: { width: 40, height: 50 },
            type: 'snowman',
            color: '#94a3b8',
            originalX: spawnX,
            patrolDistance: 100,
            speed: 2,
            direction: 1
        });
    }

    setTimeout(() => {
        if (boss.health && boss.health > 0) {
            boss.isAttacking = false;
        }
    }, 800);
};

const createShockwave = (boss: Enemy, gameState: GameState) => {
    gameState.projectiles.push({
        id: nextProjectileId++,
        position: { x: boss.position.x, y: boss.position.y + boss.size.height },
        velocity: { x: -6, y: 0 },
        size: 30,
        type: 'shockwave',
        damage: 1,
        life: 60
    });

    gameState.projectiles.push({
        id: nextProjectileId++,
        position: { x: boss.position.x + boss.size.width, y: boss.position.y + boss.size.height },
        velocity: { x: 6, y: 0 },
        size: 30,
        type: 'shockwave',
        damage: 1,
        life: 60
    });
};

const spawnAuroraCrystals = (gameState: GameState) => {
    const crystalPositions = [
        { x: 1700, y: 360 },
        { x: 3400, y: 330 },
        { x: 4050, y: 330 }
    ];

    crystalPositions.forEach(pos => {
        gameState.auroraCrystals.push({
            id: nextCrystalId++,
            position: { x: pos.x, y: pos.y },
            size: { width: 30, height: 40 },
            collected: false,
            glowPhase: 0
        });
    });
};

export const handleBossHit = (
    boss: Enemy,
    damage: number,
    gameState: GameState,
    addFloatingText: (x: number, y: number, text: string, color: string) => void
): boolean => {
    if (boss.isInvincible || boss.shieldActive) {
        addFloatingText(boss.position.x + 75, boss.position.y - 20, "BLOCKED!", "#94a3b8");
        return false;
    }

    boss.health = (boss.health || 0) - damage;
    boss.hitFlash = 10;
    gameState.screenShake = 10;

    if (boss.health <= 0) {
        return true;
    }

    if (boss.phase === 1 && boss.health <= 8) {
        boss.phase = 2;
        gameState.bossPhaseTransition = true;
        gameState.screenShake = 20;
        addFloatingText(boss.position.x + 75, boss.position.y - 40, "FAZ 2: ÖFKELENDİ!", "#f59e0b");
        return false;
    }

    if (boss.phase === 2 && boss.health <= 4) {
        boss.phase = 3;
        boss.shieldActive = true;
        boss.isInvincible = true;
        gameState.bossPhaseTransition = true;
        gameState.screenShake = 25;
        addFloatingText(boss.position.x + 75, boss.position.y - 40, "FAZ 3: KALKAN!", "#a855f7");
        return false;
    }

    return false;
};

export const updateProjectiles = (gameState: GameState) => {
    gameState.projectiles = gameState.projectiles.filter(proj => {
        proj.position.x += proj.velocity.x;
        proj.position.y += proj.velocity.y;
        proj.life--;

        if (proj.life <= 0) return false;

        const arenaLeft = 1200;
        const arenaRight = 4700;
        if (proj.position.x < arenaLeft || proj.position.x > arenaRight) return false;

        return true;
    });
};

export const updateAuroraCrystals = (gameState: GameState) => {
    gameState.auroraCrystals.forEach(crystal => {
        crystal.glowPhase = (crystal.glowPhase + 0.1) % (Math.PI * 2);
    });
};
