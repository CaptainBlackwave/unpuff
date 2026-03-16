import { useState, useEffect, useCallback } from 'react';
import { UserData, Tip, CravingEvent, TipCategory } from '../types';
import { 
  getUserData, 
  saveUserData, 
  updateQuitDate, 
  updateMoneySavedPerDay, 
  addXP, 
  recordCravingResisted,
  resetProgress,
  DEFAULT_USER_DATA
} from '../utils/storage';
import tipsData from '../data/tips.json';

export const useUserData = () => {
  const [userData, setUserData] = useState<UserData>(DEFAULT_USER_DATA);
  const [isLoading, setIsLoading] = useState(true);

  const loadUserData = useCallback(async () => {
    setIsLoading(true);
    const data = await getUserData();
    setUserData(data);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  const updateDate = useCallback(async (newDate: string) => {
    await updateQuitDate(newDate);
    await loadUserData();
  }, [loadUserData]);

  const updateCost = useCallback(async (cost: number) => {
    await updateMoneySavedPerDay(cost);
    await loadUserData();
  }, [loadUserData]);

  const addExperience = useCallback(async (amount: number) => {
    const result = await addXP(amount);
    await loadUserData();
    return result;
  }, [loadUserData]);

  const logCraving = useCallback(async (tip: Tip) => {
    await recordCravingResisted(tip.title, tip.category);
    await loadUserData();
  }, [loadUserData]);

  const reset = useCallback(async () => {
    await resetProgress();
    await loadUserData();
  }, [loadUserData]);

  const getRandomTip = useCallback((category?: string): Tip => {
    let tips: Tip[] = tipsData.tips.map(t => ({
      ...t,
      category: t.category as TipCategory,
    }));
    
    if (category) {
      tips = tips.filter(t => t.category === category);
    }
    
    const randomIndex = Math.floor(Math.random() * tips.length);
    return tips[randomIndex];
  }, []);

  const getValidation = useCallback((): string => {
    const validations = tipsData.validation as string[];
    const randomIndex = Math.floor(Math.random() * validations.length);
    return validations[randomIndex];
  }, []);

  const getHype = useCallback((days: number, money: number): string => {
    const hypes = tipsData.hype as string[];
    let hype = hypes[Math.floor(Math.random() * hypes.length)];
    
    hype = hype.replace('{days}', days.toString());
    hype = hype.replace('${money}', money.toFixed(2));
    
    return hype;
  }, []);

  const getTodayCravingsResisted = useCallback((): number => {
    const today = new Date().toDateString();
    return userData.cravingsHistory.filter(
      c => new Date(c.timestamp).toDateString() === today && c.resisted
    ).length;
  }, [userData.cravingsHistory]);

  return {
    userData,
    isLoading,
    updateDate,
    updateCost,
    addExperience,
    logCraving,
    reset,
    refresh: loadUserData,
    getRandomTip,
    getValidation,
    getHype,
    getTodayCravingsResisted,
  };
};
