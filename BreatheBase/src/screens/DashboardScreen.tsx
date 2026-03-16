import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../theme/theme';
import { useStreak } from '../hooks/useStreak';
import { useUserData } from '../hooks/useUserData';
import { StreakRing } from '../components/StreakRing';
import { XPDisplay } from '../components/XPDisplay';
import { MoneySaved } from '../components/MoneySaved';
import { HealthMilestones } from '../components/HealthMilestones';
import { getHealthMilestones } from '../utils/calculations';

export const DashboardScreen: React.FC = () => {
  const { streakData, moneySaved, dayProgress, quitDate } = useStreak();
  const { userData, getTodayCravingsResisted } = useUserData();
  const [refreshing, setRefreshing] = useState(false);
  const [milestones, setMilestones] = useState(getHealthMilestones(quitDate));

  useEffect(() => {
    setMilestones(getHealthMilestones(quitDate));
  }, [quitDate]);

  const onRefresh = async () => {
    setRefreshing(true);
    setMilestones(getHealthMilestones(quitDate));
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Text style={styles.title}>Unpuff</Text>
        
        <View style={styles.ringContainer}>
          <StreakRing
            days={streakData.days}
            hours={streakData.hours}
            minutes={streakData.minutes}
            progress={dayProgress}
            size={250}
          />
        </View>
        
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <MoneySaved amount={moneySaved} />
          </View>
        </View>
        
        <XPDisplay xp={userData.xp} level={userData.level} />
        
        <View style={styles.cravingsRow}>
          <View style={styles.cravingCard}>
            <Text style={styles.cravingNumber}>{getTodayCravingsResisted()}</Text>
            <Text style={styles.cravingLabel}>Cravings Resisted Today</Text>
          </View>
        </View>
        
        <HealthMilestones milestones={milestones} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: theme.spacing.md,
    paddingBottom: theme.spacing.xxl,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
  },
  ringContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: theme.spacing.md,
  },
  statCard: {
    flex: 1,
    maxWidth: 300,
  },
  cravingsRow: {
    marginBottom: theme.spacing.md,
  },
  cravingCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    alignItems: 'center',
    ...theme.shadows.sm,
  },
  cravingNumber: {
    fontSize: 48,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  cravingLabel: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: 4,
  },
});
