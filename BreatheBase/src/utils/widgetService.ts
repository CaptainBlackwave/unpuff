import React, { useEffect } from 'react';
import { useUserData } from '../hooks/useUserData';
import { differenceInMinutes } from 'date-fns';

export interface WidgetService {
  updateWidget: () => Promise<void>;
}

export const useWidgetService = (): WidgetService => {
  const { userData } = useUserData();

  const updateWidget = async () => {
    console.log('Widget update triggered');
  };

  useEffect(() => {
    if (userData) {
      updateWidget();
    }
  }, [userData]);

  return { updateWidget };
};

export const getStreakForWidget = () => {
  return {
    days: 0,
    hours: 0,
    minutes: 0,
    moneySaved: 0,
  };
};
