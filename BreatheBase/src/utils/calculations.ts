import { differenceInMinutes, differenceInHours, differenceInDays, parseISO } from 'date-fns';
import { StreakData, HealthMilestone } from '../types';

export const calculateStreak = (quitDate: string): StreakData => {
  const quitTime = parseISO(quitDate);
  const now = new Date();
  
  const totalMinutes = differenceInMinutes(now, quitTime);
  const days = differenceInDays(now, quitTime);
  const hours = differenceInHours(now, quitTime) % 24;
  const minutes = totalMinutes % 60;
  
  return {
    days,
    hours,
    minutes,
    totalMinutes,
  };
};

export const calculateMoneySaved = (quitDate: string, moneyPerDay: number): number => {
  const streakData = calculateStreak(quitDate);
  const daysAsDecimal = streakData.totalMinutes / (24 * 60);
  return Number((daysAsDecimal * moneyPerDay).toFixed(2));
};

export const getDayProgress = (quitDate: string): number => {
  const quitTime = parseISO(quitDate);
  const now = new Date();
  
  const hoursSinceQuit = differenceInHours(now, quitTime) % 24;
  return Math.min(hoursSinceQuit / 24, 1);
};

export const getHealthMilestones = (quitDate: string): HealthMilestone[] => {
  const streakData = calculateStreak(quitDate);
  const totalHours = streakData.days * 24 + streakData.hours;
  
  const milestones: HealthMilestone[] = [
    {
      id: '1',
      title: 'Heart Rate Normal',
      description: 'Your heart rate is returning to normal',
      hoursElapsed: 0,
      achieved: totalHours >= 0.33,
    },
    {
      id: '2',
      title: 'Oxygen Restored',
      description: 'Oxygen levels in your blood are recovering',
      hoursElapsed: 8,
      achieved: totalHours >= 8,
    },
    {
      id: '3',
      title: 'Taste Buds Recovering',
      description: 'Your sense of taste is improving',
      hoursElapsed: 48,
      achieved: totalHours >= 48,
    },
    {
      id: '4',
      title: 'Circulation Improving',
      description: 'Blood circulation is getting better',
      hoursElapsed: 336,
      achieved: totalHours >= 336,
    },
    {
      id: '5',
      title: 'Lung Function Up',
      description: 'Your lung capacity is increasing',
      hoursElapsed: 672,
      achieved: totalHours >= 672,
    },
    {
      id: '6',
      title: 'Heart Risk Halved',
      description: 'Heart disease risk is significantly reduced',
      hoursElapsed: 8760,
      achieved: totalHours >= 8760,
    },
  ];
  
  return milestones;
};

export const getUnlockedMilestones = (quitDate: string): HealthMilestone[] => {
  return getHealthMilestones(quitDate).filter(m => m.achieved);
};

export const getCurrentMilestone = (quitDate: string): HealthMilestone | null => {
  const milestones = getHealthMilestones(quitDate);
  const unlocked = milestones.filter(m => m.achieved);
  return unlocked.length > 0 ? unlocked[unlocked.length - 1] : null;
};
