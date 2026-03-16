import { useState, useEffect, useCallback } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { calculateStreak, calculateMoneySaved, getDayProgress } from '../utils/calculations';
import { getUserData } from '../utils/storage';
import { StreakData } from '../types';

const UPDATE_INTERVAL = 60000;

export const useStreak = () => {
  const [streakData, setStreakData] = useState<StreakData>({
    days: 0,
    hours: 0,
    minutes: 0,
    totalMinutes: 0,
  });
  const [moneySaved, setMoneySaved] = useState(0);
  const [dayProgress, setDayProgress] = useState(0);
  const [quitDate, setQuitDate] = useState<string>(new Date().toISOString());
  const [moneyPerDay, setMoneyPerDay] = useState(8);

  const updateStreak = useCallback(async () => {
    const userData = await getUserData();
    setQuitDate(userData.quitDate);
    setMoneyPerDay(userData.moneySavedPerDay);
    
    const streak = calculateStreak(userData.quitDate);
    setStreakData(streak);
    
    const money = calculateMoneySaved(userData.quitDate, userData.moneySavedPerDay);
    setMoneySaved(money);
    
    const progress = getDayProgress(userData.quitDate);
    setDayProgress(progress);
  }, []);

  useEffect(() => {
    updateStreak();
    
    const interval = setInterval(updateStreak, UPDATE_INTERVAL);
    
    return () => clearInterval(interval);
  }, [updateStreak]);

  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active') {
        updateStreak();
      }
    };
    
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    
    return () => {
      subscription.remove();
    };
  }, [updateStreak]);

  return {
    streakData,
    moneySaved,
    dayProgress,
    quitDate,
    moneyPerDay,
    refreshStreak: updateStreak,
  };
};
