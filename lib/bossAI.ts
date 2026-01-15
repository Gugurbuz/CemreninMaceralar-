import { Enemy, GameState, Projectile, AuroraCrystal } from '../types';

let nextProjectileId = 1000;
let nextCrystalId = 2000;
let bossAttackTimeouts: number[] = [];

export const clearBossTimeouts = () => {
    bossAttackTimeouts.forEach(id => window.clearTimeout(id));
    bossAttackTimeouts = [];
};

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

    else if (boss.phase === 4) {
        boss.speed = 3.5;
        boss.isInvincible = false;

        const livingPlayers = gameState.players.filter(p => !p.isDead);
        if (livingPlayers.length > 0) {
            const target = livingPlayers[Math.floor(Math.random() * livingPlayers.length)];
            const dx = target.position.x - boss.position.x;
            boss.position.x += Math.sign(dx) * boss.speed;
            boss.position.x = Math.max(arenaLeft, Math.min(arenaRight - boss.size.width, boss.position.x));
        }

        if (boss.attackTimer > 60 && !boss.attackCooldown) {
            const attackRoll = Math.random();
            if (attackRoll < 0.3) {
                performSlam(boss, gameState, addFloatingText);
                performProjectileAttack(boss, gameState, addFloatingText);
            } else if (attackRoll < 0.6) {
                performDash(boss, gameState, addFloatingText);
                performSummon(boss, gameState, addFloatingText);
            } else {
                chooseAttack(boss, gameState, addFloatingText, ['slam', 'dash', 'projectile', 'summon']);
            }
            boss.attackTimer = 0;
            boss.attackCooldown = 50;
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
    addFloatingText(boss.position.x + 75, boss.position.y - 30, "!", "#fbbf24");

    const timeoutId = window.setTimeout(() => {
        if (boss.health && boss.health > 0 && gameState.status === 'playing') {
            gameState.screenShake = 12;
            createShockwave(boss, gameState);
            boss.isAttacking = false;
        }
        bossAttackTimeouts = bossAttackTimeouts.filter(id => id !== timeoutId);
    }, 800);
    bossAttackTimeouts.push(timeoutId);
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

    const timeoutId = window.setTimeout(() => {
        if (boss.health && boss.health > 0 && gameState.status === 'playing') {
            boss.isAttacking = false;
        }
        bossAttackTimeouts = bossAttackTimeouts.filter(id => id !== timeoutId);
    }, 600);
    bossAttackTimeouts.push(timeoutId);
};

const performSummon = (
    boss: Enemy,
    gameState: GameState,
    addFloatingText: (x: number, y: number, text: string, color: string) => void
) => {
    boss.isAttacking = true;
    boss.attackType = 'summon';
    addFloatingText(boss.position.x + 75, boss.position.y - 30, "CAGIR!", "#a855f7");

    const minionCount = boss.phase === 3 ? 3 : 2;
    const arenaFloorY = 600;
    for (let i = 0; i < minionCount; i++) {
        const spawnX = boss.position.x + (i - minionCount / 2) * 150;
        gameState.enemies.push({
            id: 9000 + gameState.globalTime + i,
            position: { x: spawnX, y: arenaFloorY },
            size: { width: 40, height: 50 },
            type: 'snowman',
            color: '#94a3b8',
            originalX: spawnX,
            patrolDistance: 100,
            speed: 2,
            direction: 1
        });
    }

    const timeoutId = window.setTimeout(() => {
        if (boss.health && boss.health > 0 && gameState.status === 'playing') {
            boss.isAttacking = false;
        }
        bossAttackTimeouts = bossAttackTimeouts.filter(id => id !== timeoutId);
    }, 800);
    bossAttackTimeouts.push(timeoutId);
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

    if (boss.phase === 1 && boss.health <= 9) {
        boss.phase = 2;
        gameState.bossPhaseTransition = true;
        gameState.screenShake = 20;
        addFloatingText(boss.position.x + 75, boss.position.y - 40, "FAZ 2: OFKELENDI!", "#f59e0b");
        return false;
    }

    if (boss.phase === 2 && boss.health <= 6) {
        boss.phase = 3;
        boss.shieldActive = true;
        boss.isInvincible = true;
        gameState.bossPhaseTransition = true;
        gameState.screenShake = 25;
        addFloatingText(boss.position.x + 75, boss.position.y - 40, "FAZ 3: KALKAN!", "#a855f7");
        return false;
    }

    if (boss.phase === 3 && boss.health <= 3) {
        boss.phase = 4;
        boss.shieldActive = false;
        boss.isInvincible = false;
        gameState.bossPhaseTransition = true;
        gameState.screenShake = 30;
        addFloatingText(boss.position.x + 75, boss.position.y - 40, "FAZ 4: KAOS MODU!", "#ef4444");
        return false;
    }

    return false;
};

export const updateMiniBossAI = (
    miniBoss: Enemy,
    gameState: GameState,
    addFloatingText: (x: number, y: number, text: string, color: string) => void
) => {
    if (!miniBoss || miniBoss.type !== 'mini_boss') return;

    if (miniBoss.hitFlash && miniBoss.hitFlash > 0) {
        miniBoss.hitFlash--;
    }

    if (miniBoss.attackCooldown && miniBoss.attackCooldown > 0) {
        miniBoss.attackCooldown--;
    }

    miniBoss.attackTimer = (miniBoss.attackTimer || 0) + 1;

    const patrolLeft = (miniBoss.originalX || 0) - (miniBoss.patrolDistance || 200);
    const patrolRight = (miniBoss.originalX || 0) + (miniBoss.patrolDistance || 200);

    if (!miniBoss.isAttacking) {
        miniBoss.position.x += (miniBoss.direction || 1) * (miniBoss.speed || 2);

        if (miniBoss.position.x <= patrolLeft) {
            miniBoss.direction = 1;
        } else if (miniBoss.position.x >= patrolRight) {
            miniBoss.direction = -1;
        }
    }

    const livingPlayers = gameState.players.filter(p => !p.isDead);
    if (livingPlayers.length > 0) {
        const nearestPlayer = livingPlayers.reduce((nearest, player) => {
            const distCurrent = Math.abs(player.position.x - miniBoss.position.x);
            const distNearest = Math.abs(nearest.position.x - miniBoss.position.x);
            return distCurrent < distNearest ? player : nearest;
        });

        const distToPlayer = Math.abs(nearestPlayer.position.x - miniBoss.position.x);

        if (distToPlayer < 400 && miniBoss.attackTimer > 120 && !miniBoss.attackCooldown) {
            if (miniBoss.miniBossType === 'cave_monster') {
                performMiniBossSlam(miniBoss, gameState, addFloatingText);
            } else if (miniBoss.miniBossType === 'storm_lord') {
                performMiniBossProjectile(miniBoss, gameState, addFloatingText);
            } else if (miniBoss.miniBossType === 'giant_robot') {
                performMiniBossLaser(miniBoss, gameState, addFloatingText);
            }
            miniBoss.attackTimer = 0;
            miniBoss.attackCooldown = 150;
        }
    }
};

const performMiniBossSlam = (
    miniBoss: Enemy,
    gameState: GameState,
    addFloatingText: (x: number, y: number, text: string, color: string) => void
) => {
    miniBoss.isAttacking = true;
    addFloatingText(miniBoss.position.x + 50, miniBoss.position.y - 20, "EZME!", "#ef4444");

    const timeoutId = window.setTimeout(() => {
        if (miniBoss.health && miniBoss.health > 0 && gameState.status === 'playing') {
            gameState.screenShake = 8;
            miniBoss.isAttacking = false;
        }
        bossAttackTimeouts = bossAttackTimeouts.filter(id => id !== timeoutId);
    }, 600);
    bossAttackTimeouts.push(timeoutId);
};

const performMiniBossProjectile = (
    miniBoss: Enemy,
    gameState: GameState,
    addFloatingText: (x: number, y: number, text: string, color: string) => void
) => {
    miniBoss.isAttacking = true;
    addFloatingText(miniBoss.position.x + 60, miniBoss.position.y - 20, "FIRTINA!", "#60a5fa");

    for (let i = 0; i < 3; i++) {
        const angle = (Math.PI / 6) + (i * (Math.PI / 3) / 2);
        gameState.projectiles.push({
            id: nextProjectileId++,
            position: { x: miniBoss.position.x + miniBoss.size.width / 2, y: miniBoss.position.y + miniBoss.size.height / 2 },
            velocity: { x: Math.cos(angle) * 4 * (miniBoss.direction || 1), y: Math.sin(angle) * 4 },
            size: 15,
            type: 'ice_ball',
            damage: 1,
            life: 120
        });
    }

    const timeoutId = window.setTimeout(() => {
        if (miniBoss.health && miniBoss.health > 0 && gameState.status === 'playing') {
            miniBoss.isAttacking = false;
        }
        bossAttackTimeouts = bossAttackTimeouts.filter(id => id !== timeoutId);
    }, 400);
    bossAttackTimeouts.push(timeoutId);
};

const performMiniBossLaser = (
    miniBoss: Enemy,
    gameState: GameState,
    addFloatingText: (x: number, y: number, text: string, color: string) => void
) => {
    miniBoss.isAttacking = true;
    miniBoss.isFiringLaser = true;
    addFloatingText(miniBoss.position.x + 65, miniBoss.position.y - 20, "LAZER!", "#f59e0b");

    const laserProjectile = {
        id: nextProjectileId++,
        position: { x: miniBoss.position.x + (miniBoss.direction === 1 ? miniBoss.size.width : 0), y: miniBoss.position.y + miniBoss.size.height / 2 },
        velocity: { x: 10 * (miniBoss.direction || 1), y: 0 },
        size: 25,
        type: 'shockwave' as const,
        damage: 1,
        life: 90
    };
    gameState.projectiles.push(laserProjectile);

    const timeoutId = window.setTimeout(() => {
        if (miniBoss.health && miniBoss.health > 0 && gameState.status === 'playing') {
            miniBoss.isAttacking = false;
            miniBoss.isFiringLaser = false;
        }
        bossAttackTimeouts = bossAttackTimeouts.filter(id => id !== timeoutId);
    }, 500);
    bossAttackTimeouts.push(timeoutId);
};

export const handleMiniBossHit = (
    miniBoss: Enemy,
    damage: number,
    gameState: GameState,
    addFloatingText: (x: number, y: number, text: string, color: string) => void
): boolean => {
    miniBoss.health = (miniBoss.health || 0) - damage;
    miniBoss.hitFlash = 10;
    gameState.screenShake = 5;

    if (miniBoss.health <= 0) {
        gameState.miniBossesDefeated = (gameState.miniBossesDefeated || 0) + 1;
        addFloatingText(miniBoss.position.x + 50, miniBoss.position.y - 30, "YENILDI!", "#22c55e");
        return true;
    }

    addFloatingText(miniBoss.position.x + 50, miniBoss.position.y - 20, `-${damage}`, "#ef4444");
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
