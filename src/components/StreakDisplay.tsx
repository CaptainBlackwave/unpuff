import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, AppState } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { differenceInMinutes } from 'date-fns';

interface StreakData {
  days: number;
  hours: number;
  minutes: number;
  moneySaved: number;
}

export const useStreakData = (): StreakData => {
  const [streakData, setStreakData] = useState<StreakData>({
    days: 0,
    hours: 0,
    minutes: 0,
    moneySaved: 0,
  });

  const fetchData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('@breathebase_user_data');
      if (jsonValue !== null) {
        const userData = JSON.parse(jsonValue);
        const quitDate = new Date(userData.quitDate);
        const now = new Date();
        const totalMinutes = differenceInMinutes(now, quitDate);
        const days = Math.floor(totalMinutes / (24 * 60));
        const hours = Math.floor((totalMinutes % (24 * 60)) / 60);
        const minutes = totalMinutes % 60;
        const moneySaved = (totalMinutes / (24 * 60)) * userData.moneySavedPerDay;
        
        setStreakData({ days, hours, minutes, moneySaved });
      }
    } catch (error) {
      console.error('Error fetching streak data:', error);
    }
  };

  useEffect(() => {
    fetchData();
    
    const interval = setInterval(fetchData, 60000);
    
    const subscription = AppState.addEventListener('change', () => {
      fetchData();
    });
    
    return () => {
      clearInterval(interval);
      subscription.remove();
    };
  }, []);

  return streakData;
};

interface StreakDisplayProps {
  compact?: boolean;
}

export const StreakDisplay: React.FC<StreakDisplayProps> = ({ compact = false }) => {
  const { days, hours, moneySaved } = useStreakData();

  if (compact) {
    return (
      <View style={styles.compactContainer}>
        <Text style={styles.compactNumber}>{days}</Text>
        <Text style={styles.compactLabel}>days</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.streakContainer}>
        <Text style={styles.streakNumber}>{days}</Text>
        <Text style={styles.streakLabel}>days</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>{hours}h smoke-free</Text>
        <Text style={styles.moneyText}>${moneySaved.toFixed(2)} saved</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#2D7DD2',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  compactContainer: {
    backgroundColor: '#2D7DD2',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignItems: 'center',
  },
  streakContainer: {
    alignItems: 'center',
  },
  streakNumber: {
    fontSize: 48,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  compactNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  streakLabel: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  compactLabel: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.8)',
    textTransform: 'uppercase',
  },
  infoContainer: {
    marginTop: 8,
    alignItems: 'center',
  },
  infoText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  moneyText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F7B538',
  },
});
