import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { UserData, Tip, TipCategory, TriggerType, TriggerStats } from '../types';
import { 
  getUserData, 
  saveUserData, 
  updateQuitDate, 
  updateMoneySavedPerDay, 
  addXP, 
  recordCravingResisted,
  resetProgress,
  getTriggerStats,
  getHeatMapData,
  getPeakCravingHours,
  DEFAULT_USER_DATA
} from '../utils/storage';
import tipsData from '../data/tips.json';

interface UserDataContextType {
  userData: UserData;
  isLoading: boolean;
  updateDate: (newDate: string) => Promise<void>;
  updateCost: (cost: number) => Promise<void>;
  addExperience: (amount: number) => Promise<{ newXP: number; leveledUp: boolean }>;
  logCraving: (tip: Tip, trigger?: TriggerType) => Promise<void>;
  reset: () => Promise<void>;
  refresh: () => Promise<void>;
  getRandomTip: (category?: string) => Tip;
  getTriggerTip: (trigger: TriggerType) => string;
  getMorningWisdom: () => string;
  getValidation: () => string;
  getHype: (days: number, money: number) => string;
  getTodayCravingsResisted: () => number;
  getTriggerStats: () => Promise<TriggerStats[]>;
  getHeatMapData: () => Promise<number[]>;
  getPeakCravingHours: () => Promise<number[]>;
}

const UserDataContext = createContext<UserDataContextType | undefined>(undefined);

export const UserDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
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

  const logCraving = useCallback(async (tip: Tip, trigger?: TriggerType) => {
    await recordCravingResisted(tip.title, tip.category, trigger);
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

  const getTriggerTip = useCallback((trigger: TriggerType): string => {
    const triggerTips = tipsData.triggerTips as Record<string, string[]>;
    const tips = triggerTips[trigger] || triggerTips['Other'] || [];
    if (tips.length === 0) return getRandomTip().content;
    return tips[Math.floor(Math.random() * tips.length)];
  }, [getRandomTip]);

  const getMorningWisdom = useCallback((): string => {
    const wisdom = tipsData.morningWisdom as string[];
    return wisdom[Math.floor(Math.random() * wisdom.length)];
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

  return (
    <UserDataContext.Provider
      value={{
        userData,
        isLoading,
        updateDate,
        updateCost,
        addExperience,
        logCraving,
        reset,
        refresh: loadUserData,
        getRandomTip,
        getTriggerTip,
        getMorningWisdom,
        getValidation,
        getHype,
        getTodayCravingsResisted,
        getTriggerStats,
        getHeatMapData,
        getPeakCravingHours,
      }}
    >
      {children}
    </UserDataContext.Provider>
  );
};

export const useUserData = (): UserDataContextType => {
  const context = useContext(UserDataContext);
  if (!context) {
    return {
      userData: DEFAULT_USER_DATA,
      isLoading: true,
      updateDate: async () => {},
      updateCost: async () => {},
      addExperience: async () => ({ newXP: 0, leveledUp: false }),
      logCraving: async () => {},
      reset: async () => {},
      refresh: async () => {},
      getRandomTip: () => ({ id: '', category: 'Physical', title: '', content: '' }),
      getTriggerTip: () => '',
      getMorningWisdom: () => '',
      getValidation: () => '',
      getHype: () => '',
      getTodayCravingsResisted: () => 0,
      getTriggerStats: async () => [],
      getHeatMapData: async () => [],
      getPeakCravingHours: async () => [],
    };
  }
  return context;
};
