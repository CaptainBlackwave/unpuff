export interface CravingEvent {
  id: string;
  timestamp: string;
  tipUsed: string;
  category: TipCategory;
  resisted: boolean;
}

export type TipCategory = 'Physical' | 'Mental' | 'Emergency';

export interface Tip {
  id: string;
  category: TipCategory;
  title: string;
  content: string;
}

export interface UserData {
  quitDate: string;
  moneySavedPerDay: number;
  totalCravingsResisted: number;
  xp: number;
  level: number;
  cravingsHistory: CravingEvent[];
}

export interface StreakData {
  days: number;
  hours: number;
  minutes: number;
  totalMinutes: number;
}

export interface HealthMilestone {
  id: string;
  title: string;
  description: string;
  hoursElapsed: number;
  achieved: boolean;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  requirement: number;
  type: 'days' | 'money' | 'cravings';
}
