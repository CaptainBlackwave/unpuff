import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserData, CravingEvent } from '../types';

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

export const recordCravingResisted = async (tipUsed: string, category: string): Promise<void> => {
  const userData = await getUserData();
  
  const craving: CravingEvent = {
    id: Date.now().toString(),
    timestamp: new Date().toISOString(),
    tipUsed,
    category: category as any,
    resisted: true,
  };
  
  userData.cravingsHistory.push(craving);
  userData.totalCravingsResisted += 1;
  await saveUserData(userData);
};

export const resetProgress = async (): Promise<void> => {
  await saveUserData(DEFAULT_USER_DATA);
};

export { DEFAULT_USER_DATA };
