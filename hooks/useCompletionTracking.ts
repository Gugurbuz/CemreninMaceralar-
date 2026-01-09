import { useState, useCallback, useEffect } from 'react';
import { GameState } from '../types';

export interface CompletionData {
  level: number;
  totalCoins: number;
  collectedCoins: number;
  totalEnemies: number;
  defeatedEnemies: number;
  percentage: number;
  isPerfect: boolean;
}

const LEVEL_COIN_COUNTS = {
  1: 17, // Winter level
  2: 16, // Butterfly valley
  3: 85, // Fruit paradise
  4: 15, // Boss level
};

const LEVEL_ENEMY_COUNTS = {
  1: 12,
  2: 6,
  3: 0,
  4: 1, // Boss
};

export const useCompletionTracking = () => {
  const [completionData, setCompletionData] = useState<Record<number, CompletionData>>({});

  const calculateCompletion = useCallback((gameState: GameState): CompletionData => {
    const level = gameState.level;
    const totalCoins = LEVEL_COIN_COUNTS[level as keyof typeof LEVEL_COIN_COUNTS] || 0;
    const totalEnemies = LEVEL_ENEMY_COUNTS[level as keyof typeof LEVEL_ENEMY_COUNTS] || 0;

    const collectedCoins = gameState.coins.filter(c => c.collected && !c.isNectarDrop).length;
    const defeatedEnemies = totalEnemies - gameState.enemies.filter(e => e.type !== 'boss').length;

    const coinPercentage = totalCoins > 0 ? (collectedCoins / totalCoins) * 50 : 50;
    const enemyPercentage = totalEnemies > 0 ? (defeatedEnemies / totalEnemies) * 50 : 50;
    const percentage = Math.round(coinPercentage + enemyPercentage);

    const isPerfect = percentage === 100;

    return {
      level,
      totalCoins,
      collectedCoins,
      totalEnemies,
      defeatedEnemies,
      percentage,
      isPerfect,
    };
  }, []);

  const updateCompletion = useCallback((gameState: GameState) => {
    const data = calculateCompletion(gameState);
    setCompletionData(prev => ({
      ...prev,
      [data.level]: data,
    }));
  }, [calculateCompletion]);

  const getTotalCompletion = useCallback((): number => {
    const levels = Object.keys(completionData).length;
    if (levels === 0) return 0;

    const totalPercentage = Object.values(completionData).reduce(
      (sum, data) => sum + data.percentage,
      0
    );

    return Math.round(totalPercentage / 4); // 4 levels total
  }, [completionData]);

  const isPerfectRun = useCallback((): boolean => {
    if (Object.keys(completionData).length !== 4) return false;
    return Object.values(completionData).every(data => data.isPerfect);
  }, [completionData]);

  const reset = useCallback(() => {
    setCompletionData({});
  }, []);

  return {
    completionData,
    updateCompletion,
    getTotalCompletion,
    isPerfectRun,
    reset,
  };
};
