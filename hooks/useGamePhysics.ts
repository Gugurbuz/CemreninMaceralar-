
import React, { useCallback } from 'react';
import { GameState, InputState, Player, Platform, Particle, EffectParticle, Enemy } from '../types';
import {
    GRAVITY, TERMINAL_VELOCITY, FRICTION, ICE_FRICTION, WIND_FORCE,
    CANVAS_WIDTH, CANVAS_HEIGHT, HOT_CHOCOLATE_DURATION,
    LEVEL_1_WIDTH, LEVEL_2_WIDTH, LEVEL_3_WIDTH, LEVEL_4_WIDTH, COYOTE_TIME, JUMP_BUFFER, INITIAL_RESPAWN_POINT,
    getWinterEnemies, getButterflyEnemies, getFruitParadiseEnemies, getBossLevelEnemies
} from '../constants';
import { soundManager } from '../utils/SoundManager';
import { updateBossAI, handleBossHit, updateProjectiles, updateAuroraCrystals } from '../lib/bossAI';

interface PhysicsProps {
    gameState: React.MutableRefObject<GameState>;
    inputs: React.MutableRefObject<InputState>;
    particles: React.MutableRefObject<Particle[]>;
    effectParticles: React.MutableRefObject<EffectParticle[]>;
    callbacks: {
        setGameStatus: (status: any) => void;
        setShowDialog: (show: boolean) => void;
        setDialogText: (text: any[]) => void;
        loadLevel: (level: number) => void;
        setCurrentScore: (score: number) => void;
        setTutorialState: (state: any) => void;
        tutorialStateRef: React.MutableRefObject<any>;
    }
}

