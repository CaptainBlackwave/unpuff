export interface CravingEvent {
  id: string;
  timestamp: string;
  tipUsed: string;
  category: TipCategory;
  trigger?: TriggerType;
  resisted: boolean;
}

export type TipCategory = 'Physical' | 'Mental' | 'Emergency';

export type TriggerType = 
  | 'Morning Coffee'
  | 'Driving'
  | 'Work Stress'
  | 'Social'
  | 'Alcohol'
  | 'After Meal'
  | 'Boredom'
  | 'Phone Break'
  | 'Evening Relax'
  | 'Other';

export const TRIGGERS: { type: TriggerType; emoji: string }[] = [
  { type: 'Morning Coffee', emoji: '☕' },
  { type: 'Driving', emoji: '🚗' },
  { type: 'Work Stress', emoji: '💼' },
  { type: 'Social', emoji: '🍺' },
  { type: 'Alcohol', emoji: '🍷' },
  { type: 'After Meal', emoji: '🍽️' },
  { type: 'Boredom', emoji: '😴' },
  { type: 'Phone Break', emoji: '📱' },
  { type: 'Evening Relax', emoji: '🌙' },
  { type: 'Other', emoji: '❓' },
];

export interface TriggerStats {
  trigger: TriggerType;
  count: number;
  hourOfDay: number;
}

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
