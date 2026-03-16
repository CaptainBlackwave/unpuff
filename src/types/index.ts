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
  lapses: number;
  lapseDates: string[];
  motivationImageUri: string | null;
  personalMantra: string | null;
  sharedMilestones: number[];
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

export interface CircleData {
  partnerId?: string;
  partnerName?: string;
  linkedAt?: string;
  lastPartnerSOS?: string;
}

export interface SharedMilestone {
  id: string;
  title: string;
  description: string;
  requirement: number;
  type: 'combinedDays' | 'combinedMoney' | 'combinedCravings';
  achieved: boolean;
}

export const SHARED_MILESTONES: SharedMilestone[] = [
  { id: '1', title: 'First Steps', description: '7 days combined', requirement: 7, type: 'combinedDays', achieved: false },
  { id: '2', title: 'Team Spirit', description: '30 days combined', requirement: 30, type: 'combinedDays', achieved: false },
  { id: '3', title: 'Power Couple', description: '100 days combined', requirement: 100, type: 'combinedDays', achieved: false },
  { id: '4', title: 'Savings Boost', description: '$500 combined saved', requirement: 500, type: 'combinedMoney', achieved: false },
  { id: '5', title: 'Money Masters', description: '$1,000 combined saved', requirement: 1000, type: 'combinedMoney', achieved: false },
  { id: '6', title: 'Unstoppable', description: '50 cravings resisted together', requirement: 50, type: 'combinedCravings', achieved: false },
];