export const useGamePhysics = ({
    gameState,
    inputs,
    particles,
    effectParticles,
    callbacks
}: PhysicsProps) => {

    const isColliding = (r1: {x:number, y:number, w:number, h:number}, r2: {x:number, y:number, w:number, h:number}) => {
        return (
            r1.x < r2.x + r2.w &&
            r1.x + r1.w > r2.x &&
            r1.y < r2.y + r2.h &&
            r1.y + r1.h > r2.y
        );
    }

    const createDust = (x: number, y: number) => {
    };

    const createSplash = (x: number, y: number) => {
    };

    const addFloatingText = (x: number, y: number, text: string, color: string) => {
    };

    const handlePlayerDamage = (p: Player) => {
        if (p.isDead || p.invincibleTimer > 0) return;

        // Check for shield power-up
        const hasShield = p.activePowerUps.some(pu => pu.type === 'shield');
        if (hasShield) {
            const shieldIndex = p.activePowerUps.findIndex(pu => pu.type === 'shield');
            if (shieldIndex !== -1) {
                p.activePowerUps.splice(shieldIndex, 1);
                addFloatingText(p.position.x, p.position.y - 40, 'Kalkan Kirıldi!', '#fbbf24');
                soundManager.playCoin();
                p.invincibleTimer = 30;
                return;
            }
        }

        // Check for star power-up (full invincibility)
        const hasStar = p.activePowerUps.some(pu => pu.type === 'star');
        if (hasStar) {
            addFloatingText(p.position.x, p.position.y - 40, 'Yıldız Koruma!', '#fbbf24');
            soundManager.playCoin();
            return;
        }

        // Check for death protection from hot chocolate
        if (p.deathProtection) {
            p.deathProtection = false;
            addFloatingText(p.position.x, p.position.y - 40, 'Kahve Kurtardi!', '#f97316');
            soundManager.playCoin();
            p.invincibleTimer = 60;
            return;
        }

        p.lives -= 1;
        p.invincibleTimer = 60;
        gameState.current.screenShake = 15;
        gameState.current.deathCount++;
        soundManager.playDamage();
        p.buff = null;

        if (p.lives > 0) {
            p.position.x = gameState.current.activeRespawnPoint.x;
            p.position.y = gameState.current.activeRespawnPoint.y;
            p.velocity = {x: 0, y: 0};

            const level = gameState.current.level;
            if (level === 1) {
                gameState.current.enemies = getWinterEnemies();
            } else if (level === 2) {
                gameState.current.enemies = getButterflyEnemies();
            } else if (level === 3) {
                gameState.current.enemies = getFruitParadiseEnemies();
            } else if (level === 4) {
                gameState.current.enemies = getBossLevelEnemies();
                gameState.current.projectiles = [];
                gameState.current.auroraCrystals = [];
            }
        } else {
            p.isDead = true;
            p.velocity = {x: 0, y: 0};

            const allDead = gameState.current.players.every(pl => pl.isDead);
            if (allDead) {
                gameState.current.status = 'gameover';
                callbacks.setGameStatus('gameover');
                soundManager.stopBGM();
            }
        }
    };

    const resolveXCollisions = (player: Player, platforms: Platform[]) => {
        const hitX = player.position.x + 5;
        const hitW = player.size.width - 10;
        const hitY = player.position.y + 5;
        const hitH = player.size.height - 10;

        for (const plat of platforms) {
            if (plat.type === 'door' && plat.isOpen) continue;
            if (plat.type === 'aurora') continue;
            if (plat.type === 'crumbly' && plat.isFalling && (plat.fallTimer || 0) <= 0) continue;
            if (plat.type === 'plate' || plat.type === 'totem' || plat.type === 'timed_button') continue;
            if (plat.type === 'cloud') continue;
            if (plat.type === 'toggle_platform' && !plat.isVisible) continue;
            if (plat.type === 'spike') continue;
  
            if (isColliding(
                {x: hitX, y: hitY, w: hitW, h: hitH},
                {x: plat.position.x, y: plat.position.y, w: plat.size.width, h: plat.size.height}
            )) {
                if (player.velocity.x > 0) {
                     player.position.x = plat.position.x - player.size.width;
                } else if (player.velocity.x < 0) {
                     player.position.x = plat.position.x + plat.size.width;
                }
                player.velocity.x = 0;
                return; 
            }
        }
    };
  
    // NEW: Resolve Y collisions by finding the BEST candidate frame by frame
    // This prevents "ground overrides mushroom" issues.
    const resolveYCollisions = (player: Player, platforms: Platform[]) => {
        player.isGrounded = false;
        let friction = FRICTION;
        
        const hitX = player.position.x + 8;
        const hitW = player.size.width - 16;
        const hitY = player.position.y;
        const hitH = player.size.height;
        
        let bestPlatform: Platform | null = null;
        let collisionType: 'floor' | 'ceiling' | null = null;
        
        // Find collisions
        for (const plat of platforms) {
            if (plat.type === 'door' && plat.isOpen) continue;
            if (plat.type === 'aurora') continue;
            if (plat.type === 'crumbly' && plat.isFalling && (plat.fallTimer || 0) <= 0) continue;
            if (plat.type === 'toggle_platform' && !plat.isVisible) continue;

            // Trigger Logic (Non-physical)
            if (plat.type === 'plate') {
                if (isColliding({x: hitX, y: hitY, w: hitW, h: hitH}, {x: plat.position.x, y: plat.position.y, w: plat.size.width, h: plat.size.height})) {
                    if (!plat.isPressed) {
                        plat.isPressed = true;
                        soundManager.playCoin();
                        const door = gameState.current.platforms.find(p => p.id === plat.linkId);
                        if (door) door.isOpen = true;
                        if (plat.linkedPlatformIds) {
                            plat.linkedPlatformIds.forEach(lid => {
                                const linkedPlat = gameState.current.platforms.find(lp => lp.id === lid);
                                if (linkedPlat) {
                                    if (linkedPlat.type === 'toggle_platform') linkedPlat.isVisible = !linkedPlat.isVisible;
                                    else if (linkedPlat.type === 'door') linkedPlat.isOpen = true;
                                }
                            });
                        }
                    }
                }
                continue;
            }
            if (plat.type === 'timed_button') {
                if (isColliding({x: hitX, y: hitY, w: hitW, h: hitH}, {x: plat.position.x, y: plat.position.y, w: plat.size.width, h: plat.size.height})) {
                    if (!plat.isPressed) {
                        plat.isPressed = true;
                        plat.buttonTimer = plat.buttonMaxTimer || 180;
                        soundManager.playCoin();
                        addFloatingText(plat.position.x, plat.position.y - 20, "Zamanli!", "#fbbf24");
                        const door = gameState.current.platforms.find(p => p.id === plat.linkId);
                        if (door) door.isOpen = true;
                        if (plat.linkedPlatformIds) {
                            plat.linkedPlatformIds.forEach(lid => {
                                const linkedPlat = gameState.current.platforms.find(lp => lp.id === lid);
                                if (linkedPlat) {
                                    if (linkedPlat.type === 'toggle_platform') linkedPlat.isVisible = !linkedPlat.isVisible;
                                    else if (linkedPlat.type === 'door') linkedPlat.isOpen = true;
                                }
                            });
                        }
                    }
                }
                continue;
            }
            if (plat.type === 'totem') {
                 if (isColliding({x: hitX, y: hitY, w: hitW, h: hitH}, {x: plat.position.x, y: plat.position.y, w: plat.size.width, h: plat.size.height})) {
                     if (!plat.deformation) {
                         plat.isActive = !plat.isActive;
                         gameState.current.windActive = plat.isActive;
                         plat.deformation = 1;
                         soundManager.playCoin();
                         addFloatingText(plat.position.x, plat.position.y, plat.isActive ? "Ruzgar!" : "Durdu!", "#fff");
                         if (gameState.current.level === 1) createDust(plat.position.x + 50, plat.position.y);
                     }
                 }
                 continue;
            }

            // Physical Logic
            if (isColliding(
                {x: hitX, y: hitY, w: hitW, h: hitH},
                {x: plat.position.x, y: plat.position.y, w: plat.size.width, h: plat.size.height}
            )) {
                // Determine collision direction based on velocity
                if (player.velocity.y > 0) {
                     // Falling -> Hit Floor
                     
                     // Cloud Logic (One Way Platform): Only hit if we were previously ABOVE it
                     // We check if previous Y (estimated by subtracting vy) was above platform y
                     if (plat.type === 'cloud') {
                         const prevY = player.position.y - player.velocity.y;
                         if (prevY + player.size.height > plat.position.y + 10) {
                             continue; // Ignored collision, passing through from bottom
                         }
                     }

                     // Prioritize Mushrooms > Higher Platforms
                     if (!bestPlatform) {
                         bestPlatform = plat;
                         collisionType = 'floor';
                     } else {
                         // If we already found a platform, check if this one is better
                         // Mushroom always wins
                         if (plat.type === 'mushroom' && bestPlatform.type !== 'mushroom') {
                             bestPlatform = plat;
                         } else if (plat.type !== 'mushroom' && bestPlatform.type === 'mushroom') {
                             // Keep mushroom
                         } else {
                             // Otherwise pick the highest one (lowest Y) to land ON TOP
                             if (plat.position.y < bestPlatform.position.y) {
                                 bestPlatform = plat;
                             }
                         }
                     }
                } else if (player.velocity.y < 0) {
                    // Rising -> Hit Head
                    if (plat.type === 'cloud') continue; // Pass through clouds going up

                    if (!bestPlatform) {
                        bestPlatform = plat;
                        collisionType = 'ceiling';
                    } else {
                        // Pick lowest platform (highest Y) for head bonk
                        if (plat.position.y > bestPlatform.position.y) {
                            bestPlatform = plat;
                        }
                    }
                }
            }
        }

        // Apply Collision
        if (bestPlatform && collisionType === 'floor') {
             // LANDING
             player.position.y = bestPlatform.position.y - player.size.height;
             
             // Track what we are standing on for Jump Logic
             player.standingOn = bestPlatform.type;
             
             // Base Reset
             const oldVy = player.velocity.y;
             
             // MUSHROOM LOGIC
             if (bestPlatform.type === 'mushroom') {
                 // AUTO BOUNCE ONLY IF FALLING FAST (Trampoline effect)
                 if (oldVy > 12) {
                     player.isGrounded = false;
                     player.mushroomCooldown = 15;
                     
                     // Standard Auto-Bounce
                     let bouncePower = -22; 
                     player.velocity.y = bouncePower;
                     
                     bestPlatform.deformation = -0.4; 
                     player.scale.x = 0.6; player.scale.y = 1.4;
                     soundManager.playBounce(0.8);
                 } else {
                     // Otherwise, land on it like normal ground
                     player.isGrounded = true;
                     player.coyoteTimer = COYOTE_TIME;
                     player.velocity.y = 0;
                 }
             } else {
                 // NORMAL GROUND LOGIC
                 player.isGrounded = true;
                 player.coyoteTimer = COYOTE_TIME;

                 if (oldVy > 4) {
                     player.scale.x = 1.3;
                     player.scale.y = 0.7;

                     if (gameState.current.level === 2 && (bestPlatform.type === 'ice' || bestPlatform.type === 'slippery')) {
                           createSplash(player.position.x + player.size.width/2, player.position.y + player.size.height);
                     } else {
                           createDust(player.position.x + player.size.width/2, player.position.y + player.size.height);
                     }
                 }

                 player.velocity.y = 0;
                 
                 if (bestPlatform.type === 'ice') {
                     friction = ICE_FRICTION;
                     if (gameState.current.level === 2) {
                         handlePlayerDamage(player);
                         addFloatingText(player.position.x, player.position.y - 40, "Su Cok Soguk!", "#38bdf8");
                     }
                 } else if (bestPlatform.type === 'slippery') {
                     friction = ICE_FRICTION;
                 } else if (bestPlatform.type === 'crumbly') {
                     if (!bestPlatform.isFalling) bestPlatform.isFalling = true;
                 } else if (bestPlatform.type === 'spike' && bestPlatform.spikeActive) {
                     handlePlayerDamage(player);
                     addFloatingText(player.position.x, player.position.y - 40, "Diken!", "#ef4444");
                 } else if (bestPlatform.type === 'conveyor') {
                     player.velocity.x += bestPlatform.conveyorSpeed || 3;
                 }
             }

        } else if (bestPlatform && collisionType === 'ceiling') {
            // BONK HEAD
            player.position.y = bestPlatform.position.y + bestPlatform.size.height;
            player.velocity.y = 0;
            player.scale.y = 0.9;
            player.scale.x = 1.1;
        }

        return friction;
    };

    const updateParticles = () => {
        const isLevel1 = gameState.current.level === 1;
        particles.current.forEach(p => {
            if (isLevel1) {
                p.y += p.speed;
                if (gameState.current.windActive) p.x += p.speed * -1.5;
            } else {
                p.x += Math.cos(p.angle) * 1;
                p.y += Math.sin(p.angle) * 1;
                p.angle += 0.1;
                p.y += (Math.random() - 0.5) * 0.5;
            }
    
            if (gameState.current.cinematicMode !== 'aurora_suction') {
               if (p.y > CANVAS_HEIGHT) p.y = -10;
               if (p.y < -10) p.y = CANVAS_HEIGHT;
               if (p.x < 0) p.x = CANVAS_WIDTH;
               if (p.x > CANVAS_WIDTH) p.x = 0;
            }
        });
    };

    const updatePhysics = useCallback(() => {
        updateParticles();
        
        // Performance Cap: Limit effect particles to prevent freezing
        if (effectParticles.current.length > 50) {
            effectParticles.current.splice(0, effectParticles.current.length - 50);
        }
    
        // CINEMATICS
        if (gameState.current.status === 'transition' || gameState.current.status === 'won') {
             if (gameState.current.cinematicMode === 'aurora_suction') {
                 const portal = gameState.current.platforms.find(p => p.type === 'aurora');
                 if (portal) {
                     const centerX = portal.position.x + portal.size.width / 2;
                     const centerY = portal.position.y + portal.size.height / 2;
                     gameState.current.players.forEach(p => {
                         if (!p.isDead) {
                             p.position.x += (centerX - p.position.x) * 0.05;
                             p.position.y += (centerY - p.position.y) * 0.05;
                             p.size.width *= 0.95; 
                             p.size.height *= 0.95;
                         }
                     });
                     particles.current.forEach(part => {
                         part.x += (centerX - part.x) * 0.1;
                         part.y += (centerY - part.y) * 0.1;
                     });
                 }
             } else if (gameState.current.cinematicMode === 'nectar_rain') {
                 if (Math.random() < 0.2) {
                     gameState.current.coins.push({
                         id: Math.random(),
                         position: { x: gameState.current.camera.x + Math.random() * CANVAS_WIDTH, y: -50 },
                         size: 10,
                         collected: false,
                         baseY: 0,
                         type: 'gold',
                         isNectarDrop: true
                     });
                 }
                 gameState.current.coins.forEach(c => {
                     if (c.isNectarDrop) {
                         c.position.y += 5;
                         c.baseY = c.position.y;
                     }
                 });
             }
             return; 
        }
    
        if (gameState.current.status !== 'playing') return;
        
        const time = gameState.current.globalTime;
        gameState.current.globalTime += 1;
        
        if (gameState.current.screenShake > 0) gameState.current.screenShake--;
    
        // Cleanup Floating Texts
        for (let i = gameState.current.floatingTexts.length - 1; i >= 0; i--) {
            const ft = gameState.current.floatingTexts[i];
            ft.y += ft.vy;
            ft.life--;
            if (ft.life <= 0) gameState.current.floatingTexts.splice(i, 1);
        }
    
        // Cleanup Effect Particles
        for (let i = effectParticles.current.length - 1; i >= 0; i--) {
            const p = effectParticles.current[i];
            p.x += p.vx;
            p.y += p.vy;
            p.life--;
            if (p.type === 'splash') p.vy += 0.2; 
            if (p.life <= 0) {
                effectParticles.current.splice(i, 1);
            }
        }
    
        // Wind Logic
        if (gameState.current.level === 1) {
            const totem = gameState.current.platforms.find(p => p.type === 'totem');
            if (totem) {
                gameState.current.windActive = !!totem.isActive;
            } else {
                const windCycle = time % 600;
                gameState.current.windActive = windCycle > 300 && windCycle < 450;
            }
        } else {
            gameState.current.windActive = false;
        }
    
        // Platform Updates
        gameState.current.platforms.forEach(p => {
            if (p.deformation) {
                p.deformation *= 0.8;
                if (Math.abs(p.deformation) < 0.01) p.deformation = 0;
            }

            if (p.type === 'crumbly') {
                if (p.isFalling && p.fallTimer !== undefined) {
                    if (p.fallTimer > 0) {
                        p.fallTimer--;
                    } else {
                        p.respawnTimer = (p.respawnTimer || 0) + 1;
                        if (p.respawnTimer > 300) {
                            p.isFalling = false;
                            p.fallTimer = p.maxFallTimer || 60;
                            p.respawnTimer = 0;
                            createDust(p.position.x + p.size.width/2, p.position.y + p.size.height/2);
                        }
                    }
                }
            }

            if (p.type === 'moving') {
                if (!p.originalPosition) {
                    p.originalPosition = { x: p.position.x, y: p.position.y };
                }
                p.movePhase = (p.movePhase || 0) + 0.02;
                const offset = Math.sin(p.movePhase) * (p.moveDistance || 100);
                if (p.moveDirection === 'vertical') {
                    p.position.y = p.originalPosition.y + offset;
                } else {
                    p.position.x = p.originalPosition.x + offset;
                }
            }

            if (p.type === 'spike') {
                p.spikeTimer = (p.spikeTimer || 0) + 1;
                if (p.spikeTimer >= (p.spikeMaxTimer || 90)) {
                    p.spikeActive = !p.spikeActive;
                    p.spikeTimer = 0;
                }
            }

            if (p.type === 'timed_button') {
                if (p.isPressed && p.buttonTimer !== undefined) {
                    p.buttonTimer--;
                    if (p.buttonTimer <= 0) {
                        p.isPressed = false;
                        if (p.linkedPlatformIds) {
                            p.linkedPlatformIds.forEach(lid => {
                                const linkedDoor = gameState.current.platforms.find(lp => lp.id === lid);
                                if (linkedDoor) linkedDoor.isOpen = false;
                            });
                        }
                        const linkedDoor = gameState.current.platforms.find(lp => lp.id === p.linkId);
                        if (linkedDoor) linkedDoor.isOpen = false;
                    }
                }
            }
        });
    
        // Enemy Logic Updates (Patrols)
        const livingPlayers = gameState.current.players.filter(p => !p.isDead);

        gameState.current.enemies.forEach(enemy => {
            // Handle frozen state
            if (enemy.frozenTimer && enemy.frozenTimer > 0) {
                enemy.frozenTimer--;
                return;
            }

            if (enemy.type === 'boss') {
                updateBossAI(enemy, gameState.current, addFloatingText);
            } else if ((enemy.type === 'yeti' || enemy.type === 'slime' || enemy.type === 'snowman') && enemy.originalX && enemy.patrolDistance) {
                enemy.position.x += (enemy.speed || 1) * (enemy.direction || 1);
                if (enemy.position.x > enemy.originalX + enemy.patrolDistance) enemy.direction = -1;
                if (enemy.position.x < enemy.originalX) enemy.direction = 1;
            }
            else if (enemy.type === 'bird' && enemy.originalX && enemy.originalY) {
                enemy.position.x += (enemy.speed || 1) * (enemy.direction || 1);
                enemy.position.y = enemy.originalY + Math.sin(time * 0.05) * 50;
                if (Math.abs(enemy.position.x - enemy.originalX) > (enemy.patrolDistance || 300)) {
                    enemy.direction = (enemy.direction || 1) === 1 ? -1 : 1;
                }
            }
            else if (enemy.type === 'shooter') {
                enemy.shootCooldown = (enemy.shootCooldown || 0) - 1;
                if (enemy.shootCooldown <= 0 && livingPlayers.length > 0) {
                    const nearestPlayer = livingPlayers.reduce((nearest, p) => {
                        const d1 = Math.abs(p.position.x - enemy.position.x);
                        const d2 = Math.abs(nearest.position.x - enemy.position.x);
                        return d1 < d2 ? p : nearest;
                    }, livingPlayers[0]);

                    const dx = nearestPlayer.position.x - enemy.position.x;
                    const dy = nearestPlayer.position.y - enemy.position.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 400) {
                        enemy.direction = dx > 0 ? 1 : -1;
                        gameState.current.projectiles.push({
                            id: Math.random() * 10000,
                            position: { x: enemy.position.x + enemy.size.width / 2, y: enemy.position.y + enemy.size.height / 2 },
                            velocity: { x: (dx / dist) * 4, y: (dy / dist) * 4 },
                            size: 12,
                            type: 'ice_ball',
                            damage: 1,
                            life: 120
                        });
                        enemy.shootCooldown = enemy.shootMaxCooldown || 90;
                    }
                }
            }
            else if (enemy.type === 'chaser' && enemy.originalX) {
                let isChasing = false;
                if (livingPlayers.length > 0) {
                    const nearestPlayer = livingPlayers.reduce((nearest, p) => {
                        const d1 = Math.abs(p.position.x - enemy.position.x);
                        const d2 = Math.abs(nearest.position.x - enemy.position.x);
                        return d1 < d2 ? p : nearest;
                    }, livingPlayers[0]);

                    const dx = nearestPlayer.position.x - enemy.position.x;
                    const dist = Math.abs(dx);

                    if (dist < (enemy.chaseRange || 250)) {
                        isChasing = true;
                        enemy.direction = dx > 0 ? 1 : -1;
                        enemy.position.x += (enemy.speed || 2) * 1.5 * enemy.direction;
                    }
                }

                if (!isChasing) {
                    enemy.position.x += (enemy.speed || 1) * (enemy.direction || 1);
                    if (enemy.position.x > enemy.originalX + (enemy.patrolDistance || 150)) enemy.direction = -1;
                    if (enemy.position.x < enemy.originalX) enemy.direction = 1;
                }
                enemy.isChasing = isChasing;
            }
            else if (enemy.type === 'jumper' && enemy.originalX && enemy.originalY !== undefined) {
                enemy.jumpTimer = (enemy.jumpTimer || 0) + 1;
                if (!enemy.isJumping && enemy.jumpTimer >= (enemy.jumpMaxTimer || 60)) {
                    enemy.isJumping = true;
                    enemy.velocityY = -12;
                    enemy.jumpTimer = 0;
                }

                if (enemy.isJumping) {
                    enemy.velocityY = (enemy.velocityY || 0) + 0.5;
                    enemy.position.y += enemy.velocityY;

                    if (enemy.position.y >= enemy.originalY) {
                        enemy.position.y = enemy.originalY;
                        enemy.isJumping = false;
                        enemy.velocityY = 0;
                    }
                }

                enemy.position.x += (enemy.speed || 1) * (enemy.direction || 1);
                if (enemy.position.x > enemy.originalX + (enemy.patrolDistance || 100)) enemy.direction = -1;
                if (enemy.position.x < enemy.originalX) enemy.direction = 1;
            }
        });

        updateProjectiles(gameState.current);
        updateAuroraCrystals(gameState.current);

        for (let i = gameState.current.projectiles.length - 1; i >= 0; i--) {
            const proj = gameState.current.projectiles[i];

            // Player ice projectiles hit enemies
            if (proj.fromPlayer && proj.type === 'player_ice') {
                for (let j = gameState.current.enemies.length - 1; j >= 0; j--) {
                    const enemy = gameState.current.enemies[j];
                    if (enemy.frozenTimer && enemy.frozenTimer > 0) continue;
                    if (enemy.type === 'boss') continue;

                    if (isColliding(
                        {x: proj.position.x, y: proj.position.y, w: proj.size, h: proj.size},
                        {x: enemy.position.x, y: enemy.position.y, w: enemy.size.width, h: enemy.size.height}
                    )) {
                        enemy.frozenTimer = 180;
                        addFloatingText(enemy.position.x, enemy.position.y - 20, 'Dondu!', '#60a5fa');
                        soundManager.playCoin();
                        gameState.current.projectiles.splice(i, 1);
                        break;
                    }
                }
                continue;
            }

            // Enemy projectiles hit players
            gameState.current.players.forEach(p => {
                if (p.isDead || p.invincibleTimer > 0) return;
                if (isColliding(
                    {x: p.position.x, y: p.position.y, w: p.size.width, h: p.size.height},
                    {x: proj.position.x, y: proj.position.y, w: proj.size, h: proj.size}
                )) {
                    handlePlayerDamage(p);
                    gameState.current.projectiles.splice(i, 1);
                }
            });
        }

        for (let i = gameState.current.auroraCrystals.length - 1; i >= 0; i--) {
            const crystal = gameState.current.auroraCrystals[i];
            if (crystal.collected) continue;

            gameState.current.players.forEach(p => {
                if (p.isDead) return;
                if (isColliding(
                    {x: p.position.x, y: p.position.y, w: p.size.width, h: p.size.height},
                    {x: crystal.position.x, y: crystal.position.y, w: crystal.size.width, h: crystal.size.height}
                )) {
                    crystal.collected = true;
                    gameState.current.crystalsCollected++;
                    gameState.current.score += 50;
                    soundManager.playCoin();
                    addFloatingText(crystal.position.x, crystal.position.y - 20, `Kristal ${gameState.current.crystalsCollected}/3`, '#a855f7');
                    gameState.current.auroraCrystals.splice(i, 1);
                }
            });
        }
    
        // Teleport Logic
        const players = gameState.current.players;
        if (players.length > 1) {
            const p1 = players[0];
            const p2 = players[1];
            if (!p1.isDead && !p2.isDead) {
                const dist = Math.abs(p1.position.x - p2.position.x);
                gameState.current.canTeleport = dist > 400; 
                if (gameState.current.canTeleport && (inputs.current['t'] || inputs.current['T'])) {
                    const leader = p1.position.x > p2.position.x ? p1 : p2;
                    const follower = p1.position.x > p2.position.x ? p2 : p1;
                    follower.position.x = leader.position.x - 50;
                    follower.position.y = leader.position.y - 50;
                    follower.velocity = { x: 0, y: 0 };
                    soundManager.playJump();
                }
            } else {
                gameState.current.canTeleport = false;
            }
        } else {
            gameState.current.canTeleport = false;
        }
    
        const anyKey = Object.values(inputs.current).some(v => v);
        if (anyKey && !callbacks.tutorialStateRef.current.moved) {
            callbacks.setTutorialState((prev: any) => ({ ...prev, moved: true }));
            callbacks.tutorialStateRef.current.moved = true;
        }

        let playersInPortal = 0;
        const portal = gameState.current.platforms.find(p => p.type === 'aurora');
    
        gameState.current.players.forEach(p => {
            if (p.isDead) return;
            if (p.invincibleTimer > 0) p.invincibleTimer--;
            
            // New: Mushroom Cooldown
            if (p.mushroomCooldown > 0) p.mushroomCooldown--;
      
            if (p.buff) {
                p.buff.timer--;
                if (p.buff.timer <= 0) p.buff = null;
            }
      
            if (p.coyoteTimer > 0) p.coyoteTimer--;
            if (p.jumpBufferTimer > 0) p.jumpBufferTimer--;
      
            const hasWarmth = p.buff?.type === 'warmth';
            const hasSpeed = p.activePowerUps.some(pu => pu.type === 'speed');
            const hasDoubleJumpPower = p.activePowerUps.some(pu => pu.type === 'double_jump');
            const hasStar = p.activePowerUps.some(pu => pu.type === 'star');

            const currentJumpForce = hasWarmth ? p.jumpForce * 1.15 : p.jumpForce;
            const effectiveWind = hasWarmth ? WIND_FORCE * 0.2 : WIND_FORCE;
            const effectiveMoveSpeed = hasSpeed ? p.moveSpeed * 1.5 : p.moveSpeed;
      
            const isSolo = gameState.current.players.length === 1;
            
            const up = inputs.current['ArrowUp'] || inputs.current['w'] || inputs.current['W'];
            const left = inputs.current['ArrowLeft'] || inputs.current['a'] || inputs.current['A'];
            const right = inputs.current['ArrowRight'] || inputs.current['d'] || inputs.current['D'];
            
            // Determine active Jump Force for this frame
            let activeJumpForce = currentJumpForce;
            
            // SUPER JUMP if standing on Mushroom
            if (p.standingOn === 'mushroom') {
                activeJumpForce = -28; // Massive Super Jump
            }

            // --- MOVEMENT LOGIC & GAME FEEL ---
            if (isSolo) {
                if (left) { p.velocity.x -= effectiveMoveSpeed; p.facing = 'left'; }
                if (right) { p.velocity.x += effectiveMoveSpeed; p.facing = 'right'; }

                // AUTO-JUMP ENABLED: check raw input instead of "Fresh"
                if (up) {
                     p.jumpBufferTimer = JUMP_BUFFER;
                }

                // Ground jump
                if (p.jumpBufferTimer > 0 && (p.isGrounded || p.coyoteTimer > 0)) {
                     p.velocity.y = activeJumpForce;
                     p.isGrounded = false;
                     p.coyoteTimer = 0;
                     p.jumpBufferTimer = 0;
                     p.hasDoubleJump = hasDoubleJumpPower; // Reset double jump if we have power-up
                     gameState.current.perfectJumps++;

                     // Play different sound for super jump
                     if (p.standingOn === 'mushroom') soundManager.playBounce(1.0);
                     else soundManager.playJump();

                     if (!callbacks.tutorialStateRef.current.jumped) {
                         callbacks.setTutorialState((prev: any) => ({...prev, jumped: true}));
                         callbacks.tutorialStateRef.current.jumped = true;
                     }
                     // STRETCH ON JUMP
                     p.scale.x = 0.8;
                     p.scale.y = 1.2;
                }
                // Double jump (in air)
                else if (p.jumpBufferTimer > 0 && !p.isGrounded && p.hasDoubleJump) {
                     p.velocity.y = activeJumpForce * 0.9; // Slightly weaker
                     p.hasDoubleJump = false;
                     p.jumpBufferTimer = 0;
                     soundManager.playBounce(0.7);
                     addFloatingText(p.position.x, p.position.y, 'Çift!', '#fbbf24');
                     p.scale.x = 0.8;
                     p.scale.y = 1.2;
                }

                // Variable Jump Height (smoother cut)
                if (!up && p.velocity.y < -4) {
                     p.velocity.y *= 0.75;
                }

            } else {
                // Multi-Player Input Logic
                if (p.id === 'cemre') {
                    if (inputs.current['ArrowLeft']) { p.velocity.x -= effectiveMoveSpeed; p.facing = 'left'; }
                    if (inputs.current['ArrowRight']) { p.velocity.x += effectiveMoveSpeed; p.facing = 'right'; }

                    if (inputs.current['ArrowUp']) {
                        p.jumpBufferTimer = JUMP_BUFFER;
                    }

                    if (p.jumpBufferTimer > 0 && (p.isGrounded || p.coyoteTimer > 0)) {
                         p.velocity.y = activeJumpForce;
                         p.isGrounded = false;
                         p.coyoteTimer = 0;
                         p.jumpBufferTimer = 0;
                         p.hasDoubleJump = hasDoubleJumpPower;
                         gameState.current.perfectJumps++;
                         if (p.standingOn === 'mushroom') soundManager.playBounce(1.0);
                         else soundManager.playJump();
                         p.scale.x = 0.8;
                         p.scale.y = 1.2;
                    }
                    else if (p.jumpBufferTimer > 0 && !p.isGrounded && p.hasDoubleJump) {
                         p.velocity.y = activeJumpForce * 0.9;
                         p.hasDoubleJump = false;
                         p.jumpBufferTimer = 0;
                         soundManager.playBounce(0.7);
                         p.scale.x = 0.8;
                         p.scale.y = 1.2;
                    }
                    if (!inputs.current['ArrowUp'] && p.velocity.y < -4) p.velocity.y *= 0.75;
                }
                else if (p.id === 'baba') {
                    if (inputs.current['a'] || inputs.current['A']) { p.velocity.x -= effectiveMoveSpeed; p.facing = 'left'; }
                    if (inputs.current['d'] || inputs.current['D']) { p.velocity.x += effectiveMoveSpeed; p.facing = 'right'; }

                    if (inputs.current['w'] || inputs.current['W']) {
                        p.jumpBufferTimer = JUMP_BUFFER;
                    }

                    if (p.jumpBufferTimer > 0 && (p.isGrounded || p.coyoteTimer > 0)) {
                        p.velocity.y = activeJumpForce;
                        p.isGrounded = false;
                        p.coyoteTimer = 0;
                        p.jumpBufferTimer = 0;
                        p.hasDoubleJump = hasDoubleJumpPower;
                        gameState.current.perfectJumps++;
                        if (p.standingOn === 'mushroom') soundManager.playBounce(1.0);
                        else soundManager.playJump();
                        p.scale.x = 0.8;
                        p.scale.y = 1.2;
                    }
                    else if (p.jumpBufferTimer > 0 && !p.isGrounded && p.hasDoubleJump) {
                        p.velocity.y = activeJumpForce * 0.9;
                        p.hasDoubleJump = false;
                        p.jumpBufferTimer = 0;
                        soundManager.playBounce(0.7);
                        p.scale.x = 0.8;
                        p.scale.y = 1.2;
                    }
                    if (!(inputs.current['w'] || inputs.current['W']) && p.velocity.y < -4) p.velocity.y *= 0.75;
                }
            }

            // RECOVER SCALE LOGIC (Spring back to 1,1)
            p.scale.x += (1 - p.scale.x) * 0.1;
            p.scale.y += (1 - p.scale.y) * 0.1;
      
            // --- PHYSICS STEPS (Sub-stepping for anti-tunneling) ---
            
            // 1. Apply Forces
            p.velocity.y += GRAVITY;
            if (gameState.current.windActive) p.velocity.x += effectiveWind;
            
            // 2. Resolve X Movement
            p.position.x += p.velocity.x;
            resolveXCollisions(p, gameState.current.platforms);

            // 3. Resolve Y Movement with Sub-stepping
            if (Math.abs(p.velocity.y) > p.size.height / 2) {
                // High velocity detected - perform sub-steps
                const steps = Math.min(5, Math.ceil(Math.abs(p.velocity.y) / (p.size.height / 2))); // Cap steps to 5 for safety
                const stepY = p.velocity.y / steps;
                
                let collisionFound = false;
                for (let s = 0; s < steps; s++) {
                    p.position.y += stepY;
                    const friction = resolveYCollisions(p, gameState.current.platforms);
                    if (p.isGrounded || p.velocity.y === 0) {
                        // If we hit ground or head, apply friction and stop stepping
                        p.velocity.x *= friction;
                        collisionFound = true;
                        break;
                    }
                }
                
                if (!collisionFound) {
                     // Just air drag if no collision in sub-steps
                     p.velocity.x *= FRICTION; 
                }

            } else {
                // Normal single step
                p.position.y += p.velocity.y;
                const friction = resolveYCollisions(p, gameState.current.platforms);
                p.velocity.x *= friction;
            }
      
            // Cap Terminal Velocity (Higher cap for Mushroom jumps)
            const cap = p.standingOn === 'mushroom' ? 32 : TERMINAL_VELOCITY;
            if (p.velocity.y > cap) p.velocity.y = cap;
            
            // Drag at low speeds
            if (Math.abs(p.velocity.x) < 0.1) p.velocity.x = 0;
            
            // Animation state
            if (Math.abs(p.velocity.x) > 0.5) p.animFrame += 0.15; else p.animFrame = 0;
      
            // Camera Look Ahead & Clamping
            if (p.position.x < 0) p.position.x = 0;
            if (p.position.y > 1200) handlePlayerDamage(p);
      
            // --- ENTITY INTERACTIONS ---
            if (portal) {
                if (isColliding(
                    {x: p.position.x, y: p.position.y, w: p.size.width, h: p.size.height},
                    {x: portal.position.x, y: portal.position.y, w: portal.size.width, h: portal.size.height}
                )) {
                    playersInPortal++;
                }
            }
      
            // Check for magnet power-up
            const hasMagnet = p.activePowerUps.some(pu => pu.type === 'magnet');
            const magnetRadius = hasMagnet ? 150 : 0;

            gameState.current.coins.forEach(coin => {
                if (!coin.collected && !coin.isNectarDrop) {
                    const dx = (p.position.x + p.size.width/2) - coin.position.x;
                    const dy = (p.position.y + p.size.height/2) - coin.position.y;
                    const dist = Math.sqrt(dx*dx + dy*dy);

                    // Magnet effect - pull coins towards player
                    if (hasMagnet && dist < magnetRadius && dist > p.size.width/2 + coin.size) {
                        const pullForce = 0.15;
                        coin.position.x += (p.position.x + p.size.width/2 - coin.position.x) * pullForce;
                        coin.position.y += (p.position.y + p.size.height/2 - coin.position.y) * pullForce;
                        coin.baseY = coin.position.y;
                    }

                    if (dist < p.size.width/2 + coin.size) {
                        coin.collected = true;
                        soundManager.playCoin();
                        gameState.current.coinsCollected++;

                        addFloatingText(coin.position.x, coin.position.y - 20, '+10', '#fbbf24');

                        if (coin.type === 'hot-chocolate') {
                            p.buff = { type: 'warmth', timer: HOT_CHOCOLATE_DURATION };
                            p.deathProtection = true;
                            addFloatingText(coin.position.x, coin.position.y - 40, 'Olum Korumasi!', '#f97316');
                        } else {
                            callbacks.setCurrentScore(gameState.current.score + 10);
                            gameState.current.score += 10;
                        }
                    }
                }
            });

            // Power-up collection
            gameState.current.powerUps.forEach(powerUp => {
                if (!powerUp.collected) {
                    const dx = (p.position.x + p.size.width/2) - powerUp.position.x;
                    const dy = (p.position.y + p.size.height/2) - powerUp.position.y;
                    if (Math.sqrt(dx*dx + dy*dy) < p.size.width/2 + 15) {
                        powerUp.collected = true;
                        soundManager.playCoin();
                        gameState.current.powerUpsUsed++;

                        // Add power-up to player
                        p.activePowerUps.push({ type: powerUp.type, timer: powerUp.duration });

                        // Giant effect - increase size
                        if (powerUp.type === 'giant') {
                            p.size.width = p.baseSize.width * 1.5;
                            p.size.height = p.baseSize.height * 1.5;
                        }

                        const names: Record<string, string> = {
                            'shield': 'Kalkan!',
                            'speed': 'Hiz!',
                            'double_jump': 'Cift Ziplama!',
                            'magnet': 'Miknatıs!',
                            'star': 'Yildiz!',
                            'ice_throw': 'Buz Gucu!',
                            'giant': 'Dev Mod!'
                        };
                        addFloatingText(powerUp.position.x, powerUp.position.y - 20, names[powerUp.type] || 'Guc!', '#fbbf24');
                    }
                }
            });

            // Update active power-ups
            for (let i = p.activePowerUps.length - 1; i >= 0; i--) {
                p.activePowerUps[i].timer--;
                if (p.activePowerUps[i].timer <= 0) {
                    // Revert giant size when power-up expires
                    if (p.activePowerUps[i].type === 'giant') {
                        p.size.width = p.baseSize.width;
                        p.size.height = p.baseSize.height;
                        addFloatingText(p.position.x, p.position.y - 40, 'Normal Boy!', '#94a3b8');
                    }
                    p.activePowerUps.splice(i, 1);
                }
            }

            // Ice throw cooldown
            if (p.iceThrowCooldown > 0) p.iceThrowCooldown--;

            // Ice throw ability
            const hasIceThrow = p.activePowerUps.some(pu => pu.type === 'ice_throw');
            if (hasIceThrow && p.iceThrowCooldown <= 0) {
                const isSolo = gameState.current.players.length === 1;
                const fireKey = isSolo ? (inputs.current['e'] || inputs.current['E']) :
                    (p.id === 'cemre' ? (inputs.current['m'] || inputs.current['M']) : (inputs.current['e'] || inputs.current['E']));

                if (fireKey) {
                    const dir = p.facing === 'right' ? 1 : -1;
                    gameState.current.projectiles.push({
                        id: Math.random() * 10000,
                        position: { x: p.position.x + p.size.width / 2, y: p.position.y + p.size.height / 2 },
                        velocity: { x: dir * 8, y: 0 },
                        size: 15,
                        type: 'player_ice',
                        damage: 1,
                        life: 90,
                        fromPlayer: true
                    });
                    p.iceThrowCooldown = 30;
                    soundManager.playJump();
                    addFloatingText(p.position.x, p.position.y - 20, 'Buz!', '#60a5fa');
                }
            }
      
            // Enemy Collision Logic (Updated for Stomp & Hitbox Forgiveness)
            const hitX = p.position.x + 10; // More forgiveness on sides
            const hitW = p.size.width - 20;
            const hitY = p.position.y + 5;
            const hitH = p.size.height - 10;
            
            // Iterate backwards to allow safe removal of enemies
            for (let i = gameState.current.enemies.length - 1; i >= 0; i--) {
                const enemy = gameState.current.enemies[i];
                if (isColliding(
                    {x: hitX, y: hitY, w: hitW, h: hitH},
                    {x: enemy.position.x + 5, y: enemy.position.y + 5, w: enemy.size.width - 10, h: enemy.size.height - 10}
                )) {
                     // Check for Mario-style Stomp
                     // Player must be falling and above the enemy
                     const playerBottom = p.position.y + p.size.height;
                     // Allow some overlap (15px) for the stomp to register
                     const isAbove = playerBottom < enemy.position.y + (enemy.size.height / 2) + 10;
                     const isFalling = p.velocity.y > 0;

                     if (enemy.type === 'boss') {
                         if (isFalling && isAbove) {
                             p.velocity.y = -12;
                             soundManager.playDamage();
                             addFloatingText(enemy.position.x + 50, enemy.position.y - 20, `-1 ❤️`, '#ef4444');

                             const defeated = handleBossHit(enemy, 1, gameState.current, addFloatingText);

                             if (defeated) {
                                 gameState.current.enemiesDefeated++;
                                 gameState.current.score += 200;
                                 gameState.current.enemies.splice(i, 1);
                                 soundManager.playWin();
                                 addFloatingText(enemy.position.x + 50, enemy.position.y, "YENILDI!", "#22c55e");
                                 gameState.current.screenShake = 35;

                                 for (let j = 0; j < 15; j++) {
                                     gameState.current.coins.push({
                                         id: 9000 + j,
                                         position: { x: enemy.position.x + Math.random() * 150, y: enemy.position.y - 100 + Math.random() * 50 },
                                         size: 14,
                                         collected: false,
                                         baseY: enemy.position.y - 100,
                                         type: Math.random() > 0.5 ? 'gold' : 'kanelbulle',
                                         isNectarDrop: true
                                     });
                                 }
                             }
                         } else if (!enemy.isDashing) {
                             handlePlayerDamage(p);
                         }
                     } else {
                         // REGULAR ENEMY
                         if (isFalling && isAbove) {
                             // STOMP SUCCESS
                             p.velocity.y = -8; // Bounce off enemy
                             gameState.current.enemiesDefeated++;
                             soundManager.playCoin();
                             addFloatingText(enemy.position.x, enemy.position.y, "Bam!", "#fff");
                             createDust(enemy.position.x + enemy.size.width/2, enemy.position.y + enemy.size.height/2);
                             // Remove enemy
                             gameState.current.enemies.splice(i, 1);

                             // Slight Bounce scaling
                             p.scale.x = 1.2;
                             p.scale.y = 0.8;
                         } else {
                             // Failed to stomp, take damage
                             handlePlayerDamage(p);
                         }
                     }
                }
            }
      
            gameState.current.checkpoints.forEach(cp => {
                if (!cp.triggered && isColliding(
                    {x: p.position.x, y: p.position.y, w: p.size.width, h: p.size.height},
                    {x: cp.position.x, y: cp.position.y, w: cp.size.width, h: cp.size.height}
                 )) {
                     cp.triggered = true;
                     gameState.current.activeRespawnPoint = { x: cp.position.x + 10, y: cp.position.y + cp.size.height - 50 };
                     soundManager.playCoin();
                     addFloatingText(cp.position.x, cp.position.y - 20, 'Kayıt!', '#22c55e');
                 }
            });
        });

        // --- CAMERA FOLLOW LOGIC ---
        // Calculate average X of all living players to keep them in frame
        const livingForCamera = gameState.current.players.filter(p => !p.isDead);
        if (livingForCamera.length > 0) {
            let totalX = 0;
            livingForCamera.forEach(p => totalX += p.position.x);
            const centerX = totalX / livingForCamera.length;
            
            // Target is Center of players minus offset to keep them on left side of screen (looking ahead)
            const targetCamX = centerX - (CANVAS_WIDTH * 0.35);

            // Smooth Lerp
            gameState.current.camera.x += (targetCamX - gameState.current.camera.x) * 0.1;

            // Clamp Camera based on Level
            let levelWidth = LEVEL_1_WIDTH;
            if (gameState.current.level === 2) levelWidth = LEVEL_2_WIDTH;
            if (gameState.current.level === 3) levelWidth = LEVEL_3_WIDTH;
            if (gameState.current.level === 4) levelWidth = LEVEL_4_WIDTH;

            const maxScroll = levelWidth - CANVAS_WIDTH;

            if (gameState.current.camera.x < 0) gameState.current.camera.x = 0;
            if (gameState.current.camera.x > maxScroll) gameState.current.camera.x = maxScroll;
        }

        // --- CHECK LEVEL COMPLETION ---
        if (livingPlayers.length > 0 && playersInPortal === livingPlayers.length) {
             if (gameState.current.portalHoldTimer === undefined) gameState.current.portalHoldTimer = 0;
             gameState.current.portalHoldTimer++;
             
             // Require holding position for 2 seconds (120 frames) to avoid accidental triggers, or less if solo
             const requiredTime = gameState.current.gameMode === 'solo' ? 30 : 120;
             
             if (gameState.current.portalHoldTimer > requiredTime) {
                 if (gameState.current.level === 1) {
                     // Transition to Level 2
                     gameState.current.status = 'transition';
                     gameState.current.cinematicMode = 'aurora_suction';
                     callbacks.setGameStatus('transition');
                     
                     // After cinematic, load level 2
                     setTimeout(() => {
                         callbacks.loadLevel(2);
                         gameState.current.status = 'playing';
                         callbacks.setGameStatus('playing');
                         callbacks.triggerDialog([
                            {name: 'Cemre', text: 'Vay canına! Burası çok güzel!'},
                            {name: 'Baba', text: 'Kelebek Vadisi... Dikkat et, burası daha sıcak.'}
                         ]);
                     }, 2000);
                 } else if (gameState.current.level === 2) {
                     // Transition to Level 3
                     gameState.current.status = 'transition';
                     gameState.current.cinematicMode = 'aurora_suction';
                     callbacks.setGameStatus('transition');

                     // After cinematic, load level 3
                     setTimeout(() => {
                         callbacks.loadLevel(3);
                         gameState.current.status = 'playing';
                         callbacks.setGameStatus('playing');
                         callbacks.triggerDialog([
                            {name: 'Cemre', text: 'Ooooh! Meyveler!'},
                            {name: 'Baba', text: 'Burası Meyve Cenneti! Hiç canavar yok, sadece eğlence!'},
                            {name: 'Cemre', text: 'Yaşasın! Hepsini toplayalım!'}
                         ]);
                     }, 2000);
                 } else if (gameState.current.level === 3) {
                     // Transition to Level 4 (Boss)
                     gameState.current.status = 'transition';
                     gameState.current.cinematicMode = 'aurora_suction';
                     callbacks.setGameStatus('transition');

                     // After cinematic, load level 4
                     setTimeout(() => {
                         callbacks.loadLevel(4);
                         gameState.current.status = 'playing';
                         callbacks.setGameStatus('playing');
                         callbacks.triggerDialog([
                            {name: 'Baba', text: 'Dikkatli ol! Önümüzde bir şey var...'},
                            {name: 'Cemre', text: 'Ne kadar büyük! Yenmek için işbirliği yapmalıyız!'}
                         ]);
                     }, 2000);
                 } else {
                     // Win Game (End of Level 4)
                     gameState.current.status = 'won';
                     callbacks.setGameStatus('won');
                     soundManager.playWin();
                 }
             }
        } else {
            gameState.current.portalHoldTimer = 0;
        }

    }, [gameState, inputs, particles, effectParticles, callbacks]);

    return { updatePhysics };
};
