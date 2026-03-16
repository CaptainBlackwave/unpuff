import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserData, CravingEvent, TriggerType, TriggerStats } from '../types';

const STORAGE_KEYS = {
  USER_DATA: '@breathebase_user_data',
};

const DEFAULT_USER_DATA: UserData = {
  quitDate: new Date().toISOString(),
  moneySavedPerDay: 8,
  totalCravingsResisted: 0,
  xp: 0,
  level: 1,
  cravingsHistory: [],
};

export const getUserData = async (): Promise<UserData> => {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
    if (jsonValue !== null) {
      return JSON.parse(jsonValue) as UserData;
    }
    await saveUserData(DEFAULT_USER_DATA);
    return DEFAULT_USER_DATA;
  } catch (error) {
    console.error('Error reading user data:', error);
    return DEFAULT_USER_DATA;
  }
};

export const saveUserData = async (data: UserData): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(data);
    await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, jsonValue);
  } catch (error) {
    console.error('Error saving user data:', error);
  }
};

export const updateQuitDate = async (newDate: string): Promise<void> => {
  const userData = await getUserData();
  userData.quitDate = newDate;
  await saveUserData(userData);
};

export const updateMoneySavedPerDay = async (amount: number): Promise<void> => {
  const userData = await getUserData();
  userData.moneySavedPerDay = amount;
  await saveUserData(userData);
};

export const addXP = async (amount: number): Promise<{ newXP: number; leveledUp: boolean }> => {
  const userData = await getUserData();
  const newXP = userData.xp + amount;
  const xpPerLevel = 500;
  const newLevel = Math.floor(newXP / xpPerLevel) + 1;
  const leveledUp = newLevel > userData.level;
  
  userData.xp = newXP;
  userData.level = newLevel;
  await saveUserData(userData);
  
  return { newXP, leveledUp };
};

export const recordCravingResisted = async (
  tipUsed: string, 
  category: string,
  trigger?: TriggerType
): Promise<void> => {
  const userData = await getUserData();
  
  const craving: CravingEvent = {
    id: Date.now().toString(),
    timestamp: new Date().toISOString(),
    tipUsed,
    category: category as any,
    trigger,
    resisted: true,
  };
  
  userData.cravingsHistory.push(craving);
  userData.totalCravingsResisted += 1;
  await saveUserData(userData);
};

export const getTriggerStats = async (): Promise<TriggerStats[]> => {
  const userData = await getUserData();
  const triggerCounts: Record<string, { count: number; hours: number[] }> = {};
  
  userData.cravingsHistory.forEach((craving) => {
    const hour = new Date(craving.timestamp).getHours();
    const trigger = craving.trigger || 'Other';
    
    if (!triggerCounts[trigger]) {
      triggerCounts[trigger] = { count: 0, hours: [] };
    }
    triggerCounts[trigger].count += 1;
    triggerCounts[trigger].hours.push(hour);
  });
  
  const stats: TriggerStats[] = Object.entries(triggerCounts).map(([trigger, data]) => {
    const avgHour = data.hours.reduce((a, b) => a + b, 0) / data.hours.length;
    return {
      trigger: trigger as TriggerType,
      count: data.count,
      hourOfDay: Math.round(avgHour),
    };
  });
  
  return stats.sort((a, b) => b.count - a.count);
};

export const getHeatMapData = async (): Promise<number[]> => {
  const userData = await getUserData();
  const hourCounts = new Array(24).fill(0);
  
  userData.cravingsHistory.forEach((craving) => {
    const hour = new Date(craving.timestamp).getHours();
    hourCounts[hour] += 1;
  });
  
  return hourCounts;
};

export const getPeakCravingHours = async (): Promise<number[]> => {
  const heatMapData = await getHeatMapData();
  const maxCount = Math.max(...heatMapData);
  if (maxCount === 0) return [];
  
  return heatMapData
    .map((count, hour) => ({ hour, count }))
    .filter(item => item.count >= maxCount * 0.5)
    .map(item => item.hour);
};

export const resetProgress = async (): Promise<void> => {
  await saveUserData(DEFAULT_USER_DATA);
};

export { DEFAULT_USER_DATA };
